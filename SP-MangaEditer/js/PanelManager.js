canvas.on("selection:created", handleSelection);
canvas.on("selection:updated", handleSelection);

document.getElementById("canvas-container").addEventListener(
  "dragover",
  function (e) {
    e.preventDefault();
  },
  false
);

function handleSelection(e) {
  var selectedObject = e.target;
  var layers = canvas.getObjects();
  var activeIndex = layers.indexOf(selectedObject);
  highlightActiveLayer(activeIndex);
  updateControls(selectedObject);
}

document.getElementById("canvas-container").addEventListener(
  "drop",
  function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var canvasElement = canvas.getElement();
    var rect = canvasElement.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var reader = new FileReader();
    reader.onload = function (f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function (img) {
        var canvasWidth = canvasElement.width;
        var canvasHeight = canvasElement.height;

        putImageInFrame(img, x, y);
      });
    };

    reader.readAsDataURL(file);
  },
  false
);

function putImageInFrame(img, x, y) {
  isUndoRedoOperation = true;

  img.set({
    left: x,
    top: y,
  });
  canvas.add(img);
  

  var targetFrameIndex = findTargetFrame(x, y);
  if (targetFrameIndex !== -1) {
    var targetFrame = canvas.item(targetFrameIndex);
    var frameCenterX =
      targetFrame.left + (targetFrame.width * targetFrame.scaleX) / 2;
    var frameCenterY =
      targetFrame.top + (targetFrame.height * targetFrame.scaleY) / 2;
    var scaleToFitX = (targetFrame.width * targetFrame.scaleX) / img.width;
    var scaleToFitY = (targetFrame.height * targetFrame.scaleY) / img.height;
    var scaleToFit = Math.max(scaleToFitX, scaleToFitY);

    var clipPath;
    if (targetFrame.type === "polygon") {
      clipPath = new fabric.Polygon(targetFrame.points);
      clipPath.set({
        left:
          targetFrame.left +
          targetFrame.strokeWidth -
          0.45 * targetFrame.scaleX,
        top:
          targetFrame.top + targetFrame.strokeWidth - 0.45 * targetFrame.scaleY,
        wight:
          targetFrame.wight -
          targetFrame.strokeWidth -
          0.45 * targetFrame.scaleX,
        height: targetFrame.height,
        scaleX:
          targetFrame.scaleX - targetFrame.strokeWidth / targetFrame.width,
        scaleY:
          targetFrame.scaleY - targetFrame.strokeWidth / targetFrame.height,
        absolutePositioned: true,
      });
      // console.log("putImageInFrame clipPath", clipPath);
    } else {
      clipPath = new fabric.Path(targetFrame.path);
      clipPath.set({
        left: targetFrame.left + targetFrame.strokeWidth,
        top: targetFrame.top + targetFrame.strokeWidth,
        scaleX:
          targetFrame.scaleX - targetFrame.strokeWidth / targetFrame.width,
        scaleY:
          targetFrame.scaleY - targetFrame.strokeWidth / targetFrame.height,
        absolutePositioned: true,
      });
    }
    img.set({
      left: frameCenterX - (img.width * scaleToFit) / 2,
      top: frameCenterY - (img.height * scaleToFit) / 2,
      scaleX: scaleToFit * 1.05,
      scaleY: scaleToFit * 1.05,
    });

    img.clipPath = clipPath;
  } else {
    var scaleToCanvasWidth = 300 / img.width;
    var scaleToCanvasHeight = 300 / img.height;
    var scaleToCanvas = Math.min(scaleToCanvasWidth, scaleToCanvasHeight);

    img.set({
      left: 50,
      top: 50,
      scaleX: scaleToCanvas,
      scaleY: scaleToCanvas,
    });
  }
  
  canvas.setActiveObject(img);
  saveInitialState(img)
  
  canvas.renderAll();
  updateLayerPanel();

  isUndoRedoOperation = false;
  saveStateByManual();
}

function findTargetFrame(x, y) {
  //console.log( "findTargetFrame:x y, ", x, " ", y );

  let objects = canvas.getObjects().reverse();
  for (let i = 0; i < objects.length; i++) {
    if (
      objects[i].type === "path" ||
      objects[i].type === "rect" ||
      objects[i].type === "polygon"
    ) {
      // console.log("findTargetFrame(x, y)", findTargetFrame);
      let frameBounds = objects[i].getBoundingRect(true);
      if (
        x >= frameBounds.left &&
        x <= frameBounds.left + frameBounds.width &&
        y >= frameBounds.top &&
        y <= frameBounds.top + frameBounds.height
      ) {
        return canvas.getObjects().length - 1 - i;
      }
    }
  }
  //console.log("findTargetFrame(x, y) NO HIT.");
  return -1;
}

function isWithin(image, frame) {
  let frameBounds = frame.getBoundingRect(true);
  let imageBounds = image.getBoundingRect(true);

  let within =
    imageBounds.left >= frameBounds.left &&
    imageBounds.top >= frameBounds.top &&
    imageBounds.left + imageBounds.width * image.scaleX <=
      frameBounds.left + frameBounds.width &&
    imageBounds.top + imageBounds.height * image.scaleY <=
      frameBounds.top + frameBounds.height;
  return within;
}

function adjustImageToFitFrame(image, frame) {
  let frameBounds = frame.getBoundingRect();
  let scale = Math.min(
    frameBounds.width / image.getScaledWidth(), 
    frameBounds.height / image.getScaledHeight()
  );
  image.set({
    left: frameBounds.left + (frameBounds.width - image.width * scale) / 2,
    top: frameBounds.top + (frameBounds.height - image.height * scale) / 2,
    scaleX: scale,
    scaleY: scale,
  });
}

/** Load SVG(Verfical, Landscope) */
function loadSVGPlusReset(svgString) {
  allRemove();
  stateStack = [];
  imageMap.clear();
  
  isUndoRedoOperation = true;
  fabric.loadSVGFromString(svgString, function (objects, options) {
    resizeCanvasToObject(options.width , options.height);

    var canvasUsableHeight = canvas.height - svgPagging;
    var overallScaleX = canvas.width / options.width;
    var overallScaleY = canvasUsableHeight / options.height;
    var scaleToFit = Math.min(overallScaleX, overallScaleY);
    var offsetX = (canvas.width - options.width * scaleToFit) / 2;
    var offsetY = svgPagging / 2 + (canvasUsableHeight - options.height * scaleToFit) / 2;

    var strokeWidthScale = canvas.width / 700;
    var strokeWidth = 2 * strokeWidthScale;

    console.log("strokeWidth", strokeWidth);

    clipAreaCoords.left = offsetX;
    clipAreaCoords.top = offsetY;
    clipAreaCoords.width = options.width * scaleToFit + 4;
    clipAreaCoords.height = options.height * scaleToFit + 4;
    canvas.backgroundColor = "white";

    objects.forEach(function (obj) {
      if (obj.type === "path") {
        var points = obj.path.map(function (item) {
          return {
            x: item[item.length - 2],
            y: item[item.length - 1],
            command: item[0],
          };
        });

        var threshold = Math.max(obj.width, obj.height) * 0.004;
        var startX = 0;
        var startY = 0;

        var vertices = points.filter(function (point, index, self) {
          if (point.command === "M") {
            startX = point.x;
            startY = point.y;
            return true;
          } else if (point.command === "C") {
            if (index === 0) {
              return true;
            }
            var prevPoint = self[index - 1];
            var xDiff = Math.abs(point.x - prevPoint.x);
            var yDiff = Math.abs(point.y - prevPoint.y);
            // console.log("DIFF:", "xDiff", xDiff, "yDiff", yDiff, "threshold",threshold, "RESULT",!((xDiff < threshold) && (yDiff < threshold)), "point.x",point.x, "point.y",point.y, "prevPoint",prevPoint);

            if (xDiff < threshold && yDiff < threshold) {
              return false;
            }

            var xDiff = Math.abs(point.x - startX);
            var yDiff = Math.abs(point.y - startY);
            if (xDiff < threshold && yDiff < threshold) {
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
          fill: "transparent",
          stroke: obj.stroke,
          strokeWidth: strokeWidth,
          selectable: true,
          hasControls: true,
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
          edit: false,
          hasBorders: true,
          cornerStyle: "rect",

          isPanel: true,
          text2img_prompt: "",
          text2img_negativePrompt: "",
          text2img_seed: -2,
          text2img_width: -1,
          text2img_height: -1,
          text2img_samplingMethod: "DPM++ 2M",
          text2img_samplingSteps: 0,

          controls: fabric.Object.prototype.controls,
        });
        // polygon.points = vertices;
        canvas.add(polygon);
      } else {
        obj.scaleX = scaleToFit;
        obj.scaleY = scaleToFit;
        obj.top = obj.top * scaleToFit + offsetY;
        obj.left = obj.left * scaleToFit + offsetX;
        obj.setCoords();
        obj.strokeWidth = strokeWidth;
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
    changeStrokeWidth(document.getElementById("strokeWidth").value);
    canvas.renderAll();
  });

  resizeCanvas(canvas.width, canvas.height);

  saveState();
  isUndoRedoOperation = true;
  updateLayerPanel();
}

/** Sppech bubble */
function loadSVGReadOnly(svgString) {
  var applyColor = document.getElementById("applyColorChange").checked;
  var fillColor = document.getElementById("bubbleFillColor").value;
  var strokeColor = document.getElementById("bubbleStrokeColor").value;

  fabric.loadSVGFromString(svgString, function (objects, options) {
    var canvasUsableHeight = canvas.height * 0.3 - svgPagging;
    var overallScaleX = (canvas.width * 0.3) / options.width;
    var overallScaleY = canvasUsableHeight / options.height;
    var scaleToFit = Math.min(overallScaleX, overallScaleY);
    var offsetX = (canvas.width - options.width * scaleToFit) / 2;
    var offsetY = svgPagging / 2 + (canvasUsableHeight - options.height * scaleToFit) / 2;

    var scaledObjects = objects.map(function (obj) {
      obj.scaleX = scaleToFit;
      obj.scaleY = scaleToFit;
      obj.top = obj.top * scaleToFit + offsetY;
      obj.left = obj.left * scaleToFit + offsetX;
      obj.strokeWidth = 2;
      if (applyColor) {
        obj.set({
          fill: fillColor,
          stroke: strokeColor,
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
  var square = new fabric.Polygon(
    [
      { x: 0, y: 0 },
      { x: 250, y: 0 },
      { x: 250, y: 250 },
      { x: 0, y: 250 },
    ],
    {
      left: 50,
      top: 50,
      fill: "#FFFFFF",
      strokeWidth: 2,
      strokeUniform: true,
      stroke: "black",
      objectCaching: false,
      transparentCorners: false,
      cornerColor: "Blue",

      isPanel: text2img_initPrompt.isPanel,
      text2img_prompt: text2img_initPrompt.text2img_prompt,
      text2img_negativePrompt: text2img_initPrompt.text2img_negativePrompt,
      text2img_seed: text2img_initPrompt.text2img_seed,
      text2img_width: text2img_initPrompt.text2img_width,
      text2img_height: text2img_initPrompt.text2img_height,
      text2img_samplingSteps: text2img_initPrompt.text2img_samplingSteps,
    }
  );
  canvas.add(square);
}

function addPentagon() {
  var side = 150; // 五角形の一辺の長さ
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
    fill: "#FFFFFF",
    strokeWidth: 2,
    strokeUniform: true,
    stroke: "black",
    objectCaching: false,
    transparentCorners: false,
    cornerColor: "blue",

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
  if (!poly) return;

  poly.edit = !poly.edit;
  if (poly.edit) {
    var lastControl = poly.points.length - 1;
    poly.cornerStyle = "circle";
    poly.cornerColor = "rgba(0,0,255,0.5)";
    poly.controls = poly.points.reduce(function (acc, point, index) {
      acc["p" + index] = new fabric.Control({
        positionHandler: polygonPositionHandler,
        actionHandler: anchorWrapper(
          index > 0 ? index - 1 : lastControl,
          actionHandler
        ),
        actionName: "modifyPolygon",
        pointIndex: index,
      });
      return acc;
    }, {});
  } else {
    poly.cornerStyle = "rect";
    poly.controls = fabric.Object.prototype.controls;
  }
  poly.hasBorders = !poly.edit;
  canvas.requestRenderAll();
}

function changeStrokeWidth(value) {
  canvas.getObjects().forEach(function (obj) {
    obj.set({
      strokeWidth: parseFloat(value),
      strokeUniform: true,
    });
  });
  canvas.requestRenderAll();
}

function changeStrokeColor(value) {
  canvas.getObjects().forEach(function (obj) {
    obj.set("stroke", value);
  });
  canvas.requestRenderAll();
}

function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
    y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
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
    mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    ),
    polygonBaseSize = getObjectSizeWithStroke(polygon),
    size = polygon._getTransformedDimensions(0, 0),
    finalPointPosition = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y,
    };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  polygon.dirty = true;
  return true;
}

function anchorWrapper(anchorIndex, fn) {
  return function (eventData, transform, x, y) {
    var fabricObject = transform.target,
      absolutePoint = fabric.util.transformPoint(
        {
          x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
          y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
        },
        fabricObject.calcTransformMatrix()
      ),
      actionPerformed = fn(eventData, transform, x, y),
      newDim = fabricObject._setPositionDimensions({}),
      polygonBaseSize = getObjectSizeWithStroke(fabricObject),
      newX =
        (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
        polygonBaseSize.x,
      newY =
        (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
        polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  };
}

var gridSize = 10;
var snapTimeout;
var isGridVisible = false;

// グリッド線を描画する関数
function drawGrid() {
  var gridCanvas = document.createElement("canvas");
  gridCanvas.width = canvas.width;
  gridCanvas.height = canvas.height;
  var gridCtx = gridCanvas.getContext("2d");
  gridCtx.strokeStyle = "#ccc";

  for (var i = 0; i <= canvas.width / gridSize; i++) {
    gridCtx.beginPath();
    gridCtx.moveTo(i * gridSize, 0);
    gridCtx.lineTo(i * gridSize, canvas.height);
    gridCtx.stroke();
  }

  for (var i = 0; i <= canvas.height / gridSize; i++) {
    gridCtx.beginPath();
    gridCtx.moveTo(0, i * gridSize);
    gridCtx.lineTo(canvas.width, i * gridSize);
    gridCtx.stroke();
  }

  canvas.setBackgroundImage(
    gridCanvas.toDataURL(),
    canvas.renderAll.bind(canvas)
  );
}

// グリッド線を削除する関数
function removeGrid() {
  canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
}

// グリッド線の表示/非表示を切り替える関数
function toggleGrid() {
  if (isGridVisible) {
    removeGrid();
    isGridVisible = false;
  } else {
    drawGrid();
    isGridVisible = true;
  }
  canvas.renderAll();
}

// ボタンクリックでグリッド線の表示/非表示を切り替え
document
  .getElementById("toggleGridButton")
  .addEventListener("click", toggleGrid);

// グリッド線の幅を更新する関数
function updateGridSize() {
  var newGridSize = parseInt(
    document.getElementById("gridSizeInput").value,
    10
  );
  if (newGridSize > 0) {
    gridSize = newGridSize;
    if (isGridVisible) {
      removeGrid();
      drawGrid();
    }
  }
}

// グリッド線の幅を変更する際に自動更新
document
  .getElementById("gridSizeInput")
  .addEventListener("input", updateGridSize);

// オブジェクトをグリッド線にスナップさせる関数
function snapToGrid(target) {
  if (isGridVisible) {
    target.set({
      left: Math.round(target.left / gridSize) * gridSize,
      top: Math.round(target.top / gridSize) * gridSize,
    });
    canvas.renderAll();
  }
}

// デバウンスされたスナップ関数
function debounceSnapToGrid(target) {
  clearTimeout(snapTimeout);
  snapTimeout = setTimeout(function () {
    snapToGrid(target);
  }, 50);
}

// オブジェクト移動イベントリスナーを追加
canvas.on("object:moving", function (e) {
  if (isGridVisible) {
    debounceSnapToGrid(e.target);
  }
});
