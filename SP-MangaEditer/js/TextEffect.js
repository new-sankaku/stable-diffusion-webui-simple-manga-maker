var neonColor = document.getElementById("neonColorPicker").value;
var neonIntensity = parseFloat(
  document.getElementById("neonIntensitySlider").value
);
var isNeonEnabled = false;

canvas.on('selection:created', function(event) {
  if (event.selected && event.selected[0]) {
      updateControls(event.selected[0]);
  }
});

canvas.on('selection:updated', function(event) {
  if (event.selected && event.selected[0]) {
      updateControls(event.selected[0]);
  }
});

function rgbToHex(rgb) {
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

function updateControls(object) {

  var selectedFont = document.getElementById('fontSelector').value;

  if(isVerticalText(object)){
    let firstText = object.getObjects('text')[0];
    let inheritedColor = firstText ? firstText.fill : document.getElementById("colorPicker").value;
    document.getElementById('colorPicker').value = inheritedColor;
  }else if (isText(object)) {
    let hexColor = rgbToHex(object.fill);
    document.getElementById('colorPicker').value = hexColor;
    document.getElementById('fontSizeSlider').value = object.fontSize;
  }
}

function applyCSSTextEffect() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    if (!activeObject.shadow) {
      activeObject.set("shadow", "rgba(0, 100, 255, 0.5) 5px 5px 10px");
    } else {
      activeObject.set("shadow", null);
    }
    canvas.renderAll();
  }
}


function applyPhotoshopTextEffect() {
  const activeObject = canvas.getActiveObject();
  if (isText(activeObject)) {
    if (!activeObject.fill) {
      const gradient = new fabric.Gradient({
        type: "linear",
        gradientUnits: "pixels",
        coords: { x1: 0, y1: 0, x2: canvas.width, y2: 0 },
        colorStops: [
          { offset: 0, color: "red" },
          { offset: 1, color: "blue" },
        ],
      });
      activeObject.set("fill", gradient);
    } else {
      activeObject.set("fill", null);
    }
    canvas.renderAll();
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

  if (activeObject && activeObject.type === 'text') {
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
    if (!activeObject.fill || !activeObject.shadow) {
      activeObject.set({
        fill: "pink",
        shadow: {
          color: "red",
          blur: 20,
        },
      });
    } else {
      activeObject.set("fill", null);
      activeObject.set("shadow", null);
    }
    canvas.renderAll();
  }
}

function createTextbox() {
  var selectedFont = document.getElementById('fontSelector').value;
  console.log( "selectedFont", selectedFont )
  var textbox = new fabric.Textbox("This is new text. 人類普遍のうんぬん。", {
    width: 300,
    top: 50,
    left: 50,
    fontSize: 30,
    fontFamily: selectedFont, 
    fill: document.getElementById("colorPicker").value,
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

function isVerticalText(activeObject) {
  if (activeObject && (activeObject.type === "verticalText") ) {
    return true;
  } else {
    return false;
  }
}

function isText(activeObject) {
  // console.log("isText(activeObject) start");

  if (activeObject && (activeObject.type === "text" || activeObject.type === "textbox"|| activeObject.type === "verticalText") ) {
    // console.log("isText(activeObject) true");
    return true;
  } else {
    // console.log("isText(activeObject) false", activeObject);
    if (activeObject){
      // console.log("isText(activeObject) ", activeObject.type);
    }
    return false;
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