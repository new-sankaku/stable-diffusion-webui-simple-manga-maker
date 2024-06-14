document.addEventListener('DOMContentLoaded', function() {
  const hostInput = document.getElementById('Stable_Diffusion_WebUI_apiHost');
  const portInput = document.getElementById('Stable_Diffusion_WebUI_apiPort');

  hostInput.value = stableDiffusionWebUIHost;
  portInput.value = stableDiffusionWebUIPort;

  hostInput.addEventListener('change', function() {
      // console.log('Host updated to:', this.value);
      stableDiffusionWebUIHost = this.value;
      StableDiffusionWebUI_reBuild_URL();
  });

  portInput.addEventListener('change', function() {
      // console.log('Port updated to:', this.value);
      stableDiffusionWebUIPort = this.value;;
      StableDiffusionWebUI_reBuild_URL();
  });
});



var StableDiffusionWebUI_API_ping      = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/internal/ping'
var StableDiffusionWebUI_API_sampler   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/samplers'
var StableDiffusionWebUI_API_scheduler = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/schedulers'
var StableDiffusionWebUI_API_upscaler  = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/upscalers'
var StableDiffusionWebUI_API_sdModel   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/sd-models'
var StableDiffusionWebUI_API_T2I       = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/txt2img'
var StableDiffusionWebUI_API_I2I       = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/img2img'
var StableDiffusionWebUI_API_options   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/options'
var StableDiffusionWebUI_API_samplers  = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/samplers'


function StableDiffusionWebUI_reBuild_URL(){
  StableDiffusionWebUI_API_ping      = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/internal/ping'
  StableDiffusionWebUI_API_sampler   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/samplers'
  StableDiffusionWebUI_API_scheduler = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/schedulers'
  StableDiffusionWebUI_API_upscaler  = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/upscalers'
  StableDiffusionWebUI_API_sdModel   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/sd-models'
  StableDiffusionWebUI_API_T2I       = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/txt2img'
  StableDiffusionWebUI_API_I2I       = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/img2img'
  StableDiffusionWebUI_API_options   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/options'
  StableDiffusionWebUI_API_samplers  = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/samplers'
}

async function sendModelToServer() {
  const modelValue = text2img_basePrompt.text2img_model;

  const data = JSON.stringify({
    sd_model_checkpoint: modelValue
  });

  // POSTリクエストを送信
  fetch(StableDiffusionWebUI_API_options, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => response.json())
  .then(data => {
  })
  .catch((error) => {
    alert('Failed to apply the model.');
  });
}

async function fetchOptions() {
  try {
      const response = await fetch(StableDiffusionWebUI_API_options, {
          method: 'GET',
          headers: {
              'Accept': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if ('sd_model_checkpoint' in data) {
          text2img_basePrompt.text2img_model = data.sd_model_checkpoint;
          // console.log("text2img_basePrompt.text2img_model", text2img_basePrompt.text2img_model);
      }
  } catch (error) {
      console.error('Failed to fetch data:', error);
  }
}

async function fetchSampler() {
  const response = await fetch(StableDiffusionWebUI_API_samplers, { method: 'GET' });
  const models = await response.json();
  updateSamplerDropdown(models);
}

async function fetchUpscaler() {
  console.log("fetchUpscaler");
  const response = await fetch(StableDiffusionWebUI_API_upscaler, { method: 'GET' });
  const models = await response.json();
  updateUpscalerDropdown(models);
}

async function fetchModels() {

  fetchOptions();

  const response = await fetch(StableDiffusionWebUI_API_sdModel, { method: 'GET' });
  const models = await response.json();
  updateModelDropdown(models);
}

function updateUpscalerDropdown(models) {
  const modelDropdown = document.getElementById('text2img_basePrompt_hr_upscaler');
  modelDropdown.innerHTML = '';

  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;

    if (text2img_basePrompt.text2img_hr_upscaler === model.name) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}

function updateSamplerDropdown(models) {
  const modelDropdown = document.getElementById('text2img_basePrompt_samplingMethod');
  modelDropdown.innerHTML = '';
  text2img_basePrompt.text2img_samplingMethod

  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;

    if (text2img_basePrompt.text2img_samplingMethod === model.name) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}


function updateModelDropdown(models) {
  const modelDropdown = document.getElementById('text2img_basePrompt_model');
  modelDropdown.innerHTML = '';

  models.forEach(model => {
    const option = document.createElement('option');
    
    // console.log( "updateModelDropdown", model.model_name );
    option.value = model.title;
    option.textContent = model.model_name;

    if (text2img_basePrompt.text2img_model === model.title) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}


function sdwebui_checkAPIStatus() {

  const pingCheck = document.getElementById('SD_WebUI_pingCheck');
  if (pingCheck.checked) {
    
  } else {
    return;
  }
  fetch(StableDiffusionWebUI_API_ping, {
    method: 'GET',
    headers: {'Accept': 'application/json'}
  })
  .then(response => {
    const statusElement = document.getElementById('SD_WebUI_pingCheck_Label');
    if (response.ok) {
      statusElement.innerHTML = '<input type="checkbox" id="SD_WebUI_pingCheck" checked> SD WebUI ON';
      statusElement.style.color = 'green';
    } else {
      statusElement.innerHTML = '<input type="checkbox" id="SD_WebUI_pingCheck" checked> SD WebUI OFF';
      statusElement.style.color = 'red';
    }
  })
  .catch(error => {
    const statusElement = document.getElementById('SD_WebUI_pingCheck_Label');
    statusElement.innerHTML = '<input type="checkbox" id="SD_WebUI_pingCheck" checked> SD WebUI OFF(Error)';
    statusElement.style.color = 'red';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setInterval(sdwebui_checkAPIStatus, 1000 * 15 );
});

document.getElementById('SD_WebUI_pingCheck').addEventListener('change', function() {
    sdwebui_checkAPIStatus();
});


sdwebui_checkAPIStatus();



function baseRequestData(layer){
  var seed = -1;
  var width = -1;
  var height = -1;

  if( layer.text2img_seed == -2 ){
    seed = text2img_basePrompt.text2img_seed;
  }else if( layer.text2img_seed > -1 ){
    seed = layer.text2img_seed;
  }
  
  console.log("layer.text2img_width",layer.text2img_width );
  if( layer.text2img_width <= 0 ){
    width = text2img_basePrompt.text2img_width;
  }else{
    width = layer.text2img_width;
  }

  console.log("layer.text2img_height",layer.text2img_height );
  if( layer.text2img_height <= 0 ){
    height = text2img_basePrompt.text2img_height;
  }else{
    height = layer.text2img_height;
  }

  const requestData = {
    "prompt":           text2img_basePrompt.text2img_prompt         + layer.text2img_prompt,
    "negative_prompt":  text2img_basePrompt.text2img_negativePrompt + layer.text2img_negativePrompt,
    "seed":             seed,
    "width":            width,
    "height":           height,
    "sampler_name":     text2img_basePrompt.text2img_samplingMethod,
    "steps":            text2img_basePrompt.text2img_samplingSteps,
    "cfg_scale":        text2img_basePrompt.text2img_cfg_scale,
    "scheduler":        text2img_basePrompt.text2img_scheduler,
    "do_not_save_grid": true,
  };

  if( text2img_basePrompt.text2img_hr_upscaler && text2img_basePrompt.text2img_hr_upscaler != 'None' ){
    Object.assign(requestData, {
                  enable_hr: true,
                  hr_upscaler: text2img_basePrompt.text2img_hr_upscaler,
                  hr_scale:text2img_basePrompt.text2img_basePrompt_hr_scale,
                  hr_second_pass_steps:text2img_basePrompt.text2img_basePrompt_hr_step,
                  denoising_strength:text2img_basePrompt.text2img_basePrompt_hr_denoising_strength,
    });
  }

  return requestData;
}



async function sdwebui_fetchText2Image(layer) {
  var requestData = baseRequestData (layer);

  try {
      const response = await fetch(StableDiffusionWebUI_API_T2I, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
          },
          body: JSON.stringify(requestData)
      });
      const data = await response.json();
      return data;
  } catch (error) {
      createToast("Text2Image Error.", "check SD WebUI!")
  }
}

async function sdwebui_fetchImage2Image(layer) {
  const scaleFactor = 2;
  const objWidth = layer.width * layer.scaleX;
  const objHeight = layer.height * layer.scaleY;
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = objWidth * scaleFactor;
  offscreenCanvas.height = objHeight * scaleFactor;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  const originalClipPath = layer.clipPath;
  layer.clipPath = null;

  offscreenCtx.fillStyle = 'white';
  offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  offscreenCtx.scale(scaleFactor, scaleFactor);
  offscreenCtx.translate(-layer.left, -layer.top);
  layer.render(offscreenCtx);

  layer.clipPath = originalClipPath;

  const imageBase64 = offscreenCanvas.toDataURL('image/png');

  var requestData = baseRequestData(layer);
  requestData.init_images = [imageBase64];
  requestData.denoising_strength = layer.img2img_denoising_strength;

  try {
      const response = await fetch(StableDiffusionWebUI_API_I2I, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
          },
          body: JSON.stringify(requestData)
      });
      const data = await response.json();
      
      return data;
  } catch (error) {
      createToast("Text2Image Error.", "check SD WebUI!");
  }
}

// 汎用的な関数を定義
async function sdwebui_generateImage(layer, fetchFunction) {
  const responseData = await fetchFunction(layer);
  if (!responseData) return null;
  const base64ImageData = responseData.images[0];
  const imageSrc = 'data:image/png;base64,' + base64ImageData;
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imageSrc, (img) => {
      if (img) {
        resolve({ img, responseData });
      } else {
        reject(new Error('Failed to create a fabric.Image object'));
      }
    });
  });
}

// Image2Image用の関数
async function sdwebui_generateImage2Image(layer) {
  return sdwebui_generateImage(layer, sdwebui_fetchImage2Image);
}
// Text2Image用の関数
async function sdwebui_generateText2Image(layer) {
  return sdwebui_generateImage(layer, sdwebui_fetchText2Image);
}

let isStableDiffusionWebUI_Processing = false;

async function StableDiffusionWebUI_ProcessQueue(layer, spinnerId, generateFunction) {
  while (isStableDiffusionWebUI_Processing) {
    await sleep(1000);
  }
  isStableDiffusionWebUI_Processing = true;
  try {
    const { img, responseData } = await generateFunction(layer);
    if (img) {

      setImage2ImageInitPrompt(img);

      const center = calculateCenter(layer);
      putImageInFrame(img, center.centerX, center.centerY);
      const infoObject = JSON.parse(responseData.info);
      layer.tempSeed = infoObject.seed;

      img.tempPrompt = infoObject.prompt;
      img.tempNegativePrompt = infoObject.negative_prompt;

      // console.log("tempSeed",           layer.tempSeed);
      // console.log("tempPrompt",         img.tempPrompt);
      // console.log("tempNegativePrompt", img.tempNegativePrompt);

    } else {
      createToast("generate error", "");
    }
  } catch (error) {
    createToast("Generation Error.", "check SD WebUI!");
    console.log("error:", error);
  } finally {
    var removeSpinner = document.getElementById(spinnerId);
    if (removeSpinner) {
      removeSpinner.remove();
    }
    isStableDiffusionWebUI_Processing = false;
  }
}

async function StableDiffusionWebUI_text2ImgaeProcessQueue(layer, spinnerId) {
  return StableDiffusionWebUI_ProcessQueue(layer, spinnerId, sdwebui_generateText2Image);
}

async function StableDiffusionWebUI_Image2ImgaeProcessQueue(layer, spinnerId) {
  return StableDiffusionWebUI_ProcessQueue(layer, spinnerId, sdwebui_generateImage2Image);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

