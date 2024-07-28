var openButton = null;
var myWindow = null;
var textInput = null;

let isDragging = false;
let offsetX, offsetY;

document.addEventListener('DOMContentLoaded', function() {

  openButton = document.getElementById("openWindow");
  myWindow = document.getElementById("myWindow");
  textInput = document.getElementById("vertical_textInput");

  openButton.addEventListener("click", function () {
    const activeObject = canvas.getActiveObject();
    if (isVerticalText(activeObject)) {
      textInput.value = activeObject._objects.map((obj) => obj.text).join("");
    } else {
      textInput.value = "";
    }
    myWindow.style.display = "block";
  });
});


function closeWindow() {
  myWindow.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
  const header = myWindow.querySelector(".header");
  header.addEventListener("mousedown", function (e) {
    offsetX = e.clientX - myWindow.offsetLeft;
    offsetY = e.clientY - myWindow.offsetTop;
    isDragging = true;
  });
  
  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      myWindow.style.left = `${e.clientX - offsetX}px`;
      myWindow.style.top = `${e.clientY - offsetY}px`;
    }
  });
  
  document.addEventListener("mouseup", function () {
    isDragging = false;
  });
  
  
  fabric.VerticalText = fabric.util.createClass(fabric.Group, {
    type: 'verticalText',
  
    initialize: function(elements, options) {
      this.callSuper('initialize', elements, options);
    },
  
    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        type: 'verticalText'
      });
    },
  
    setGradientFill: function(gradient) {
      this.getObjects().forEach(function(obj) {
        obj.set('fill', gradient);
      });
    }
  });
  
  
  fabric.VerticalText.fromObject = function(object, callback) {
    fabric.util.enlivenObjects(object.objects, function(enlivenedObjects) {
      delete object.objects;
      callback(new fabric.VerticalText(enlivenedObjects, object));
    });
  };
  
  fabric.Object.prototype.verticalText = fabric.VerticalText;
  
  
});


let textGroup;
function createVerticalText(textString, options) {
  var selectedFont = document.getElementById('fontSelector').value;
  const ignoreRegex = /[･･･…ー（）｛｝「」(){}『』【】[\]]/;
  const reverceRegex = /[、。，A-Za-z0-9!"#$%&'()=~{`+*}_?><]/;

  const chars = textString.split("");
  const groupItems = [];
  let offsetX = options.left || 0;
  let offsetY = options.top || 0;
  const lineHeight = options.fontSize * 1.2;

  changeDoNotSaveHistory();
  chars.forEach((char, index) => {
    const isIgnored = ignoreRegex.test(char);
    const isReverce = reverceRegex.test(char);
    const text = new fabric.Text(char, {
      left: offsetX,
      top: offsetY,
      fontSize: options.fontSize,
      originX: isIgnored ? "right" : "left",
      originY: "bottom",
      fill: options.color,
      fontFamily: selectedFont, 
      angle: isIgnored ? 90 : 0,
      stroke: document.getElementById("textOutlineColorPicker").value,
      strokeWidth: 1,
    });

    canvas.add(text);
    const textWidth = text.width * text.scaleX;
    const actualHeight = text.height * text.scaleY;
    text.set({ top: offsetY + actualHeight });
    text.set({ left: isReverce ? offsetX + textWidth / 2 : offsetX });
    groupItems.push(text);
    canvas.remove(text);

    if (char === "\n") {
      offsetX -= lineHeight;
      offsetY = options.top || 0;
    } else {
      offsetY += actualHeight;
    }
  });
  changeDoSaveHistory();

  const group = new fabric.VerticalText(groupItems, {
    selectable: true,
    type: 'verticalText'
  });

  group.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
  });

  return group;
}

function updateVerticalText() {
  const textString = document.getElementById("vertical_textInput").value;
  const selectedObject = canvas.getActiveObject();

  if ( isVerticalText(selectedObject) ) {
    canvas.remove(selectedObject);

    let firstText = selectedObject.getObjects('text')[0];
    let inheritedFontSize = firstText ? firstText.fontSize : parseInt(document.getElementById('fontSizeSlider').value);
    let inheritedColor = firstText ? firstText.fill : document.getElementById("textColorPicker").value;

    const newTextGroup = createVerticalText(textString, {
      left: selectedObject.left,
      top: selectedObject.top,
      fontSize: inheritedFontSize,
      color: inheritedColor
    });
    canvas.add(newTextGroup);
  } else {
    const newTextGroup = createVerticalText(textString, {
      top: 50,
      left: 300,
      fontSize: parseInt(document.getElementById('fontSizeSlider').value),
      color: document.getElementById("textColorPicker").value
    });
    canvas.add(newTextGroup);
  }
  
  closeWindow();
}

document.getElementById("cancelButton").addEventListener("click", closeWindow);
document.getElementById("updateButton").addEventListener("click", updateVerticalText);

function openModalForEditing() {
  const selectedObject = canvas.getActiveObject();
  if (isVerticalText(selectedObject)) {
    textInput.value = selectedObject._objects.map((obj) => obj.text).join("");
    myWindow.style.display = "block";
  } else {
    textInput.value = "";
    myWindow.style.display = "block";
  }
}
