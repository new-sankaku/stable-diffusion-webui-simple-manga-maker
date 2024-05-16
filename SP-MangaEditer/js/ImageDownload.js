


function getCropAndDownloadLink() {
	var strokeWidth = document.getElementById("strokeWidth").value;
	var newMultiplierImageSize = parseFloat(document.getElementById('multiplierImageSize').value);
	var cropped = canvas.toDataURL({
		format: 'png',
		multiplier: newMultiplierImageSize, 
		left: clipAreaCoords.left,
		top: clipAreaCoords.top,
		width: clipAreaCoords.width - (strokeWidth/2),
		height: clipAreaCoords.height - (strokeWidth/2)
	});

	var link = document.createElement('a');
	link.download = 'cropped-image.png';
	link.href = cropped;
	return link;
}

function clipCopy() {
	removeGrid();
	var link = getCropAndDownloadLink();
	fetch(link.href)
	.then(res => res.blob())
	.then(blob => {
			const item = new ClipboardItem({ "image/png": blob });
			navigator.clipboard.write([item]).then(function() {
                createToast("Success", "Image copied to clipboard successfully!");
			}, function(error) {
                createErrorToast("Error", "Unable to write to clipboard. Error");
			});
	});
	if (isGridVisible) {
		drawGrid();
		isGridVisible = true;
	}
}

function cropAndDownload() {
	removeGrid();
	var link = getCropAndDownloadLink();
	link.click();
	if (isGridVisible) {
		drawGrid();
		isGridVisible = true;
	}
}




// Exportサイズの変更。
function updateMultiplierImageSize() {
  var newMultiplierImageSize = parseFloat(document.getElementById('multiplierImageSize').value);
  const canvasWidth  = Math.floor(canvas.width  * newMultiplierImageSize);
	const canvasHeight = Math.floor(canvas.height * newMultiplierImageSize);
  document.getElementById('outputImageSizeHeight').textContent = 'H' + canvasHeight;
  document.getElementById('outputImageSizeWidth').textContent  = 'W' + canvasWidth;
}
document.getElementById('multiplierImageSize').addEventListener('input', updateMultiplierImageSize);
updateMultiplierImageSize();