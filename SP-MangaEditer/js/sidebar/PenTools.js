canvas.isDrawingMode = false;
let currentPaths = [];

function switchPencilType(type) {

    // console.log( "switchPencilType type", type );

    if( type == nowPencil ){
        pencilModeClear(type);
        currentPaths = [];
        clearActiveButton();
        return;
    }else{
        pencilModeClear(type);

        canvas.isDrawingMode = true;
        currentPaths = [];
        nowPencil = type;
    }

    if (type === MODE_PEN_MOSAIC) {
        isMosaicBrushActive = true;
        canvas.freeDrawingBrush = getMosaicBrush();
        canvas.freeDrawingBrush.mosaicSize = parseInt(document.getElementById('mosaic-size').value);
        canvas.freeDrawingBrush.circleSize = parseInt(document.getElementById('circle-size').value);
        canvas.freeDrawingBrush.drawPreviewCircle({ x: canvas.width / 2, y: canvas.height / 2 });

    } else if (type === MODE_PEN_PENCIL) {
        setupContextTopBrush(new fabric.PencilBrush(canvas));

    } else if (type === MODE_PEN_TEXTURE) {
        setupContextTopBrush(new fabric.PatternBrush(canvas));

    } else if (type === MODE_PEN_VLINE) {
        setupContextTopBrush(getVLinePatternBrush());

    } else if (type === MODE_PEN_HLINE) {
        setupContextTopBrush(getHLinePatternBrush());

    } else if (type === MODE_PEN_CIRCLE) {
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);

    } else if (type === MODE_PEN_CRAYON) {
        setupContextTopBrush(enhanceBrush(getCrayonBrush(), true));

    } else if (type === MODE_PEN_INK) {
        canvas.freeDrawingBrush = enhanceBrush(getInkBrush(), true);

    } else if (type === MODE_PEN_MARKER) {
        canvas.freeDrawingBrush = enhanceBrush(getMarkerBrush(), true);

    } else if (type === MODE_PEN_ERASER) {
        canvas.freeDrawingBrush = getEraserBrush();

    } else {
        canvas.freeDrawingBrush = new fabric[type + "Brush"](canvas);

    }
    clearActiveButton();

    document.getElementById(type+'Button').classList.add('active-button');
    applyBrushSettings();
}

function clearActiveButton() {
    document.getElementById(MODE_PEN_PENCIL+'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_CIRCLE+'Button').classList.remove('active-button');
    // document.getElementById(MODE_PEN_SQUARE+'Button').classList.remove('active-button');
    // document.getElementById(MODE_PEN_TEXTURE+'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_CRAYON+'Button').classList.remove('active-button');

    document.getElementById(MODE_PEN_INK+'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_MARKER+'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_ERASER+'Button').classList.remove('active-button');
    // document.getElementById(MODE_PEN_VLINE+'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_MOSAIC+'Button').classList.remove('active-button');

    // document.getElementById(MODE_PEN_HLINE+'Button').classList.remove('active-button');
}

function setupContextTopBrush(brush) {
    canvas.freeDrawingBrush = brush;
    canvas.freeDrawingBrush._render = function () {
        var ctx = this.canvas.contextTop;
        var color = new fabric.Color(this.color);
        var opacity = color.getAlpha();
        color.setAlpha(opacity * this.opacity);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = ctx.lineJoin = 'round';

        ctx.beginPath();
        for (var i = 0; i < this._points.length; i++) {
            var point = this._points[i];
            ctx.moveTo(point.x, point.y);
            var midPoint = point.midPointFrom(this._points[i + 1] || point);
            ctx.quadraticCurveTo(point.x, point.y, midPoint.x, midPoint.y);
        }
        ctx.stroke();
    };
}

function finalizeGroup() {
    if (currentPaths.length > 0) {
        let group = new fabric.Group(currentPaths, {
            selectable: true,
            evented: true
        });
        canvas.remove(...currentPaths);
        canvas.add(group);
        canvas.renderAll();
        currentPaths = [];
    }
}

canvas.on('path:created', function (opt) {
    currentPaths.push(opt.path);
});


function getMosaicBrush(){
    const mosaicBrush = new fabric.MosaicBrush(canvas);
    return enhanceBrush(mosaicBrush, false);
}

function getEraserBrush() {
    const eraserBrush = new fabric.EraserBrush(canvas);
    eraserBrush.width = parseInt(drawingLineWidthEl.value, 10) || 10;
    return eraserBrush;
}

function getVLinePatternBrush() {
    var brush = new fabric.PatternBrush(canvas);
    brush.getPatternSrc = function () {
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

    brush.source = brush.getPatternSrc();
    return brush;
}

function getHLinePatternBrush() {
    var brush = new fabric.PatternBrush(canvas);
    brush.getPatternSrc = function () {
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

    brush.source = brush.getPatternSrc();
    return brush;
}

function getCrayonBrush() {
    return new fabric.CrayonBrush(canvas, {
        width: 70,
        opacity: 0.6,
        color: "#ff0000"
    });
}

function getInkBrush() {
    return new fabric.InkBrush(canvas, {
        width: 70,
        opacity: 0.6,
        color: "#ff0000"
    });
}

function getMarkerBrush() {
    return new fabric.MarkerBrush(canvas, {
        width: 70,
        opacity: 0.6,
        color: "#ff0000"
    }
    );
}

var drawingColorEl = document.getElementById("drawing-color");
var lineStyleE1 = document.getElementById("line-style");
var drawingShadowColorEl = document.getElementById("drawing-shadow-color");
var drawingLineWidthEl = document.getElementById("drawing-line-width");
var drawingShadowWidth = document.getElementById("drawing-shadow-width");
var drawingShadowOffsetX = document.getElementById("drawing-shadow-offsetX");
var drawingShadowOffsetY = document.getElementById("drawing-shadow-offsetY");
var drawingOpacityEl = document.getElementById("drawing-opacity");

function applyBrushSettings() {
    if (canvas.freeDrawingBrush) {
        var brush = canvas.freeDrawingBrush;
        brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;

        var color = new fabric.Color(drawingColorEl.value);
        color.setAlpha(parseFloat(drawingOpacityEl.value / 100) || 1);
        brush.color = color.toRgba();
        brush.opacity = 1;

        if (brush.getPatternSrc) {
            brush.source = brush.getPatternSrc.call(brush);
            brush.strokeLineCap = 'round';
            brush.strokeLineJoin = 'round';
            brush.strokeDashArray = null;
        }

        if (drawingShadowWidth.value > 0) {
            brush.shadow = new fabric.Shadow({
                affectStroke: true,
                blur: parseInt(drawingShadowWidth.value, 10) || 0,
                offsetX: parseInt(drawingShadowOffsetX.value, 10) || 0,
                offsetY: parseInt(drawingShadowOffsetY.value, 10) || 0,
                color: drawingShadowColorEl.value,
            });
        } else {
            brush.shadow = null;
        }
        const lineStyle = document.getElementById("line-style").value;
        var brushWidth = parseInt(document.getElementById("drawing-line-width").value, 10) || 1;
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
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fabric.Object.prototype.transparentCorners = false;
    drawingColorEl.onchange = () => applyBrushSettings();
    drawingShadowColorEl.onchange = () => applyBrushSettings();
    drawingLineWidthEl.onchange = () => applyBrushSettings();
    drawingShadowWidth.onchange = () => applyBrushSettings();
    drawingShadowOffsetX.onchange = () => applyBrushSettings();
    drawingShadowOffsetY.onchange = () => applyBrushSettings();
    lineStyleE1.onchange = () => applyBrushSettings();
    drawingOpacityEl.onchange = () => applyBrushSettings();

    applyBrushSettings();
});

function updatePreview() {
    if (isMosaicBrushActive && canvas.freeDrawingBrush) {
        console.log("updatePreview");
        canvas.freeDrawingBrush.drawPreviewCircle({ x: canvas.width / 2, y: canvas.height / 2 });
    }
}

document.getElementById('mosaic-size').addEventListener('input', function () {
    var value = this.value;
    if (isMosaicBrushActive && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.mosaicSize = parseInt(value);
        updatePreview();
    }
});

document.getElementById('circle-size').addEventListener('input', function () {
    var value = this.value;
    if (isMosaicBrushActive && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.circleSize = parseInt(value);
        updatePreview();
    }
});

canvas.on('mouse:move', function (options) {
    if (isMosaicBrushActive && canvas.freeDrawingBrush && !canvas.freeDrawingBrush.isDrawing) {
        canvas.freeDrawingBrush.drawPreviewCircle(canvas.getPointer(options.e));
    }
});



