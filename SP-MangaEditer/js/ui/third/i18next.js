// ja en ko fr zh ru es pt th de
// "20250301": {
//   ja: {},
//   en: {},
//   ko: {},
//   fr: {},
//   zh: {},
//   ru: {},
//   es: {},
//   pt: {},
//   th: {},
//   de: {}
// },


//マージされるので日付単位で分けて入れたらOK
const resources = {
"20250301": {
  ja: {terms_of_service:"利用規約"},
  en: {terms_of_service:"Terms of Service"},
  ko: {terms_of_service:"서비스 이용약관"},
  fr: {terms_of_service:"Conditions d'utilisation"},
  zh: {terms_of_service:"服务条款"},
  ru: {terms_of_service:"Условия использования"},
  es: {terms_of_service:"Términos de servicio"},
  pt: {terms_of_service:"Termos de serviço"},
  th: {terms_of_service:"ข้อกำหนดการให้บริการ"},
  de: {terms_of_service:"Nutzungsbedingungen"}
},
  "base": {
    ja: base_ja,en: base_en,ko: base_ko,fr: base_fr,zh: base_zh,ru: base_ru,es: base_es,pt: base_pt,th: base_th,de: base_de
  }
};

function mergeResources(resources) {
  const mergedResources = {};
  
  if (resources.base) {
    Object.keys(resources.base).forEach(function(lang) {
      mergedResources[lang] = {
        translation: Object.assign({}, resources.base[lang])
      };
    });
  }
  
  Object.keys(resources)
    .filter(function(key) { return key !== 'base'; })
    .sort()
    .forEach(function(dateKey) {
      Object.keys(resources[dateKey]).forEach(function(lang) {
        if (!mergedResources[lang]) {
          mergedResources[lang] = { translation: {} };
        }
        
        Object.assign(
          mergedResources[lang].translation,
          resources[dateKey][lang]
        );
      });
    });
  
  return mergedResources;
}

const mergedResources = mergeResources(resources);
const savedLanguage = localStorage.getItem("language") || "en";

i18next.init(
  {
    lng: savedLanguage,
    resources: mergedResources,
  },
  function (err, t) {
    updateContent();
    setLanguage(savedLanguage);
  }
);

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const key = element.getAttribute("data-i18n");
    const translation = i18next.t(key);
    if (translation) {
      if (element.tagName === "OPTION") {
        element.textContent = translation;
      } else {
        element.innerHTML = translation;
      }
    } else {
      console.warn(`Translation for key "${key}" not found.`);
    }
  });
  document.querySelectorAll("[data-i18n-label]").forEach(function (element) {
    const key = element.getAttribute("data-i18n-label");
    element.setAttribute("data-label", i18next.t(key));
  });
}

function changeLanguage(lng, event) {
  if (event) {
    event.preventDefault();
  }
  i18next.changeLanguage(lng, function (err, t) {
    if (!err) {
      createToast("Save Language", "successfully!");
      localStorage.setItem("language", lng);
      updateContent();
      setLanguage(lng);
      updateLayerPanel();
      if (objectMenu && objectMenu.style.display === "flex") {
        showObjectMenu(lastClickType);
      }
    } else {
      console.error("Failed to change language:", err);
    }
  });
  recreateFloatingWindow();
}

function getTranslation(key, defaultText) {
  const translatedText = i18next.t(key);
  return translatedText !== key ? translatedText : defaultText;
}

function getText(key) {
  const translatedText = i18next.t(key);
  return translatedText !== key ? translatedText : key;
}