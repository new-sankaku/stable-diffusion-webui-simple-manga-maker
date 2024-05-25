
function getCropAndDownloadLinkByMultiplier( multiplier, format ) {

	var cropped = canvas.toDataURL({ 
		format: format, 
		multiplier: multiplier });

	var link = document.createElement('a');
	link.download = 'cropped-image.png';
	link.href = cropped;
	return link;
}

function getCropAndDownloadLink() {
	var a5WidthInches = 148 / 25.4;
	var a5HeightInches = 210 / 25.4;
	
	var dpi = parseFloat(document.getElementById('outputDpi').value);
	var canvasWidthPixels = canvas.width;
	var canvasHeightPixels = canvas.height;
	
	var targetWidthPixels = a5WidthInches * dpi;
	var targetHeightPixels = a5HeightInches * dpi;
	
	if (canvasWidthPixels > canvasHeightPixels) {
		targetWidthPixels = a5HeightInches * dpi;
		targetHeightPixels = a5WidthInches * dpi;
	}
	
	var multiplierWidth = targetWidthPixels / canvasWidthPixels;
	var multiplierHeight = targetHeightPixels / canvasHeightPixels;
	var multiplier = Math.max(multiplierWidth, multiplierHeight);
	
	return getCropAndDownloadLinkByMultiplier(multiplier, 'png');
}


function clipCopy() {
	removeGrid();
	var link = getCropAndDownloadLink();
	fetch(link.href)
		.then(res => res.blob())
		.then(blob => {
			const item = new ClipboardItem({ "image/png": blob });
			navigator.clipboard.write([item]).then(function () {
				createToast("Success", "Image copied to clipboard successfully!");
			}, function (error) {
				createToast("Error", "Unable to write to clipboard. Error");
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
