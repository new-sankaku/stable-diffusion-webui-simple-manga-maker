const canvas=$('canvas');
const ctx=canvas.getContext('2d',{alpha:true,willReadFrequently:true});
const imageInput=$('imageInput');
const lineWidthSlider=$('lineWidthSlider');
const lineWidthValue=$('lineWidthValue');
const minLineLengthSlider=$('minLineLengthSlider');
const minLineLengthValue=$('minLineLengthValue');
const lineToleranceSlider=$('lineToleranceSlider');
const lineToleranceValue=$('lineToleranceValue');
const scanRadiusSlider=$('scanRadiusSlider');
const scanRadiusValue=$('scanRadiusValue');
const colorPicker=$('colorPicker');
const previewContainer=$('preview-container');
const logContainer=$('log-container');
const dropArea=$('drop-area');
const opencvStatus=$('opencv-status');
let originalImageData;
let opencvInitialized=false;
let previewCanvases={};
let detectedLines=[];
let processingTimeout=null;
function onOpenCvReady(){
opencvStatus.style.display='block';
opencvStatus.style.backgroundColor='#4caf50';
opencvStatus.style.color='white';
opencvStatus.textContent='OpenCV.js 読み込み完了！';
opencvInitialized=true;
log('OpenCV.js の読み込みが完了しました。バージョン: '+cv.version);
}
function log(message){
const logEntry=document.createElement('div');
logEntry.textContent=message;
logContainer.appendChild(logEntry);
logContainer.scrollTop=logContainer.scrollHeight;
}
function createOrGetPreviewCanvas(id,title,width,height){
if(previewCanvases[id]){
return previewCanvases[id].canvas;
}
const previewItem=document.createElement('div');
previewItem.className='preview-item';
const previewTitle=document.createElement('div');
previewTitle.className='preview-title';
previewTitle.textContent=title;
previewItem.appendChild(previewTitle);
const previewCanvas=document.createElement('canvas');
previewCanvas.className='preview-canvas';
previewCanvas.width=width;
previewCanvas.height=height;
const scaleFactor=Math.min(1.5,900/Math.max(width,height));
previewCanvas.style.width='auto';
previewCanvas.style.height=`${height*scaleFactor}px`;
previewItem.appendChild(previewCanvas);
previewContainer.appendChild(previewItem);
previewCanvases[id]={
canvas:previewCanvas,
item:previewItem
};
return previewCanvas;
}
imageInput.addEventListener('change',handleFileSelect);
lineWidthSlider.addEventListener('input',handleControlChange);
minLineLengthSlider.addEventListener('input',handleControlChange);
lineToleranceSlider.addEventListener('input',handleControlChange);
scanRadiusSlider.addEventListener('input',handleControlChange);
colorPicker.addEventListener('input',handleControlChange);
['dragenter','dragover','dragleave','drop'].forEach(eventName=>{
dropArea.addEventListener(eventName,preventDefaults,false);
});
function preventDefaults(e){
e.preventDefault();
e.stopPropagation();
}
['dragenter','dragover'].forEach(eventName=>{
dropArea.addEventListener(eventName,highlight,false);
});
['dragleave','drop'].forEach(eventName=>{
dropArea.addEventListener(eventName,unhighlight,false);
});
function highlight(){
dropArea.classList.add('highlight');
}
function unhighlight(){
dropArea.classList.remove('highlight');
}
dropArea.addEventListener('drop',handleDrop,false);
function handleDrop(e){
const dt=e.dataTransfer;
const files=dt.files;
if(files.length){
handleFiles(files);
}
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
}
}
}
function handleFileSelect(e){
if(e.target.files.length>0){
const reader=new FileReader();
reader.onload=function(event){
loadImage(event.target.result);
};
reader.readAsDataURL(e.target.files[0]);
}
}
function loadImage(src){
const img=new Image();
img.onload=function(){
const maxHeight=100;
const scaleFactor=Math.min(1,maxHeight/img.height);
const displayWidth=Math.floor(img.width*scaleFactor);
const displayHeight=Math.floor(img.height*scaleFactor);
canvas.width=img.width;
canvas.height=img.height;
canvas.style.width=`${displayWidth}px`;
canvas.style.height=`${displayHeight}px`;
ctx.drawImage(img,0,0);
originalImageData=ctx.getImageData(0,0,canvas.width,canvas.height);
detectedLines=[];
previewContainer.innerHTML='';
previewCanvases={};
logContainer.innerHTML='';
log(`画像読み込み完了: ${img.width}x${img.height}ピクセル`);
processImage();
};
img.src=src;
}
function handleControlChange(){
lineWidthValue.textContent=lineWidthSlider.value;
minLineLengthValue.textContent=minLineLengthSlider.value;
lineToleranceValue.textContent=lineToleranceSlider.value;
scanRadiusValue.textContent=scanRadiusSlider.value;
if(originalImageData){
clearTimeout(processingTimeout);
processingTimeout=setTimeout(processImage,300);
}
}
function getRandomColor() {
return `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
}
function analyzeContourPoint(contour, index, totalPoints) {
const windowSize = 5;
const prevIndex = (index - windowSize + totalPoints) % totalPoints;
const nextIndex = (index + windowSize) % totalPoints;
const current = {
x: contour.data32S[index * 2],
y: contour.data32S[index * 2 + 1]
};
const prev = {
x: contour.data32S[prevIndex * 2],
y: contour.data32S[prevIndex * 2 + 1]
};
const next = {
x: contour.data32S[nextIndex * 2],
y: contour.data32S[nextIndex * 2 + 1]
};
const vec1 = {
x: current.x - prev.x,
y: current.y - prev.y
};
const vec2 = {
x: next.x - current.x,
y: next.y - current.y
};
const len1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
const len2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
if (len1 === 0 || len2 === 0) return null;
const normalized1 = {
x: vec1.x / len1,
y: vec1.y / len1
};
const normalized2 = {
x: vec2.x / len2,
y: vec2.y / len2
};
const dotProduct = normalized1.x * normalized2.x + normalized1.y * normalized2.y;
const angleRadians = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
const angleDegrees = angleRadians * 180 / Math.PI;
const crossProduct = normalized1.x * normalized2.y - normalized1.y * normalized2.x;
const isConcave = crossProduct > 0;
const tangent = {
x: (normalized1.x + normalized2.x) / 2,
y: (normalized1.y + normalized2.y) / 2
};
const tangentLength = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
if (tangentLength === 0) return null;
const normalizedTangent = {
x: tangent.x / tangentLength,
y: tangent.y / tangentLength
};
return {
point: current,
angle: angleDegrees,
isConcave: isConcave,
tangent: normalizedTangent
};
}
function detectStrokeEndPoints(contour, binary) {
const totalPoints = contour.data32S.length / 2;
if (totalPoints < 10) return [];
const results = [];
const skippedIndices = new Set();
for (let i = 0; i < totalPoints; i++) {
if (skippedIndices.has(i)) continue;
const analysis = analyzeContourPoint(contour, i, totalPoints);
if (!analysis) continue;
if (analysis.angle >= 80 && analysis.angle <= 100 && !analysis.isConcave) {
const x = analysis.point.x;
const y = analysis.point.y;
const minLineLength = parseInt(minLineLengthSlider.value);
const tangent = {
x: -analysis.tangent.x,
y: -analysis.tangent.y
};
let hasValidLine = true;
let lineEndX = x;
let lineEndY = y;
for (let step = 1; step <= minLineLength; step++) {
const checkX = Math.round(x + tangent.x * step);
const checkY = Math.round(y + tangent.y * step);
if (checkX < 0 || checkX >= binary.cols || checkY < 0 || checkY >= binary.rows) {
hasValidLine = false;
break;
}
if (binary.ucharPtr(checkY, checkX)[0] === 0) {
hasValidLine = false;
break;
}
lineEndX = checkX;
lineEndY = checkY;
}
if (hasValidLine) {
const pointsAlongLine = [];
for (let step = 0; step <= minLineLength; step++) {
const lineX = Math.round(x + tangent.x * step);
const lineY = Math.round(y + tangent.y * step);
if (lineX >= 0 && lineX < binary.cols && lineY >= 0 && lineY < binary.rows) {
pointsAlongLine.push({x: lineX, y: lineY});
}
}
for (let j = 0; j < totalPoints; j++) {
if (i === j) continue;
const pointX = contour.data32S[j * 2];
const pointY = contour.data32S[j * 2 + 1];
for (const linePoint of pointsAlongLine) {
const dist = Math.sqrt(Math.pow(pointX - linePoint.x, 2) + Math.pow(pointY - linePoint.y, 2));
if (dist < 2) {
skippedIndices.add(j);
break;
}
}
}
results.push({
startX: x,
startY: y,
endX: lineEndX,
endY: lineEndY,
color: getRandomColor()
});
}
}
}
return results;
}
function processImage(){
if(!opencvInitialized){
log("エラー: OpenCVが初期化されていません。");
return;
}
if(!originalImageData){
log("エラー: 画像が読み込まれていません。");
return;
}
log("=== 処理開始 ===");
detectedLines=[];
const width=originalImageData.width;
const height=originalImageData.height;
try{
const src=cv.imread(canvas);
let alpha=new cv.Mat();
let channels=new cv.MatVector();
cv.split(src,channels);
if(channels.size()===4){
alpha=channels.get(3);
}else{
cv.cvtColor(src,alpha,cv.COLOR_RGBA2GRAY);
}
const alphaCanvas=createOrGetPreviewCanvas('alpha',"1. アルファチャンネル",width,height);
cv.imshow(alphaCanvas,alpha);
log("工程1: アルファチャンネル抽出");
const binary=new cv.Mat();
cv.threshold(alpha,binary,128,255,cv.THRESH_BINARY);
const contours=new cv.MatVector();
const hierarchy=new cv.Mat();
cv.findContours(binary,contours,hierarchy,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_NONE);
log(`検出された連結成分: ${contours.size()}`);
const contoursCanvas=createOrGetPreviewCanvas('contours',"2. 連結成分",width,height);
const contoursClone=new cv.Mat.zeros(height,width,cv.CV_8UC3);
for(let i=0;i<contours.size();i++){
const color = new cv.Scalar(
Math.floor(Math.random()*255),
Math.floor(Math.random()*255),
Math.floor(Math.random()*255),
255
);
cv.drawContours(contoursClone,contours,i,color,1,cv.LINE_8,hierarchy,0);
}
cv.imshow(contoursCanvas,contoursClone);
const allEndpoints = [];
for(let i=0;i<contours.size();i++){
const contour = contours.get(i);
if(contour.data32S.length < 12) continue;
const endpoints = detectStrokeEndPoints(contour, binary);
allEndpoints.push(...endpoints);
}
log(`検出された書き始め/書き終わりの線分: ${allEndpoints.length}`);
const resultCanvas=createOrGetPreviewCanvas('result',"3. 検出された書き始め/書き終わり",width,height);
const resultCtx=resultCanvas.getContext('2d',{alpha:true,willReadFrequently:true});
resultCtx.clearRect(0,0,width,height);
resultCtx.drawImage(canvas,0,0);
for(const endpoint of allEndpoints){
resultCtx.strokeStyle = endpoint.color;
resultCtx.lineWidth = parseInt(lineWidthSlider.value);
resultCtx.beginPath();
resultCtx.moveTo(endpoint.startX, endpoint.startY);
resultCtx.lineTo(endpoint.endX, endpoint.endY);
resultCtx.stroke();
resultCtx.beginPath();
resultCtx.arc(endpoint.startX, endpoint.startY, 5, 0, 2 * Math.PI);
resultCtx.fillStyle = endpoint.color;
resultCtx.fill();
}
src.delete();
alpha.delete();
channels.delete();
binary.delete();
contours.delete();
hierarchy.delete();
contoursClone.delete();
}catch(e){
log(`エラー: ${e.message}`);
console.error(e);
}
log("=== 処理完了 ===");
}
opencvStatus.style.display='block';
handleControlChange();