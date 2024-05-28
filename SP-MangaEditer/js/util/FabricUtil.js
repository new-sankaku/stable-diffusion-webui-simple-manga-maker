






function isPanel(activeObject) {
  return (activeObject && activeObject.isPanel );
}

function isImage(activeObject) {
  return (activeObject && (activeObject.type === "image") );
}

function isText(activeObject){
  return (activeObject && (activeObject.type === "text" || activeObject.type === "textbox"|| activeObject.type === "verticalText") ) ;
}

function isVerticalText(activeObject) {
  return (activeObject && (activeObject.type === "verticalText") );
}

function isLine(activeObject){
  return (activeObject && activeObject.type === 'line') ;
}

function isGroup(activeObject){
  return (activeObject && activeObject.type === 'group') ;
}

function isShapes(activeObject){
  return (activeObject && ['rect', 'circle', 'triangle', 'polygon'].includes(activeObject.type)) ;
}




