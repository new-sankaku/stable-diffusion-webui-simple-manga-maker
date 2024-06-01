var glfxOriginalImage = null;
var glfxCopiedImage = null;

function glfxResetFilterValues() {
  document.getElementById("glfxBrightness").value = 0;
  document.getElementById("glfxContrast").value = 0;
  document.getElementById("glfxHue").value = 0;
  document.getElementById("glfxSaturation").value = 0;
  document.getElementById("glfxSepiaAmount").value = 0;
  document.getElementById("glfxUnsharpRadius").value = 0;
  document.getElementById("glfxUnsharpStrength").value = 0;
  document.getElementById("glfxVibranceAmount").value = 0;
  document.getElementById("glfxVignetteSize").value = 0;
  document.getElementById("glfxVignetteAmount").value = 0;
  document.getElementById("glfxBlurRadius").value = 0;
  document.getElementById("glfxBlurBrightness").value = 0;
  document.getElementById("glfxBlurAngle").value = 0;
  document.getElementById("glfxStartX").value = 0.5;
  document.getElementById("glfxStartY").value = 0.5;
  document.getElementById("glfxEndX").value = 0.5;
  document.getElementById("glfxEndY").value = 0.5;
  document.getElementById("glfxTiltBlurRadius").value = 0;
  document.getElementById("glfxGradientRadius").value = 0.5;
  document.getElementById("glfxTriangleRadius").value = 0;
  document.getElementById("glfxZoomCenterX").value = 0.5;
  document.getElementById("glfxZoomCenterY").value = 0.5;
  document.getElementById("glfxZoomStrength").value = 0;
  document.getElementById("glfxHalftoneAngle").value = 0;
  document.getElementById("glfxHalftoneSize").value = 10;
  document.getElementById("glfxDotAngle").value = 0;
  document.getElementById("glfxDotSize").value = 10;
  document.getElementById("glfxEdgeRadius").value = 0;
  document.getElementById("glfxHexScale").value = 10;
  document.getElementById("glfxInkStrength").value = 0;
  document.getElementById("glfxBulgeCenterX").value = 500;
  document.getElementById("glfxBulgeCenterY").value = 500;
  document.getElementById("glfxBulgeRadius").value = 0;
  document.getElementById("glfxBulgeStrength").value = 0;
  document.getElementById("glfxSwirlCenterX").value = 256;
  document.getElementById("glfxSwirlCenterY").value = 256;
  document.getElementById("glfxSwirlRadius").value = 0;
  document.getElementById("glfxSwirlAngle").value = 0;
}

var fxCanvas, texture;

document.getElementById("glfxFilter").addEventListener("change", function () {
  var value = this.value;
  document.querySelectorAll(".glfxCcontrol-group").forEach(function (group) {
    group.style.display = "none";
  });
  if (value) {
    document.getElementById(value).style.display = "block";
  }
});

function glfxApplyFilter() {
  if (!canvas) return;

  var activeObject = canvas.getActiveObject();

  if (activeObject && activeObject.type === "image") {
    glfxApplyFilterToObject(activeObject);
  } else {
    glfxApplyFilterToCanvas();
  }
}

function glfxApplyFilterToCanvas() {
  var fabricCanvas = canvas.upperCanvasEl;
  var img = new Image();
  img.onload = function () {
    fxCanvas = fx.canvas();
    texture = fxCanvas.texture(img);
    fxCanvas.draw(texture);
    applySelectedFilter(fxCanvas);
    fxCanvas.update();
    canvas
      .getContext("2d")
      .drawImage(fxCanvas, 0, 0, canvas.width, canvas.height);
  };
  img.src = fabricCanvas.toDataURL();
}
function glfxApplyFilterToObject(object) {
  if (!glfxOriginalImage) return;

  var img = new Image();
  img.onload = function () {
    fxCanvas = fx.canvas();
    texture = fxCanvas.texture(img);
    fxCanvas.draw(texture);
    applySelectedFilter(fxCanvas);
    fxCanvas.update();
    var filteredImage = new Image();
    filteredImage.src = fxCanvas.toDataURL();
    filteredImage.onload = function () {
      var top = object.top;
      var left = object.left;
      var scaleX = object.scaleX;
      var scaleY = object.scaleY;
      var width = object.width;
      var height = object.height;

      object.setElement(filteredImage);
      object.top = top;
      object.left = left;
      object.scaleX = scaleX;
      object.scaleY = scaleY;
      object.width = width;
      object.height = height;

      object.set({
        left: left,
        top: top,
        scaleX: scaleX,
        scaleY: scaleY,
        width: width,
        height: height,
      });

      canvas.requestRenderAll();
    };
  };
  img.src = glfxOriginalImage.src;
}

function applySelectedFilter(fxCanvas) {
  var filter = document.getElementById("glfxFilter").value;
  switch (filter) {
    case "glfxBrightnessContrast":
      var brightness = parseFloat(
        document.getElementById("glfxBrightness").value
      );
      var contrast = parseFloat(document.getElementById("glfxContrast").value);
      fxCanvas.brightnessContrast(brightness, contrast);
      break;
    case "glfxHueSaturation":
      var hue = parseFloat(document.getElementById("glfxHue").value);
      var saturation = parseFloat(
        document.getElementById("glfxSaturation").value
      );
      fxCanvas.hueSaturation(hue, saturation);
      break;
    case "glfxSepia":
      var amount = parseFloat(document.getElementById("glfxSepiaAmount").value);
      fxCanvas.sepia(amount);
      break;
    case "glfxUnsharpMask":
      var radius = parseFloat(
        document.getElementById("glfxUnsharpRadius").value
      );
      var strength = parseFloat(
        document.getElementById("glfxUnsharpStrength").value
      );
      fxCanvas.unsharpMask(radius, strength);
      break;
    case "glfxVibrance":
      var vibranceAmount = parseFloat(
        document.getElementById("glfxVibranceAmount").value
      );
      fxCanvas.vibrance(vibranceAmount);
      break;
    case "glfxVignette":
      var vignetteSize = parseFloat(
        document.getElementById("glfxVignetteSize").value
      );
      var vignetteAmount = parseFloat(
        document.getElementById("glfxVignetteAmount").value
      );
      fxCanvas.vignette(vignetteSize, vignetteAmount);
      break;
    case "glfxLensBlur":
      var blurRadius = parseFloat(
        document.getElementById("glfxBlurRadius").value
      );
      var blurBrightness = parseFloat(
        document.getElementById("glfxBlurBrightness").value
      );
      var blurAngle = parseFloat(
        document.getElementById("glfxBlurAngle").value
      );
      fxCanvas.lensBlur(blurRadius, blurBrightness, blurAngle);
      break;
    case "glfxTiltShift":
      var startX = parseFloat(document.getElementById("glfxStartX").value);
      var startY = parseFloat(document.getElementById("glfxStartY").value);
      var endX = parseFloat(document.getElementById("glfxEndX").value);
      var endY = parseFloat(document.getElementById("glfxEndY").value);

      var tiltBlurRadius = parseFloat(
        document.getElementById("glfxTiltBlurRadius").value
      );
      var gradientRadius = parseFloat(
        document.getElementById("glfxGradientRadius").value
      );
      fxCanvas.tiltShift(
        startX,
        startY,
        endX,
        endY,
        tiltBlurRadius,
        gradientRadius
      );
      break;
    case "glfxTriangleBlur":
      var triangleRadius = parseFloat(
        document.getElementById("glfxTriangleRadius").value
      );
      fxCanvas.triangleBlur(triangleRadius);
      break;
    case "glfxZoomBlur":
      var zoomCenterX = parseFloat(
        document.getElementById("glfxZoomCenterX").value
      );
      var zoomCenterY = parseFloat(
        document.getElementById("glfxZoomCenterY").value
      );
      var zoomStrength = parseFloat(
        document.getElementById("glfxZoomStrength").value
      );
      fxCanvas.zoomBlur(zoomCenterX, zoomCenterY, zoomStrength);
      break;
    case "glfxColorHalftone":
      var halftoneCenterX = 100;
      var halftoneCenterY = 100;
      var halftoneAngle = parseFloat(
        document.getElementById("glfxHalftoneAngle").value
      );
      var halftoneSize = parseFloat(
        document.getElementById("glfxHalftoneSize").value
      );
      fxCanvas.colorHalftone(
        halftoneCenterX,
        halftoneCenterY,
        halftoneAngle,
        halftoneSize
      );
      break;
    case "glfxDotScreen":
      var dotCenterX = 1;
      var dotCenterY = 1;
      var dotAngle = parseFloat(document.getElementById("glfxDotAngle").value);
      var dotSize = parseFloat(document.getElementById("glfxDotSize").value);
      fxCanvas.dotScreen(dotCenterX, dotCenterY, dotAngle, dotSize);
      break;
    case "glfxEdgeWork":
      var edgeRadius = parseFloat(
        document.getElementById("glfxEdgeRadius").value
      );
      fxCanvas.edgeWork(edgeRadius);
      break;
    case "glfxHexagonalPixelate":
      var hexCenterX = 1;
      var hexCenterY = 1;
      var hexScale = parseFloat(document.getElementById("glfxHexScale").value);
      fxCanvas.hexagonalPixelate(hexCenterX, hexCenterY, hexScale);
      break;
    case "glfxInk":
      var inkStrength = parseFloat(
        document.getElementById("glfxInkStrength").value
      );
      fxCanvas.ink(inkStrength);
      break;
    case "glfxBulgePinch":
      var bulgeCenterX = parseFloat(
        document.getElementById("glfxBulgeCenterX").value
      );
      var bulgeCenterY = parseFloat(
        document.getElementById("glfxBulgeCenterY").value
      );
      var bulgeRadius = parseFloat(
        document.getElementById("glfxBulgeRadius").value
      );
      var bulgeStrength = parseFloat(
        document.getElementById("glfxBulgeStrength").value
      );
      fxCanvas.bulgePinch(
        bulgeCenterX,
        bulgeCenterY,
        bulgeRadius,
        bulgeStrength
      );
      break;
    case "glfxSwirl":
      var swirlCenterX = parseFloat(
        document.getElementById("glfxSwirlCenterX").value
      );
      var swirlCenterY = parseFloat(
        document.getElementById("glfxSwirlCenterY").value
      );
      var swirlRadius = parseFloat(
        document.getElementById("glfxSwirlRadius").value
      );
      var swirlAngle = parseFloat(
        document.getElementById("glfxSwirlAngle").value
      );
      fxCanvas.swirl(swirlCenterX, swirlCenterY, swirlRadius, swirlAngle);
      break;
  }
}

function debounceGlfx(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

document.querySelectorAll(".glfxControls input").forEach(function (input) {
  input.addEventListener(
    "input",
    debounceGlfx(function () {
      var activeObject = canvas.getActiveObject();
      if (!glfxOriginalImage && activeObject && activeObject.type === "image") {
        glfxOriginalImage = activeObject.getElement();
      }

      if (!activeObject) {
        createToast("Select Image!");
        return;
      }

      isUndoRedoOperation = true;
      if (glfxOriginalImage) {
        glfxCopiedImage = glfxOriginalImage.cloneNode();
        glfxApplyFilter();
      }
      isUndoRedoOperation = false;
    }, 100)
  );
});

document
  .getElementById("glfxApplyButton")
  .addEventListener("click", function () {
    if (glfxCopiedImage) {
      glfxOriginalImage = glfxCopiedImage.cloneNode();
      glfxCopiedImage = null;
      glfxOriginalImage = null;
      glfxResetFilterValues();
      saveStateByManual();
    }
  });

document
  .getElementById("glfxResetButton")
  .addEventListener("click", function () {
    glfxReset();
  });

function glfxReset() {
  if (glfxOriginalImage) {
    var imgObj = new Image();
    imgObj.onload = function () {
      var img = new fabric.Image(imgObj);

      var activeObject = lastActiveObjectState;

      // console.log("activeObject", activeObject);
      if (activeObject && activeObject.type === "image") {
        var copyObject = {};
        copy(activeObject, copyObject);
        copy(copyObject, img);
      } else {
      }

      canvas.remove(activeObject);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      lastActiveObjectState = null;
      glfxCopiedImage = null;
      glfxOriginalImage = null;
      glfxResetFilterValues();
      lastActiveObjectState = canvas.getActiveObject();
    };
    imgObj.src = glfxOriginalImage.src;
  }
}
