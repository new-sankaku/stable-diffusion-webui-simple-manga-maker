let finalLayerOrder = [];

function updateLayerPanel() {
  var layers = canvas.getObjects().slice().reverse();
  var layerContent = $("layer-content");
  layerContent.innerHTML = "";
  var guidMap = createGUIDMap(layers);
  var processedLayersFirst = new Set();
  var processedLayersSecond = new Set();

  // 最終的なレイヤー順序を保持する配列
  finalLayerOrder = [];

  layers.forEach((layer) => {
    if (layer.guids && layer.guids.length > 0) {
    } else {
      layer.guids = [];
    }
  });

  // guidsを持つレイヤーを処理
  layers.forEach((layer) => {
    if (layer.isPanel) {
      processedLayersFirst.add(layer);
      layer.guids.forEach((guid) => {
        var matchingLayer = guidMap.get(guid);
        if (matchingLayer) {
          processedLayersFirst.add(matchingLayer);
        }
      });
    }
  });

  // guidsを持つレイヤーを処理
  layers.forEach((layer) => {
    if (layer.isPanel) {
      finalLayerOrder.push(layer);
      processedLayersSecond.add(layer);

      var guidsNow = layer.guids;
      var guidsTemp = [];
      layers.forEach((layer) => {
        var nowGuid = layer.guid;
        if (guidsNow.includes(nowGuid)) {
          guidsTemp.push(nowGuid);
        }
      });

      guidsTemp.forEach((guid) => {
        var matchingLayer = guidMap.get(guid);
        if (matchingLayer) {
          finalLayerOrder.push(matchingLayer);
          processedLayersSecond.add(matchingLayer);
        }
      });
    } else {
      if (!processedLayersFirst.has(layer)) {
        finalLayerOrder.push(layer);
      }
    }
  });



  // レイヤーパネルの更新
  finalLayerOrder.forEach((layer, index) => {
    if (!layer.excludeFromLayerPanel) {
      var layerDiv = Object.assign(document.createElement("div"), {
        className: "layer-item",
      });
      var previewDiv = Object.assign(document.createElement("div"), {
        className: "layer-preview",
      });
      var detailsDiv = Object.assign(document.createElement("div"), {
        className: "layer-details",
      });
      var nameTextArea = Object.assign(document.createElement("input"), {
        className: "layer-name",
      });
      var buttonsDiv = Object.assign(document.createElement("div"), {
        className: "layer-buttons",
      });

      if (isLayerPreview(layer)) {
        createPreviewImage(layer, previewDiv);
      } else if (isText(layer)) {
        var fullText = layer.text;
        nameTextArea.value = fullText.substring(0, 20);
      } else if (isVerticalText(layer)) {
        var fullText = layer.name;
        if( fullText ){
          nameTextArea.value = fullText.substring(0, 15);
        }else{
          layer.name = "verticalText";
          fullText = layer.name;
          nameTextArea.value = fullText.substring(0, 15);
        }
        
      }

      setNameTextAreaProperties(layer, nameTextArea, index);

      if (isText(layer)) {
        detailsDiv.style.display = "flex";
        detailsDiv.style.alignItems = "center";
      }

      detailsDiv.appendChild(nameTextArea);

      putViewButton(buttonsDiv, layer, index);
      putMoveLockButton(buttonsDiv, layer, index);
      if (isImage(layer)) {
        putCheckButton(buttonsDiv, layer, index);
      }


      if (layer.isPanel) {
        putRunT2IButton(buttonsDiv, layer, index);
        putSeedButton(buttonsDiv, layer, index);
        putCropImageDownloadButton(buttonsDiv, layer, index);
      }
      if (layer.type == "image") {
        putRunI2IButton(buttonsDiv, layer, index);
        putPromptButton(buttonsDiv, layer, index);
        putInterrogateDanbooruButtons(buttonsDiv, layer, index);
        putInterrogateClipButtons(buttonsDiv, layer, index);
        putImageDownloadButton(buttonsDiv, layer, index);
        putRembgButton(buttonsDiv, layer, index);
      }
      putDeleteButton(buttonsDiv, layer, index);

      layerDiv.setAttribute("data-id", layer.id);

      if (isLayerPreview(layer)) {
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

      var isMatchingLayer = layers.some(layerWithGUIDs => layerWithGUIDs.guids && layerWithGUIDs.guids.includes(layer.guid));
      if (isMatchingLayer) {
        layerDiv.style.border = 'none';
        layerDiv.style.borderLeft    = getCssValue('--boader-color-2px-solid-C');
        layerDiv.style.borderBottom  = getCssValue('--boader-color-1px-solid-D');
        layerDiv.style.marginLeft = "10px";
        layerDiv.style.paddingLeft = "5px";
      } else {
        layerDiv.style.border = 'none';
        layerDiv.style.borderTop    = getCssValue('--layer-panel-boader-color-1px-solid-B');
        layerDiv.style.borderBottom = getCssValue('--layer-panel-boader-color-1px-solid-B');
      }
      layerContent.appendChild(layerDiv);
    }
  });
}

function setNameTextAreaProperties(layer, nameTextArea, index) {
  nameTextArea.value = layer.name || nameTextArea.value || layer.type + `${index + 1}`;

  layer.name = nameTextArea.value;
  nameTextArea.rows = 1;
  nameTextArea.style.resize = "none";
  nameTextArea.style.width = "100%";
  nameTextArea.style.boxSizing = "border-box";
  nameTextArea.style.border = "none";
  // nameTextArea.style.borderBottom = '1px solid #cccccc';
  nameTextArea.style.outline = "none";
  nameTextArea.style.color = getCssValue("--text-color-B");
  nameTextArea.style.borderColor = getCssValue("--boader-color-1px-solid-B");
  nameTextArea.style.background = getCssValue("--background-color-B");
  nameTextArea.oninput = function () {
    layer.name = nameTextArea.value;
  };

  if (isText(layer)) {
    nameTextArea.value = layer.text;
    nameTextArea.style.flex = "1";
    nameTextArea.style.marginRight = "5px";
  }
  // console.log("layer.text", layer.text);
  if (isImage(layer) && layer.text) {
    nameTextArea.value = layer.text;
  }
}


function calculateCenter(layer) {
  const centerX = layer.left + (layer.width / 2) * layer.scaleX;
  const centerY = layer.top + (layer.height / 2) * layer.scaleY;
  return { centerX, centerY };
}

function createPreviewImage(layer, layerDiv) {
  var previewDiv = document.createElement("div");
  var canvasSize = 120;

  var tempCanvas = document.createElement("canvas");

  tempCanvas.width = canvasSize;
  tempCanvas.height = canvasSize;
  var tempCtx = tempCanvas.getContext("2d");
  tempCtx.fillStyle = "#ffcccc";

  var nowVisible = layer.visible;
  layer.visible = true;
  
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

    var layerScale = Math.min(
      canvasSize / layerWidth,
      canvasSize / layerHeight
    );
    var layerDrawWidth = layerWidth * layerScale;
    var layerDrawHeight = layerHeight * layerScale;

    var layerOffsetX = (canvasSize - layerDrawWidth) / 2;
    var layerOffsetY = (canvasSize - layerDrawHeight) / 2;

    tempCtx.drawImage(
      layerCanvas,
      layerOffsetX,
      layerOffsetY,
      layerDrawWidth,
      layerDrawHeight
    );
  } else {
    layer.render(tempCtx);
  }
  layer.visible = nowVisible;
  
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
  } else {
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

function highlightActiveLayerByCanvas(object=null) {
  let activeObject;
  if(object){
    activeObject = object;
  }else{
    activeObject = canvas.getActiveObject();
  }
  
  updateControls(activeObject);

  if( isPanel(activeObject) ){
    showT2IPrompts(activeObject);
  }else if( isImage(activeObject)){
    showI2IPrompts(activeObject);
  }

  var activeIndex = getLayerIndexByActiveObject(activeObject);
  console.log("activeIndex", activeIndex);
  var layers = document.querySelectorAll(".layer-item");

  var reverseIndex = layers.length - 1 - activeIndex;

  layers.forEach(function (layerDiv, index) {
    if (index === reverseIndex) {
      layerDiv.classList.add("active");
    } else {
      layerDiv.classList.remove("active");
    }
  });
}


function getLayerIndexByActiveObject(targetObject) {

  console.log("finalLayerOrder.length", finalLayerOrder.length);

  if (!targetObject || !finalLayerOrder || finalLayerOrder.length === 0) return -1;
  const normalIndex = finalLayerOrder.indexOf(targetObject);
  return finalLayerOrder.length - 1 - normalIndex;
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





