canvas.isDrawingMode = false;
let currentPaths = [];

function switchPencilType(type) {
    switchPencilTypeUi(type);

    if (type == nowPencil) {
        pencilModeClear(type);
        currentPaths = [];
        clearActiveButton();
        return;
    } else {
        pencilModeClear(type);

        canvas.isDrawingMode = true;
        currentPaths = [];
        nowPencil = type;
    }

    if (type === MODE_PEN_MOSAIC) {
        isMosaicBrushActive = true;
        canvas.freeDrawingBrush = getMosaicBrush();
        canvas.freeDrawingBrush.mosaicSize = parseInt(drawingMosaicSize.value);
        canvas.freeDrawingBrush.circleSize = parseInt(drawingMosaicCircleSize.value);
        canvas.freeDrawingBrush.drawPreviewCircle({ x: canvas.width / 2, y: canvas.height / 2 });

    } else if (type === MODE_PEN_PENCIL) {
        setupContextTopBrush(new fabric.PencilBrush(canvas));

    } else if (type === MODE_PEN_TEXTURE) {
        setupContextTopBrush(new fabric.PatternBrush(canvas));

    } else if (type === MODE_PEN_VLINE) {
        setupContextTopBrush(getVLinePatternBrush());

    } else if (type === MODE_PEN_HLINE) {
        setupContextTopBrush(getHLinePatternBrush());

    } else if (type === MODE_PEN_CRAYON) {
        setupContextTopBrush(enhanceBrush(getCrayonBrush(), true));

    } else if (type === MODE_PEN_CIRCLE) {
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);

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

    document.getElementById(type + 'Button').classList.add('active-button');
    applyBrushSettings();
}


function addNumber(id, label, min, max, value) {
    const transLavel = getText(label);
    return `
        <div class="pen-input-2group">
            <label for="${id}" data-i18n="${label}">${transLavel}</label>
            <input type="number" id="${id}" min="${min}" max="${max}" value="${value}">
        </div>
    `;
}

function addColor(id, label, value) {
    const transLavel = getText(label);
    return `
        <div class="pen-input-2group">
            <label for="${id}" data-i18n="${label}">${transLavel}</label>
            <input type="color" id="${id}" value="${value}">
        </div>
    `;
}

function addSlider(id, label, min, max, value) {
    const transLavel = getText(label);
    return `
        <div class="pen-input-3group">
            <label for="${id}" data-i18n="${label}">${transLavel}</label>
            <input type="range" id="${id}" min="${min}" max="${max}" value="${value}" oninput="document.getElementById('${id}-value').innerText = this.value">
            <span class="slider-value" id="${id}-value">${value}</span>
        </div>
    `;
}

function addDropDownByStyle(id, label) {
    return `
        <div class="input-2group">
        <label for="line-style" data-i18n="lineStyle">Line Style</label>
        <select id="line-style">
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
        </select>
        </div>`;
}

var drawingColor             = null;
var drawingWidth             = null;
var drawingOpacity           = null;
var drawingShadowColor       = null;
var drawingShadowWidth       = null;
var drawingShadowOffsetX     = null;
var drawingShadowOffsetY     = null;
var drawingLineStyle         = null;
var drawingMosaicSize        = null;
var drawingMosaicCircleSize  = null;

Map.prototype.getOrDefault = function(key, defaultValue) {
    return this.has(key) ? this.get(key) : defaultValue;
};
const penValueMap = new Map();


function switchPencilTypeUi(type) {
    clearPenSettings();
    let settingsHTML = '';
    switch (type) {
        case MODE_PEN_PENCIL:
            settingsHTML += addColor( MODE_PEN_PENCIL + '-color',             'color',                              penValueMap.getOrDefault( MODE_PEN_PENCIL + '-color','#000000'));
            settingsHTML += addSlider(MODE_PEN_PENCIL + '-line-width',        'size',    1, 150,                    penValueMap.getOrDefault( MODE_PEN_PENCIL + '-line-width',5));
            settingsHTML += addSlider(MODE_PEN_PENCIL + '-opacity',           'opacity', 1, 100,                    penValueMap.getOrDefault( MODE_PEN_PENCIL + '-opacity',100));
            settingsHTML += addColor( MODE_PEN_PENCIL + '-shadow-color',      'shadow',                             penValueMap.getOrDefault( MODE_PEN_PENCIL + '-shadow-color','#000000'));
            settingsHTML += addSlider(MODE_PEN_PENCIL + '-shadow-line-width', 'size',    0, 150,                    penValueMap.getOrDefault( MODE_PEN_PENCIL + '-shadow-line-width',0));
            settingsHTML += addSlider(MODE_PEN_PENCIL + '-shadow-offset-x',   'svg_icon_shadow_offset_x',  1, 150,  penValueMap.getOrDefault( MODE_PEN_PENCIL + '-shadow-offset-x',5));
            settingsHTML += addSlider(MODE_PEN_PENCIL + '-shadow-offset-y',   'svg_icon_shadow_offset_y',  1, 150,  penValueMap.getOrDefault( MODE_PEN_PENCIL + '-shadow-offset-y',5));
            settingsHTML += addDropDownByStyle('line-style', 'lineStyle');
            document.getElementById('tool-settings').innerHTML = settingsHTML;

            drawingColor         = document.getElementById(MODE_PEN_PENCIL + '-color');
            drawingWidth         = document.getElementById(MODE_PEN_PENCIL + '-line-width');
            drawingOpacity       = document.getElementById(MODE_PEN_PENCIL + '-opacity');
            drawingShadowColor   = document.getElementById(MODE_PEN_PENCIL + '-shadow-color');
            drawingShadowWidth   = document.getElementById(MODE_PEN_PENCIL + '-shadow-line-width');
            drawingShadowOffsetX = document.getElementById(MODE_PEN_PENCIL + '-shadow-offset-x');
            drawingShadowOffsetY = document.getElementById(MODE_PEN_PENCIL + '-shadow-offset-y');
            drawingLineStyle     = document.getElementById("line-style");
        
            break;
        case MODE_PEN_CIRCLE:
            settingsHTML += addColor( MODE_PEN_CIRCLE + '-color',             'color',                              penValueMap.getOrDefault( MODE_PEN_CIRCLE + '-color','#000000'));
            settingsHTML += addSlider(MODE_PEN_CIRCLE + '-line-width',        'size',    1, 150,                    penValueMap.getOrDefault( MODE_PEN_CIRCLE + '-line-width',5));
            settingsHTML += addColor( MODE_PEN_CIRCLE + '-shadow-color',      'shadow',                             penValueMap.getOrDefault( MODE_PEN_CIRCLE + '-shadow-color','#000000'));
            settingsHTML += addSlider(MODE_PEN_CIRCLE + '-shadow-line-width', 'size',    0, 150,                    penValueMap.getOrDefault( MODE_PEN_CIRCLE + '-shadow-line-width',0));
            settingsHTML += addSlider(MODE_PEN_CIRCLE + '-shadow-offset-x',   'svg_icon_shadow_offset_x',  1, 150,  penValueMap.getOrDefault( MODE_PEN_CIRCLE + '-shadow-offset-x',5));
            settingsHTML += addSlider(MODE_PEN_CIRCLE + '-shadow-offset-y',   'svg_icon_shadow_offset_y',  1, 150,  penValueMap.getOrDefault( MODE_PEN_CIRCLE + '-shadow-offset-y',5));
            document.getElementById('tool-settings').innerHTML = settingsHTML;

            drawingColor         = document.getElementById(MODE_PEN_CIRCLE + '-color');
            drawingWidth         = document.getElementById(MODE_PEN_CIRCLE + '-line-width');
            drawingShadowColor   = document.getElementById(MODE_PEN_CIRCLE + '-shadow-color');
            drawingShadowWidth   = document.getElementById(MODE_PEN_CIRCLE + '-shadow-line-width');
            drawingShadowOffsetX = document.getElementById(MODE_PEN_CIRCLE + '-shadow-offset-x');
            drawingShadowOffsetY = document.getElementById(MODE_PEN_CIRCLE + '-shadow-offset-y');
            break;
        case MODE_PEN_CRAYON:
            settingsHTML += addColor( MODE_PEN_CRAYON + '-color',      'color',             penValueMap.getOrDefault( MODE_PEN_CRAYON + '-color','#000000'));
            settingsHTML += addSlider(MODE_PEN_CRAYON + '-line-width', 'size',    1, 150,   penValueMap.getOrDefault( MODE_PEN_CRAYON + '-line-width',5));
            settingsHTML += addSlider(MODE_PEN_CRAYON + '-opacity',    'opacity', 1, 100,   penValueMap.getOrDefault( MODE_PEN_CRAYON + '-opacity',100));
            document.getElementById('tool-settings').innerHTML = settingsHTML;

            drawingColor         = document.getElementById(MODE_PEN_CRAYON + '-color');
            drawingWidth         = document.getElementById(MODE_PEN_CRAYON + '-line-width');
            drawingOpacity       = document.getElementById(MODE_PEN_CRAYON + '-opacity');
            break;
        case MODE_PEN_INK:
            settingsHTML += addColor( MODE_PEN_INK + '-color',      'color',            penValueMap.getOrDefault( MODE_PEN_INK + '-color','#000000'));
            settingsHTML += addSlider(MODE_PEN_INK + '-line-width', 'size',    1, 150,  penValueMap.getOrDefault( MODE_PEN_INK + '-line-width',5));
            document.getElementById('tool-settings').innerHTML = settingsHTML;

            drawingColor         = document.getElementById(MODE_PEN_INK + '-color');
            drawingWidth         = document.getElementById(MODE_PEN_INK + '-line-width');
            break;
        case MODE_PEN_MARKER:
            settingsHTML += addColor( MODE_PEN_MARKER + '-color',      'color',             penValueMap.getOrDefault( MODE_PEN_MARKER + '-color','#000000'));
            settingsHTML += addSlider(MODE_PEN_MARKER + '-line-width', 'size',    1, 150,   penValueMap.getOrDefault( MODE_PEN_MARKER + '-line-width',5));
            settingsHTML += addSlider(MODE_PEN_MARKER + '-opacity',    'opacity', 1, 100,   penValueMap.getOrDefault( MODE_PEN_MARKER + '-opacity',100));
            document.getElementById('tool-settings').innerHTML = settingsHTML;

            drawingColor         = document.getElementById(MODE_PEN_MARKER + '-color');
            drawingWidth         = document.getElementById(MODE_PEN_MARKER + '-line-width');
            drawingOpacity       = document.getElementById(MODE_PEN_MARKER + '-opacity');
            break;
        case MODE_PEN_MOSAIC:
            settingsHTML += addSlider(MODE_PEN_MOSAIC + '-size',        'mosaic-size', 1, 250, penValueMap.getOrDefault( MODE_PEN_MOSAIC + '-size',8));
            settingsHTML += addSlider(MODE_PEN_MOSAIC + '-circle-size', 'circle-size', 1, 250, penValueMap.getOrDefault( MODE_PEN_MOSAIC + '-circle-size',40));
            document.getElementById('tool-settings').innerHTML = settingsHTML;

            drawingMosaicSize         = document.getElementById(MODE_PEN_MOSAIC + '-size');
            drawingMosaicCircleSize   = document.getElementById(MODE_PEN_MOSAIC + '-circle-size');
            break;
        case MODE_PEN_ERASER:
            settingsHTML += addSlider(MODE_PEN_ERASER + '-line-width', 'size',    1, 150,   penValueMap.getOrDefault( MODE_PEN_ERASER + '-line-width',5));
            document.getElementById('tool-settings').innerHTML = settingsHTML;

            drawingWidth  = document.getElementById(MODE_PEN_ERASER + '-line-width');
            break;
    }

    if( drawingWidth  ){
        console.log("drawingWidth is not null " + type);
    }else{

        console.log("drawingWidth is null " + type);
    }

    addPenEventListener();
}

function clearPenSettings(){
    if( drawingColor ){
        drawingColor.removeEventListener('change', applyBrushSettings);
        drawingColor.removeEventListener('change', savePenValueMap);
    }
    if( drawingWidth ){
        drawingWidth.removeEventListener('change', applyBrushSettings);
        drawingWidth.removeEventListener('change', savePenValueMap);
    }
    if( drawingOpacity ){
        drawingOpacity.removeEventListener('change', applyBrushSettings);
        drawingOpacity.removeEventListener('change', savePenValueMap);
    }
    if( drawingShadowColor ){
        drawingShadowColor.removeEventListener('change', applyBrushSettings);
        drawingShadowColor.removeEventListener('change', savePenValueMap);
    }
    if( drawingShadowWidth ){
        drawingShadowWidth.removeEventListener('change', applyBrushSettings);
        drawingShadowWidth.removeEventListener('change', savePenValueMap);
        console.log("drawingShadowWidth is clear ");
    }else{
        console.log("drawingShadowWidth is not clear ");

    }
    if( drawingShadowOffsetX ){
        drawingShadowOffsetX.removeEventListener('change', applyBrushSettings);
        drawingShadowOffsetX.removeEventListener('change', savePenValueMap);
    }
    if( drawingShadowOffsetY ){
        drawingShadowOffsetY.removeEventListener('change', applyBrushSettings);
        drawingShadowOffsetY.removeEventListener('change', savePenValueMap);
    }
    if( drawingLineStyle ){
        drawingLineStyle.removeEventListener('change', applyBrushSettings);
        drawingLineStyle.removeEventListener('change', savePenValueMap);
    }

    drawingColor             = null;
    drawingWidth             = null;
    drawingOpacity           = null;
    drawingShadowColor       = null;
    drawingShadowWidth       = null;
    drawingShadowOffsetX     = null;
    drawingShadowOffsetY     = null;
    drawingLineStyle         = null;
    drawingMosaicSize        = null;
    drawingMosaicCircleSize  = null;
}

function addPenEventListener(){

    const elements = [drawingColor, drawingWidth, drawingOpacity, drawingShadowColor, 
                      drawingShadowWidth, drawingShadowOffsetX, drawingShadowOffsetY, drawingLineStyle];

    if(drawingShadowWidth){
        console.log("drawingShadowWidth is not null ");
    }else{
        console.log("drawingShadowWidth is null ");
    }

    elements.forEach(element => {
        if (element) {
            console.log("set element", element.id);
            element.addEventListener('change', () => {
                applyBrushSettings();
                savePenValueMap(element);
            });
        }
    });

    if( drawingMosaicSize ){
        drawingMosaicSize.addEventListener('input', function () {
            var value = this.value;
            if (isMosaicBrushActive && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.mosaicSize = parseInt(value);
                updatePreview();
            }
        });
        drawingMosaicSize.onchange         = () => savePenValueMap(drawingMosaicSize);
    }

    if( drawingMosaicCircleSize ){
        drawingMosaicCircleSize.addEventListener('input', function () {
            var value = this.value;
            if (isMosaicBrushActive && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.circleSize = parseInt(value);
                updatePreview();
            }
        });
        drawingMosaicCircleSize.onchange         = () => savePenValueMap(drawingMosaicCircleSize);
    }
}

function savePenValueMap(element) {
    penValueMap.set(element.id, element.value);
}


function applyBrushSettings() {

    console.log( "applyBrushSettings is call" );

    if (canvas.freeDrawingBrush) {
        var brush = canvas.freeDrawingBrush;
        if (drawingWidth) {
            brush.width = parseInt(drawingWidth.value, 10) || 1;
        }else{
            console.log( "drawingWidth is null" );
        }

        if (drawingColor) {
            var color = new fabric.Color(drawingColor.value);
            if (drawingOpacity) {
                color.setAlpha(parseFloat(drawingOpacity.value / 100) || 1);
            }
            brush.color = color.toRgba();
            brush.opacity = 1;
        }

        if (brush.getPatternSrc) {
            brush.source = brush.getPatternSrc.call(brush);
            brush.strokeLineCap = 'round';
            brush.strokeLineJoin = 'round';
            brush.strokeDashArray = null;
        }

        if ( drawingShadowWidth ) {
            if(drawingShadowWidth.value > 0){
                brush.shadow = new fabric.Shadow({
                    affectStroke: true,
                    blur: parseInt(drawingShadowWidth.value, 10) || 0,
                    offsetX: parseInt(drawingShadowOffsetX.value, 10) || 0,
                    offsetY: parseInt(drawingShadowOffsetY.value, 10) || 0,
                    color: drawingShadowColor.value
                });
            }
        } else {
            brush.shadow = null;
        }

        if (drawingLineStyle) {
            const lineStyle = drawingLineStyle.value;
            var brushWidth = parseInt(drawingWidth.value, 10) || 1;
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

        console.log("After applying settings:");
        console.log("Width:", brush.width);
        console.log("Color:", brush.color);
        console.log("Opacity:", brush.opacity);
        console.log("Shadow:", brush.shadow);
        console.log("StrokeDashArray:", brush.strokeDashArray);
    }
}



function clearActiveButton() {
    document.getElementById(MODE_PEN_PENCIL + 'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_CIRCLE + 'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_CRAYON + 'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_INK    + 'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_MARKER + 'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_ERASER + 'Button').classList.remove('active-button');
    document.getElementById(MODE_PEN_MOSAIC + 'Button').classList.remove('active-button');
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
        const existingPaths = currentPaths.filter(path => canvas.contains(path));
        if (existingPaths.length > 0) {
            let group = new fabric.Group(existingPaths, {
                selectable: true,
                evented: true
            });
            canvas.remove(...existingPaths);
            canvas.add(group);
            canvas.renderAll();
        }
        currentPaths = currentPaths.filter(path => !existingPaths.includes(path));
    }
}

canvas.on('path:created', function (opt) {
    currentPaths.push(opt.path);
});


function getMosaicBrush() {
    const mosaicBrush = new fabric.MosaicBrush(canvas);
    return enhanceBrush(mosaicBrush, false);
}

function getEraserBrush() {
    const eraserBrush = new fabric.EraserBrush(canvas);
    eraserBrush.width = parseInt(drawingWidth.value, 10) || 10;
    return eraserBrush;
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

document.addEventListener("DOMContentLoaded", function () {
    fabric.Object.prototype.transparentCorners = false;
});

function updatePreview() {
    if (isMosaicBrushActive && canvas.freeDrawingBrush) {
        console.log("updatePreview");
        canvas.freeDrawingBrush.drawPreviewCircle({ x: canvas.width / 2, y: canvas.height / 2 });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    canvas.on('mouse:move', function (options) {
        if (isMosaicBrushActive && canvas.freeDrawingBrush && !canvas.freeDrawingBrush.isDrawing) {
            canvas.freeDrawingBrush.drawPreviewCircle(canvas.getPointer(options.e));
        }
    });
});




