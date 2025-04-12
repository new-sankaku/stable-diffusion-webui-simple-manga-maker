const originalCanvas=document.getElementById('originalCanvas');
const dropArea=document.getElementById('drop-area');
const imageInput=document.getElementById('imageInput');
const logContainer=document.getElementById('logContainer');
const resultsView=document.getElementById('resultsView');
const cannyThresh1=document.getElementById('cannyThresh1');
const cannyThresh1Value=document.getElementById('cannyThresh1Value');
const cannyThresh2=document.getElementById('cannyThresh2');
const cannyThresh2Value=document.getElementById('cannyThresh2Value');
const houghThreshold=document.getElementById('houghThreshold');
const houghThresholdValue=document.getElementById('houghThresholdValue');
const thinningIterations=document.getElementById('thinningIterations');
const thinningIterationsValue=document.getElementById('thinningIterationsValue');
const strokeWidthDelta=document.getElementById('strokeWidthDelta');
const strokeWidthDeltaValue=document.getElementById('strokeWidthDeltaValue');
const brushPressureStrength=document.getElementById('brushPressureStrength');
const brushPressureStrengthValue=document.getElementById('brushPressureStrengthValue');
const strokeOrderSmoothing=document.getElementById('strokeOrderSmoothing');
const strokeOrderSmoothingValue=document.getElementById('strokeOrderSmoothingValue');
const textureDirections=document.getElementById('textureDirections');
const textureDirectionsValue=document.getElementById('textureDirectionsValue');
const densityKernelSize=document.getElementById('densityKernelSize');
const densityKernelSizeValue=document.getElementById('densityKernelSizeValue');
const charSeparationThresh=document.getElementById('charSeparationThresh');
const charSeparationThreshValue=document.getElementById('charSeparationThreshValue');
let originalMat=null;
let grayMat=null;
let alphaMat=null;
window.isOpenCvReady=false;

function setupEventListeners(){
['dragenter','dragover','dragleave','drop'].forEach(eventName=>{
dropArea.addEventListener(eventName,preventDefaults,false);
});
['dragenter','dragover'].forEach(eventName=>{
dropArea.addEventListener(eventName,highlight,false);
});
['dragleave','drop'].forEach(eventName=>{
dropArea.addEventListener(eventName,unhighlight,false);
});
dropArea.addEventListener('drop',handleDrop,false);
imageInput.addEventListener('change',handleFileSelect,false);
cannyThresh1.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
cannyThresh2.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
houghThreshold.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
thinningIterations.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
strokeWidthDelta.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
brushPressureStrength.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
strokeOrderSmoothing.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
textureDirections.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
densityKernelSize.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
charSeparationThresh.addEventListener('input',function(){
updateParameterValue();
if(originalMat)processAll();
});
updateParameterValue();
}

function preventDefaults(e){
e.preventDefault();
e.stopPropagation();
}

function highlight(){
dropArea.classList.add('highlight');
}

function unhighlight(){
dropArea.classList.remove('highlight');
}

function handleDrop(e){
const dt=e.dataTransfer;
const files=dt.files;
handleFiles(files);
}

function handleFileSelect(e){
const files=e.target.files;
handleFiles(files);
}

function handleFiles(files){
if(files.length>0){
const file=files[0];
if(file.type.match('image.*')){
const reader=new FileReader();
reader.onload=function(e){
loadImage(e.target.result);
};
reader.readAsDataURL(file);
}else{
log('画像ファイルを選択してください');
}
}
}

function loadImage(src){
if(!window.isOpenCvReady){
log('OpenCVがまだ読み込まれていません');
return;
}
log('画像読み込み中...');
resultsView.innerHTML='';
const img=new Image();
img.onload=function(){
originalCanvas.width=img.width;
originalCanvas.height=img.height;
const ctx=originalCanvas.getContext('2d');
ctx.clearRect(0,0,originalCanvas.width,originalCanvas.height);
ctx.drawImage(img,0,0);
try{
originalMat=cv.imread(originalCanvas);
extractAlphaAndGray();
log(`画像読み込み完了: ${img.width}x${img.height}px`);
processAll();
}catch(err){
log(`エラー: ${err.message}`);
console.error(err);
}
};
img.onerror=function(){
log('画像の読み込みに失敗しました');
};
img.src=src;
}

function extractAlphaAndGray(){
let channels=new cv.MatVector();
cv.split(originalMat,channels);
if(channels.size()===4){
alphaMat=channels.get(3).clone();
grayMat=new cv.Mat();
cv.cvtColor(originalMat,grayMat,cv.COLOR_RGBA2GRAY);
}else if(channels.size()===3){
alphaMat=new cv.Mat(originalMat.rows,originalMat.cols,cv.CV_8UC1,new cv.Scalar(255));
grayMat=new cv.Mat();
cv.cvtColor(originalMat,grayMat,cv.COLOR_RGB2GRAY);
log('警告: この画像には透明度情報がありません');
}else{
log('エラー: 未対応の画像形式です');
return;
}
for(let i=0;i<channels.size();++i){
channels.get(i).delete();
}
channels.delete();
}

function updateParameterValue(){
cannyThresh1Value.textContent=cannyThresh1.value;
cannyThresh2Value.textContent=cannyThresh2.value;
houghThresholdValue.textContent=houghThreshold.value;
thinningIterationsValue.textContent=thinningIterations.value;
strokeWidthDeltaValue.textContent=strokeWidthDelta.value;
brushPressureStrengthValue.textContent=brushPressureStrength.value;
strokeOrderSmoothingValue.textContent=strokeOrderSmoothing.value;
textureDirectionsValue.textContent=textureDirections.value;
densityKernelSizeValue.textContent=densityKernelSize.value;
charSeparationThreshValue.textContent=charSeparationThresh.value;
}

function log(message){
const logEntry=document.createElement('div');
logEntry.textContent=`[${new Date().toLocaleTimeString('ja-JP',{hour12:false})}] ${message}`;
logContainer.appendChild(logEntry);
logContainer.scrollTop=logContainer.scrollHeight;
}

function createResultCanvas(title){
const existingResult=document.querySelector(`.result-item[data-title="${title}"]`);
if(existingResult){
existingResult.remove();
}
const resultItem=document.createElement('div');
resultItem.className='result-item';
resultItem.setAttribute('data-title',title);
const resultTitle=document.createElement('h4');
resultTitle.textContent=title;
resultItem.appendChild(resultTitle);
const resultCanvas=document.createElement('canvas');
resultCanvas.className='result-canvas';
resultCanvas.width=originalCanvas.width;
resultCanvas.height=originalCanvas.height;
resultItem.appendChild(resultCanvas);
resultsView.appendChild(resultItem);
return resultCanvas;
}

function processAll(){
if(!window.isOpenCvReady||!originalMat){
log('画像が読み込まれていないか、OpenCVが準備できていません');
return;
}
log('全処理を開始...');
resultsView.innerHTML='';
try{
detectEdges();
detectContours();
skeletonize();
detectLineSegments();
detectCurves();
analyzeStrokeWidth();
analyzeConnectivity();
simulateBrushPressure();
estimateStrokeOrder();
analyzeTextureDirection();
classifyCharacterParts();
generateDensityMap();
separateCharacters();
log('全処理完了');
}catch(err){
log(`エラー: ${err.message}`);
console.error(err);
}
}

function detectEdges(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let edgeInput=new cv.Mat();
cv.bitwise_and(grayMat,grayMat,edgeInput,binaryMask);
let edges=new cv.Mat();
const threshold1=parseInt(cannyThresh1.value);
const threshold2=parseInt(cannyThresh2.value);
cv.Canny(edgeInput,edges,threshold1,threshold2,3,true);
const edgeCanvas=createResultCanvas('1. エッジ検出');
cv.imshow(edgeCanvas,edges);
mask.delete();
binaryMask.delete();
edgeInput.delete();
edges.delete();
}catch(err){
log(`エッジ検出エラー: ${err.message}`);
throw err;
}
}

function detectContours(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let contours=new cv.MatVector();
let hierarchy=new cv.Mat();
cv.findContours(binaryMask,contours,hierarchy,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_SIMPLE);
const contourCanvas=createResultCanvas('2. 輪郭検出');
let contourDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
for(let i=0;i<contours.size();++i){
let color=new cv.Scalar(
Math.random()*255,
Math.random()*255,
Math.random()*255
);
cv.drawContours(contourDisplay,contours,i,color,2);
}
cv.imshow(contourCanvas,contourDisplay);
const stats=analyzeContours(contours);
log(`輪郭: ${contours.size()}個, 平均面積: ${stats.avgArea?.toFixed(1) || 0}px²`);
mask.delete();
binaryMask.delete();
contours.delete();
hierarchy.delete();
contourDisplay.delete();
}catch(err){
log(`輪郭検出エラー: ${err.message}`);
throw err;
}
}

function analyzeContours(contours){
if(contours.size()===0)return{};
let totalArea=0;
let totalPerimeter=0;
let minArea=Number.MAX_VALUE;
let maxArea=0;
for(let i=0;i<contours.size();++i){
const cnt=contours.get(i);
const area=cv.contourArea(cnt);
totalArea+=area;
minArea=Math.min(minArea,area);
maxArea=Math.max(maxArea,area);
const perimeter=cv.arcLength(cnt,true);
totalPerimeter+=perimeter;
}
const avgArea=totalArea/contours.size();
const avgPerimeter=totalPerimeter/contours.size();
return{avgArea,avgPerimeter,minArea,maxArea};
}

function skeletonize(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let skeleton=binaryMask.clone();
const iterations=parseInt(thinningIterations.value);
let element=cv.getStructuringElement(cv.MORPH_CROSS,new cv.Size(3,3));
let temp=new cv.Mat();
let eroded=new cv.Mat();
let dilated=new cv.Mat();
for(let i=0;i<iterations;i++){
cv.erode(skeleton,eroded,element);
cv.dilate(eroded,dilated,element);
cv.subtract(skeleton,dilated,temp);
cv.bitwise_or(temp,cv.Mat.zeros(skeleton.rows,skeleton.cols,skeleton.type()),skeleton);
}
const skeletonCanvas=createResultCanvas('3. 骨格化');
cv.imshow(skeletonCanvas,skeleton);
mask.delete();
binaryMask.delete();
element.delete();
temp.delete();
eroded.delete();
dilated.delete();
}catch(err){
log(`骨格化エラー: ${err.message}`);
throw err;
}
}

function detectLineSegments(){
try{
let edges=new cv.Mat();
const threshold1=parseInt(cannyThresh1.value);
const threshold2=parseInt(cannyThresh2.value);
cv.Canny(alphaMat,edges,threshold1,threshold2,3,true);
let lines=new cv.Mat();
const houghThreshValue=parseInt(houghThreshold.value);
cv.HoughLinesP(edges,lines,1,Math.PI/180,houghThreshValue,20,5);
const lineCanvas=createResultCanvas('4. 線分検出');
let lineDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
let horizontalLines=0;
let verticalLines=0;
let diagonalLines=0;
let lengths=[];
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
if(angle<22.5||angle>157.5){
horizontalLines++;
cv.line(lineDisplay,startPoint,endPoint,new cv.Scalar(255,0,0),2);
}else if(angle>67.5&&angle<112.5){
verticalLines++;
cv.line(lineDisplay,startPoint,endPoint,new cv.Scalar(0,255,0),2);
}else{
diagonalLines++;
cv.line(lineDisplay,startPoint,endPoint,new cv.Scalar(0,0,255),2);
}
}
cv.imshow(lineCanvas,lineDisplay);
const avgLength=lengths.length>0?lengths.reduce((sum,len)=>sum+len,0)/lengths.length:0;
log(`線分: 計${lines.rows}本 (H:${horizontalLines},V:${verticalLines},D:${diagonalLines}), 平均長: ${avgLength.toFixed(1)}px`);
edges.delete();
lines.delete();
lineDisplay.delete();
}catch(err){
log(`線分検出エラー: ${err.message}`);
throw err;
}
}

function detectCurves(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let contours=new cv.MatVector();
let hierarchy=new cv.Mat();
cv.findContours(binaryMask,contours,hierarchy,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_NONE);
const curveCanvas=createResultCanvas('5. 曲線検出');
let curveDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
let curvaturePoints=[];
for(let i=0;i<contours.size();++i){
const contour=contours.get(i);
const epsilon=0.01*cv.arcLength(contour,true);
let approx=new cv.Mat();
cv.approxPolyDP(contour,approx,epsilon,true);
cv.drawContours(curveDisplay,contours,i,new cv.Scalar(50,50,50),1);
for(let j=0;j<approx.rows;j++){
const pt=new cv.Point(approx.data32S[j*2],approx.data32S[j*2+1]);
curvaturePoints.push(pt);
cv.circle(curveDisplay,pt,3,new cv.Scalar(0,0,255),-1);
}
approx.delete();
}
cv.imshow(curveCanvas,curveDisplay);
log(`曲率点: ${curvaturePoints.length}点`);
mask.delete();
binaryMask.delete();
contours.delete();
hierarchy.delete();
curveDisplay.delete();
}catch(err){
log(`曲線検出エラー: ${err.message}`);
throw err;
}
}

function analyzeStrokeWidth(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let distanceMap=new cv.Mat();
cv.distanceTransform(binaryMask,distanceMap,cv.DIST_L2,3);
let displayDistanceMap=new cv.Mat();
cv.normalize(distanceMap,displayDistanceMap,0,255,cv.NORM_MINMAX);
displayDistanceMap.convertTo(displayDistanceMap,cv.CV_8U);
const distanceCanvas=createResultCanvas('6. 距離変換');
cv.imshow(distanceCanvas,displayDistanceMap);
const delta=parseInt(strokeWidthDelta.value);
let localMax=cv.Mat.zeros(distanceMap.rows,distanceMap.cols,cv.CV_8U);
let strokeWidths=[];
for(let y=delta;y<distanceMap.rows-delta;y++){
for(let x=delta;x<distanceMap.cols-delta;x++){
const centerValue=distanceMap.floatAt(y,x);
if(centerValue<0.5)continue;
let isLocalMax=true;
for(let dy=-delta;dy<=delta&&isLocalMax;dy++){
for(let dx=-delta;dx<=delta;dx++){
if(dx===0&&dy===0)continue;
const nx=x+dx;
const ny=y+dy;
if(nx>=0&&nx<distanceMap.cols&&ny>=0&&ny<distanceMap.rows){
if(distanceMap.floatAt(ny,nx)>centerValue){
isLocalMax=false;
break;
}
}
}
}
if(isLocalMax){
localMax.ucharPtr(y,x)[0]=255;
strokeWidths.push(centerValue);
}
}
}
const centerlineCanvas=createResultCanvas('7. 中心線と線幅');
let centerlineDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
let alphaDisplay=new cv.Mat();
cv.cvtColor(binaryMask,alphaDisplay,cv.COLOR_GRAY2BGR);
cv.addWeighted(centerlineDisplay,0.7,alphaDisplay,0.3,0,centerlineDisplay);
for(let y=0;y<localMax.rows;y++){
for(let x=0;x<localMax.cols;x++){
if(localMax.ucharPtr(y,x)[0]===255){
const radius=Math.round(distanceMap.floatAt(y,x));
cv.circle(centerlineDisplay,new cv.Point(x,y),1,new cv.Scalar(0,255,0),-1);
cv.circle(centerlineDisplay,new cv.Point(x,y),radius,new cv.Scalar(255,0,0),1);
}
}
}
cv.imshow(centerlineCanvas,centerlineDisplay);
let avgStrokeWidth=0;
let maxStrokeWidth=0;
let minStrokeWidth=Number.MAX_VALUE;
if(strokeWidths.length>0){
avgStrokeWidth=strokeWidths.reduce((a,b)=>a+b,0)/strokeWidths.length;
maxStrokeWidth=Math.max(...strokeWidths);
minStrokeWidth=Math.min(...strokeWidths);
}
log(`線幅: 中心点${strokeWidths.length}点, 平均${avgStrokeWidth.toFixed(1)}px (${minStrokeWidth.toFixed(1)}-${maxStrokeWidth.toFixed(1)}px)`);
mask.delete();
binaryMask.delete();
distanceMap.delete();
displayDistanceMap.delete();
localMax.delete();
alphaDisplay.delete();
centerlineDisplay.delete();
}catch(err){
log(`線幅分析エラー: ${err.message}`);
throw err;
}
}

function analyzeConnectivity(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let labels=new cv.Mat();
let stats=new cv.Mat();
let centroids=new cv.Mat();
const numLabels=cv.connectedComponentsWithStats(binaryMask,labels,stats,centroids);
const connectivityCanvas=createResultCanvas('8. 連結成分分析');
let connectivityDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
const colors=[];
for(let i=1;i<numLabels;i++){
colors.push(new cv.Scalar(
Math.random()*255,
Math.random()*255,
Math.random()*255
));
}
for(let y=0;y<labels.rows;y++){
for(let x=0;x<labels.cols;x++){
const label=labels.intAt(y,x);
if(label===0)continue;
const colorIdx=label-1;
connectivityDisplay.ucharPtr(y,x)[0]=colors[colorIdx].x;
connectivityDisplay.ucharPtr(y,x)[1]=colors[colorIdx].y;
connectivityDisplay.ucharPtr(y,x)[2]=colors[colorIdx].z;
}
}
for(let i=1;i<numLabels;i++){
const area=stats.intAt(i,cv.CC_STAT_AREA);
const left=stats.intAt(i,cv.CC_STAT_LEFT);
const top=stats.intAt(i,cv.CC_STAT_TOP);
const width=stats.intAt(i,cv.CC_STAT_WIDTH);
const height=stats.intAt(i,cv.CC_STAT_HEIGHT);
const pt1=new cv.Point(left,top);
const pt2=new cv.Point(left+width,top+height);
cv.rectangle(connectivityDisplay,pt1,pt2,new cv.Scalar(255,255,255),1);
const labelPt=new cv.Point(left,top-5);
cv.putText(connectivityDisplay,`${i}`,labelPt,cv.FONT_HERSHEY_SIMPLEX,0.5,new cv.Scalar(255,255,255),1);
}
cv.imshow(connectivityCanvas,connectivityDisplay);
log(`連結成分: ${numLabels-1}個`);
mask.delete();
binaryMask.delete();
labels.delete();
stats.delete();
centroids.delete();
connectivityDisplay.delete();
}catch(err){
log(`連結成分分析エラー: ${err.message}`);
throw err;
}
}

function simulateBrushPressure(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let distanceMap=new cv.Mat();
const strength=parseInt(brushPressureStrength.value);
cv.distanceTransform(binaryMask,distanceMap,cv.DIST_L2,strength);
let edges=new cv.Mat();
cv.Canny(binaryMask,edges,50,150,3);
let gradX=new cv.Mat();
let gradY=new cv.Mat();
let grad=new cv.Mat();
let angle=new cv.Mat();
cv.Sobel(binaryMask,gradX,cv.CV_32F,1,0,3);
cv.Sobel(binaryMask,gradY,cv.CV_32F,0,1,3);
cv.cartToPolar(gradX,gradY,grad,angle);
let brushPressureMap=new cv.Mat();
distanceMap.convertTo(brushPressureMap,cv.CV_8U,1,0);
const brushCanvas=createResultCanvas('9. 筆圧シミュレーション');
let pressureDisplay=cv.Mat.zeros(brushPressureMap.rows,brushPressureMap.cols,cv.CV_8UC3);
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
for(let y=0;y<angle.rows;y+=10){
for(let x=0;x<angle.cols;x+=10){
if(binaryMask.ucharPtr(y,x)[0]>0){
const angleVal=angle.floatAt(y,x);
const gradVal=grad.floatAt(y,x);
if(gradVal>0.5){
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
}
}
}
}
cv.imshow(brushCanvas,pressureDisplay);
log('筆圧シミュレーション完了: 筆の入り・抜きポイントを推定');
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
log(`筆圧シミュレーションエラー: ${err.message}`);
throw err;
}
}

function estimateStrokeOrder(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let skeleton=binaryMask.clone();
let element=cv.getStructuringElement(cv.MORPH_CROSS,new cv.Size(3,3));
let temp=new cv.Mat();
let eroded=new cv.Mat();
let dilated=new cv.Mat();
const smoothing=parseInt(strokeOrderSmoothing.value);
for(let i=0;i<smoothing;i++){
cv.erode(skeleton,eroded,element);
cv.dilate(eroded,dilated,element);
cv.subtract(skeleton,dilated,temp);
cv.bitwise_or(temp,cv.Mat.zeros(skeleton.rows,skeleton.cols,skeleton.type()),skeleton);
}
let endPoints=cv.Mat.zeros(skeleton.rows,skeleton.cols,cv.CV_8U);
let branchPoints=cv.Mat.zeros(skeleton.rows,skeleton.cols,cv.CV_8U);
for(let y=1;y<skeleton.rows-1;y++){
for(let x=1;x<skeleton.cols-1;x++){
if(skeleton.ucharPtr(y,x)[0]===0)continue;
let neighbors=0;
for(let dy=-1;dy<=1;dy++){
for(let dx=-1;dx<=1;dx++){
if(dx===0&&dy===0)continue;
if(skeleton.ucharPtr(y+dy,x+dx)[0]>0){
neighbors++;
}
}
}
if(neighbors===1){
endPoints.ucharPtr(y,x)[0]=255;
}
else if(neighbors>=3){
branchPoints.ucharPtr(y,x)[0]=255;
}
}
}
const strokeOrderCanvas=createResultCanvas('10. 筆順推定');
let strokeOrderDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
for(let y=0;y<skeleton.rows;y++){
for(let x=0;x<skeleton.cols;x++){
if(skeleton.ucharPtr(y,x)[0]>0){
strokeOrderDisplay.ucharPtr(y,x)[0]=100;
strokeOrderDisplay.ucharPtr(y,x)[1]=100;
strokeOrderDisplay.ucharPtr(y,x)[2]=100;
}
}
}
for(let y=0;y<branchPoints.rows;y++){
for(let x=0;x<branchPoints.cols;x++){
if(branchPoints.ucharPtr(y,x)[0]>0){
cv.circle(strokeOrderDisplay,new cv.Point(x,y),3,new cv.Scalar(0,0,255),-1);
}
}
}
let endPointsList=[];
for(let y=0;y<endPoints.rows;y++){
for(let x=0;x<endPoints.cols;x++){
if(endPoints.ucharPtr(y,x)[0]>0){
endPointsList.push(new cv.Point(x,y));
cv.circle(strokeOrderDisplay,new cv.Point(x,y),5,new cv.Scalar(0,255,0),-1);
}
}
}
for(let i=0;i<endPointsList.length;i++){
cv.putText(
strokeOrderDisplay,
`${i+1}`,
new cv.Point(endPointsList[i].x+7,endPointsList[i].y+7),
cv.FONT_HERSHEY_SIMPLEX,
0.5,
new cv.Scalar(255,255,255),
1
);
}
cv.imshow(strokeOrderCanvas,strokeOrderDisplay);
log(`筆順推定完了: ${endPointsList.length}画と推定、${Math.floor(branchPoints.countNonZero()/2)}箇所の交差点を検出`);
mask.delete();
binaryMask.delete();
skeleton.delete();
element.delete();
temp.delete();
eroded.delete();
dilated.delete();
endPoints.delete();
branchPoints.delete();
strokeOrderDisplay.delete();
}catch(err){
log(`筆順推定エラー: ${err.message}`);
throw err;
}
}

function analyzeTextureDirection(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
const directions=parseInt(textureDirections.value);
let directionalResponses=[];
let maxResponseMat=cv.Mat.zeros(binaryMask.rows,binaryMask.cols,cv.CV_32F);
let directionMat=cv.Mat.zeros(binaryMask.rows,binaryMask.cols,cv.CV_8U);
for(let d=0;d<directions;d++){
const angle=d*Math.PI/directions;
const cosTheta=Math.cos(angle);
const sinTheta=Math.sin(angle);
let gradX=new cv.Mat();
let gradY=new cv.Mat();
let response=new cv.Mat();
cv.Sobel(binaryMask,gradX,cv.CV_32F,1,0,3);
cv.Sobel(binaryMask,gradY,cv.CV_32F,0,1,3);
cv.addWeighted(gradX,cosTheta,gradY,sinTheta,0,response);
cv.abs(response,response);
for(let y=0;y<response.rows;y++){
for(let x=0;x<response.cols;x++){
const respVal=response.floatAt(y,x);
if(respVal>maxResponseMat.floatAt(y,x)){
maxResponseMat.floatPtr(y,x)[0]=respVal;
directionMat.ucharPtr(y,x)[0]=d;
}
}
}
directionalResponses.push(response);
}
const directionCanvas=createResultCanvas('11. テクスチャ方向性');
let directionDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
const baseColors=[
new cv.Scalar(255,0,0),
new cv.Scalar(255,128,0),
new cv.Scalar(255,255,0),
new cv.Scalar(0,255,0),
new cv.Scalar(0,255,255),
new cv.Scalar(0,128,255),
new cv.Scalar(0,0,255),
new cv.Scalar(255,0,255)
];
const dirColors=[];
for(let i=0;i<directions;i++){
const baseIdx=i%baseColors.length;
dirColors.push(baseColors[baseIdx]);
}
for(let y=0;y<directionMat.rows;y++){
for(let x=0;x<directionMat.cols;x++){
if(binaryMask.ucharPtr(y,x)[0]>0){
const dir=directionMat.ucharPtr(y,x)[0];
const color=dirColors[dir];
directionDisplay.ucharPtr(y,x)[0]=color.x;
directionDisplay.ucharPtr(y,x)[1]=color.y;
directionDisplay.ucharPtr(y,x)[2]=color.z;
}
}
}
const step=10;
for(let y=0;y<directionMat.rows;y+=step){
for(let x=0;x<directionMat.cols;x+=step){
if(binaryMask.ucharPtr(y,x)[0]>0){
const dir=directionMat.ucharPtr(y,x)[0];
const angle=dir*Math.PI/directions;
const len=8.0;
const endX=x+len*Math.cos(angle);
const endY=y+len*Math.sin(angle);
cv.line(
directionDisplay,
new cv.Point(x,y),
new cv.Point(endX,endY),
new cv.Scalar(255,255,255),
1
);
}
}
}
cv.imshow(directionCanvas,directionDisplay);
log(`テクスチャ方向性分析完了: 筆の方向特性を${directions}方向で分析`);
mask.delete();
binaryMask.delete();
maxResponseMat.delete();
directionMat.delete();
directionDisplay.delete();
for(let i=0;i<directionalResponses.length;i++){
directionalResponses[i].delete();
}
}catch(err){
log(`テクスチャ方向性分析エラー: ${err.message}`);
throw err;
}
}

function classifyCharacterParts(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let skeleton=binaryMask.clone();
let element=cv.getStructuringElement(cv.MORPH_CROSS,new cv.Size(3,3));
let temp=new cv.Mat();
let eroded=new cv.Mat();
let dilated=new cv.Mat();
for(let i=0;i<5;i++){
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
cv.Sobel(skeleton,gradX,cv.CV_32F,1,0,3);
cv.Sobel(skeleton,gradY,cv.CV_32F,0,1,3);
cv.cartToPolar(gradX,gradY,mag,angle);
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
}
else if(angleVal>=0&&angleVal<22.5||angleVal>=157.5&&angleVal<180){
horizontalLines.ucharPtr(y,x)[0]=255;
}
else if(angleVal>=67.5&&angleVal<112.5){
verticalLines.ucharPtr(y,x)[0]=255;
}
else{
diagonalLines.ucharPtr(y,x)[0]=255;
}
}
}
}
const partsCanvas=createResultCanvas('12. 文字パーツ分類');
let partsDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
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
cv.putText(
partsDisplay,
'横線',
new cv.Point(10,20),
cv.FONT_HERSHEY_SIMPLEX,
0.5,
new cv.Scalar(0,0,255),
1
);
cv.putText(
partsDisplay,
'縦線',
new cv.Point(10,40),
cv.FONT_HERSHEY_SIMPLEX,
0.5,
new cv.Scalar(0,255,0),
1
);
cv.putText(
partsDisplay,
'斜線',
new cv.Point(10,60),
cv.FONT_HERSHEY_SIMPLEX,
0.5,
new cv.Scalar(255,0,0),
1
);
cv.putText(
partsDisplay,
'点',
new cv.Point(10,80),
cv.FONT_HERSHEY_SIMPLEX,
0.5,
new cv.Scalar(255,255,0),
1
);
cv.imshow(partsCanvas,partsDisplay);
const hCount=horizontalLines.countNonZero();
const vCount=verticalLines.countNonZero();
const dCount=diagonalLines.countNonZero();
const dotCount=dots.countNonZero();
log(`文字パーツ分類完了: 横線${hCount}px, 縦線${vCount}px, 斜線${dCount}px, 点${dotCount}px`);
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
log(`文字パーツ分類エラー: ${err.message}`);
throw err;
}
}

function generateDensityMap(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
const kernelSize=parseInt(densityKernelSize.value);
let density=new cv.Mat();
let kernel=cv.getStructuringElement(cv.MORPH_RECT,new cv.Size(kernelSize,kernelSize));
cv.filter2D(binaryMask,density,cv.CV_32F,kernel,-1,0,cv.BORDER_DEFAULT);
let normalizedDensity=new cv.Mat();
cv.normalize(density,normalizedDensity,0,255,cv.NORM_MINMAX);
normalizedDensity.convertTo(normalizedDensity,cv.CV_8U);
const densityCanvas=createResultCanvas('13. 密度マップ');
let densityDisplay=new cv.Mat();
let colorMap=new cv.Mat(normalizedDensity.rows,normalizedDensity.cols,cv.CV_8UC3);
for(let y=0;y<normalizedDensity.rows;y++){
for(let x=0;x<normalizedDensity.cols;x++){
const val=normalizedDensity.ucharPtr(y,x)[0];
if(val>0){
let r=0,g=0,b=0;
if(val<128){
r=val*2;
}else{
r=255;
g=(val-128)*2;
}
colorMap.ucharPtr(y,x)[0]=b;
colorMap.ucharPtr(y,x)[1]=g;
colorMap.ucharPtr(y,x)[2]=r;
}
}
}
cv.imshow(densityCanvas,colorMap);
log(`密度マップ生成完了: カーネルサイズ${kernelSize}で文字の局所的な複雑さを視覚化`);
mask.delete();
binaryMask.delete();
density.delete();
kernel.delete();
normalizedDensity.delete();
colorMap.delete();
}catch(err){
log(`密度マップ生成エラー: ${err.message}`);
throw err;
}
}

function separateCharacters(){
try{
let mask=alphaMat.clone();
let binaryMask=new cv.Mat();
cv.threshold(mask,binaryMask,1,255,cv.THRESH_BINARY);
let distanceMap=new cv.Mat();
cv.distanceTransform(binaryMask,distanceMap,cv.DIST_L2,5);
let distInv=new cv.Mat();
cv.normalize(distanceMap,distInv,0,255,cv.NORM_MINMAX);
distInv.convertTo(distInv,cv.CV_8U);
cv.subtract(new cv.Scalar(255),distInv,distInv);
let markers=new cv.Mat();
const separationThresh=parseInt(charSeparationThresh.value);
cv.threshold(distInv,markers,separationThresh,255,cv.THRESH_BINARY);
let contours=new cv.MatVector();
let hierarchy=new cv.Mat();
cv.findContours(markers,contours,hierarchy,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_SIMPLE);
markers=cv.Mat.zeros(binaryMask.rows,binaryMask.cols,cv.CV_32S);
for(let i=0;i<contours.size();i++){
cv.drawContours(markers,contours,i,new cv.Scalar(i+1),-1);
}
let bgMarker=new cv.Mat();
cv.threshold(binaryMask,bgMarker,1,128,cv.THRESH_BINARY_INV);
markers.setTo(new cv.Scalar(255),bgMarker);
let colorMask=new cv.Mat();
cv.cvtColor(binaryMask,colorMask,cv.COLOR_GRAY2BGR);
let separatedMask=binaryMask.clone();
let dilated=new cv.Mat();
cv.dilate(separatedMask,dilated,cv.getStructuringElement(cv.MORPH_RECT,new cv.Size(3,3)));
cv.subtract(dilated,separatedMask,separatedMask);
const separationCanvas=createResultCanvas('14. 文字分割');
let separationDisplay=cv.Mat.zeros(originalMat.rows,originalMat.cols,cv.CV_8UC3);
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
const numChars=cv.connectedComponentsWithStats(binaryMask,labels,stats,centroids);
for(let i=1;i<numChars;i++){
const centerX=Math.round(centroids.doubleAt(i,0));
const centerY=Math.round(centroids.doubleAt(i,1));
cv.putText(
separationDisplay,
`${i}`,
new cv.Point(centerX,centerY),
cv.FONT_HERSHEY_SIMPLEX,
0.8,
new cv.Scalar(0,255,255),
2
);
}
cv.imshow(separationCanvas,separationDisplay);
log(`文字分割完了: 閾値${separationThresh}で${numChars-1}個の文字要素を検出`);
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
log(`文字分割エラー: ${err.message}`);
throw err;
}
}

setupEventListeners();
if(window.isOpenCvReady){
log('OpenCV.js の読み込みが完了しました');
}else{
log('OpenCV.js の読み込みを待っています...');
}