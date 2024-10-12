
document.addEventListener('DOMContentLoaded', function() {
  openButton = $("openWindow");
  openButton.addEventListener("click", function () {
    let style = {
      "fill": "#292929",
      "editable": true,
      "fontSize": 30,
      "left": 100,
      "top": 50,
      "width": 100,
      "height": 100
    };
    
    const cjkText = new VerticalTextbox("new", style);
    canvas.add(cjkText);
  });
});

fabric.VerticalTextbox = VerticalTextbox;