let flowWindowCount = 0;

function createImagePromptHelperFlotingWindow(){
  flowCreateFloatingWindow('Image Prompt Helper', iphHtmlContent, 'rgba(0, 38, 255, 0.7)');
  
  setTimeout(() => {
    const saveButton = $('iph-save-button');
    const nameInput = $('iph-name-input');
    const freeInput = $('iph-free-input');
    const selectedTags = $('iph-selected-tags');
    const languageDropdown = $('iph-language-dropdown');
    const modelDropdown = $('iph-model-dropdown');
    
    function loadSettings() {
      const settings = JSON.parse(localStorage.getItem('uiSettings') || '{}');
      if (settings.language) {
        languageDropdown.value = settings.language;
      }
      if (settings.model) {
        modelDropdown.value = settings.model;
      }
      return settings;
    }

    function saveSettings() {
      const settings = {
        language: languageDropdown.value,
        model: modelDropdown.value
      };
      localStorage.setItem('uiSettings', JSON.stringify(settings));
    }

    function updateContent() {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key.startsWith('[')) {
          const attr = key.match(/\[(.*?)\]/)[1];
          element.setAttribute(attr, i18next.t(key.substring(key.indexOf(']') + 1)));
        } else {
          element.textContent = i18next.t(key);
        }
      });
    }

    function updateLanguageDropdown() {
      const selectedOption = languageDropdown.options[languageDropdown.selectedIndex];
      const flagCode = selectedOption.getAttribute('data-flag');
      languageDropdown.style.backgroundImage = `url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${flagCode}.svg)`;
    }

    function initializeUI() {
      initI18next(savedLanguage)
        .then(() => {
          updateContent();
          updateLanguageDropdown();
          iphInitializeUI();
        })
        .catch(error => {
          console.error('Failed to initialize i18next:', error);
        });
    }

    languageDropdown.addEventListener('change', function() {
      i18next.changeLanguage(this.value)
        .then(() => {
          updateContent();
          updateLanguageDropdown();
          saveSettings();
        })
        .catch(error => {
          console.error('Failed to change language:', error);
        });
    });

    modelDropdown.addEventListener('change', function() {
      saveSettings();
      iphLoadJsonAndRefresh();
    });

    saveButton.addEventListener('click', function() {
      const name = nameInput.value.trim();
      const freeText = freeInput.value.trim();
      
      const selectedTagsArray = Array.from(selectedTags.children).map(tag => tag.textContent.trim());
      const selectedTagsText = selectedTagsArray.join(', ');
      
      if (!name) {
        alert(i18next.t('alerts.nameMissing'));
        return;
      }
      
      let customSet = JSON.parse(localStorage.getItem('CustomSet') || '{"Custom Set":{}}');
      const key = freeText ? `${freeText}, ${selectedTagsText}` : selectedTagsText;

      customSet['Custom Set'] = {
        ...customSet['Custom Set'],
        [key]: {"url": `img/custom-set/${name}.webp`, "alias": name}
      };

      localStorage.setItem('CustomSet', JSON.stringify(customSet));
      console.log("custom set", JSON.stringify(customSet));
      
      iphInitializeUI();
    });

    initializeUI();
  }, 0);
}


/**
 * フローティングウィンドウを作成する関数
 * @param {string} title - ウィンドウのタイトル
 * @param {string} content - ウィンドウの内容
 * @param {string} [shadowColor='rgba(255, 255, 255, 0.5)'] - ボックスシャドウの色（オプション）
 * @param {number} [widthVw=50] - ウィンドウの幅（ビューポート幅の割合）
 * @param {number} [heightVh=50] - ウィンドウの高さ（ビューポート高さの割合）
 */
function flowCreateFloatingWindow(title, content, shadowColor = 'rgba(255, 255, 255, 0.5)', widthVw = 80, heightVh = 80) {
  flowWindowCount++;
  const flowWindowId = `flow-window-${flowWindowCount}`;
  const flowWindow = document.createElement('div');
  flowWindow.id = flowWindowId;
  flowWindow.className = 'flow-floating-window';
  flowWindow.style.left = `${5 * flowWindowCount}vw`;
  flowWindow.style.top = `${5 * flowWindowCount}vh`;
  flowWindow.style.boxShadow = `0 0 15px ${shadowColor}`;
  flowWindow.style.width = `${widthVw}vw`;
  flowWindow.style.height = `${heightVh}vh`;
  
  flowWindow.innerHTML = `
    <div class="flow-window-header">
      <span>${title}</span>
      <span class="flow-close-button" onclick="flowCloseWindow('${flowWindowId}')">&times;</span>
    </div>
    <div class="flow-window-content" style="height: calc(100% - 30px); overflow-y: auto;">
      ${content}
    </div>
  `;
  
  document.body.appendChild(flowWindow);
  flowMakeDraggable(flowWindow);
}

/**
 * フローティングウィンドウを閉じる関数
 * @param {string} flowWindowId - 閉じるウィンドウのID
 */
function flowCloseWindow(flowWindowId) {
  const flowWindowToClose = $(flowWindowId);
  if (flowWindowToClose) {
    flowWindowToClose.remove();
  }
}

/**
 * フローティングウィンドウをドラッグ可能にする関数
 * @param {HTMLElement} flowWindow - ドラッグ可能にするウィンドウ要素
 */
function flowMakeDraggable(flowWindow) {
  const flowHeader = flowWindow.querySelector('.flow-window-header');
  let flowIsDragging = false;
  let flowStartX, flowStartY;

  flowHeader.addEventListener('mousedown', flowStartDragging);

  function flowStartDragging(e) {
    flowIsDragging = true;
    flowStartX = e.clientX - flowWindow.offsetLeft;
    flowStartY = e.clientY - flowWindow.offsetTop;
  }

  document.addEventListener('mousemove', function(e) {
    if (flowIsDragging) {
      const flowNewX = e.clientX - flowStartX;
      const flowNewY = e.clientY - flowStartY;
      flowWindow.style.left = `${flowNewX}px`;
      flowWindow.style.top = `${flowNewY}px`;
    }
  });

  document.addEventListener('mouseup', function() {
    flowIsDragging = false;
  });
}