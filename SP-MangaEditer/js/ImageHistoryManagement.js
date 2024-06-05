const imageMap = new Map();
var stateStack = [];
var currentStateIndex = -1;
var isUndoRedoOperation = false;


fabric.Object.prototype.toObject = (function (toObject) {
  return function (propertiesToInclude) {
    propertiesToInclude = (propertiesToInclude || []).concat(["clipTo"]);
    return toObject.apply(this, [propertiesToInclude]);
  };
})(fabric.Object.prototype.toObject);


function isSaveHistory(){
    if( isUndoRedoOperation ){
        return false;
    }else{
        return true;
    }
}

function setNotSave(activeObject){
    activeObject.saveHistory = false;
    return activeObject;
}
function setSave(activeObject){
    activeObject.saveHistory = true;
    return activeObject;
}


function isSaveObject(activeObject){
    return (activeObject && (activeObject.saveHistory == true )) ;
}

function isNotSaveObject(activeObject){
    return !(isSaveObject(activeObject)) ;
}

function changeDoNotSaveHistory(){
    isUndoRedoOperation = true;
}

function changeDoSaveHistory(){
    isUndoRedoOperation = false;
}

function saveStateByListener(event, eventType) {
    if (!event || isSaveHistory()) {
        return;
    }
    if( isNotSaveObject(event) ){
        return;
    }
    saveState();
}

function saveStateByManual() {
    saveState();
}

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

function restoreImage(json) {
    const parsedJson = JSON.parse(json);
    parsedJson.objects = parsedJson.objects.map(obj => {
        if (obj.type === 'image' && imageMap.has(obj.src)) {
            obj.src = imageMap.get(obj.src);
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
    if (currentStateIndex < stateStack.length - 1) {
        stateStack.splice(currentStateIndex + 1);
    }
    canvas.renderAll();
    const state = customToJSON();
    const json = JSON.stringify(state);

    stateStack.push(json);
    currentStateIndex++;
    updateLayerPanel();
}

function undo() {
    if (currentStateIndex >= 1) {
        
        changeDoNotSaveHistory();
        currentStateIndex--;
        canvas.loadFromJSON(restoreImage(stateStack[currentStateIndex]), function () {
            canvas.renderAll();
            updateLayerPanel();
            changeDoSaveHistory();
        });
    }
}

function redo() {
    if (currentStateIndex < stateStack.length - 1) {
        changeDoNotSaveHistory();
        currentStateIndex++;
        canvas.loadFromJSON(restoreImage(stateStack[currentStateIndex]), function () {
            canvas.renderAll();
            updateLayerPanel();
            changeDoSaveHistory();
        });
    }
}

function lastRedo() {
    changeDoNotSaveHistory();
    currentStateIndex = stateStack.length - 1;
    canvas.loadFromJSON(restoreImage(stateStack[stateStack.length - 1]), function () {
        canvas.renderAll();
        updateLayerPanel();
        changeDoSaveHistory();
    });
}

function allRemove() {
    changeDoNotSaveHistory();
	canvas.clear();
    changeDoSaveHistory();
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

saveState();
