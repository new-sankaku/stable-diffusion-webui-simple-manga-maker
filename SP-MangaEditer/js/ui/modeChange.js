var nowMode = "";
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

function activeClearButton(){
  var button = $('clearMode');
  button.classList.add('selected');
}
function nonActiveClearButton(){
  var button = $('clearMode');
  button.classList.remove('selected');
}

function operationModeClear(){
  console.log("operationModeClear start")
  cropModeClear();
  knifeModeClear();
  editModeClear();
  pencilModeClear(nowPencil);
  nonActiveClearButton();
  setSelectionMode(selectButton);
}

function pencilModeClear(type) {
  console.log( "pencilModeClear type nowPencil | ", type, nowPencil );
  type = type || nowPencil;

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
  var knifeModeButton = $('knifeModeButton');
  isKnifeMode = false;
  knifeModeButton.textContent = getText('knifeOff');
  changeMovement();
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

