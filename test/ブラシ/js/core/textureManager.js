class TextureManager {
  constructor() {
    this.brushTextures = {};
    this.paperTextures = {};
    
    this.loadedCount = 0;
    this.totalCount = 0;
    
    this.onLoadComplete = null;
  }
  
  loadTextures(config, callback) {
    this.onLoadComplete = callback;
    
    this.loadedCount = 0;
    this.totalCount = 0;
    
    if (config.brushes && config.brushes.length > 0) {
      this.totalCount += config.brushes.length;
      config.brushes.forEach(brushName => {
        this.loadBrushTexture(brushName);
      });
    }
    
    if (config.papers && config.papers.length > 0) {
      this.totalCount += config.papers.length;
      config.papers.forEach(paperName => {
        this.loadPaperTexture(paperName);
      });
    }
    
    if (this.totalCount === 0) {
      this._checkLoadComplete();
    }
  }
  
  loadBrushTexture(brushName) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      this.brushTextures[brushName] = img;
      this.loadedCount++;
      this._checkLoadComplete();
    };
    img.onerror = (err) => {
      this.loadedCount++;
      this._checkLoadComplete();
    };
    img.src = `assets/brushes/${brushName}.png`;
  }
  
  loadPaperTexture(paperName) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      this.paperTextures[paperName] = img;
      this.loadedCount++;
      this._checkLoadComplete();
    };
    img.onerror = (err) => {
      this.loadedCount++;
      this._checkLoadComplete();
    };
    img.src = `assets/textures/${paperName}.png`;
  }
  
  getBrushTexture(brushName) {
    return this.brushTextures[brushName] || null;
  }
  
  getPaperTexture(paperName) {
    return this.paperTextures[paperName] || null;
  }
  
  textureToCanvas(texture) {
    const canvas = document.createElement('canvas');
    canvas.width = texture.width;
    canvas.height = texture.height;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    try {
      ctx.drawImage(texture, 0, 0);
    } catch(e) {
      return null;
    }
    
    return canvas;
  }
  
  getTextureAlphaMask(textureName, type) {
    let texture;
    if (type === 'brush') {
      texture = this.getBrushTexture(textureName);
    } else if (type === 'paper') {
      texture = this.getPaperTexture(textureName);
    }
    
    if (!texture) {
      return null;
    }
    
    const canvas = this.textureToCanvas(texture);
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    try {
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch(e) {
      return null;
    }
  }
  
  _checkLoadComplete() {
    if (this.loadedCount >= this.totalCount && this.onLoadComplete) {
      this.onLoadComplete();
    }
  }
  
  isAllTexturesLoaded() {
    return this.loadedCount >= this.totalCount;
  }
}

const textureManager = new TextureManager();
