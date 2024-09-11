let sourceImage = null;
let controlPoints = [];
let draggingPoint = null;
let showPoints = true;
let circularMode = false;
let circularCenter = { x: 0.5, y: 0.5 };

function drawPoint(ctx, x, y, color = 'red') {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawImage() {
    sourceCtx.clearRect(0, 0, scan.width, scan.height);
    targetCtx.clearRect(0, 0, tcan.width, tcan.height);
    if (sourceImage) {
        sourceCtx.drawImage(sourceImage, 0, 0, scan.width, scan.height);
        targetCtx.drawImage(sourceImage, 0, 0, tcan.width, tcan.height);
    }
    if (showPoints) {
        controlPoints.forEach(pair => {
            drawPoint(sourceCtx, pair.source.x * scan.width, pair.source.y * scan.height);
            drawPoint(targetCtx, pair.target.x * tcan.width, pair.target.y * tcan.height);
        });
    }
    if (circularMode) {
        drawCircularRegion();
    }
}

function drawCircularRegion() {
    const radius = parseInt(radiusSlider.value) / scan.width;
    targetCtx.beginPath();
    targetCtx.arc(circularCenter.x * tcan.width, circularCenter.y * tcan.height, radius * tcan.width, 0, 2 * Math.PI);
    targetCtx.strokeStyle = 'yellow';
    targetCtx.lineWidth = 2;
    targetCtx.stroke();
}

function createControlPoints() {
    controlPoints = [];
    for (let y = 25; y < scan.height; y += 25) {
        for (let x = 25; x < scan.width; x += 25) {
            controlPoints.push({
                source: { x: x / scan.width, y: y / scan.height },
                target: { x: x / tcan.width, y: y / tcan.height }
            });
        }
    }
}

function applyCircularTransformation() {
    const radius = parseInt(radiusSlider.value) / scan.width;
    const strength = parseInt(strengthSlider.value) / 100;
    controlPoints.forEach(point => {
        const dx = point.source.x - circularCenter.x;
        const dy = point.source.y - circularCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
            const factor = 1 + strength * (1 - distance / radius);
            point.target.x = circularCenter.x + dx * factor;
            point.target.y = circularCenter.y + dy * factor;
        } else {
            point.target.x = point.source.x;
            point.target.y = point.source.y;
        }
    });
}

function findClosestPoint(x, y) {
    let minDist = Infinity;
    let closestIndex = -1;
    controlPoints.forEach((point, index) => {
        const dx = point.target.x * tcan.width - x;
        const dy = point.target.y * tcan.height - y;
        const dist = dx * dx + dy * dy;
        if (dist < minDist) {
            minDist = dist;
            closestIndex = index;
        }
    });
    return closestIndex;
}

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        sourceImage = new Image();
        sourceImage.onload = () => {
            createControlPoints();
            drawImage();
        };
        sourceImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

tcan.addEventListener('mousedown', (e) => {
    const rect = tcan.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (circularMode) {
        circularCenter = { x: x / tcan.width, y: y / tcan.height };
        applyCircularTransformation();
    } else {
        draggingPoint = findClosestPoint(x, y);
    }
    drawImage();
});

tcan.addEventListener('mousemove', (e) => {
    if (draggingPoint !== null && !circularMode) {
        const rect = tcan.getBoundingClientRect();
        const x = (e.clientX - rect.left) / tcan.width;
        const y = (e.clientY - rect.top) / tcan.height;
        controlPoints[draggingPoint].target = { x, y };
        drawImage();
    }
});

tcan.addEventListener('mouseup', () => {
    draggingPoint = null;
});

tcan.addEventListener('mouseleave', () => {
    draggingPoint = null;
});
