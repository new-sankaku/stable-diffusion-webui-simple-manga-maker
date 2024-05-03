function addSquare() {
  var square = new fabric.Polygon([
    { x: 0, y: 0 },
    { x: 250, y: 0 },
    { x: 250, y: 250 },
    { x: 0, y: 250 }
  ], {
    left: 50,
    top: 50,
    fill: '#FFFFFF',
    strokeWidth: 2,
    strokeUniform: true,
    stroke: 'black',
    objectCaching: false,
    transparentCorners: false,
    cornerColor: 'Blue',
  });
  canvas.add(square);
}

function changeStrokeWidth(value) {
  canvas.getObjects().forEach(function(obj) {
    obj.set({
      strokeWidth: parseFloat(value),
      strokeUniform: true
    });
  });
  canvas.requestRenderAll();
}

function changeStrokeColor(value) {
  canvas.getObjects().forEach(function(obj) {
    obj.set('stroke', value);
  });
  canvas.requestRenderAll();
}

function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
    y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
  return fabric.util.transformPoint(
    { x: x, y: y },
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  );
}

function getObjectSizeWithStroke(object) {
  var stroke = new fabric.Point(
    object.strokeUniform ? 1 / object.scaleX : 1,
    object.strokeUniform ? 1 / object.scaleY : 1
  ).multiply(object.strokeWidth);
  return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
}

function actionHandler(eventData, transform, x, y) {
  var polygon = transform.target,
    currentControl = polygon.controls[polygon.__corner],
    mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
    polygonBaseSize = getObjectSizeWithStroke(polygon),
    size = polygon._getTransformedDimensions(0, 0),
    finalPointPosition = {
      x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
      y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
    };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
}

function anchorWrapper(anchorIndex, fn) {
  return function (eventData, transform, x, y) {
    var fabricObject = transform.target,
      absolutePoint = fabric.util.transformPoint({
        x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
        y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
      }, fabricObject.calcTransformMatrix()),
      actionPerformed = fn(eventData, transform, x, y),
      newDim = fabricObject._setPositionDimensions({}),
      polygonBaseSize = getObjectSizeWithStroke(fabricObject),
      newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
      newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  }
}

function Edit() {
  var poly = canvas.getActiveObject();
  if (!poly) return;
  
  poly.edit = !poly.edit;
  if (poly.edit) {
    var lastControl = poly.points.length - 1;
    poly.cornerStyle = 'circle';
    poly.cornerColor = 'rgba(0,0,255,0.5)';
    poly.controls = poly.points.reduce(function (acc, point, index) {
      acc['p' + index] = new fabric.Control({
        positionHandler: polygonPositionHandler,
        actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
        actionName: 'modifyPolygon',
        pointIndex: index
      });
      return acc;
    }, {});
  } else {
    poly.cornerStyle = 'rect';
    poly.controls = fabric.Object.prototype.controls;
  }
  poly.hasBorders = !poly.edit;
  canvas.requestRenderAll();
}