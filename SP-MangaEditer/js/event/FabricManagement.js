






function saveInitialState(obj) {
  console.log( "saveInitialState" , obj.type );
  console.log( "saveInitialState obj.initial" , obj.initial );


  if( isImage(obj) && (!obj.initial) ){
    setImage2ImageInitPrompt(obj);
  }

  if( isPanel(obj)  && (!obj.initial)  ){
    setText2ImageInitPrompt(obj);
  }


  obj.initial = {
    left:         obj.left,
    top:          obj.top,
    scaleX:       obj.scaleX,
    scaleY:       obj.scaleY,
    strokeWidth:  obj.strokeWidth,
    canvasWidth:  canvas.getWidth(),
    canvasHeight: canvas.getHeight(),
  };

  if (obj.clipPath) {
    obj.clipPath.initial = {
      left:         obj.clipPath.left,
      top:          obj.clipPath.top,
      scaleX:       obj.clipPath.scaleX,
      scaleY:       obj.clipPath.scaleY,
      canvasWidth:  canvas.getWidth(),
      canvasHeight: canvas.getHeight(),
    };
  }

}


function setText2ImageInitPrompt(object){
  object.isPanel                 = text2img_initPrompt.isPanel;
  object.text2img_prompt         = text2img_initPrompt.text2img_prompt;
  object.text2img_negativePrompt = text2img_initPrompt.text2img_negativePrompt;
  object.text2img_seed           = text2img_initPrompt.text2img_seed;
  object.text2img_width          = text2img_initPrompt.text2img_width;
  object.text2img_height         = text2img_initPrompt.text2img_height;
  object.text2img_samplingSteps  = text2img_initPrompt.text2img_samplingSteps;
}
function setImage2ImageInitPrompt(object){
  object.text2img_prompt            = img2img_initPrompt.img2img_prompt;
  object.text2img_negativePrompt    = img2img_initPrompt.img2img_negativePrompt;
  object.text2img_seed              = img2img_initPrompt.img2img_seed;
  object.text2img_width             = img2img_initPrompt.img2img_width;
  object.text2img_height            = img2img_initPrompt.img2img_height;
  object.text2img_samplingSteps     = img2img_initPrompt.img2img_samplingSteps;
  object.img2img_denoising_strength = img2img_initPrompt.img2img_denoising_strength;
}



canvas.on("object:added", (e) => {
  const obj = e.target;
  console.log( "canvas.on(object:added" , obj.type );

  if (!obj.initial) {
    console.log( "canvas.on(object:added initial " , obj.initial );
    saveInitialState(obj);
  }
  forcedAdjustCanvasSize();
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
