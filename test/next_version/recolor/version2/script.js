var refImgObj=null,procImgObjs=[];
var sliderTimeout;
var refDrop=$("refDrop");
var procDrop=$("procDrop");
function preventDefaults(e){
e.preventDefault();
e.stopPropagation()
}
function handleDrop(e,callback){
e.preventDefault();
e.stopPropagation();
var file=e.dataTransfer.files[0];
if(file){
var reader=new FileReader();
reader.onload=function(event){
var img=new Image();
img.onload=function(){
callback(img)
};
img.src=event.target.result
};
reader.readAsDataURL(file)
}
}
function findConnectedComponents(mask,width,height,minSize){
var labels=new Array(mask.length).fill(-1);
var label=0;
var equivalences={};
for(var y=0;y<height;y++){
for(var x=0;x<width;x++){
var i=y*width+x;
if(!mask[i])continue;
var neighbors=[];
if(x>0&&mask[i-1])neighbors.push(labels[i-1]);
if(y>0&&mask[i-width])neighbors.push(labels[i-width]);
if(neighbors.length===0){
labels[i]=label++;
}else{
var minLabel=Math.min(...neighbors.filter(n=>n!==-1));
labels[i]=minLabel;
for(var n of neighbors){
if(n!==-1&&n!==minLabel){
if(!equivalences[n])equivalences[n]=new Set();
equivalences[n].add(minLabel);
if(!equivalences[minLabel])equivalences[minLabel]=new Set();
equivalences[minLabel].add(n)
}
}
}
}
}
for(var i=0;i<labels.length;i++){
if(labels[i]===-1)continue;
var stack=[labels[i]];
var minLabel=labels[i];
while(stack.length>0){
var l=stack.pop();
if(equivalences[l]){
for(var eq of equivalences[l]){
if(eq<minLabel){
minLabel=eq;
stack.push(eq)
}
}
}
}
labels[i]=minLabel
}
var components={};
for(var i=0;i<labels.length;i++){
if(labels[i]===-1)continue;
if(!components[labels[i]])components[labels[i]]=0;
components[labels[i]]++
}
var validLabels=new Set(Object.entries(components).filter(([label,size])=>size>=minSize).map(([label])=>Number(label)));
var filteredMask=mask.slice();
for(var i=0;i<labels.length;i++){
if(labels[i]!==-1&&!validLabels.has(labels[i])){
filteredMask[i]=false
}
}
return filteredMask
}
function calculateColorDistance(color1,color2){
var l1=color1.l,l2=color2.l;
var s1=color1.s,s2=color2.s;
var dl=l1-l2;
var ds=s1-s2;
return Math.sqrt(dl*dl+ds*ds)
}
function groupSimilarColors(pixels,threshold){
var groups=[];
for(var i=0;i<pixels.length;i++){
var pixel=pixels[i];
var foundGroup=false;
for(var j=0;j<groups.length;j++){
var group=groups[j];
var distance=calculateColorDistance(pixel,group.representative);
if(distance<threshold){
group.pixels.push(pixel);
group.totalL+=pixel.l;
group.totalS+=pixel.s;
group.count++;
group.representative.l=group.totalL/group.count;
group.representative.s=group.totalS/group.count;
foundGroup=true;
break
}
}
if(!foundGroup){
groups.push({
pixels:[pixel],
representative:{l:pixel.l,s:pixel.s},
totalL:pixel.l,
totalS:pixel.s,
count:1
})
}
}
return groups
}
function processImages(){
if(!refImgObj||procImgObjs.length===0)return;
var hueMin=Number(hueMinSlider.value)/100;
var hueMax=Number(hueMaxSlider.value)/100;
var satMin=Number(satMinSlider.value)/100;
var satMax=Number(satMaxSlider.value)/100;
var lumMin=Number(lumMinSlider.value)/100;
var lumMax=Number(lumMaxSlider.value)/100;
var minSize=Number($("minSize").value);
var refCanvas=$("refCanvas");
refCanvas.width=refImgObj.width;
refCanvas.height=refImgObj.height;
var refCtx=refCanvas.getContext("2d",{willReadFrequently:false});
refCtx.drawImage(refImgObj,0,0);
var refData=refCtx.getImageData(0,0,refCanvas.width,refCanvas.height);
var refGreens=[];
var refMask=new Array(refData.data.length/4).fill(false);
for(var i=0;i<refData.data.length;i+=4){
var r=refData.data[i],g=refData.data[i+1],b=refData.data[i+2];
var hsl=rgbToHsl(r,g,b);
if(hsl.h>=hueMin&&hsl.h<=hueMax&&hsl.s>=satMin&&hsl.s<=satMax&&hsl.l>=lumMin&&hsl.l<=lumMax){
refGreens.push({index:i,r:r,g:g,b:b,l:hsl.l,s:hsl.s});
refMask[i/4]=true
}
}
refMask=findConnectedComponents(refMask,refCanvas.width,refCanvas.height,minSize);
refGreens=refGreens.filter(pixel=>refMask[pixel.index/4]);
refGreens.sort(function(a,b){return a.l===b.l?a.s-b.s:a.l-b.l});
var greenCanvas=$("greenCanvas");
greenCanvas.width=refImgObj.width/2;
greenCanvas.height=refImgObj.height/2;
var greenCtx=greenCanvas.getContext("2d",{willReadFrequently:false});
greenCtx.clearRect(0,0,greenCanvas.width,greenCanvas.height);
if(refGreens.length>0){
var sortedGreens=refGreens.slice().sort(function(a,b){return b.l-a.l});
var num=sortedGreens.length;
var cols=Math.ceil(Math.sqrt(num));
var rows=Math.ceil(num/cols);
var cellWidth=greenCanvas.width/cols;
var cellHeight=greenCanvas.height/rows;
for(var i=0;i<num;i++){
var col=i%cols;
var row=Math.floor(i/cols);
var color=sortedGreens[i];
greenCtx.fillStyle="rgb("+color.r+","+color.g+","+color.b+")";
greenCtx.fillRect(col*cellWidth,row*cellHeight,cellWidth,cellHeight)
}
}
var tempCanvas=document.createElement("canvas");
tempCanvas.width=refImgObj.width;
tempCanvas.height=refImgObj.height;
var tempCtx=tempCanvas.getContext("2d",{willReadFrequently:false});
var maskData=tempCtx.createImageData(refImgObj.width,refImgObj.height);
for(var i=0;i<maskData.data.length;i+=4){
maskData.data[i]=0;
maskData.data[i+1]=0;
maskData.data[i+2]=0;
maskData.data[i+3]=255
}
for(var i=0;i<refGreens.length;i++){
var idx=refGreens[i].index;
maskData.data[idx]=255;
maskData.data[idx+1]=255;
maskData.data[idx+2]=255
}
tempCtx.putImageData(maskData,0,0);
var detectedCanvas=$("detectedCanvas");
detectedCanvas.width=refImgObj.width/2;
detectedCanvas.height=refImgObj.height/2;
var detectedCtx=detectedCanvas.getContext("2d",{willReadFrequently:false});
detectedCtx.clearRect(0,0,detectedCanvas.width,detectedCanvas.height);
detectedCtx.drawImage(tempCanvas,0,0,detectedCanvas.width,detectedCanvas.height);
var resultsContainer=$("resultsContainer");
resultsContainer.innerHTML="";
procImgObjs.forEach(function(procImg,index){
var procCanvas=document.createElement("canvas");
procCanvas.width=procImg.width;
procCanvas.height=procImg.height;
var procCtx=procCanvas.getContext("2d",{willReadFrequently:false});
procCtx.drawImage(procImg,0,0);
var procData=procCtx.getImageData(0,0,procCanvas.width,procCanvas.height);
var originalProcData=new Uint8ClampedArray(procData.data);
var procGreens=[];
var procMask=new Array(procData.data.length/4).fill(false);
for(var i=0;i<procData.data.length;i+=4){
var r=procData.data[i],g=procData.data[i+1],b=procData.data[i+2];
var hsl=rgbToHsl(r,g,b);
if(hsl.h>=hueMin&&hsl.h<=hueMax&&hsl.s>=satMin&&hsl.s<=satMax&&hsl.l>=lumMin&&hsl.l<=lumMax){
procGreens.push({index:i,r:r,g:g,b:b,l:hsl.l,s:hsl.s});
procMask[i/4]=true
}
}
procMask=findConnectedComponents(procMask,procCanvas.width,procCanvas.height,minSize);
procGreens=procGreens.filter(pixel=>procMask[pixel.index/4]);
procGreens.sort(function(a,b){return a.l===b.l?a.s-b.s:a.l-b.l});
if(refGreens.length===0||procGreens.length===0)return;
var colorGroups=groupSimilarColors(procGreens,0.1);
colorGroups.sort(function(a,b){
return a.representative.l-b.representative.l
});
var refPerGroup=Math.ceil(refGreens.length/colorGroups.length);
var refIndex=0;
for(var i=0;i<colorGroups.length;i++){
var group=colorGroups[i];
var refStart=refIndex;
var refEnd=Math.min(refStart+refPerGroup,refGreens.length);
var refColorsForGroup=refGreens.slice(refStart,refEnd);
if(refColorsForGroup.length>0){
var refColor=refColorsForGroup[0];
group.pixels.forEach(function(pixel){
var idx=pixel.index;
procData.data[idx]=refColor.r;
procData.data[idx+1]=refColor.g;
procData.data[idx+2]=refColor.b
})
}
refIndex=refEnd
}
smoothReplacedArea(procData,createMask(procData.data,originalProcData),procCanvas.width,procCanvas.height);
procCtx.putImageData(procData,0,0);
var resultDataUrl=procCanvas.toDataURL('image/png',1.0);
var diffCanvas=document.createElement("canvas");
diffCanvas.width=procCanvas.width;
diffCanvas.height=procCanvas.height;
var diffCtx=diffCanvas.getContext("2d",{willReadFrequently:false});
var diffImage=diffCtx.createImageData(diffCanvas.width,diffCanvas.height);
for(var i=0;i<procData.data.length;i+=4){
if(procData.data[i]!==originalProcData[i]||procData.data[i+1]!==originalProcData[i+1]||procData.data[i+2]!==originalProcData[i+2]){
diffImage.data[i]=255;
diffImage.data[i+1]=255;
diffImage.data[i+2]=255;
diffImage.data[i+3]=255
}else{
diffImage.data[i]=0;
diffImage.data[i+1]=0;
diffImage.data[i+2]=0;
diffImage.data[i+3]=255
}
}
diffCtx.putImageData(diffImage,0,0);
var resultRow=document.createElement("div");
resultRow.className="resultRow";
var divOriginal=document.createElement("div");
var h3Original=document.createElement("h3");
h3Original.textContent="処理前画像";
divOriginal.appendChild(h3Original);
var origImg=document.createElement("img");
origImg.src=procImg.src;
origImg.alt="処理前画像"+(index+1);
divOriginal.appendChild(origImg);
var divProcessed=document.createElement("div");
var h3Processed=document.createElement("h3");
h3Processed.textContent="処理後画像"+(index+1);
divProcessed.appendChild(h3Processed);
var procImgEl=document.createElement("img");
procImgEl.src=resultDataUrl;
procImgEl.alt="処理後画像"+(index+1);
procImgEl.className="processedImage";
divProcessed.appendChild(procImgEl);
var divDiff=document.createElement("div");
var h3Diff=document.createElement("h3");
h3Diff.textContent="差分画像 (変更部分: 白)"+(index+1);
divDiff.appendChild(h3Diff);
divDiff.appendChild(diffCanvas);
resultRow.appendChild(divOriginal);
resultRow.appendChild(divProcessed);
resultRow.appendChild(divDiff);
resultsContainer.appendChild(resultRow)
})
}
function createMask(data,originalData){
var mask=new Array(data.length/4).fill(false);
for(var i=0;i<data.length;i+=4){
if(data[i]!==originalData[i]||data[i+1]!==originalData[i+1]||data[i+2]!==originalData[i+2]){
mask[i/4]=true
}
}
return mask
}
function smoothReplacedArea(imageData,mask,width,height){
var data=imageData.data;
var newData=new Uint8ClampedArray(data.length);
newData.set(data);
for(var y=0;y<height;y++){
for(var x=0;x<width;x++){
var idx=y*width+x;
var apply=false;
if(mask[idx]){
apply=true
}else{
for(var j=-1;j<=1;j++){
for(var i=-1;i<=1;i++){
var nx=x+i,ny=y+j;
if(nx>=0&&nx<width&&ny>=0&&ny<height){
if(mask[ny*width+nx]){
apply=true;
break
}
}
}
if(apply)break
}
}
if(apply){
var sumR=0,sumG=0,sumB=0,cnt=0;
for(var j=-1;j<=1;j++){
for(var i=-1;i<=1;i++){
var nx=x+i,ny=y+j;
if(nx>=0&&nx<width&&ny>=0&&ny<height){
var nidx=(ny*width+nx)*4;
sumR+=data[nidx];
sumG+=data[nidx+1];
sumB+=data[nidx+2];
cnt++
}
}
}
var offset=idx*4;
newData[offset]=sumR/cnt;
newData[offset+1]=sumG/cnt;
newData[offset+2]=sumB/cnt
}
}
}
for(var i=0;i<data.length;i++){
data[i]=newData[i]
}
return imageData
}
function rgbToHsl(r,g,b){
r/=255;
g/=255;
b/=255;
var max=Math.max(r,g,b),min=Math.min(r,g,b);
var h,s,l=(max+min)/2;
if(max===min){
h=s=0
}else{
var d=max-min;
s=l>0.5?d/(2-max-min):d/(max+min);
if(max===r){
h=(g-b)/d+(g<b?6:0)
}else if(max===g){
h=(b-r)/d+2
}else{
h=(r-g)/d+4
}
h/=6
}
return{h:h,s:s,l:l}
}
function updateHueRange(){
const min=Number(hueMinSlider.value);
const max=Number(hueMaxSlider.value);
const range=document.querySelector(".slider-selected-range");
range.style.left=min+"%";
range.style.width=max-min+"%"
}