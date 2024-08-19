var tmpCanvasC2BW = null;
var tmpCtxC2BW = null;
var controlElementsC2BW = null;
var isDrawingC2BW = false;

async function C2BWStart() {
  glfxReset();

  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "image") {
    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxInk");
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApply();
    }

    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxBrightnessContrast");
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApply();
    }

    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxDotScreen");
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApply();
    }
  }
}



function C2BWEnd() {
  nowEffect = null;
  if( tmpCanvasC2BW ){
    if (tmpCanvasC2BW.parentNode) {
      tmpCanvasC2BW.parentNode.removeChild(tmpCanvasC2BW);
    }
  }
  tmpCanvasC2BW = null;
  tmpCtxC2BW = null;
  controlElementsC2BW = null;
  isDrawingC2BW = false;
}