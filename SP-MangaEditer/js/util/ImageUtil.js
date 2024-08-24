var webpQuality = 0.98;

// await img = imgFile2webpFile(img);
async function imgFile2webpFile(file) {
  if (file.type === 'image/webp') {
      return file;
  }
  var options = {
      fileType: 'image/webp',
      initialQuality: webpQuality
  };
  try {
      var compressedFile = await imageCompression(file, options);
      return compressedFile;
  } catch (error) {
      console.error(error);
      throw error;
  }
}




async function img2webp(i) {
  const blob = await fetch(i._element.src).then(response => response.blob());
  const fileType = blob.type;
  const fileName = 'image.' + fileType.split('/')[1];
  const file = new File([blob], fileName, { type: fileType });
  const webpFile = await imgFile2webpFile(file);

  const webpBlob = webpFile.slice(0, webpFile.size, 'image/webp');
  
  // BlobをデータURIに変換
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const webpDataUrl = reader.result;
      const webpImgElement = new Image();
      webpImgElement.src = webpDataUrl;
      webpImgElement.onload = () => {
        const webpImg = {
          ...i,
          _element: webpImgElement,
          _originalElement: webpImgElement,
          cacheKey: 'webp_texture'
        };
        // Copy prototype methods from the original image object
        Object.setPrototypeOf(webpImg, Object.getPrototypeOf(i));
        resolve(webpImg);
      };
    };
    reader.onerror = reject;
    reader.readAsDataURL(webpBlob);
  });
}

function flipHorizontally() {
  var activeObject = canvas.getActiveObject();
  if (isImage(activeObject)) {
    activeObject.set("flipX", !activeObject.flipX);
    canvas.renderAll();
  }
}

function flipVertically() {
  var activeObject = canvas.getActiveObject();
  if (isImage(activeObject)) {
    activeObject.set("flipY", !activeObject.flipY);
    canvas.renderAll();
  }
}



document.addEventListener("DOMContentLoaded", function () {
  $("crop").style.display = "none";

  $("crop").addEventListener("click", function (event) {
    $("crop").style.display = "none";
  
    var left = cropFrame.left - cropActiveObject.left;
    var top = cropFrame.top - cropActiveObject.top;
  
    left *= 1;
    top *= 1;
  
    var width = cropFrame.width * 1;
    var height = cropFrame.height * 1;
  
    cropImage(
      cropActiveObject,
      cropFrame.left,
      cropFrame.top,
      parseInt(cropFrame.scaleY * height),
      parseInt(width * cropFrame.scaleX)
    );
    if (cropModeClear()) {
      return true;
    }
  });

  $("cropMode").addEventListener("click", function () {
    $("crop").style.display = "inline";
    if (canvas.getActiveObject()) {
  
      if (cropModeClear()) {
        return true;
      }
  
      if( isImage(canvas.getActiveObject()) ){
          console.log("canvas.getActiveObject().type", canvas.getActiveObject().type );
      }else{
          createToast("Select Image!", canvas.getActiveObject().type);
          $("crop").style.display = "none";
          return;
      }
  
      cropActiveObject = canvas.getActiveObject();
      cropFrame = new fabric.Rect({
        fill: "rgba(0,0,0,0)",
        originX: "left",
        originY: "top",
        stroke: "rgba(0,0,0,0)",
        strokeWidth: 0,
        width: 1,
        height: 1,
        borderColor: "#36fd00",
        cornerColor: "green",
        hasRotatingPoint: false,
        selectable: true,
      });
  
      cropFrame.left = canvas.getActiveObject().left;
      cropFrame.top = canvas.getActiveObject().top;
      cropFrame.width = canvas.getActiveObject().width * canvas.getActiveObject().scaleX;
      cropFrame.height = canvas.getActiveObject().height * canvas.getActiveObject().scaleY;
  
      canvas.add(cropFrame);
      canvas.setActiveObject(cropFrame);
      canvas.renderAll();
    } else {
      createToast("Select Image!", "");
      $("crop").style.display = "none";
    }
  });
  

});



function cropImage(png, left, top, height, width) {
  if (top < png.top) {
    height = height - (png.top - top);
    top = png.top;
  }
  if (left < png.left) {
    width = width - (png.left - left);
    left = png.left;
  }
  if (top + height > png.top + png.height * png.scaleY)
    height = png.top + png.height * png.scaleY - top;
  if (left + width > png.left + png.width * png.scaleX)
    width = png.left + png.width * png.scaleX - left;

  var tempCanvas = new fabric.Canvas(document.createElement("canvas"));
  tempCanvas.setWidth(png.width * png.scaleX);
  tempCanvas.setHeight(png.height * png.scaleY);

  var clonedObject = fabric.util.object.clone(png);
  clonedObject.set({ left: 0, top: 0 });

  if (clonedObject.clipPath) {
    clonedObject.clipPath = clonedObject.clipPath.clone();
  }

  tempCanvas.add(clonedObject);
  tempCanvas.renderAll();

  fabric.Image.fromURL(
    tempCanvas.toDataURL({ format: "webp", multiplier: 2 }),
    function (img) {
      var scaledLeft = (left - png.left) * 2;
      var scaledTop = (top - png.top) * 2;
      var scaledWidth = width * 2;
      var scaledHeight = height * 2;

      img.set("left", -scaledLeft);
      img.set("top", -scaledTop);
      var canvas_crop = new fabric.Canvas("canvas_crop");
      canvas_crop.setHeight(scaledHeight);
      canvas_crop.setWidth(scaledWidth);
      canvas_crop.add(img);
      canvas_crop.renderAll();

      fabric.Image.fromURL(
        canvas_crop.toDataURL({ format: "webp", multiplier: 1 }),
        function (croppedImg) {
          croppedImg.set({
            left: left,
            top: top,
            scaleX: 0.5,
            scaleY: 0.5,
          });

          if (png.clipPath) {
            var clonedClipPath = fabric.util.object.clone(png.clipPath);
            if (clonedClipPath) {
              croppedImg.clipPath = clonedClipPath;
            }
          }

          replaceGuids(png.guid, croppedImg);
          canvas.add(croppedImg).renderAll();
          canvas.remove(cropActiveObject);
          canvas.setActiveObject(croppedImg);
          canvas.renderAll();
          updateLayerPanel();
        }
      );
    }
  );
}

function getObjLeft(objWidth) {
  return canvas.getWidth() / 2 - objWidth / 2;
}

function getObjTop(objHeight) {
  return canvas.getHeight() / 2 - objHeight / 2;
}
