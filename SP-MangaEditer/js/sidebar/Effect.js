const MODE_TONE            = "Tone";
const MODE_TONE_NOISE      = "ToneNoise";
const MODE_TONE_SNOW       = "ToneSnow";
const MODE_FOCUSING_LINE   = "FocusingLine";
const MODE_SPEED_LINE      = "SpeedLine";

var mangaEffectAngle = null;
var mangaEffectBackBlurSize = null;
var mangaEffectBackColor = null;
var mangaEffectBackSize = null;
var mangaEffectCenterX = null;
var mangaEffectCenterY = null;
var mangaEffectColor = null;
var mangaEffectDensity = null;
var mangaEffectDotSize = null;
var mangaEffectDotSpacing = null;
var mangaEffectDotStyle = null;
var mangaEffectFrontBlurSize = null;
var mangaEffectFrontSize = null;
var mangaEffectGradEnd = null;
var mangaEffectGradEndX = null;
var mangaEffectGradEndY = null;
var mangaEffectGradStart = null;
var mangaEffectGradStartX = null;
var mangaEffectGradStartY = null;
var mangaEffectGradStyle = null;
var mangaEffectLineSize = null;
var mangaEffectLineWidthExpand = null;
var mangaEffectMaxNoise = null;
var mangaEffectMaxRadius = null;
var mangaEffectMinNoise = null;
var mangaEffectMinRadius = null;

let nowEffect = null;

function switchMangaEffect(type) {
  switchMangaEffectUi(type);

  if (nowEffect) {
    if (type == nowEffect) {
      clearActiveEffectButton();
      speedLineEnd();
      focusLineEnd();
      toneNoiseEnd();
      toneEnd();
      nowEffect = null;
      return;
    } else {
      clearActiveEffectButton();
      speedLineEnd();
      focusLineEnd();
      toneNoiseEnd();
      toneEnd();
      nowEffect = null;
    }
  }
  
  if (type === MODE_TONE) {
    toneStart();
    addToneEventListener();
    debouncedGenerateTone();
  } else if (type === MODE_TONE_NOISE) {
    toneNoiseStart();
    addToneNoiseEventListener();
    updateToneNoise();
  } else if (type === MODE_TONE_SNOW) {
    snowToneStart();
    addSnowToneEventListener();
    generateSnowTone();
  } else if (type === MODE_FOCUSING_LINE) {
    focusLineStart();
    addFCEventListener();
    updateFocusLine();
  } else if (type === MODE_SPEED_LINE) {
    speedLineStart();
    addSppedLineEventListener();
    updateDrawingSpeedlines();
  } else {
    console.error("unknown type", type);
  }

  clearActiveEffectButton();
  document.getElementById(type + 'Button').classList.add('active-button');
  nowEffect = type;
}

function switchMangaEffectUi(type) {

  console.log("switchMangaEffectUi type ", type);

  clearPenSettings();
  let settingsHTML = '';
  switch (type) {
      case MODE_TONE:
        settingsHTML += addDropDownByDot(MODE_TONE + '-dot-style', 'dotStyle');
        settingsHTML += addColor( MODE_TONE + '-color',       'color',                effectValueMap.getOrDefault( MODE_TONE + '-color','#000000'));
        settingsHTML += addSlider( MODE_TONE + '-dot-size',    'dot-size',     1, 100, effectValueMap.getOrDefault( MODE_TONE + '-dot-size',5));    //density
        settingsHTML += addSlider(MODE_TONE + '-dot-spacing', 'dot-spacing',  1, 100, effectValueMap.getOrDefault( MODE_TONE + '-dot-spacing',5));    //density
        settingsHTML += addCheckBox(MODE_TONE + '-grad-check','grad-check',           effectValueMap.getOrDefault( MODE_TONE + '-grad-check', 'true'));    //density
        settingsHTML += addDropDownByGrad(MODE_TONE + '-grad-style', 'gradStyle');
        settingsHTML += addSlider(MODE_TONE + '-grad-start',  'grad-start',   0, 100, effectValueMap.getOrDefault( MODE_TONE + '-grad-start',0));   //grad-start-y
        settingsHTML += addSlider(MODE_TONE + '-grad-end',    'grad-end',     0, 100, effectValueMap.getOrDefault( MODE_TONE + '-grad-end',100));   //grad-end-y
        document.getElementById('manga-effect-settings').innerHTML = settingsHTML;

        mangaEffectColor     = document.getElementById(MODE_TONE + '-color');
        mangaEffectDotStyle  = document.getElementById(MODE_TONE + '-dot-style');
        mangaEffectDotSize   = document.getElementById(MODE_TONE + '-dot-size');
        mangaEffectDotSpacing= document.getElementById(MODE_TONE + '-dot-spacing');
        mangaEffectGradStyle = document.getElementById(MODE_TONE + '-grad-style');
        mangaEffectGradStart = document.getElementById(MODE_TONE + '-grad-start');
        mangaEffectGradEnd   = document.getElementById(MODE_TONE + '-grad-end');
        break;
      case MODE_TONE_NOISE:
        settingsHTML += addColor( MODE_TONE_NOISE + '-color',         'color',                effectValueMap.getOrDefault( MODE_TONE_NOISE + '-color','#000000'));
        settingsHTML += addSlider(MODE_TONE_NOISE + '-max-noise',     'max-noise',    0, 100, effectValueMap.getOrDefault( MODE_TONE_NOISE + '-max-radius',95)); //max-noise
        settingsHTML += addSlider(MODE_TONE_NOISE + '-min-noise',     'min-noise',    0, 100, effectValueMap.getOrDefault( MODE_TONE_NOISE + '-min-radius',100)); //min-noise
        settingsHTML += addSlider(MODE_TONE_NOISE + '-grad-start-x',  'grad-start-x', 0, 100, effectValueMap.getOrDefault( MODE_TONE_NOISE + '-grad-start-x',0));//grad-start-y
        settingsHTML += addSlider(MODE_TONE_NOISE + '-grad-start-y',  'grad-start-y', 0, 100, effectValueMap.getOrDefault( MODE_TONE_NOISE + '-grad-start-y',0));//grad-start-y
        settingsHTML += addSlider(MODE_TONE_NOISE + '-grad-end-x',    'grad-end-x',   0, 100, effectValueMap.getOrDefault( MODE_TONE_NOISE + '-grad-end-x',100));//grad-end-y
        settingsHTML += addSlider(MODE_TONE_NOISE + '-grad-end-y',    'grad-end-y',   0, 100, effectValueMap.getOrDefault( MODE_TONE_NOISE + '-grad-end-y',100));//grad-end-y
        document.getElementById('manga-effect-settings').innerHTML = settingsHTML;

        mangaEffectColor        = document.getElementById(MODE_TONE_NOISE + '-color');
        mangaEffectMaxNoise     = document.getElementById(MODE_TONE_NOISE + '-max-noise');
        mangaEffectMinNoise     = document.getElementById(MODE_TONE_NOISE + '-min-noise');
        mangaEffectGradStartX   = document.getElementById(MODE_TONE_NOISE + '-grad-start-x');
        mangaEffectGradEndX     = document.getElementById(MODE_TONE_NOISE + '-grad-end-x');
        mangaEffectGradStartY   = document.getElementById(MODE_TONE_NOISE + '-grad-start-y');
        mangaEffectGradEndY     = document.getElementById(MODE_TONE_NOISE + '-grad-end-y');
        break;
      case MODE_TONE_SNOW:
        settingsHTML += addColor( MODE_TONE_SNOW + '-frontColor',    'frontColor',  effectValueMap.getOrDefault( MODE_TONE_SNOW + '-frontColor','#FFFFFF'));
        settingsHTML += addColor( MODE_TONE_SNOW + '-backColor',     'backColor',   effectValueMap.getOrDefault( MODE_TONE_SNOW + '-backColor','#CCCCCC'));
        settingsHTML += addSlider(MODE_TONE_SNOW + '-density',       'density',       1, 3000, effectValueMap.getOrDefault( MODE_TONE_SNOW + '-density',1000));    //density
        settingsHTML += addSlider(MODE_TONE_SNOW + '-frontSize',     'frontSize',     1, 50,  effectValueMap.getOrDefault( MODE_TONE_SNOW + '-frontSize', 10));    //density
        settingsHTML += addSlider(MODE_TONE_SNOW + '-backSize',      'backSize',      1, 50,  effectValueMap.getOrDefault( MODE_TONE_SNOW + '-backSize', 3));    //density
        settingsHTML += addSlider(MODE_TONE_SNOW + '-frontBlurSize', 'frontBlurSize', 1, 50,  effectValueMap.getOrDefault( MODE_TONE_SNOW + '-frontBlurSize', 10));    //density
        settingsHTML += addSlider(MODE_TONE_SNOW + '-backBlurSize',  'backBlurSize',  1, 50,  effectValueMap.getOrDefault( MODE_TONE_SNOW + '-backBlurSize', 3));    //density
        settingsHTML += addSlider(MODE_TONE_SNOW + '-angle',         'angle',         0, 180, effectValueMap.getOrDefault( MODE_TONE_SNOW + '-angle', 140));    //density
        document.getElementById('manga-effect-settings').innerHTML = settingsHTML;

        mangaEffectColor         = document.getElementById(MODE_TONE_NOISE + '-frontColor');
        mangaEffectBackColor     = document.getElementById(MODE_TONE_NOISE + '-backColor');
        mangaEffectDensity       = document.getElementById(MODE_TONE_NOISE + '-density');
        mangaEffectFrontSize     = document.getElementById(MODE_TONE_NOISE + '-frontSize');
        mangaEffectBackSize      = document.getElementById(MODE_TONE_NOISE + '-backSize');
        mangaEffectFrontBlurSize = document.getElementById(MODE_TONE_NOISE + '-frontBlurSize');
        mangaEffectBackBlurSize  = document.getElementById(MODE_TONE_NOISE + '-backBlurSize');
        mangaEffectAngle         = document.getElementById(MODE_TONE_NOISE + '-angle');

        break;
      case MODE_FOCUSING_LINE:
        settingsHTML += addColor( MODE_FOCUSING_LINE + '-color',             'color',                     effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-color','#000000'));
        settingsHTML += addSlider(MODE_FOCUSING_LINE + '-lineNum',           'lineNum',           1, 500, effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-lineNum',200)); //line-size
        settingsHTML += addSlider(MODE_FOCUSING_LINE + '-line-size',         'line-size',         1, 500, effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-line-width',50)); //line-size
        settingsHTML += addSlider(MODE_FOCUSING_LINE + '-min-radius',        'min-radius',        1, 200, effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-min-radius',20)); //min-radius
        settingsHTML += addSlider(MODE_FOCUSING_LINE + '-max-radius',        'max-radius',        1, 200, effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-max-radius',60)); //max-radius
        settingsHTML += addSlider(MODE_FOCUSING_LINE + '-center-x',          'centerX',           0, 100, effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-center-x',0));
        settingsHTML += addSlider(MODE_FOCUSING_LINE + '-center-y',          'centerY',           0, 100, effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-center-y',0));
        settingsHTML += addSlider(MODE_FOCUSING_LINE + '-line-width-expand', 'line-width-expand', 1, 300, effectValueMap.getOrDefault( MODE_FOCUSING_LINE + '-line-width-expand',100)); // line-width-expand
        document.getElementById('manga-effect-settings').innerHTML = settingsHTML;

        mangaEffectColor           = document.getElementById(MODE_FOCUSING_LINE + '-color');
        mangaEffectLineSize        = document.getElementById(MODE_FOCUSING_LINE + '-line-size');
        mangaEffectMaxRadius       = document.getElementById(MODE_FOCUSING_LINE + '-max-radius');
        mangaEffectMinRadius       = document.getElementById(MODE_FOCUSING_LINE + '-min-radius');
        mangaEffectCenterX         = document.getElementById(MODE_FOCUSING_LINE + '-center-x');
        mangaEffectCenterY         = document.getElementById(MODE_FOCUSING_LINE + '-center-y');
        mangaEffectLineWidthExpand = document.getElementById(MODE_FOCUSING_LINE + '-line-width-expand');
        break;

      case MODE_SPEED_LINE:
        settingsHTML += addColor( MODE_SPEED_LINE + '-color',       'color',              effectValueMap.getOrDefault( MODE_SPEED_LINE + '-color','#000000'));
        settingsHTML += addDropDownBySpeedLine("speed-line-style", "speedLineStyle");
        settingsHTML += addSlider(MODE_SPEED_LINE + '-density',     'density',    1, 1500, effectValueMap.getOrDefault( MODE_SPEED_LINE + '-density',150));    //density
        settingsHTML += addCheckBox(MODE_SPEED_LINE + '-grad-check','grad-check',         effectValueMap.getOrDefault( MODE_SPEED_LINE + '-grad-check', 'true'));    //density
        settingsHTML += addSlider(MODE_SPEED_LINE + '-grad-start',  'grad-start', 0, 100, effectValueMap.getOrDefault( MODE_SPEED_LINE + '-grad-start',0));   //grad-start-y
        settingsHTML += addSlider(MODE_SPEED_LINE + '-grad-end',    'grad-end',   0, 100, effectValueMap.getOrDefault( MODE_SPEED_LINE + '-grad-end',100));   //grad-end-y
        document.getElementById('manga-effect-settings').innerHTML = settingsHTML;

        mangaEffectColor     = document.getElementById(MODE_TONE_NOISE + '-color');
        mangaEffectDensity   = document.getElementById(MODE_TONE_NOISE + '-density');
        mangaEffectGradStart = document.getElementById(MODE_TONE_NOISE + '-grad-start');
        mangaEffectGradEnd   = document.getElementById(MODE_TONE_NOISE + '-grad-end');
        break;
  }

  addEffectEventListener();
}

function clearPenSettings() {

  const elements = [
    mangaEffectAngle,
    mangaEffectBackBlurSize,
    mangaEffectBackColor,
    mangaEffectBackSize,
    mangaEffectCenterX,
    mangaEffectCenterY,
    mangaEffectColor,
    mangaEffectDensity,
    mangaEffectDotSize,
    mangaEffectDotSpacing,
    mangaEffectDotStyle,
    mangaEffectFrontBlurSize,
    mangaEffectFrontSize,
    mangaEffectGradEnd,
    mangaEffectGradEndX,
    mangaEffectGradEndY,
    mangaEffectGradStart,
    mangaEffectGradStartX,
    mangaEffectGradStartY,
    mangaEffectGradStyle,
    mangaEffectLineSize,
    mangaEffectLineWidthExpand,
    mangaEffectMaxNoise,
    mangaEffectMaxRadius,
    mangaEffectMinNoise,
    mangaEffectMinRadius
  ];

  elements.forEach(element => {
    if (element) {
        element.removeEventListener("change", saveEffectValueMap);
    }
  });
    mangaEffectAngle = null;
    mangaEffectBackBlurSize = null;
    mangaEffectBackColor = null;
    mangaEffectBackSize = null;
    mangaEffectCenterX = null;
    mangaEffectCenterY = null;
    mangaEffectColor = null;
    mangaEffectDensity = null;
    mangaEffectDotSize = null;
    mangaEffectDotSpacing = null;
    mangaEffectDotStyle = null;
    mangaEffectFrontBlurSize = null;
    mangaEffectFrontSize = null;
    mangaEffectGradEnd = null;
    mangaEffectGradEndX = null;
    mangaEffectGradEndY = null;
    mangaEffectGradStart = null;
    mangaEffectGradStartX = null;
    mangaEffectGradStartY = null;
    mangaEffectGradStyle = null;
    mangaEffectLineSize = null;
    mangaEffectLineWidthExpand = null;
    mangaEffectMaxNoise = null;
    mangaEffectMaxRadius = null;
    mangaEffectMinNoise = null;
    mangaEffectMinRadius = null;
  }
  

function addEffectEventListener(){

  const elements = [
    mangaEffectAngle,
    mangaEffectBackBlurSize,
    mangaEffectBackColor,
    mangaEffectBackSize,
    mangaEffectCenterX,
    mangaEffectCenterY,
    mangaEffectColor,
    mangaEffectDensity,
    mangaEffectDotSize,
    mangaEffectDotSpacing,
    mangaEffectDotStyle,
    mangaEffectFrontBlurSize,
    mangaEffectFrontSize,
    mangaEffectGradEnd,
    mangaEffectGradEndX,
    mangaEffectGradEndY,
    mangaEffectGradStart,
    mangaEffectGradStartX,
    mangaEffectGradStartY,
    mangaEffectGradStyle,
    mangaEffectLineSize,
    mangaEffectLineWidthExpand,
    mangaEffectMaxNoise,
    mangaEffectMaxRadius,
    mangaEffectMinNoise,
    mangaEffectMinRadius
  ];

  elements.forEach(element => {
      if (element) {
          console.log("set element", element.id);
          element.addEventListener('change', () => {
              saveEffectValueMap(element);
          });
      }
  });
}



function clearActiveEffectButton() {
  document.getElementById(MODE_TONE + 'Button').classList.remove('active-button');
  document.getElementById(MODE_TONE_NOISE + 'Button').classList.remove('active-button');
  document.getElementById(MODE_TONE_SNOW + 'Button').classList.remove('active-button');
  document.getElementById(MODE_FOCUSING_LINE + 'Button').classList.remove('active-button');
  document.getElementById(MODE_SPEED_LINE + 'Button').classList.remove('active-button');
}



function convertToSVG( tempCanvas) {
    var width = tempCanvas.width;
    var height = tempCanvas.height;
    var svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
  
    lines.forEach(function (line) {
      svgString += `<path d="M${line.startPos.x},${line.startPos.y} L${line.movePos.x},${line.movePos.y} L${line.endPos.x},${line.endPos.y} Z" fill="${conf.color}" />`;
    });
  
    svgString += "</svg>";
    return svgString;
  }
  

