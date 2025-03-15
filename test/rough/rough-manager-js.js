class RoughManager {
 constructor() {
  this.options = {
   roughness: 2,
   bowing: 1,
   seed: 1,
   fillStyle: 'hachure',
   fillWeight: 1,
   hachureAngle: -41,
   hachureGap: 4,
   curveStepCount: 9,
   curveFitting: 0.95,
   strokeWidth: 2,
   simplification: 0,
   disableMultiStroke: false,
   disableMultiStrokeFill: false,
   fill: '#e6e6e6',
   stroke: '#000000'
  };
 }
 
 setOptions(options) {
  this.options = { ...this.options, ...options };
  return this;
 }
 
 getOptionsFromUI() {
  const options = {
   roughness: parseFloat(document.getElementById('roughness').value),
   bowing: parseFloat(document.getElementById('bowing').value),
   seed: parseInt(document.getElementById('seed').value),
   fillStyle: document.getElementById('fillStyle').value,
   fillWeight: parseFloat(document.getElementById('fillWeight').value),
   hachureAngle: parseInt(document.getElementById('hachureAngle').value),
   hachureGap: parseFloat(document.getElementById('hachureGap').value),
   curveStepCount: parseInt(document.getElementById('curveStepCount').value),
   curveFitting: parseFloat(document.getElementById('curveFitting').value),
   strokeWidth: parseFloat(document.getElementById('strokeWidth').value),
   simplification: parseFloat(document.getElementById('simplification').value),
   disableMultiStroke: document.getElementById('disableMultiStroke').checked,
   disableMultiStrokeFill: document.getElementById('disableMultiStrokeFill').checked,
   fill: document.getElementById('fillColor').value,
   stroke: document.getElementById('strokeColor').value
  };
  
  this.options = options;
  return this;
 }
 
 isRoughenable(fabricObj) {
  const supportedTypes = ['path', 'polygon', 'rect', 'circle', 'ellipse', 'line'];
  return supportedTypes.includes(fabricObj.type);
 }
 
 extractPathData(svgElement) {
  // SVG要素からパスデータを抽出
  if (!svgElement) return null;
  
  const pathElements = svgElement.querySelectorAll('path');
  const pathData = [];
  
  pathElements.forEach(pathEl => {
   const d = pathEl.getAttribute('d');
   if (d) {
    pathData.push({
     d: d,
     fill: pathEl.getAttribute('fill') || 'none',
     stroke: pathEl.getAttribute('stroke') || 'none',
     strokeWidth: pathEl.getAttribute('stroke-width') || '1'
    });
   }
  });
  
  return pathData;
 }
 
 roughenObject(fabricObj) {
  return new Promise((resolve, reject) => {
   try {
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rc = rough.svg(svgNode);
    
    let roughElement;
    
    if (fabricObj.type === 'path') {
     const pathData = fabricObj.path.map(p => {
      if (p[0] === 'M' || p[0] === 'L') {
       return p[0] + ' ' + p[1] + ' ' + p[2];
      } else if (p[0] === 'Z') {
       return 'Z';
      }
      return '';
     }).join(' ');
     
     roughElement = rc.path(pathData, this.options);
    } else if (fabricObj.type === 'polygon') {
     const points = fabricObj.points;
     const pathData = points.map((point, i) => {
      return (i === 0 ? 'M ' : 'L ') + point.x + ' ' + point.y;
     }).join(' ') + ' Z';
     
     roughElement = rc.path(pathData, this.options);
    } else if (fabricObj.type === 'rect') {
     roughElement = rc.rectangle(
      fabricObj.left,
      fabricObj.top,
      fabricObj.width,
      fabricObj.height,
      this.options
     );
    } else if (fabricObj.type === 'circle') {
     roughElement = rc.circle(
      fabricObj.left + fabricObj.radius,
      fabricObj.top + fabricObj.radius,
      fabricObj.radius * 2,
      this.options
     );
    } else if (fabricObj.type === 'ellipse') {
     roughElement = rc.ellipse(
      fabricObj.left + fabricObj.rx,
      fabricObj.top + fabricObj.ry,
      fabricObj.rx * 2,
      fabricObj.ry * 2,
      this.options
     );
    } else if (fabricObj.type === 'line') {
     roughElement = rc.line(
      fabricObj.x1,
      fabricObj.y1,
      fabricObj.x2,
      fabricObj.y2,
      this.options
     );
    } else {
     console.error(`未対応のオブジェクトタイプです: ${fabricObj.type}`);
     resolve(null);
     return;
    }
    
    svgNode.appendChild(roughElement);
    const svgString = new XMLSerializer().serializeToString(svgNode);
    
    // 新しい実装：SVGからパスデータを直接抽出してPathオブジェクトを生成
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const pathData = this.extractPathData(svgDoc);
    
    if (!pathData || pathData.length === 0) {
     console.error('パスデータが抽出できませんでした');
     resolve(null);
     return;
    }
    
    // 複数のパスから構成されるRoughオブジェクトを処理
    const roughPaths = [];
    
    for (const path of pathData) {
     const fabricPath = new fabric.Path(path.d, {
      fill: path.fill !== 'none' ? this.options.fill : 'rgba(0,0,0,0)',
      stroke: path.stroke !== 'none' ? this.options.stroke : 'rgba(0,0,0,0)',
      strokeWidth: parseFloat(path.strokeWidth),
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      originX: fabricObj.originX || 'left',
      originY: fabricObj.originY || 'top'
     });
     
     roughPaths.push(fabricPath);
    }
    
    // パスが1つだけの場合は単一のPathオブジェクトを返す
    if (roughPaths.length === 1) {
     const roughPath = roughPaths[0];
     
     roughPath.set({
      left: fabricObj.left,
      top: fabricObj.top,
      scaleX: fabricObj.scaleX,
      scaleY: fabricObj.scaleY,
      angle: fabricObj.angle,
      flipX: fabricObj.flipX,
      flipY: fabricObj.flipY,
      opacity: fabricObj.opacity,
      selectable: fabricObj.selectable,
      hasControls: fabricObj.hasControls,
      hasBorders: fabricObj.hasBorders
     });
     
     resolve(roughPath);
    } 
    // 複数のパスの場合はグループ化
    else {
     const group = new fabric.Group(roughPaths, {
      left: fabricObj.left,
      top: fabricObj.top,
      originX: fabricObj.originX,
      originY: fabricObj.originY,
      scaleX: fabricObj.scaleX,
      scaleY: fabricObj.scaleY,
      angle: fabricObj.angle,
      flipX: fabricObj.flipX,
      flipY: fabricObj.flipY,
      opacity: fabricObj.opacity,
      selectable: fabricObj.selectable,
      hasControls: fabricObj.hasControls,
      hasBorders: fabricObj.hasBorders
     });
     
     resolve(group);
    }
   } catch (error) {
    console.error("オブジェクトのラフ化に失敗しました:", error);
    resolve(null);
   }
  });
 }
 
 async roughenObjects(fabricObjs) {
  const results = [];
  for (const obj of fabricObjs) {
   try {
    if (this.isRoughenable(obj)) {
     const roughObj = await this.roughenObject(obj);
     if (roughObj) {
      results.push(roughObj);
     }
    } else {
     console.error(`未対応のオブジェクトタイプです: ${obj.type}`);
    }
   } catch (error) {
    console.error("オブジェクトのラフ化に失敗しました:", error);
   }
  }
  return results;
 }
}