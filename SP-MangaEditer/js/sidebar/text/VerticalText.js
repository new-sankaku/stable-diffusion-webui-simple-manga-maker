
document.addEventListener('DOMContentLoaded', function() {
  openButton = $("openWindow");
  openButton.addEventListener("click", function () {
    var selectedFont = $('fontSelector').value;
    var fontsize = $("fontSizeSlider").value
    var fontStrokeWidth = $("fontStrokeWidthSlider").value

    let style = {
      top: 50,
      left: 50,
      fontSize: parseInt(fontsize),
      fontFamily: selectedFont,
      fill: $("textColorPicker").value,
      stroke: $("textOutlineColorPicker").value,
      strokeWidth: parseInt(fontStrokeWidth),
      textAlign: textAlignment,
    };
    
    const cjkText = new VerticalTextbox("new", style);
    canvas.add(cjkText);
  });
});

fabric.VerticalTextbox = VerticalTextbox;