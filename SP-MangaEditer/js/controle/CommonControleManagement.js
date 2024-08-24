function attachControlEvents() {
	['angle-control', 'scale-control', 'top-control', 'left-control', 'skewX-control', 'skewY-control', 'opacity-control'].forEach(function(id) {
		$(id).oninput = function() {
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
document.addEventListener('DOMContentLoaded', function() {
  attachControlEvents();
});


function updateControls(activeObject) {
  if (!activeObject) {
    // 既存のコントロールのデフォルト値を設定
    $("angle-control").value = 0;
    $("scale-control").value = 1;
    $("top-control").value = 0;
    $("left-control").value = 0;
    $("skewX-control").value = 0;
    $("skewY-control").value = 0;
    $("opacity-control").value = 1;
    
    $("angleValue").innerText = 0.0.toFixed(1);
    $("scaleValue").innerText = 1.0.toFixed(2);
    $("topValue").innerText = 0.0.toFixed(1);
    $("leftValue").innerText = 0.0.toFixed(1);
    $("skewXValue").innerText = 0.0.toFixed(1);
    $("skewYValue").innerText = 0.0.toFixed(1);
    $("opacityValue").innerText = 1.0.toFixed(1)*100;
    
    $("sepiaEffect").checked = false;
    $("grayscaleEffect").checked = false;
    document.querySelector('input[name="grayscaleMode"][value="average"]').checked = true;
    
    $("gammaRed").value = 1.0;
    $("gammaGreen").value = 1.0;
    $("gammaBlue").value = 1.0;
    $("gammaRedValue").innerText = 1.0.toFixed(1);
    $("gammaGreenValue").innerText = 1.0.toFixed(1);
    $("gammaBlueValue").innerText = 1.0.toFixed(1);
    
    $("vibranceValue").value = 0.0;
    $("vibranceValueDisplay").innerText = 0.0.toFixed(1);
    
    $("blurValue").value = 0.0;
    $("blurValueDisplay").innerText = 0.0.toFixed(1);
    
    $("pixelateValue").value = 1;
    $("pixelateValueDisplay").innerText = 1;

    $("glowOutLineSlider").value = 20;
    $("glowOutLineColorPicker").value = "#FFFFFF";

    return;
  }

  // 既存のコントロールの値を設定
  $("angle-control").value = activeObject.angle || 0;
  $("scale-control").value = activeObject.scaleX || 1;
  $("top-control").value = activeObject.top || 0;
  $("left-control").value = activeObject.left || 0;
  $("skewX-control").value = activeObject.skewX || 0;
  $("skewY-control").value = activeObject.skewY || 0;
  $("opacity-control").value = activeObject.opacity*100 || 100;
  
  $("angleValue").innerText = (activeObject.angle || 0).toFixed(1);
  $("scaleValue").innerText = (activeObject.scaleX || 1.0).toFixed(2);
  $("topValue").innerText = (activeObject.top || 0).toFixed(1);
  $("leftValue").innerText = (activeObject.left || 0).toFixed(1);
  $("skewXValue").innerText = (activeObject.skewX || 0).toFixed(1);
  $("skewYValue").innerText = (activeObject.skewY || 0).toFixed(1);
  $("opacityValue").innerText = (activeObject.opacity*100 || 100).toFixed(1);
  
  // 新たに追加されたコントロールの値を設定
  var filters = activeObject.filters || [];
  filters.forEach(function(filter) {
    if (filter.type === 'Sepia') {
      $("sepiaEffect").checked = true;
    }
    if (filter.type === 'Grayscale') {
      $("grayscaleEffect").checked = true;
      document.querySelector(`input[name="grayscaleMode"][value="${filter.mode}"]`).checked = true;
    }
    if (filter.type === 'Gamma') {
      $("gammaRed").value = filter.gamma[0];
      $("gammaGreen").value = filter.gamma[1];
      $("gammaBlue").value = filter.gamma[2];
      $("gammaRedValue").innerText = filter.gamma[0].toFixed(1);
      $("gammaGreenValue").innerText = filter.gamma[1].toFixed(1);
      $("gammaBlueValue").innerText = filter.gamma[2].toFixed(1);
    }
    if (filter.type === 'Vibrance') {
      $("vibranceValue").value = filter.vibrance;
      $("vibranceValueDisplay").innerText = filter.vibrance.toFixed(1);
    }
    if (filter.type === 'Blur') {
      $("blurValue").value = filter.blur;
      $("blurValueDisplay").innerText = filter.blur.toFixed(1);
    }
    if (filter.type === 'Pixelate') {
      $("pixelateValue").value = filter.blocksize;
      $("pixelateValueDisplay").innerText = filter.blocksize;
    }
  });

  if (activeObject && activeObject.shadow) {
    const shadowColor = activeObject.shadow.color.toString(); 
    // console.log( "activeObject.shadow.color", shadowColor );
    $('addGlowEffectCheckBox').checked = true;
    $('glowOutLineColorPicker').value = shadowColor;
    $('glowOutLineSlider').value = activeObject.shadow.blur;
    $('glowOutLineValue').innerText = activeObject.shadow.blur;
  } else {
      $('addGlowEffectCheckBox').checked = false;
      $('glowOutLineColorPicker').value = "#FFFFFF";
      $('glowOutLineSlider').value = 20;
      $('glowOutLineValue').innerText = 20;
  }
}
