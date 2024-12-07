class FontSelectorManager {
  static instances = [];
 
  static addInstance(instance) {
    this.instances.push(instance);
  }
 
  static reloadAll() {
    this.instances.forEach((instance) => instance.reload());
  }
 
  static closeAllDropdowns(exceptId = null) {
    this.instances.forEach((instance) => {
      if (instance.targetId !== exceptId) {
        instance.closeDropdown();
      }
    });
  }
}

class FontSelector {
  constructor(targetId, title = "") {
    this.targetId = targetId;
    this.title = title;
    this.savedFont = null;
    FontSelectorManager.addInstance(this);
    this.initialize();
  }
 
  createHTML() {
    return `<div class="fm-font-dropdown">
            <button class="fm-dropdown-trigger">
            <span id="fm-selected-font-${this.targetId}">${this.title}</span>
            <span>▼</span>
            </button>
            <div class="fm-dropdown-content" id="fm-fontDropdown-${this.targetId}"></div>
            </div>`;
  }
 
  initializeStyles() {
    let fmStyleSheet = document.createElement("style");
    Object.entries(fmFontData).forEach(([category, data]) => {
      data.fonts.forEach((font) => {
        fmStyleSheet.textContent += `.fm-font-${font.name.replace(/[\s-]/g, "_")}{font-family:"${font.name}",sans-serif; border-left:2px solid ${data.color}!important;}`;
      });
    });
    if (!$("fm-styles")) {
      fmStyleSheet.id = "fm-styles";
      document.head.appendChild(fmStyleSheet);
    }
  }
 
  createFontOption(font, color) {
    var langText = getSampleTextByLanguageCode();
    const option = document.createElement("div");
    option.className = `fm-font-option fm-font-${font.name.replace(
      /[\s-]/g,
      "_"
    )}`;
    option.dataset.font = font.name;
    option.textContent = `${langText} ${font.name}`;
    return option;
  }
 
  reload() {
    this.savedFont = $(`fm-selected-font-${this.targetId}`).textContent;
    this.initialize();
    if (this.savedFont && this.savedFont !== this.title) {
      const fmSelectedFont = $(`fm-selected-font-${this.targetId}`);
      fmSelectedFont.textContent = this.savedFont;
      const fontNameClass = this.savedFont.replace(/[\s-]/g, "_");
      fmSelectedFont.className = `fm-font-${fontNameClass}`;
    }
  }
 
  closeDropdown() {
    const dropdown = $(`fm-fontDropdown-${this.targetId}`);
    if (dropdown) {
      dropdown.classList.remove("fm-show");
      dropdown.style.removeProperty('top');
      dropdown.style.removeProperty('left');
      dropdown.style.removeProperty('maxHeight');
      dropdown.style.removeProperty('maxWidth');
    }
  }

  updateDropdownPosition(trigger, dropdown) {
    const triggerRect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    dropdown.style.removeProperty('maxHeight');
    dropdown.style.removeProperty('maxWidth');

    const dropdownHeight = dropdown.offsetHeight;
    const dropdownWidth = dropdown.offsetWidth;

    let top = triggerRect.bottom + window.scrollY;
    let left = triggerRect.left + window.scrollX;

    if (triggerRect.bottom + dropdownHeight > viewportHeight) {
      top = (triggerRect.top + window.scrollY) - dropdownHeight;
      if (top < 0) {
        top = 20;
        dropdown.style.maxHeight = `${viewportHeight - 40}px`;
      }
    }

    if (left + dropdownWidth > viewportWidth) {
      left = (viewportWidth - dropdownWidth - 20);
      if (left < 0) {
        left = 20;
        dropdown.style.maxWidth = `${viewportWidth - 40}px`;
      }
    }

    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  }
 
  initializeDropdown() {
    const container = $(this.targetId);
    if (!container) return;
    container.innerHTML = this.createHTML();
 
    const fmDropdown = $(`fm-fontDropdown-${this.targetId}`);
    const fmTrigger = container.querySelector(".fm-dropdown-trigger");
    const fmSelectedFont = $(`fm-selected-font-${this.targetId}`);
 
    Object.entries(fmFontData).forEach(([category, data]) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "fm-font-category";
 
      const titleDiv = document.createElement("div");
      titleDiv.className = "fm-category-title";
      titleDiv.textContent = getText(category);
      titleDiv.style.borderColor = data.color;
 
      const gridDiv = document.createElement("div");
      gridDiv.className = "fm-font-grid";
      if (data.fonts.length == 0) {
        return;
      }
 
      data.fonts.forEach((font) => {
        const option = this.createFontOption(font, data.color);
        option.addEventListener("click", () => {
          fmSelectedFont.textContent = font.name;
          fmSelectedFont.className = `fm-font-${font.name.replace(
            /[\s-]/g,
            "_"
          )}`;
          fmDropdown.classList.remove("fm-show");
          this.savedFont = font.name;
          const event = new CustomEvent(this.targetId, {
            detail: {
              fontName: font.name,
            },
          });
          document.dispatchEvent(event);
        });
        gridDiv.appendChild(option);
      });
 
      categoryDiv.appendChild(titleDiv);
      categoryDiv.appendChild(gridDiv);
      fmDropdown.appendChild(categoryDiv);
    });
 
    fmTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyShown = fmDropdown.classList.contains("fm-show");
      FontSelectorManager.closeAllDropdowns(
        isCurrentlyShown ? null : this.targetId
      );
      fmDropdown.classList.toggle("fm-show");
      
      if (!isCurrentlyShown) {
        this.updateDropdownPosition(fmTrigger, fmDropdown);
      }
    });

    document.addEventListener("scroll", () => {
      if (fmDropdown.classList.contains("fm-show")) {
        this.closeDropdown();
      }
    });
  }
 
  initialize() {
    this.initializeStyles();
    this.initializeDropdown();
  }
}
 
document.addEventListener("DOMContentLoaded", async () => {
  await fontManager.init();
  new FontSelector("fontSelector", "Font");
  
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".fm-font-dropdown")) {
      FontSelectorManager.closeAllDropdowns();
    }
  });
});


function getSampleTextByLanguageCode() {
  const currentLang = i18next.language;
  switch (currentLang) {
    case 'en':
      return '';
    case 'ja':
      return 'サンプル';
    case 'ko':
      return '샘플';
    case 'fr':
      return '';
    case 'zh':
      return '示例';
    case 'ru':
      return 'Пример';
    case 'es':
      return 'Ejemplo';
    case 'pt':
      return '';
    case 'de':
      return 'Beispiel';
    default:
      return 'Sample';
  }
}
