function attachControlEvents() {
	['angle-control', 'scale-control', 'top-control', 'left-control', 'skewX-control', 'skewY-control', 'opacity-control'].forEach(function(id) {
		document.getElementById(id).oninput = function() {
			var activeObject = canvas.getActiveObject();
			if (!activeObject) return;
			switch (id) {
				case 'angle-control':
					activeObject.set('angle', parseInt(this.value, 10));
					break;
				case 'scale-control':
					activeObject.scale(parseFloat(this.value));
					break;
				case 'top-control':
					activeObject.set('top', parseInt(this.value, 10));
					break;
				case 'left-control':
					activeObject.set('left', parseInt(this.value, 10));
					break;
				case 'skewX-control':
					activeObject.set('skewX', parseInt(this.value, 10));
					break;
				case 'skewY-control':
					activeObject.set('skewY', parseInt(this.value, 10));
					break;
				case 'opacity-control':
					var opacity = this.value/100
					activeObject.set('opacity', opacity);
					break;
			}
			activeObject.setCoords();
			canvas.requestRenderAll();
		};
	});
}
attachControlEvents();

function updateControls(activeObject) {
  if (!activeObject) {
    // 既存のコントロールのデフォルト値を設定
    document.getElementById("angle-control").value = 0;
    document.getElementById("scale-control").value = 1;
    document.getElementById("top-control").value = 0;
    document.getElementById("left-control").value = 0;
    document.getElementById("skewX-control").value = 0;
    document.getElementById("skewY-control").value = 0;
    document.getElementById("opacity-control").value = 1;
    
    document.getElementById("angleValue").innerText = 0.0.toFixed(1);
    document.getElementById("scaleValue").innerText = 1.0.toFixed(2);
    document.getElementById("topValue").innerText = 0.0.toFixed(1);
    document.getElementById("leftValue").innerText = 0.0.toFixed(1);
    document.getElementById("skewXValue").innerText = 0.0.toFixed(1);
    document.getElementById("skewYValue").innerText = 0.0.toFixed(1);
    document.getElementById("opacityValue").innerText = 1.0.toFixed(1)*100;
    
    document.getElementById("sepiaEffect").checked = false;
    document.getElementById("grayscaleEffect").checked = false;
    document.querySelector('input[name="grayscaleMode"][value="average"]').checked = true;
    
    document.getElementById("gammaRed").value = 1.0;
    document.getElementById("gammaGreen").value = 1.0;
    document.getElementById("gammaBlue").value = 1.0;
    document.getElementById("gammaRedValue").innerText = 1.0.toFixed(1);
    document.getElementById("gammaGreenValue").innerText = 1.0.toFixed(1);
    document.getElementById("gammaBlueValue").innerText = 1.0.toFixed(1);
    
    document.getElementById("vibranceValue").value = 0.0;
    document.getElementById("vibranceValueDisplay").innerText = 0.0.toFixed(1);
    
    document.getElementById("blurValue").value = 0.0;
    document.getElementById("blurValueDisplay").innerText = 0.0.toFixed(1);
    
    document.getElementById("pixelateValue").value = 1;
    document.getElementById("pixelateValueDisplay").innerText = 1;

    document.getElementById("glowOutLineSlider").value = 20;
    document.getElementById("glowOutLineColorPicker").value = "#FFFFFF";

    return;
  }

  // 既存のコントロールの値を設定
  document.getElementById("angle-control").value = activeObject.angle || 0;
  document.getElementById("scale-control").value = activeObject.scaleX || 1;
  document.getElementById("top-control").value = activeObject.top || 0;
  document.getElementById("left-control").value = activeObject.left || 0;
  document.getElementById("skewX-control").value = activeObject.skewX || 0;
  document.getElementById("skewY-control").value = activeObject.skewY || 0;
  document.getElementById("opacity-control").value = activeObject.opacity*100 || 100;
  
  document.getElementById("angleValue").innerText = (activeObject.angle || 0).toFixed(1);
  document.getElementById("scaleValue").innerText = (activeObject.scaleX || 1.0).toFixed(2);
  document.getElementById("topValue").innerText = (activeObject.top || 0).toFixed(1);
  document.getElementById("leftValue").innerText = (activeObject.left || 0).toFixed(1);
  document.getElementById("skewXValue").innerText = (activeObject.skewX || 0).toFixed(1);
  document.getElementById("skewYValue").innerText = (activeObject.skewY || 0).toFixed(1);
  document.getElementById("opacityValue").innerText = (activeObject.opacity*100 || 100).toFixed(1);
  
  // 新たに追加されたコントロールの値を設定
  var filters = activeObject.filters || [];
  filters.forEach(function(filter) {
    if (filter.type === 'Sepia') {
      document.getElementById("sepiaEffect").checked = true;
    }
    if (filter.type === 'Grayscale') {
      document.getElementById("grayscaleEffect").checked = true;
      document.querySelector(`input[name="grayscaleMode"][value="${filter.mode}"]`).checked = true;
    }
    if (filter.type === 'Gamma') {
      document.getElementById("gammaRed").value = filter.gamma[0];
      document.getElementById("gammaGreen").value = filter.gamma[1];
      document.getElementById("gammaBlue").value = filter.gamma[2];
      document.getElementById("gammaRedValue").innerText = filter.gamma[0].toFixed(1);
      document.getElementById("gammaGreenValue").innerText = filter.gamma[1].toFixed(1);
      document.getElementById("gammaBlueValue").innerText = filter.gamma[2].toFixed(1);
    }
    if (filter.type === 'Vibrance') {
      document.getElementById("vibranceValue").value = filter.vibrance;
      document.getElementById("vibranceValueDisplay").innerText = filter.vibrance.toFixed(1);
    }
    if (filter.type === 'Blur') {
      document.getElementById("blurValue").value = filter.blur;
      document.getElementById("blurValueDisplay").innerText = filter.blur.toFixed(1);
    }
    if (filter.type === 'Pixelate') {
      document.getElementById("pixelateValue").value = filter.blocksize;
      document.getElementById("pixelateValueDisplay").innerText = filter.blocksize;
    }
  });

  if (activeObject && activeObject.shadow) {
    const shadowColor = activeObject.shadow.color.toString(); 
    console.log( "activeObject.shadow.color", shadowColor );
    document.getElementById('addGlowEffectCheckBox').checked = true;
    document.getElementById('glowOutLineColorPicker').value = shadowColor;
    document.getElementById('glowOutLineSlider').value = activeObject.shadow.blur;
    document.getElementById('glowOutLineValue').innerText = activeObject.shadow.blur;
  } else {
      document.getElementById('addGlowEffectCheckBox').checked = false;
      document.getElementById('glowOutLineColorPicker').value = "#FFFFFF";
      document.getElementById('glowOutLineSlider').value = 20;
      document.getElementById('glowOutLineValue').innerText = 20;
  }
}
