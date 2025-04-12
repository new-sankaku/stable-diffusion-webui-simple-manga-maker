class FabricIntegration{
constructor(){
this.canvas=null;
this.fabricCanvas=null;
this.init();
}
init(){
this._initCanvas();
this._setupEventListeners();
console.log('Fabric.js 統合モジュールが初期化されました');
}
_initCanvas(){
console.log('Fabric.js: キャンバス初期化開始');
try{
const originalCanvas=document.getElementById('drawing-canvas');
const canvasContainer=document.querySelector('.canvas-container');
if(!originalCanvas||!canvasContainer){
console.error('Fabric.js: キャンバス要素またはコンテナが見つかりません');
return;
}
console.log(`Fabric.js: 元のキャンバスサイズ ${originalCanvas.width}x${originalCanvas.height}`);
const fabricCanvasEl=document.createElement('canvas');
fabricCanvasEl.id='fabric-canvas';
fabricCanvasEl.width=originalCanvas.width;
fabricCanvasEl.height=originalCanvas.height;
fabricCanvasEl.style.position='absolute';
fabricCanvasEl.style.left='0';
fabricCanvasEl.style.top='0';
fabricCanvasEl.style.width=`${originalCanvas.offsetWidth}px`;
fabricCanvasEl.style.height=`${originalCanvas.offsetHeight}px`;
fabricCanvasEl.style.pointerEvents='none';
fabricCanvasEl.style.border='1px solid #000';
fabricCanvasEl.style.boxSizing='border-box';
fabricCanvasEl.style.zIndex='1';
const existingCanvas=document.getElementById('fabric-canvas');
if(existingCanvas){
canvasContainer.removeChild(existingCanvas);
}
originalCanvas.style.zIndex='2';
originalCanvas.style.position='relative';
canvasContainer.appendChild(fabricCanvasEl);
console.log('Fabric.js: DOM要素の作成完了');
this.canvas=new fabric.Canvas('fabric-canvas',{
width:originalCanvas.width,
height:originalCanvas.height,
selection:true,
preserveObjectStacking:true
});
console.log('Fabric.js: キャンバス初期化完了');
this.fabricCanvas=fabricCanvasEl;
}catch(err){
console.error('Fabric.js: キャンバス初期化エラー',err);
}
window.addEventListener('resize',()=>this._resizeCanvas());
this.canvas.on('selection:created',(e)=>this._handleObjectSelection(e));
this.canvas.on('selection:updated',(e)=>this._handleObjectSelection(e));
this.canvas.on('selection:cleared',()=>this._handleSelectionCleared());
this.canvas.on('object:modified',(e)=>this._handleObjectModified(e));
this.toggleDrawingMode(true);
}
_setupEventListeners(){
document.querySelector('.canvas-container').addEventListener('mousemove',(e)=>{
const rect=e.currentTarget.getBoundingClientRect();
const x=e.clientX-rect.left;
const y=e.clientY-rect.top;
if(window.fabricIntegration){
window.fabricIntegration.updateCoordinates(x,y);
}
});
const saveButton=document.getElementById('save-image');
if(saveButton){
saveButton.addEventListener('click',()=>this.captureDrawingToFabric());
}
}
_resizeCanvas(){
const originalCanvas=document.getElementById('drawing-canvas');
if(originalCanvas&&this.canvas){
this.canvas.setWidth(originalCanvas.width);
this.canvas.setHeight(originalCanvas.height);
if(this.fabricCanvas){
this.fabricCanvas.style.width=`${originalCanvas.offsetWidth}px`;
this.fabricCanvas.style.height=`${originalCanvas.offsetHeight}px`;
}
this.canvas.renderAll();
}
}
toggleDrawingMode(drawingMode){
if(!this.fabricCanvas||!this.canvas)return;
if(drawingMode){
this.fabricCanvas.style.pointerEvents='none';
this.canvas.selection=false;
this.canvas.forEachObject(obj=>{
obj.selectable=false;
});
}else{
this.fabricCanvas.style.pointerEvents='auto';
this.canvas.selection=true;
this.canvas.forEachObject(obj=>{
obj.selectable=true;
});
}
this.canvas.renderAll();
}
_handleObjectSelection(e){
console.log('オブジェクト選択:',e.selected);
}
_handleSelectionCleared(){
console.log('選択解除');
}
_handleObjectModified(e){
console.log('オブジェクト修正:',e.target);
}
updateCoordinates(x,y){
const coordinatesStatus=document.getElementById('coordinates-status');
if(coordinatesStatus){
coordinatesStatus.innerHTML=`座標:${Math.round(x)},${Math.round(y)}`;
}
}
captureDrawingToFabric(){
try{
console.log('描画内容をFabric.jsキャンバスに転写中...');
const drawingCanvas=document.getElementById('drawing-canvas');
if(!drawingCanvas){
console.error('描画キャンバスが見つかりません');
return;
}
const drawingImage=new Image();
drawingImage.onload=()=>{
const fabricImage=new fabric.Image(drawingImage,{
left:0,
top:0,
selectable:false,
evented:false
});
this.canvas.add(fabricImage);
this.canvas.renderAll();
console.log('描画内容の転写が完了しました');
};
drawingImage.src=drawingCanvas.toDataURL();
}catch(err){
console.error('描画内容の転写中にエラー:',err);
}
}
}
document.addEventListener('DOMContentLoaded',()=>{
setTimeout(()=>{
window.fabricIntegration=new FabricIntegration();
},500);
});
