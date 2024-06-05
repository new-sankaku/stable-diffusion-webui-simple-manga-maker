document.addEventListener("DOMContentLoaded", function () {
  fabric.Object.prototype.transparentCorners = false;
  var drawingModeEl = document.getElementById("drawing-mode"),
    eraserModeEl = document.getElementById("eraser"),
    drawingColorEl = document.getElementById("drawing-color"),
    drawingShadowColorEl = document.getElementById("drawing-shadow-color"),
    drawingLineWidthEl = document.getElementById("drawing-line-width"),
    drawingShadowWidth = document.getElementById("drawing-shadow-width"),
    drawingShadowOffset = document.getElementById("drawing-shadow-offset");

  let isEraser = false;
  let isDrawind = false;

  drawingModeEl.onclick = function () {
    isEraser = false;
    eraserModeEl.innerHTML =
      '<i class="material-icons">app_registration</i> Eraser Mode';

    if (isDrawind) {
      drawingModeEl.innerHTML = '<i class="material-icons">brush</i> Draw Mode';
      canvas.isDrawingMode = false;
      isDrawind = false;
    } else {
      drawingModeEl.innerHTML =
        '<i class="material-icons">brush</i> Cancel Draw';
      canvas.isDrawingMode = true;
      isDrawind = true;
    }

    const brush = new fabric.PencilBrush(canvas);
    brush.color = drawingColorEl.value;
    brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    brush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: drawingShadowColorEl.value,
    });
    canvas.freeDrawingBrush = brush;
    applyBrushSettings();
  };

  eraserModeEl.onclick = function () {
    isDrawind = false;
    drawingModeEl.innerHTML = '<i class="material-icons">brush</i> Draw Mode';

    if (isEraser) {
      if (previousBrush) {
        canvas.freeDrawingBrush = previousBrush;
        applyBrushSettings();
      }
      canvas.isDrawingMode = false;
      isEraser = false;
      eraserModeEl.innerHTML =
        '<i class="material-icons">app_registration</i> Eraser Mode';
    } else {
      previousBrush = canvas.freeDrawingBrush;
      const eraserBrush = new fabric.EraserBrush(canvas);
      eraserBrush.width = parseInt(drawingLineWidthEl.value, 10) || 10;
      canvas.freeDrawingBrush = eraserBrush;

      canvas.isDrawingMode = true;
      isEraser = true;
      eraserModeEl.innerHTML =
        '<i class="material-icons">app_registration</i> Cancel Eraser';
    }
  };

  if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.document.createElement("canvas");
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext("2d");
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();
      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.document.createElement("canvas");
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext("2d");
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();
      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 2;
      var patternCanvas = fabric.document.createElement("canvas");
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext("2d");
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);
      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 5;
      var patternCanvas = fabric.document.createElement("canvas");
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color,
      });
      var canvasWidth = rect.getBoundingRect().width;
      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });
      var ctx = patternCanvas.getContext("2d");
      rect.render(ctx);
      return patternCanvas;
    };

    var texturePatternBrush = new fabric.PatternBrush(canvas);
  }

  document.getElementById("drawing-mode-selector").onchange = function () {
    if (this.value === "hline") {
      canvas.freeDrawingBrush = vLinePatternBrush;
    } else if (this.value === "vline") {
      canvas.freeDrawingBrush = hLinePatternBrush;
    } else if (this.value === "square") {
      canvas.freeDrawingBrush = squarePatternBrush;
    } else if (this.value === "diamond") {
      canvas.freeDrawingBrush = diamondPatternBrush;
    } else if (this.value === "texture") {
      canvas.freeDrawingBrush = texturePatternBrush;
    } else {
      canvas.freeDrawingBrush = new fabric[this.value + "Brush"](canvas);
    }
    applyBrushSettings();

    if (canvas.freeDrawingBrush) {
      var brush = canvas.freeDrawingBrush;
      brush.color = drawingColorEl.value;
      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
      }
      brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      brush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingShadowColorEl.value,
      });
    }
  };

  drawingColorEl.onchange = function () {
    var brush = canvas.freeDrawingBrush;
    brush.color = this.value;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
  };
  drawingShadowColorEl.onchange = function () {
    canvas.freeDrawingBrush.shadow.color = this.value;
  };
  drawingLineWidthEl.oninput = function () {
    var value = parseInt(this.value, 10) || 1;
    canvas.freeDrawingBrush.width = value;
  };
  drawingShadowWidth.oninput = function () {
    var value = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.blur = value;
  };
  drawingShadowOffset.oninput = function () {
    var value = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetX = value;
    canvas.freeDrawingBrush.shadow.offsetY = value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    if (canvas.freeDrawingBrush.getPatternSrc) {
      canvas.freeDrawingBrush.source =
        canvas.freeDrawingBrush.getPatternSrc.call(canvas.freeDrawingBrush);
    }
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: drawingShadowColorEl.value,
    });
  }

  document.getElementById("line-style").onchange = function () {
    applyBrushSettings();
  };

  function applyBrushSettings() {
    console.log("applyBrushSettings");
    if (!canvas.freeDrawingBrush) return;
    const lineStyle = document.getElementById("line-style").value;

    var brushWidth =
      parseInt(document.getElementById("drawing-line-width").value, 10) || 1;
    if (lineStyle === "solid") {
      canvas.freeDrawingBrush.strokeDashArray = null;
    } else if (lineStyle === "dashed") {
      canvas.freeDrawingBrush.strokeDashArray = [
        brushWidth * 4,
        brushWidth * 4,
      ];
    } else if (lineStyle === "dotted") {
      canvas.freeDrawingBrush.strokeDashArray = [brushWidth, brushWidth * 4];
    }

    console.log("lineStyle", lineStyle);
  }
  applyBrushSettings();
});
