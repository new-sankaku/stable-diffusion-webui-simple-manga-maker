const updateValue = (id) => $(`${id}v`).textContent = $(`${id}`).value;
const imageStates = new Map();
let processing = false;
class ImageProcessor {
constructor(imageFile, index) {
this.id = `image-${index}`;
this.file = imageFile;
this.processing = false;
this.setupDOM();
}
setupDOM() {
    const createCanvasWrapper = (label, canvasId) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-wrapper';
    wrapper.setAttribute('data-label', label);
    const canvas = document.createElement('canvas');
    canvas.id = `${canvasId}-${this.id}`;
    canvas.style.transform = 'translateZ(0)';
    wrapper.appendChild(canvas);
    return { wrapper, canvas };
    };
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    const canvasPair = document.createElement('div');
    canvasPair.className = 'canvas-pair';
    const original = createCanvasWrapper('オリジナル', 'original');
    const processed = createCanvasWrapper('変更後', 'processed');
    const mask = createCanvasWrapper('変更箇所', 'mask');
    canvasPair.append(original.wrapper, processed.wrapper, mask.wrapper);
    previewItem.appendChild(canvasPair);
    $('preview-container').appendChild(previewItem);
    
    this.originalCanvas = original.canvas;
    this.processedCanvas = processed.canvas;
    this.maskCanvas = mask.canvas;
    
    const contextOptions = {
      alpha: false,
      willReadFrequently: true
    };
    
    this.originalCtx = this.originalCanvas.getContext('2d', contextOptions);
    this.processedCtx = this.processedCanvas.getContext('2d', contextOptions);
    this.maskCtx = this.maskCanvas.getContext('2d', contextOptions);
    }
loadImage() {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = e => {
const img = new Image();
img.onload = () => {
this.image = img;
this.resizeCanvas();
resolve();
};
img.src = e.target.result;
};
reader.onerror = reject;
reader.readAsDataURL(this.file);
});
}
resizeCanvas() {
    let targetWidth = this.image.width;
    let targetHeight = this.image.height;
    const maxWidth = window.innerWidth * 0.85;
    if (targetWidth > maxWidth) {
    const scale = maxWidth / targetWidth;
    targetWidth = maxWidth;
    targetHeight = this.image.height * scale;
    }
    this.originalCanvas.width = this.processedCanvas.width = this.maskCanvas.width = targetWidth;
    this.originalCanvas.height = this.processedCanvas.height = this.maskCanvas.height = targetHeight;
    this.originalCtx.drawImage(this.image, 0, 0, targetWidth, targetHeight);
    this.maskCtx.fillStyle = '#000000';
    this.maskCtx.fillRect(0, 0, targetWidth, targetHeight);
    this.processImage();
    }
processImage() {
if (this.processing) return;
this.processing = true;
const imgData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);
const originalData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);
const hex = $('c').value;
const r = parseInt(hex.slice(1, 3), 16);
const g = parseInt(hex.slice(3, 5), 16);
const b = parseInt(hex.slice(5, 7), 16);
const [h, s, l] = rgbToHsl(r, g, b);
const params = {
hueMin: +$('h1').value,
hueMax: +$('h2').value,
satMin: +$('s1').value,
satMax: +$('s2').value,
lightMin: +$('l1').value,
lightMax: +$('l2').value,
blend: +$('blend').value,
color: { h, s, l }
};
worker.postMessage({ imgData, originalData, params, imageId: this.id });
}
}
worker.onmessage = e => {
const { imgData, modifiedPixels, imageId } = e.data;
const processor = imageStates.get(imageId);
if (processor) {
processor.processedCtx.putImageData(imgData, 0, 0);
processor.maskCtx.putImageData(modifiedPixels, 0, 0);
processor.processing = false;
}
};