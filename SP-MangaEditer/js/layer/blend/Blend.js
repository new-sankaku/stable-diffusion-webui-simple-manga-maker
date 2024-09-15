const allBlendModes = ['normal', 'add', 'screen', 'darken', 'lighten', 'color-dodge', 'color-burn', 'linear-burn', 'linear-dodge', 'linear-light', 'hard-light', 'soft-light', 'pin-light', 'difference', 'exclusion', 'overlay', 'saturation', 'color', 'luminosity', 'add-npm', 'subtract', 'divide', 'vivid-light', 'hard-mix', 'negation'];

const layerDisplaySize = 300;
const blendDisplaySize = 450;


function createFloatingWindow() {
  const floatingWindow = document.createElement("div");
  floatingWindow.id = "blendFloatingWindow";

  const header = document.createElement("div");
  header.id = "blendFloatingWindowHeader";
  header.textContent = getText("blendResult");

  const controls = document.createElement("div");
  controls.id = "blendControls";

  const reblendButton = document.createElement("button");
  reblendButton.id = "reblendButton";
  reblendButton.textContent = getText("reblend");
  reblendButton.onclick = handleReblend;

  const closeButton = document.createElement("button");
  closeButton.id = "closeButton";
  closeButton.textContent = "Close";
  closeButton.onclick = handleClose;

  controls.appendChild(reblendButton);
  controls.appendChild(closeButton);

  const sourceImages = document.createElement("div");
  sourceImages.id = "sourceImages";

  const blendModes = document.createElement("div");
  blendModes.id = "blendModes";

  floatingWindow.appendChild(header);
  floatingWindow.appendChild(controls);
  floatingWindow.appendChild(sourceImages);
  floatingWindow.appendChild(blendModes);

  document.body.appendChild(floatingWindow);

  setupInteractJS(floatingWindow);
}

function recreateFloatingWindow() {
  const existingWindow = document.getElementById("blendFloatingWindow");
  if (existingWindow) {
    existingWindow.remove();
  }
  createFloatingWindow();
}


function setupInteractJS(element) {
  interact(element)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`,
          });

          Object.assign(event.target.dataset, { x, y });
        },
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: "parent",
          endOnly: true,
        }),
        interact.modifiers.restrictSize({
          min: { width: 100, height: 100 },
        }),
      ],
      inertia: true,
    });
}

async function blendCanvasesWithPixi(canvases, blendMode) {
  const maxWidth = Math.max(...canvases.map((c) => c.width));
  const maxHeight = Math.max(...canvases.map((c) => c.height));
  const app = new PIXI.Application();
  await app.init({
    width: maxWidth,
    height: maxHeight,
    antialias: true,
    backgroundColor: "transparent",
    backgroundAlpha: 0,
    useBackBuffer: true,
    clearBeforeRender: false,
    preserveDrawingBuffer: true,
  });
  canvases.forEach((canvas, index) => {
    const texture = PIXI.Texture.from(canvas);
    const sprite = new PIXI.Sprite({
      texture,
      blendMode: index === 0 ? "normal" : blendMode,
    });
    app.stage.addChild(sprite);
  });
  app.render();
  const blendedCanvas = document.createElement("canvas");
  blendedCanvas.width = maxWidth;
  blendedCanvas.height = maxHeight;
  blendedCanvas.getContext("2d").drawImage(app.canvas, 0, 0);
  app.destroy();
  return blendedCanvas;
}

async function updateBlendModes(imageLayerList) {
  const blendModesContainer = $("blendModes");
  blendModesContainer.innerHTML = "";

  // console.log("imageLayerList",imageLayerList);
  const checkedLayers = imageLayerList.filter((layer) => layer.layerCheck);
  if (checkedLayers.length < 2) return;
  const canvases = checkedLayers.map((layer) =>
    createCanvasFromFabricImage(layer)
  );

  for (let i = 0; i < allBlendModes.length; i++) {
    const blendedCanvas = await blendCanvasesWithPixi(
      canvases,
      allBlendModes[i]
    );
    const container = document.createElement("div");
    container.className = "blend-mode-container";
    const displayCanvas = createScaledCanvas(
      blendedCanvas,
      blendDisplaySize,
      blendDisplaySize
    );
    displayCanvas.onclick = () => showEnlargedImage(blendedCanvas.toDataURL());
    container.appendChild(displayCanvas);
    const label = document.createElement("div");

    label.textContent = getText(allBlendModes[i]);

    container.appendChild(label);
    const submitButton = document.createElement("button");
    submitButton.textContent = getText("submit");
    submitButton.className = "submit-blend";
    submitButton.onclick = () => handleSubmit(blendedCanvas);
    container.appendChild(submitButton);
    blendModesContainer.appendChild(container);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

function createScaledCanvas(sourceCanvas, maxWidth, maxHeight) {
  const scale = Math.min(
    1,
    maxWidth / sourceCanvas.width,
    maxHeight / sourceCanvas.height
  );
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = sourceCanvas.width * scale;
  scaledCanvas.height = sourceCanvas.height * scale;

  const ctx = scaledCanvas.getContext("2d");
  ctx.drawImage(sourceCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
  return scaledCanvas;
}

function updateLayerPreviewStyle(layer, previewCanvas) {
  if (layer.layerCheck) {
    previewCanvas.classList.remove("unchecked");
  } else {
    previewCanvas.classList.add("unchecked");
  }
}

function addImagePreviewsToFloatingWindow(imageLayerList) {
  const sourceImagesContainer = $("sourceImages");
  sourceImagesContainer.innerHTML = "";

  var first = true;
  imageLayerList.forEach((layer, index) => {
    const previewContainer = document.createElement("div");
    previewContainer.className = "layer-preview-blend";
    const previewCanvas = createCanvasFromFabricImage(layer);
    const scaledPreviewCanvas = createScaledCanvas(
      previewCanvas,
      layerDisplaySize,
      layerDisplaySize
    );
    scaledPreviewCanvas.onclick = () => toggleFloatingLayerCheck(layer, index, scaledPreviewCanvas);
    previewContainer.appendChild(scaledPreviewCanvas);
    const label = document.createElement("div");
    if (first) {
      label.textContent = `Lower Layer ${index + 1}`;
      first = false;
    } else {
      label.textContent = `Layer ${index + 1}`;
    }

    previewContainer.appendChild(label);
    sourceImagesContainer.appendChild(previewContainer);
    updateLayerPreviewStyle(layer, scaledPreviewCanvas);
  });
}

function toggleFloatingLayerCheck(layer, index, previewCanvas) {
  layer.layerCheck = !layer.layerCheck;
  updateLayerPreviewStyle(layer, previewCanvas);
  updateLayerPreviewStyle(
    layer,
    $("layerPreviewsBlend").children[index].querySelector("canvas")
  );
  layer.visible = layer.layerCheck;
  canvas.renderAll();
}

var imageLayerListTemp = null;

async function handleBlend() {
  var imageLayerList = getImageObjectListByLayerChecked();
  if( imageLayerList.length < 2 ){
    var blendLowImages = getText("blendLowImages");
    createToastError("Blend error", blendLowImages);
    return;
  }

  imageLayerListTemp = imageLayerList;

  console.log("handleBlend start", imageLayerList.length);
  addImagePreviewsToFloatingWindow(imageLayerList);
  $("blendFloatingWindow").style.display = "block";

  await updateBlendModes(imageLayerList);
}

async function handleReblend() {
  await updateBlendModes(imageLayerListTemp);
}


function handleSubmit(blendedCanvas, quality = 0.98) {
  sendHtmlCanvas2FabricCanvas(blendedCanvas);
  document.getElementById("blendFloatingWindow").style.display = "none";
}



function handleClose() {
  $("blendFloatingWindow").style.display = "none";
}

createFloatingWindow();



let brendContainer, brendImg;

function initializeBrendImageViewer() {
    brendContainer = document.createElement('div');
    brendContainer.id = 'enlargedImageContainer';
    brendContainer.style.display = 'none';

    brendImg = document.createElement('img');
    brendImg.id = 'enlargedImage';

    brendContainer.appendChild(brendImg);
    document.body.appendChild(brendContainer);

    brendContainer.addEventListener('click', hideEnlargedImage);
}

function showEnlargedImage(src) {
    brendImg.src = src;
    brendContainer.style.display = "block";
}

function hideEnlargedImage() {
    brendContainer.style.display = 'none';
}

// ページ読み込み時に一度だけ初期化
document.addEventListener('DOMContentLoaded', initializeBrendImageViewer);