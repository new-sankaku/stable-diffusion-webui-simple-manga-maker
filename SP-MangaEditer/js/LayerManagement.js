

function updateLayerPanel() {
  // console.log("updateLayerPanel");
  var layers = canvas.getObjects();
  var layerContent = document.getElementById("layer-content");
  layerContent.innerHTML = "";

  layers.slice().reverse().forEach(function (layer, index) {
    if (!layer.excludeFromLayerPanel) {
      var layerDiv = document.createElement("div");
      var previewDiv = document.createElement("div");
      var nameDiv = document.createElement("div");
      var deleteButton = document.createElement("button");

      // console.log("layer.type", layer.type);

      if (["image", "rect", "circle", "path", "group", "polygon"].includes(layer.type)) {
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        var tempCtx = tempCanvas.getContext("2d");

        // console.log("layer.type", layer.type);
        if (layer.type === "image" && typeof layer.getElement === "function") {
          tempCtx.drawImage(layer.getElement(), 0, 0, 100, 100);

        } else if (layer.type === "group") {
          var groupScaleFactor = Math.min(100 / layer.width, 100 / layer.height);
          tempCtx.save();
          tempCtx.translate(50, 50);
          tempCtx.scale(0.1,0.1);
          tempCtx.translate(-layer.width / 2, -layer.height / 2);
        
          layer.getObjects().forEach(function (obj) {
            tempCtx.save();
            tempCtx.translate(obj.left, obj.top);
        
            if (["rect", "circle", "polygon"].includes(obj.type)) {
              var tempCanvas = obj.toCanvasElement();
              tempCtx.drawImage(tempCanvas, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
            } else if (obj.type === "path") {
              var path = new fabric.Path(obj.path);
              path.left = -obj.width / 2;
              path.top = -obj.height / 2;
              path.render(tempCtx);
            } else {
              tempCtx.translate(-obj.width / 2, -obj.height / 2);
              obj.render(tempCtx);
            }
        
            tempCtx.restore();
          });
        
          tempCtx.restore();
        } else if (layer.type === "rect" || layer.type === "circle" || layer.type === "path" || layer.type === "polygon"  ) {
          var tempCanvas = layer.toCanvasElement();
          tempCtx.drawImage(tempCanvas, 0, 0, 100, 100);

        }else if (layer.type === "path"  ) {
          var path = new fabric.Path(layer.path);
          path.render(tempCtx);
        
        }else {
          layer.render(tempCtx);
        }

        var imageUrl = tempCanvas.toDataURL();
        previewDiv.style.backgroundImage = "url(" + imageUrl + ")";
        previewDiv.style.backgroundSize = "contain";
        previewDiv.style.backgroundPosition = "center";
        previewDiv.style.backgroundRepeat = "no-repeat";
        previewDiv.className = "layer-preview";
        layerDiv.appendChild(previewDiv);
      } else if (layer.type === "text" || layer.type === "textbox") {
        var fullText = layer.text;
        nameDiv.textContent = fullText.substring(0, 20);
      } else if (layer.type === "verticalText") {
        var fullText = layer.getObjects().map(obj => obj.text).join('');
        nameDiv.textContent = fullText.substring(0, 15);
      }

      nameDiv.className = "layer-name";
      nameDiv.textContent = nameDiv.textContent || layer.name || layer.type + ` ${index + 1}`;

      deleteButton.textContent = "✕";
      deleteButton.className = "delete-layer-button";
      deleteButton.onclick = function (e) {
        e.stopPropagation();
        removeLayer(layer);
      };

      layerDiv.setAttribute("data-id", layer.id);
      layerDiv.className = "layer-item";
      layerDiv.appendChild(nameDiv);
      layerDiv.appendChild(deleteButton);
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

function removeLayer(layer) {
  canvas.remove(layer);
  // if (layer === currentImage) {
  //   currentImage = null;
  // }
  updateLayerPanel();
  if (canvas.getActiveObject() === layer) {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function highlightActiveLayer(activeIndex) {
  //console.log("Activating layer at index:", activeIndex);
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

// Canvas のオブジェクト選択イベントに反応する
canvas.on('selection:created', highlightActiveLayerByCanvas);
canvas.on('selection:updated', highlightActiveLayerByCanvas);
canvas.on('selection:cleared', function() {
  var layers = document.querySelectorAll(".layer-item");
  layers.forEach(layer => layer.classList.remove("active"));
});


function updateControls(activeObject) {
  if (!activeObject) {
    document.getElementById("angle-control").value = 0;
    document.getElementById("scale-control").value = 1;
    document.getElementById("top-control").value = 0;
    document.getElementById("left-control").value = 0;
    document.getElementById("skewX-control").value = 0;
    document.getElementById("skewY-control").value = 0;
    return;
  }

  document.getElementById("angle-control").value = activeObject.angle;
  document.getElementById("scale-control").value = activeObject.scaleX;
  document.getElementById("top-control").value = activeObject.top;
  document.getElementById("left-control").value = activeObject.left;
  document.getElementById("skewX-control").value = activeObject.skewX;
  document.getElementById("skewY-control").value = activeObject.skewY;
}


function LayersUp() {
  //console.log("LayersUp ");

  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    //console.log("LayersUp exec");

    activeObject.bringForward();
    canvas.renderAll();
    updateLayerPanel();
  }
}

function LayersDown() {
  //console.log("LayersDown ");

  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    //console.log("LayersDown exec");
    activeObject.sendBackwards();
    canvas.renderAll();
    updateLayerPanel();
  }
}