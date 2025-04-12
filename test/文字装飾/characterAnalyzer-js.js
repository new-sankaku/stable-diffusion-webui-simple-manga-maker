function classifyCharacterParts(){
try{
const cpStart=performance.now();
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let skeleton=binaryMask.clone();
const thinIterations=parseInt(thinningIters.value);
let element=cv.getStructuringElement(cv.MORPH_CROSS,new cv.Size(3,3));
let temp=new cv.Mat();
let eroded=new cv.Mat();
let dilated=new cv.Mat();
const thinStart=performance.now();
for(let i=0;i<thinIterations;i++){
cv.erode(skeleton,eroded,element);
cv.dilate(eroded,dilated,element);
cv.subtract(skeleton,dilated,temp);
cv.bitwise_or(temp,cv.Mat.zeros(skeleton.rows,skeleton.cols,skeleton.type()),skeleton);
}
let horizontalLines=new cv.Mat.zeros(skeleton.rows,skeleton.cols,cv.CV_8UC1);
let verticalLines=new cv.Mat.zeros(skeleton.rows,skeleton.cols,cv.CV_8UC1);
let diagonalLines=new cv.Mat.zeros(skeleton.rows,skeleton.cols,cv.CV_8UC1);
let dots=new cv.Mat.zeros(skeleton.rows,skeleton.cols,cv.CV_8UC1);
let gradX=new cv.Mat();
let gradY=new cv.Mat();
let mag=new cv.Mat();
let angle=new cv.Mat();
const sobelSize=parseInt(sobelKernelSize.value);
if(sobelSize%2===0){
}
const kernelSize=sobelSize%2===0?sobelSize+1:sobelSize;
const gradStart=performance.now();
cv.Sobel(skeleton,gradX,cv.CV_32F,1,0,kernelSize);
cv.Sobel(skeleton,gradY,cv.CV_32F,0,1,kernelSize);
cv.cartToPolar(gradX,gradY,mag,angle);
const angleThreshold=parseInt(partsClassThreshold.value);
const classifyStart=performance.now();
let hCount=0,vCount=0,dCount=0,dotCount=0;
for(let y=0;y<skeleton.rows;y++){
for(let x=0;x<skeleton.cols;x++){
if(skeleton.ucharPtr(y,x)[0]>0){
const angleVal=angle.floatAt(y,x)*180/Math.PI;
let connected=false;
for(let dy=-1;dy<=1;dy++){
for(let dx=-1;dx<=1;dx++){
if(dx===0&&dy===0)continue;
if(y+dy>=0&&y+dy<skeleton.rows&&x+dx>=0&&x+dx<skeleton.cols){
if(skeleton.ucharPtr(y+dy,x+dx)[0]>0){
connected=true;
break;
}
}
}
if(connected)break;
}
if(!connected){
dots.ucharPtr(y,x)[0]=255;
dotCount++;
}
else if(angleVal>=0&&angleVal<angleThreshold||angleVal>=180-angleThreshold&&angleVal<180){
horizontalLines.ucharPtr(y,x)[0]=255;
hCount++;
}
else if(angleVal>=90-angleThreshold&&angleVal<90+angleThreshold){
verticalLines.ucharPtr(y,x)[0]=255;
vCount++;
}
else{
diagonalLines.ucharPtr(y,x)[0]=255;
dCount++;
}
}
}
}
const partsCanvas=createResultCanvas('12. 文字パーツ分類','parts');
let partsDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
const visualizeStart=performance.now();
for(let y=0;y<skeleton.rows;y++){
for(let x=0;x<skeleton.cols;x++){
if(horizontalLines.ucharPtr(y,x)[0]>0){
partsDisplay.ucharPtr(y,x)[0]=0;
partsDisplay.ucharPtr(y,x)[1]=0;
partsDisplay.ucharPtr(y,x)[2]=255;
}
else if(verticalLines.ucharPtr(y,x)[0]>0){
partsDisplay.ucharPtr(y,x)[0]=0;
partsDisplay.ucharPtr(y,x)[1]=255;
partsDisplay.ucharPtr(y,x)[2]=0;
}
else if(diagonalLines.ucharPtr(y,x)[0]>0){
partsDisplay.ucharPtr(y,x)[0]=255;
partsDisplay.ucharPtr(y,x)[1]=0;
partsDisplay.ucharPtr(y,x)[2]=0;
}
else if(dots.ucharPtr(y,x)[0]>0){
partsDisplay.ucharPtr(y,x)[0]=255;
partsDisplay.ucharPtr(y,x)[1]=255;
partsDisplay.ucharPtr(y,x)[2]=0;
}
}
}
cv.imshow(partsCanvas,partsDisplay);
const context=partsCanvas.getContext('2d');
const imgWidth=originalMat.cols;
const imgHeight=originalMat.rows;
const fontSize=Math.max(14,Math.min(imgWidth/20,30));
const lineHeight=fontSize*1.5;
const textX=10;
const legendWidth=fontSize*7;
const legendHeight=lineHeight*4.5;
const padding=fontSize/2;
context.fillStyle='rgba(255,255,255,0.7)';
context.fillRect(textX-padding,padding,legendWidth,legendHeight);
context.font=`${fontSize}px sans-serif`;
context.textBaseline='middle';
context.fillStyle='rgb(0,0,255)';
context.fillRect(textX,lineHeight*1-fontSize/2,fontSize,fontSize);
context.fillStyle='black';
context.fillText('横線',textX+fontSize*1.5,lineHeight*1);
context.fillStyle='rgb(0,255,0)';
context.fillRect(textX,lineHeight*2-fontSize/2,fontSize,fontSize);
context.fillStyle='black';
context.fillText('縦線',textX+fontSize*1.5,lineHeight*2);
context.fillStyle='rgb(255,0,0)';
context.fillRect(textX,lineHeight*3-fontSize/2,fontSize,fontSize);
context.fillStyle='black';
context.fillText('斜線',textX+fontSize*1.5,lineHeight*3);
context.fillStyle='rgb(255,255,0)';
context.fillRect(textX,lineHeight*4-fontSize/2,fontSize,fontSize);
context.fillStyle='black';
context.fillText('点',textX+fontSize*1.5,lineHeight*4);
const hCountFinal=cv.countNonZero(horizontalLines);
const vCountFinal=cv.countNonZero(verticalLines);
const dCountFinal=cv.countNonZero(diagonalLines);
const dotCountFinal=cv.countNonZero(dots);
mask.delete();
binaryMask.delete();
skeleton.delete();
element.delete();
temp.delete();
eroded.delete();
dilated.delete();
horizontalLines.delete();
verticalLines.delete();
diagonalLines.delete();
dots.delete();
gradX.delete();
gradY.delete();
mag.delete();
angle.delete();
partsDisplay.delete();
}catch(err){
throw err;
}
}
function generateDensityMap(){
try{
const dmStart=performance.now();
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
const kernelSize=parseInt(densityKernelSize.value);
const filterTypeValue=parseInt(densityFilterType.value);
let filterType;
switch(filterTypeValue){
case 0:filterType=cv.MORPH_RECT;break;
case 1:filterType=cv.MORPH_CROSS;break;
case 2:filterType=cv.MORPH_ELLIPSE;break;
default:filterType=cv.MORPH_RECT;
}
const filterTypeNames=['RECT','CROSS','ELLIPSE'];
let density=new cv.Mat();
let kernel=cv.getStructuringElement(filterType,new cv.Size(kernelSize,kernelSize));
const anchorX=Math.floor(kernel.cols/2);
const anchorY=Math.floor(kernel.rows/2);
const anchor=new cv.Point(anchorX,anchorY);
const filterStart=performance.now();
cv.filter2D(binaryMask,density,cv.CV_32F,kernel,anchor,0,cv.BORDER_DEFAULT);
let normalizedDensity=new cv.Mat();
cv.normalize(density,normalizedDensity,0,255,cv.NORM_MINMAX);
normalizedDensity.convertTo(normalizedDensity,cv.CV_8U);
const densityCanvas=createResultCanvas('13. 密度マップ','density');
let colorMap=new cv.Mat.zeros(normalizedDensity.rows,normalizedDensity.cols,cv.CV_8UC3);
const colorMapTypeValue=parseInt(colorMapType.value);
const colorMapNames=['BLUE-GREEN','JET','HOT','COOL'];
const colorStart=performance.now();
let processedPixels=0;
for(let y=0;y<normalizedDensity.rows;y++){
for(let x=0;x<normalizedDensity.cols;x++){
if(binaryMask.ucharPtr(y,x)[0]>0){
processedPixels++;
const val=normalizedDensity.ucharPtr(y,x)[0];
let r=0,g=0,b=0;
switch(colorMapTypeValue){
case 0:
if(val<128){
b=255;
g=val*2;
}else{
b=255-(val-128)*2;
g=255;
}
break;
case 1:
if(val<64){
b=255;
g=val*4;
}else if(val<128){
b=255-(val-64)*4;
g=255;
r=(val-64)*4;
}else if(val<192){
g=255-(val-128)*4;
r=255;
}else{
r=255-(val-192)*4;
}
break;
case 2:
if(val<85){
r=val*3;
}else if(val<170){
r=255;
g=(val-85)*3;
}else{
r=255;
g=255;
b=(val-170)*3;
}
break;
case 3:
r=val;
g=255-val;
b=255;
break;
}
colorMap.ucharPtr(y,x)[0]=b;
colorMap.ucharPtr(y,x)[1]=g;
colorMap.ucharPtr(y,x)[2]=r;
}
}
}
cv.imshow(densityCanvas,colorMap);
mask.delete();
binaryMask.delete();
density.delete();
kernel.delete();
normalizedDensity.delete();
colorMap.delete();
}catch(err){
throw err;
}
}
function countNonZeroRGB(mat){
let count=0;
for(let y=0;y<mat.rows;y++){
for(let x=0;x<mat.cols;x++){
if(mat.ucharPtr(y,x)[0]>0||mat.ucharPtr(y,x)[1]>0||mat.ucharPtr(y,x)[2]>0){
count++;
}
}
}
return count;
}
function separateCharacters(){
try{
const scStart=performance.now();
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let distanceMap=new cv.Mat();
const distMethodValue=parseInt(distTransformMethod.value);
let distMethod;
switch(distMethodValue){
case 1:distMethod=cv.DIST_L1;break;
case 2:distMethod=cv.DIST_L2;break;
default:distMethod=cv.DIST_L2;
}
const distMethodNames=['','L1','L2'];
const distStart=performance.now();
cv.distanceTransform(binaryMask,distanceMap,distMethod,5);
let distInv=new cv.Mat();
cv.normalize(distanceMap,distInv,0,255,cv.NORM_MINMAX);
distInv.convertTo(distInv,cv.CV_8U);
let ones=new cv.Mat(distInv.rows,distInv.cols,distInv.type(),new cv.Scalar(255));
cv.subtract(ones,distInv,distInv);
ones.delete();
let markers=new cv.Mat();
const separationThresh=parseInt(charSeparationThresh.value);
cv.threshold(distInv,markers,separationThresh,255,cv.THRESH_BINARY);
let contours=new cv.MatVector();
let hierarchy=new cv.Mat();
const contoursStart=performance.now();
cv.findContours(markers,contours,hierarchy,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_SIMPLE);
markers=cv.Mat.zeros(binaryMask.rows,binaryMask.cols,cv.CV_32S);
const drawStart=performance.now();
for(let i=0;i<contours.size();i++){
cv.drawContours(markers,contours,i,new cv.Scalar(i+1),-1);
}
let bgMarker=new cv.Mat();
cv.threshold(binaryMask,bgMarker,1,128,cv.THRESH_BINARY_INV);
markers.setTo(new cv.Scalar(255),bgMarker);
let colorMask=new cv.Mat();
cv.cvtColor(binaryMask,colorMask,cv.COLOR_GRAY2BGR);
let separatedMask=binaryMask.clone();
const dilateSize=parseInt(separationDilateSize.value);
if(dilateSize%2===0){
}
const dilationSize=dilateSize%2===0?dilateSize+1:dilateSize;
let dilated=new cv.Mat();
cv.dilate(separatedMask,dilated,cv.getStructuringElement(cv.MORPH_RECT,new cv.Size(dilationSize,dilationSize)));
cv.subtract(dilated,separatedMask,separatedMask);
const separationCanvas=createResultCanvas('14. 文字分割','separation');
let separationDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
const visualizeStart=performance.now();
for(let y=0;y<binaryMask.rows;y++){
for(let x=0;x<binaryMask.cols;x++){
if(binaryMask.ucharPtr(y,x)[0]>0){
separationDisplay.ucharPtr(y,x)[0]=200;
separationDisplay.ucharPtr(y,x)[1]=200;
separationDisplay.ucharPtr(y,x)[2]=200;
}
}
}
for(let y=0;y<separatedMask.rows;y++){
for(let x=0;x<separatedMask.cols;x++){
if(separatedMask.ucharPtr(y,x)[0]>0){
separationDisplay.ucharPtr(y,x)[0]=0;
separationDisplay.ucharPtr(y,x)[1]=0;
separationDisplay.ucharPtr(y,x)[2]=255;
}
}
}
let labels=new cv.Mat();
let stats=new cv.Mat();
let centroids=new cv.Mat();
const ccStart=performance.now();
const numChars=cv.connectedComponentsWithStats(binaryMask,labels,stats,centroids);
const imgWidth=originalMat.cols;
const fontScale=Math.max(0.8,imgWidth/500);
const thickness=Math.max(1,Math.floor(fontScale*2));
const labelStart=performance.now();
for(let i=1;i<numChars;i++){
const centerX=Math.round(centroids.doubleAt(i,0));
const centerY=Math.round(centroids.doubleAt(i,1));
cv.putText(
separationDisplay,
`${i}`,
new cv.Point(centerX+1, centerY+1),
cv.FONT_HERSHEY_SIMPLEX,
fontScale,
new cv.Scalar(0,0,0),
thickness+1
);
cv.putText(
separationDisplay,
`${i}`,
new cv.Point(centerX, centerY),
cv.FONT_HERSHEY_SIMPLEX,
fontScale,
new cv.Scalar(0,255,255),
thickness
);
}
cv.imshow(separationCanvas,separationDisplay);
mask.delete();
binaryMask.delete();
distanceMap.delete();
distInv.delete();
markers.delete();
contours.delete();
hierarchy.delete();
bgMarker.delete();
colorMask.delete();
separatedMask.delete();
dilated.delete();
separationDisplay.delete();
labels.delete();
stats.delete();
centroids.delete();
}catch(err){
throw err;
}
}