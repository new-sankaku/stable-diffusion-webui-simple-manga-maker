
const sbPointButton    = $("sbPointButton");
const sbFreehandButton = $("sbFreehandButton");
const sbSelectButton   = $("sbSelectButton");
const sbMoveButton     = $("sbMoveButton");
const sbDeleteButton   = $("sbDeleteButton");

const sbSmoothing    = $("sbSmoothing");
const sbFillColor    = $("sbFillColor");
const sbStrokeColor  = $("sbStrokeColor");
const sbStrokeWidth  = $("sbStrokeWidth");
const sbFillOpacity  = $("sbFillOpacity");
const sbSornerRadius = $("sbSornerRadius");
const sbPointSpace   = $("sbPointSpace");
const geometryFactory = new jsts.geom.GeometryFactory();

let currentMode = "select";
let points = [];
let mousePosition;
let temporaryLine;
let temporaryShape;
let isDrawing = false;
let editingGroup;
let selectedObject;
let controlPoints = [];
let activePoint;
let lastRenderTime = 0;

var nowLine = "sb_a";
switchSBLine("sb_a");

function switchSBLine(type){
  clearSBLine();
  nowLine = type;
  $( type + "Button").classList.add("selected");
}
function clearSBLine(){
  [$("sb_aButton"), $("sb_bButton"), $("sb_cButton"), $("sb_dButton"), $("sb_eButton"), $("sb_fButton"), $("sb_gButton")].forEach(btn => btn.classList.remove("selected"));
}

function getNowLineStyle(){
  var sbopa = parseInt(sbFillOpacity.value) / 100;
  var sbstw = parseFloat(sbStrokeWidth.value);
  switch (nowLine) {
    case "sb_b":
      return {fill: sbFillColor.value, stroke: sbStrokeColor.value, strokeWidth: sbstw, opacity: sbopa, strokeDashArray: [5, 5]}
    case "sb_c":
      return {fill: sbFillColor.value, stroke: sbStrokeColor.value, strokeWidth: sbstw, opacity: sbopa, strokeLineCap: "round", strokeDashArray: [5, 10]}
    case "sb_d":
      return {fill: sbFillColor.value, stroke: sbStrokeColor.value, strokeWidth: sbstw, opacity: sbopa, strokeDashArray: [1, 3]}
    case "sb_e":
      return {fill: sbFillColor.value, stroke: sbStrokeColor.value, strokeWidth: sbstw, opacity: sbopa, strokeDashArray: [20, 5, 10, 5]}
    case "sb_f":
      return {fill: sbFillColor.value, stroke: sbStrokeColor.value, strokeWidth: sbstw, opacity: sbopa, strokeDashArray: [15, 3, 3, 3]}
    case "sb_g":
      return {fill: sbFillColor.value, stroke: sbStrokeColor.value, strokeWidth: sbstw, opacity: sbopa, strokeDashArray: [10, 5, 2, 5]}
    default:
      //sb_a
      return {fill: sbFillColor.value, stroke: sbStrokeColor.value, strokeWidth: sbstw, opacity: sbopa}
  }
}

function setSBActiveButton(button) {
  [sbPointButton, sbFreehandButton, sbSelectButton, sbMoveButton, sbDeleteButton].forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
}

function createSpeechBubble(geometry) {
  const coordinates = geometry.getCoordinates();
  let minX = Infinity;
  let minY = Infinity;
  coordinates.forEach(coord => {
    minX = Math.min(minX, coord.x);
    minY = Math.min(minY, coord.y);
  });
  const adjustedCoordinates = coordinates.map(coord => ({
    x: coord.x - minX,
    y: coord.y - minY
  }));

  // const styles = {
  //   fill: sbFillColor.value,
  //   stroke: sbStrokeColor.value,
  //   strokeWidth: parseInt(sbStrokeWidth.value),
  //   opacity: parseInt(sbFillOpacity.value) / 100
  // };

  var styles = getNowLineStyle();

  const path = adjustedCoordinates.map((coord, index) => 
    (index === 0 ? "M" : "L") + coord.x.toFixed(2) + " " + coord.y.toFixed(2)
  ).join("") + "Z";

  const bubble = new fabric.Path(path, {
    ...styles,
    left: minX,
    top: minY,
    selectable: currentMode === "select",
    evented: true,
    isSpeechBubble: true,
    objectCaching: false,
    jstsGeom: geometry
  });

  sbClear();
  canvas.add(bubble);

  return bubble;
}

function updateTemporaryShapes() {
  removeByNotSave(temporaryLine);
  removeByNotSave(temporaryShape);

  if (currentMode === "point" && points.length > 0) {
    temporaryShape = new fabric.Polyline(points, {
      fill: "rgba(0,0,255,0.2)",
      stroke: "blue",
      strokeWidth: parseInt(sbStrokeWidth.value),
      selectable: false,
      evented: false,
      excludeFromLayerPanel:true
    });
    addByNotSave(temporaryShape);

    if (mousePosition) {
      temporaryLine = new fabric.Line([
        points[points.length - 1].x,
        points[points.length - 1].y,
        mousePosition.x,
        mousePosition.y
      ], {
        stroke: "blue",
        strokeWidth: parseInt(sbStrokeWidth.value),
        selectable: false,
        evented: false,
        excludeFromLayerPanel:true
      });
      addByNotSave(temporaryLine);
    }
  } else if (currentMode === "freehand" && points.length > 0 && isDrawing) {
    temporaryShape = new fabric.Path(points.map((point, index) => (index === 0 ? "M" : "L") + point.x + " " + point.y).join(""), {
      fill: "rgba(0,0,255,0.2)",
      stroke: "blue",
      strokeWidth: parseInt(sbStrokeWidth.value),
      selectable: false,
      evented: false,
      excludeFromLayerPanel:true
    });
    addByNotSave(temporaryShape);
  }

  requestAnimationFrame(() => canvas.renderAll());
}

function createJSTSPolygon(points) {
  if (points.length < 3) return null;
  let coordinates = points.map(point => new jsts.geom.Coordinate(
    Math.round(point.x * 10) / 10,
    Math.round(point.y * 10) / 10
  ));
  if (coordinates[0].x !== coordinates[coordinates.length - 1].x ||
    coordinates[0].y !== coordinates[coordinates.length - 1].y) {
    coordinates.push(new jsts.geom.Coordinate(coordinates[0].x, coordinates[0].y));
  }
  return geometryFactory.createPolygon(geometryFactory.createLinearRing(coordinates));
}

function unionGeometries(geometry1, geometry2) {
  try {
    const union = geometry1.union(geometry2);
    const simplified = jsts.simplify.TopologyPreservingSimplifier.simplify(union, 0.1);
    return jsts.precision.GeometryPrecisionReducer.reduce(simplified, new jsts.geom.PrecisionModel(1000));
  } catch (error) {
    return geometry1;
  }
}

function mergeOverlappingShapes(newGeometry) {
  canvas.getObjects().forEach(obj => {
    if( obj.isSpeechBubble && !obj.jstsGeom ){
      console.log("mergeOverlappingShapes updateJSTSGeometryByObj 再作成");
      updateJSTSGeometryByObj(obj);
    }
    if (obj.isSpeechBubble) {
      var isIntersects = false;
      try {
        isIntersects = newGeometry.intersects(obj.jstsGeom)
      }catch{
        updateJSTSGeometryByObj(obj);
        isIntersects = newGeometry.intersects(obj.jstsGeom);
      }

      if ( isIntersects || newGeometry.touches(obj.jstsGeom) ) {
        const mergedGeometry = unionGeometries(newGeometry, obj.jstsGeom);
        if (mergedGeometry && mergedGeometry.isValid()) {
          newGeometry = mergedGeometry;
          canvas.remove(obj);
        }
      }
    }
  });
  return newGeometry;
}

function isNearStartPoint(x, y, startPoint) {
  return Math.abs(x - startPoint.x) <= 15 && Math.abs(y - startPoint.y) <= 15;
}

function smoothPoints(points) {
  if (points.length < 3) return points;
  const smoothingFactor = sbSmoothing.checked ? 1 : 100;
  let smoothedPoints = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    let prev = points[i - 1];
    let current = points[i];
    let next = points[i + 1];
    smoothedPoints.push({
      x: current.x * (1 - smoothingFactor / 100) + smoothingFactor / 100 * (prev.x + next.x) / 2,
      y: current.y * (1 - smoothingFactor / 100) + smoothingFactor / 100 * (prev.y + next.y) / 2
    });
  }
  smoothedPoints.push(points[points.length - 1]);
  return smoothedPoints;
}

function removeClosePoints(points) {
  const threshold = parseInt(sbPointSpace.value);
  if (threshold === 0 || points.length < 3) return points;
  let filteredPoints = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const lastPoint = filteredPoints[filteredPoints.length - 1];
    const currentPoint = points[i];
    if (Math.hypot(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y) > threshold) {
      filteredPoints.push(currentPoint);
    }
  }
  if (filteredPoints[filteredPoints.length - 1] !== points[points.length - 1]) {
    filteredPoints.push(points[points.length - 1]);
  }
  return filteredPoints;
}

function roundCorners(points, iterations) {
  if (iterations === 0 || points.length < 3) return points;
  let roundedPoints = points;
  for (let i = 0; i < iterations; i++) {
    let newPoints = [];
    for (let j = 0; j < roundedPoints.length - 1; j++) {
      const current = roundedPoints[j];
      const next = roundedPoints[j + 1];
      newPoints.push({
        x: 0.75 * current.x + 0.25 * next.x,
        y: 0.75 * current.y + 0.25 * next.y
      });
      newPoints.push({
        x: 0.25 * current.x + 0.75 * next.x,
        y: 0.25 * current.y + 0.75 * next.y
      });
    }
    if (roundedPoints[0].x === roundedPoints[roundedPoints.length - 1].x &&
      roundedPoints[0].y === roundedPoints[roundedPoints.length - 1].y) {
      newPoints.push(newPoints[0]);
    } else {
      newPoints.unshift(roundedPoints[0]);
      newPoints.push(roundedPoints[roundedPoints.length - 1]);
    }
    roundedPoints = newPoints;
  }
  return roundedPoints;
}

function processPoints(points) {
  if (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y) {
    points.push({ x: points[0].x, y: points[0].y });
  }
  points = removeClosePoints(points);
  if (sbSmoothing.checked) {
    points = smoothPoints(points);
  }
  points = roundCorners(points, parseInt(sbSornerRadius.value));
  return removeClosePoints(points);
}

function updateObjectSelectability() {
  canvas.forEachObject(obj => {
    obj.set({ selectable: currentMode === "select", evented: true });
  });
}
function createControlPoints(obj) {
  sbClearControlePoints();

  if (!obj) return;
  const path = obj.path;
  for (let i = 1; i < path.length - 1; i++) {
    if (path[i][0] !== 'L') continue;
    const point = new fabric.Circle({
      left: path[i][1] + obj.left,
      top: path[i][2] + obj.top,
      radius: 5,
      fill: currentMode === "deletePoint" ? 'red' : 'blue',
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
      selectable: false,
      evented: true,
      data: { index: i },
      excludeFromLayerPanel:true
    });
    controlPoints.push(point);
    addByNotSave(point);
  }
  requestAnimationFrame(() => canvas.renderAll());
}

function updateShape(obj, pointIndex, newX, newY) {
  const path = obj.path;
  path[pointIndex][1] = newX - obj.left;
  path[pointIndex][2] = newY - obj.top;
  obj.set({ path: path });
  obj.setCoords();
  obj.dirty = true;
  requestAnimationFrame(() => canvas.renderAll());
}

function deletePoint(obj, index) {
  if (obj.path.length <= 4) {
    return;
  }
  const [deletedPoint] = obj.path.splice(index, 1);
  const firstPoint = obj.path[0];
  if (deletedPoint[0] === 'L' && 
    deletedPoint[1] === firstPoint[1] && 
    deletedPoint[2] === firstPoint[2]) {
    obj.path.shift();
    obj.path[0][0] = 'M';
    const secondPoint = [...obj.path[0]];
    secondPoint[0] = 'L';
    obj.path.splice(obj.path.length - 1, 0, secondPoint);
  } else {
    for (let i = index; i < obj.path.length - 1; i++) {
      obj.path[i][0] = i === 0 ? 'M' : 'L';
    }
  }

  obj.dirty = true;
  createControlPoints(obj);
  requestAnimationFrame(() => canvas.renderAll());
}

sbPointButton.addEventListener("click", () => {
  currentMode = "point";
  setDrawingMode(sbPointButton);
  changeCursor("point");
});

sbFreehandButton.addEventListener("click", () => {
  currentMode = "freehand";
  setDrawingMode(sbFreehandButton);
  changeCursor("freehand");
});

sbSelectButton.addEventListener("click", () => {
  currentMode = "select";
  setSelectionMode(sbSelectButton);
  changeDefaultCursor();
});

sbMoveButton.addEventListener("click", () => {
  currentMode = "movePoint";
  setSelectionMode(sbMoveButton);
  changeCursor("movePoint");
});

sbDeleteButton.addEventListener("click", () => {
  currentMode = "deletePoint";
  setSelectionMode(sbDeleteButton);
  changeCursor("deletePoint");
});

canvas.on("mouse:down", event => {
  isDrawing = true;
  const pointer = canvas.getPointer(event.e);
  if (currentMode === "point") {
    points.push({ x: pointer.x, y: pointer.y });
    updateTemporaryShapes();
  } else if (currentMode === "freehand") {
    points = [{ x: pointer.x, y: pointer.y }];
    updateTemporaryShapes();
  } else if (currentMode === "movePoint" || currentMode === "deletePoint") {
    if (event.target && event.target.isSpeechBubble) {
      selectedObject = event.target;
      createControlPoints(selectedObject);
    } else if (currentMode === "deletePoint" && event.target && event.target.data && event.target.data.index !== undefined) {
      deletePoint(selectedObject, event.target.data.index);
    } else if (event.target && event.target.data) {
      activePoint = event.target;
    } else {
      selectedObject = null;
      createControlPoints(null);
      activePoint = null;
    }
  }
});

canvas.on("mouse:move", event => {
  const currentTime = Date.now();
  if (currentTime - lastRenderTime < 16) return;
  lastRenderTime = currentTime;

  const pointer = canvas.getPointer(event.e);
  if (currentMode === "point") {
    mousePosition = { x: pointer.x, y: pointer.y };
    updateTemporaryShapes();
  } else if (currentMode === "freehand" && isDrawing) {
    points.push({ x: pointer.x, y: pointer.y });
    updateTemporaryShapes();
  } else if (currentMode === "movePoint" && isDrawing && activePoint) {
    updateShape(selectedObject, activePoint.data.index, pointer.x, pointer.y);
    activePoint.set({ left: pointer.x, top: pointer.y });
    requestAnimationFrame(() => canvas.renderAll());
  }
});

canvas.on("mouse:up", event => {
  isDrawing = false;
  activePoint = null;
  const pointer = canvas.getPointer(event.e);
  if (currentMode === "point" && points.length >= 3) {
    if (isNearStartPoint(pointer.x, pointer.y, points[0])) {
      points.pop();
      points.push({ x: points[0].x, y: points[0].y });
      points = processPoints(points);
      const geometry = createJSTSPolygon(points);
      if (geometry && geometry.isValid()) {
        createSpeechBubble(mergeOverlappingShapes(geometry));
      } else {
        console.log("jsts up error");
      }

      points = [];
      mousePosition = null;

      updateObjectSelectability();

    } else {
      updateTemporaryShapes();
    }
  } else if (currentMode === "freehand" && points.length >= 3) {
    points.push({ x: points[0].x, y: points[0].y });
    points = processPoints(points);
    const geometry = createJSTSPolygon(points);
    if (geometry && geometry.isValid()) {
      createSpeechBubble(mergeOverlappingShapes(geometry));
      points = [];
    } else {
      console.log("jsts up error");
    }
    updateObjectSelectability();
    requestAnimationFrame(() => canvas.renderAll());
  }
});

function sbClear(){
  removeByNotSave(temporaryLine);
  removeByNotSave(temporaryShape);
  temporaryLine = null;
  temporaryShape = null;
}
function sbClearControlePoints(){
  controlPoints.forEach(p => removeByNotSave(p));
  controlPoints = [];
  requestAnimationFrame(() => canvas.renderAll());
}

function setDrawingMode(button) {
  canvas.selection = false;
  setSBActiveButton(button);
  sbClear();
  points = [];
  mousePosition = null;
  updateObjectSelectability();
  sbClearControlePoints();

  canvas.selection = false;
  canvas.forEachObject(obj => {
    obj.set({
      selectable: false,
      evented: false
    });
  });
  canvas.renderAll();
  activeClearButton();
}

function setSelectionMode(button) {
  setSBActiveButton(button);
  canvas.selection = currentMode === "select";
  if (editingGroup) canvas.remove(editingGroup);
  editingGroup = null;
  sbClear();
  points = [];
  updateObjectSelectability();
  if (currentMode === "movePoint" || currentMode === "deletePoint") {
    canvas.forEachObject(obj => {
      obj.set({ selectable: false, evented: true });
    });
    selectedObject = null;
    createControlPoints(null);
    activeClearButton();
  } else if (currentMode === "select") {
    canvas.forEachObject(obj => {
      obj.set({ selectable: true, evented: true });
    });
    nonActiveClearButton();
  }
  sbClearControlePoints();
}

setSelectionMode(sbSelectButton);

canvas.on('object:moving', updateJSTSGeometry);
canvas.on('object:scaling', updateJSTSGeometry);

function updateJSTSGeometry(event) {
  const obj = event.target;
  updateJSTSGeometryByObj(obj);
}

function updateJSTSGeometryByObj(obj) {

  if (obj.isSpeechBubble) {
    const scaleX = obj.scaleX;
    const scaleY = obj.scaleY;
    const angle = fabric.util.degreesToRadians(obj.angle);

    const updatedCoordinates = obj.path.filter(p => p[0] !== 'Z').map(p => {
      let x = p[1] - obj.pathOffset.x;
      let y = p[2] - obj.pathOffset.y;

      x *= scaleX;
      y *= scaleY;

      const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
      const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
      x = rotatedX + obj.left + obj.pathOffset.x * scaleX;
      y = rotatedY + obj.top + obj.pathOffset.y * scaleY;

      return new jsts.geom.Coordinate(x, y);
    });

    updatedCoordinates.push(updatedCoordinates[0]);

    obj.jstsGeom = geometryFactory.createPolygon(
      geometryFactory.createLinearRing(updatedCoordinates)
    );
  }
}




function clearJSTSGeometry() {
  canvas.getObjects().forEach(obj => {
    obj.jstsGeom = null;
  });
}
