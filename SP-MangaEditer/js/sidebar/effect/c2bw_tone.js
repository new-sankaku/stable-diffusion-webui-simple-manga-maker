function C2BWStartLight(){

  const filterValues = {
    brightness: 0.35,
    contrast: 0.35,
    dotSize: 1.5,
    dotAngle: 0,
    inkStrength: 0.25
  };
  C2BWStart(filterValues);
}
function C2BWStartDark(){
  const filterValues = {
    brightness: 0.22,
    contrast: 0.22,
    dotSize: 1.5,
    dotAngle: 0,
    inkStrength: 0.25
  };
  C2BWStart(filterValues);
}
function C2BWStartRough(){
  const filterValues = {
    brightness: 0.41,
    contrast: 0.41,
    dotSize: 1.5,
    dotAngle: 0.1,
    inkStrength: 0.42
  };
  C2BWStart(filterValues);
}
function C2BWStartSimple(){
  const filterValues = {
    brightness: 0.15,
    contrast: 0.15,
    dotSize: 1.5,
    dotAngle: 0
  };
  C2BWStart(filterValues);
}



async function C2BWStart(filterValues) {
  console.log(filterValues);
  glfxReset();
  
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "image") {

    if( filterValues.inkStrength ){
      glfxOriginalImage = activeObject.getElement();
      await glfxApplyFilterToObject(activeObject, "glfxInk", filterValues);
      if (glfxOriginalImage) {
        glfxCopiedImage = glfxOriginalImage.cloneNode();
        glfxApplyNoReset();
      }
    }

    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxBrightnessContrast", filterValues);
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApplyNoReset();
    }

    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxDotScreen", filterValues);
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApplyNoReset();
    }
  }
}

