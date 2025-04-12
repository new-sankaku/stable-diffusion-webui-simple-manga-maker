function detectEdges(){
try{
const edgeStart=performance.now();
if(!alphaMat||!grayMat||!originalMat){
throw new Error('画像データが準備できていません');
}
let grayImg=grayMat.clone();
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let maskedGray=new cv.Mat();
cv.bitwise_not(binaryMask,binaryMask);
cv.bitwise_and(grayImg,grayImg,maskedGray,binaryMask);
const blurSize=parseInt(gaussianBlurSize.value);
if(blurSize%2===0){
}
const kernelSize=blurSize%2===0?blurSize+1:blurSize;
let blur=new cv.Mat();
const blurStart=performance.now();
cv.GaussianBlur(maskedGray,blur,new cv.Size(kernelSize,kernelSize),0,0,cv.BORDER_DEFAULT);
let edges=new cv.Mat();
const threshold1=parseInt(cannyThresh1.value);
const threshold2=parseInt(cannyThresh2.value);
const cannyStart=performance.now();
cv.Canny(blur,edges,threshold1,threshold2,3,true);
let dilatedEdges=new cv.Mat();
let kernel=cv.getStructuringElement(cv.MORPH_RECT,new cv.Size(2,2));
const dilateIterations=parseInt(edgeDilateIter.value);
cv.dilate(edges,dilatedEdges,kernel,new cv.Point(-1,-1),dilateIterations);
const edgeCanvas=createResultCanvas('1. エッジ検出','edges');
let displayResult=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
cv.cvtColor(maskedGray,displayResult,cv.COLOR_GRAY2BGR);
const visualizeStart=performance.now();
let edgeCount=0;
for(let y=0;y<dilatedEdges.rows;y++){
for(let x=0;x<dilatedEdges.cols;x++){
if(dilatedEdges.ucharPtr(y,x)[0]>0){
edgeCount++;
displayResult.ucharPtr(y,x)[0]=255;
displayResult.ucharPtr(y,x)[1]=255;
displayResult.ucharPtr(y,x)[2]=0;
}
}
}
if(edgeCount===0){
let contours=new cv.MatVector();
let hierarchy=new cv.Mat();
const contoursStart=performance.now();
cv.findContours(binaryMask,contours,hierarchy,cv.RETR_LIST,cv.CHAIN_APPROX_SIMPLE);
for(let i=0;i<contours.size();++i){
cv.drawContours(displayResult,contours,i,new cv.Scalar(255,255,0),1);
}
contours.delete();
hierarchy.delete();
}
cv.imshow(edgeCanvas,displayResult);
grayImg.delete();
mask.delete();
binaryMask.delete();
maskedGray.delete();
blur.delete();
edges.delete();
dilatedEdges.delete();
kernel.delete();
displayResult.delete();
}catch(err){
throw err;
}
}
function detectContours(){
try{
const contourStart=performance.now();
if(!alphaMat){
throw new Error('アルファチャンネルが準備できていません');
}
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
const thresh=parseInt(contourThreshold.value);
cv.threshold(mask,binaryMask,thresh,255,cv.THRESH_BINARY);
let contours=new cv.MatVector();
let hierarchy=new cv.Mat();
const modeValue=parseInt(contourMode.value);
let contourModeType;
switch(modeValue){
case 0:contourModeType=cv.RETR_EXTERNAL;break;
case 1:contourModeType=cv.RETR_LIST;break;
case 2:contourModeType=cv.RETR_CCOMP;break;
case 3:contourModeType=cv.RETR_TREE;break;
default:contourModeType=cv.RETR_EXTERNAL;
}
const findStart=performance.now();
cv.findContours(binaryMask,contours,hierarchy,contourModeType,cv.CHAIN_APPROX_SIMPLE);
const minArea=parseInt(minContourArea.value);
contourInfo=[];
for(let i=0;i<contours.size();i++){
const contour=contours.get(i);
const area=cv.contourArea(contour);
if(area>=minArea){
const contourPoints=[];
for(let j=0;j<contour.data32S.length;j+=2){
contourPoints.push({
x:contour.data32S[j],
y:contour.data32S[j+1]
});
}
contourInfo.push(contourPoints);
}
}
const contourCanvas=createResultCanvas('2. 輪郭検出','contours');
let contourDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
const drawStart=performance.now();
let drawnContours=0;
for(let i=0;i<contours.size();++i){
const area=cv.contourArea(contours.get(i));
if(area>=minArea){
drawnContours++;
let color=new cv.Scalar(
Math.random()*255,
Math.random()*255,
Math.random()*255
);
cv.drawContours(contourDisplay,contours,i,color,2);
}
}
cv.imshow(contourCanvas,contourDisplay);
const stats=analyzeContours(contours);
mask.delete();
binaryMask.delete();
contours.delete();
hierarchy.delete();
contourDisplay.delete();
}catch(err){
throw err;
}
}
function analyzeContours(contours){
if(contours.size()===0)return{};
let totalArea=0;
let totalPerimeter=0;
let minArea=Number.MAX_VALUE;
let maxArea=0;
const minAreaFilter=parseInt(minContourArea.value);
let filteredCount=0;
for(let i=0;i<contours.size();++i){
const cnt=contours.get(i);
const area=cv.contourArea(cnt);
if(area>=minAreaFilter){
filteredCount++;
totalArea+=area;
minArea=Math.min(minArea,area);
maxArea=Math.max(maxArea,area);
const perimeter=cv.arcLength(cnt,true);
totalPerimeter+=perimeter;
}
}
const avgArea=filteredCount>0?totalArea/filteredCount:0;
const avgPerimeter=filteredCount>0?totalPerimeter/filteredCount:0;
return{avgArea,avgPerimeter,minArea,maxArea,filteredCount};
}