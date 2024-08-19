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
  document.getElementById("glfxHalftoneSize").value = 2;
  document.getElementById("glfxDotAngle").value = 0;
  document.getElementById("glfxDotSize").value = 2;
  document.getElementById("glfxEdgeRadius").value = 0;
  document.getElementById("glfxHexScale").value = 2;
  document.getElementById("glfxInkStrength").value = 0.2;
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

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("glfxFilter").addEventListener("change", function () {
    var value = this.value;
    document.querySelectorAll(".glfxCcontrol-group").forEach(function (group) {
      group.style.display = "none";
    });
    if (value) {
      document.getElementById(value).style.display = "block";
    }
  });
});

function glfxApplyFilter(filter=null) {
  // console.log("glfxApplyFilter: Start");
  if (!canvas) {
    // console.log("glfxApplyFilter: Canvas is null");
    return;
  }

  var activeObject = canvas.getActiveObject();

  if (activeObject && activeObject.type === "image") {
    // console.log("glfxApplyFilter: Applying filter to object", activeObject);
    glfxApplyFilterToObject(activeObject, filter).then(() => {
      // console.log("glfxApplyFilter: Filter applied to object successfully");
    });
  } else {
    // console.log("glfxApplyFilter: No active image object, applying filter to canvas");
    glfxApplyFilterToCanvas(filter);
  }
}

function glfxApplyFilterToCanvas(filter=null) {
  var fabricCanvas = canvas.upperCanvasEl;
  var img = new Image();
  img.onload = function () {
    fxCanvas = fx.canvas();
    texture = fxCanvas.texture(img);
    fxCanvas.draw(texture);
    applySelectedFilter(fxCanvas, filter);
    fxCanvas.update();
    canvas
      .getContext("2d")
      .drawImage(fxCanvas, 0, 0, canvas.width, canvas.height);
  };
  img.src = fabricCanvas.toDataURL();
}

function glfxApplyFilterToObject(object, filter=null) {
  return new Promise((resolve) => {
    if (!glfxOriginalImage) {
      // console.log("glfxApplyFilterToObject: glfxOriginalImage is null");
      return resolve();
    }

    var img = new Image();
    img.onload = function () {
      // console.log("glfxApplyFilterToObject: Image loaded for filtering");
      fxCanvas = fx.canvas();
      texture = fxCanvas.texture(img);
      fxCanvas.draw(texture);
      applySelectedFilter(fxCanvas, filter);
      fxCanvas.update();
      
      var filteredImage = new Image();
      filteredImage.src = fxCanvas.toDataURL();
      filteredImage.onload = function () {
        // console.log("glfxApplyFilterToObject: Filtered image loaded");
        
        // Log the object state before applying the filter
        // console.log("Before applying filter:", object);

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

        // Log the object state after applying the filter
        // console.log("After applying filter:", object);

        object.set({
          left: left,
          top: top,
          scaleX: scaleX,
          scaleY: scaleY,
          width: width,
          height: height,
        });

        canvas.requestRenderAll();

        // Log to confirm the canvas is rendered
        // console.log("Canvas rendered with filtered image");

        resolve();
      };
    };

    img.src = glfxOriginalImage.src;
  });
}


function applySelectedFilter(fxCanvas, filter=null) {
  // console.log("applySelectedFilter start");
  var isNotAuto = true;
  if(filter){
    isNotAuto = false;
  }else{
    filter = document.getElementById("glfxFilter").value;
  }
  // console.log("applySelectedFilter: Selected filter is", filter);


  switch (filter) {
    case "glfxBrightnessContrast":
      var brightness = 0.29;
      var contrast   = 0.29;

      if( isNotAuto ){
        brightness = parseFloat( document.getElementById("glfxBrightness").value );
        contrast   = parseFloat(document.getElementById("glfxContrast").value);
      }
      // console.log( "glfxBrightnessContrast brightness", brightness );
      // console.log( "glfxBrightnessContrast contrast", contrast );
      fxCanvas.brightnessContrast(brightness, contrast);
      break;
    case "glfxHueSaturation":
      var hue = parseFloat(document.getElementById("glfxHue").value);
      var saturation = parseFloat(document.getElementById("glfxSaturation").value);

      // console.log("glfxHueSaturation hue", hue);
      // console.log("glfxHueSaturation saturation", saturation);

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
      var dotAngle = 1.1;
      var dotSize = 1.6;

      if( isNotAuto ){
        dotAngle = parseFloat(document.getElementById("glfxDotAngle").value);
        dotSize = parseFloat(document.getElementById("glfxDotSize").value);
      }
      // console.log("dotAngle", dotAngle)
      // console.log("dotSize", dotSize)

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
      var inkStrength = 0.26;
      if( isNotAuto ){
        inkStrength = parseFloat( document.getElementById("glfxInkStrength").value );
      }
      // console.log("applySelectedFilter: Ink strength is", inkStrength);

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
  // console.log("applySelectedFilter: Filter applied and canvas updated");

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

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll(".glfxControls input").forEach(function (input) {
    input.addEventListener( "input", debounceGlfx(function () {
        var activeObject = canvas.getActiveObject();
        if (!glfxOriginalImage && activeObject && activeObject.type === "image") {
          glfxOriginalImage = activeObject.getElement();
        }

        if (!activeObject) {
          createToast("Select Image!");
          return;
        }

        changeDoNotSaveHistory();
        if (glfxOriginalImage) {
          glfxCopiedImage = glfxOriginalImage.cloneNode();
          glfxApplyFilter();
        }
        changeDoSaveHistory();
      }, 100)
    );
  });

  document.getElementById("glfxApplyButton").addEventListener("click", function () {
    glfxApply();
  });

  document.getElementById("glfxResetButton").addEventListener("click", function () {
      glfxReset();
    });
});

function glfxApply() {
  if (glfxCopiedImage) {
    glfxOriginalImage = glfxCopiedImage.cloneNode();
    glfxCopiedImage = null;
    glfxOriginalImage = null;
    glfxResetFilterValues();
    saveStateByManual();
  }
}

function glfxReset() {
  if (glfxOriginalImage) {
    var imgObj = new Image();
    imgObj.onload = function () {
      var img = new fabric.Image(imgObj);
      var activeObject = lastActiveObjectState;
      if (activeObject && activeObject.type === "image") {
        var copyObject = {};
        copy(activeObject, copyObject);
        copy(copyObject, img);
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