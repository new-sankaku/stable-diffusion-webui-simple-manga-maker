
async function C2BWStart() {
  glfxReset();

  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "image") {
    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxInk");
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApplyNoReset();
    }

    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxBrightnessContrast");
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApplyNoReset();
    }

    glfxOriginalImage = activeObject.getElement();
    await glfxApplyFilterToObject(activeObject, "glfxDotScreen");
    if (glfxOriginalImage) {
      glfxCopiedImage = glfxOriginalImage.cloneNode();
      glfxApplyNoReset();
    }
  }
}

