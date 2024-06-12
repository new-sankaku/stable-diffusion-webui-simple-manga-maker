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
    //console.log( "isSaveHistory ", isSaveHistory );
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
    // console.log( "activeObject.saveHistory", activeObject, activeObject.saveHistory );
    if( activeObject ){
        if( activeObject.saveHistory == true ){
            // console.log("isSaveObject true 1");
            return true;
        }
        if( activeObject.saveHistory == false ){
            // console.log("isSaveObject false 2");
            return false;
        }
        if( activeObject.target === undefined ){
            // console.log("isSaveObject true 3");
            return true;
        }

        if( activeObject.target.saveHistory === undefined ){
            // console.log("isSaveObject true 4");
            return true;
        }
        console.log("isSaveObject false 5");
        return false;
    }else{
        console.log("isSaveObject false 6");
        return false;
    }
}

function isNotSaveObject(activeObject){
    return !(isSaveObject(activeObject)) ;
}

function changeDoNotSaveHistory(){
    //console.log( "changeDoNotSaveHistory isSaveHistory = false" );
    isSaveHistory = false;
}

function changeDoSaveHistory(){
    //console.log( "changeDoSaveHistory isSaveHistory = true" );
    isSaveHistory = true;
}

function saveStateByListener(event, eventType) {

    if(!event){
        //console.log( "saveStateByListener not save0 if(!event){" );
        return;
    }

    if (notSave()) {
        //console.log( "saveStateByListener not save1" );
        return;
    }

    if( isNotSaveObject(event) ){
        //console.log( "saveStateByListener not save2" );
        return;
    }

    //console.log( "saveStateByListener save" );
    saveState();
}

function saveStateByManual() {
    //console.log( "saveStateByManual" );
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

    //console.log("saveState()");


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
    var bgColorInput = document.getElementById("bg-color");
    canvas.backgroundColor = bgColorInput.value;
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
