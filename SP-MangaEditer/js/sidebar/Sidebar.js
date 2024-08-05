document.addEventListener("DOMContentLoaded", function () {
  toggleVisibility("svg-container-vertical");
});

function toggleVisibility(id) {
  var element = document.getElementById(id);
  var icons = document.querySelectorAll("#sidebar i");
  icons.forEach((icon) => {
    if (icon.getAttribute("onclick").includes(`toggleVisibility('${id}')`)) {
      icon.classList.toggle("active", element.style.display === "none");
    } else {
      icon.classList.remove("active");
    }
  });

  if (element.style.display === "none") {
    document.getElementById("svg-container-vertical").style.display = "none";
    document.getElementById("svg-container-landscape").style.display = "none";
    document.getElementById("panel-manager-area").style.display = "none";
    document.getElementById("custom-panel-manager-area").style.display = "none";
    document.getElementById("speech-bubble-area1").style.display = "none";
    document.getElementById("text-area").style.display = "none";
    document.getElementById("tool-area").style.display = "none";
    document.getElementById("manga-effect-area").style.display = "none";
    document.getElementById("dummy-area4").style.display = "none";
    document.getElementById("shape-area").style.display = "none";
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
  adjustCanvasSize();
}
