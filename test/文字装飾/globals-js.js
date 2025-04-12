const originalCanvas=document.getElementById('originalCanvas');
const dropArea=document.getElementById('drop-area');
const imageInput=document.getElementById('imageInput');
const resultsView=document.getElementById('resultsView');
const cannyThresh1=document.getElementById('cannyThresh1');
const cannyThresh1Value=document.getElementById('cannyThresh1Value');
const cannyThresh2=document.getElementById('cannyThresh2');
const cannyThresh2Value=document.getElementById('cannyThresh2Value');
const houghThreshold=document.getElementById('houghThreshold');
const houghThresholdValue=document.getElementById('houghThresholdValue');
const thinningIterations=document.getElementById('thinningIterations');
const thinningIterationsValue=document.getElementById('thinningIterationsValue');
const brushPressureStrength=document.getElementById('brushPressureStrength');
const brushPressureStrengthValue=document.getElementById('brushPressureStrengthValue');
const densityKernelSize=document.getElementById('densityKernelSize');
const densityKernelSizeValue=document.getElementById('densityKernelSizeValue');
const charSeparationThresh=document.getElementById('charSeparationThresh');
const charSeparationThreshValue=document.getElementById('charSeparationThreshValue');
const contourThreshold=document.getElementById('contourThreshold');
const contourThresholdValue=document.getElementById('contourThresholdValue');
const curveEpsilon=document.getElementById('curveEpsilon');
const curveEpsilonValue=document.getElementById('curveEpsilonValue');
const gaussianBlurSize=document.getElementById('gaussianBlurSize');
const gaussianBlurSizeValue=document.getElementById('gaussianBlurSizeValue');
const edgeDilateIter=document.getElementById('edgeDilateIter');
const edgeDilateIterValue=document.getElementById('edgeDilateIterValue');
const minContourArea=document.getElementById('minContourArea');
const minContourAreaValue=document.getElementById('minContourAreaValue');
const contourMode=document.getElementById('contourMode');
const structElementSize=document.getElementById('structElementSize');
const structElementSizeValue=document.getElementById('structElementSizeValue');
const structElementShape=document.getElementById('structElementShape');
const minLineLength=document.getElementById('minLineLength');
const minLineLengthValue=document.getElementById('minLineLengthValue');
const maxLineGap=document.getElementById('maxLineGap');
const maxLineGapValue=document.getElementById('maxLineGapValue');
const minCurveLength=document.getElementById('minCurveLength');
const minCurveLengthValue=document.getElementById('minCurveLengthValue');
const curveFitMethod=document.getElementById('curveFitMethod');
const distTransformMethod=document.getElementById('distTransformMethod');
const arrowDensity=document.getElementById('arrowDensity');
const arrowDensityValue=document.getElementById('arrowDensityValue');
const gradientThreshold=document.getElementById('gradientThreshold');
const gradientThresholdValue=document.getElementById('gradientThresholdValue');
const densityFilterType=document.getElementById('densityFilterType');
const colorMapType=document.getElementById('colorMapType');
const separationDilateSize=document.getElementById('separationDilateSize');
const separationDilateSizeValue=document.getElementById('separationDilateSizeValue');
let originalMat=null;
let grayMat=null;
let alphaMat=null;
window.isOpenCvReady=false;
let contourInfo=[];
let processFlags={
edges:false,
contours:false,
skeleton:false,
lines:false,
curves:false,
brushPressure:false,
density:false,
separation:false
};