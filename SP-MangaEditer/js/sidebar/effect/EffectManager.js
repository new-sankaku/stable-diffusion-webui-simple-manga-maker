const MODE_EFFECT_C2BW            = "Color2BlackWhite";

var mangaEffectColor = null;
var mangaEffectSlider = null;
var mangaEffectSlider2 = null;
var mangaEffectCheckBox = null;

let nowEffect = null;
function switchMangaEffect(type) {
  switchMangaEffectUi(type);

  if (nowEffect) {
    if (type == nowEffect) {
      clearActiveEffectButton();
      C2BWEnd();
      nowEffect = null;
      return;
    } else {
      clearActiveEffectButton();
      C2BWEnd();
      nowEffect = null;
    }
  }
  
  if (type === MODE_EFFECT_C2BW) {
    addEffectEventListener();
    C2BWStart();
  }  else {
    console.error("unknown type", type);
  }

  clearActiveEffectButton();
  if (type === MODE_EFFECT_C2BW) {
  }  else {
    $(type + 'Button').classList.add('active-button');
    nowEffect = type;  
  }
}

function switchMangaEffectUi(type) {
  clearEffectSettings();
  let settingsHTML = '';
  switch (type) {
      case MODE_EFFECT_C2BW:
        $('manga-effect-settings').innerHTML = settingsHTML;
        break;
  }

  addEffectEventListener();
}

function clearEffectSettings() {
  const elements = [
    mangaEffectColor,
    mangaEffectSlider,
    mangaEffectSlider2,
    mangaEffectCheckBox
  ];
  elements.forEach(element => {
    if (element) {
        element.removeEventListener("change", saveEffectValueMap);
    }
  });

  mangaEffectColor = null;
  mangaEffectSlider = null;
  mangaEffectSlider2 = null;
  mangaEffectCheckBox = null;
}
  

function addEffectEventListener(){
  const elements = [
    mangaEffectColor,
    mangaEffectSlider,
    mangaEffectSlider2,
    mangaEffectCheckBox
  ];
  elements.forEach(element => {
      if (element) {
          element.addEventListener('change', () => {
              saveEffectValueMap(element);
          });
      }
  });
}



function clearActiveEffectButton() {
  $(MODE_EFFECT_C2BW + 'Button').classList.remove('active-button');
}


