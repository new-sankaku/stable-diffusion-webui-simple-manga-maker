const colorUtils = `
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;let h,s,l=(M+m)/2;if(d){s=l>.5?d/(2-M-m):d/(M+m);switch(M){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4}h/=6}else h=s=0;return[h*360,s*100,l*100]}
function hslToRgb(h,s,l){h/=360;s/=100;l/=100;const f=n=>{const k=(n+h*12)%12;return l-s*Math.min(l,1-l)*Math.max(-1,Math.min(k-3,9-k,1))};return[f(0)*255,f(8)*255,f(4)*255]}
`;
const worker = new Worker(URL.createObjectURL(new Blob([`
${colorUtils}
function getConnectedPixels(mask, width, height, x, y, visited) {
const stack = [[x, y]];
let count = 0;
const connected = new Set();
let minX = x, maxX = x, minY = y, maxY = y;
while (stack.length > 0) {
const [cx, cy] = stack.pop();
const idx = (cy * width + cx) * 4;
if (visited.has(idx)) continue;
visited.add(idx);
if (mask[idx] === 0) continue;
count++;
connected.add(idx);
minX = Math.min(minX, cx);
maxX = Math.max(maxX, cx);
minY = Math.min(minY, cy);
maxY = Math.max(maxY, cy);
const directNeighbors = [
[cx-1, cy],
[cx+1, cy],
[cx, cy-1],
[cx, cy+1]
];
for (const [nx, ny] of directNeighbors) {
if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
const nidx = (ny * width + nx) * 4;
if (!visited.has(nidx) && mask[nidx] > 0) {
stack.push([nx, ny]);
}
}
}
const diagonalNeighbors = [
[cx-1, cy-1, cx-1, cy, cx, cy-1],
[cx+1, cy-1, cx+1, cy, cx, cy-1],
[cx-1, cy+1, cx-1, cy, cx, cy+1],
[cx+1, cy+1, cx+1, cy, cx, cy+1]
];
for (const [nx, ny, ax1, ay1, ax2, ay2] of diagonalNeighbors) {
if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
const nidx = (ny * width + nx) * 4;
const adj1 = ((ay1 * width + ax1) * 4);
const adj2 = ((ay2 * width + ax2) * 4);
if (!visited.has(nidx) && mask[nidx] > 0 && 
(mask[adj1] > 0 || mask[adj2] > 0)) {
stack.push([nx, ny]);
}
}
}
}
const width_region = maxX - minX + 1;
const height_region = maxY - minY + 1;
const density = count / (width_region * height_region);
return { 
count,
connected,
density,
width: width_region,
height: height_region
};
}
onmessage=e=>{
const{imgData,originalData,params}=e.data;
const d=imgData.data;
const od=originalData.data;
const width = imgData.width;
const height = imgData.height;
const newColor=params.color;
const baseColor = newColor;
const modifiedPixels = new Uint8ClampedArray(d.length);
const tempMask = new Uint8ClampedArray(d.length);
for(let i=0;i<d.length;i+=4){
const[h,s,l]=rgbToHsl(d[i],d[i+1],d[i+2]);
let hue=h;
let isInHueRange = false;
if(params.hueMin <= params.hueMax) {
isInHueRange = hue >= params.hueMin && hue <= params.hueMax;
} else {
isInHueRange = hue >= params.hueMin || hue <= params.hueMax;
}
if(isInHueRange && s>=params.satMin && s<=params.satMax && l>=params.lightMin && l<=params.lightMax){
tempMask[i]=tempMask[i+1]=tempMask[i+2]=255;
} else {
tempMask[i]=tempMask[i+1]=tempMask[i+2]=0;
}
tempMask[i+3]=255;
}
const visited = new Set();
const minPixels = params.blend;
for(let y = 0; y < height; y++) {
for(let x = 0; x < width; x++) {
const idx = (y * width + x) * 4;
if(!visited.has(idx) && tempMask[idx] > 0) {
const {count, connected, density} = getConnectedPixels(tempMask, width, height, x, y, visited);
if(count < minPixels || (density < 0.3 && count < minPixels * 2)) {
for(const pidx of connected) {
tempMask[pidx] = tempMask[pidx+1] = tempMask[pidx+2] = 0;
}
}
}
}
}
for(let i = 0; i < d.length; i += 4) {
if(tempMask[i] > 0) {
const[h,s,l] = rgbToHsl(od[i],od[i+1],od[i+2]);
const relativeSaturation = s / 100;
const relativeLightness = l / 100;
const newH = baseColor.h;
const newS = baseColor.s * relativeSaturation;
const newL = baseColor.l * relativeLightness;
const rgb = hslToRgb(newH, newS, newL);
d[i] = rgb[0];
d[i+1] = rgb[1];
d[i+2] = rgb[2];
modifiedPixels[i] = modifiedPixels[i+1] = modifiedPixels[i+2] = 255;
}
modifiedPixels[i+3] = 255;
}
postMessage({
imgData,
modifiedPixels: new ImageData(modifiedPixels, imgData.width, imgData.height),
imageId: e.data.imageId
});
}`], { type: 'text/javascript' })));
eval(colorUtils);