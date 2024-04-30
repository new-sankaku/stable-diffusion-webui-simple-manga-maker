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
    console.log("saveStateByListener start.", eventType);
    saveState();
    console.log("saveState end.   currentStateIndex:stateStack.length", eventType, currentStateIndex, ":", stateStack.length);
}
function saveStateByManual() {
    console.log("saveStateByManual start.");
    saveState();
    console.log("saveState end.   currentStateIndex:stateStack.length", "Manual", currentStateIndex, ":", stateStack.length);
}

function saveState() {
    if (currentStateIndex < stateStack.length - 1) {
        stateStack.splice(currentStateIndex + 1);
    }
    canvas.renderAll();
    stateStack.push(JSON.stringify(canvas.toJSON(['excludeFromLayerPanel'])));
    currentStateIndex++;
    console.log("saveState end.   currentStateIndex:stateStack.length", "saveState", currentStateIndex, ":", stateStack.length);
}

function undo() {
    console.log("undo start.   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);
    
    if (currentStateIndex >= 1) {
        isUndoRedoOperation = true;
        currentStateIndex--;
        canvas.loadFromJSON(stateStack[currentStateIndex], function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
    } else {
        console.log("No more states to undo");
    }

    console.log("undo end  .   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);
}

function redo() {
    console.log("redo start.   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);

    if (currentStateIndex < stateStack.length - 1) {
        isUndoRedoOperation = true;
        currentStateIndex++;
        canvas.loadFromJSON(stateStack[currentStateIndex], function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
    } else {
        console.log("No more states to redo");
    }

    console.log("redo end  .   currentStateIndex:stateStack.length", currentStateIndex, ":", stateStack.length);
}

// Event listeners setup
canvas.on('object:modified', function(e) { saveStateByListener(e, 'object:modified'); });
canvas.on('object:added', function(e) { saveStateByListener(e, 'object:added'); });
canvas.on('object:removed', function(e) { saveStateByListener(e, 'object:removed'); });
canvas.on('path:created', function(e) { saveStateByListener(e, 'path:created'); });
canvas.on('canvas:cleared', function(e) { saveStateByListener(e, 'canvas:cleared'); });
