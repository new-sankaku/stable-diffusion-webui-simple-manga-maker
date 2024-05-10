fabric.Object.prototype.toObject = (function (toObject) {
  return function (propertiesToInclude) {
    propertiesToInclude = (propertiesToInclude || []).concat(["clipTo"]);
    return toObject.apply(this, [propertiesToInclude]);
  };
})(fabric.Object.prototype.toObject);

var stateStack = [];
var currentStateIndex = -1;
var isUndoRedoOperation = false;

function saveStateByListener(event, eventType) {
    if (!event || isUndoRedoOperation) {
        return;
    }
    //console.log("saveStateByListener start.", eventType);
    saveState();
    //console.log("saveState end.   currentStateIndex:stateStack.length", eventType, currentStateIndex, ":", stateStack.length);
}
function saveStateByManual() {
    //console.log("saveStateByManual start.");
    saveState();
    //console.log("saveState end.   currentStateIndex:stateStack.length", "Manual", currentStateIndex, ":", stateStack.length);
}

function saveState() {
    if (currentStateIndex < stateStack.length - 1) {
        stateStack.splice(currentStateIndex + 1);
    }
    canvas.renderAll();
    //console.log("saveState save json", JSON.stringify(canvas.toJSON(['excludeFromLayerPanel'])));
    stateStack.push(JSON.stringify(canvas.toJSON(['excludeFromLayerPanel', 'isPanel', 'text2img_prompt', 'text2img_negativePrompt', 'text2img_seed', 'text2img_width', 'text2img_height', 'text2img_samplingMethod', 'text2img_samplingSteps'])));


    currentStateIndex++;
    updateLayerPanel();
    // //console.log("saveState end.   currentStateIndex:stateStack.length", "saveState", currentStateIndex, ":", stateStack.length);
}

function undo() {
    //console.log("undo start.   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);
    
    if (currentStateIndex >= 1) {
        isUndoRedoOperation = true;
        currentStateIndex--;
        canvas.loadFromJSON(stateStack[currentStateIndex], function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
    } else {
        //console.log("No more states to undo");
    }

    //console.log("undo end  .   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);
}

function redo() {
    //console.log("redo start.   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);

    if (currentStateIndex < stateStack.length - 1) {
        isUndoRedoOperation = true;
        currentStateIndex++;
        //console.log("redo", stateStack[currentStateIndex]);
        canvas.loadFromJSON(stateStack[currentStateIndex], function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
    } else {
        //console.log("No more states to redo");
    }

    //console.log("redo end  .   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);
}

// Event listeners setup
canvas.on('object:modified', function(e) { saveStateByListener(e, 'object:modified'); });
canvas.on('object:added', function(e) { saveStateByListener(e, 'object:added'); });
canvas.on('object:removed', function(e) { saveStateByListener(e, 'object:removed'); });
canvas.on('path:created', function(e) { saveStateByListener(e, 'path:created'); });
canvas.on('canvas:cleared', function(e) { saveStateByListener(e, 'canvas:cleared'); });

saveState();





function getCropAndDownloadLink() {
	var strokeWidth = document.getElementById("strokeWidth").value;

	var cropped = canvas.toDataURL({
		format: 'png',
		multiplier: 3, 
		left: clipAreaCoords.left,
		top: clipAreaCoords.top,
		width: clipAreaCoords.width + (strokeWidth/2),
		height: clipAreaCoords.height + (strokeWidth/2)
	});

	var link = document.createElement('a');
	link.download = 'cropped-image.png';
	link.href = cropped;
	return link;
}

function clipCopy() {
	var link = getCropAndDownloadLink();
	fetch(link.href)
	.then(res => res.blob())
	.then(blob => {
			const item = new ClipboardItem({ "image/png": blob });
			navigator.clipboard.write([item]).then(function() {
					console.log('Image copied to clipboard successfully!');
					alert('Image copied to clipboard successfully!');
			}, function(error) {
					console.error('Unable to write to clipboard. Error:', error);
					alert('Failed to copy image to clipboard.');
			});
	});
}

function cropAndDownload() {
	var link = getCropAndDownloadLink();
	link.click();
}


function saveProject(){

}
function loadProject(){

}

