/**
 * ブレンドモード処理
 * レイヤーの合成方法を定義
 */

const BlendModes = {
  // ブレンドモード種類
  NORMAL: 'normal',             // 通常
  MULTIPLY: 'multiply',         // 乗算
  SCREEN: 'screen',             // スクリーン
  OVERLAY: 'overlay',           // オーバーレイ
  DARKEN: 'darken',             // 比較（暗）
  LIGHTEN: 'lighten',           // 比較（明）
  COLOR_DODGE: 'color-dodge',   // 覆い焼き
  COLOR_BURN: 'color-burn',     // 焼き込み
  
  /**
   * ブレンドモードのCanvasコンポジット操作名を取得
   * @param {string} mode - ブレンドモード名
   * @return {string} Canvasのcomposite operation名
   */
  getCanvasCompositeName: function(mode) {
    const map = {
      [this.NORMAL]: 'source-over',
      [this.MULTIPLY]: 'multiply',
      [this.SCREEN]: 'screen',
      [this.OVERLAY]: 'overlay',
      [this.DARKEN]: 'darken',
      [this.LIGHTEN]: 'lighten',
      [this.COLOR_DODGE]: 'color-dodge',
      [this.COLOR_BURN]: 'color-burn'
    };
    
    return map[mode] || 'source-over';
  },
  
  /**
   * ピクセル単位でブレンド処理を行う
   * @param {Object} base - ベースカラー（下レイヤー）{r, g, b, a}
   * @param {Object} blend - ブレンドカラー（上レイヤー）{r, g, b, a}
   * @param {string} mode - ブレンドモード
   * @return {Object} ブレンド結果カラー {r, g, b, a}
   */
  blendPixel: function(base, blend, mode) {
    // アルファ値を考慮した合成を行う
    if (blend.a === 0) return base;
    if (base.a === 0) return blend;
    
    // 各種ブレンドモード関数を適用
    let result;
    
    switch (mode) {
      case this.MULTIPLY:
        result = this._multiplyBlend(base, blend);
        break;
      case this.SCREEN:
        result = this._screenBlend(base, blend);
        break;
      case this.OVERLAY:
        result = this._overlayBlend(base, blend);
        break;
      case this.DARKEN:
        result = this._darkenBlend(base, blend);
        break;
      case this.LIGHTEN:
        result = this._lightenBlend(base, blend);
        break;
      case this.COLOR_DODGE:
        result = this._colorDodgeBlend(base, blend);
        break;
      case this.COLOR_BURN:
        result = this._colorBurnBlend(base, blend);
        break;
      default:
        result = this._normalBlend(base, blend);
        break;
    }
    
    // 最終的なアルファの計算（ポーターダフ合成）
    const resultAlpha = blend.a + base.a * (1 - blend.a);
    
    return {
      r: Math.round(result.r),
      g: Math.round(result.g),
      b: Math.round(result.b),
      a: resultAlpha
    };
  },
  
  /**
   * 通常ブレンド
   * @private
   */
  _normalBlend: function(base, blend) {
    // 通常合成（アルファを考慮）
    return {
      r: blend.r * blend.a + base.r * base.a * (1 - blend.a) / (blend.a + base.a * (1 - blend.a)),
      g: blend.g * blend.a + base.g * base.a * (1 - blend.a) / (blend.a + base.a * (1 - blend.a)),
      b: blend.b * blend.a + base.b * base.a * (1 - blend.a) / (blend.a + base.a * (1 - blend.a)),
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * 乗算ブレンド
   * @private
   */
  _multiplyBlend: function(base, blend) {
    // 各チャンネルを乗算
    return {
      r: (base.r * blend.r) / 255,
      g: (base.g * blend.g) / 255,
      b: (base.b * blend.b) / 255,
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * スクリーンブレンド
   * @private
   */
  _screenBlend: function(base, blend) {
    // スクリーン（乗算の逆操作）
    return {
      r: 255 - (((255 - base.r) * (255 - blend.r)) / 255),
      g: 255 - (((255 - base.g) * (255 - blend.g)) / 255),
      b: 255 - (((255 - base.b) * (255 - blend.b)) / 255),
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * オーバーレイブレンド
   * @private
   */
  _overlayBlend: function(base, blend) {
    // 各チャンネルでオーバーレイ計算
    return {
      r: base.r > 128 ? 255 - 2 * (255 - blend.r) * (255 - base.r) / 255 : 2 * base.r * blend.r / 255,
      g: base.g > 128 ? 255 - 2 * (255 - blend.g) * (255 - base.g) / 255 : 2 * base.g * blend.g / 255,
      b: base.b > 128 ? 255 - 2 * (255 - blend.b) * (255 - base.b) / 255 : 2 * base.b * blend.b / 255,
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * 比較（暗）ブレンド
   * @private
   */
  _darkenBlend: function(base, blend) {
    // 各チャンネルで暗い方を選択
    return {
      r: Math.min(base.r, blend.r),
      g: Math.min(base.g, blend.g),
      b: Math.min(base.b, blend.b),
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * 比較（明）ブレンド
   * @private
   */
  _lightenBlend: function(base, blend) {
    // 各チャンネルで明るい方を選択
    return {
      r: Math.max(base.r, blend.r),
      g: Math.max(base.g, blend.g),
      b: Math.max(base.b, blend.b),
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * 覆い焼きブレンド
   * @private
   */
  _colorDodgeBlend: function(base, blend) {
    return {
      r: blend.r === 255 ? 255 : Math.min(255, base.r * 255 / (255 - blend.r)),
      g: blend.g === 255 ? 255 : Math.min(255, base.g * 255 / (255 - blend.g)),
      b: blend.b === 255 ? 255 : Math.min(255, base.b * 255 / (255 - blend.b)),
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * 焼き込みブレンド
   * @private
   */
  _colorBurnBlend: function(base, blend) {
    return {
      r: blend.r === 0 ? 0 : Math.max(0, 255 - (255 - base.r) * 255 / blend.r),
      g: blend.g === 0 ? 0 : Math.max(0, 255 - (255 - base.g) * 255 / blend.g),
      b: blend.b === 0 ? 0 : Math.max(0, 255 - (255 - base.b) * 255 / blend.b),
      a: blend.a + base.a * (1 - blend.a)
    };
  },
  
  /**
   * イメージデータ全体にブレンドモードを適用
   * @param {ImageData} baseData - ベースのイメージデータ
   * @param {ImageData} blendData - ブレンドするイメージデータ
   * @param {string} mode - ブレンドモード
   * @param {number} opacity - 不透明度（0～1）
   * @return {ImageData} ブレンド結果のイメージデータ
   */
  blendImageData: function(baseData, blendData, mode, opacity = 1) {
    // 不透明度の正規化
    opacity = MathUtils.clamp(opacity, 0, 1);
    
    // 結果格納用の新しいImageDataを作成
    const resultData = new ImageData(
      new Uint8ClampedArray(baseData.data),
      baseData.width,
      baseData.height
    );
    
    // サイズが異なる場合は最小サイズで処理
    const width = Math.min(baseData.width, blendData.width);
    const height = Math.min(baseData.height, blendData.height);
    
    // ピクセルごとに処理
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // 不透明度を適用したブレンドカラー
        const blendWithOpacity = {
          r: blendData.data[index],
          g: blendData.data[index + 1],
          b: blendData.data[index + 2],
          a: blendData.data[index + 3] / 255 * opacity
        };
        
        const baseColor = {
          r: baseData.data[index],
          g: baseData.data[index + 1],
          b: baseData.data[index + 2],
          a: baseData.data[index + 3] / 255
        };
        
        // ブレンド処理
        const result = this.blendPixel(baseColor, blendWithOpacity, mode);
        
        // 結果を格納
        resultData.data[index] = result.r;
        resultData.data[index + 1] = result.g;
        resultData.data[index + 2] = result.b;
        resultData.data[index + 3] = Math.round(result.a * 255);
      }
    }
    
    return resultData;
  }
};
