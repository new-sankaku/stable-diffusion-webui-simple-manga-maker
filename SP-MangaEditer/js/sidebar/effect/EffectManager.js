const effectMap = new Map();

const MODE_EFFECT_C2BW = "Color2BlackWhite";
const MODE_EFFECT_GLOW = "EffectGlow";
const MODE_EFFECT_BLEND = "EffectBlend";

var effectCheck = null;
var effectSize1 = null;
var effectColor = null;

let nowEffect = null;
function switchMangaEffect(type) {
  switchMangaEffectUi(type);

  if (nowEffect) {
    if (type == nowEffect) {
      clearActiveEffectButton();
      nowEffect = null;
      return;
    } else {
      clearActiveEffectButton();
      nowEffect = null;
    }
  }

  nowEffect = type;

  if (type === MODE_EFFECT_C2BW) {
    C2BWStart();
    clearActiveEffectButton();
    return;
  } else if(type === MODE_EFFECT_BLEND){
    handleBlend();
    clearActiveEffectButton();
    return;    
  }else if(type === MODE_EFFECT_GLOW){
    //skip
  }else {
    console.error("unknown type", type);
  }

  addEffectEventListener();
  clearActiveEffectButton();
  $(type + 'Button').classList.add('active-button');
  
}

function switchMangaEffectUi(type) {
  clearEffectSettings();
  let settingsHTML = '';

  switch (type) {
    case MODE_EFFECT_GLOW:
      settingsHTML += addCheckBox("addGlowEffectCheckBox", "outloneGlow", false)
      settingsHTML += addSlider("glowOutLineSlider", "glowOutLineSize", 0, 250, effectMap.getOrDefault("glowOutLineSlider", 20));
      settingsHTML += addColor("glowOutLineColorPicker", "glowOutLineColor", effectMap.getOrDefault("glowOutLineColorPicker", '#FFFFFF'));

      $('manga-effect-settings').innerHTML = settingsHTML;

      effectCheck = $("addGlowEffectCheckBox");
      effectSize1 = $("glowOutLineSlider");
      effectColor = $("glowOutLineColorPicker");    
      break;
    default:
      $('manga-effect-settings').innerHTML = settingsHTML;
      return;
  }
  const sliders2 = document.querySelectorAll('.input-container-leftSpace input[type="range"]');
  sliders2.forEach(slider => {
    setupSlider(slider, '.input-container-leftSpace')
  });
}

function clearEffectSettings() {
  const elements = [
    effectCheck,
    effectSize1,
    effectColor
  ];
  elements.forEach(element => {
    if (element) {
      element.removeEventListener("change", saveEffectValueMap);
    }
  });

  effectCheck = null;
  effectSize1 = null;
  effectColor = null;
}


function addEffectEventListener() {
  const elements = [
    effectCheck,
    effectSize1,
    effectColor
  ];

  elements.forEach(element => {
    if (element) {
      element.addEventListener('change', () => { saveEffectValueMap(element); });
      if (nowEffect == MODE_EFFECT_GLOW) {
        element.addEventListener('change', () => {
          const selectedObject = canvas.getActiveObject();
          if (selectedObject) {
            if (effectCheck.checked) {
              const color = effectColor.value;
              const blurValue = parseInt(effectSize1.value, 20);
              selectedObject.set({
                shadow: {
                  color: color,
                  blur: blurValue,
                  offsetX: 0,
                  offsetY: 0
                }
              });
            } else {
              selectedObject.set({ shadow: null });
            }
            canvas.renderAll();
          }else{
            createToast("Check image!")
          }
        });
      }
    }else{
      console.log("element is null");
    }
  });
}



function clearActiveEffectButton() {
  $(MODE_EFFECT_GLOW + 'Button').classList.remove('active-button');
}


