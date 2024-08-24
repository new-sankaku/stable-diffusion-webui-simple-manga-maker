
function canvas2DataURL(multiplier, format) {
	return canvas.toDataURL({
			format: format,
			multiplier: multiplier
	});
}


function getCropAndDownloadLinkByMultiplier(multiplier, format) {
	var cropped = canvas.toDataURL({
			format: format,
			multiplier: multiplier
	});

	function getFormattedDateTime() {
			var date = new Date();
			var yyyy = date.getFullYear();
			var MM = ('0' + (date.getMonth() + 1)).slice(-2);
			var dd = ('0' + date.getDate()).slice(-2);
			var hh = ('0' + date.getHours()).slice(-2);
			var mm = ('0' + date.getMinutes()).slice(-2);
			var ss = ('0' + date.getSeconds()).slice(-2);
			var SSS = ('00' + date.getMilliseconds()).slice(-3);
			return `${yyyy}${MM}${dd}_${hh}${mm}${ss}_${SSS}`;
	}

	var link = document.createElement('a');
	link.download = getFormattedDateTime() + '_SP-MangaEditor.png';
	link.href = cropped;
	return link;
}
function getCropAndDownloadLink() {
	var a5WidthInches = 148 / 25.4;
	var a5HeightInches = 210 / 25.4;
	
	var dpi = parseFloat($('outputDpi').value);
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
				createToastError("Error", "Unable to write to clipboard. Error");
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


function getLink(dataURL) {
	const link = document.createElement('a');
	link.href = dataURL;
	link.download = 'selected-image.png';
	return link;
}