function isPanel(activeObject) {
  return (activeObject && activeObject.isPanel );
}

function isImage(activeObject) {
  return (activeObject && (activeObject.type === "image") );
}

function isText(activeObject){
  return (activeObject && (activeObject.type === "text" || activeObject.type === "textbox"|| activeObject.type === "verticalText") ) ;
}

function isVerticalText(activeObject) {
  return (activeObject && (activeObject.type === "verticalText") );
}

function isLine(activeObject){
  return (activeObject && activeObject.type === 'line') ;
}

function isGroup(activeObject){
  return (activeObject && activeObject.type === 'group') ;
}

function isShapes(activeObject){
  return (activeObject && ['rect', 'circle', 'triangle', 'polygon'].includes(activeObject.type)) ;
}

function saveInitialState(obj) {

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

function deepCopy(obj) {
  var copyObject = {};

  if (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop] instanceof Object) {
          copyObject[prop] = deepCopy(obj[prop]);
        } else {
          copyObject[prop] = obj[prop];
        }
      }
    }
  }

  if (obj.clipPath) {
    copyObject.clipPath = deepCopy(obj.clipPath);
  }

  return copyObject;
}

function copy(srcObject, object) {
    object.name                       = srcObject.name;
    object.isPanel                    = srcObject.isPanel;
    object.text2img_prompt            = srcObject.text2img_prompt;
    object.text2img_negativePrompt    = srcObject.text2img_negativePrompt;
    object.text2img_seed              = srcObject.text2img_seed;
    object.text2img_width             = srcObject.text2img_width;
    object.text2img_height            = srcObject.text2img_height;
    object.text2img_samplingSteps     = srcObject.text2img_samplingSteps;
    object.img2img_prompt             = srcObject.img2img_prompt;
    object.img2img_negativePrompt     = srcObject.img2img_negativePrompt;
    object.img2img_seed               = srcObject.img2img_seed;
    object.img2img_width              = srcObject.img2img_width;
    object.img2img_height             = srcObject.img2img_height;
    object.img2img_samplingSteps      = srcObject.img2img_samplingSteps;
    object.img2img_denoising_strength  = srcObject.img2img_denoising_strength;
    object.top                         = srcObject.top;
    object.left                        = srcObject.left;
    object.scaleX                      = srcObject.scaleX;
    object.scaleY                      = srcObject.scaleY;
    object.width                       = srcObject.width;
    object.height                      = srcObject.height

    object.clipPath         = srcObject.clipPath         ? srcObject.clipPath         : undefined;

  if (srcObject.clipPath && srcObject.clipPath.initial) {
    object.clipPath.initial = srcObject.clipPath.initial ? srcObject.clipPath.initial : undefined;
  }
  object.initial          = srcObject.initial          ? srcObject.initial          : undefined;
}