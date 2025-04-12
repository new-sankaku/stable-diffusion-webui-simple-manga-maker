class CalligraphyBrush extends Brush {
  constructor(canvas, ctx) {
    super(canvas, ctx);
    
    this.widthRatio = 3.0;
    this.paperTexture = 'paper_smooth';
    this.textureStrength = 0.3;
    this.blendMode = BlendModes.NORMAL;
    this.fixedAngle = true;
    this.angle = MathUtils.degreesToRadians(45);
    
    this.edgeSharpness = 0.8;
    
    this.paperTextureData = null;
    
    this._loadTextures();
  }
  
  _loadTextures() {
    const paperTexture = textureManager.getPaperTexture(this.paperTexture);
    if (paperTexture) {
      this.paperTextureData = textureManager.getTextureAlphaMask(this.paperTexture, 'paper');
    }
  }
  
  setProperties(props) {
    super.setProperties(props);
    
    if (props.widthRatio !== undefined) {
      this.widthRatio = Math.max(1, props.widthRatio);
    }
    
    if (props.paperTexture !== undefined) {
      this.paperTexture = props.paperTexture;
      this._loadTextures();
    }
    
    if (props.textureStrength !== undefined) {
      this.textureStrength = MathUtils.clamp(props.textureStrength, 0, 1);
    }
    
    if (props.edgeSharpness !== undefined) {
      this.edgeSharpness = MathUtils.clamp(props.edgeSharpness, 0, 1);
    }
    
    if (props.blendMode !== undefined) {
      this.blendMode = props.blendMode;
    }
    
    this._updateStampCanvas();
  }
  
  _updateStampCanvas() {
    const maxRatio = Math.max(1, this.widthRatio);
    const size = Math.ceil(this.size * 2 * maxRatio);
    this._stampCanvas.width = size;
    this._stampCanvas.height = size;
    
    this._stampCtx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    
    this._stampCtx.save();
    
    const safeSize = Math.max(1, this.size);
    const radiusX = safeSize * Math.max(1, this.widthRatio);
    const radiusY = safeSize;
    
    this._stampCtx.beginPath();
    this._stampCtx.ellipse(
      centerX, centerY,
      radiusX, radiusY,
      0,
      0, Math.PI * 2
    );
    
    this._stampCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    this._stampCtx.fill();
    
    this._stampCtx.restore();
  }
  
  drawStamp(x, y, pressure, direction) {
    const velocity = strokeProcessor.getVelocity();
    
    const effectiveSize = this._getEffectiveSize(pressure, velocity);
    const effectiveOpacity = this._getEffectiveOpacity(pressure);
    
    if (effectiveSize < 0.5 || effectiveOpacity < 0.01) {
      return;
    }
    
    const effectiveAngle = this._getEffectiveAngle(direction);
    
    this.ctx.save();
    
    this.ctx.globalCompositeOperation = BlendModes.getCanvasCompositeName(this.blendMode);
    
    this.ctx.fillStyle = this.color;
    
    this.ctx.translate(x, y);
    this.ctx.rotate(effectiveAngle);
    
    const scaleRatio = effectiveSize / this.size;
    
    const pressureWidthEffect = 1 + pressure * 0.2;
    this.ctx.scale(scaleRatio * pressureWidthEffect, scaleRatio);
    
    this.ctx.globalAlpha = effectiveOpacity;
    
    const stampSize = this._stampCanvas.width;
    const halfSize = stampSize / 2;
    
    this.ctx.drawImage(this._stampCanvas, -halfSize, -halfSize);
    
    this.ctx.restore();
    
    if (velocity < 0.1 && pressure > 0.7) {
      const region = this.ctx.getImageData(
        Math.floor(x - effectiveSize * this.widthRatio),
        Math.floor(y - effectiveSize),
        Math.ceil(effectiveSize * this.widthRatio * 2),
        Math.ceil(effectiveSize * 2)
      );
      
      inkEffects.applyDiffusion(
        region,
        region.width / 2,
        region.height / 2,
        effectiveSize,
        0.1
      );
      
      this.ctx.putImageData(
        region,
        Math.floor(x - effectiveSize * this.widthRatio),
        Math.floor(y - effectiveSize)
      );
    }
  }
  
  _getEffectiveAngle(direction) {
    if (this.fixedAngle) {
      return this.angle;
    } else {
      return direction;
    }
  }
}
