/**
 * 履歴管理クラス
 * アクション履歴を管理し、元に戻す/やり直し機能を提供
 */

class HistoryManager {
  constructor(maxHistorySize = 30) {
    // 履歴配列
    this.undoStack = [];
    this.redoStack = [];
    
    // 最大履歴サイズ
    this.maxHistorySize = maxHistorySize;
    
    // 現在の状態を保存中かどうか
    this.isSaving = false;
    
    // アクション種類の定義
    this.ACTION_TYPES = {
      STROKE: 'stroke',
      CLEAR: 'clear',
      CLEAR_LAYER: 'clear_layer',
      LAYER_ADD: 'layer_add',
      LAYER_REMOVE: 'layer_remove',
      LAYER_MOVE: 'layer_move',
      LAYER_SETTINGS: 'layer_settings'
    };
  }
  
  /**
   * アクションを履歴に記録
   * @param {string} type - アクション種類
   * @param {Object} data - アクションデータ
   * @param {function} undoCallback - 元に戻す処理のコールバック
   * @param {function} redoCallback - やり直し処理のコールバック
   */
  recordAction(type, data, undoCallback, redoCallback) {
    // 既に保存中なら処理しない（再帰防止）
    if (this.isSaving) return;
    
    this.isSaving = true;
    
    // 新しいアクションを作成
    const action = {
      type: type,
      data: data,
      timestamp: Date.now(),
      undo: undoCallback,
      redo: redoCallback
    };
    
    // アンドゥスタックに追加
    this.undoStack.push(action);
    
    // 最大履歴サイズを超えたら古い履歴を削除
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
    
    // 新しいアクションが記録されたらリドゥスタックをクリア
    this.redoStack = [];
    
    this.isSaving = false;
  }
  
  /**
   * ストローク描画アクションを記録
   * @param {number} layerIndex - レイヤーインデックス
   * @param {ImageData} beforeImageData - 描画前のレイヤーImageData
   * @param {ImageData} afterImageData - 描画後のレイヤーImageData
   */
  recordStroke(layerIndex, beforeImageData, afterImageData) {
    this.recordAction(
      this.ACTION_TYPES.STROKE,
      { layerIndex, beforeImageData, afterImageData },
      // アンドゥコールバック
      () => {
        if (layerManager && layerManager.layers[layerIndex]) {
          layerManager.setLayerImageData(layerIndex, beforeImageData);
        }
      },
      // リドゥコールバック
      () => {
        if (layerManager && layerManager.layers[layerIndex]) {
          layerManager.setLayerImageData(layerIndex, afterImageData);
        }
      }
    );
  }
  
  /**
   * レイヤー全体クリアアクションを記録
   * @param {number} layerIndex - レイヤーインデックス
   * @param {ImageData} beforeImageData - クリア前のレイヤーImageData
   */
  recordClearLayer(layerIndex, beforeImageData) {
    // クリア後のイメージデータ（すべて透明）
    const emptyImageData = new ImageData(
      beforeImageData.width,
      beforeImageData.height
    );
    
    this.recordAction(
      this.ACTION_TYPES.CLEAR_LAYER,
      { layerIndex, beforeImageData },
      // アンドゥコールバック
      () => {
        if (layerManager && layerManager.layers[layerIndex]) {
          layerManager.setLayerImageData(layerIndex, beforeImageData);
        }
      },
      // リドゥコールバック
      () => {
        if (layerManager && layerManager.layers[layerIndex]) {
          layerManager.clearLayer(layerIndex);
        }
      }
    );
  }
  
  /**
   * レイヤー追加アクションを記録
   * @param {Object} layer - 追加されたレイヤーオブジェクト
   */
  recordLayerAdd(layer) {
    this.recordAction(
      this.ACTION_TYPES.LAYER_ADD,
      { layer },
      // アンドゥコールバック
      () => {
        if (layerManager) {
          // 追加されたレイヤーのインデックスを検索
          const index = layerManager.layers.findIndex(l => l.id === layer.id);
          if (index !== -1) {
            layerManager.removeLayer(index);
          }
        }
      },
      // リドゥコールバック
      () => {
        if (layerManager) {
          // レイヤーを再度追加
          const newLayer = layerManager.addLayer({
            name: layer.name,
            opacity: layer.opacity,
            blendMode: layer.blendMode,
            visible: layer.visible
          });
          
          // レイヤーIDを元のものに設定
          newLayer.id = layer.id;
        }
      }
    );
  }
  
  /**
   * レイヤー削除アクションを記録
   * @param {number} index - 削除されたレイヤーのインデックス
   * @param {Object} layer - 削除されたレイヤーオブジェクト
   * @param {ImageData} imageData - 削除されたレイヤーの内容
   */
  recordLayerRemove(index, layer, imageData) {
    this.recordAction(
      this.ACTION_TYPES.LAYER_REMOVE,
      { index, layer, imageData },
      // アンドゥコールバック
      () => {
        if (layerManager) {
          // レイヤーを再度追加
          const newLayer = layerManager.addLayer({
            name: layer.name,
            opacity: layer.opacity,
            blendMode: layer.blendMode,
            visible: layer.visible
          });
          
          // レイヤーIDを元のものに設定
          newLayer.id = layer.id;
          
          // 正しい位置に移動
          const currentIndex = layerManager.layers.length - 1;
          if (currentIndex !== index) {
            layerManager.moveLayer(currentIndex, index);
          }
          
          // レイヤーの内容を復元
          if (imageData) {
            layerManager.setLayerImageData(index, imageData);
          }
        }
      },
      // リドゥコールバック
      () => {
        if (layerManager) {
          // レイヤーを再度削除
          const currentIndex = layerManager.layers.findIndex(l => l.id === layer.id);
          if (currentIndex !== -1) {
            layerManager.removeLayer(currentIndex);
          }
        }
      }
    );
  }
  
  /**
   * レイヤー移動アクションを記録
   * @param {number} fromIndex - 移動元インデックス
   * @param {number} toIndex - 移動先インデックス
   */
  recordLayerMove(fromIndex, toIndex) {
    this.recordAction(
      this.ACTION_TYPES.LAYER_MOVE,
      { fromIndex, toIndex },
      // アンドゥコールバック
      () => {
        if (layerManager) {
          // 逆方向に移動
          layerManager.moveLayer(toIndex, fromIndex);
        }
      },
      // リドゥコールバック
      () => {
        if (layerManager) {
          // 同じ移動を再度実行
          layerManager.moveLayer(fromIndex, toIndex);
        }
      }
    );
  }
  
  /**
   * レイヤー設定変更アクションを記録
   * @param {number} index - レイヤーインデックス
   * @param {Object} oldSettings - 変更前の設定
   * @param {Object} newSettings - 変更後の設定
   */
  recordLayerSettings(index, oldSettings, newSettings) {
    this.recordAction(
      this.ACTION_TYPES.LAYER_SETTINGS,
      { index, oldSettings, newSettings },
      // アンドゥコールバック
      () => {
        if (layerManager && layerManager.layers[index]) {
          layerManager.updateLayerSettings(index, oldSettings);
        }
      },
      // リドゥコールバック
      () => {
        if (layerManager && layerManager.layers[index]) {
          layerManager.updateLayerSettings(index, newSettings);
        }
      }
    );
  }
  
  /**
   * アンドゥ（元に戻す）
   * @return {boolean} 実行できたかどうか
   */
  undo() {
    if (this.undoStack.length === 0) {
      return false;
    }
    
    // 最新のアクションを取得
    const action = this.undoStack.pop();
    
    // リドゥスタックに追加
    this.redoStack.push(action);
    
    // アンドゥ処理を実行
    if (action.undo && typeof action.undo === 'function') {
      this.isSaving = true;
      action.undo();
      this.isSaving = false;
    }
    
    return true;
  }
  
  /**
   * リドゥ（やり直し）
   * @return {boolean} 実行できたかどうか
   */
  redo() {
    if (this.redoStack.length === 0) {
      return false;
    }
    
    // 最新のアクションを取得
    const action = this.redoStack.pop();
    
    // アンドゥスタックに追加
    this.undoStack.push(action);
    
    // リドゥ処理を実行
    if (action.redo && typeof action.redo === 'function') {
      this.isSaving = true;
      action.redo();
      this.isSaving = false;
    }
    
    return true;
  }
  
  /**
   * アンドゥ可能かどうか
   * @return {boolean} アンドゥ可能かどうか
   */
  canUndo() {
    return this.undoStack.length > 0;
  }
  
  /**
   * リドゥ可能かどうか
   * @return {boolean} リドゥ可能かどうか
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
  
  /**
   * 履歴をクリア
   */
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

// シングルトンインスタンス
const historyManager = new HistoryManager();
