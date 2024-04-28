
function flipHorizontally() {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'image') {
		activeObject.set('flipX', !activeObject.flipX);
		canvas.renderAll();
		saveState();
	}
}

function flipVertically() {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'image') {
		activeObject.set('flipY', !activeObject.flipY);
		canvas.renderAll();
		saveState();
	}
}

function cropAndDownload() {
	var cropped = canvas.toDataURL({
		format: 'png',
		multiplier: 3, 
		left: clipAreaCoords.left,
		top: clipAreaCoords.top,
		width: clipAreaCoords.width,
		height: clipAreaCoords.height
	});

	var link = document.createElement('a');
	link.download = 'cropped-image.png';
	link.href = cropped;
	link.click();
}

function allRemove() {
	canvas.clear();
	updateLayerPanel();
	currentImage = null;
	saveState();
}
