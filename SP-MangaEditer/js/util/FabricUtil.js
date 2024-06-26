function isPanel(activeObject) {
  return (activeObject && activeObject.isPanel);
}
function isPanelType(activeObject) {
  return (activeObject && ["rect", "circle", "polygon"].includes(activeObject.type));
}

function isImage(activeObject) {
  return (activeObject && (activeObject.type === "image"));
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
  object.isPanel = text2img_initPrompt.isPanel;
  object.text2img_prompt = text2img_initPrompt.text2img_prompt;
  object.text2img_negativePrompt = text2img_initPrompt.text2img_negativePrompt;
  object.text2img_seed = text2img_initPrompt.text2img_seed;
  object.text2img_width = text2img_initPrompt.text2img_width;
  object.text2img_height = text2img_initPrompt.text2img_height;
  object.text2img_samplingSteps = text2img_initPrompt.text2img_samplingSteps;
}
function setImage2ImageInitPrompt(object) {
  object.text2img_prompt = img2img_initPrompt.img2img_prompt;
  object.text2img_negativePrompt = img2img_initPrompt.img2img_negativePrompt;
  object.text2img_seed = img2img_initPrompt.img2img_seed;
  object.text2img_width = img2img_initPrompt.img2img_width;
  object.text2img_height = img2img_initPrompt.img2img_height;
  object.text2img_samplingSteps = img2img_initPrompt.img2img_samplingSteps;
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
  object.name = srcObject.name;
  object.isPanel = srcObject.isPanel;
  object.text2img_prompt = srcObject.text2img_prompt;
  object.text2img_negativePrompt = srcObject.text2img_negativePrompt;
  object.text2img_seed = srcObject.text2img_seed;
  object.text2img_width = srcObject.text2img_width;
  object.text2img_height = srcObject.text2img_height;
  object.text2img_samplingSteps = srcObject.text2img_samplingSteps;
  object.img2img_prompt = srcObject.img2img_prompt;
  object.img2img_negativePrompt = srcObject.img2img_negativePrompt;
  object.img2img_seed = srcObject.img2img_seed;
  object.img2img_width = srcObject.img2img_width;
  object.img2img_height = srcObject.img2img_height;
  object.img2img_samplingSteps = srcObject.img2img_samplingSteps;
  object.img2img_denoising_strength = srcObject.img2img_denoising_strength;
  object.top = srcObject.top;
  object.left = srcObject.left;
  object.scaleX = srcObject.scaleX;
  object.scaleY = srcObject.scaleY;
  object.width = srcObject.width;
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


        var strokeWidth = (activeObject.strokeWidth || 0) * Math.max(activeObject.scaleX, activeObject.scaleY);
        // var strokeOffset = strokeWidth / 2;

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