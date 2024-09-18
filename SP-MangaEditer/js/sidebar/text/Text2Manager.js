const t2Map = new Map();

const MODE_T2_SHADOW = "shadow";

var t2_fontT2Selector = null;
var t2_text = null;
var t2_fontSize = null;
var t2_lineHeight = null;
var t2_letterSpacing = null;
var t2_textOrientation = null;
var t2_textAlignment = null;
var t2_shadow1Size = null;
var t2_shadow1Opacity = null;
var t2_shadow1Color = null;
var t2_shadow2Size = null;
var t2_shadow2Opacity = null;
var t2_shadow2Color = null;
var t2_fillColor = null;
var t2_fillOpacity = null;
var t2_align_l = null;
var t2_align_c = null;
var t2_align_r = null;
var t2_orientation_v = null;
var t2_orientation_l = null;

let elementsT2 = [];
let buttonElementsT2 = [];

let nowText2 = null;

function switchText2(type) {
  switchText2Ui(type);

  if (nowText2) {
    t2_shadow_deleteSvg();
    nowText2 = null;
  }

  if (type === MODE_T2_SHADOW) {
    t2_shadow_createSvg();
    addT2EventListener();
  } else {
    console.error("unknown type", type);
  }

  // clearActiveT2Button();

  // $(type + 'Button').classList.add('active-button');
  nowText2 = type;
}

function switchText2Ui(type) {
  let settingsHTML = '';

  elementsT2.forEach(element => {
    if (element) {
      element = null;
    }
  });

  var cName = "";
  switch (type) {
    case MODE_T2_SHADOW:

      cName = "fontT2Selector";
      settingsHTML += addOneSelectBox(cName);

      cName = "Text";
      settingsHTML += addTextArea(type + '-' + cName, cName, t2Map.getOrDefault(type + '-' + cName, 'New Text'));

      cName = "FontSize";
      settingsHTML += addSlider(type + '-' + cName, cName, 1, 300, t2Map.getOrDefault(type + '-' + cName, 80));
      cName = "LineHeight";
      settingsHTML += addSlider(type + '-' + cName, cName, 0.1, 5, t2Map.getOrDefault(type + '-' + cName, 1.2), 0.1);
      cName = "LetterSpacing";
      settingsHTML += addSlider(type + '-' + cName, cName, -0.5, 2, t2Map.getOrDefault(type + '-' + cName, 0), 0.1);

      settingsHTML += addAlignTypeButton(type);
      settingsHTML += addOrientationButton(type);

      cName = "ShadowSize1";
      settingsHTML += addSlider(type + '-' + cName, cName, 0, 3, t2Map.getOrDefault(type + '-' + cName, 1));
      cName = "ShadowOpacity1";
      settingsHTML += addSlider(type + '-' + cName, cName, 0, 1, t2Map.getOrDefault(type + '-' + cName, 1), 0.1);
      cName = "ShadowColor1";
      settingsHTML += addColor(type + '-' + cName, cName, t2Map.getOrDefault(type + '-' + cName, '#ebe7e0'));

      cName = "ShadowSize2";
      settingsHTML += addSlider(type + '-' + cName, cName, 0, 5, t2Map.getOrDefault(type + '-' + cName, 5));
      cName = "ShadowOpacity2";
      settingsHTML += addSlider(type + '-' + cName, cName, 0, 1, t2Map.getOrDefault(type + '-' + cName, 1), 0.1);
      cName = "ShadowColor2";
      settingsHTML += addColor(type + '-' + cName, cName, t2Map.getOrDefault(type + '-' + cName, '#35322a'));

      cName = "TextColor";
      settingsHTML += addColor(type + '-' + cName, cName, t2Map.getOrDefault(type + '-' + cName, '#35322a'));
      cName = "FillOpacity";
      settingsHTML += addSlider(type + '-' + cName, cName, 0, 1, t2Map.getOrDefault(type + '-' + cName, 1), 0.1);

      $('text-area2-settings').innerHTML = settingsHTML;

      t2_fontT2Selector = $("fontT2Selector");
      t2_text = $(type + '-' + "Text");
      t2_fontSize = $(type + '-' + "FontSize");
      t2_lineHeight = $(type + '-' + "LineHeight");
      t2_letterSpacing = $(type + '-' + "LetterSpacing");
      t2_textOrientation = $("t2_shadow_textOrientation");
      t2_textAlignment = $("t2_shadow_textAlignment");
      t2_shadow1Size = $(type + '-' + "ShadowSize1");
      t2_shadow1Opacity = $(type + '-' + "ShadowOpacity1");
      t2_shadow1Color = $(type + '-' + "ShadowColor1");
      t2_shadow2Size = $(type + '-' + "ShadowSize2");
      t2_shadow2Opacity = $(type + '-' + "ShadowOpacity2");
      t2_shadow2Color = $(type + '-' + "ShadowColor2");
      t2_fillColor = $(type + '-' + "TextColor");
      t2_fillOpacity = $(type + '-' + "FillOpacity");

      t2_align_l = $("T2-align-left");
      t2_align_c = $("T2-align-center");
      t2_align_r = $("T2-align-right");
      t2_orientation_v = $("T2-Orientation-vertical");
      t2_orientation_l = $("T2-Orientation-horizontal");

      
      break;
  }

  reloadFont('fontT2Selector');

  elementsT2 = [
    t2_text,
    t2_fontSize,
    t2_lineHeight,
    t2_letterSpacing,
    t2_textOrientation,
    t2_textAlignment,
    t2_shadow1Size,
    t2_shadow1Opacity,
    t2_shadow1Color,
    t2_shadow2Size,
    t2_shadow2Opacity,
    t2_shadow2Color,
    t2_fillColor,
    t2_fillOpacity  ];

  buttonElementsT2 = [
    t2_fontT2Selector,
    t2_align_l,
    t2_align_c,
    t2_align_r,
    t2_orientation_v,
    t2_orientation_l
  ];

  const sliders2 = document.querySelectorAll('.input-container-leftSpace input[type="range"]');
  sliders2.forEach(slider => {
    setupSlider(slider, '.input-container-leftSpace')
  });
}

function clearT2Settings() {
  elementsT2.forEach(element => {
    if (element) {
      element.removeEventListener("change", saveValueMap);
      element = null;
    }
  });
  buttonElementsT2.forEach(element => {
    if (element) {
      element.removeEventListener("click", saveValueMap);
      element = null;
    }
  });
}

function addT2EventListener(){
  elementsT2.forEach(element => {
    if (element) {
      element.addEventListener('change', () => {
        saveValueMap(element);
        t2_shadow_updateAll();
      });
    }
  });
  buttonElementsT2.forEach(element => {
    if (element) {
      element.addEventListener('click', () => {
        saveValueMap(element);
        t2_shadow_updateAll();
      });
    }
  });
}

function clearActiveT2Button() {
  // $(MODE_T2_SHADOW + 'Button').classList.remove('active-button');
}

var nowT2Aligin = "start";
function alignText2(aligin){
  nowT2Aligin = aligin;
  $("T2-align-left").classList.remove('selected');
  $("T2-align-center").classList.remove('selected');
  $("T2-align-right").classList.remove('selected');

  if(aligin == "start"){
    $("T2-align-left").classList.add('selected');
  } else if(aligin == "middle"){
    $("T2-align-center").classList.add('selected');
  } else{
    $("T2-align-right").classList.add('selected');
  }
}

var nowT2Orientation = "horizontal";
function orientationText2(vertical){
  nowT2Orientation = vertical;
  $("T2-Orientation-vertical").classList.remove('selected');
  $("T2-Orientation-horizontal").classList.remove('selected');

  if(vertical == "vertical"){
    $("T2-Orientation-vertical").classList.add('selected');
  } else{
    $("T2-Orientation-horizontal").classList.add('selected');
  }
}
