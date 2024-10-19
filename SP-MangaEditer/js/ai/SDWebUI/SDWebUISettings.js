
document.addEventListener('DOMContentLoaded', function () {
  const hostInput = $('Stable_Diffusion_WebUI_apiHost');
  const portInput = $('Stable_Diffusion_WebUI_apiPort');
  hostInput.value = sdWebUIHost;
  portInput.value = sdWebUIPort;

  hostInput.addEventListener('change', function () {
    sdWebUIHost = this.value;
    sdWebUI_reBuild_URL();
  });

  portInput.addEventListener('change', function () {
    sdWebUIPort = this.value;;
    sdWebUI_reBuild_URL();
  });
});

var sdWebUI_API_ping = '';
var sdWebUI_API_sampler = '';
var sdWebUI_API_scheduler = '';
var sdWebUI_API_upscaler = '';
var sdWebUI_API_sdModel = '';
var sdWebUI_API_T2I = '';
var sdWebUI_API_I2I = '';
var sdWebUI_API_options = '';
var sdWebUI_API_samplers = '';
var sdWebUI_API_interrogate = '';
var sdWebUI_API_rembg = '';
var sdWebUI_API_adetilerModel = '';

function sdWebUI_reBuild_URL() {
  sdWebUI_API_ping = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/internal/ping'
  sdWebUI_API_sampler = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/samplers'
  sdWebUI_API_scheduler = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/schedulers'
  sdWebUI_API_upscaler = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/upscalers'
  sdWebUI_API_sdModel = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/sd-models'
  sdWebUI_API_T2I = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/txt2img'
  sdWebUI_API_I2I = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/img2img'
  sdWebUI_API_options = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/options'
  sdWebUI_API_samplers = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/samplers'
  sdWebUI_API_interrogate = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/interrogate'
  sdWebUI_API_rembg = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/rembg'
  sdWebUI_API_adetilerModel = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/adetailer/v1/ad_model'
}
sdWebUI_reBuild_URL();


function rembgRequestData(layer) {
  const requestData = {
    "input_image": "",
    "model": "u2net",
    "return_mask": false,
    "alpha_matting": false,
    "alpha_matting_foreground_threshold": 240,
    "alpha_matting_background_threshold": 10,
    "alpha_matting_erode_size": 10
  };
  return requestData;
}

function baseRequestData(layer) {
  var seed = -1;
  var width = -1;
  var height = -1;

  if (layer.text2img_seed == -2) {
    seed = basePrompt.text2img_seed;
  } else if (layer.text2img_seed > -1) {
    seed = layer.text2img_seed;
  }

  if(isImage(layer)){
    width  = layer.width  * layer.scaleX * layer.img2imgScale;
    height = layer.height * layer.scaleY * layer.img2imgScale;
    console.log( "widthLayer", layer.width );
    console.log( "scaleX", layer.scaleX );
    console.log( "heightLayer", layer.height );
    console.log( "scaleY", layer.caleY );
    console.log( "layer.img2imgScale", layer.img2imgScale );
    console.log( "width", width );
    console.log( "height", height );

  }else{
    if (layer.text2img_width <= 0) {
      width = basePrompt.text2img_width;
    } else {
      width = layer.text2img_width;
    }
    if (layer.text2img_height <= 0) {
      height = basePrompt.text2img_height;
    } else {
      height = layer.text2img_height;
    }  
  }


  const requestData = {
    "prompt": basePrompt.text2img_prompt + ", " + layer.text2img_prompt,
    "negative_prompt": basePrompt.text2img_negative + ", " + layer.text2img_negative,
    "seed": seed,
    "width": width,
    "height": height,
    "sampler_name": basePrompt.text2img_samplingMethod,
    "steps": basePrompt.text2img_samplingSteps,
    "cfg_scale": basePrompt.text2img_cfg_scale,
    "scheduler": basePrompt.text2img_scheduler,
    "do_not_save_grid": true,
    "save_images": true,
  };

  if( $("AdetailerCheck").checked ){
    const adModels = getAdetailerList();
    console.log("adModels", JSON.stringify(adModels));
    if (adModels.length > 0) {
      const adPromptElement = document.getElementById('AdetilerModelsPrompt');
      const adNegativePromptElement = document.getElementById('AdetilerModelsNegative');
      
      const adPrompt = adPromptElement && adPromptElement.value ? adPromptElement.value.trim() : "";
      const adNegativePrompt = adNegativePromptElement && adNegativePromptElement.value ? adNegativePromptElement.value.trim() : "";
      
      requestData.alwayson_scripts = {
        "ADetailer": {
          "args": adModels.map(model => ({
            "ad_model": model,
            "ad_prompt": adPrompt,
            "ad_negative_prompt": adNegativePrompt
          }))
        }
      };
    }  
  }else{
  }

  if (basePrompt.text2img_hr_upscaler && basePrompt.text2img_hr_upscaler != 'None') {
    Object.assign(requestData, {
      enable_hr: true,
      hr_upscaler: basePrompt.text2img_hr_upscaler,
      hr_scale: basePrompt.text2img_hr_scale,
      hr_second_pass_steps: basePrompt.text2img_hr_step,
      denoising_strength: basePrompt.text2img_hr_denoise,
    });
  }

  console.log("requestData", JSON.stringify(requestData));
  return requestData;
}