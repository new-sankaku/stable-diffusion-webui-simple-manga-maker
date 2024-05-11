


function getCropAndDownloadLink() {
	var strokeWidth = document.getElementById("strokeWidth").value;

	var cropped = canvas.toDataURL({
		format: 'png',
		multiplier: 3, 
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
}

function cropAndDownload() {
	var link = getCropAndDownloadLink();
	link.click();
}
