class BrushApp{
constructor(){
this.canvasContainer=null;
this.canvas=null;
this.ctx=null;
this.layerManager=null;
this.inkBrush=null;
this.calligraphyBrush=null;
this.currentBrush=null;
this.isPointerDown=false;
this.lastX=0;
this.lastY=0;
this.lastPressure=0;
this.beforeStrokeImageData=null;
this.drawingMode=true;
}
init(){
this._initDOM();
this._initLayerManager();
this._initBrushes();
this._initUI();
this._setupEventListeners();
this._loadTextures();
window.addEventListener('resize',()=>this._handleResize());
console.log('ブラシアプリケーションが初期化されました');
this.canvasContainer.addEventListener('mousemove',(e)=>{
const rect=this.canvasContainer.getBoundingClientRect();
const x=e.clientX-rect.left;
const y=e.clientY-rect.top;
uiControls.updateCoordinates(x,y);
});
}
_initDOM(){
this.canvasContainer=document.querySelector('.canvas-container');
this.canvas=document.getElementById('drawing-canvas');
if(!this.canvasContainer||!this.canvas){
console.error('キャンバス要素が見つかりません');
return;
}
this._resizeCanvas();
this.ctx=this.canvas.getContext('2d',{willReadFrequently:true});
}
_initLayerManager(){
if(!this.canvasContainer)return;
this.layerManager=new LayerManager(this.canvasContainer);
window.layerManager=this.layerManager;
this.layerManager.resize(this.canvas.width,this.canvas.height);
}
_initBrushes(){
if(!this.layerManager)return;
const ctx=this.layerManager.getActiveContext();
this.inkBrush=new InkBrush(this.canvas,ctx);
this.calligraphyBrush=new CalligraphyBrush(this.canvas,ctx);
this.currentBrush=this.inkBrush;
}
_initUI(){
if(!window.uiControls)return;
uiControls.init();
uiControls.setOnBrushChange(settings=>this._handleBrushChange(settings));
uiControls.setOnClearCanvas(()=>this._clearCanvas());
uiControls.setOnUndo(()=>this._undo());
uiControls.setOnSaveImage(()=>this._saveImage());
}
_resizeCanvas(){
if(!this.canvas||!this.canvasContainer)return;
const containerWidth=this.canvasContainer.clientWidth;
const containerHeight=this.canvasContainer.clientHeight;
const dpr=window.devicePixelRatio||1;
this.canvas.width=containerWidth*dpr;
this.canvas.height=containerHeight*dpr;
this.canvas.style.width=`${containerWidth}px`;
this.canvas.style.height=`${containerHeight}px`;
if(this.layerManager){
this.layerManager.resize(this.canvas.width,this.canvas.height);
}
console.log(`キャンバスサイズ:${this.canvas.width}x${this.canvas.height}`);
}
_loadTextures(){
if(!window.textureManager)return;
textureManager.loadTextures({
brushes:['bristle_scattered'],
papers:['paper_smooth']
},()=>{
if(this.inkBrush)this.inkBrush._loadTextures();
if(this.calligraphyBrush)this.calligraphyBrush._loadTextures();
});
}
_setupEventListeners(){
if(!this.canvas)return;
this.canvas.addEventListener('pointerdown',e=>this._handlePointerDown(e));
this.canvas.addEventListener('pointermove',e=>this._handlePointerMove(e));
this.canvas.addEventListener('pointerup',e=>this._handlePointerUp(e));
this.canvas.addEventListener('pointerleave',e=>this._handlePointerUp(e));
this.canvas.addEventListener('pointercancel',e=>this._handlePointerUp(e));
this.canvas.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
this.canvas.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
}
_handlePointerDown(e){
if(!this.drawingMode)return;
e.preventDefault();
this.canvas.setPointerCapture(e.pointerId);
const dpr=window.devicePixelRatio||1;
const x=e.offsetX*dpr;
const y=e.offsetY*dpr;
const pressure=e.pressure!==undefined?e.pressure:0.5;
this.isPointerDown=true;
this.lastX=x;
this.lastY=y;
this.lastPressure=pressure;
this.beforeStrokeImageData=this.layerManager.getLayerImageData(this.layerManager.activeLayerIndex);
this.currentBrush.startStroke(x,y,pressure);
uiControls.updateStatus(pressure,strokeProcessor.getVelocity());
}
_handlePointerMove(e){
if(!this.isPointerDown||!this.drawingMode)return;
e.preventDefault();
const timerId=`pointerMove:${Date.now()}`;
console.time(timerId);
const dpr=window.devicePixelRatio||1;
const x=e.offsetX*dpr;
const y=e.offsetY*dpr;
const pressure=e.pressure!==undefined?e.pressure:0.5;
this.currentBrush.updateStroke(x,y,pressure);
this.lastX=x;
this.lastY=y;
this.lastPressure=pressure;
uiControls.updateStatus(pressure,strokeProcessor.getVelocity());
console.timeEnd(timerId);
}
_handlePointerUp(e){
if(!this.isPointerDown||!this.drawingMode)return;
e.preventDefault();
const dpr=window.devicePixelRatio||1;
const x=e.offsetX*dpr;
const y=e.offsetY*dpr;
const pressure=e.pressure!==undefined?e.pressure:0.5;
this.currentBrush.endStroke(x,y,pressure);
this.isPointerDown=false;
if(this.beforeStrokeImageData&&window.historyManager){
const afterStrokeImageData=this.layerManager.getLayerImageData(this.layerManager.activeLayerIndex);
historyManager.recordStroke(this.layerManager.activeLayerIndex,this.beforeStrokeImageData,afterStrokeImageData);
this.beforeStrokeImageData=null;
}
uiControls.updateStatus(0,0);
}
_handleResize(){
this._resizeCanvas();
if(window.fabricIntegration){
window.fabricIntegration._resizeCanvas();
}
}
_handleBrushChange(settings){
if(settings.type==='ink'){
this.currentBrush=this.inkBrush;
}else if(settings.type==='calligraphy'){
this.currentBrush=this.calligraphyBrush;
}
this.currentBrush.setProperties({
size:settings.size,
color:settings.color,
opacity:settings.opacity,
pressureSensitivity:settings.pressureSensitivity,
velocityEffect:settings.velocityEffect,
angle:settings.angle,
fixedAngle:settings.fixedAngle
});
}
_clearCanvas(){
if(!this.layerManager||!window.historyManager)return;
const beforeImageData=this.layerManager.getLayerImageData(this.layerManager.activeLayerIndex);
this.layerManager.clearLayer(this.layerManager.activeLayerIndex);
historyManager.recordClearLayer(this.layerManager.activeLayerIndex,beforeImageData);
}
_undo(){
if(window.historyManager&&historyManager.canUndo()){
historyManager.undo();
}
}
_saveImage(){
if(!this.layerManager)return;
if(window.fabricIntegration){
fabricIntegration.captureDrawingToFabric();
}
const dataURL=this.layerManager.toDataURL();
const link=document.createElement('a');
link.download=`brush-drawing-${new Date().toISOString().slice(0,10)}.png`;
link.href=dataURL;
link.click();
}
}
const app=new BrushApp();
document.addEventListener('DOMContentLoaded',()=>{
app.init();
});
