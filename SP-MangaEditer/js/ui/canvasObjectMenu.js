const languageSelector = $('fabricjs-language-selector');
let lastClickType = null;
let objectMenu = null;
let canvasMenuIndex = 100000;

function createObjectMenu() {
  if (objectMenu) {
    objectMenu.remove();
  }
  objectMenu = document.createElement('div');
  objectMenu.className = 'fabricjs-object-menu';
  objectMenu.style.display = 'none';
  document.body.appendChild(objectMenu);
  objectMenu.addEventListener('click', handleMenuClick);
}

function updateObjectMenuPosition() {
  if (!objectMenu) {
    return;
  }
  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    return;
  }

  const boundingRect = activeObject.getBoundingRect(true, true);
  const menuPadding = 20;
  const canvasRect = canvas.getElement().getBoundingClientRect();
  const canvasOffsetLeft = canvasRect.left;
  const canvasOffsetTop = canvasRect.top;
  const canvasWidth = canvasRect.width;
  const canvasHeight = canvasRect.height;

  // キャンバスのスケールを考慮した計算
  let left = canvasOffsetLeft + boundingRect.left * canvasContinerScale + boundingRect.width * canvasContinerScale + menuPadding;
  let top = canvasOffsetTop + boundingRect.top * canvasContinerScale;
  
  if (left + objectMenu.offsetWidth > canvasOffsetLeft + canvasWidth) {
    left = Math.min(
      canvasOffsetLeft + canvasWidth + 5,
      window.innerWidth - objectMenu.offsetWidth
    );
  } else if (left < canvasOffsetLeft) {
    left = Math.max(canvasOffsetLeft - 5, 0);
  }

  top = Math.max(top, canvasOffsetTop - 5);
  if (top + objectMenu.offsetHeight > canvasOffsetTop + canvasHeight) {
    top = Math.min(
      canvasOffsetTop + canvasHeight + 5,
      window.innerHeight - objectMenu.offsetHeight
    );
  }

  objectMenu.style.left = `${left}px`;
  objectMenu.style.top = `${top}px`;
}

function showObjectMenu(clickType) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    return;
  }
  if (!objectMenu) {
    createObjectMenu();
  }

  let menuItems = [];
  // 'visible',     'settings', 'generate', 'edit', 'delete', 
  // 'copyAndPast', 'font', 'moveUp', 'moveDown', 'addPoint', 
  // 'removePoint', 'selectClear', 'knife'
  // 'rembg', 'panelIn'

  var visible   = activeObject.visible ? 'visibleOff' : 'visibleOn';
  var movement  = !activeObject.selectable ? 'movementOn' : 'movementOff';

  if (isPanel(activeObject)) {
    var edit  = activeObject.edit ? 'editOff'  : 'editOn';
    var knife = isKnifeMode       ? 'knifeOff' : 'knifeOn';
    menuItems = clickType === 'left' ? [] : [visible, movement, edit, knife];

    if( hasRole( AI_ROLES.Text2Image )){ menuItems.push('generate') }

    menuItems.push('delete');
  } else if (isImage(activeObject)) {
    menuItems = clickType === 'left' ? [] : [visible, movement];
    
    if( hasRole( AI_ROLES.Image2Image )){ menuItems.push('generate') }
    if( hasRole( AI_ROLES.RemoveBG )){ menuItems.push('rembg') }
    menuItems.push('delete');
    if( haveClipPath(activeObject) ){
      menuItems.push('clearAllClipPaths');
    }else{
      menuItems.push('panelIn');
      menuItems.push("canvasFit");
    }
  } else if (isText(activeObject)) {
    menuItems = clickType === 'left' ? [] : [visible, movement, 'delete'];
    if( haveClipPath(activeObject) ){
      menuItems.push('clearAllClipPaths');
    }else{
      menuItems.push('panelInNotFit');
    }
  } else {
    menuItems = clickType === 'left' ? [] : [visible, movement, 'delete'];
    if( haveClipPath(activeObject) ){
      menuItems.push('clearAllClipPaths');
    }else{
      menuItems.push('panelInNotFit');
    }
  }
  menuItems.push('selectClear');

  if (menuItems.length === 0) {
    return;
  }

  let menuContent = '';
  menuItems.forEach(item => {
    menuContent += `<button id="fabricjs-${item}-btn">${getText(item)}</button>`;
  });

  objectMenu.innerHTML = menuContent;
  objectMenu.classList.add('active');
  objectMenu.style.display = 'flex';
  updateObjectMenuPosition();
  lastClickType = clickType;
}

function handleMenuClick(e) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    return;
  }

  const action = e.target.id.replace('fabricjs-', '').replace('-btn', '');

  switch (action) {
    case 'canvasFit':
      fitImageToCanvas(activeObject);
      break;
      case 'panelIn':
        var canvasX = activeObject.left + (activeObject.width * activeObject.scaleX) / 2;
        var canvasY = activeObject.top + (activeObject.height * activeObject.scaleY) / 2;
        putImageInFrame(activeObject, canvasX, canvasY, true, true);
        updateLayerPanel();
        break;
      case 'panelInNotFit':
        var canvasX = activeObject.left + (activeObject.width * activeObject.scaleX) / 2;
        var canvasY = activeObject.top + (activeObject.height * activeObject.scaleY) / 2;
        putImageInFrame(activeObject, canvasX, canvasY, true, true, false);
        updateLayerPanel();
        break;
    case 'visibleOn':
    case 'visibleOff':
      visibleChange(activeObject);
      break;

    case 'movementOn':
    case 'movementOff':
      moveLockChange(activeObject);
      break;

    case 'rembg':
      var spinner = createSpinner(canvasMenuIndex);
      sdWebUI_RembgProcessQueue(activeObject, spinner.id);
      break;
    case 'generate':
      if (isPanel(activeObject)) {
        var spinner = createSpinner(canvasMenuIndex);
        T2I( activeObject, spinner );
      } else if (isImage(activeObject)) {
        var spinner = createSpinner(canvasMenuIndex);
        I2I( activeObject, spinner );
      }
      break;
    case 'selectClear':
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      return;
    case 'delete':
      canvas.remove(activeObject);
      canvas.renderAll();
      updateLayerPanel();
      return;
    case 'copyAndPast':
      activeObject.clone(function (cloned) {
        cloned.set({
          left: cloned.left + 10,
          top: cloned.top + 10
        });
        canvas.add(cloned);
      });
      break;
    case 'moveUp':
      canvas.bringForward(activeObject);
      break;
    case 'moveDown':
      canvas.sendBackwards(activeObject);
      break;
    case 'editOff':
    case 'editOn':
      if (isPanel(activeObject)) {
        Edit();
      }
      break;

    case 'knifeOff':
    case 'knifeOn':
      if (isPanel(activeObject)) {
        changeKnifeMode();
      }
      break;
    
    case 'font':
      if (activeObject instanceof fabric.IText) {
        const newFont = activeObject.fontFamily === 'Arial' ? 'Times New Roman' : 'Arial';
        activeObject.set('fontFamily', newFont);
      }
      break;
    case 'addPoint':
      if (activeObject instanceof fabric.Polygon) {
        let points = activeObject.points;
        let newPoint = {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2
        };
        points.splice(1, 0, newPoint);
        activeObject.set({ points: points });
      }
      break;
    case 'removePoint':
      if (activeObject instanceof fabric.Polygon && activeObject.points.length > 3) {
        let points = activeObject.points;
        points.pop();
        activeObject.set({ points: points });
      }
      break;

    case 'clearAllClipPaths':
    case 'clearTopClipPath':
    case 'clearBottomClipPath':
    case 'clearRightClipPath':
    case 'clearLeftClipPath':
      removeClipPath(activeObject, action);
    break;
  }
  canvas.renderAll();
  closeMenu();
}

function closeMenu() {
  if (objectMenu) {
    objectMenu.classList.remove('active');
    objectMenu.style.display = 'none';
  }
}

canvas.on('selection:created', () => {
  closeMenu();
});
canvas.on('selection:updated', () => {
  closeMenu();
});

canvas.wrapperEl.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  const pointer = canvas.getPointer(e);
  const clickedObject = canvas.findTarget(e, false);
  if (clickedObject) {
    canvas.setActiveObject(clickedObject);
    canvas.renderAll(); 
    showObjectMenu('right');
  } else {
    canvas.discardActiveObject();
    closeMenu();
  }
});

canvas.wrapperEl.addEventListener('mousedown', function (e) {
  if (e.button === 0 && lastClickType === 'right') {
    closeMenu();
    lastClickType = 'left';
  }
});

canvas.on('selection:cleared', function () {
  closeMenu();
});

canvas.on('object:moving', updateObjectMenuPosition);
canvas.on('object:scaling', updateObjectMenuPosition);
canvas.on('object:rotating', updateObjectMenuPosition);
canvas.on('after:render', updateObjectMenuPosition);
createObjectMenu();
