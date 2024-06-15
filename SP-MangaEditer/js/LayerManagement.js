function updateLayerPanel() {
  var layers = canvas.getObjects();
  var layerContent = document.getElementById("layer-content");
  layerContent.innerHTML = "";

  layers.slice().reverse().forEach(function (layer, index) {
    if (!layer.excludeFromLayerPanel) {
      var layerDiv = document.createElement("div");
      var previewDiv = document.createElement("div");
      var detailsDiv = document.createElement("div");
      var nameTextArea = document.createElement("input");
      var buttonsDiv = document.createElement("div");
      var deleteButton = document.createElement("button");

      layerDiv.className = "layer-item";
      previewDiv.className = "layer-preview";
      detailsDiv.className = "layer-details";
      nameTextArea.className = "layer-name";
      buttonsDiv.className = "layer-buttons";
      
      if (isLayerPreview(layer)) {
        putPreviewImage(layer, previewDiv);
      
      } else if (isHorizontalText(layer)) {
        var fullText = layer.text;
        nameTextArea.value = fullText.substring(0, 20);
      
      } else if (isVerticalText(layer)) {
        var fullText = layer.getObjects().map(obj => obj.text).join('');
        nameTextArea.value = fullText.substring(0, 15);
      }

      nameTextArea.value = layer.name || nameTextArea.value || layer.type + `${index + 1}`;
      layer.name = nameTextArea.value;
      nameTextArea.rows = 1; 
      nameTextArea.style.resize = 'none'; 
      nameTextArea.style.width = '100%';  
      nameTextArea.style.boxSizing = 'border-box';  
      nameTextArea.style.border = 'none'; 
      nameTextArea.style.borderBottom = '1px solid #cccccc';
      nameTextArea.style.outline = 'none';

      if (isText(layer)) {
        nameTextArea.style.flex = '1'; 
        nameTextArea.style.marginRight = '5px';
        detailsDiv.style.display = 'flex';
        detailsDiv.style.alignItems = 'center';
      }

      nameTextArea.oninput = function () {
        layer.name = nameTextArea.value;
      };

      deleteButton.textContent = "✕";
      deleteButton.className = "delete-layer-button";
      deleteButton.onclick = function (e) {
        e.stopPropagation();
        removeLayer(layer);
      };

      var currentModeElement = document.body;
      var rootStyles = getComputedStyle(currentModeElement);

      var backgroundColorRoot = rootStyles.getPropertyValue('--background-color-B');
      var borderColorRoot     = rootStyles.getPropertyValue('--boader-color-1px-solid-B');
      var colorRoot           = rootStyles.getPropertyValue('--text-color-B');

      nameTextArea.style.color       = colorRoot.trim();
      nameTextArea.style.borderColor = borderColorRoot.trim();
      nameTextArea.style.background  = backgroundColorRoot.trim();

      detailsDiv.appendChild(nameTextArea);

      if (layer.isPanel) {
        var t2iButton = document.createElement("button");
        t2iButton.innerHTML = '<i class="material-icons">settings</i> T2I';
        t2iButton.onclick = function (e) {
          e.stopPropagation();
          openfloatingWindowItem(layer);
        };
        buttonsDiv.appendChild(t2iButton);

        var runButton = document.createElement("button");
        runButton.id = 'runButton-' + index;
        runButton.innerHTML = '<i class="material-icons">add_photo_alternate</i> Run';
        runButton.onclick = function (e) {
          e.stopPropagation();
          var areaHeader = document.querySelector('#layer-panel .area-header');

          var spinner = createSpinner(index);
          areaHeader.appendChild(spinner);

          sdWebUI_t2IProcessQueue(layer, spinner.id);
          index++;
        };

        buttonsDiv.appendChild(runButton);

        var seedButton = document.createElement("button");
        seedButton.innerHTML = '<i class="material-icons">recycling</i> Seed';
        seedButton.onclick = function (e) {
          e.stopPropagation();
          
          if( layer.tempSeed ){
            layer.text2img_seed = layer.tempSeed;
            createToast("Recycling Seed", layer.text2img_seed);
          }else{
            createToast("Nothing Seed", "");
          }
        };
        buttonsDiv.appendChild(seedButton);
      }

      if (layer.type == 'image') {
        var i2iButton = document.createElement("button");
        i2iButton.innerHTML = '<i class="material-icons">settings</i> I2I';
        i2iButton.onclick = function (e) {
          e.stopPropagation();
          openImage2ImagefloatingWindowItem(layer);
        };
        buttonsDiv.appendChild(i2iButton);

        var runButton = document.createElement("button");
        runButton.id = 'runButton-' + index;
        runButton.innerHTML = '<i class="material-icons">add_photo_alternate</i> Run';
        runButton.onclick = function (e) {
          e.stopPropagation();
          var areaHeader = document.querySelector('#layer-panel .area-header');

          var spinner = createSpinner(index);
          areaHeader.appendChild(spinner);


          sdWebUI_I2IProcessQueue(layer, spinner.id);
          index++;
        };

        var promptButton = document.createElement("button");
        promptButton.innerHTML = '<i class="material-icons">text_snippet</i> Prompt';
        promptButton.onclick = function (e) {
          e.stopPropagation();

          if( layer.tempPrompt ){
            layer.text2img_prompt = layer.tempPrompt;
            createToast("Apply Prompt", layer.text2img_prompt);
          }else{
            createToast("Nothing Prompt", "");
          }

          if( layer.tempNegativePrompt ){
            layer.text2img_negativePrompt = layer.tempNegativePrompt;
            createToast("Apply Negative Prompt", layer.text2img_negativePrompt);
          }else{
            createToast("Nothing Negative Prompt", "");
          }
        };

        var clipButton = document.createElement("button");
        var deepDooruButton = document.createElement("button");
        clipButton.innerHTML = '📎';
        deepDooruButton.innerHTML = '📦';

        clipButton.onclick = function (e) {
          e.stopPropagation();
          var areaHeader = document.querySelector('#layer-panel .area-header');
          var spinner = createSpinnerSuccess(index);
          areaHeader.appendChild(spinner);
          sdWebUI_Interrogate(layer, "clip", spinner.id);
          index++;
        };
        deepDooruButton.onclick = function (e) {
          e.stopPropagation();
          var areaHeader = document.querySelector('#layer-panel .area-header');
          var spinner = createSpinnerSuccess(index);
          areaHeader.appendChild(spinner);
          sdWebUI_Interrogate(layer, "deepdanbooru", spinner.id);
          index++;
        };

        buttonsDiv.appendChild(runButton);
        buttonsDiv.appendChild(promptButton);
        buttonsDiv.appendChild(clipButton);
        buttonsDiv.appendChild(deepDooruButton);
      }

      buttonsDiv.appendChild(deleteButton);

      layerDiv.setAttribute("data-id", layer.id);

      if ( isLayerPreview(layer) ) {
        layerDiv.appendChild(previewDiv);
      }

      layerDiv.appendChild(detailsDiv);
      detailsDiv.appendChild(buttonsDiv);

      layerDiv.onclick = function () {
        canvas.setActiveObject(layer);
        canvas.renderAll();
        highlightActiveLayer(index);
        updateControls(layer);
      };

      layerContent.appendChild(layerDiv);
    }
  });
}


function calculateCenter(layer) {
  //console.log("calculateCenter:", layer.left, layer.width, layer.top, layer.height );

  const centerX = layer.left + (layer.width / 2) * layer.scaleX;
  const centerY = layer.top + (layer.height / 2) * layer.scaleY;
  
 return { centerX, centerY };
}


function putPreviewImage(layer, layerDiv) {
  // console.log("putPreviewImage function called with layer:", layer);
  var previewDiv = document.createElement("div");
  var canvasSize = 120;

  var tempCanvas = document.createElement("canvas");
  
  tempCanvas.width = canvasSize;
  tempCanvas.height = canvasSize;
  var tempCtx = tempCanvas.getContext("2d");
  tempCtx.fillStyle = "#ffcccc"; 

  if (isGroup(layer)) {
    var boundingBox = layer.getBoundingRect();
    var groupWidth = boundingBox.width;
    var groupHeight = boundingBox.height;

    var scale = Math.min(canvasSize / groupWidth, canvasSize / groupHeight);

    var offsetX = (canvasSize - groupWidth * scale) / 2;
    var offsetY = (canvasSize - groupHeight * scale) / 2;

    tempCtx.save();
    tempCtx.translate(offsetX, offsetY);
    tempCtx.scale(scale, scale);
    tempCtx.translate(-boundingBox.left, -boundingBox.top);

    layer.getObjects().forEach(function (obj) {
      obj.render(tempCtx);
    });

    tempCtx.restore();

  } else if (layer.type === "path") {
    // console.log("Layer is a path");
    var pathBounds = layer.getBoundingRect();
    var pathWidth = pathBounds.width;
    var pathHeight = pathBounds.height;

    var scale = Math.min(canvasSize / pathWidth, canvasSize / pathHeight);
    var offsetX = (canvasSize - pathWidth * scale) / 2;
    var offsetY = (canvasSize - pathHeight * scale) / 2;

    tempCtx.save();
    tempCtx.translate(offsetX, offsetY);
    tempCtx.scale(scale, scale);
    tempCtx.translate(-pathBounds.left, -pathBounds.top);
    layer.render(tempCtx);

    tempCtx.restore();

  } else if (isImage(layer) && typeof layer.getElement === "function") {
    var imgElement = layer.getElement();
    var imgWidth = imgElement.width;
    var imgHeight = imgElement.height;

    var scale = Math.min(canvasSize / imgWidth, canvasSize / imgHeight);
    var drawWidth = imgWidth * scale;
    var drawHeight = imgHeight * scale;

    var offsetX = (canvasSize - drawWidth) / 2;
    var offsetY = (canvasSize - drawHeight) / 2;

    tempCtx.drawImage(imgElement, offsetX, offsetY, drawWidth, drawHeight);

  } else if (isPanelType(layer)) {
    var layerCanvas = layer.toCanvasElement();
    var layerWidth = layer.width;
    var layerHeight = layer.height;

    var layerScale = Math.min(canvasSize / layerWidth, canvasSize / layerHeight);
    var layerDrawWidth = layerWidth * layerScale;
    var layerDrawHeight = layerHeight * layerScale;

    var layerOffsetX = (canvasSize - layerDrawWidth) / 2;
    var layerOffsetY = (canvasSize - layerDrawHeight) / 2;

    tempCtx.drawImage(layerCanvas, layerOffsetX, layerOffsetY, layerDrawWidth, layerDrawHeight);

  } else {
    layer.render(tempCtx);
  }

  var imageUrl = tempCanvas.toDataURL();
  previewDiv.style.backgroundImage = "url(" + imageUrl + ")";
  previewDiv.style.backgroundSize = "contain";
  previewDiv.style.backgroundPosition = "center";
  previewDiv.style.backgroundRepeat = "no-repeat";
  previewDiv.className = "layer-preview";
  layerDiv.appendChild(previewDiv);
}

function removeLayer(layer) {
  canvas.remove(layer);
  updateLayerPanel();

  if (canvas.getActiveObject() === layer) {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }else{
    canvas.requestRenderAll();
  }
}

function highlightActiveLayer(activeIndex) {
  var layerItems = document.querySelectorAll(".layer-item");
  layerItems.forEach((layer, index) => {
    if (index === activeIndex) {
      layer.classList.add("active");
    } else {
      layer.classList.remove("active");
    }
  });
}


function highlightActiveLayerByCanvas() {
  var activeObject = canvas.getActiveObject();
  updateControls(activeObject);

  var activeIndex = getActiveObjectIndex(canvas);
  var layers = document.querySelectorAll(".layer-item");

  var reverseIndex = layers.length - 1 - activeIndex;

  layers.forEach(function(layerDiv, index) {
    if (index === reverseIndex) {
      layerDiv.classList.add("active");
    } else {
      layerDiv.classList.remove("active");
    }
  });
}

function getActiveObjectIndex(canvas) {
  var activeObject = canvas.getActiveObject();
  var objects = canvas.getObjects();
  var index = objects.indexOf(activeObject);
  return index;
}


function LayersUp() {

  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.bringForward();
    canvas.renderAll();
    updateLayerPanel();
    saveState();
  }
}

function LayersDown() {

  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.sendBackwards();
    canvas.renderAll();
    updateLayerPanel();
    saveState();
  }
}