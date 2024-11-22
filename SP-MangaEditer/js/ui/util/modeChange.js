var nowMode = "";

var isKnifeDrawing = false;
var isKnifeMode = false;

const MODE_PEN_PENCIL   = 'Pencil';
const MODE_PEN_OUTLINE  = 'OutlinePen';
const MODE_PEN_CIRCLE   = 'Circle';
const MODE_PEN_SQUARE   = 'Square';
const MODE_PEN_TEXTURE  = 'Texture';
const MODE_PEN_CRAYON   = 'Crayon';
const MODE_PEN_INK      = 'Ink';
const MODE_PEN_MARKER   = 'Marker';
const MODE_PEN_ERASER   = 'Eraser';
const MODE_PEN_HLINE    = 'Hline';
const MODE_PEN_VLINE    = 'Vline';
const MODE_PEN_MOSAIC   = 'Mosaic';

var isMosaicBrushActive = false;
var cropFrame;
var cropActiveObject;
let nowPencil = "";

function operationModeClear(){
  console.log("operationModeClear start")
  cropModeClear();
  knifeModeClear();
  editModeClear();
  pencilModeClear(nowPencil);
  clearPenActiveButton();
  nonActiveClearButton();
  currentMode = "select";
  setSBActiveButton(sbSelectButton);
  sbClearControlePoints();
}

function pencilModeClear(type) {
  console.log( "pencilModeClear type nowPencil | ", type, nowPencil );
  type = type || nowPencil;

  changeDefaultCursor();

  if (canvas.isDrawingMode && isImageBrush(nowPencil)) {
      canvas.isDrawingMode = false;
      isMosaicBrushActive = false;
      canvas.freeDrawingBrush.mergeDrawings();
      canvas.freeDrawingBrush = null;
      canvas.contextTop.clearRect(0, 0, canvas.width, canvas.height);
      nowPencil = "";
      finalizeGroup();
      return true;
  } else if (canvas.isDrawingMode) {
      canvas.isDrawingMode = false;
      finalizeGroup();
      nowPencil = "";
      return true;
  }
}

function isImageBrush(type){
  if( MODE_PEN_MOSAIC == type ) return true;
  if( MODE_PEN_CRAYON == type ) return true;
  if( MODE_PEN_INK == type )    return true;
  if( MODE_PEN_MARKER == type ) return true;
}


function cropModeClear(){
  if (cropFrame) {
    $("crop").style.display = "none";
    canvas.remove(cropFrame);
    cropFrame = null;
    if( cropActiveObject ){
      cropActiveObject.set({
        selectable: true
      });
    }
    return true;
  }
}
function knifeModeClear(){
  isKnifeMode = false;
  updateKnifeMode();
}

function editModeClear() {
  canvas.getObjects().forEach(function (obj) {
    if( obj.edit ){
      obj.edit = false;
      obj.cornerStyle = "rect";
      obj.controls = fabric.Object.prototype.controls;
      obj.hasBorders = true;
      canvas.requestRenderAll();
      updateLayerPanel();
    }
  });
}



function activeClearButton(){
  selectedById("clearMode");
}
function nonActiveClearButton(){
  if(isKnifeMode){

  }else{
    unSelectedById("clearMode");
  }
}

function updateClearButton(){
  if(isKnifeMode){
    selectedById("clearMode");
  }else{
    unSelectedById("clearMode");
  }
}









function toggleMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  const logo = $('navbar-logo');
  if (isDarkMode) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark-mode');
    logo.src = '02_images_svg/Logo/black_mode_logo.webp';
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('mode', 'light-mode');
    logo.src = '02_images_svg/Logo/light_mode_logo.webp';
  }
  updateLayerPanel();
}

document.addEventListener('DOMContentLoaded', function() {
  $('mode-toggle').addEventListener('change', toggleMode);
});


function initializeMode() {
  const mode = localStorage.getItem('mode') || 'light-mode';
  document.body.classList.add(mode);
  const logo = $('navbar-logo');
  if (mode === 'dark-mode') {
    $('mode-toggle').checked = true;
    logo.src = '02_images_svg/Logo/black_mode_logo.webp';
  } else {
    logo.src = '02_images_svg/Logo/light_mode_logo.webp';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initializeMode();
});



function getCssValue( key ){
  var currentModeElement = document.body;
  var rootStyles = getComputedStyle(currentModeElement);
  return rootStyles.getPropertyValue(key).trim();
}


function svgToBase64(svg) {
  return btoa(encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
      }));
}
const CURSOR_SVGS = {
  movePoint: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M468-240q-96-5-162-74t-66-166q0-100 70-170t170-70q97 0 166 66t74 162l-84-25q-13-54-56-88.5T480-640q-66 0-113 47t-47 113q0 57 34.5 100t88.5 56l25 84ZM821-60 650-231 600-80 480-480l400 120-151 50 171 171-79 79Z"/></svg>',
  deletePoint: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M200-440v-80h560v80H200Z"/></svg>',
  freehand: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="m272-104-38-38-42 42q-19 19-46.5 19.5T100-100q-19-19-19-46t19-46l42-42-38-40 554-554q12-12 29-12t29 12l112 112q12 12 12 29t-12 29L272-104Zm172-396L216-274l58 58 226-228-56-56Z"/></svg>',
  editPen: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z"/></svg>',
  point: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M170-228q-38-45-61-99T80-440h82q6 43 22 82.5t42 73.5l-56 56ZM80-520q8-59 30-113t60-99l56 56q-26 34-42 73.5T162-520H80ZM438-82q-59-6-112.5-28.5T226-170l56-58q35 26 74 43t82 23v80ZM284-732l-58-58q47-37 101-59.5T440-878v80q-43 6-82.5 23T284-732Zm196 372q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm38 278v-80q44-6 83.5-22.5T676-228l58 58q-47 38-101.5 60T518-82Zm160-650q-35-26-75-43t-83-23v-80q59 6 113.5 28.5T734-790l-56 58Zm112 504-56-56q26-34 42-73.5t22-82.5h82q-8 59-30 113t-60 99Zm8-292q-6-43-22-82.5T734-676l56-56q38 45 61 99t29 113h-82Z"/></svg>',
  knife: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M496-346 346-496l332-332q12-12 28.5-12t28.5 12l93 93q12 12 12 28.5T828-678L496-346Zm0-114 248-247-37-37-247 248 36 36Zm-56 340 80-80h360v80H440Zm-237 0q-46 0-88.5-18T40-188l265-264 104 104q14 14 22 32t8 38q0 20-8 38.5T409-207l-19 19q-32 32-74.5 50T227-120h-24Zm0-80h24q30 0 58-11.5t49-32.5l19-19q6-6 6-14t-6-14l-48-48-136 135q8 2 17 3t17 1Zm541-507-37-37 37 37ZM305-339Z"/></svg>'
};

function createCursor(type) {
  if (!CURSOR_SVGS[type]) return 'default';
  return `url('data:image/svg+xml;base64,${svgToBase64(CURSOR_SVGS[type])}') 12 12, crosshair`;
}

function changeCursor(type) {
  const cursor = createCursor(type);
  canvas.freeDrawingCursor = cursor;
  canvas.defaultCursor = cursor;

  let objectList = getObjectList();
  objectList.forEach( object =>{
    object.hoverCursor = cursor;
    object.moveCursor = cursor;
  });
}

function changeObjectCursor(type, object) {
  const cursor = createCursor(type);
  object.hoverCursor = cursor;
  object.moveCursor = cursor;
}


function changeDefaultCursor() {
  canvas.freeDrawingCursor = 'default';
  canvas.defaultCursor = 'default';
  let objectList = getObjectList();
  objectList.forEach( object =>{
    object.hoverCursor = 'default';
    object.moveCursor = 'default';
  });
}
