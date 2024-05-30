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
    saveState();
}
function saveStateByManual() {
    saveState();
}




// ハッシュ化関数と画像データマップ
const imageMap = new Map();

function generateHash(imageData) {
    return CryptoJS.SHA256(imageData).toString(CryptoJS.enc.Hex);
}

function customToJSON() {
    const json = canvas.toJSON(commonProperties);
    
    json.objects = json.objects.map(obj => {
        if (obj.type === 'image' && obj.src.startsWith('data:')) {
            const hash = generateHash(obj.src);
            if (!imageMap.has(hash)) {
                imageMap.set(hash, obj.src);
            }
            obj.src = hash;
        }
        return obj;
    });

    return json;
}

// JSON からの画像データの復元処理
function restoreImage(json) {
    const parsedJson = JSON.parse(json);
    parsedJson.objects = parsedJson.objects.map(obj => {
        if (obj.type === 'image' && imageMap.has(obj.src)) {
            obj.src = imageMap.get(obj.src); // ハッシュキーに基づき画像データを復元
        }
        commonProperties.forEach(prop => {
            if (obj[prop] !== undefined) {
                obj[prop] = obj[prop]; 
            }
        });
        
        return obj;
    });

    return parsedJson;
}


function saveState() {
    // console.log("saveState START currentStateIndex:StackLenght ", currentStateIndex, ":", stateStack.length);
    if (currentStateIndex < stateStack.length - 1) {
        stateStack.splice(currentStateIndex + 1);
    }
    canvas.renderAll();
    const state = customToJSON();
    const json = JSON.stringify(state);

    stateStack.push(json);
    currentStateIndex++;
    updateLayerPanel();
    // console.log("saveState END currentStateIndex:StackLenght ", currentStateIndex, ":", stateStack.length,"count:", json.length);
}

function undo() {
    if (currentStateIndex >= 1) {
        isUndoRedoOperation = true;
        currentStateIndex--;
        // console.log("undo currentStateIndex", currentStateIndex);
        canvas.loadFromJSON(restoreImage(stateStack[currentStateIndex]), function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
        // forcedAdjustCanvasSize();
    }
}

function redo() {
    if (currentStateIndex < stateStack.length - 1) {
        isUndoRedoOperation = true;
        currentStateIndex++;
        // console.log("redo currentStateIndex", currentStateIndex);
        canvas.loadFromJSON(restoreImage(stateStack[currentStateIndex]), function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
        // forcedAdjustCanvasSize();
    }
}

function lastRedo() {
    isUndoRedoOperation = true;
    currentStateIndex = stateStack.length - 1;
    canvas.loadFromJSON(restoreImage(stateStack[stateStack.length - 1]), function () {
        canvas.renderAll();
        updateLayerPanel();
        isUndoRedoOperation = false;
    });
}


saveState();


function allRemove() {
    isUndoRedoOperation = true;
	canvas.clear();
    isUndoRedoOperation = false;
    saveStateByManual();
	updateLayerPanel();
	currentImage = null;
}
function initImageHistory(){
	allRemove();
    imageMap.clear();
    stateStack = [];
    currentStateIndex = -1;
}


