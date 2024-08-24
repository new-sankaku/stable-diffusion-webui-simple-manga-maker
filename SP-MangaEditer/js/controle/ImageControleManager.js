function updateSliderValue(sliderId, displayId) {
  document.querySelector(sliderId).addEventListener("input", function () {
    document.querySelector(displayId).textContent = parseFloat(this.value).toFixed(3);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updateSliderValue("#glowOutLineSlider", "#glowOutLineValue");
  updateSliderValue("#gammaRed", "#gammaRedValue");
  updateSliderValue("#gammaGreen", "#gammaGreenValue");
  updateSliderValue("#gammaBlue", "#gammaBlueValue");
  updateSliderValue("#vibranceValue", "#vibranceValueDisplay");
  updateSliderValue("#blurValue", "#blurValueDisplay");
  updateSliderValue("#pixelateValue", "#pixelateValueDisplay");

  document.querySelector("#glowOutLineValue").textContent = parseFloat(document.querySelector("#glowOutLineSlider").value).toFixed(2);
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

    if ($('sepiaEffect').checked) {
      filters.push(new fabric.Image.filters.Sepia());
    }

    if ($('grayscaleEffect').checked) {
      var mode = document.querySelector('input[name="grayscaleMode"]:checked').value;
      filters.push(new fabric.Image.filters.Grayscale({ mode: mode }));
    }

    var v1 = parseFloat($('gammaRed').value);
    var v2 = parseFloat($('gammaGreen').value);
    var v3 = parseFloat($('gammaBlue').value);
    filters.push(new fabric.Image.filters.Gamma({ gamma: [v1, v2, v3] }));

    filters.push(new fabric.Image.filters.Vibrance({
      vibrance: parseFloat($('vibranceValue').value)
    }));

    filters.push(new fabric.Image.filters.Blur({
      blur: parseFloat($('blurValue').value)
    }));

    filters.push(new fabric.Image.filters.Pixelate({
      blocksize: parseInt($('pixelateValue').value, 10)
    }));

    activeObject.filters = filters;
    activeObject.applyFilters();
    canvas.renderAll();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  $('sepiaEffect').onchange = applyFilters;
  $('grayscaleEffect').onchange = function () {
    applyFilters();
  };
  document.querySelectorAll('input[name="grayscaleMode"]').forEach(function (radio) {
    radio.onchange = applyFilters;
  });
  $('gammaRed').oninput = applyFilters;
  $('gammaGreen').oninput = applyFilters;
  $('gammaBlue').oninput = applyFilters;
  $('vibranceValue').oninput = applyFilters;
  $('blurValue').oninput = applyFilters;
  $('pixelateValue').oninput = applyFilters;

  $('addGlowEffectCheckBox').addEventListener('change', function () {

    const selectedObject = canvas.getActiveObject();
    if (selectedObject) {
      if ($('addGlowEffectCheckBox').checked) {
        const color = $('glowOutLineColorPicker').value;
        const blurValue = parseInt($('glowOutLineSlider').value, 10);

        console.log("addGlowEffectCheckBox", color, blurValue,);
        selectedObject.set({
          shadow: {
            color: color,
            blur: blurValue,
            offsetX: 0,
            offsetY: 0
          }
        });
      } else {
        selectedObject.set({ shadow: null });
      }
      canvas.renderAll();
    }
  });

  $('glowOutLineSlider').addEventListener('change', function () {
    if ($('addGlowEffectCheckBox').checked) {
      const blurValue = parseInt(this.value, 20);
      $('glowOutLineSlider').innerText = blurValue;

      const selectedObject = canvas.getActiveObject();
      if (selectedObject && selectedObject.shadow) {
        const color = $('glowOutLineColorPicker').value;
        selectedObject.shadow.color = color;
        selectedObject.shadow.blur = blurValue;
        canvas.renderAll();
      }
    }
  });

  $('glowOutLineColorPicker').addEventListener('input', function () {
    const color = this.value;
    const selectedObject = canvas.getActiveObject();
    if (selectedObject && selectedObject.shadow) {
      const blurValue = parseInt($('glowOutLineSlider').value, 20);
      selectedObject.shadow.color = color;
      selectedObject.shadow.blur = blurValue;
      canvas.renderAll();
    }
  });

});



function imageControleTogglePanel(panelId) {
  var panel = $(panelId);
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
