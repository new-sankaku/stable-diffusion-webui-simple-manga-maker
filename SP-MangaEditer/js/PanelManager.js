/** Load SVG(Verfical, Landscope) */
function loadSVGPlusReset(svgString) {
  allRemove();

  isUndoRedoOperation = true;
  fabric.loadSVGFromString(svgString, function (objects, options) {
    var canvasUsableHeight = canvas.height - svgPagging;
    var overallScaleX = canvas.width / options.width;
    var overallScaleY = canvasUsableHeight / options.height;
    var scaleToFit = Math.min(overallScaleX, overallScaleY);
    var offsetX = (canvas.width - options.width * scaleToFit) / 2;
    var offsetY =
      svgPagging / 2 + (canvasUsableHeight - options.height * scaleToFit) / 2;

    clipAreaCoords.left = offsetX;
    clipAreaCoords.top = offsetY;
    clipAreaCoords.width = options.width * scaleToFit + 4;
    clipAreaCoords.height = options.height * scaleToFit + 4;
    canvas.backgroundColor = "white";

    objects.forEach(function (obj) {
      if (obj.type === 'path') {
        var points = obj.path.map(function (item) {
          return { x: item[item.length - 2], y: item[item.length - 1], command: item[0] };
        });

        var threshold = Math.max(obj.width, obj.height) * 0.004;
        var startX = 0;
        var startY = 0;

        var vertices = points.filter(function (point, index, self) {
          if (point.command === 'M') {
            startX = point.x;
            startY = point.y;
            return true;
          } else if (point.command === 'C') {
            if (index === 0) {
              return true;
            }
            var prevPoint = self[index - 1];
            var xDiff = Math.abs(point.x - prevPoint.x);
            var yDiff = Math.abs(point.y - prevPoint.y);
            // console.log("DIFF:", "xDiff", xDiff, "yDiff", yDiff, "threshold",threshold, "RESULT",!((xDiff < threshold) && (yDiff < threshold)), "point.x",point.x, "point.y",point.y, "prevPoint",prevPoint);

            if( (xDiff < threshold) && (yDiff < threshold) ){
              return false;
            }

            var xDiff = Math.abs(point.x - startX);
            var yDiff = Math.abs(point.y - startY);
            if( (xDiff < threshold) && (yDiff < threshold) ){
              return false;
            }
            return true;
          }
          return false;
        });

        // console.log("threshold, vertices", threshold, ":", vertices);

        var polygon = new fabric.Polygon(vertices, {
          scaleX: scaleToFit,
          scaleY: scaleToFit,
          top: obj.top * scaleToFit + offsetY,
          left: obj.left * scaleToFit + offsetX,
          fill: 'transparent',
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
          selectable: true,
          hasControls: true,
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
          edit: false,
          hasBorders: true,
          cornerStyle: 'rect',

          isPanel: true,
          text2img_prompt: '',
          text2img_negativePrompt: '',
          text2img_seed: -2,
          text2img_width: -1,
          text2img_height: -1,
          text2img_samplingMethod: "DPM++ 2M",
          text2img_samplingSteps: 0,
      
          controls: fabric.Object.prototype.controls
        });

        // polygon.points = vertices;
        canvas.add(polygon);
      } else {
        obj.scaleX = scaleToFit;
        obj.scaleY = scaleToFit;
        obj.top = obj.top * scaleToFit + offsetY;
        obj.left = obj.left * scaleToFit + offsetX;
        obj.setCoords();

        obj.selectable = true;
        obj.hasControls = true;
        obj.lockMovementX = false;
        obj.lockMovementY = false;
        obj.lockRotation = false;
        obj.lockScalingX = false;
        obj.lockScalingY = false;

        canvas.add(obj);
      }
    });
    changeStrokeWidth( document.getElementById("strokeWidth").value );
    canvas.renderAll();
  });
  isUndoRedoOperation = true;
  updateLayerPanel();
}





/** Sppech bubble */
function loadSVGReadOnly(svgString) {

  var applyColor = document.getElementById('applyColorChange').checked;
  var fillColor = document.getElementById('bubbleFillColor').value;
  var strokeColor = document.getElementById('bubbleStrokeColor').value;

  fabric.loadSVGFromString(svgString, function (objects, options) {
    var canvasUsableHeight = canvas.height * 0.3 - svgPagging;
    var overallScaleX = (canvas.width * 0.3) / options.width;
    var overallScaleY = canvasUsableHeight / options.height;
    var scaleToFit = Math.min(overallScaleX, overallScaleY);
    var offsetX = (canvas.width - options.width * scaleToFit) / 2;
    var offsetY =
      svgPagging / 2 + (canvasUsableHeight - options.height * scaleToFit) / 2;

    var scaledObjects = objects.map(function (obj) {
      obj.scaleX = scaleToFit;
      obj.scaleY = scaleToFit;
      obj.top = obj.top * scaleToFit + offsetY;
      obj.left = obj.left * scaleToFit + offsetX;
      
      if (applyColor) {
        obj.set({
          fill: fillColor,
          stroke: strokeColor
        });
      }
      


      return obj;
    });

    var group = new fabric.Group(scaledObjects, {
      left: offsetX,
      top: offsetY,
      selectable: true,
      hasControls: true,
      lockMovementX: false,
      lockMovementY: false,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
    });

    canvas.add(group);
    canvas.renderAll();
    updateLayerPanel();
  });
}

/** load svg. */
const previewAreaVertical = document.getElementById(
  "svg-preview-area-vertical"
);
const previewAreaLandscape = document.getElementById(
  "svg-preview-area-landscape"
);
const speechBubbleArea = document.getElementById(
  "speech-bubble-svg-preview-area1"
);

window.onload = function () {
  previewAreaVertical.innerHTML = "";

  /** Load vertical manga panel image. */
  MangaPanelsImage_Vertical.forEach((item) => {
    const img = document.createElement("img");
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(item.svg);
    img.classList.add("svg-preview");
    img.alt = item.name;
    img.addEventListener("click", function () {
      loadSVGPlusReset(item.svg);
    });
    previewAreaVertical.appendChild(img);
  });

  /** Load landscape manga panel image. */
  previewAreaLandscape.innerHTML = "";
  MangaPanelsImage_Landscape.forEach((item) => {
    const img = document.createElement("img");
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(item.svg);
    img.classList.add("svg-preview");
    img.alt = item.name;
    img.addEventListener("click", function () {
      loadSVGPlusReset(item.svg);
    });
    previewAreaLandscape.appendChild(img);
  });

  /** Load speech bubble manga panel image. */
  // speechBubbleArea.innerHTML = "";
  SpeechBubble.forEach((item) => {
    const img = document.createElement("img");
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(item.svg);
    img.classList.add("svg-preview");
    img.alt = item.name;
    img.addEventListener("click", function () {
      loadSVGReadOnly(item.svg);
    });
    speechBubbleArea.appendChild(img);
  });
};

/** Disallow drag-on-drop. */
document.addEventListener("DOMContentLoaded", function () {
  var svgPreviewArea = document.getElementById("svg-container-vertical");
  svgPreviewArea.addEventListener(
    "mousedown",
    function (event) {
      event.preventDefault();
      event.stopPropagation();
    },
    false
  );
});

/** Disallow drag-on-drop. */
document.addEventListener("DOMContentLoaded", function () {
  var svgPreviewArea = document.getElementById("svg-container-landscape");
  svgPreviewArea.addEventListener(
    "mousedown",
    function (event) {
      event.preventDefault();
      event.stopPropagation();
    },
    false
  );
});

/** Disallow drag-on-drop. */
document.addEventListener("DOMContentLoaded", function () {
  var svgPreviewArea = document.getElementById("speech-bubble-area1");

  svgPreviewArea.addEventListener(
    "mousedown",
    function (event) {
      // スライダーの要素上でのマウスダウンイベントは許可する
      if (!event.target.closest("input[type='range']")) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    false
  );
});


function addSquare() {
  var square = new fabric.Polygon([
    { x: 0, y: 0 },
    { x: 250, y: 0 },
    { x: 250, y: 250 },
    { x: 0, y: 250 }
  ], {
    left: 50,
    top: 50,
    fill: '#FFFFFF',
    strokeWidth: 2,
    strokeUniform: true,
    stroke: 'black',
    objectCaching: false,
    transparentCorners: false,
    cornerColor: 'Blue',

    isPanel: text2img_initPrompt.isPanel,
    text2img_prompt: text2img_initPrompt.text2img_prompt ,
    text2img_negativePrompt: text2img_initPrompt.text2img_negativePrompt,
    text2img_seed: text2img_initPrompt.text2img_seed,
    text2img_width: text2img_initPrompt.text2img_width,
    text2img_height: text2img_initPrompt.text2img_height,
    text2img_samplingSteps: text2img_initPrompt.text2img_samplingSteps,

  });
  canvas.add(square);
}

function addPentagon() {
  var side = 250; // 五角形の一辺の長さ
  var angle = 54; // 中心から頂点までの角度（度数法）

  // 五角形の各頂点の計算
  var points = [];
  for (var i = 0; i < 5; i++) {
    // 角度をラジアンに変換し、頂点の座標を計算
    var x = side * Math.cos((Math.PI / 180) * (angle + i * 72));
    var y = side * Math.sin((Math.PI / 180) * (angle + i * 72));
    points.push({ x: x, y: y });
  }

  var pentagon = new fabric.Polygon(points, {
    left: 150,
    top: 150,
    fill: '#FFFFFF',
    strokeWidth: 2,
    strokeUniform: true,
    stroke: 'black',
    objectCaching: false,
    transparentCorners: false,
    cornerColor: 'blue',

    isPanel: text2img_initPrompt.isPanel,
    text2img_prompt: text2img_initPrompt.text2img_prompt,
    text2img_negativePrompt: text2img_initPrompt.text2img_negativePrompt,
    text2img_seed: text2img_initPrompt.text2img_seed,
    text2img_width: text2img_initPrompt.text2img_width,
    text2img_height: text2img_initPrompt.text2img_height,
    text2img_samplingSteps: text2img_initPrompt.text2img_samplingSteps,
  });

  canvas.add(pentagon);
}



function Edit() {
  var poly = canvas.getActiveObject();
  // console.log("poly", poly);
  if (!poly) return;
  
  // console.log("poly.edit", poly.edit);
  poly.edit = !poly.edit;
  if (poly.edit) {
    var lastControl = poly.points.length - 1;
    poly.cornerStyle = 'circle';
    poly.cornerColor = 'rgba(0,0,255,0.5)';
    poly.controls = poly.points.reduce(function (acc, point, index) {
      acc['p' + index] = new fabric.Control({
        positionHandler: polygonPositionHandler,
        actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
        actionName: 'modifyPolygon',
        pointIndex: index
      });
      return acc;
    }, {});
  } else {
    poly.cornerStyle = 'rect';
    poly.controls = fabric.Object.prototype.controls;
  }
  poly.hasBorders = !poly.edit;
  canvas.requestRenderAll();
}




function changeStrokeWidth(value) {
  canvas.getObjects().forEach(function(obj) {
    obj.set({
      strokeWidth: parseFloat(value),
      strokeUniform: true
    });
  });
  canvas.requestRenderAll();
}

function changeStrokeColor(value) {
  canvas.getObjects().forEach(function(obj) {
    obj.set('stroke', value);
  });
  canvas.requestRenderAll();
}

function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
    y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
  return fabric.util.transformPoint(
    { x: x, y: y },
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  );
}

function getObjectSizeWithStroke(object) {
  var stroke = new fabric.Point(
    object.strokeUniform ? 1 / object.scaleX : 1,
    object.strokeUniform ? 1 / object.scaleY : 1
  ).multiply(object.strokeWidth);
  return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
}

function actionHandler(eventData, transform, x, y) {
  var polygon = transform.target,
    currentControl = polygon.controls[polygon.__corner],
    mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
    polygonBaseSize = getObjectSizeWithStroke(polygon),
    size = polygon._getTransformedDimensions(0, 0),
    finalPointPosition = {
      x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
      y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
    };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
}

function anchorWrapper(anchorIndex, fn) {
  return function (eventData, transform, x, y) {
    var fabricObject = transform.target,
      absolutePoint = fabric.util.transformPoint({
        x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
        y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
      }, fabricObject.calcTransformMatrix()),
      actionPerformed = fn(eventData, transform, x, y),
      newDim = fabricObject._setPositionDimensions({}),
      polygonBaseSize = getObjectSizeWithStroke(fabricObject),
      newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
      newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  }
}

