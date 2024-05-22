fabric.Object.NUM_FRACTION_DIGITS = 100;

const minCanvasSizeWidth = 600;
const minCanvasSizeHeight = 400;

var canvas = new fabric.Canvas("mangaImageCanvas", {
  renderOnAddRemove: false,
  skipOffscreen: false,
  renderer: fabric.isWebglSupported ? "webgl" : "canvas",
});
canvas.backgroundColor = "white";

var clipAreaCoords = {
  left: 0,
  top: 0,
  width: canvas.width,
  height: canvas.height,
};

var svgPagging = 20;
var stableDiffusionWebUIPort = 7860;
var stableDiffusionWebUIHost = "127.0.0.1";

const text2img_basePrompt = {
  text2img_prompt: "masterpiece, best quality, 1girl, simple background, ",
  text2img_negativePrompt: "low quality, worst quality, jpeg, normal quality, ",
  text2img_seed: -1,
  text2img_cfg_scale: 7,
  text2img_width: 1024,
  text2img_height: 1024,
  text2img_samplingMethod: "Euler a",
  text2img_samplingSteps: 20,
  text2img_scheduler: "Automatic",
  text2img_model: "",
  text2img_hr_upscaler: "None",
  text2img_basePrompt_hr_scale: "1.3",
  text2img_basePrompt_hr_step: 20,
  text2img_basePrompt_hr_denoising_strength: "0.7",
};

const text2img_initPrompt = {
  isPanel: true,
  text2img_prompt: "",
  text2img_negativePrompt: "",
  text2img_seed: -2,
  text2img_width: 0,
  text2img_height: 0,
};
