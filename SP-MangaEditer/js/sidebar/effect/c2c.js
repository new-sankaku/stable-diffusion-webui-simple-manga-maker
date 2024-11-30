

async function C2CStart() {
  const filterValues = {
    brightness: 0.35,
    contrast: 0.35,
    dotSize: 1.5,
    dotAngle: 0,
    inkStrength: 0.25
  };
  glfxReset();

  var activeObject = canvas.getActiveObject();
  let tempObject = null;

  if (isImage(activeObject)) {
    activeObject.clone(function(cloned) {
      cloned.set({
        left: cloned.left,
        top: cloned.top,
        evented: true
      });
      canvas.add(cloned);
      tempObject = cloned;
    });
  }
  
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

  if (activeObject && tempObject) {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    const originalWidth = activeObject.getElement().naturalWidth;
    const originalHeight = activeObject.getElement().naturalHeight;
    
    tempCanvas.width = originalWidth;
    tempCanvas.height = originalHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(activeObject.getElement(), 0, 0, originalWidth, originalHeight);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(tempObject.getElement(), 0, 0, originalWidth, originalHeight);

    const dataURL = tempCanvas.toDataURL('image/png', 1.0);
    
    

    fabric.Image.fromURL(dataURL, function(newImage) {
      newImage.set({
        left: activeObject.left,
        top: activeObject.top,
        scaleX: activeObject.scaleX,
        scaleY: activeObject.scaleY
      });

      copy(activeObject, newImage);

      newImage.set({
        objectCaching: false,
        imageSmoothing: true
      });

      canvas.remove(activeObject);
      canvas.remove(tempObject);
      canvas.add(newImage);
      canvas.setActiveObject(newImage);
      canvas.renderAll();
    });
  }
}

