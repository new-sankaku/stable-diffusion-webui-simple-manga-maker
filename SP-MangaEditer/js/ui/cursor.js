function setCursor(mode) {
  
  switch(mode) {
    case 'eraser':
      canvas.defaultCursor = 'url(02_images_svg/Cursor/eraser.svg), default';;
      canvas.hoverCursor = 'url(02_images_svg/Cursor/eraser.svg), default';;
      break;
    case 'knife':
      canvas.defaultCursor = 'url(02_images_svg/Cursor/knife.svg), default';;
      canvas.hoverCursor = 'url(02_images_svg/Cursor/knife.svg), default';;
      break;
    case 'pen':
      console.log("setCursor", "pen");
      canvas.defaultCursor = 'url(02_images_svg/Cursor/pen.svg)';;
      canvas.hoverCursor = 'url(02_images_svg/Cursor/pen.svg)';;
      break;
    case 'pin':
      canvas.defaultCursor = 'url(02_images_svg/Cursor/pin.svg), default';;
      canvas.hoverCursor = 'url(02_images_svg/Cursor/pin.svg), default';;
      break;
    case 'point':
      canvas.defaultCursor = 'url(02_images_svg/Cursor/point.svg), default';;
      canvas.hoverCursor = 'url(02_images_svg/Cursor/point.svg), default';;
      break;
    case 'clear':
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'default';
      break;
  }
}