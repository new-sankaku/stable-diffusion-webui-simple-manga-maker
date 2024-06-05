
var lastActiveObjectState = null;
canvas.on('selection:created', function(event) {
  lastActiveObjectState = canvas.getActiveObject();
});
canvas.on('selection:updated', function(event) {
  glfxReset();
  lastActiveObjectState = canvas.getActiveObject();
});
canvas.on('selection:cleared', function() {
  glfxReset();
});

canvas.on("object:added", (e) => {
  const obj = e.target;
  if (!obj.initial) {
    saveInitialState(obj);
  }
  forcedAdjustCanvasSize();

  if (isKnifeMode) {
    obj.set({
      selectable: false
    });
  } else {
    obj.set({
      selectable: true
    });
  }

});

canvas.on("object:modified", (e) => {
  const obj = e.target;
  saveInitialState(obj);
});


// Layer History.
canvas.on('object:added',     function(e) { saveStateByListener(e, 'object:added'); });
canvas.on('object:modified',  function(e) { saveStateByListener(e, 'object:modified'); });
canvas.on('object:removed',   function(e) { saveStateByListener(e, 'object:removed'); });
canvas.on('path:created',     function(e) { saveStateByListener(e, 'path:created'); });
canvas.on('canvas:cleared',   function(e) { saveStateByListener(e, 'canvas:cleared'); });

//End Crop Mode
canvas.on('selection:cleared', function() {
  if (cropFrame) {
      canvas.remove(cropFrame);
      cropFrame = null;
      document.getElementById('crop').style.display = 'none';
  }
});
canvas.on('selection:updated', function() {
  if (cropFrame && canvas.getActiveObject() !== cropFrame) {
    canvas.remove(cropFrame);
    cropFrame = null;
    document.getElementById('crop').style.display = 'none';
  }
});

//Object選択時にLeyerパネルをハイライトする。
canvas.on('selection:created',  highlightActiveLayerByCanvas);
canvas.on('selection:updated',  highlightActiveLayerByCanvas);
canvas.on('object:added',       highlightActiveLayerByCanvas);
canvas.on('object:removed',     highlightActiveLayerByCanvas);
canvas.on('object:modified',    highlightActiveLayerByCanvas);
canvas.on('object:scaling',     highlightActiveLayerByCanvas);
canvas.on('object:moving',      highlightActiveLayerByCanvas);
canvas.on('object:rotating',    highlightActiveLayerByCanvas);

//Object選択時にLeyerパネルをハイライトを終了する。
canvas.on('selection:cleared', function() {
  var layers = document.querySelectorAll(".layer-item");
  layers.forEach(layer => layer.classList.remove("active"));
});

//Object移動時にGrid線にスナップする。
canvas.on("object:moving", function (e) {
  if (isGridVisible) {
    debounceSnapToGrid(e.target);
  }
});

//CommonControl, ImageControlの更新処理
canvas.on("selection:created", handleSelection);
canvas.on("selection:updated", handleSelection);

//Textの更新処理
canvas.on('selection:created', function(event) {
  if (event.selected && event.selected[0]) {
    updateTextControls(event.selected[0]);
  }
});
canvas.on('selection:updated', function(event) {
  if (event.selected && event.selected[0]) {
    updateTextControls(event.selected[0]);
  }
});

//縦書きTextのフローティングウインドウ表示処理
canvas.on("selection:created", function () {
  const selectedObject = canvas.getActiveObject();
  if (isVerticalText(selectedObject)) {
    openModalForEditing();
  } else {
    myWindow.style.display = "none";
  }
});
canvas.on("selection:updated", function () {
  const selectedObject = canvas.getActiveObject();
  if (isVerticalText(selectedObject)) {
    openModalForEditing();
  } else {
    myWindow.style.display = "none";
  }
});
canvas.on("selection:cleared", closeWindow);

