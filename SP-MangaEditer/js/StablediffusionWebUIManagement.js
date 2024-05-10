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
var StableDiffusionWebUI_API_options   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/options'
var StableDiffusionWebUI_API_samplers  = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/samplers'

function StableDiffusionWebUI_reBuild_URL(){
  StableDiffusionWebUI_API_ping      = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/internal/ping'
  StableDiffusionWebUI_API_sampler   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/samplers'
  StableDiffusionWebUI_API_scheduler = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/schedulers'
  StableDiffusionWebUI_API_upscaler  = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/upscalers'
  StableDiffusionWebUI_API_sdModel   = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/sd-models'
  StableDiffusionWebUI_API_T2I       = 'http://' + stableDiffusionWebUIHost + ':' + stableDiffusionWebUIPort + '/sdapi/v1/txt2img'
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

async function fetchModels() {

  fetchOptions();

  const response = await fetch(StableDiffusionWebUI_API_sdModel, { method: 'GET' });
  const models = await response.json();
  updateModelDropdown(models);
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
  fetch(StableDiffusionWebUI_API_ping, {
    method: 'GET',
    headers: {'Accept': 'application/json'}
  })
  .then(response => {
    const statusElement = document.getElementById('Stable_Diffusion_WebUI_Status');
    if (response.ok) {
      statusElement.innerHTML = 'Stable diffusion WebUI Online';
      statusElement.style.color = 'green';
    } else {
      statusElement.innerHTML = 'Stable diffusion WebUI Offline';
      statusElement.style.color = 'red';
    }
  })
  .catch(error => {
    const statusElement = document.getElementById('Stable_Diffusion_WebUI_Status');
    statusElement.innerHTML = 'Stable diffusion WebUI Offline(Error)';
    statusElement.style.color = 'red';
  });
}



document.addEventListener('DOMContentLoaded', function() {
  setInterval(sdwebui_checkAPIStatus, 1000 * 15 );
});

sdwebui_checkAPIStatus();


async function sdwebui_fetchText2Image(layer) {
  const url = StableDiffusionWebUI_API_T2I;

  var seed = -1;
  var width = -1;
  var height = -1;

  if( layer.text2img_seed == -2 ){
    seed = text2img_basePrompt.text2img_seed;
  }
  
  if( layer.text2img_width <= 0 ){
    width = text2img_basePrompt.text2img_width;
  }else{
    width = layer.text2img_width;
  }

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
      "hr_upscaler":      text2img_basePrompt.text2img_hr_upscaler,
      "do_not_save_grid": true,
  };
  // console.log("sdwebui_fetchText2Image", requestData);
  
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
          },
          body: JSON.stringify(requestData)
      });
      const data = await response.json();
      return data.images[0];
  } catch (error) {
      createToast("Text2Image Error.", "check SD WebUI!")
      // console.error('Error fetching image:', error);
  }
}

async function sdwebui_generateText2Image(layer) {
  const base64ImageData = await sdwebui_fetchText2Image(layer);
  if (!base64ImageData) return null;
  const imageSrc = 'data:image/png;base64,' + base64ImageData;
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imageSrc, (img) => {
      if (img) {
        resolve(img);
      } else {
        reject(new Error('Failed to create a fabric.Image object'));
      }
    });
  });
}


let isStableDiffusionWebUI_Text2ImageProcessing = false;

async function StableDiffusionWebUI_text2ImgaeProcessQueue(layer, spinnerId) {

  while ( isStableDiffusionWebUI_Text2ImageProcessing ) {
    if (isStableDiffusionWebUI_Text2ImageProcessing ) {
      // console.log("StableDiffusionWebUI_text2ImgaeProcessQueue await sleep(1000);");
      await sleep(1000);
      continue;
    }else{
      break;
    }
  }
  isStableDiffusionWebUI_Text2ImageProcessing = true;
  try {
    // console.log("StableDiffusionWebUI_text2ImgaeProcessQueue await sdwebui_generateText2Image(layer);");
    const img = await sdwebui_generateText2Image(layer);
    if (img) {
      const center = calculateCenter(layer);
      putImageInFrame(img, center.centerX, center.centerY);
    } else {
      console.log("generate error, text2image");
    }
  } catch (error) {
    createToast("Text2Image Error.", "check SD WebUI!")
    console.log("error:", error);
  } finally {
    var removeSpinner = document.getElementById(spinnerId);
    if (removeSpinner) {
        removeSpinner.remove();
    }
    isStableDiffusionWebUI_Text2ImageProcessing = false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
