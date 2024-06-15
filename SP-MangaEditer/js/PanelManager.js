document.getElementById("canvas-container").addEventListener(
  "dragover",
  function (e) {
    e.preventDefault();
  },
  false
);

function handleSelection(e) {
  var selectedObject = e.target;
  updateControls(selectedObject);
}

document.getElementById("canvas-container").addEventListener(
  "drop",
  async function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var canvasElement = canvas.getElement();
    var rect = canvasElement.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    // WebPに変換
    var webpFile;
    try {
      webpFile = await imgFile2webpFile(file);
    } catch (error) {
      console.error('Failed to convert to WebP', error);
      return;
    }

    var reader = new FileReader();
    reader.onload = function (f) {
      var data = f.target.result;

      fabric.Image.fromURL(data, function (img) {
        console.log("drop stateStack.length", stateStack.length);
        if (stateStack.length >= 2) {
          var canvasX = x / canvasContinerScale;
          var canvasY = y / canvasContinerScale;
          putImageInFrame(img, canvasX, canvasY);
        } else {
          console.log("drop img.width, img.height", img.width, img.height);
          resizeCanvasByNum(img.width, img.height);
          initialPutImage(img, 0, 0);
        }

        setImage2ImageInitPrompt(img);
      });
    };

    reader.readAsDataURL(webpFile);
  },
  false
);

function initialPutImage(img) {
  img.set({
    left: 0,
    top: 0,
  });
  setNotSave(img);
  canvas.add(img);

  canvas.setActiveObject(img);
  saveInitialState(img);
  canvas.renderAll();

  updateLayerPanel();
  saveStateByManual();
  return img;
}

function putImageInFrame(img, x, y) {
  
  img.set({
    left: x,
    top: y,
  });
  setNotSave(img);
  canvas.add(img);

  var targetFrameIndex = findTargetFrame(x, y);

  console.log(
    "scale, x, y, targetFrameIndex",
    canvasContinerScale,
    x,
    y,
    targetFrameIndex
  );
  if (targetFrameIndex !== -1) {
    var targetFrame  = canvas.item(targetFrameIndex);
    var frameCenterX = targetFrame.left + (targetFrame.width * targetFrame.scaleX) / 2;
    var frameCenterY = targetFrame.top + (targetFrame.height * targetFrame.scaleY) / 2;
    var scaleToFitX  = (targetFrame.width * targetFrame.scaleX) / img.width;
    var scaleToFitY  = (targetFrame.height * targetFrame.scaleY) / img.height;
    var scaleToFit   = Math.max(scaleToFitX, scaleToFitY);

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
    if( img.name ){
      img.name = targetFrame.name + "-" + img.name;
    }else{
      img.name = targetFrame.name + " In Image";
    }
    
    img.clipPath = clipPath;
    setGUID(targetFrame, img);

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
  saveInitialState(img);

  canvas.renderAll();
  updateLayerPanel();
  saveStateByManual();
  return img;
}

function findTargetFrame(x, y) {
  //console.log( "findTargetFrame:x y, ", x, " ", y );

  let objects = canvas.getObjects().reverse();
  for (let i = 0; i < objects.length; i++) {
    if (isShapes(objects[i])) {
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

document.getElementById("A4-H").addEventListener("click", function () {
  loadBookSize(210, 297);
});
document.getElementById("A4-V").addEventListener("click", function () {
  loadBookSize(297, 210);
});
document.getElementById("B4-H").addEventListener("click", function () {
  loadBookSize(257, 364);
});
document.getElementById("B4-V").addEventListener("click", function () {
  loadBookSize(364, 257);
});

function loadBookSize(width, height) {
  if (stateStack.length > 2) {
    executeWithConfirmation("New Project?", function () {
      changeDoNotSaveHistory();
      resizeCanvasToObject(width, height);
      addSquareBySize(width, height);
      changeDoSaveHistory();
    });
  } else {
    changeDoNotSaveHistory();
    resizeCanvasToObject(width, height);
    addSquareBySize(width, height);
    changeDoSaveHistory();
  }
}

function addSquareBySize(width, height) {
  initImageHistory();
  saveState();

  var strokeWidthScale = canvas.width / 700;
  var strokeWidth = 2 * strokeWidthScale;
  console.log("strokeWidth", strokeWidth);

  var widthScale = canvas.width / width;
  var heightScale = canvas.height / height;

  var svgPaggingWidth = svgPagging * widthScale;
  var svgPaggingHeight = svgPagging * heightScale;

  var svgPaggingHalfWidth = svgPaggingWidth / 2;
  var svgPaggingHalfHeight = svgPaggingHeight / 2;

  var newWidth = width * widthScale - svgPaggingWidth;
  var newHeight = height * heightScale - svgPaggingHeight;

  var square = new fabric.Polygon(
    [
      { x: 0, y: 0 },
      { x: newWidth, y: 0 },
      { x: newWidth, y: newHeight },
      { x: 0, y: newHeight },
    ],
    {
      left: svgPaggingHalfWidth,
      top: svgPaggingHalfHeight,
      scaleX: 1,
      scaleY: 1,
      fill: "#FFFFFF",
      strokeWidth: strokeWidth,
      strokeUniform: true,
      stroke: "black",
      objectCaching: false,
      transparentCorners: false,
      cornerColor: "Blue",
      isPanel: true,
    }
  );

  
  setText2ImageInitPrompt(square);
  setPanelValue(square);
  canvas.add(square);
  updateLayerPanel();
}

/** Load SVG(Verfical, Landscope) */
function loadSVGPlusReset(svgString) {
  initImageHistory();
  saveState();

  changeDoNotSaveHistory();

  fabric.loadSVGFromString(svgString, function (objects, options) {
    resizeCanvasToObject(options.width, options.height);

    var canvasUsableHeight = canvas.height - svgPagging;
    var overallScaleX = canvas.width / options.width;
    var overallScaleY = canvasUsableHeight / options.height;
    var scaleToFit = Math.min(overallScaleX, overallScaleY);
    var offsetX = (canvas.width - options.width * scaleToFit) / 2;
    var offsetY =
      svgPagging / 2 + (canvasUsableHeight - options.height * scaleToFit) / 2;

    var strokeWidthScale = canvas.width / 700;
    var strokeWidth = 2 * strokeWidthScale;

    console.log("strokeWidth", strokeWidth);

    clipAreaCoords.left = offsetX;
    clipAreaCoords.top = offsetY;
    clipAreaCoords.width = options.width * scaleToFit + 4;
    clipAreaCoords.height = options.height * scaleToFit + 4;

    var bgColorInput = document.getElementById("bg-color");
    canvas.backgroundColor = bgColorInput.value;

    objects.reverse().forEach(function (obj) {
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
          isPanel: true,
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

          controls: fabric.Object.prototype.controls,
        });
        setText2ImageInitPrompt(polygon);

        canvas.add(polygon);
      } else {
        isPanel: true, (obj.scaleX = scaleToFit);
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
    panelAllChange();
    canvas.renderAll();
  });

  resizeCanvas(canvas.width, canvas.height);
  changeDoSaveHistory();
  saveState();

  updateLayerPanel();
}

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

document.addEventListener("DOMContentLoaded", function () {
  var svgPreviewArea = document.getElementById("speech-bubble-area1");

  svgPreviewArea.addEventListener(
    "mousedown",
    function (event) {
      // スライダーと数値入力の要素上でのマウスダウンイベントは許可する
      if (
        !event.target.closest("input[type='range']") &&
        !event.target.closest("input[type='number']")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    false
  );
});

function addSquare() {
  var strokeWidthScale = canvas.width / 700;
  var strokeWidth = 2 * strokeWidthScale;

  var square = new fabric.Polygon(
    [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 200, y: 300 },
      { x: 0, y: 300 },
    ],
    {
      left: 50,
      top: 50,
      scaleX: 2,
      scaleY: 2,
      fill: "#FFFFFF",
      strokeWidth: strokeWidth,
      strokeUniform: true,
      stroke: "black",
      objectCaching: false,
      transparentCorners: false,
      cornerColor: "Blue",
      isPanel: true,
    }
  );
  setText2ImageInitPrompt(square);
  setPanelValue(square);
  canvas.add(square);
  updateLayerPanel();
}

function addPentagon() {
  var side = 150;
  var angle = 54;

  var strokeWidthScale = canvas.width / 700;
  var strokeWidth = 2 * strokeWidthScale;

  var points = [];
  for (var i = 0; i < 5; i++) {
    var x = side * Math.cos((Math.PI / 180) * (angle + i * 72));
    var y = side * Math.sin((Math.PI / 180) * (angle + i * 72));
    points.push({ x: x, y: y });
  }

  var pentagon = new fabric.Polygon(points, {
    left: 150,
    top: 150,
    fill: "#FFFFFF",
    strokeWidth: strokeWidth,
    strokeUniform: true,
    stroke: "black",
    objectCaching: false,
    transparentCorners: false,
    cornerColor: "blue",
    isPanel: true,
  });
  setText2ImageInitPrompt(pentagon);
  setPanelValue(pentagon);
  canvas.add(pentagon);
  updateLayerPanel();
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
  updateLayerPanel();
}




function changePanelStrokeWidth(value) {
  var activeObject = canvas.getActiveObject();
  if (isPanel(activeObject)) {
    activeObject.set({
      strokeWidth: parseFloat(value),
      strokeUniform: true,
    });
    canvas.requestRenderAll();
  }
}
function changePanelStrokeColor(value) {
  var activeObject = canvas.getActiveObject();
  if (isPanel(activeObject)) {
    activeObject.set("stroke", value);
    canvas.requestRenderAll();
  }
}
function changePanelOpacity(value) {
  var activeObject = canvas.getActiveObject();
  if (isPanel(activeObject)) {
    const opacity = value / 100;
    activeObject.set('opacity', opacity);
    canvas.requestRenderAll();
  }
}
function changePanelFillColor(value) {
  var activeObject = canvas.getActiveObject();
  if (isPanel(activeObject)) {
    activeObject.set("fill", value);
    canvas.requestRenderAll();
  }
}

function panelAllChange() {
  var strokeWidthValue  = document.getElementById("panelStrokeWidth").value;
  var strokeColorValue  = document.getElementById("panelStrokeColor").value;
  var opacityValue      = document.getElementById("panelOpacity").value;
  const opacity         = opacityValue / 100;
  var fillValue         = document.getElementById("panelFillColor").value;

  canvas.getObjects().forEach(function (obj) {
    if (isPanel(obj)) {
      obj.set({
        strokeWidth: parseFloat(strokeWidthValue),
        strokeUniform: true,
      });
      obj.set("stroke", strokeColorValue);
      obj.set("fill", fillValue);
      obj.set('opacity', opacity);
    }
  });
  canvas.requestRenderAll();
}


function setPanelValue(obj) {
  console.log( "setPanelValue" );
  var strokeWidthValue  = document.getElementById("panelStrokeWidth").value;
  var strokeColorValue  = document.getElementById("panelStrokeColor").value;
  var opacityValue      = document.getElementById("panelOpacity").value;
  const opacity         = opacityValue / 100;
  var fillValue         = document.getElementById("panelFillColor").value;

  if (isPanel(obj)) {
    console.log( "setPanelValue isPanel" );

    obj.set({
      strokeWidth: parseFloat(strokeWidthValue),
      strokeUniform: true,
    });
    obj.set("stroke", strokeColorValue);
    obj.set("fill", fillValue);
    obj.set('opacity', opacity);
    canvas.requestRenderAll();
  }
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

document
  .getElementById("view_layers_checkbox")
  .addEventListener("change", function () {
    changeView("layer-panel", this.checked);
  });
document
  .getElementById("view_controles_checkbox")
  .addEventListener("change", function () {
    changeView("controls", this.checked);
  });
function changeView(elementId, isVisible) {
  var element = document.getElementById(elementId);
  if (isVisible) {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
  adjustCanvasSize();
}
