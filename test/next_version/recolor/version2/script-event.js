var hueMinSlider=$("hueMin");
var hueMaxSlider=$("hueMax");
var satMinSlider=$("satMin");
var satMaxSlider=$("satMax");
var lumMinSlider=$("lumMin");
var lumMaxSlider=$("lumMax");
var minSizeSlider=$("minSize");
function updateSliderRange(slider,overlayClass){
var min=Number($(slider+"Min").value);
var max=Number($(slider+"Max").value);
var range=document.querySelector(overlayClass+" .slider-selected-range");
range.style.left=min+"%";
range.style.width=(max-min)+"%"
}
function handleSliderInput(slider,value){
var val=Number(value)/100;
$(slider+"Val").textContent=val.toFixed(2)+" ("+(slider==="hue"?(val*360).toFixed(0)+"°":(val*100).toFixed(0)+"%")+")";
clearTimeout(sliderTimeout);
sliderTimeout=setTimeout(processImages,300)
}
function handleMinSizeInput(value){
$("minSizeVal").textContent=value+" px";
clearTimeout(sliderTimeout);
sliderTimeout=setTimeout(processImages,300)
}
on(refDrop,"dragenter",preventDefaults);
on(refDrop,"dragover",preventDefaults);
on(refDrop,"dragleave",preventDefaults);
on(refDrop,"drop",function(e){handleDrop(e,function(img){refImgObj=img;$("refImgDisplay").src=img.src;refDrop.textContent="参照画像読み込み完了";processImages()})});
on(procDrop,"dragenter",preventDefaults);
on(procDrop,"dragover",preventDefaults);
on(procDrop,"dragleave",preventDefaults);
on(procDrop,"drop",function(e){e.preventDefault();e.stopPropagation();var files=e.dataTransfer.files;for(var j=0;j<files.length;j++){(function(file){var reader=new FileReader();reader.onload=function(event){var img=new Image();img.onload=function(){procImgObjs.push(img);processImages()};img.src=event.target.result};reader.readAsDataURL(file)})(files[j])}procDrop.textContent="処理画像読み込み完了"});
on(hueMinSlider,"input",function(){var min=Number(this.value);var max=Number(hueMaxSlider.value);if(min>max){this.value=max;return}handleSliderInput("hueMin",this.value);updateSliderRange("hue",".hue-slider-container")});
on(hueMaxSlider,"input",function(){var min=Number(hueMinSlider.value);var max=Number(this.value);if(max<min){this.value=min;return}handleSliderInput("hueMax",this.value);updateSliderRange("hue",".hue-slider-container")});
on(satMinSlider,"input",function(){var min=Number(this.value);var max=Number(satMaxSlider.value);if(min>max){this.value=max;return}handleSliderInput("satMin",this.value);updateSliderRange("sat",".sat-slider-container")});
on(satMaxSlider,"input",function(){var min=Number(satMinSlider.value);var max=Number(this.value);if(max<min){this.value=min;return}handleSliderInput("satMax",this.value);updateSliderRange("sat",".sat-slider-container")});
on(lumMinSlider,"input",function(){var min=Number(this.value);var max=Number(lumMaxSlider.value);if(min>max){this.value=max;return}handleSliderInput("lumMin",this.value);updateSliderRange("lum",".lum-slider-container")});
on(lumMaxSlider,"input",function(){var min=Number(lumMinSlider.value);var max=Number(this.value);if(max<min){this.value=min;return}handleSliderInput("lumMax",this.value);updateSliderRange("lum",".lum-slider-container")});
on(minSizeSlider,"input",function(){handleMinSizeInput(this.value)});
on($("downloadBtn"),"click",function(){var images=document.getElementsByClassName("processedImage");if(images.length===0)return;for(var i=0;i<images.length;i++){var link=document.createElement("a");link.href=images[i].src;link.download="processed"+(i+1)+".png";document.body.appendChild(link);link.click();document.body.removeChild(link)}});
updateSliderRange("hue",".hue-slider-container");
updateSliderRange("sat",".sat-slider-container");
updateSliderRange("lum",".lum-slider-container");