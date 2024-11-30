
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

  if( currentMode === 'freehand' ){
    changeObjectCursor('freehand', obj)
  }else if( currentMode === 'point' ){
    changeObjectCursor('point', obj)
  }else if (isKnifeMode) {
    changeObjectCursor('knife', obj)
    obj.set({
      selectable: false
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
      $('crop').style.display = 'none';
  }
});
canvas.on('selection:updated', function() {
  if (cropFrame && canvas.getActiveObject() !== cropFrame) {
    canvas.remove(cropFrame);
    cropFrame = null;
    $('crop').style.display = 'none';
  }
});

//Object選択時にLeyerパネルをハイライトする。
canvas.on('selection:created',  highlightActiveLayerByCanvas);
canvas.on('selection:updated',  highlightActiveLayerByCanvas);
canvas.on('object:added',       highlightActiveLayerByCanvas);
// canvas.on('object:removed',     highlightActiveLayerByCanvas);
canvas.on('object:modified',    highlightActiveLayerByCanvas);
// canvas.on('object:scaling',     highlightActiveLayerByCanvas);
// canvas.on('object:moving',      highlightActiveLayerByCanvas);
// canvas.on('object:rotating',    highlightActiveLayerByCanvas);
canvas.on('mouse:down', function(event) {
  if (event.target) {
    highlightActiveLayerByCanvas(event.target);
  }
});

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
// canvas.on("selection:created", handleSelection);
// canvas.on("selection:updated", handleSelection);

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

function moveSettings(img, poly) {
  updateClipPath(img, poly);

  function updateOnModification() {
    updateClipPath(img, poly);
    canvas.renderAll();
  }

  img.relatedPoly = poly;

  ['moving', 'scaling', 'rotating', 'skewing', 'modified'].forEach(eventName => {
    poly.on(eventName, updateOnModification);
    img.on(eventName, updateOnModification);
  });

  img.removeSettings = function() {
    removeGUID(this.relatedPoly, this);
    const events = ['moving', 'scaling', 'rotating', 'skewing', 'modified'];
    events.forEach(eventName => {
      this.off(eventName, updateOnModification);
      if (this.relatedPoly) {
        this.relatedPoly.off(eventName, updateOnModification);
      }
    });
    delete this.relatedPoly;
    delete this.removeSettings;
  };
}

function updateClipPath(imageObj, polygonObj) {
  const matrix = polygonObj.calcTransformMatrix();
  const transformedPoints = polygonObj.points.map(point => {
      return fabric.util.transformPoint({
          x: point.x - polygonObj.pathOffset.x,
          y: point.y - polygonObj.pathOffset.y
      }, matrix);
  });

  const clipPath = new fabric.Polygon(transformedPoints, {
      absolutePositioned: true,
  });

  clipPath.set({
    left:   clipPath.left + polygonObj.strokeWidth - (polygonObj.strokeWidth*0.5),
    top:    clipPath.top  + polygonObj.strokeWidth - (polygonObj.strokeWidth*0.5),
    scaleX: 1 - (polygonObj.strokeWidth) / (clipPath.width),
    scaleY: 1 - (polygonObj.strokeWidth) / (clipPath.height),
    absolutePositioned: true,
  });

  if (!clipPath.initial) {
    saveInitialState(clipPath);
  }

  imageObj.clipPath = clipPath;
}

canvas.on("object:added", (e) => {
  if(initMessageText){
    canvas.remove(initMessageText);
    updateLayerPanel();
    initMessageText=null;
  }

  const obj = e.target;
  if (isPanel(obj)) {
      obj.set('fill', 'rgba(255,255,255,0.25)');
  }
});

let lastCheckObject = null;
canvas.on('mouse:down', function(e) {
  if (e.target) {
      e.target.originalOpacity = e.target.opacity;
      e.target.opacity = 0.5;
      canvas.renderAll();
      lastCheckObject = e.target;
  }
});

canvas.on('mouse:up', function(e) {
  if (e.target && e.target.originalOpacity !== undefined) {
      e.target.opacity = e.target.originalOpacity;
      delete e.target.originalOpacity;
      canvas.renderAll();
  }
});