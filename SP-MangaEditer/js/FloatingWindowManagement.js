function makeDraggable(element) {
  let posX = 0, posY = 0, posInitX = 0, posInitY = 0;
  element.onmousedown = function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
          return;
      }
      e = e || window.event;
      e.preventDefault();
      posInitX = e.clientX;
      posInitY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
  };

  function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      posX = posInitX - e.clientX;
      posY = posInitY - e.clientY;
      posInitX = e.clientX;
      posInitY = e.clientY;
      element.style.top = (element.offsetTop - posY) + "px";
      element.style.left = (element.offsetLeft - posX) + "px";
  }

  function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
  }
}



function closeFloatingWindowPromptClass() {
  const floatingWindow = document.querySelector('.floating-windowPromptClass');
  document.body.removeChild(floatingWindow);
}
