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

  var i18n_horizontal = getText("horizontal");
  var i18n_vertical = getText("vertical");
  var i18n_cross = getText("cross");
  var i18n_label = getText(label);

  return `
      <div class="input-2group">
      <label for="speed-line-style" data-i18n="${label}">${i18n_label}</label>
      <select id="${id}">
          <option data-i18n="horizontal" value="horizontal">${i18n_horizontal}</option>
          <option data-i18n="vertical"   value="vertical">${i18n_vertical}</option>
          <option data-i18n="cross"      value="cross">${i18n_cross}</option>
      </select>
      </div>`;
    }

function addDropDownByStyle(id, label) {

  var i18n_solid = getText("solid");
  var i18n_dashed = getText("dashed");
  var i18n_dotted = getText("dotted");
  var i18n_line_style = getText("line-style");

  return `
      <div class="input-2group">
      <label for="line-style" data-i18n="${label}">${i18n_line_style}</label>
      <select id="${id}">
          <option data-i18n="solid" value="solid">${i18n_solid}</option>
          <option data-i18n="dashed" value="dashed">${i18n_dashed}</option>
          <option data-i18n="dotted" value="dotted">${i18n_dotted}</option>
      </select>
      </div>`;
}

function addDropDownByDot(id, label) {

  var i18n_circle = getText("circle");
  var i18n_square = getText("square");
  var i18n_triangle = getText("triangle");
  var i18n_star = getText("star");
  var i18n_cross = getText("cross");
  var i18n_heart = getText("heart");
  var i18n_label = getText(label);

  return `
        <div class="control-group">
            <label data-i18n="${label}" for="dotShape">${i18n_label}</label>
            <select id="${id}">
                <option data-i18n="circle" value="circle">${i18n_circle}</option>
                <option data-i18n="square" value="square">${i18n_square}</option>
                <option data-i18n="triangle" value="triangle">${i18n_triangle}</option>
                <option data-i18n="star" value="star">${i18n_star}</option>
                <option data-i18n="cross" value="cross">${i18n_cross}</option>
                <option data-i18n="heart" value="heart">${i18n_heart}</option>
            </select>
        </div>`;
}



function addDropDownByGrad(id, label) {
  var i18n_tb = getText("top-bottom");
  var i18n_bt = getText("bottom-top");
  var i18n_lr = getText("left-right");
  var i18n_rl = getText("right-left");

  return `
        <div class="control-group">
            <label data-i18n="${label}" for="gradientDirection"></label>
            <select id="${id}">
                <option data-i18n="top-bottom" value="top-bottom">${i18n_tb}</option>
                <option data-i18n="bottom-top" value="bottom-top">${i18n_bt}</option>
                <option data-i18n="left-right" value="left-right">${i18n_lr}</option>
                <option data-i18n="right-left" value="right-left">${i18n_rl}</option>
            </select>
        </div>`;
}




