fabric.Object.prototype.toObject = (function (toObject) {
  return function (propertiesToInclude) {
    propertiesToInclude = (propertiesToInclude || []).concat(["clipTo"]);
    return toObject.apply(this, [propertiesToInclude]);
  };
})(fabric.Object.prototype.toObject);

var stateStack = [];
var currentStateIndex = -1;

function saveState() {
    if (currentStateIndex < stateStack.length - 1) {
        stateStack.splice(currentStateIndex + 1, stateStack.length - 1);
    }
    canvas.renderAll();
    stateStack.push(JSON.stringify(canvas.toJSON(["excludeFromLayerPanel"])));
    currentStateIndex++;
}



function undo() {
    if (currentStateIndex > 0) {
        currentStateIndex--;

        canvas.loadFromJSON(stateStack[currentStateIndex], function () {
            canvas.renderAll();
            updateLayerPanel();
        });
    } else {
        console.log("No more states to undo");
    }
}

function redo() {
    if (currentStateIndex < stateStack.length - 1) {
        currentStateIndex++;
        canvas.loadFromJSON(stateStack[currentStateIndex], function () {
            canvas.renderAll();
            updateLayerPanel();
        });
    } else {
        console.log("No more states to redo");
    }
}

saveState();
