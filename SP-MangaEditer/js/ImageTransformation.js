
function flipHorizontally() {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'image') {
		activeObject.set('flipX', !activeObject.flipX);
		canvas.renderAll();
	}
}

function flipVertically() {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'image') {
		activeObject.set('flipY', !activeObject.flipY);
		canvas.renderAll();
	}
}

function allRemove() {
	canvas.clear();
	updateLayerPanel();
	currentImage = null;
}
