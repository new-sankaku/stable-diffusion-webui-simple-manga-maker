const imageMap = new Map();
var stateStack = [];
var currentStateIndex = -1;
var isSaveHistory = true;


fabric.Object.prototype.toObject = (function (toObject) {
  return function (propertiesToInclude) {
    propertiesToInclude = (propertiesToInclude || []).concat(["clipTo"]);
    return toObject.apply(this, [propertiesToInclude]);
  };
})(fabric.Object.prototype.toObject);

function isSave(){
    return isSaveHistory;
}
function notSave(){
    return !(isSave());
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
    if( activeObject ){
        if( activeObject.saveHistory == true ){
            return true;
        }
        if( activeObject.saveHistory == false ){
            return false;
        }
        if( activeObject.target === undefined ){
            return true;
        }

        if( activeObject.target.saveHistory === undefined ){
            return true;
        }
        // console.log("isSaveObject false 5");
        return false;
    }else{
        // console.log("isSaveObject false 6");
        return false;
    }
}

function isNotSaveObject(activeObject){
    return !(isSaveObject(activeObject)) ;
}

function changeDoNotSaveHistory(){
    isSaveHistory = false;
}

function changeDoSaveHistory(){
    isSaveHistory = true;
}

function removeByNotSave(obj){
    if (obj) {
        changeDoNotSaveHistory();
        canvas.remove(obj);
        changeDoSaveHistory();
    }
}

function addByNotSave(obj){
    if (obj) {
        changeDoNotSaveHistory();
        canvas.add(obj);
        changeDoSaveHistory();
    }
}

function saveStateByListener(event, eventType) {
    if(!event){
        return;
    }
    if (notSave()) {
        return;
    }
    if( eventType === 'object:removed' ){
        //ok
    }
    if( isNotSaveObject(event) ){
        return;
    }
    // console.log( "saveStateByListener event", event, eventType );
    saveState();
}

function saveStateByManual() {
    // console.log( "saveStateByManual" );
    saveState();
}

function generateHash(imageData) {
    return CryptoJS.SHA256(imageData).toString(CryptoJS.enc.Hex);
}


function customToJSON() {
    const json = canvas.toJSON(commonProperties);
    json.objects = json.objects.map(obj => {
        if (obj.type === 'image' && (obj.src.startsWith('data:') || obj.src.startsWith('blob:') )) {
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
    // console.log("saveState", stateStack.length);
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

        let state = restoreImage(stateStack[currentStateIndex]);
        canvas.loadFromJSON(state, function () {
            setCanvasGUID( state.canvasGuid );
            canvas.renderAll();
            updateLayerPanel();
            resetEventHandlers(); 
            changeDoSaveHistory();
        });
        clearJSTSGeometry();
    }
}

function redo() {
    if (currentStateIndex < stateStack.length - 1) {
        changeDoNotSaveHistory();
        currentStateIndex++;

        let state = restoreImage(stateStack[currentStateIndex]);
        canvas.loadFromJSON(state, function () {
            setCanvasGUID( state.canvasGuid );
            canvas.renderAll();
            updateLayerPanel();
            resetEventHandlers(); 
            changeDoSaveHistory();
        });
        clearJSTSGeometry();
    }
}

function lastRedo(guid = null) {
    changeDoNotSaveHistory();
    currentStateIndex = stateStack.length - 1;

    let state = restoreImage(stateStack[stateStack.length - 1]);
    // console.log("state", JSON.stringify(state));
    canvas.loadFromJSON(state, function () {
        if( guid ){
            setCanvasGUID( guid );
        }else{
            setCanvasGUID( state.canvasGuid );
        }

        canvas.renderAll();
        updateLayerPanel();
        resetEventHandlers(); 
        changeDoSaveHistory();
    });
    clearJSTSGeometry();
}

function allRemove() {
    changeDoNotSaveHistory();
	canvas.clear();
    var bgColorInput = $("bg-color");
    canvas.backgroundColor = bgColorInput.value;
    changeDoSaveHistory();
    saveStateByManual();
	updateLayerPanel();
	currentImage = null;

    imageMap.clear();
    stateStack = [];
    currentStateIndex = -1;
}
function initImageHistory(){
	allRemove();
    imageMap.clear();
    stateStack = [];
    currentStateIndex = -1;
}

document.addEventListener('DOMContentLoaded', function() {
    saveState();
});



function resetEventHandlers() {
    const objectMap = {};
    canvas.getObjects().forEach(obj => {
      if (obj.guid) {
        objectMap[obj.guid] = obj;
      }
    });
    canvas.getObjects().forEach(obj => {
      if (obj.guids) {
        obj.guids.forEach(guid => {
          if (objectMap[guid]) {
            moveSettings(objectMap[guid], obj);
          }
        });
      }
    });
  }
  