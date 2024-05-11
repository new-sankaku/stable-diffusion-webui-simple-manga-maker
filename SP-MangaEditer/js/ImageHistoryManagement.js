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




// ハッシュ化関数と画像データマップ
const imageMap = new Map();

function generateHash(imageData) {
    return CryptoJS.SHA256(imageData).toString(CryptoJS.enc.Hex);
}

function customToJSON() {
    const json = canvas.toJSON(['excludeFromLayerPanel', 
                                'isPanel', 
                                'text2img_prompt', 
                                'text2img_negativePrompt', 
                                'text2img_seed', 
                                'text2img_width', 
                                'text2img_height', 
                                'text2img_samplingMethod', 
                                'text2img_samplingSteps']);
    
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


function saveState() {
    if (currentStateIndex < stateStack.length - 1) {
        stateStack.splice(currentStateIndex + 1);
    }
    canvas.renderAll();

    const json = JSON.stringify(customToJSON()); // カスタム JSON 処理を呼び出す
    stateStack.push(json);
    currentStateIndex++;
    updateLayerPanel();
}

// JSON からの画像データの復元処理
function restoreImage(json) {
    const parsedJson = JSON.parse(json);
    parsedJson.objects = parsedJson.objects.map(obj => {
        if (obj.type === 'image' && imageMap.has(obj.src)) {
            obj.src = imageMap.get(obj.src); // ハッシュキーに基づき画像データを復元
        }
        const props = ['excludeFromLayerPanel', 'isPanel', 'text2img_prompt', 'text2img_negativePrompt',
        'text2img_seed', 'text2img_width', 'text2img_height', 'text2img_samplingMethod',
        'text2img_samplingSteps'];
        props.forEach(prop => {
            if (obj[prop] !== undefined) {
                obj[prop] = obj[prop]; 
            }
        });
        
        return obj;
    });

    return parsedJson;
}

function undo() {
    if (currentStateIndex >= 1) {
        isUndoRedoOperation = true;
        currentStateIndex--;
        canvas.loadFromJSON(restoreImage(stateStack[currentStateIndex]), function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
    }
}

function redo() {
    if (currentStateIndex < stateStack.length - 1) {
        isUndoRedoOperation = true;
        currentStateIndex++;
        canvas.loadFromJSON(restoreImage(stateStack[currentStateIndex]), function () {
            canvas.renderAll();
            updateLayerPanel();
            isUndoRedoOperation = false;
        });
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







// Event listeners setup
canvas.on('object:modified', function(e) { saveStateByListener(e, 'object:modified'); });
canvas.on('object:added', function(e) { saveStateByListener(e, 'object:added'); });
canvas.on('object:removed', function(e) { saveStateByListener(e, 'object:removed'); });
canvas.on('path:created', function(e) { saveStateByListener(e, 'path:created'); });
canvas.on('canvas:cleared', function(e) { saveStateByListener(e, 'canvas:cleared'); });

saveState();


