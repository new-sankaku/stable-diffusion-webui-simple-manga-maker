function generateSteps() {
  const steps = [
    {
      element: '#intro_svg-container-vertical',
      intro: i18next.t('intro_svg-container-vertical_body'),
      title: i18next.t('intro_svg-container-vertical_title')
    },
    {
      element: '#intro_svg-container-landscape',
      intro: i18next.t('intro_svg-container-landscape_body'),
      title: i18next.t('intro_svg-container-landscape_title')
    },
    {
      element: '#intro_page-manager-area',
      intro: i18next.t('intro_page-manager-area_body'),
      title: i18next.t('intro_page-manager-area_title')
    },
    {
      element: '#intro_custom-panel-manager-area',
      intro: i18next.t('intro_custom-panel-manager-area_body'),
      title: i18next.t('intro_custom-panel-manager-area_title')
    },
    {
      element: '#intro_speech-bubble-area1',
      intro: i18next.t('intro_speech-bubble-area1_body'),
      title: i18next.t('intro_speech-bubble-area1_title')
    },
    {
      element: '#intro_text-area',
      intro: i18next.t('intro_text-area_body'),
      title: i18next.t('intro_text-area_title')
    },
    {
      element: '#intro_tool-area',
      intro: i18next.t('intro_tool-area_body'),
      title: i18next.t('intro_tool-area_title')
    },
    {
      element: '#intro_shape-area',
      intro: i18next.t('intro_shape-area_body'),
      title: i18next.t('intro_shape-area_title')
    },
    {
      element: '#intro_dummy-area4',
      intro: i18next.t('intro_dummy-area4_body'),
      title: i18next.t('intro_dummy-area4_title')
    },
    {
      element: '#intro_content',
      intro: i18next.t('intro_content_body'),
      title: i18next.t('intro_content_title')
    },
    {
      element: '#intro_links',
      intro: i18next.t('intro_links_body'),
      title: i18next.t('intro_links_title')
    },
    {
      element: '#intro_sdWebUI',
      intro: i18next.t('intro_sdWebUI_body'),
      title: i18next.t('intro_sdWebUI_title')
    },
    {
      element: '#intro_SD_WebUI_pingCheck_Label',
      intro: i18next.t('intro_SD_WebUI_pingCheck_Label_body'),
      title: i18next.t('intro_SD_WebUI_pingCheck_Label_title')
    }
  ];

  return steps;
}


function startupIntro() {
  if (!localStorage.getItem('startupIntroShown')) {
  //if (true) {
      introJs().setOptions({
      steps: [
        {
          element: '#language',
          intro: 'Select Language. 言語を選択。 언어  语言  Язык  Idioma',
          title: '△ Hello!! ▽'
        },
      ]
    }).start();
    localStorage.setItem('startupIntroShown', 'true');
  }
}

function tutorialIntro() {
  const intro = introJs();
  intro.setOptions({
    steps: generateSteps()
  });
  intro.start();
}

document.addEventListener('DOMContentLoaded', startupIntro);
document.addEventListener('DOMContentLoaded', function() {
  $('Intro_Tutorial').addEventListener('click', function(event) {
    event.preventDefault();
    tutorialIntro();
  });
});
