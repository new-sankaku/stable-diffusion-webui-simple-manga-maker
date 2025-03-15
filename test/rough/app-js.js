const canvas = new fabric.Canvas('canvas');
let shapes = [];
let isRoughened = false;
const roughManager = new RoughManager();

function initShapes() {
 canvas.clear();
 
 const fillColor = document.getElementById('fillColor').value;
 const strokeColor = document.getElementById('strokeColor').value;
 
 const verticalRect = new fabric.Path('M 100 100 L 150 100 L 150 250 L 100 250 Z', {
  fill: fillColor,
  stroke: strokeColor,
  strokeWidth: 2
 });
 
 const horizontalRect = new fabric.Path('M 200 100 L 350 100 L 350 150 L 200 150 Z', {
  fill: fillColor,
  stroke: strokeColor,
  strokeWidth: 2
 });
 
 const trapezoid = new fabric.Path('M 400 100 L 500 100 L 450 200 L 350 200 Z', {
  fill: fillColor,
  stroke: strokeColor,
  strokeWidth: 2
 });
 
 const polygonPoints = [
  {x: 180, y: 280},
  {x: 250, y: 280},
  {x: 280, y: 320},
  {x: 250, y: 380},
  {x: 180, y: 380},
  {x: 150, y: 320}
 ];
 
 const hexagon = new fabric.Polygon(polygonPoints, {
  fill: fillColor,
  stroke: strokeColor,
  strokeWidth: 2
 });
 
 const trianglePoints = [
  {x: 400, y: 280},
  {x: 500, y: 380},
  {x: 350, y: 380}
 ];
 
 const triangle = new fabric.Polygon(trianglePoints, {
  fill: fillColor,
  stroke: strokeColor,
  strokeWidth: 2
 });
 
 shapes = [verticalRect, horizontalRect, trapezoid, hexagon, triangle];
 shapes.forEach(shape => canvas.add(shape));
 canvas.renderAll();
 
 isRoughened = false;
 updateToggleButtonState();
}

async function roughenSelectedObject() {
 const activeObject = canvas.getActiveObject();
 if (!activeObject) {
  console.log('オブジェクトが選択されていません');
  return;
 }
 
 if (!roughManager.isRoughenable(activeObject)) {
  console.log(`このオブジェクトタイプ (${activeObject.type}) はラフ化できません`);
  return;
 }
 
 roughManager.getOptionsFromUI();
 
 if (activeObject.roughObject) {
  if (activeObject.originalObject) {
   console.log('これはすでにラフ化されたオブジェクトです');
   return;
  }
  
  activeObject.roughObject.visible = true;
  activeObject.visible = false;
  canvas.setActiveObject(activeObject.roughObject);
  canvas.renderAll();
  console.log('既存のラフ化オブジェクトを表示しました');
  updateToggleButtonState();
  return;
 }
 
 const roughObj = await roughManager.roughenObject(activeObject);
 if (roughObj) {
  activeObject.roughObject = roughObj;
  roughObj.originalObject = activeObject;
  
  activeObject.visible = false;
  canvas.add(roughObj);
  canvas.setActiveObject(roughObj);
  
  console.log('オブジェクトをラフ化しました');
 } else {
  console.log('ラフ化に失敗しました');
 }
 
 canvas.renderAll();
 updateToggleButtonState();
}

async function refreshRoughObject() {
 const activeObject = canvas.getActiveObject();
 if (!activeObject || !activeObject.originalObject) return;
 
 const originalObj = activeObject.originalObject;
 
 roughManager.getOptionsFromUI();
 
 syncObjectProperties(activeObject, originalObj);
 
 canvas.remove(activeObject);
 originalObj.roughObject = null;
 
 const newRoughObj = await roughManager.roughenObject(originalObj);
 if (newRoughObj) {
  originalObj.roughObject = newRoughObj;
  newRoughObj.originalObject = originalObj;
  
  canvas.add(newRoughObj);
  canvas.setActiveObject(newRoughObj);
  
  console.log('ラフ化を更新しました');
 }
 
 canvas.renderAll();
}

function toggleRoughVisibility() {
 const activeObject = canvas.getActiveObject();
 if (!activeObject) {
  console.log('オブジェクトが選択されていません');
  return;
 }
 
 if (activeObject.originalObject) {
  const originalObj = activeObject.originalObject;
  
  syncObjectProperties(activeObject, originalObj);
  
  originalObj.visible = true;
  
  canvas.remove(activeObject);
  originalObj.roughObject = null;
  
  canvas.setActiveObject(originalObj);
  console.log('元のオブジェクトに戻しました');
 } 
 else if (activeObject.roughObject) {
  const roughObj = activeObject.roughObject;
  roughObj.visible = true;
  activeObject.visible = false;
  canvas.setActiveObject(roughObj);
  console.log('ラフ化オブジェクトを表示しました');
 } 
 else {
  roughenSelectedObject();
 }
 
 canvas.renderAll();
 updateToggleButtonState();
}

function syncObjectProperties(sourceObj, targetObj) {
 const propsToSync = [
  'left', 'top', 'scaleX', 'scaleY', 'angle',
  'flipX', 'flipY', 'opacity', 'width', 'height'
 ];
 
 propsToSync.forEach(prop => {
  if (sourceObj[prop] !== undefined) {
   targetObj[prop] = sourceObj[prop];
  }
 });
 
 if (sourceObj.stroke) {
  targetObj.stroke = sourceObj.stroke;
 }
 
 if (sourceObj.strokeWidth) {
  targetObj.strokeWidth = sourceObj.strokeWidth;
 }
 
 if (targetObj.type === 'path' && sourceObj.path) {
  targetObj.path = sourceObj.path;
 }
 
 if (targetObj.type === 'polygon' && sourceObj.points) {
  targetObj.points = sourceObj.points;
 }
 
 targetObj.setCoords();
}

function updateSliderValue(id) {
 document.getElementById(id + '-value').textContent = document.getElementById(id).value;
}

function updateToggleButtonState() {
 const toggleButton = document.getElementById('toggle-rough');
 const activeObject = canvas.getActiveObject();
 
 if (!activeObject) {
  toggleButton.textContent = 'ラフ化ON/OFF';
  return;
 }
 
 if (activeObject.originalObject) {
  toggleButton.textContent = 'ラフ化OFF';
 } else {
  toggleButton.textContent = 'ラフ化ON';
 }
}

function setupEventListeners() {
 const paramControls = [
  'roughness', 'bowing', 'fillWeight', 'hachureAngle', 
  'hachureGap', 'curveStepCount', 'curveFitting', 
  'strokeWidth', 'simplification', 'fillStyle', 
  'seed', 'strokeColor', 'fillColor',
  'disableMultiStroke', 'disableMultiStrokeFill'
 ];
 
 paramControls.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
   const eventType = element.type === 'range' ? 'input' : 'change';
   
   element.addEventListener(eventType, () => {
    if (element.type === 'range') {
     updateSliderValue(id);
    }
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && (activeObject.originalObject || activeObject.roughObject)) {
     refreshRoughObject();
    }
   });
  }
 });
 
 canvas.on('mouse:down', function(e) {
  if (e.target) {
   const objectType = e.target.type;
   const isRoughObj = !!e.target.originalObject;
   if (objectType) {
    console.log(`クリックしたオブジェクト: ${objectType}${isRoughObj ? ' (ラフ化済み)' : ''}`);
   }
  }
 });
 
 canvas.on('selection:created', updateToggleButtonState);
 canvas.on('selection:updated', updateToggleButtonState);
 canvas.on('selection:cleared', updateToggleButtonState);
 
 document.getElementById('toggle-rough').addEventListener('click', toggleRoughVisibility);
 document.getElementById('reset').addEventListener('click', initShapes);
}

function toggleHachureParams() {
 const fillStyle = document.getElementById('fillStyle').value;
 const hachureParams = document.getElementById('hachureParams');
 
 if (fillStyle === 'hachure' || fillStyle === 'cross-hatch' || fillStyle === 'zigzag' || fillStyle === 'dashed' || fillStyle === 'zigzag-line') {
  hachureParams.style.display = 'block';
 } else {
  hachureParams.style.display = 'none';
 }
}

function init() {
 document.getElementById('fillStyle').addEventListener('change', toggleHachureParams);
 
 initShapes();
 setupEventListeners();
 toggleHachureParams();
}

init();
