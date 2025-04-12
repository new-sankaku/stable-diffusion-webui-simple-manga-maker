function skeletonize(){
try{
if(!alphaMat){
throw new Error('アルファチャンネルが準備できていません');
}
const skelStart=performance.now();
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let skeleton=binaryMask.clone();
const iterations=parseInt(thinningIterations.value);
const elemSize=parseInt(structElementSize.value);
const elemShapeValue=parseInt(structElementShape.value);
let elemShape;
switch(elemShapeValue){
case 0:elemShape=cv.MORPH_RECT;break;
case 1:elemShape=cv.MORPH_CROSS;break;
case 2:elemShape=cv.MORPH_ELLIPSE;break;
default:elemShape=cv.MORPH_CROSS;
}
const elemShapeNames=['RECT','CROSS','ELLIPSE'];
let element=cv.getStructuringElement(elemShape,new cv.Size(elemSize,elemSize));
let temp=new cv.Mat();
let eroded=new cv.Mat();
let dilated=new cv.Mat();
const loopStart=performance.now();
for(let i=0;i<iterations;i++){
cv.erode(skeleton,eroded,element);
cv.dilate(eroded,dilated,element);
cv.subtract(skeleton,dilated,temp);
cv.bitwise_or(skeleton,temp,skeleton);
}
const skeletonCanvas=createResultCanvas('3. 骨格化','skeleton');
cv.imshow(skeletonCanvas,skeleton);
mask.delete();
binaryMask.delete();
skeleton.delete();
element.delete();
temp.delete();
eroded.delete();
dilated.delete();
}catch(err){
throw err;
}
}
function detectLineSegments(){
try{
if(!alphaMat){
throw new Error('アルファチャンネルが準備できていません');
}
const linesStart=performance.now();
let edges=new cv.Mat();
const threshold1=parseInt(cannyThresh1.value);
const threshold2=parseInt(cannyThresh2.value);
cv.Canny(alphaMat,edges,threshold1,threshold2,3,true);
let lines=new cv.Mat();
const houghThreshValue=parseInt(houghThreshold.value);
const minLengthValue=parseInt(minLineLength.value);
const maxGapValue=parseInt(maxLineGap.value);
const houghStart=performance.now();
cv.HoughLinesP(edges,lines,1,Math.PI/180,houghThreshValue,minLengthValue,maxGapValue*2);
const lineCanvas=createResultCanvas('4. 線分検出','lines');
let lineDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
let horizontalLines=0;
let verticalLines=0;
let diagonalLines=0;
let lengths=[];
const vAngleThreshold=25;
const hAngleThreshold=25;
for(let i=0;i<lines.rows;++i){
const startPoint=new cv.Point(lines.data32S[i*4],lines.data32S[i*4+1]);
const endPoint=new cv.Point(lines.data32S[i*4+2],lines.data32S[i*4+3]);
const length=Math.sqrt(
Math.pow(endPoint.x-startPoint.x,2)+
Math.pow(endPoint.y-startPoint.y,2)
);
lengths.push(length);
const angle=Math.abs(Math.atan2(
endPoint.y-startPoint.y,
endPoint.x-startPoint.x
)*180/Math.PI);
if(angle<hAngleThreshold||angle>180-hAngleThreshold){
horizontalLines++;
cv.line(lineDisplay,startPoint,endPoint,new cv.Scalar(255,0,0),2);
}else if(angle>90-vAngleThreshold&&angle<90+vAngleThreshold){
verticalLines++;
cv.line(lineDisplay,startPoint,endPoint,new cv.Scalar(0,255,0),2);
}else{
diagonalLines++;
cv.line(lineDisplay,startPoint,endPoint,new cv.Scalar(0,0,255),2);
}
}
if(lengths.length>0){
const avgLength=lengths.reduce((a,b)=>a+b,0)/lengths.length;
const minLength=Math.min(...lengths);
const maxLength=Math.max(...lengths);
}
cv.imshow(lineCanvas,lineDisplay);
edges.delete();
lines.delete();
lineDisplay.delete();
}catch(err){
throw err;
}
}
function detectCurves(){
try{
if(!alphaMat){
throw new Error('アルファチャンネルが準備できていません');
}
const curvesStart=performance.now();
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let contours=new cv.MatVector();
let hierarchy=new cv.Mat();
const contoursStart=performance.now();
cv.findContours(binaryMask,contours,hierarchy,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_NONE);
const curveCanvas=createResultCanvas('5. 曲線検出','curves');
let curveDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
let curvaturePoints=[];
const epsilonScale=parseInt(curveEpsilon.value)/1000;
const minCurveLengthValue=parseInt(minCurveLength.value);
const isClosed=curveFitMethod.value==='true';
const approxStart=performance.now();
let validCurves=0;
for(let i=0;i<contours.size();++i){
const contour=contours.get(i);
const perimeter=cv.arcLength(contour,isClosed);
if(perimeter<minCurveLengthValue)continue;
validCurves++;
const epsilon=epsilonScale*perimeter;
let approx=new cv.Mat();
cv.approxPolyDP(contour,approx,epsilon,isClosed);
cv.drawContours(curveDisplay,contours,i,new cv.Scalar(50,50,50),1);
for(let j=0;j<approx.rows;j++){
const pt=new cv.Point(approx.data32S[j*2],approx.data32S[j*2+1]);
curvaturePoints.push(pt);
cv.circle(curveDisplay,pt,3,new cv.Scalar(0,0,255),-1);
}
approx.delete();
}
cv.imshow(curveCanvas,curveDisplay);
mask.delete();
binaryMask.delete();
contours.delete();
hierarchy.delete();
curveDisplay.delete();
}catch(err){
throw err;
}
}