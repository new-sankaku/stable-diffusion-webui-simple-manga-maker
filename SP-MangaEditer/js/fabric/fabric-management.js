
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
// canvas.on('object:removed',  highlightActiveLayerByCanvas);
canvas.on('object:modified',    highlightActiveLayerByCanvas);
// canvas.on('object:scaling',  highlightActiveLayerByCanvas);
// canvas.on('object:moving',   highlightActiveLayerByCanvas);
// canvas.on('object:rotating', highlightActiveLayerByCanvas);

//Object選択時にLeyerパネルをハイライトを終了する。
canvas.on('selection:cleared', function() {
  highlightClear();
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

  // console.log("moveSettings", img, poly);
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
  if(!polygonObj.points){
    console.log("ERROR ERROR ERROR polygonObj.points", JSON.stringify(polygonObj.points));
    return;
  }

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
  if(canvas.isDrawingMode){
    return;
  }
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
  if(canvas.isDrawingMode){
    return;
  }
  if (e.target) {
      changeDoNotSaveHistory();
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
      changeDoSaveHistory();
      saveStateByManual();
      highlightActiveLayerByCanvas(e.target);
  }
});


// // Mouse events
// canvas.on('mouse:down', e => console.log('mouse:down called'));
// // canvas.on('mouse:move', e => console.log('mouse:move called'));
// canvas.on('mouse:up', e => console.log('mouse:up called'));
// // canvas.on('mouse:over', e => console.log('mouse:over called'));
// // canvas.on('mouse:out', e => console.log('mouse:out called'));
// canvas.on('mouse:wheel', e => console.log('mouse:wheel called'));
// canvas.on('mouse:dblclick', e => console.log('mouse:dblclick called'));

// // Selection events 
// canvas.on('selection:created', e => console.log('selection:created called'));
// canvas.on('selection:updated', e => console.log('selection:updated called'));
// canvas.on('selection:cleared', e => console.log('selection:cleared called'));

// // Object manipulation events
// canvas.on('object:added', e => console.log('object:added called'));
// canvas.on('object:removed', e => console.log('object:removed called'));
// canvas.on('object:modified', e => console.log('object:modified called'));
// canvas.on('object:moving', e => console.log('object:moving called'));
// canvas.on('object:scaling', e => console.log('object:scaling called'));
// canvas.on('object:rotating', e => console.log('object:rotating called'));
// canvas.on('object:skewing', e => console.log('object:skewing called'));

// // Text related events
// canvas.on('text:changed', e => console.log('text:changed called'));
// canvas.on('text:editing:entered', e => console.log('text:editing:entered called'));
// canvas.on('text:editing:exited', e => console.log('text:editing:exited called'));
// canvas.on('text:selection:changed', e => console.log('text:selection:changed called'));

// // Path related events
// canvas.on('path:created', e => console.log('path:created called'));

// // Canvas related events
// canvas.on('after:render', e => console.log('after:render called'));
// canvas.on('before:render', e => console.log('before:render called'));
// canvas.on('canvas:cleared', e => console.log('canvas:cleared called'));

// // Group related events
// // canvas.on('group:made', e => console.log('group:made called'));
// // canvas.on('group:unmade', e => console.log('group:unmade called'));

// // Drop events
// canvas.on('drop', e => console.log('drop called'));
// canvas.on('dragenter', e => console.log('dragenter called'));
// canvas.on('dragover', e => console.log('dragover called'));
// canvas.on('dragleave', e => console.log('dragleave called'));