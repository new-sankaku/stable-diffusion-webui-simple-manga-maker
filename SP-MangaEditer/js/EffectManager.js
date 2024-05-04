function applyFilters() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    var filters = [];

    if (document.getElementById('sepia').checked) {
      filters.push(new fabric.Image.filters.Sepia());
    }

    if (document.getElementById('grayscale').checked) {
      var mode = document.querySelector('input[name="grayscale-mode"]:checked').value;
      filters.push(new fabric.Image.filters.Grayscale({ mode: mode }));
    }

    var v1 = parseFloat(document.getElementById('gamma-red').value);
    var v2 = parseFloat(document.getElementById('gamma-green').value);
    var v3 = parseFloat(document.getElementById('gamma-blue').value);
    filters.push(new fabric.Image.filters.Gamma({ gamma: [v1, v2, v3] }));

    filters.push(new fabric.Image.filters.Vibrance({
      vibrance: parseFloat(document.getElementById('vibrance-value').value)
    }));

    filters.push(new fabric.Image.filters.Blur({
      blur: parseFloat(document.getElementById('blur-value').value)
    }));

    filters.push(new fabric.Image.filters.Pixelate({
      blocksize: parseInt(document.getElementById('pixelate-value').value, 10)
    }));

    activeObject.filters = filters;
    activeObject.applyFilters();
    canvas.renderAll();
  }
}

document.getElementById('sepia').onchange = applyFilters;
document.getElementById('grayscale').onchange = function() {
  applyFilters();
};
document.querySelectorAll('input[name="grayscale-mode"]').forEach(function(radio) {
  radio.onchange = applyFilters;
});
document.getElementById('gamma-red').oninput = applyFilters;
document.getElementById('gamma-green').oninput = applyFilters;
document.getElementById('gamma-blue').oninput = applyFilters;
document.getElementById('vibrance-value').oninput = applyFilters;
document.getElementById('blur-value').oninput = applyFilters;
document.getElementById('pixelate-value').oninput = applyFilters;