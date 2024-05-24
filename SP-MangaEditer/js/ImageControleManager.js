function updateSliderValue(sliderId, displayId) {
  document.querySelector(sliderId).addEventListener("input", function() {
      document.querySelector(displayId).textContent = parseFloat(this.value).toFixed(3);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  updateSliderValue("#gammaRed", "#gammaRedValue");
  updateSliderValue("#gammaGreen", "#gammaGreenValue");
  updateSliderValue("#gammaBlue", "#gammaBlueValue");
  updateSliderValue("#vibranceValue", "#vibranceValueDisplay");
  updateSliderValue("#blurValue", "#blurValueDisplay");
  updateSliderValue("#pixelateValue", "#pixelateValueDisplay");

  document.querySelector("#gammaRedValue").textContent = parseFloat(document.querySelector("#gammaRed").value).toFixed(2);
  document.querySelector("#gammaGreenValue").textContent = parseFloat(document.querySelector("#gammaGreen").value).toFixed(2);
  document.querySelector("#gammaBlueValue").textContent = parseFloat(document.querySelector("#gammaBlue").value).toFixed(2);
  document.querySelector("#vibranceValueDisplay").textContent = parseFloat(document.querySelector("#vibranceValue").value).toFixed(2);
  document.querySelector("#blurValueDisplay").textContent = parseFloat(document.querySelector("#blurValue").value).toFixed(2);
  document.querySelector("#pixelateValueDisplay").textContent = parseFloat(document.querySelector("#pixelateValue").value).toFixed(0);

  updateSliderValue("#angle-control", "#angleValue");
  updateSliderValue("#scale-control", "#scaleValue");
  updateSliderValue("#top-control", "#topValue");
  updateSliderValue("#left-control", "#leftValue");
  updateSliderValue("#skewX-control", "#skewXValue");
  updateSliderValue("#skewY-control", "#skewYValue");
  updateSliderValue("#opacity-control", "#opacityValue");
});

function applyFilters() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    var filters = [];

    if (document.getElementById('sepiaEffect').checked) {
      filters.push(new fabric.Image.filters.Sepia());
    }

    if (document.getElementById('grayscaleEffect').checked) {
      var mode = document.querySelector('input[name="grayscaleMode"]:checked').value;
      filters.push(new fabric.Image.filters.Grayscale({ mode: mode }));
    }

    var v1 = parseFloat(document.getElementById('gammaRed').value);
    var v2 = parseFloat(document.getElementById('gammaGreen').value);
    var v3 = parseFloat(document.getElementById('gammaBlue').value);
    filters.push(new fabric.Image.filters.Gamma({ gamma: [v1, v2, v3] }));

    filters.push(new fabric.Image.filters.Vibrance({
      vibrance: parseFloat(document.getElementById('vibranceValue').value)
    }));

    filters.push(new fabric.Image.filters.Blur({
      blur: parseFloat(document.getElementById('blurValue').value)
    }));

    filters.push(new fabric.Image.filters.Pixelate({
      blocksize: parseInt(document.getElementById('pixelateValue').value, 10)
    }));

    activeObject.filters = filters;
    activeObject.applyFilters();
    canvas.renderAll();
  }
}

document.getElementById('sepiaEffect').onchange = applyFilters;
document.getElementById('grayscaleEffect').onchange = function() {
  applyFilters();
};
document.querySelectorAll('input[name="grayscaleMode"]').forEach(function(radio) {
  radio.onchange = applyFilters;
});
document.getElementById('gammaRed').oninput = applyFilters;
document.getElementById('gammaGreen').oninput = applyFilters;
document.getElementById('gammaBlue').oninput = applyFilters;
document.getElementById('vibranceValue').oninput = applyFilters;
document.getElementById('blurValue').oninput = applyFilters;
document.getElementById('pixelateValue').oninput = applyFilters;


function imageControleTogglePanel(panelId) {
  var panel = document.getElementById(panelId);
  if (panel) {
      var content = panel.querySelector('.control-content');
      if (content) {
          content.classList.toggle('hidden');
      } else {
          console.error('Element with class "control-content" not found in panel:', panelId);
      }
  } else {
      console.error('Panel with ID not found:', panelId);
  }
}
