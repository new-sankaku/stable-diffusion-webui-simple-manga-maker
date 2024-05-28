
var neonIntensity = parseFloat(
  document.getElementById("neonIntensitySlider").value
);
var isNeonEnabled = false;


function rgbToHex(rgb) {
  if( rgb ){
    return;
  }


  let match = rgb.match(/^rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)$/);
  if (!match) {
    return rgb;
  }
  function convert(color) {
    let hex = parseInt(color).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
  return '#' + convert(match[1]) + convert(match[2]) + convert(match[3]);
}

function updateTextControls(object) {
  if(isVerticalText(object)){
    let firstText = object.getObjects('text')[0];
    let inheritedColor = firstText ? firstText.fill : document.getElementById("textColorPicker").value;
    document.getElementById('textColorPicker').value = inheritedColor;
  }else if (isText(object)) {
    if( object.fill ){
      return ;
    }else{
      let hexColor = rgbToHex(object.fill);
      document.getElementById('textColorPicker').value = hexColor;
    }
    document.getElementById('fontSizeSlider').value = object.fontSize;
  }
}

function applyCSSTextEffect() {
  var firstTextEffectColorPicker = document.getElementById('firstTextEffectColorPicker').value;
  var secondTextEffectColorPicker = document.getElementById('secondTextEffectColorPicker').value;

  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    if (!activeObject.shadow) {
      // Apply a shadow using the first color picker's value
      activeObject.set("shadow", firstTextEffectColorPicker + " 5px 5px 10px");
    } else {
      // Toggle shadow off
      activeObject.set("shadow", null);
    }
    canvas.renderAll();
  }
}


function applyVividGradientEffect() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    var firstTextEffectColorPicker = document.getElementById('firstTextEffectColorPicker').value;
    var secondTextEffectColorPicker = document.getElementById('secondTextEffectColorPicker').value;

    const gradient = new fabric.Gradient({
      type: "linear",
      gradientUnits: "pixels",
      coords: { x1: 0, y1: activeObject.height / 2, x2: activeObject.width, y2: activeObject.height / 2 },
      colorStops: [
        { offset: 0, color: firstTextEffectColorPicker },
        { offset: 0.5, color: secondTextEffectColorPicker, opacity: 0.5 },
        { offset: 1, color: firstTextEffectColorPicker }
      ]
    });

    if (isVerticalText(activeObject)) {
      activeObject.setGradientFill(gradient);
      canvas.renderAll();
    }else{
      activeObject.set("fill", gradient);
      canvas.renderAll();
    }
  }
}

function applyInnerShadow() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    if (!activeObject.shadow) {
      activeObject.set({
        shadow: {
          color: "rgba(0, 0, 0, 0.8)",
          blur: 10,
          offsetX: 5,
          offsetY: 5,
        },
      });
    } else {
      activeObject.set("shadow", null);
    }
    canvas.renderAll();
  }
}


function applyNeonJitterEffect() {
  const activeObject = canvas.getActiveObject();

  if (isVerticalText(activeObject)) {
    const jitterAmount = 5; // ジッターの量
    const glowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']; // 虹色の配列

    glowColors.forEach((color, index) => {
      // ジッターエフェクトのためのランダムオフセット
      const jitterX = (Math.random() - 0.5) * jitterAmount;
      const jitterY = (Math.random() - 0.5) * jitterAmount;

      const shadow = new fabric.Text(activeObject.text, {
        left: activeObject.left + jitterX,
        top: activeObject.top + jitterY,
        fontSize: activeObject.fontSize,
        fontFamily: activeObject.fontFamily,
        fill: color,
        // グローエフェクトのための設定
        shadow: new fabric.Shadow({
          color: color,
          blur: 10, // グローの強さ
          offsetX: 0,
          offsetY: 0
        })
      });

      // ブレンドモードを設定
      shadow.globalCompositeOperation = 'lighter';

      // テキストの影をキャンバスに追加
      canvas.add(shadow);
      shadow.moveTo(activeObject.get('top') - 1 - index); // 影をオブジェクトの下層に移動
    });

    canvas.renderAll(); // Canvasを再描画
  }
}

function drawNeonJitterEffect(textObject) {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    const gradient = new fabric.Gradient({
      type: "linear",
      gradientUnits: "pixels",
      coords: { x1: 0, y1: 0, x2: canvas.width, y2: 0 },
      colorStops: [
        { offset: 0, color: "red" },
        { offset: 0.15, color: "orange" },
        { offset: 0.3, color: "yellow" },
        { offset: 0.5, color: "green" },
        { offset: 0.65, color: "blue" },
        { offset: 0.8, color: "indigo" },
        { offset: 1, color: "violet" },
      ],
    });
    activeObject.set("fill", gradient);

    // Jitter Effect
    activeObject.initDimensions();
    for (let i = 0; i < 10; i++) {
      activeObject.clone(function (clonedText) {
        clonedText.set({
          shadow: `rgba(${255 * Math.random()}, ${255 * Math.random()}, ${
            255 * Math.random()
          }, 0.5) 10px 10px 10px`,
        });
        clonedText.set({
          left: activeObject.left + Math.random() * 5,
          top: activeObject.top + Math.random() * 5,
        });
        canvas.add(clonedText);
      });
    }
  }
}


function applyZebraReflectionEffect() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    activeObject.clone(function (clonedText) {
      clonedText.set({
        top: activeObject.top + activeObject.height + 10,
        scaleX: 1,
        scaleY: -1,
        fill: "rgba(255, 255, 255, 0.5)",
      });
      canvas.add(clonedText);
    });
  }
}


function applyInnerShadow() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    activeObject.set({
      shadow: {
        color: "rgba(0, 0, 0, 0.8)",
        blur: 10,
        offsetX: 5,
        offsetY: 5,
      },
    });
    canvas.renderAll();
  }
}

function applySpaceAgeEffect() {
  const activeObject = canvas.getActiveObject();

  if (isText(activeObject)) {
    const offset = 10; // 影のオフセット量
    const alphaDecrement = 0.1; // 透明度の減少量
    let currentAlpha = 1.0;

    // 最初のテキストの複製を作成
    for (let i = 0; i < offset; i++) {
      currentAlpha -= alphaDecrement;
      // テキストオブジェクトの複製を作成
      const shadow = new fabric.Text(activeObject.text, {
        left: activeObject.left - i,
        top: activeObject.top - i,
        fontSize: activeObject.fontSize,
        fontFamily: activeObject.fontFamily,
        fill: 'rgba(0, 0, 0, ' + currentAlpha + ')'
      });

      // 影をキャンバスに追加
      canvas.add(shadow);
      shadow.moveTo(activeObject.get('top') - 1); // 影をオブジェクトの下層に移動
    }
    canvas.renderAll(); // Canvasを再描画
  }
}


function applySpaceAgeEffect2() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    const text = activeObject.text;
    let x = activeObject.left;
    let y = activeObject.top;
    canvas.remove(activeObject);
    for (let i = 0; i < 360; i += 15) {
      const fabricText = new fabric.Text(text, {
        left: x,
        top: y,
        fontSize: 48,
        fontFamily: "Arial",
        fill: `hsl(${i}, 100%, 50%)`,
      });
      canvas.add(fabricText);
      x += 1;
      y += 2;
    }
  }
}

function applyGeneratorBasedEffect() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    const text = activeObject.text;
    let x = activeObject.left;
    let y = activeObject.top;
    canvas.remove(activeObject);
    for (let i = 0; i < 10; i++) {
      const fabricText = new fabric.Text(text, {
        left: x + Math.random() * 10 - 5,
        top: y + Math.random() * 10 - 5,
        fontSize: 48,
        fontFamily: "Arial",
        fill: `rgba(255, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
      });
      canvas.add(fabricText);
    }
  }
}

function applyNeonEffect() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {

    var firstTextEffectColorPicker = document.getElementById('firstTextEffectColorPicker').value;
    var secondTextEffectColorPicker = document.getElementById('secondTextEffectColorPicker').value;

    if (!activeObject.fill || !activeObject.shadow) {
      activeObject.set({
        fill: firstTextEffectColorPicker,
        shadow: {
          color: secondTextEffectColorPicker,
          blur: 20,
        },
      });
    } 
    canvas.renderAll();
  }
}


function createTextbox() {
  var selectedFont = document.getElementById('fontSelector').value;
  var fontsize = document.getElementById("fontSizeSlider").value
  var fontStrokeWidth = document.getElementById("fontStrokeWidthSlider").value

  console.log( "selectedFont", selectedFont )
  var textbox = new fabric.Textbox("New Text.", {
    width: 150,
    top: 50,
    left: 50,
    fontSize: parseInt(fontsize),
    fontFamily: selectedFont, 
    fill: document.getElementById("textColorPicker").value,
    stroke: document.getElementById("textOutlineColorPicker").value,
    strokeWidth: parseInt(fontStrokeWidth),
  });
  
  textbox.on('text:changed', function() {
    textbox.set({ fontFamily: selectedFont });
    canvas.requestRenderAll();
  });

  canvas.add(textbox);
  canvas.setActiveObject(textbox);
  updateLayerPanel();
}

function toggleShadow() {
  var activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    var hasShadow = activeObject.shadow != null;
    activeObject.set(
      "shadow",
      hasShadow ? null : "rgba(0,0,0,0.3) 5px 5px 5px"
    );
    canvas.renderAll();
  }
}

function toggleBold() {
  var activeObject = canvas.getActiveObject();

  if( isVerticalText(activeObject) ){
    activeObject.getObjects().forEach(function(obj) {
      if (obj.type === 'text') {
        var isBold = obj.fontWeight === "bold";
        obj.set("fontWeight", isBold ? "" : "bold");
      }
    });
    canvas.renderAll();
  }else if(isText(activeObject)) {
    var isBold = activeObject.fontWeight === "bold";
    activeObject.set("fontWeight", isBold ? "" : "bold");
    canvas.renderAll();
  }
}

function changeFontSize(size) {
  var activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    activeObject.set("fontSize", parseInt(size));
    canvas.renderAll();
  }
}

function changeStrokeWidthSize(size) {
  var activeObject = canvas.getActiveObject();
  if( isVerticalText(activeObject) ){
    activeObject.getObjects().forEach(function(obj) {
      if (obj.type === 'text') {
        obj.set("strokeWidth", parseInt(size));
      }
    });
    canvas.renderAll();
  }else if (isText(activeObject)) {
    activeObject.set("strokeWidth", parseInt(size));
    canvas.renderAll();
  }
}


function changeTextColor(color) {
  var activeObject = canvas.getActiveObject();

  if( isVerticalText(activeObject) ){
    activeObject.getObjects().forEach(function(obj) {
      if (obj.type === 'text') {
        obj.set("fill", color);
      }
    });
    canvas.renderAll();
  }else if(isText(activeObject)) {
    activeObject.set("fill", color);
    canvas.renderAll();
  }
}
function changeOutlineTextColor(color) {
  var activeObject = canvas.getActiveObject();

  if( isVerticalText(activeObject) ){
    activeObject.getObjects().forEach(function(obj) {
      if (obj.type === 'text') {
        obj.set("stroke", color);
      }
    });
    canvas.renderAll();
  }else if(isText(activeObject)) {
    activeObject.set("stroke", color);
    canvas.renderAll();
  }
}

function changeNeonColor(color) {
  neonColor = color;
  var activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    updateNeonEffect(activeObject);
  }
}

function changeNeonIntensity(intensity) {
  neonIntensity = parseFloat(intensity);
  var activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    updateNeonEffect(activeObject);
  }
}

function updateNeonEffect(activeObject) {
  if (isText(activeObject)) {
    if (!isNeonEnabled) {
      activeObject.set("shadow", null);
      activeObject.set("stroke", null);
    } else {
      var neonColor = document.getElementById("firstTextEffectColorPicker").value;
      activeObject.set(
        "shadow",
        new fabric.Shadow({
          color: neonColor,
          blur: neonIntensity,
          offsetX: 0,
          offsetY: 0,
          affectStroke: false,
          opacity: neonIntensity,
        })
      );
      activeObject.set("stroke", neonColor);
      activeObject.set("strokeWidth", 2);
    }
    canvas.renderAll();
  }
}



function changeFont(font) {
  document.getElementById("text-preview-area").style.fontFamily = font;
  var select = document.getElementById("fontSelector");
  var options = select.options;
  for (var i = 0; i < options.length; i++) {
      options[i].style.fontFamily = font; // ドロップボックス内のフォントを変更
  }
}