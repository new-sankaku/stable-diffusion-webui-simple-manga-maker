

// 透明でない部分の境界を見つける関数
function findNonTransparentBounds(imageData) {
  const { width, height, data } = imageData;
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

// クリッピングされた部分のみを含む新しいキャンバスを作成する関数
function createClippedCanvas(sourceCanvas, bounds) {
  const { minX, minY, maxX, maxY } = bounds;
  const clipWidth = maxX - minX + 1;
  const clipHeight = maxY - minY + 1;

  const clippedCanvas = document.createElement('canvas');
  clippedCanvas.width = clipWidth;
  clippedCanvas.height = clipHeight;
  const clippedCtx = clippedCanvas.getContext('2d');
  clippedCtx.drawImage(sourceCanvas, minX, minY, clipWidth, clipHeight, 0, 0, clipWidth, clipHeight);

  return clippedCanvas;
}

// メイン関数
function sendHtmlCanvas2FabricCanvas(blendedCanvas, quality = 0.98) {
  const ctx = blendedCanvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, blendedCanvas.width, blendedCanvas.height);
  const bounds = findNonTransparentBounds(imageData);
  if (bounds.minX > bounds.maxX || bounds.minY > bounds.maxY) {
    console.warn('The image is completely transparent');
    return;
  }
  const clippedCanvas = createClippedCanvas(blendedCanvas, bounds);
  const webpDataUrl = clippedCanvas.toDataURL('image/webp', quality);
  fabric.Image.fromURL(webpDataUrl, (img) => {
    img.scaleToWidth(canvas.width);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  }, { crossOrigin: 'anonymous' });
}


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



function canvas2DataURL(multiplier, format) {
	return canvas.toDataURL({
			format: format,
			multiplier: multiplier
	});
}


function getCropAndDownloadLinkByMultiplier(multiplier, format) {
	var cropped = canvas.toDataURL({
			format: format,
			multiplier: multiplier
	});

	function getFormattedDateTime() {
			var date = new Date();
			var yyyy = date.getFullYear();
			var MM = ('0' + (date.getMonth() + 1)).slice(-2);
			var dd = ('0' + date.getDate()).slice(-2);
			var hh = ('0' + date.getHours()).slice(-2);
			var mm = ('0' + date.getMinutes()).slice(-2);
			var ss = ('0' + date.getSeconds()).slice(-2);
			var SSS = ('00' + date.getMilliseconds()).slice(-3);
			return `${yyyy}${MM}${dd}_${hh}${mm}${ss}_${SSS}`;
	}

	var link = document.createElement('a');
	link.download = getFormattedDateTime() + '_SP-MangaEditor.png';
	link.href = cropped;
	return link;
}
function getCropAndDownloadLink() {
	var a5WidthInches = 148 / 25.4;
	var a5HeightInches = 210 / 25.4;
	
	var dpi = parseFloat($('outputDpi').value);
	var canvasWidthPixels = canvas.width;
	var canvasHeightPixels = canvas.height;
	
	var targetWidthPixels = a5WidthInches * dpi;
	var targetHeightPixels = a5HeightInches * dpi;
	
	if (canvasWidthPixels > canvasHeightPixels) {
		targetWidthPixels = a5HeightInches * dpi;
		targetHeightPixels = a5WidthInches * dpi;
	}
	
	var multiplierWidth = targetWidthPixels / canvasWidthPixels;
	var multiplierHeight = targetHeightPixels / canvasHeightPixels;
	var multiplier = Math.max(multiplierWidth, multiplierHeight);
	
	return getCropAndDownloadLinkByMultiplier(multiplier, 'png');
}


function clipCopy() {
	removeGrid();
	var link = getCropAndDownloadLink();
	fetch(link.href)
		.then(res => res.blob())
		.then(blob => {
			const item = new ClipboardItem({ "image/png": blob });
			navigator.clipboard.write([item]).then(function () {
				createToast("Success", "Image copied to clipboard successfully!");
			}, function (error) {
				createToastError("Error", "Unable to write to clipboard. Error");
			});
		});
	if (isGridVisible) {
		drawGrid();
		isGridVisible = true;
	}
}

function cropAndDownload() {
	removeGrid();
	var link = getCropAndDownloadLink();
	link.click();
	if (isGridVisible) {
		drawGrid();
		isGridVisible = true;
	}
}


function getLink(dataURL) {
	const link = document.createElement('a');
	link.href = dataURL;
	link.download = 'selected-image.png';
	return link;
}



function getWidth(fabricImage) {
  const img = fabricImage.getElement();
  if (img.naturalWidth) {
    return img.naturalWidth;
  } else {
    return fabricImage.width;
  }
}

function getHeight(fabricImage) {
  const img = fabricImage.getElement();
  if (img.naturalHeight) {
    return img.naturalHeight;
  } else {
    return fabricImage.height;
  }
}


