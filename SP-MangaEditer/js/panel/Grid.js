
var gridSize = 10;
var snapTimeout;
var isGridVisible = false;

function drawGrid() {
  var gridCanvas = document.createElement("canvas");
  gridCanvas.width = canvas.width;
  gridCanvas.height = canvas.height;
  var gridCtx = gridCanvas.getContext("2d");
  var baseColor = "#ccc";


  gridCtx.strokeStyle = baseColor;

  for (var i = 0; i <= canvas.width / gridSize; i++) {
    gridCtx.beginPath();
    gridCtx.moveTo(i * gridSize, 0);
    gridCtx.lineTo(i * gridSize, canvas.height);
    gridCtx.stroke();
  }

  for (var i = 0; i <= canvas.height / gridSize; i++) {
    gridCtx.beginPath();
    gridCtx.moveTo(0, i * gridSize);
    gridCtx.lineTo(canvas.width, i * gridSize);
    gridCtx.stroke();
  }

  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var oneThirdX = canvas.width / 3;
  var twoThirdsX = (canvas.width / 3) * 2;
  var oneThirdY = canvas.height / 3;
  var twoThirdsY = (canvas.height / 3) * 2;

  var crossColor = darkenColor(baseColor, 5);
  gridCtx.strokeStyle = crossColor;

  gridCtx.beginPath();
  gridCtx.moveTo(centerX, 0);
  gridCtx.lineTo(centerX, canvas.height);
  gridCtx.stroke();

  gridCtx.beginPath();
  gridCtx.moveTo(0, centerY);
  gridCtx.lineTo(canvas.width, centerY);
  gridCtx.stroke();

  crossColor = darkenColor(baseColor, -70);
  gridCtx.strokeStyle = crossColor;

  gridCtx.beginPath();
  gridCtx.moveTo(oneThirdX, 0);
  gridCtx.lineTo(oneThirdX, canvas.height);
  gridCtx.stroke();

  gridCtx.beginPath();
  gridCtx.moveTo(twoThirdsX, 0);
  gridCtx.lineTo(twoThirdsX, canvas.height);
  gridCtx.stroke();

  gridCtx.beginPath();
  gridCtx.moveTo(0, oneThirdY);
  gridCtx.lineTo(canvas.width, oneThirdY);
  gridCtx.stroke();

  gridCtx.beginPath();
  gridCtx.moveTo(0, twoThirdsY);
  gridCtx.lineTo(canvas.width, twoThirdsY);
  gridCtx.stroke();

  canvas.setBackgroundImage(
    gridCanvas.toDataURL(),
    canvas.renderAll.bind(canvas)
  );
}

function darkenColor(color, percent) {
  if (percent === 0) return color;
  var num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;

  R = Math.max(Math.min(255, R), 0);
  G = Math.max(Math.min(255, G), 0);
  B = Math.max(Math.min(255, B), 0);

  return '#' + (
    (1 << 24) + (R << 16) + (G << 8) + B
  ).toString(16).slice(1).toUpperCase();
}
function removeGrid() {
  canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
}

function toggleGrid() {
  if (isGridVisible) {
    removeGrid();
    isGridVisible = false;
  } else {
    drawGrid();
    isGridVisible = true;
  }
  canvas.renderAll();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("toggleGridButton").addEventListener("click", toggleGrid);
  document.getElementById("gridSizeInput").addEventListener("input", updateGridSize);
});


function updateGridSize() {
  var newGridSize = parseInt(
    document.getElementById("gridSizeInput").value,
    10
  );
  if (newGridSize > 0) {
    gridSize = newGridSize;
    if (isGridVisible) {
      removeGrid();
      drawGrid();
    }
  }
}


function snapToGrid(target) {
  if (isGridVisible) {
    target.set({
      left: Math.round(target.left / gridSize) * gridSize,
      top: Math.round(target.top / gridSize) * gridSize,
    });
    canvas.renderAll();
  }
}
function debounceSnapToGrid(target) {
  clearTimeout(snapTimeout);
  snapTimeout = setTimeout(function () {
    snapToGrid(target);
  }, 50);
}
