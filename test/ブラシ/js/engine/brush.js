class Brush{
constructor(canvas,ctx){
this.canvas=canvas;
this.ctx=ctx;
this.size=20;
this.color='#000000';
this.opacity=0.8;
this.angle=0;
this.fixedAngle=false;
this.pressureSensitivity=0.7;
this.velocityEffect=0.5;
this.spacing=0.1;
this._lastX=0;
this._lastY=0;
this._isDrawing=false;
this._stampCanvas=document.createElement('canvas');
this._stampCtx=this._stampCanvas.getContext('2d',{willReadFrequently:true});
this._updateStampCanvas();
}
setProperties(props){
if(props.size!==undefined){
this.size=props.size;
}
if(props.color!==undefined){
this.color=props.color;
}
if(props.opacity!==undefined){
this.opacity=MathUtils.clamp(props.opacity,0,1);
}
if(props.angle!==undefined){
this.angle=props.angle;
}
if(props.fixedAngle!==undefined){
this.fixedAngle=props.fixedAngle;
}
if(props.pressureSensitivity!==undefined){
this.pressureSensitivity=MathUtils.clamp(props.pressureSensitivity,0,1);
}
if(props.velocityEffect!==undefined){
this.velocityEffect=MathUtils.clamp(props.velocityEffect,0,1);
}
if(props.spacing!==undefined){
this.spacing=Math.max(0.01,props.spacing);
}
this._updateStampCanvas();
}
startStroke(x,y,pressure){
this._isDrawing=true;
this._lastX=x;
this._lastY=y;
strokeProcessor.startStroke(x,y,pressure,Date.now());
this.drawStamp(x,y,pressure,0);
}
updateStroke(x,y,pressure){
if(!this._isDrawing)return;
const timerId=`brush:updateStroke`;
console.time(timerId);
const stampCount=strokeProcessor.processStroke(x,y);
console.log(`stampCount:${stampCount}`);
const positions=strokeProcessor.getIntermediatePositions?strokeProcessor.getIntermediatePositions():[];
if(positions&&positions.length>0){
positions.forEach(pos=>{
const direction=MathUtils.angle(this._lastX,this._lastY,pos.x,pos.y);
this.drawStamp(pos.x,pos.y,pos.pressure,direction);
this._lastX=pos.x;
this._lastY=pos.y;
});
}else{
const direction=MathUtils.angle(this._lastX,this._lastY,x,y);
this.drawStamp(x,y,pressure,direction);
this._lastX=x;
this._lastY=y;
}
console.timeEnd(timerId);
}
endStroke(x,y,pressure){
if(!this._isDrawing)return;
strokeProcessor.endStroke();
const direction=MathUtils.angle(this._lastX,this._lastY,x,y);
this.drawStamp(x,y,pressure,direction);
this._isDrawing=false;
}
drawStamp(x,y,pressure,direction){
console.warn('Brush.drawStamp():サブクラスで実装する必要があります');
}
_updateStampCanvas(){
const size=Math.ceil(this.size*2);
this._stampCanvas.width=size;
this._stampCanvas.height=size;
this._stampCtx.clearRect(0,0,size,size);
}
_getEffectiveSize(pressure,velocity){
const pressureEffect=this.pressureSensitivity>0?0.5+0.5*(pressure**(1+this.pressureSensitivity)):1.0;
const velocityEffect=this.velocityEffect>0?MathUtils.velocityPressureEffect(velocity,this.velocityEffect):1.0;
return this.size*pressureEffect*velocityEffect;
}
_getEffectiveOpacity(pressure){
const pressureOpacity=this.pressureSensitivity>0?this.opacity*(0.3+0.7*pressure**(1+this.pressureSensitivity*0.5)):this.opacity;
return pressureOpacity;
}
_getEffectiveAngle(direction){
if(this.fixedAngle){
return this.angle;
}else{
return direction+Math.PI/2;
}
}
}
