function processAll(){
if(!window.isOpenCvReady||!originalMat){
return;
}
if(!document.querySelector('.result-item')){
initializeResultCanvases();
}
processNextTask();
}
function processNextTask(){
let processed=false;
let startTime;
let endTime;
if(processFlags.edges){
try{
startTime=performance.now();
detectEdges();
endTime=performance.now();
processFlags.edges=false;
processed=true;
}catch(err){
processFlags.edges=false;
}
}else if(processFlags.contours){
try{
startTime=performance.now();
detectContours();
endTime=performance.now();
processFlags.contours=false;
processed=true;
}catch(err){
processFlags.contours=false;
}
}else if(processFlags.skeleton){
try{
startTime=performance.now();
skeletonize();
endTime=performance.now();
processFlags.skeleton=false;
processed=true;
}catch(err){
processFlags.skeleton=false;
}
}else if(processFlags.lines){
try{
startTime=performance.now();
detectLineSegments();
endTime=performance.now();
processFlags.lines=false;
processed=true;
}catch(err){
processFlags.lines=false;
}
}else if(processFlags.curves){
try{
startTime=performance.now();
detectCurves();
endTime=performance.now();
processFlags.curves=false;
processed=true;
}catch(err){
processFlags.curves=false;
}
}else if(processFlags.brushPressure){
try{
startTime=performance.now();
simulateBrushPressure();
endTime=performance.now();
processFlags.brushPressure=false;
processed=true;
}catch(err){
processFlags.brushPressure=false;
}
}else if(processFlags.density){
try{
startTime=performance.now();
generateDensityMap();
endTime=performance.now();
processFlags.density=false;
processed=true;
}catch(err){
processFlags.density=false;
}
}else if(processFlags.separation){
try{
startTime=performance.now();
separateCharacters();
endTime=performance.now();
processFlags.separation=false;
processed=true;
}catch(err){
processFlags.separation=false;
}
}
if(processed){
requestAnimationFrame(processNextTask);
}else{
const finishTime=performance.now();
}
}