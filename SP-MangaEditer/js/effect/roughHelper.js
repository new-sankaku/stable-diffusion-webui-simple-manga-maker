
function getRoughValue() {

    const roughOptions = {
      roughness: parseFloat($('rough_roughness').value),
      bowing: parseFloat($('rough_bowing').value),
      stroke: $('rough_stroke').value,
      strokeWidth: parseFloat($('rough_strokeWidth').value),
      fill: $('rough_fill').value === '#ffffff' ? 'none' : $('fill').value,
      fillStyle: $('rough_fillStyle').value,
      fillWeight: parseFloat($('rough_fillWeight').value),
      hachureAngle: parseFloat($('rough_hachureAngle').value),
      hachureGap: parseFloat($('rough_hachureGap').value),
      curveStepCount: parseFloat($('rough_curveStepCount').value),
      simplification: parseFloat($('rough_simplification').value),
      dashOffset: parseFloat($('rough_dashOffset').value),
      dashGap: parseFloat($('rough_dashGap').value),
      zigzagOffset: parseFloat($('rough_zigzagOffset').value),
  };
  
  return roughOptions;
  }
  
  
  function setRoughValueText( roughOptions ) {
  
    
    $('rough_roughnessValue').textContent = roughOptions.roughness;
    $('rough_bowingValue').textContent = roughOptions.bowing;
    $('rough_strokeWidthValue').textContent = roughOptions.strokeWidth;
    $('rough_fillWeightValue').textContent = roughOptions.fillWeight;
    $('rough_hachureAngleValue').textContent = roughOptions.hachureAngle;
    $('rough_hachureGapValue').textContent = roughOptions.hachureGap;
    $('rough_curveStepCountValue').textContent = roughOptions.curveStepCount;
    $('rough_simplificationValue').textContent = roughOptions.simplification;
    $('rough_dashOffsetValue').textContent = roughOptions.dashOffset;
    $('rough_dashGapValue').textContent = roughOptions.dashGap;
    $('rough_zigzagOffsetValue').textContent = roughOptions.zigzagOffset;
  }
  
  
  
  
  function roughPath2FabrcPath(roughPath) {
    return roughPath.sets.reduce((path, set) => {
        set.ops.forEach(op => {
            switch (op.op) {
                case 'move':
                    path += `M ${op.data[0]} ${op.data[1]} `;
                    break;
                case 'lineTo':
                    path += `L ${op.data[0]} ${op.data[1]} `;
                    break;
                case 'bcurveTo':
                    path += `C ${op.data[0]} ${op.data[1]}, ${op.data[2]} ${op.data[3]}, ${op.data[4]} ${op.data[5]} `;
                    break;
                case 'qcurveTo':
                    path += `Q ${op.data[0]} ${op.data[1]}, ${op.data[2]} `;
                    break;
                case 'arcTo':
                    path += `A ${op.data[0]} ${op.data[1]}, ${op.data[2]}, ${op.data[3]}, ${op.data[4]}, ${op.data[5]} ${op.data[6]} `;
                    break;
                case 'close':
                    path += 'Z ';
                    break;
            }
        });
        return path;
    }, '');
  }
  
  
  
  
  function roughPath2FabrcPolygon(roughPath) {
    const points = [];
    roughPath.sets.forEach((set, setIndex) => {
        set.ops.forEach((op, opIndex) => {
            console.log(`Processing set ${setIndex}, op ${opIndex}: ${op.op}`);
            console.log(`Current points:`, points);
            try {
                switch (op.op) {
                    case 'move':
                    case 'lineTo':
                        points.push({ x: op.data[0], y: op.data[1] });
                        break;
                    case 'bcurveTo':
                        if (points.length === 0) {
                            throw new Error(`No starting point for bcurveTo at set ${setIndex}, op ${opIndex}`);
                        }
                        const [x0, y0] = points[points.length - 1];
                        const [x1, y1, x2, y2, x, y] = op.data;
                        const steps = 10; // Increase for more accuracy
                        for (let t = 0; t <= 1; t += 1 / steps) {
                            const xt = Math.pow(1 - t, 3) * x0 +
                                        3 * Math.pow(1 - t, 2) * t * x1 +
                                        3 * (1 - t) * Math.pow(t, 2) * x2 +
                                        Math.pow(t, 3) * x;
                            const yt = Math.pow(1 - t, 3) * y0 +
                                        3 * Math.pow(1 - t, 2) * t * y1 +
                                        3 * (1 - t) * Math.pow(t, 2) * y2 +
                                        Math.pow(t, 3) * y;
                            points.push({ x: xt, y: yt });
                        }
                        break;
                    case 'qcurveTo':
                        if (points.length === 0) {
                            throw new Error(`No starting point for qcurveTo at set ${setIndex}, op ${opIndex}`);
                        }
                        const [qx0, qy0] = points[points.length - 1];
                        const [qx1, qy1, qx, qy] = op.data;
                        const qsteps = 10; // Increase for more accuracy
                        for (let t = 0; t <= 1; t += 1 / qsteps) {
                            const qxt = Math.pow(1 - t, 2) * qx0 +
                                        2 * (1 - t) * t * qx1 +
                                        Math.pow(t, 2) * qx;
                            const qyt = Math.pow(1 - t, 2) * qy0 +
                                        2 * (1 - t) * t * qy1 +
                                        Math.pow(t, 2) * qy;
                            points.push({ x: qxt, y: qyt });
                        }
                        break;
                    case 'close':
                        if (points.length > 0) {
                            points.push(points[0]); // Close the path by repeating the first point
                        }
                        break;
                    default:
                        console.warn(`Unsupported operation: ${op.op}`);
                }
            } catch (error) {
                console.error(`Error processing set ${setIndex}, op ${opIndex}: ${error.message}`);
            }
        });
    });
    return points;
  }
  










// Rough.jsのキャンバスを作成
const roughCanvas = rough.canvas(document.createElement('canvas'));

// コントロールパネルの値を取得してActiveObjectに適用する関数
function applyRoughToActiveObject() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
        alert('オブジェクトを選択してください。');
        return;
    }

    const roughness = parseFloat($('rough_roughness').value);
    const bowing = parseFloat($('rough_bowing').value);
    const stroke = $('rough_stroke').value;
    const strokeWidth = parseFloat($('rough_strokeWidth').value);
    const fill = $('rough_fill').value;
    const fillStyle = $('rough_fillStyle').value;
    const fillWeight = parseFloat($('rough_fillWeight').value);
    const hachureAngle = parseFloat($('rough_hachureAngle').value);
    const hachureGap = parseFloat($('rough_hachureGap').value);
    const curveStepCount = parseInt($('rough_curveStepCount').value);
    const simplification = parseFloat($('rough_simplification').value);
    const dashOffset = parseFloat($('rough_dashOffset').value);
    const dashGap = parseFloat($('rough_dashGap').value);
    const zigzagOffset = parseFloat($('rough_zigzagOffset').value);

    // Rough.jsのオプションを設定
    const options = {
        roughness: roughness,
        bowing: bowing,
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: fill,
        fillStyle: fillStyle,
        fillWeight: fillWeight,
        hachureAngle: hachureAngle,
        hachureGap: hachureGap,
        curveStepCount: curveStepCount,
        simplification: simplification,
        dashOffset: dashOffset,
        dashGap: dashGap,
        zigzagOffset: zigzagOffset
    };

    function applyRoughToObject(obj) {
        if (obj.type === 'path') {
            const pathData = obj.path.map(command => command.join(' ')).join(' ');
            return roughCanvas.path(pathData, options);
        } else if (obj.type === 'rect') {
            const width = obj.width * obj.scaleX;
            const height = obj.height * obj.scaleY;
            return roughCanvas.rectangle(obj.left, obj.top, width, height, options);
        } else if (obj.type === 'circle') {
            const radius = obj.width * obj.scaleX / 2;
            return roughCanvas.circle(obj.left + radius, obj.top + radius, radius * 2, options);
        } else if (obj.type === 'ellipse') {
            const width = obj.width * obj.scaleX;
            const height = obj.height * obj.scaleY;
            return roughCanvas.ellipse(obj.left + width / 2, obj.top + height / 2, width, height, options);
        }
        return null;
    }

    // Rough.jsで作成されたパスをFabric.jsオブジェクトに変換してキャンバスに追加
    function addRoughPaths(roughPaths) {
        roughPaths.forEach(roughPath => {
            // Rough.jsの描画結果を取得してFabric.jsのPathオブジェクトを作成
            const svgPaths = roughPath.toPaths();
            svgPaths.forEach(svgPath => {
                const fabricPath = new fabric.Path(svgPath.d, {
                    left: activeObject.left,
                    top: activeObject.top,
                    fill: svgPath.fill || options.fill,
                    stroke: svgPath.stroke || options.stroke,
                    strokeWidth: svgPath.strokeWidth || options.strokeWidth,
                    objectCaching: false
                });
                canvas.add(fabricPath);
            });
        });
    }

    if (activeObject.type === 'group') {
        const roughPaths = [];
        activeObject.forEachObject(obj => {
            const roughPath = applyRoughToObject(obj);
            if (roughPath) roughPaths.push(roughPath);
        });
        addRoughPaths(roughPaths);
    } else {
        const roughPath = applyRoughToObject(activeObject);
        if (roughPath) addRoughPaths([roughPath]);
    }

    // 元のオブジェクトを削除
    canvas.remove(activeObject);
    canvas.renderAll();
}

// コントロールパネルの変更イベントにリスナーを追加
$('rough_roughness').addEventListener('input', applyRoughToActiveObject);
$('rough_bowing').addEventListener('input', applyRoughToActiveObject);
$('rough_stroke').addEventListener('input', applyRoughToActiveObject);
$('rough_strokeWidth').addEventListener('input', applyRoughToActiveObject);
$('rough_fill').addEventListener('input', applyRoughToActiveObject);
$('rough_fillStyle').addEventListener('input', applyRoughToActiveObject);
$('rough_fillWeight').addEventListener('input', applyRoughToActiveObject);
$('rough_hachureAngle').addEventListener('input', applyRoughToActiveObject);
$('rough_hachureGap').addEventListener('input', applyRoughToActiveObject);
$('rough_curveStepCount').addEventListener('input', applyRoughToActiveObject);
$('rough_simplification').addEventListener('input', applyRoughToActiveObject);
$('rough_dashOffset').addEventListener('input', applyRoughToActiveObject);
$('rough_dashGap').addEventListener('input', applyRoughToActiveObject);
$('rough_zigzagOffset').addEventListener('input', applyRoughToActiveObject);
