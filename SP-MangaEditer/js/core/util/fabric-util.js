function isPanel(activeObject) {
  return (activeObject && activeObject.isPanel);
}
function isPanelType(activeObject) {
  return (activeObject && ["rect", "circle", "polygon"].includes(activeObject.type));
}

function isImage(activeObject) {
  return (activeObject && (activeObject.type === "image"));
}
function haveClipPath(activeObject){
  if (activeObject.clipPath) {
    return true;
  }
  return false;
}

function isText(activeObject) {
  return (activeObject && (activeObject.type === 'i-text' || activeObject.type === "text" || 
                           activeObject.type === "textbox" || activeObject.type === "vertical-textbox"));
}   

function isVerticalText(activeObject) {
  return (activeObject && (activeObject.type === "vertical-textbox"));
}


function isHorizontalText(activeObject) {
  return (activeObject && (activeObject.type === 'i-text' || activeObject.type === "text" || activeObject.type === "textbox"));
}
function isPath(activeObject) {
  return (activeObject && activeObject.type === 'path');
}

function isLine(activeObject) {
  return (activeObject && activeObject.type === 'line');
}

function isGroup(activeObject) {
  return (activeObject && activeObject.type === 'group');
}

function isShapes(activeObject) {
  return (activeObject && ['path', 'rect', 'circle', 'triangle', 'polygon'].includes(activeObject.type));
}

function isPutImage(activeObject) {

  if (activeObject.isIcon) {
    return true;
  }

  return (activeObject && ["image", "rect", "circle", "path", "group", "polygon"].includes(activeObject.type));
}

function isLayerPreview(activeObject) {
  if (activeObject.isIcon) {
    return true;
  }
  return (activeObject && ["image", "rect", "circle", "group", "polygon"].includes(activeObject.type));
}


function saveInitialState(obj) {

  if (isImage(obj) && (!obj.initial)) {
    setImage2ImageInitPrompt(obj);
  }

  if (isPanel(obj) && (!obj.initial)) {
    setText2ImageInitPrompt(obj);
  }

  obj.initial = {
    left: obj.left,
    top: obj.top,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    strokeWidth: obj.strokeWidth,
    canvasWidth: canvas.getWidth(),
    canvasHeight: canvas.getHeight(),
  };

  console.log("saveInitialState start");
  if (obj.clipPath) {
    obj.clipPath.initial = {
      left: obj.clipPath.left,
      top: obj.clipPath.top,
      scaleX: obj.clipPath.scaleX,
      scaleY: obj.clipPath.scaleY,
      canvasWidth: canvas.getWidth(),
      canvasHeight: canvas.getHeight(),
    };
  }
}

function setText2ImageInitPrompt(object) {
  object.isPanel                = t2i_init.isPanel;
  object.text2img_prompt        = t2i_init.t2i_prompt;
  object.text2img_negative      = t2i_init.t2i_negativePrompt;
  object.text2img_seed          = t2i_init.t2i_seed;
  object.text2img_width         = t2i_init.t2i_width;
  object.text2img_height        = t2i_init.t2i_height;
  object.text2img_samplingSteps = t2i_init.t2i_samplingSteps;
}
function setImage2ImageInitPrompt(object) {
  object.text2img_prompt        = i2i_init.i2i_prompt;
  object.text2img_negative      = i2i_init.i2i_negativePrompt;
  object.text2img_seed          = i2i_init.i2i_seed;
  object.text2img_width         = i2i_init.i2i_width;
  object.text2img_height        = i2i_init.i2i_height;
  object.text2img_samplingSteps = i2i_init.i2i_samplingSteps;
  object.img2img_denoise        = i2i_init.i2i_denoise;
  object.img2imgScale           = i2i_init.i2i_scale;
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
  object.name                    = srcObject.name;
  object.isPanel                 = srcObject.isPanel;
  object.text2img_prompt         = srcObject.text2img_prompt;
  object.text2img_negative       = srcObject.text2img_negative;
  object.text2img_seed           = srcObject.text2img_seed;
  object.text2img_width          = srcObject.text2img_width;
  object.text2img_height         = srcObject.text2img_height;
  object.text2img_samplingSteps  = srcObject.text2img_samplingSteps;

  object.img2img_prompt         = srcObject.img2img_prompt;
  object.img2img_negative       = srcObject.img2img_negative;
  object.img2img_seed           = srcObject.img2img_seed;
  object.img2img_width          = srcObject.img2img_width;
  object.img2img_height         = srcObject.img2img_height;
  object.img2img_samplingSteps  = srcObject.img2img_samplingSteps;
  object.img2img_denoise        = srcObject.img2img_denoise;
  object.img2imgScale           = srcObject.img2imgScale;
  
  object.top    = srcObject.top;
  object.left   = srcObject.left;
  object.scaleX = srcObject.scaleX;
  object.scaleY = srcObject.scaleY;
  object.width  = srcObject.width;
  object.height = srcObject.height

  object.guid = srcObject.guid
  object.guids = srcObject.guids
  object.tempPrompt = srcObject.tempPrompt
  object.tempNegative = srcObject.tempNegative
  object.tempSeed = srcObject.tempSeed

  object.clipPath = srcObject.clipPath ? srcObject.clipPath : undefined;

  if (srcObject.clipPath && srcObject.clipPath.initial) {
    object.clipPath.initial = srcObject.clipPath.initial ? srcObject.clipPath.initial : undefined;
  }
  object.initial = srcObject.initial ? srcObject.initial : undefined;
}



function setCanvasGUID( guid = null ) {
  if( guid ){
    //ok
  }else{
    guid = generateGUID();
  }
  canvas.set('canvasGuid', guid);
  return guid;
}

function getCanvasGUID() {
  let guid = canvas.get('canvasGuid');
  if(guid){
    return guid;
  }
  return setCanvasGUID();
}


// set targetFram.guids
function setGUID(personObject, childObject) {
  if (!personObject.guids) {
    personObject.guids = [];
  }
  guid = getGUID(childObject);
  // console.log(personObject.name + " : setGUID", guid);
  personObject.guids.push(guid);
}

function removeGUID(personObject, childObject) {
  var guid = childObject.guid;

  if (!personObject.guids) {
    personObject.guids = [];
    childObject.guid = null;
    return;
  }

  if (!guid) {
    childObject.guid = null;
    return;
  }
  var index = personObject.guids.indexOf(guid);
  
  if (index !== -1) {
    personObject.guids.splice(index, 1);
  }
  updateLayerPanel();
}



function getGUID(activeObject) {
  if (!activeObject) {
    console.log("ERROR, getGUID activeObject is null.")
    return null;
  }

  if (activeObject.guid) {
    return activeObject.guid;
  }
  let guid = generateGUID();
  activeObject.guid = guid;
  return guid;
}

function generateGUID() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  const guid = Array.from(array).map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return `${guid.slice(0, 8)}-${guid.slice(8, 12)}-${guid.slice(12, 16)}-${guid.slice(16, 20)}-${guid.slice(20)}`;
}

function createGUIDMap(layers) {
  var layerMap = new Map();
  layers.forEach(function (layer) {
    layer.guid = getGUID(layer);
    layerMap.set(layer.guid, layer);
  });
  return layerMap;
}



function replaceGuids(searchGuid, nextObject) {
  if (!searchGuid) {
    return;
  }
  if (!nextObject) {
    return;
  }

  var parentObject = haveGuidsObjectByGuid(searchGuid);

  if (parentObject && Array.isArray(parentObject.guids)) {
    parentObject.guids = parentObject.guids.filter(guid => guid !== searchGuid);
    var nextGuid = getGUID(nextObject);
    parentObject.guids.push(nextGuid);
  } else {
  }
}

function haveGuidsObjectByGuid(searchGuid) {
  if( !searchGuid){
    return null;
  }

  var layers = canvas.getObjects();
  var matchingObject = layers.find(layer => layer.guids && layer.guids.includes(searchGuid));
  return matchingObject;
}

function getObjectByGUID(searchGuid) {
  if( !searchGuid){
    return;
  }
  
  var layers = canvas.getObjects();
  var matchingObject = layers.find(layer => layer.guid === guid);
  return matchingObject;
}

function removeClipPath(activeObject, action) {
  // let clipPath = activeObject.clipPath;
  // if (!clipPath || !clipPath.points) {
  //   console.error('ClipPath or clipPath.points not found');
  //   return;
  // }

  // const canvas = activeObject.canvas;
  // const canvasWidth = canvas.getWidth();
  // const canvasHeight = canvas.getHeight();

  // function calculatePoint(point) {
  //   return {
  //     x: clipPath.left + point.x * clipPath.scaleX,
  //     y: clipPath.top + point.y * clipPath.scaleY
  //   };
  // }

  // let points = [];
  // for (let i = 0; i < clipPath.points.length; i++) {
  //   points.push(calculatePoint(clipPath.points[i]));
  // }

  // let minX = points[0].x, maxX = points[0].x;
  // let minY = points[0].y, maxY = points[0].y;
  // for (let i = 1; i < points.length; i++) {
  //   minX = Math.min(minX, points[i].x);
  //   maxX = Math.max(maxX, points[i].x);
  //   minY = Math.min(minY, points[i].y);
  //   maxY = Math.max(maxY, points[i].y);
  // }

  // let leftTop = { x: minX, y: minY };
  // let rightTop = { x: maxX, y: minY };
  // let rightBottom = { x: maxX, y: maxY };
  // let leftBottom = { x: minX, y: maxY };
  // var nextPoints = [];

  switch (action) {
    case 'clearAllClipPaths':
      activeObject.clipPath = undefined;
      activeObject.removeSettings();
      break;
    // case 'clearTopClipPath':
    //   leftTop.y  = 0;
    //   rightTop.y = 0;
    //   break;
    // case 'clearBottomClipPath':
    //   leftTop.y  = canvas.getHeight();
    //   rightTop.y = canvas.getHeight();
    //   break;
    // case 'clearLeftClipPath':
    //   leftTop.x  = 0;
    //   rightTop.x = 0;
    //   break;
    // case 'clearRightClipPath':
    //   leftTop.x  = canvas.getWidth();;
    //   rightTop.x = canvas.getWidth();;
    //   break;
    default:
      console.error(`[removeClipPath] Error: Unknown action "${action}"`);
      return;
  }

  if (activeObject.clipPath) {
    activeObject.clipPath.initial = {
      left: clipPath.left,
      top: clipPath.top,
      scaleX: clipPath.scaleX,
      scaleY: clipPath.scaleY,
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
    };
  }
  if (canvas) {
    canvas.requestRenderAll();
  }
}





function getPathPoints(path) {
  return path.path.map(cmd => cmd[0] === "M" || cmd[0] === "L" ? { x: cmd[1], y: cmd[2] } : null).filter(point => point !== null);
}

function calculateTransformedPath(originalPoints, transform) {
  const angleRad = transform.angle * Math.PI / 180;
  const sin = Math.sin(angleRad);
  const cos = Math.cos(angleRad);

  const matrix = [
      transform.scaleX * cos, -transform.scaleY * sin,
      transform.scaleX * sin, transform.scaleY * cos,
      0, 0
  ];

  var top = 0;
  var left = 0;
  if( transform.left != transform.initLeft ){
    left = transform.left;
  }
  if( transform.top != transform.initTop ){
    top = transform.top;
  }
  console.log( "calculateTransformedPath transform.initLeft, transform.initTop", transform.initLeft, transform.initTop);
  console.log( "calculateTransformedPath transform.left, transform.top", transform.left, transform.top);
  console.log( "calculateTransformedPath left, top", left, top);

  return {
      fullTransformMatrix: transform.calcTransformMatrix(),
      transformedPoints: originalPoints.map(point => ({
          x: point.x * matrix[0] + point.y * matrix[2] + left,
          y: point.x * matrix[1] + point.y * matrix[3] + top
      })),
      transformMatrix: matrix
  };
}

function getObjectCount() {
  var objescts = canvas.getObjects();
  if( objescts ){
    return objescts.length;
  }else{
    return 0;
  }
}


function getObjectList(){
  var objescts = canvas.getObjects();
  var resultList = [];
  if( objescts ){
    return objescts;
  }else{
    return resultList;
  }
}



function getImageObjectList(){
  var objescts = canvas.getObjects();
  var resultList = [];
  if( objescts ){
    objescts.forEach(element => {
      if( isImage(element) ){
        resultList.push(element);
      }
    });
    return resultList;
  }
}

function getPanelObjectList(){
  var objescts = canvas.getObjects();
  var resultList = [];
  if( objescts ){
    objescts.forEach(element => {
      if( isPanel(element) ){
        resultList.push(element);
      }
    });
    return resultList;
  }
}

function getRandomPanel(){
  var panelList = getPanelObjectList();
  if (!panelList || panelList.length === 0) {
    return null;
  }
  var randomIndex = Math.floor(Math.random() * panelList.length);
  return panelList[randomIndex];
}

function getPanelCoordinates(panel) {
  const points = panel.points;
  const coords = points.map(point => {
    const scaledX = point.x * panel.scaleX;
    const scaledY = point.y * panel.scaleY;
    
    let rotatedX = scaledX;
    let rotatedY = scaledY;
    if (panel.angle) {
      const radian = panel.angle * Math.PI / 180;
      rotatedX = scaledX * Math.cos(radian) - scaledY * Math.sin(radian);
      rotatedY = scaledX * Math.sin(radian) + scaledY * Math.cos(radian);
    }
    
    return {
      x: rotatedX + panel.left,
      y: rotatedY + panel.top
    };
  });
 
//   console.log(`
//  実際の座標情報:
//   点1: x1=${coords[0].x.toFixed(2)}, y1=${coords[0].y.toFixed(2)}
//   点2: x2=${coords[1].x.toFixed(2)}, y2=${coords[1].y.toFixed(2)}
//   点3: x3=${coords[2].x.toFixed(2)}, y3=${coords[2].y.toFixed(2)}
//   点4: x4=${coords[3].x.toFixed(2)}, y4=${coords[3].y.toFixed(2)}
  
//   left=${panel.left}, top=${panel.top}
//   scaleX=${panel.scaleX}, scaleY=${panel.scaleY}
//   angle=${panel.angle}度
//  `);
 
  return coords;
 }



function getImageObjectListByLayerChecked(){
  var resultList = getImageObjectList();
  return resultList.filter(layer => layer.layerCheck);
}


function fitImageToCanvas(fabricImage) {
  const canvasWidth  = canvas.width;
  const canvasHeight = canvas.height;

  const imageWidth   = fabricImage.width;
  const imageHeight  = fabricImage.height;

  let scale = Math.min((canvasWidth / imageWidth), (canvasHeight / imageHeight));

  fabricImage.scaleX = scale;
  fabricImage.scaleY = scale;

  fabricImage.set({
    left: 0,
    top:  0
  });

  saveInitialState(fabricImage);
  canvas.renderAll();
}

function getCenterXByFabricObject(obj) {
  return obj.left + (obj.width * obj.scaleX) / 2;
}

function getCenterYByFabricObject(obj) {
  return obj.top + (obj.height * obj.scaleY) / 2;
}

function getPointAtDistance(startX, startY, angle, distance){
  const x = startX + Math.cos(angle) * distance;
  const y = startY + Math.sin(angle) * distance;
  return { x, y };
};


function getLastObject(){
  var activeObject = canvas.getActiveObject();
  if(activeObject){
    return activeObject;
  }else{
    return lastCheckObject;
  }
}


let initMessageText=null;
function initMessage(){
  // const message = "Drop or Generate";
  const message = getText("canvasInitMessage");
  const text = new fabric.IText(message, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontSize: 30,
      opacity: 0.25,
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
      selectable: false,
      hoverCursor: 'default'
  });
  
  setNotSave(text);
  canvas.add(text);
  initMessageText = text;
  canvas.renderAll();
}

function isSpeechBubbleSVG(obj){
  if (obj && obj.customType && obj.customType==='speechBubbleSVG') {
    return true;
  }
  return false;
}
function isSpeechBubbleText(obj){
  if (obj && obj.customType && obj.customType==='speechBubbleText') {
    return true;
  }
  return false;
}

function isSpeechBubbleRect(obj){
  if (obj && obj.customType && obj.customType==='speechBubbleRect') {
    return true;
  }
  return false;
}

function getRectTargetObject(obj){
  const targetObj = obj.targetObject;
  const rect = canvas.getObjects().find(obj => obj.type === 'rect' && obj.targetObject === targetObj);
  return rect;
}
