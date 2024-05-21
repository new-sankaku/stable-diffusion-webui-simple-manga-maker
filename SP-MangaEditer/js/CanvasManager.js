var initialCanvasWidth = 0;
var initialCanvasHeight = 0;
var aspectRatio = 0;

let resizeTimer;
function initResizeCanvas(event) {
  event.stopPropagation();
  event.preventDefault();
  var container = document.getElementById("canvas-container");
  var containerWidth = container.clientWidth;
  var containerHeight = container.clientHeight;

  if (
    containerWidth < minCanvasSizeWidth ||
    containerHeight < minCanvasSizeHeight
  ) {
    return;
  }

  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = setTimeout(function () {
    resizeCanvasByNum(containerWidth, containerHeight);
  }, 15);
}

function resizeCanvasByNum(newWidth, newHeight) {
  canvas.setWidth(newWidth);
  canvas.setHeight(newHeight);
  initialCanvasWidth = canvas.getWidth();
  initialCanvasHeight = canvas.getHeight();
  aspectRatio = initialCanvasWidth / initialCanvasHeight;
  canvas.renderAll();
}

function resizeCanvas(newWidth, newHeight) {

  canvas.setDimensions({ width: newWidth, height: newHeight });
  canvas.getObjects().forEach((obj) => {
    
    var scaleX = newWidth / obj.initial.canvasWidth;
    var scaleY = newHeight / obj.initial.canvasHeight;

    // console.log("resizeCanvas newWidth ",newWidth, ":", newHeight );
    // console.log("resizeCanvas initial ",obj.initial.canvasWidth, ":", obj.initial.canvasHeight );
    // console.log("resizeCanvas scaleX ",scaleX, ":", scaleY );

    obj.set({
      scaleX: obj.initial.scaleX * scaleX,
      scaleY: obj.initial.scaleY * scaleY,
      left: obj.initial.left * scaleX,
      top: obj.initial.top * scaleY,
      strokeWidth: obj.initial.strokeWidth * scaleX,
    });

    if (obj.clipPath) {
      scaleX = newWidth / obj.clipPath.initial.canvasWidth;
      scaleY = newHeight / obj.clipPath.initial.canvasHeight;

      const clipPath = obj.clipPath;
      clipPath.set({
        scaleX: obj.clipPath.initial.scaleX * scaleX,
        scaleY: obj.clipPath.initial.scaleY * scaleY,
        left: obj.clipPath.initial.left * scaleX,
        top: obj.clipPath.initial.top * scaleY,
      });
      clipPath.setCoords();
    }
    saveInitialState(obj);
    obj.setCoords();
  });
  canvas.renderAll();
}

function forcedAdjustCanvasSize() {
  adjustCanvasSize( true );
}

function adjustCanvasSize() {
  adjustCanvasSize( false );
}

function adjustCanvasSize( forced ) {
  var container = document.getElementById("canvas-container");
  var windowWidth = container.clientWidth;
  var windowHeight = container.clientHeight;

  const windowAspectRatio = windowWidth / windowHeight;
  let newWidth, newHeight;
  if (windowAspectRatio > aspectRatio) {
    newHeight = windowHeight;
    newWidth = windowHeight * aspectRatio;
  } else {
    newWidth = windowWidth;
    newHeight = windowWidth / aspectRatio;
  }

  if( forced ){
    //next
    // console.log( "adjustCanvasSize forced true" );
  }else if (newWidth == canvas.getWidth() && newHeight == canvas.getHeight()) {
    // console.log( "adjustCanvasSize forced false" );
    return;
  }

  resizeCanvas(newWidth, newHeight);
}

window.addEventListener("load", initResizeCanvas);
window.addEventListener("resize", adjustCanvasSize);

function saveInitialState(obj) {
  obj.initial = {
    left: obj.left,
    top: obj.top,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    strokeWidth: obj.strokeWidth,
    canvasWidth: canvas.getWidth(),
    canvasHeight: canvas.getHeight(),
  };

  if (obj.clipPath) {
    obj.clipPath.initial = {
      left: obj.clipPath.left,
      top: obj.clipPath.top,
      scaleX: obj.clipPath.scaleX,
      scaleY: obj.clipPath.scaleY,
      canvasWidth: canvas.getWidth(),
      canvasHeight: canvas.getHeight(),
    };
  }
}

canvas.on("object:added", (e) => {
  // console.log( "object:added" );
  const obj = e.target;
  if (!obj.initial) {
    saveInitialState(obj);
  }
  forcedAdjustCanvasSize();
});

canvas.on("object:modified", (e) => {
  // console.log( "object:modified" );
  const obj = e.target;
  saveInitialState(obj);
});



function resizeCanvasToObject(objectWidth, objectHeight) {
  var container = document.getElementById("canvas-container");
  var containerWidth = container.clientWidth;
  var containerHeight = container.clientHeight;

  var objectAspectRatio = objectWidth / objectHeight;
  var containerAspectRatio = containerWidth / containerHeight;

  if (objectAspectRatio > containerAspectRatio) {
    var newHeight = containerWidth / objectAspectRatio;
    canvas.setDimensions({ width: containerWidth, height: newHeight });
    initialCanvasWidth = containerWidth;
    initialCanvasHeight = newHeight;
    aspectRatio = initialCanvasWidth / initialCanvasHeight;
  } else {
    var newWidth = containerHeight * objectAspectRatio;
    canvas.setDimensions({ width: newWidth, height: containerHeight });
    initialCanvasWidth = newWidth;
    initialCanvasHeight = containerHeight;
    aspectRatio = initialCanvasWidth / initialCanvasHeight;
  }

  canvas.renderAll();
  
}