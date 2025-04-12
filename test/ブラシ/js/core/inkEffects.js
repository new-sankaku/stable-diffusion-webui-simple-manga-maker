class InkEffects{
constructor(){
this.tempCanvas=document.createElement('canvas');
this.tempCtx=this.tempCanvas.getContext('2d',{willReadFrequently:true});
}
applyDiffusion(imageData,iterations=1,color='#000000'){
const data=imageData.data;
const w=imageData.width;
const h=imageData.height;
const colorValues=ColorUtils.hexToRgb(color);
for(let i=0;i<iterations;i++){
this._diffuseOnce(data,w,h,colorValues);
}
return imageData;
}
_diffuseOnce(data,width,height,colorValues){
const origData=new Uint8ClampedArray(data);
const dirs=[
[-1,0],[1,0],[0,-1],[0,1]
];
const diffusionRate=0.2;
for(let y=1;y<height-1;y++){
for(let x=1;x<width-1;x++){
const pos=(y*width+x)*4;
let r=origData[pos];
let g=origData[pos+1];
let b=origData[pos+2];
let a=origData[pos+3];
if(a<10)continue;
for(let d=0;d<dirs.length;d++){
const nx=x+dirs[d][0];
const ny=y+dirs[d][1];
if(nx<0||nx>=width||ny<0||ny>=height)continue;
const npos=(ny*width+nx)*4;
if(origData[npos+3]>0)continue;
const amount=diffusionRate*(a/255);
data[npos]=colorValues.r;
data[npos+1]=colorValues.g;
data[npos+2]=colorValues.b;
data[npos+3]=Math.max(data[npos+3],Math.round(a*amount));
}
}
}
return data;
}
createBrushStamp(size,color='#000000',hardness=0.7){
const diameter=Math.ceil(size);
this.tempCanvas.width=diameter;
this.tempCanvas.height=diameter;
const ctx=this.tempCtx;
const center=diameter/2;
const gradient=ctx.createRadialGradient(
center,center,0,
center,center,center
);
const rgb=ColorUtils.hexToRgb(color);
gradient.addColorStop(0,`rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
gradient.addColorStop(hardness,`rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`);
gradient.addColorStop(1,`rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
ctx.clearRect(0,0,diameter,diameter);
ctx.fillStyle=gradient;
ctx.beginPath();
ctx.arc(center,center,center,0,Math.PI*2);
ctx.fill();
return this.tempCanvas;
}
}
const inkEffects=new InkEffects();
