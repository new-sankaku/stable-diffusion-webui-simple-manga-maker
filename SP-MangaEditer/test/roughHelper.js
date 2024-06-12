
function getRoughValue() {

  const roughOptions = {
    roughness: parseFloat(document.getElementById('roughness').value),
    bowing: parseFloat(document.getElementById('bowing').value),
    stroke: document.getElementById('stroke').value,
    strokeWidth: parseFloat(document.getElementById('strokeWidth').value),
    fill: document.getElementById('fill').value === '#ffffff' ? 'none' : document.getElementById('fill').value,
    fillStyle: document.getElementById('fillStyle').value,
    fillWeight: parseFloat(document.getElementById('fillWeight').value),
    hachureAngle: parseFloat(document.getElementById('hachureAngle').value),
    hachureGap: parseFloat(document.getElementById('hachureGap').value),
    curveStepCount: parseFloat(document.getElementById('curveStepCount').value),
    simplification: parseFloat(document.getElementById('simplification').value),
    dashOffset: parseFloat(document.getElementById('dashOffset').value),
    dashGap: parseFloat(document.getElementById('dashGap').value),
    zigzagOffset: parseFloat(document.getElementById('zigzagOffset').value),
};

return roughOptions;
}


function setRoughValueText( roughOptions ) {

  
  document.getElementById('roughnessValue').textContent = roughOptions.roughness;
  document.getElementById('bowingValue').textContent = roughOptions.bowing;
  document.getElementById('strokeWidthValue').textContent = roughOptions.strokeWidth;
  document.getElementById('fillWeightValue').textContent = roughOptions.fillWeight;
  document.getElementById('hachureAngleValue').textContent = roughOptions.hachureAngle;
  document.getElementById('hachureGapValue').textContent = roughOptions.hachureGap;
  document.getElementById('curveStepCountValue').textContent = roughOptions.curveStepCount;
  document.getElementById('simplificationValue').textContent = roughOptions.simplification;
  document.getElementById('dashOffsetValue').textContent = roughOptions.dashOffset;
  document.getElementById('dashGapValue').textContent = roughOptions.dashGap;
  document.getElementById('zigzagOffsetValue').textContent = roughOptions.zigzagOffset;
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
