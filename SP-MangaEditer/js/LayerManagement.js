function updateLayerPanel() {
  console.log( "updateLayerPanel" );
  var layers = canvas.getObjects();
  var layerContent = document.getElementById("layer-content");
  layerContent.innerHTML = "";

  layers.slice().reverse().forEach(function (layer, index) {
    if (!layer.excludeFromLayerPanel) {
      console.log("if (!layer.excludeFromLayerPanel) { : layer.excludeFromLayerPanel", layer.excludeFromLayerPanel );
      var layerDiv = document.createElement("div");
      var previewDiv = document.createElement("div");
      var nameDiv = document.createElement("div");
      var deleteButton = document.createElement("button");

      var tempCanvas = document.createElement("canvas");
      tempCanvas.width = 100;
      tempCanvas.height = 100;
      var tempCtx = tempCanvas.getContext("2d");

      if (layer.type === "image" && typeof layer.getElement === "function") {
        tempCtx.drawImage(layer.getElement(), 0, 0, 100, 100);
      } else if (
        layer.type === "rect" ||
        layer.type === "circle" ||
        layer.type === "path"
      ) {
        layer.render(tempCtx);
      }

      var imageUrl = tempCanvas.toDataURL();

      previewDiv.style.backgroundImage = "url(" + imageUrl + ")";
      previewDiv.style.backgroundSize = "contain"; 
      previewDiv.style.backgroundPosition = "center";
      previewDiv.style.backgroundRepeat = "no-repeat"; 
      previewDiv.className = "layer-preview";
      nameDiv.textContent =
        layer.fileName || layer.imgUrl || "Layer " + (index + 1);
      nameDiv.className = "layer-name";

      deleteButton.textContent = "✕";
      deleteButton.className = "delete-layer-button";
      deleteButton.onclick = function (e) {
        e.stopPropagation();
        removeLayer(layer);
      };

      layerDiv.setAttribute("data-id", layer.id);
      layerDiv.className = "layer-item";
      layerDiv.appendChild(previewDiv);
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
  if (layer === currentImage) {
    currentImage = null;
  }
  updateLayerPanel();
  if (canvas.getActiveObject() === layer) {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function highlightActiveLayer(activeIndex) {
  console.log("Activating layer at index:", activeIndex);
  var layerItems = document.querySelectorAll(".layer-item");
  layerItems.forEach((layer, index) => {
    if (index === activeIndex) {
      layer.classList.add("active");
    } else {
      layer.classList.remove("active");
    }
  });
}

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
