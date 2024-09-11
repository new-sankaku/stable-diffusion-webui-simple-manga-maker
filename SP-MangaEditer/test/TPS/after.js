warpBtn.addEventListener('click', () => {
    if (!sourceImage) {
        alert('Please upload an image first.');
        return;
    }
    const c_src = controlPoints.map(pair => [pair.source.x, pair.source.y]);
    const c_dst = controlPoints.map(pair => [pair.target.x, pair.target.y]);
    const theta = tpsThetaFromPoints(c_src, c_dst, true);
    const grid = tpsGrid(theta, c_dst, [tcan.height, tcan.width]);
    const [mapx, mapy] = tpsGridToRemap(grid, [scan.height, scan.width]);
    const imageData = sourceCtx.getImageData(0, 0, scan.width, scan.height);
    const warped = warpImage(imageData, mapx, mapy);
    targetCtx.putImageData(warped, 0, 0);
    if (showPoints) {
        controlPoints.forEach(pair => {
            drawPoint(targetCtx, pair.target.x * tcan.width, pair.target.y * tcan.height);
        });
    }
    if (circularMode) {
        drawCircularRegion();
    }
});

resetBtn.addEventListener('click', () => {
    if (sourceImage) {
        createControlPoints();
        drawImage();
    }
});

togglePointsBtn.addEventListener('click', () => {
    showPoints = !showPoints;
    drawImage();
});

circularModeBtn.addEventListener('click', () => {
    circularMode = !circularMode;
    circularModeBtn.textContent = circularMode ? 'Exit Circular Mode' : 'Circular Mode';
    if (circularMode) {
        applyCircularTransformation();
    } else {
        createControlPoints();
    }
    drawImage();
});

radiusSlider.addEventListener('input', () => {
    if (circularMode) {
        applyCircularTransformation();
        drawImage();
    }
});

strengthSlider.addEventListener('input', () => {
    if (circularMode) {
        applyCircularTransformation();
        drawImage();
    }
});