
canvas.on("selection:created", handleSelection);
canvas.on("selection:updated", handleSelection);

document.getElementById("canvas-container").addEventListener(
  "dragover",
  function (e) {
    e.preventDefault();
  },
  false
);

function handleSelection(e) {
  var selectedObject = e.target;
  var layers = canvas.getObjects();
  var activeIndex = layers.indexOf(selectedObject);
  highlightActiveLayer(activeIndex);
  updateControls(selectedObject);
}

document.getElementById("canvas-container").addEventListener(
  "drop",
  function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var canvasElement = canvas.getElement();
    var rect = canvasElement.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var reader = new FileReader();
    reader.onload = function (f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function (img) {
        var canvasWidth = canvasElement.width;
        var canvasHeight = canvasElement.height;
        
        putImageInFrame(img, x, y);

      });
    };

    reader.readAsDataURL(file);
  },
  false
);

function putImageInFrame(img, x, y) {

  isUndoRedoOperation = true;

  img.set({
    left: x,
    top: y,
  });
  canvas.add(img);
  canvas.setActiveObject(img);

  var targetFrameIndex = findTargetFrame(x, y);
  if (targetFrameIndex !== -1) {
    var targetFrame = canvas.item(targetFrameIndex);
    var frameCenterX = targetFrame.left + (targetFrame.width * targetFrame.scaleX) / 2;
    var frameCenterY = targetFrame.top + (targetFrame.height * targetFrame.scaleY) / 2;
    var scaleToFitX = (targetFrame.width * targetFrame.scaleX) / img.width;
    var scaleToFitY = (targetFrame.height * targetFrame.scaleY) / img.height;
    var scaleToFit = Math.max(scaleToFitX, scaleToFitY);

    var clipPath;
    if (targetFrame.type === "polygon") {

      clipPath = new fabric.Polygon(targetFrame.points);
      clipPath.set({
        left: targetFrame.left + targetFrame.strokeWidth - (0.45*targetFrame.scaleX),
        top : targetFrame.top + targetFrame.strokeWidth - (0.45*targetFrame.scaleY),
        wight: targetFrame.wight - targetFrame.strokeWidth - (0.45*targetFrame.scaleX),
        height: targetFrame.height,
        scaleX: targetFrame.scaleX - ( targetFrame.strokeWidth / targetFrame.width ),
        scaleY: targetFrame.scaleY - ( targetFrame.strokeWidth / targetFrame.height ),
        absolutePositioned: true,
      });
      //console.log("clipPath", clipPath);
    } else {
      clipPath = new fabric.Path(targetFrame.path);
      clipPath.set({
        left: targetFrame.left + (targetFrame.strokeWidth),
        top: targetFrame.top + (targetFrame.strokeWidth),
        scaleX: targetFrame.scaleX - ( (targetFrame.strokeWidth) / targetFrame.width  ),
        scaleY: targetFrame.scaleY - ( (targetFrame.strokeWidth) / targetFrame.height  ),
        absolutePositioned: true,
      });
    }
    img.set({
      left: frameCenterX - (img.width * scaleToFit) / 2,
      top: frameCenterY - (img.height * scaleToFit) / 2,
      scaleX: scaleToFit * 1.05,
      scaleY: scaleToFit * 1.05,
    });

    img.clipPath = clipPath;
  } else {
    var scaleToCanvasWidth = 300 / img.width;
    var scaleToCanvasHeight = 300 / img.height;
    var scaleToCanvas = Math.min(scaleToCanvasWidth, scaleToCanvasHeight);

    img.set({
      left: 50,
      top: 50,
      scaleX: scaleToCanvas,
      scaleY: scaleToCanvas,
    });
  }
  canvas.renderAll();
  updateLayerPanel();

  isUndoRedoOperation = false;
  saveStateByManual();

}


function findTargetFrame(x, y) {

  //console.log( "findTargetFrame:x y, ", x, " ", y );

  let objects = canvas.getObjects().reverse();
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].type === "path" || objects[i].type === "rect" || objects[i].type === "polygon") {
      // console.log("findTargetFrame(x, y)", findTargetFrame);
      let frameBounds = objects[i].getBoundingRect(true);
      if (
        x >= frameBounds.left &&
        x <= frameBounds.left + frameBounds.width &&
        y >= frameBounds.top &&
        y <= frameBounds.top + frameBounds.height
      ) {
        return canvas.getObjects().length - 1 - i;
      }
    }
  }
  //console.log("findTargetFrame(x, y) NO HIT.");
  return -1;
}

function isWithin(image, frame) {
  let frameBounds = frame.getBoundingRect(true);
  let imageBounds = image.getBoundingRect(true);

  let within =
    imageBounds.left >= frameBounds.left &&
    imageBounds.top >= frameBounds.top &&
    imageBounds.left + imageBounds.width * image.scaleX <=
      frameBounds.left + frameBounds.width &&
    imageBounds.top + imageBounds.height * image.scaleY <=
      frameBounds.top + frameBounds.height;
  return within;
}

function adjustImageToFitFrame(image, frame) {
  let frameBounds = frame.getBoundingRect();
  let scale = Math.min(
    frameBounds.width / image.getScaledWidth(),
    frameBounds.height / image.getScaledHeight()
  );
  image.set({
    left: frameBounds.left + (frameBounds.width - image.width * scale) / 2,
    top: frameBounds.top + (frameBounds.height - image.height * scale) / 2,
    scaleX: scale,
    scaleY: scale,
  });
}
