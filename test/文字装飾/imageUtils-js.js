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
function loadImage(src){
if(!window.isOpenCvReady){
return;
}
const loadStart=performance.now();
const img=new Image();
img.onload=function(){
originalCanvas.width=img.width;
originalCanvas.height=img.height;
const ctx=originalCanvas.getContext('2d');
ctx.clearRect(0,0,originalCanvas.width,originalCanvas.height);
ctx.drawImage(img,0,0);
try{
const matStart=performance.now();
if(originalMat)originalMat.delete();
originalMat=cv.imread(originalCanvas);
extractAlphaAndGray();
console.log("抽出前の画像サイズ:", originalMat.rows, "x", originalMat.cols);
console.log("アルファチャンネルピクセル数:", countNonZeroAlpha(alphaMat));
Object.keys(processFlags).forEach(key=>processFlags[key]=true);
updateResultCanvasSizes();
processAll();
}catch(err){
console.error("画像処理エラー:", err.message);
}
};
img.onerror=function(){
console.error("画像読み込みエラー");
};
img.src=src;
}
function extractAlphaAndGray(){
try{
if(grayMat)grayMat.delete();
if(alphaMat)alphaMat.delete();
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
}else{
return;
}
console.log("抽出されたアルファチャンネルのサイズ:", alphaMat.rows, "x", alphaMat.cols);
console.log("非ゼロピクセル数:", countNonZeroAlpha(alphaMat));
for(let i=0;i<channels.size();++i){
channels.get(i).delete();
}
channels.delete();
}catch(err){
throw err;
}
}
function countNonZeroAlpha(mat){
let count=0;
for(let y=0;y<mat.rows;y++){
for(let x=0;x<mat.cols;x++){
if(mat.ucharPtr(y,x)[0]>0){
count++;
}
}
}
return count;
}
function preprocessImageForLineDetection(){
try{
if(!alphaMat)return;
let tempAlpha=alphaMat.clone();
let originalNonZero=countNonZeroAlpha(tempAlpha);
console.log("前処理前の非ゼロピクセル数:", originalNonZero);
// 前処理をスキップ - モーフォロジー処理が文字の連結を引き起こしているため
alphaMat=tempAlpha.clone();
tempAlpha.delete();
console.log("前処理後の非ゼロピクセル数:", countNonZeroAlpha(alphaMat));
console.log("前処理をスキップしました - 文字の連結を防止するため");
}catch(err){
throw err;
}
}
function updateResultCanvasSizes(){
const canvases=document.querySelectorAll('.result-canvas');
canvases.forEach(canvas=>{
canvas.width=originalCanvas.width;
canvas.height=originalCanvas.height;
});
}