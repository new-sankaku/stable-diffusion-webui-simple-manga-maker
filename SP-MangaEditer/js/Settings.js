var canvas = new fabric.Canvas("mangaImageCanvas");
canvas.backgroundColor = "white";

var canvasFullWidth = canvas.width;
var canvasFullHeight = canvas.height;
var maxAreaWidth = canvasFullWidth - 100;
var maxAreaHeight = canvasFullHeight - 100;
var clipAreaCoords = { left: 0, top: 0, width: canvas.width, height: canvas.height };
var svgPagging = 50;


