
function changeSpeechBubbleLineColor(value) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        if (isGroup(activeObject)) {
            activeObject.forEachObject((obj) => {
                if (obj.type !== 'line') {
                    obj.set({ stroke: value });
                } else {
                    obj.set({ stroke: value });
                }
            });
        } else if (isShapes(activeObject)) {
            activeObject.set({ stroke: value });

        } else if (isLine(activeObject)) {
            activeObject.set({ stroke: value });
        
        }
        canvas.requestRenderAll();
    }
}

function changeSpeechBubbleBackgroundColor(value) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        if (isGroup(activeObject)) {
            activeObject.forEachObject((obj) => {
                if (obj.type !== 'line') {
                    obj.set({ fill: value });
                }
            });
        } else if (isShapes(activeObject)) {
            activeObject.set({ fill: value });
        }
        canvas.requestRenderAll();
    }
}

function changeSpeechBubbleOpacity(value) {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        const opacity = value / 100;
        activeObject.set('opacity', opacity);
        canvas.renderAll();
    }
}



/** Sppech bubble */
function loadSVGReadOnly(svgString) {
    var apply = document.getElementById("applySpeechbubbleChange").checked;
    var fillColor = document.getElementById("bubbleFillColor").value;
    var strokeColor = document.getElementById("bubbleStrokeColor").value;
    var speechBubbleOpacity = document.getElementById("speechBubbleOpacity").value / 100;

    fabric.loadSVGFromString(svgString, function (objects, options) {
        var canvasUsableHeight = canvas.height * 0.3 - svgPagging;
        var overallScaleX = (canvas.width * 0.3) / options.width;
        var overallScaleY = canvasUsableHeight / options.height;
        var scaleToFit = Math.min(overallScaleX, overallScaleY);
        var offsetX = (canvas.width - options.width * scaleToFit) / 2;
        var offsetY = svgPagging / 2 + (canvasUsableHeight - options.height * scaleToFit) / 2;

        var scaledObjects = objects.map(function (obj) {
            obj.scaleX = scaleToFit;
            obj.scaleY = scaleToFit;
            obj.top = obj.top * scaleToFit + offsetY;
            obj.left = obj.left * scaleToFit + offsetX;
            if (apply) {
                obj.set({
                    fill: fillColor,
                    stroke: strokeColor,
                    opacity: speechBubbleOpacity,
                });
            }

            return obj;
        });

        var group = new fabric.Group(scaledObjects, {
            left: offsetX,
            top: offsetY,
            selectable: true,
            hasControls: true,
            lockMovementX: false,
            lockMovementY: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,

        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        updateLayerPanel();
    });
}

/** load svg. */
const previewAreaVertical = document.getElementById(
    "svg-preview-area-vertical"
);
const previewAreaLandscape = document.getElementById(
    "svg-preview-area-landscape"
);
const speechBubbleArea = document.getElementById(
    "speech-bubble-svg-preview-area1"
);

window.onload = function () {
    previewAreaVertical.innerHTML = "";

    /** Load vertical manga panel image. */
    MangaPanelsImage_Vertical.forEach((item) => {
        const img = document.createElement("img");
        img.src = "data:image/svg+xml;utf8," + encodeURIComponent(item.svg);
        img.classList.add("svg-preview");
        img.alt = item.name;
        img.addEventListener("click", function () {
            if( stateStack.length > 2 ){
                executeWithConfirmation('New Project?', function() {
                    loadSVGPlusReset(item.svg);
                });
            }else{
                loadSVGPlusReset(item.svg);
            }
        });
        previewAreaVertical.appendChild(img);
    });

    /** Load landscape manga panel image. */
    previewAreaLandscape.innerHTML = "";
    MangaPanelsImage_Landscape.forEach((item) => {
        const img = document.createElement("img");
        img.src = "data:image/svg+xml;utf8," + encodeURIComponent(item.svg);
        img.classList.add("svg-preview");
        img.alt = item.name;
        img.addEventListener("click", function () {
            if( stateStack.length > 2 ){
                executeWithConfirmation('New Project?', function() {
                    loadSVGPlusReset(item.svg);
                });
            }else{
                loadSVGPlusReset(item.svg);
            }
        });
        previewAreaLandscape.appendChild(img);
    });

    /** Load speech bubble manga panel image. */
    SpeechBubble.forEach((item) => {
        const img = document.createElement("img");
        img.src = "data:image/svg+xml;utf8," + encodeURIComponent(item.svg);
        img.classList.add("svg-preview");
        img.alt = item.name;
        img.addEventListener("click", function () {
            loadSVGReadOnly(item.svg);
        });
        speechBubbleArea.appendChild(img);
    });
};