
function attachControlEvents() {
	['angle-control', 'scale-control', 'top-control', 'left-control', 'skewX-control', 'skewY-control'].forEach(function(id) {
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
			}
			activeObject.setCoords();
			canvas.requestRenderAll();
			
		};
	});
}
attachControlEvents();  