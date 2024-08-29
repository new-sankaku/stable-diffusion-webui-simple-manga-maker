
document.addEventListener('DOMContentLoaded', function() {
  $('knifeModeButton').addEventListener('click', function () {
    changeKnifeMode();
  });
});

function changeKnifeMode(){
  var knifeModeButton = $('knifeModeButton');
  isKnifeMode = !isKnifeMode;
  knifeModeButton.textContent = isKnifeMode ? getText('knifeOff') : getText('knifeOn') ;
  isKnifeMode ? activeClearButton() : nonActiveClearButton();
  isKnifeMode ? knifeModeButton.classList.add("selected") : knifeModeButton.classList.remove("selected") ;
  changeMovement();
}


function changeMovement() {
  canvas.discardActiveObject();
  canvas.forEachObject(function (obj) {
    if (isKnifeMode) {
      obj.set({
        selectable: false
      });
    } else {
      obj.set({
        selectable: true
      });
    }
  });
  canvas.renderAll();
}


canvas.on('mouse:down', function (options) {
  if (!isKnifeMode) return;

  var pointer = canvas.getPointer(options.e);
  var selectedPolygon = getPolygonAtPoint(pointer);

  if (selectedPolygon) {
    // console.log("selectedPolygon");
    isKnifeDrawing = true;
    currentKnifeObject = selectedPolygon;
    startKnifeX = pointer.x;
    startKnifeY = pointer.y;
    // console.log( "startKnifeX, startKnifeY, startKnifeX, startKnifeY", startKnifeX, startKnifeY, startKnifeX, startKnifeY );
    drawLine(startKnifeX, startKnifeY, startKnifeX, startKnifeY);
  } else {
    // console.log("not selectedPolygon");
    isKnifeDrawing = false;
    canvas.discardActiveObject().renderAll();
  }
});

canvas.on('mouse:up', function (options) {
  if (!isKnifeMode || !isKnifeDrawing) return;

  isKnifeDrawing = false;

  if (currentKnifeLine) {
    currentKnifeLine.bringToFront();
    splitPolygon(currentKnifeObject);
  }
  currentKnifeObject = null;
  currentKnifeLine = null;
});
canvas.on('mouse:move', function (options) {
  if (!isKnifeMode || !isKnifeDrawing) return;

  var pointer = canvas.getPointer(options.e);
  var endX = pointer.x;
  var endY = pointer.y;

  var dx = endX - startKnifeX;
  var dy = endY - startKnifeY;
  var angle = Math.atan2(dy, dx) * 180 / Math.PI;

  if ((angle >= (0 - knifeAssistAngle) && angle <= knifeAssistAngle) || angle <= (-180 + knifeAssistAngle) || angle >= (180 - knifeAssistAngle)) {
    endY = startKnifeY;
  } else if ((angle >= (90 - knifeAssistAngle) && angle <= (90 + knifeAssistAngle)) || (angle >= (-90 - knifeAssistAngle) && angle <= (-90 + knifeAssistAngle))) {
    endX = startKnifeX;
  }

  drawLine(startKnifeX, startKnifeY, endX, endY);
});


var knifeAssistAngle = 3;
var currentKnifeObject = null;
var currentKnifeLine = null;
var isKnifeDrawing = false;
var isKnifeMode = false;
var startKnifeX, startKnifeY;
var isHorizontalInt = 1;
var isVerticalInt = 2;
var isErrorInt = -1;



function getScaleX() {
  if (currentKnifeObject && currentKnifeObject.scaleX !== undefined) {
    return currentKnifeObject.scaleX;
  }
  return 1;
}

function getScaleY() {
  if (currentKnifeObject && currentKnifeObject.scaleY !== undefined) {
    return currentKnifeObject.scaleY;
  }
  return 0;
}

function getCurrentLeft() {
  if (currentKnifeObject && currentKnifeObject.left !== undefined) {
    return currentKnifeObject.left;
  }
  return 0;
}

function getCurrentTop() {
  if (currentKnifeObject && currentKnifeObject.top !== undefined) {
    return currentKnifeObject.top;
  }
  return 0;
}


function isInsidePolygon(point, polygon) {
  var scaleX = polygon.scaleX;
  var scaleY = polygon.scaleY;

  var offsetX = polygon.left;
  var offsetY = polygon.top;
  var pointX = point.x,
      pointY = point.y;

  var inside = false;
  var vertices = polygon.points;
  vertices = pointsAdjusted(vertices);



  for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    // スケールとオフセットを適用した頂点座標
    var currentVertexX = (vertices[i].x * scaleX) + offsetX;
    var currentVertexY = (vertices[i].y * scaleY) + offsetY;

    var previousVertexX = (vertices[j].x * scaleX) + offsetX;
    var previousVertexY = (vertices[j].y * scaleY) + offsetY;

    var intersect = ((currentVertexY > pointY) != (previousVertexY > pointY)) &&
                     (pointX < (previousVertexX - currentVertexX) * 
                     (pointY - currentVertexY) / (previousVertexY - currentVertexY) + currentVertexX);

    if (intersect) inside = !inside;
  }
  return inside;
}

function getPolygonAtPoint(point) {
  var foundPolygon = null;
  canvas.forEachObject(function (obj) {

    if (obj.type === 'polygon' && isInsidePolygon(point, obj)) {
      foundPolygon = obj;
    }
  });
  return foundPolygon;
}

//マイナス座標を補正
function pointsAdjusted(points){
  // console.log("points", points);

  var pointsTemp = points.map(point => ({x: point.x, y: point.y}));
  var minX = Math.min(...pointsTemp.map(point => point.x));
  var minY = Math.min(...pointsTemp.map(point => point.y));
  
  pointsTemp.forEach(point => {
    if (minX < 0) {
      point.x += Math.abs(minX);
    } else {
      point.x -= minX;
    }
  
    if (minY < 0) {
      point.y += Math.abs(minY);
    } else {
      point.y -= minY;
    }
  });
  
  // console.log("adjusted pointsTemp", pointsTemp);
  return pointsTemp
}

function drawLine(startKnifeX, startKnifeY, endX, endY) {
  if (!currentKnifeObject) {
    // console.log("nothing currentKnifeObject");
    return;
  }

  var points = currentKnifeObject.points;
  points = pointsAdjusted(points)

  var offsetX = getCurrentLeft();
  var offsetY = getCurrentTop();

  var scaleX = getScaleX();
  var scaleY = getScaleY();

  // console.log("drawLine startKnifeX, startKnifeY, scaleX, scaleY", startKnifeX, startKnifeY, scaleX, scaleY);

  var intersections = [];

  for (var i = 0; i < points.length; i++) {
    var p1 = points[i];
    var p2 = points[(i + 1) % points.length];

    // console.log("p1.x, p1.y, p2.x, p2.y", p1.x, p1.y, p2.x, p2.y);

    var p1x = (p1.x * scaleX) + offsetX;
    var p1y = (p1.y * scaleY) + offsetY;
    var p2x = (p2.x * scaleX) + offsetX;
    var p2y = (p2.y * scaleY) + offsetY;

    // console.log("p1x, p1y, p2x, p2y, startKnifeX, startKnifeY, endX, endY", p1x, p1y, p2x, p2y, startKnifeX, startKnifeY, endX, endY);

    var intersection = calculateIntersection(
      p1x, p1y, p2x, p2y,
      startKnifeX, startKnifeY, endX, endY
    );

    if (intersection) {
      intersections.push(intersection);
    }
  }

  if (intersections.length === 2) {
    // console.log("intersections", intersections);

    var intersection1 = getClosestIntersection(intersections, startKnifeX, startKnifeY);
    var intersection2 = getFurthestIntersection(intersections, startKnifeX, startKnifeY);

    if (intersection1 && intersection2) {
      
      // console.log("intersection1.x, intersection1.y, intersection2.x, intersection2.y", intersection1.x, intersection1.y, intersection2.x, intersection2.y);

      var nextLine = new fabric.Line([intersection1.x, intersection1.y, intersection2.x, intersection2.y], {
        stroke: 'red',
        strokeWidth: 2,
        selectable: false
      });

      
      setNotSave(nextLine);
      canvas.add(nextLine);
 
      if (currentKnifeLine) {
        setNotSave(currentKnifeLine);
        canvas.remove(currentKnifeLine);
      }
      currentKnifeLine = nextLine;
    }
  }
}

function calculateIntersection(x1, y1, x2, y2, startKnifeX, startKnifeY, endX, endY) {
  var a1 = y2 - y1;
  var b1 = x1 - x2;
  var c1 = a1 * x1 + b1 * y1;

  var a2 = endY - startKnifeY;
  var b2 = startKnifeX - endX;
  var c2 = a2 * startKnifeX + b2 * startKnifeY;

  var det = a1 * b2 - a2 * b1;

  if (det === 0) {
    return null; // Parallel lines
  } else {
    var x = (b2 * c1 - b1 * c2) / det;
    var y = (a1 * c2 - a2 * c1) / det;

    if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) {
      return { x: x, y: y };
    } else {
      return null;
    }
  }
}

function getClosestIntersection(intersections, startKnifeX, startKnifeY) {
  var minDistance = Infinity;
  var closestIntersection = null;

  for (var i = 0; i < intersections.length; i++) {
    var intersection = intersections[i];
    if (intersection) {
      var distance = Math.sqrt(Math.pow(intersection.x - startKnifeX, 2) + Math.pow(intersection.y - startKnifeY, 2));

      if (distance < minDistance) {
        minDistance = distance;
        closestIntersection = intersection;
      }
    }
  }

  return closestIntersection;
}

function getFurthestIntersection(intersections, startKnifeX, startKnifeY) {
  var maxDistance = -Infinity;
  var furthestIntersection = null;

  for (var i = 0; i < intersections.length; i++) {
    var intersection = intersections[i];
    if (intersection) {
      var distance = Math.sqrt(Math.pow(intersection.x - startKnifeX, 2) + Math.pow(intersection.y - startKnifeY, 2));

      if (distance > maxDistance) {
        maxDistance = distance;
        furthestIntersection = intersection;
      }
    }
  }
  return furthestIntersection;
}

// 重複を削除する関数
function removeDuplicates(polygon) {
  let uniqueCoords = new Set();
  let filteredPolygon = polygon.filter(coord => {
    let coordStr = `${coord.x},${coord.y}`;
    if (!uniqueCoords.has(coordStr)) {
      uniqueCoords.add(coordStr);
      return true;
    }
    return false;
  });

  return filteredPolygon;
}

function isSplitPoint(splitLine, tolerance, point) {

  splitY = splitLine.y;
  splitX = splitLine.x;

  splitYPlus = splitY + tolerance;
  splitYMinus = splitY - tolerance;
  splitXPlus = splitX + tolerance;
  splitXMinus = splitX - tolerance;

  if (point.y >= splitYMinus && point.y <= splitYPlus) {
    if (point.x >= splitXMinus && point.x <= splitXPlus) {
      return true;
    }
  }
  return false;
}



function isHorizontal(resultLine, splitLine) {
  if (resultLine.length === 2) {
    let dx = splitLine[1].x - splitLine[0].x;
    let dy = splitLine[1].y - splitLine[0].y;
    // let angle = Math.atan2(dy, dx);
    let isHorizontal = Math.abs(dy) <= Math.abs(dx);

    if (isHorizontal) {
      return isHorizontalInt;
    } else {
      return isVerticalInt;
    }
  } else {
    return isErrorInt;
  }
}

function adjustShapesBySplitLineDirection(resultLine, splitLine) {
  const tolerance = 5;
  var adjustment = $('knifePanelSpaceSize').value;
  adjustment = adjustment / 2;

  var offsetX = getCurrentLeft();
  var offsetY = getCurrentTop();

  if (resultLine.length === 2) {
    let poly1 = resultLine[0];
    let poly2 = resultLine[1];

    let dx = splitLine[1].x - splitLine[0].x;
    let dy = splitLine[1].y - splitLine[0].y;

    // 角度を計算（度数法）
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // 角度に基づいて水平または垂直を判断
    // let isHorizontal = (angle > -45 && angle < 45) || (angle > 135 || angle < -135);
    // console.log("分割線の向き:", isHorizontal ? "水平なので上下に分割" : "垂直なので左右に分割");

    // 分割線の中央点を計算
    let center1 = calculatePolygonCentroid(poly1);
    let center2 = calculatePolygonCentroid(poly2);

    console.log("ポリゴン1の中心点:", center1);
    console.log("ポリゴン2の中心点:", center2);

    let isHorizontal = Math.abs(center1.y - center2.y) > Math.abs(center1.x - center2.x);
    console.log("分割線の向き:", isHorizontal ? "水平なので上下に分割" : "垂直なので左右に分割");


    if (isHorizontal) {
      // 水平の場合、Y軸のみ調整（X座標も範囲内かチェック）
      resultLine[0] = poly1.map(point => {
        if (isSplitPoint(splitLine[0], tolerance, point) || isSplitPoint(splitLine[1], tolerance, point)) {
          point.y -= adjustment;
          return { x: point.x, y: point.y };
        }
        return { x: point.x, y: point.y };
      });

      resultLine[1] = poly2.map(point => {
        if (isSplitPoint(splitLine[0], tolerance, point) || isSplitPoint(splitLine[1], tolerance, point)) {
          point.y += adjustment;
          return { x: point.x, y: point.y }; 
        }
        return { x: point.x, y: ((point.y - offsetY)) + offsetY };
      });
    } else {
      // 垂直の場合、X軸のみ調整（Y座標も範囲内かチェック）
      resultLine[0] = poly1.map(point => {
        if (isSplitPoint(splitLine[0], tolerance, point) || isSplitPoint(splitLine[1], tolerance, point)) {
          point.x -= adjustment;
          return { x: point.x, y: point.y };
        }
        return { x: point.x, y: point.y };
      });

      resultLine[1] = poly2.map(point => {
        if (isSplitPoint(splitLine[0], tolerance, point) || isSplitPoint(splitLine[1], tolerance, point)) {
          point.x += adjustment;
          return { x: point.x, y: point.y };
        }
        return { x: ((point.x - offsetX)) + offsetX, y: point.y };
      });
    }
  }
}


function calculatePolygonCentroid(polygon) {
  let xSum = 0;
  let ySum = 0;
  let signedArea = 0;
  let a = 0;  // Partial signed area

  for (let i = 0; i < polygon.length; i++) {
    let x0 = polygon[i].x;
    let y0 = polygon[i].y;
    let x1 = polygon[(i + 1) % polygon.length].x;
    let y1 = polygon[(i + 1) % polygon.length].y;

    a = x0 * y1 - x1 * y0;
    signedArea += a;
    xSum += (x0 + x1) * a;
    ySum += (y0 + y1) * a;
  }

  signedArea *= 0.5;
  xSum /= (6 * signedArea);
  ySum /= (6 * signedArea);

  return { x: xSum, y: ySum };
}


function splitPolygon(polygon) {
  if (!polygon || !polygon.points) {
    return;
  }
  var points = pointsAdjusted(polygon.points)

  var newPolygon1Points = [];
  var newPolygon2Points = [];

  if (currentKnifeLine) {
    var offsetX = getCurrentLeft();
    var offsetY = getCurrentTop();

    var scaleX = getScaleX();
    var scaleY = getScaleY();

    var pointsStr = points.map(function (point) {
      return ((point.x *scaleX) + offsetX) + " " + ((point.y*scaleY) + offsetY);
    });
    pointsStr.push(pointsStr[0]);

    var splitPoint1 = [currentKnifeLine.x1, currentKnifeLine.y1];
    var splitPoint2 = [currentKnifeLine.x2, currentKnifeLine.y2];

    // JSTSライブラリを使用して多角形と分割線を読み込む
    var reader = new jsts.io.WKTReader();
    var poly = reader.read('POLYGON((' + pointsStr.join(', ') + '))');
    var line = reader.read('LINESTRING(' + splitPoint1.join(' ') + ', ' + splitPoint2.join(' ') + ')');

    // 分割を試みる
    var union = poly.getExteriorRing().union(line);
    var polygonizer = new jsts.operation.polygonize.Polygonizer();
    polygonizer.add(union);

    var polygons = polygonizer.getPolygons();
    var resultLine = [];

    for (var i = polygons.iterator(); i.hasNext();) {
      var polygonTemp = i.next();
      var coords = polygonTemp.getCoordinates().map(coord => ({ x: coord.x, y: coord.y }));
      resultLine.push(coords);
    }

    // 分割線が交点を持たない場合、分割線を延長して再試行
    if (resultLine.length !== 2) {
      var extendLength = 10; // 延長するピクセル数
      var dx = currentKnifeLine.x2 - currentKnifeLine.x1;
      var dy = currentKnifeLine.y2 - currentKnifeLine.y1;
      var length = Math.sqrt(dx * dx + dy * dy);
      var extendX = (dx / length) * extendLength;
      var extendY = (dy / length) * extendLength;

      var extendedLine = reader.read('LINESTRING(' + (splitPoint1[0] - extendX) + ' ' + (splitPoint1[1] - extendY) + ', ' + (splitPoint2[0] + extendX) + ' ' + (splitPoint2[1] + extendY) + ')');
      union = poly.getExteriorRing().union(extendedLine);
      polygonizer = new jsts.operation.polygonize.Polygonizer();
      polygonizer.add(union);

      polygons = polygonizer.getPolygons();
      resultLine = [];
      for (var i = polygons.iterator(); i.hasNext();) {
        var polygonTemp = i.next();
        var coords = polygonTemp.getCoordinates().map(coord => ({ x: coord.x, y: coord.y }));
        resultLine.push(coords);
      }
    }

    var isSplit = -1;

    if (resultLine.length === 2) {
      resultLine[0] = removeDuplicates(resultLine[0]);
      resultLine[1] = removeDuplicates(resultLine[1]);

      // 分割線の座標を配列に格納します。
      var splitLine = [
        { x: currentKnifeLine.x1, y: currentKnifeLine.y1 },
        { x: currentKnifeLine.x2, y: currentKnifeLine.y2 }
      ];

      isSplit = isHorizontal(resultLine, splitLine);
      adjustShapesBySplitLineDirection(resultLine, splitLine);
    } else {
      setNotSave(currentKnifeLine);
      canvas.remove(currentKnifeLine);
      return;
    }

    newPolygon1Points = resultLine[0];
    newPolygon2Points = resultLine[1];

    var minX = 0;
    var minY = 0;

    var adjustedPolygon1Points = newPolygon1Points.map(function (point) {
      return {
        x: point.x - offsetX - minX,
        y: point.y - offsetY - minY
      };
    });

    var adjustedPolygon2Points = newPolygon2Points.map(function (point) {
      return {
        x: point.x - offsetX - minX,
        y: point.y - offsetY - minY
      };
    });

    var minX = Math.min(...adjustedPolygon2Points.map(v => v.x));
    var minY = Math.min(...adjustedPolygon2Points.map(v => v.y));

    var adjustedPolygon2Points2 = adjustedPolygon2Points.map(function (point) {
      return {
        x: point.x - minX,
        y: point.y - minY
      };
    });

    var polygon1MinX = Math.min(...newPolygon1Points.map(point => point.x));
    var polygon1MinY = Math.min(...newPolygon1Points.map(point => point.y));

    var polygon2MinX = Math.min(...newPolygon2Points.map(point => point.x));
    var polygon2MinY = Math.min(...newPolygon2Points.map(point => point.y));

    var left = 0;
    var top = 0;

    var scaleX = getScaleX();
    var scaleY = getScaleY();
    var scaleX2 = getScaleX();
    var scaleY2 = getScaleY();

    if (isSplit == isHorizontalInt) {
      top = polygon2MinY;
      left = polygon2MinX;
      scaleY = 1;
      scaleY2 = 1;
    } else if (isSplit == isVerticalInt) {
      top = polygon2MinY;
      left = polygon2MinX;
      scaleX = 1;
      scaleX2 = 1;
    } else {
      setNotSave(currentKnifeLine);
      canvas.remove(currentKnifeLine);
      return;
    }

    var strokeWidthScale = canvas.width / 700;
    var strokeWidth = 2 * strokeWidthScale;


    var polygon1 = new fabric.Polygon(adjustedPolygon1Points, {
      left: polygon1MinX,
      top: polygon1MinY,
      fill: polygon.fill,
      opacity: polygon.opacity,
      stroke: polygon.stroke,
      strokeWidth: polygon.strokeWidth,
      isPanel: true,
      scaleX: 1,
      scaleY: 1,
      selectable: false
    });

    var polygon2 = new fabric.Polygon(adjustedPolygon2Points2, {
      left: left,
      top: top,
      fill: polygon.fill,
      opacity: polygon.opacity,
      stroke: polygon.stroke,
      strokeWidth: polygon.strokeWidth,
      isPanel: true,
      scaleX: 1,
      scaleY: 1,
      selectable: false
    });

    setText2ImageInitPrompt(polygon1);
    setText2ImageInitPrompt(polygon2);

    canvas.remove(setNotSave(currentKnifeLine));
    canvas.remove(setNotSave(polygon));
    canvas.add(setNotSave(polygon1));
    canvas.add(setNotSave(polygon2));
    saveStateByManual();

    currentKnifeObject = null;
    currentKnifeLine = null;
  }
}