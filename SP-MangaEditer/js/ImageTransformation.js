
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



function getCropAndDownloadLink() {
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
	return link;
}

function clipCopy() {
	var link = getCropAndDownloadLink();
	fetch(link.href)
	.then(res => res.blob())
	.then(blob => {
			const item = new ClipboardItem({ "image/png": blob });
			navigator.clipboard.write([item]).then(function() {
					console.log('Image copied to clipboard successfully!');
					alert('Image copied to clipboard successfully!');
			}, function(error) {
					console.error('Unable to write to clipboard. Error:', error);
					alert('Failed to copy image to clipboard.');
			});
	});
}

function cropAndDownload() {
	var link = getCropAndDownloadLink();
	link.click();
}

function allRemove() {
	canvas.clear();
	updateLayerPanel();
	currentImage = null;
}
