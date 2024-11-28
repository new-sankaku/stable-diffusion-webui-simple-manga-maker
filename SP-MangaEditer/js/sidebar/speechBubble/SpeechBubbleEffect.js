function changeSpeechBubble() {
    console.log("-------------");
    var bubbleStrokewidht = parseFloat($("bubbleStrokewidht").value);
    var fillColor   = $("bubbleFillColor").value;
    var strokeColor = $("bubbleStrokeColor").value;
    var opacity     = $("speechBubbleOpacity").value;
    opacity = opacity / 100;  

    var fillColorRgba   = hexToRgba(fillColor,opacity);
    var strokeColorRgba = hexToRgba(strokeColor,1.0);

    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        if (isGroup(activeObject)) {

            let isExistsFillArea = false;
            activeObject.forEachObject((obj) => {
                if( obj.data?.originalId === "fillArea"){
                    isExistsFillArea = true;
                    return;
                }
            });

            activeObject.forEachObject((obj) => {
                if( isExistsFillArea ){
                    if( obj.data?.originalId === "fillArea"){
                        obj.set({ stroke: "rgba(0,0,0,0)", fill:fillColorRgba, strokeWidth:0});
                    }else{
                        obj.set({ stroke: strokeColorRgba , fill:"rgba(0,0,0,0)", strokeWidth:bubbleStrokewidht});
                    }
                }else{
                    obj.set({ stroke: strokeColorRgba , fill:fillColorRgba, strokeWidth:bubbleStrokewidht});
                }
            });
        } else{
            obj.set({ stroke: strokeColorRgba , fill:fillColorRgba, strokeWidth:bubbleStrokewidht});
        }
        canvas.requestRenderAll();
    }
}

function hexToRgba(hex, opacity = 1) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function loadSVGReadOnly(svgString) {
    fabric.loadSVGFromString(svgString, function (objects, options) {
        var canvasUsableHeight = canvas.height * 0.3 - svgPagging;
        var overallScaleX = (canvas.width * 0.3) / options.width;
        var overallScaleY = canvasUsableHeight / options.height;
        var scaleToFit = Math.min(overallScaleX, overallScaleY);
        var offsetX = (canvas.width - options.width * scaleToFit) / 2;
        var offsetY = svgPagging / 2 + (canvasUsableHeight - options.height * scaleToFit) / 2;

        var scaledObjects = objects.map(function (obj) {
            if (obj.id) {
                obj.data = { 
                    originalId: obj.id,
                    originalClass: obj.class || obj.className
                };
            }
            
            obj.scaleX = scaleToFit;
            obj.scaleY = scaleToFit;
            obj.top = obj.top * scaleToFit + offsetY;
            obj.left = obj.left * scaleToFit + offsetX;
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
            data: { 
                originalId: 'speech-bubble-group',
                childrenIds: objects.map(obj => obj.id).filter(Boolean)
            }
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        changeSpeechBubble();
        canvas.renderAll();
        updateLayerPanel();
    });
}

/** load svg. */
const previewAreaVertical = $(
    "svg-preview-area-vertical"
);
const previewAreaLandscape = $(
    "svg-preview-area-landscape"
);
const speechBubbleArea = $(
    "speech-bubble-preview"
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



            if (stateStack.length > 2) {
                btmSaveZip().then(() => {
                    setCanvasGUID();
                    loadSVGPlusReset(item.svg);
                });
            } else {
                setCanvasGUID();
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

            if (stateStack.length > 2) {
                btmSaveZip().then(() => {
                    setCanvasGUID();
                    loadSVGPlusReset(item.svg, true);
                });
            } else {
                setCanvasGUID();
                loadSVGPlusReset(item.svg, true);
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