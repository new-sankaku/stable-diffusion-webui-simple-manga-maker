document.addEventListener("keydown", function (e) {
  var activeObject = canvas.getActiveObject();

  if (e.key === "g" && e.ctrlKey) {
    toggleGrid();
    e.preventDefault();
    return;
  } else if (e.key === "z" && e.ctrlKey) {
    undo();
    e.preventDefault();
    return;
  } else if (e.key === "y" && e.ctrlKey) {
    redo();
    e.preventDefault();
    return;
  } else if (e.key === "c" && e.ctrlKey) {
    // コピー (Ctrl+C)
  }else if (e.ctrlKey && e.key === 'l') {
    changeView('layer-panel', document.getElementById('view_layers_checkbox').checked);
    document.getElementById('view_layers_checkbox').click();
    e.preventDefault();
    return;
  } else if (e.ctrlKey && e.key === 'k') {
    changeView('controls', document.getElementById('view_controles_checkbox').checked);
    document.getElementById('view_controles_checkbox').click();
    e.preventDefault();
    return;
  } else if (e.ctrlKey && e.key === '8') { // Ctrl + 8
    zoomIn();
    e.preventDefault();
    return;
  } else if (e.ctrlKey && e.key === '9') { // Ctrl + 9
    zoomOut();
    e.preventDefault();
    return;
  }else if (e.ctrlKey && e.key === '0') { // Ctrl + 0
    zoomFit();
    e.preventDefault();
    return;
  }
  
  if (activeObject) {
    if (e.key === "Delete") {
      removeLayer(activeObject);
      canvas.renderAll();
      e.preventDefault();
      return;
    }
  }

  if (activeObject && isNotVisibleFloatingWindow()) {
    var moveDistance = isGridVisible ? gridSize : 1;
    switch (e.key) {
      case "ArrowLeft":
        activeObject.left -= moveDistance;
        break;
      case "ArrowUp":
        activeObject.top -= moveDistance;
        break;
      case "ArrowRight":
        activeObject.left += moveDistance;
        break;
      case "ArrowDown":
        activeObject.top += moveDistance;
        break;
      default:
        return;
    }
    activeObject.setCoords();
    canvas.renderAll();
    e.preventDefault();
    return;
  }
});



document.addEventListener("paste", function (event) {
  const items = event.clipboardData.items;
  var isActive = true;
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
      const blob = items[i].getAsFile();
      const reader = new FileReader();

      reader.onload = function (event) {
        const data = event.target.result;
        fabric.Image.fromURL(data, function (img) {
          const activeObject = canvas.getActiveObject();

          if (activeObject && isActive) {
            // アクティブオブジェクトの中央座標を使用
            const x =
              activeObject.left +
              (activeObject.width * activeObject.scaleX) / 2;
            const y =
              activeObject.top +
              (activeObject.height * activeObject.scaleY) / 2;
            putImageInFrame(img, x, y);
          } else {
            isActive = false;
            const canvasWidth = canvas.width / 2;
            const canvasHeight = canvas.height / 2;
            const scaleToFitX = canvasWidth / img.width;
            const scaleToFitY = canvasHeight / img.height;
            const scaleToFit = Math.min(scaleToFitX, scaleToFitY);

            img.set({
              scaleX: scaleToFit,
              scaleY: scaleToFit,
              left: (canvasWidth - img.width * scaleToFit) / 2,
              top: (canvasHeight - img.height * scaleToFit) / 2,
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            saveStateByManual();
          }
        });
      };
      reader.readAsDataURL(blob);
      updateLayerPanel();
    }
  }
});
