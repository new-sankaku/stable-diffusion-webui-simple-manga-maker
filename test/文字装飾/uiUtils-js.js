function updateParameterValue(){
cannyThresh1Value.textContent=cannyThresh1.value;
cannyThresh2Value.textContent=cannyThresh2.value;
houghThresholdValue.textContent=houghThreshold.value;
thinningIterationsValue.textContent=thinningIterations.value;
brushPressureStrengthValue.textContent=brushPressureStrength.value;
densityKernelSizeValue.textContent=densityKernelSize.value;
charSeparationThreshValue.textContent=charSeparationThresh.value;
contourThresholdValue.textContent=contourThreshold.value;
curveEpsilonValue.textContent=curveEpsilon.value;
gaussianBlurSizeValue.textContent=gaussianBlurSize.value;
edgeDilateIterValue.textContent=edgeDilateIter.value;
minContourAreaValue.textContent=minContourArea.value;
structElementSizeValue.textContent=structElementSize.value;
minLineLengthValue.textContent=minLineLength.value;
maxLineGapValue.textContent=maxLineGap.value;
minCurveLengthValue.textContent=minCurveLength.value;
arrowDensityValue.textContent=arrowDensity.value;
gradientThresholdValue.textContent=gradientThreshold.value;
separationDilateSizeValue.textContent=separationDilateSize.value;
}
function createResultCanvas(title,type){
const existingCanvas=document.querySelector(`.result-item[data-title="${title}"] canvas`);
if(existingCanvas){
return existingCanvas;
}
const resultItem=document.createElement('div');
resultItem.className='result-item';
resultItem.setAttribute('data-title',title);
resultItem.setAttribute('data-type',type);
const resultTitle=document.createElement('h4');
resultTitle.textContent=title;
resultItem.appendChild(resultTitle);
const resultCanvas=document.createElement('canvas');
resultCanvas.className='result-canvas';
resultCanvas.width=originalCanvas.width||800;
resultCanvas.height=originalCanvas.height||600;
resultItem.appendChild(resultCanvas);
resultsView.appendChild(resultItem);
return resultCanvas;
}