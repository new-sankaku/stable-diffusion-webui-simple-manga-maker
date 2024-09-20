function attachControlEvents() {
	["angle-control", 'scale-control', 'top-control', 'left-control', 'skewX-control', 'skewY-control', 'opacity-control'].forEach(function(id) {
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
    $("angle-control").value = 0;
    $("scale-control").value = 1;
    $("top-control").value = 0;
    $("left-control").value = 0;
    $("skewX-control").value = 0;
    $("skewY-control").value = 0;
    $("opacity-control").value = 1;
    
    $("sepiaEffect").checked = false;
    $("grayscaleEffect").checked = false;
    document.querySelector('input[name="grayscaleMode"][value="average"]').checked = true;
    
    $("gammaRed").value = 1.0;
    $("gammaGreen").value = 1.0;
    $("gammaBlue").value = 1.0;
    
    $("pixelateValue").value = 1;


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
      
    }
    if (filter.type === 'Pixelate') {
      $("pixelateValue").value = filter.blocksize;
    }
  });

}
