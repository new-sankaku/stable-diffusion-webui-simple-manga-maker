Map.prototype.getOrDefault = function (key, defaultValue) {
  return this.has(key) ? this.get(key) : defaultValue;
};

const penValueMap = new Map();
const effectValueMap = new Map();

function savePenValueMap(element) {
  penValueMap.set(element.id, element.value);
}
function saveEffectValueMap(element) {
  effectValueMap.set(element.id, element.value);
}


function addNumber(id, label, min, max, value) {
  const transLavel = getText(label);
  return `
      <div class="pen-input-2group">
          <label for="${id}" data-i18n="${label}">${transLavel}</label>
          <input type="number" id="${id}" min="${min}" max="${max}" value="${value}">
      </div>
  `;
}

function addColor(id, label, value) {
  const transLavel = getText(label);
  return `
      <div class="pen-input-2group">
          <label for="${id}" data-i18n="${label}">${transLavel}</label>
          <input type="color" id="${id}" value="${value}">
      </div>
  `;
}

function addSlider(id, label, min, max, value) {
  const transLavel = getText(label);
  return `
      <div class="pen-input-3group">
          <label for="${id}" data-i18n="${label}">${transLavel}</label>
          <input type="range" id="${id}" min="${min}" max="${max}" value="${value}" oninput="document.getElementById('${id}-value').innerText = this.value">
          <span class="slider-value" id="${id}-value">${value}</span>
      </div>
  `;
}

function addCheckBox(id, label, value) {
  const transLabel = getText(label);
  const checkedAttribute = value ? 'checked' : '';
  return `
<div class="pen-input-2group">
<label for="${id}" data-i18n="${label}">${transLabel}</label>
<input type="checkbox" id="${id}" ${checkedAttribute}>
</div>
  `;
}



function addDropDownBySpeedLine(id, label) {
  return `
      <div class="input-2group">
      <label for="speed-line-style" data-i18n="${label}">Speed Line Style</label>
      <select id="${id}">
          <option data-i18n="horizontal" value="horizontal">horizontal</option>
          <option data-i18n="vertical"   value="vertical">vertical</option>
          <option data-i18n="cross"      value="cross">cross</option>
      </select>
      </div>`;
//      <option data-i18n="diagonal"   value="diagonal">diagonal</option>
    }

function addDropDownByStyle(id, label) {
  return `
      <div class="input-2group">
      <label for="line-style" data-i18n="${label}">Line Style</label>
      <select id="${id}">
          <option data-i18n="solid" value="solid">Solid</option>
          <option data-i18n="dashed" value="dashed">Dashed</option>
          <option data-i18n="dotted" value="dotted">Dotted</option>
      </select>
      </div>`;
}

function addDropDownByDot(id, label) {
  return `
        <div class="control-group">
            <label data-i18n="${label}" for="dotShape">ドット形状</label>
            <select id="${id}">
                <option data-i18n="circle" value="circle">円形</option>
                <option data-i18n="square" value="square">四角形</option>
                <option data-i18n="triangle" value="triangle">三角形</option>
                <option data-i18n="star" value="star">星形</option>
                <option data-i18n="cross" value="cross">十字</option>
                <option data-i18n="heart" value="heart">ハート</option>
            </select>
        </div>`;
}



function addDropDownByGrad(id, label) {
  return `
        <div class="control-group">
            <label data-i18n="${label}" for="gradientDirection"></label>
            <select id="${id}">
                <option data-i18n="top-bottom" value="top-bottom"></option>
                <option data-i18n="bottom-top" value="bottom-top"></option>
                <option data-i18n="left-right" value="left-right"></option>
                <option data-i18n="right-left" value="right-left"></option>
            </select>
        </div>`;
}




