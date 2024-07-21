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
  return (activeObject && (activeObject.type === 'i-text' || activeObject.type === "text" || activeObject.type === "textbox" || activeObject.type === "verticalText"));
}

function isVerticalText(activeObject) {
  return (activeObject && (activeObject.type === "verticalText"));
}

function isHorizontalText(activeObject) {
  return (activeObject && (activeObject.type === 'i-text' || activeObject.type === "text" || activeObject.type === "textbox"));
}

function isLine(activeObject) {
  return (activeObject && activeObject.type === 'line');
}

function isGroup(activeObject) {
  return (activeObject && activeObject.type === 'group');
}

function isShapes(activeObject) {
  return (activeObject && ['rect', 'circle', 'triangle', 'polygon'].includes(activeObject.type));
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
  object.isPanel                  = t2i_init.isPanel;
  object.text2img_prompt          = t2i_init.t2i_prompt;
  object.text2img_negativePrompt  = t2i_init.t2i_negativePrompt;
  object.text2img_seed            = t2i_init.t2i_seed;
  object.text2img_width           = t2i_init.t2i_width;
  object.text2img_height          = t2i_init.t2i_height;
  object.text2img_samplingSteps   = t2i_init.t2i_samplingSteps;
}
function setImage2ImageInitPrompt(object) {
  object.text2img_prompt            = i2i_init.i2i_prompt;
  object.text2img_negativePrompt    = i2i_init.i2i_negativePrompt;
  object.text2img_seed              = i2i_init.i2i_seed;
  object.text2img_width             = i2i_init.i2i_width;
  object.text2img_height            = i2i_init.i2i_height;
  object.text2img_samplingSteps     = i2i_init.i2i_samplingSteps;
  object.img2img_denoising_strength = i2i_init.i2i_denoising_strength;
  object.img2imgScale               = i2i_init.i2i_scale;
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
  object.name                         = srcObject.name;
  object.isPanel                      = srcObject.isPanel;
  object.text2img_prompt              = srcObject.text2img_prompt;
  object.text2img_negativePrompt      = srcObject.text2img_negativePrompt;
  object.text2img_seed                = srcObject.text2img_seed;
  object.text2img_width               = srcObject.text2img_width;
  object.text2img_height              = srcObject.text2img_height;
  object.text2img_samplingSteps       = srcObject.text2img_samplingSteps;

  object.img2img_prompt               = srcObject.img2img_prompt;
  object.img2img_negativePrompt       = srcObject.img2img_negativePrompt;
  object.img2img_seed                 = srcObject.img2img_seed;
  object.img2img_width                = srcObject.img2img_width;
  object.img2img_height               = srcObject.img2img_height;
  object.img2img_samplingSteps        = srcObject.img2img_samplingSteps;
  object.img2img_denoising_strength   = srcObject.img2img_denoising_strength;
  object.img2imgScale                 = srcObject.img2imgScale;
  
  object.top    = srcObject.top;
  object.left   = srcObject.left;
  object.scaleX = srcObject.scaleX;
  object.scaleY = srcObject.scaleY;
  object.width  = srcObject.width;
  object.height = srcObject.height

  object.guid = srcObject.guid
  object.guids = srcObject.guids
  object.tempPrompt = srcObject.tempPrompt
  object.tempNegativePrompt = srcObject.tempNegativePrompt
  object.tempSeed = srcObject.tempSeed

  object.clipPath = srcObject.clipPath ? srcObject.clipPath : undefined;

  if (srcObject.clipPath && srcObject.clipPath.initial) {
    object.clipPath.initial = srcObject.clipPath.initial ? srcObject.clipPath.initial : undefined;
  }
  object.initial = srcObject.initial ? srcObject.initial : undefined;
}


function imageObject2Base64ImageEffectKeep(layer, scaleFactor = layer.img2imgScale) {
  const { width, height, scaleX, scaleY, clipPath, left, top } = layer;
  const offscreenCanvas = createOffscreenCanvas(width * scaleX * scaleFactor, height * scaleY * scaleFactor);
  renderLayerToCanvas(offscreenCanvas, layer, scaleFactor, left, top);
  return offscreenCanvas.toDataURL('image/png');
}

function createOffscreenCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function renderLayerToCanvas(canvas, layer, scaleFactor, left, top) {
  const ctx = canvas.getContext('2d');
  const originalClipPath = layer.clipPath;
  layer.clipPath = null;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scaleFactor, scaleFactor);
  ctx.translate(-left, -top);
  layer.render(ctx);

  layer.clipPath = originalClipPath;
}

function imageObject2Base64Image(object) {
  imageObject2Base64Image(object, 1.0);
}

function imageObject2Base64Image(object, scale) {
  try {
    const src = object.getSrc();
    if (!src) {
      throw new Error("Image source is not defined.");
    }

    const imageFormat = src.split('.').pop().toLowerCase();
    const supportedFormats = ['png', 'jpeg', 'jpg', 'webp'];
    const format = supportedFormats.includes(imageFormat) ? imageFormat : 'png';

    const base64Image = object.toDataURL({
      format: format,
      quality: scale
    });

    return base64Image;
  } catch (error) {
    console.error("Error converting image object to Base64:", error);
    return null;
  }
}

function imageObject2DataURL(activeObject) {
  if (activeObject && activeObject.type === 'image') {
      const originalWidth = activeObject.width;
      const originalHeight = activeObject.height;
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');
      tempCanvas.width = originalWidth;
      tempCanvas.height = originalHeight;
      tempContext.drawImage(activeObject.getElement(), 0, 0, originalWidth, originalHeight);
      return tempCanvas.toDataURL('image/png');
  }
  return null;
}




function imageObject2DataURLByCrop(activeObject) {
  console.log("Function start: imageObject2DataURLByCrop");
  console.log("activeObject:", activeObject);

  if (activeObject && activeObject.isPanel) {
    var dataURL = canvas2DataURL(3, "png");

    return new Promise((resolve, reject) => {
      var image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = dataURL;

      image.onload = function() {
        var tempCanvas = document.createElement('canvas');
        var context = tempCanvas.getContext('2d');
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;
        context.drawImage(image, 0, 0);
        var objectWidth = activeObject.width * activeObject.scaleX;
        var objectHeight = activeObject.height * activeObject.scaleY;
        var objectLeft = activeObject.left;
        var objectTop = activeObject.top;

        console.log("objectWidth  activeObject.strokeWidth",objectWidth, activeObject.strokeWidth );
        console.log("objectHeight activeObject.strokeWidth",objectHeight, activeObject.strokeWidth );

        var scaleX = tempCanvas.width / activeObject.canvas.width;
        var scaleY = tempCanvas.height / activeObject.canvas.height;
        var cropX = (objectLeft) * scaleX;
        var cropY = (objectTop) * scaleY;
        var cropWidth = (objectWidth  * scaleX)  + (activeObject.strokeWidth * scaleX);
        var cropHeight = (objectHeight * scaleY) + (activeObject.strokeWidth * scaleX);
        var cropCanvas = document.createElement('canvas');
        var cropContext = cropCanvas.getContext('2d');
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        cropContext.drawImage(tempCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        var croppedDataURL = cropCanvas.toDataURL("image/png");
        resolve(croppedDataURL);
      };

      image.onerror = function(err) {
        console.error("Image loading error:", err);
        reject(err);
      };
    });
  }
  console.log("Function end: imageObject2DataURLByCrop (no valid activeObject)");
  return Promise.resolve(null);
}



// set targetFram.guids
function setGUID(targetFrame, imageObject) {
  if (!targetFrame.guids) {
    targetFrame.guids = [];
  }
  guid = getGUID(imageObject);
  console.log(targetFrame.name + " : setGUID", guid);
  targetFrame.guids.push(guid);
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
  let clipPath = activeObject.clipPath;
  const canvas = activeObject.canvas;

  // スケールとオフセットを考慮して点を計算する関数
  function calculatePoint(point) {
    return {
      x: activeObject.left + point.x * activeObject.scaleX,
      y: activeObject.top + point.y * activeObject.scaleY
    };
  }

  // 各点を計算
  let points = activeObject.points.map(calculatePoint);

  // x座標とy座標の最小値と最大値を見つける
  let xCoords = points.map(p => p.x);
  let yCoords = points.map(p => p.y);
  let minX = Math.min(...xCoords);
  let maxX = Math.max(...xCoords);
  let minY = Math.min(...yCoords);
  let maxY = Math.max(...yCoords);

  // 頂点座標を計算
  let leftTop = points.find(p => p.x === minX && p.y === minY) || { x: minX, y: minY };
  let rightTop = points.find(p => p.x === maxX && p.y === minY) || { x: maxX, y: minY };
  let rightBottom = points.find(p => p.x === maxX && p.y === maxY) || { x: maxX, y: maxY };
  let leftBottom = points.find(p => p.x === minX && p.y === maxY) || { x: minX, y: maxY };

  // デバッグ用にログ出力
  console.log("Left Top:", leftTop);
  console.log("Right Top:", rightTop);
  console.log("Right Bottom:", rightBottom);
  console.log("Left Bottom:", leftBottom);

  // 元の点の配列をログ出力（デバッグ用）
  console.log("Original points:", points);

  // ここに残りの関数の処理を追加...
  // 例: clipPathの削除やその他の処理
}

// function removeClipPath(activeObject, action) {
//   let clipPath = activeObject.clipPath;
//   const canvas = activeObject.canvas;
//   let points = activeObject.getCoords();

//   let leftTop = { x: points[0].x, y: points[0].y };
//   let rightTop = { x: points[1].x, y: points[1].y };
//   let rightBottom = { x: points[2].x, y: points[2].y };
//   let leftBottom = { x: points[3].x, y: points[3].y };

//   console.log("Left Top:", leftTop);
//   console.log("Right Top:", rightTop);
//   console.log("Right Bottom:", rightBottom);
//   console.log("Left Bottom:", leftBottom);



//   switch (action) {
//     case 'clearAllClipPaths':
//       activeObject.clipPath = null;
//       break;
//     case 'clearTopClipPath':
//       points[0].y = 0;
//       points[1].y = 0;
//       break;
//     case 'clearBottomClipPath':
//       points[2].y = canvas.height;
//       points[3].y = canvas.height;
//       break;
//     case 'clearLeftClipPath':
//       points[0].x = 0;
//       points[3].x = 0;
//       break;
//     case 'clearRightClipPath':
//       points[1].x = canvas.width;
//       points[2].x = canvas.width;
//       break;
//     default:
//       console.error(`[removeClipPath] Error: Unknown action "${action}"`);
//       return;
//   }

//   if (action !== 'clearAllClipPaths') {
//     clipPath.set({ points: points });
//   }

//   if (activeObject.clipPath) {
//     activeObject.clipPath.initial = {
//       left: activeObject.clipPath.left,
//       top: activeObject.clipPath.top,
//       scaleX: activeObject.clipPath.scaleX,
//       scaleY: activeObject.clipPath.scaleY,
//       canvasWidth: canvas.getWidth(),
//       canvasHeight: canvas.getHeight(),
//     };
//   }

//   canvas.requestRenderAll();
// }



