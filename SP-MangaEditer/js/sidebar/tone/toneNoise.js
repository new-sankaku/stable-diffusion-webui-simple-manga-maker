var tmpCanvasToneNoise = null;
var tmpCtxToneNoise = null;
var nowToneNoise = null;
var isDrawingToneNoise = false;

function toneNoiseStart() {
  var activeObject = canvas.getActiveObject();
  tmpCanvasToneNoise = document.createElement("canvas");

  if (isPanel(activeObject)) {
    var canvasX = activeObject.width * activeObject.scaleX;
    var canvasY = activeObject.height * activeObject.scaleY;
    tmpCanvasToneNoise.width = canvasX * 3;
    tmpCanvasToneNoise.height = canvasY * 3;
  } else {
    tmpCanvasToneNoise.width = canvas.width * 3;
    tmpCanvasToneNoise.height = canvas.height * 3;
  }

  tmpCtxToneNoise = tmpCanvasToneNoise.getContext("2d");
  tmpCtxToneNoise.scale(3, 3);
}

function toneNoiseEnd() {
  nowTone = null;
  if (tmpCanvasToneNoise) {
    if (tmpCanvasToneNoise.parentNode) {
      tmpCanvasToneNoise.parentNode.removeChild(tmpCanvasToneNoise);
    }
  }
  tmpCanvasToneNoise = null;
  tmpCtxToneNoise = null;
  nowToneNoise = null;
  isDrawingTone = false;
}

var toneNoise_colorPicker = null;
var toneNoise_noiseMinSlider = null;
var toneNoise_noiseMaxSlider = null;
var toneNoise_gradientStartX = null;
var toneNoise_gradientStartY = null;
var toneNoise_gradientEndX = null;
var toneNoise_gradientEndY = null;

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function generateNoiseWithGradient(color, noiseMin, noiseMax) {
  const imageData = tmpCtxToneNoise.createImageData(
    tmpCanvasToneNoise.width,
    tmpCanvasToneNoise.height
  );
  const data = imageData.data;
  const rgb = hexToRgb(color);

  const startX = parseInt(toneNoise_gradientStartX.value);
  const startY = parseInt(toneNoise_gradientStartY.value);
  const endX = parseInt(toneNoise_gradientEndX.value);
  const endY = parseInt(toneNoise_gradientEndY.value);

  for (let y = 0; y < tmpCanvasToneNoise.height; y++) {
    for (let x = 0; x < tmpCanvasToneNoise.width; x++) {
      const index = (y * tmpCanvasToneNoise.width + x) * 4;

      const dx = endX - startX;
      const dy = endY - startY;
      const progress =
        ((x - startX) * dx + (y - startY) * dy) / (dx * dx + dy * dy);

      const noiseThreshold = noiseMin + progress * (noiseMax - noiseMin);
      const noise = Math.random() * 100;

      if (noise < noiseThreshold) {
        data[index] = rgb.r;
        data[index + 1] = rgb.g;
        data[index + 2] = rgb.b;
        data[index + 3] = 255;
      } else {
        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = 0;
      }
    }
  }

  return imageData;
}


function addToneNoiseEventListener() {
  toneNoise_colorPicker    = $(MODE_TONE_NOISE + '-color');
  toneNoise_noiseMinSlider = $(MODE_TONE_NOISE + '-min-noise');
  toneNoise_noiseMaxSlider = $(MODE_TONE_NOISE + '-max-noise');
  toneNoise_gradientStartX = $(MODE_TONE_NOISE + '-grad-start-x');
  toneNoise_gradientStartY = $(MODE_TONE_NOISE + '-grad-start-y');
  toneNoise_gradientEndX   = $(MODE_TONE_NOISE + '-grad-end-x');
  toneNoise_gradientEndY   = $(MODE_TONE_NOISE + '-grad-end-y');

  toneNoise_colorPicker.addEventListener("input", updateToneNoise);
  toneNoise_noiseMinSlider.addEventListener("input", updateToneNoise);
  toneNoise_noiseMaxSlider.addEventListener("input", updateToneNoise);
  toneNoise_gradientStartX.addEventListener("input", updateToneNoise);
  toneNoise_gradientStartY.addEventListener("input", updateToneNoise);
  toneNoise_gradientEndX.addEventListener("input", updateToneNoise);
  toneNoise_gradientEndY.addEventListener("input", updateToneNoise);

}


function updateToneNoise() {
  if (isDrawingToneNoise) {
    return;
  }

  isDrawingToneNoise = true; 
  if (nowToneNoise) {
    canvas.remove(nowToneNoise);
    nowToneNoise = null;
  }

  const color = toneNoise_colorPicker.value;
  const noiseMin = parseInt(toneNoise_noiseMinSlider.value);
  const noiseMax = parseInt(toneNoise_noiseMaxSlider.value);

  const noiseData = generateNoiseWithGradient(color, noiseMin, noiseMax);
  tmpCtxToneNoise.putImageData(noiseData, 0, 0);


  fabric.Image.fromURL(tmpCanvasToneNoise.toDataURL(), function (img) {
    var activeObject = canvas.getActiveObject();
    if (isPanel(activeObject)) {
      var canvasX = activeObject.left + (activeObject.width * activeObject.scaleX) / 2;
      var canvasY = activeObject.top + (activeObject.height * activeObject.scaleY) / 2;
      putImageInFrame(img, canvasX, canvasY, true);
      img.name = 'Tone Noise';
      nowToneNoise = img;
    }else{
      img.name = 'Tone Noise';
      canvas.add(img);
      canvas.renderAll();
      nowToneNoise = img;    
    }
    isDrawingToneNoise = false; 
  });
}
