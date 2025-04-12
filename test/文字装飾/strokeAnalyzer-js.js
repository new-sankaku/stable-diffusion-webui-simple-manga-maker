function simulateBrushPressure(){
try{
if(!alphaMat){
throw new Error('アルファチャンネルが準備できていません');
}
const bpStart=performance.now();
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let distanceMap=new cv.Mat();
const strength=parseInt(brushPressureStrength.value);
const distStart=performance.now();
cv.distanceTransform(binaryMask,distanceMap,cv.DIST_L2,strength);
let edges=new cv.Mat();
cv.Canny(binaryMask,edges,50,150,3);
let gradX=new cv.Mat();
let gradY=new cv.Mat();
let grad=new cv.Mat();
let angle=new cv.Mat();
const gradStart=performance.now();
cv.Sobel(binaryMask,gradX,cv.CV_32F,1,0,3);
cv.Sobel(binaryMask,gradY,cv.CV_32F,0,1,3);
cv.cartToPolar(gradX,gradY,grad,angle);
let brushPressureMap=new cv.Mat();
distanceMap.convertTo(brushPressureMap,cv.CV_8U,1,0);
const brushCanvas=createResultCanvas('9. 筆圧シミュレーション','brush');
let pressureDisplay=cv.Mat.zeros(brushPressureMap.rows,brushPressureMap.cols,cv.CV_8UC3);
const colorMapStart=performance.now();
for(let y=0;y<brushPressureMap.rows;y++){
for(let x=0;x<brushPressureMap.cols;x++){
const val=brushPressureMap.ucharPtr(y,x)[0];
if(val>0){
let r=0,g=0,b=0;
if(val<64){
b=255;
g=val*4;
}else if(val<128){
b=255-(val-64)*4;
g=255;
}else if(val<192){
g=255;
r=(val-128)*4;
}else{
g=255-(val-192)*4;
r=255;
}
pressureDisplay.ucharPtr(y,x)[0]=b;
pressureDisplay.ucharPtr(y,x)[1]=g;
pressureDisplay.ucharPtr(y,x)[2]=r;
}
}
}
const arrowSpacingValue=parseInt(arrowDensity.value);
const gradThreshold=parseFloat(gradientThreshold.value)/10;
const arrowStart=performance.now();
let arrowCount=0;
for(let y=0;y<angle.rows;y+=arrowSpacingValue){
for(let x=0;x<angle.cols;x+=arrowSpacingValue){
if(binaryMask.ucharPtr(y,x)[0]>0){
const angleVal=angle.floatAt(y,x);
const gradVal=grad.floatAt(y,x);
if(gradVal>gradThreshold){
const len=5.0;
const endX=x+len*Math.cos(angleVal);
const endY=y+len*Math.sin(angleVal);
cv.line(
pressureDisplay,
new cv.Point(x,y),
new cv.Point(endX,endY),
new cv.Scalar(255,255,255),
1
);
arrowCount++;
}
}
}
}
cv.imshow(brushCanvas,pressureDisplay);
mask.delete();
binaryMask.delete();
distanceMap.delete();
edges.delete();
gradX.delete();
gradY.delete();
grad.delete();
angle.delete();
brushPressureMap.delete();
pressureDisplay.delete();
}catch(err){
throw err;
}
}