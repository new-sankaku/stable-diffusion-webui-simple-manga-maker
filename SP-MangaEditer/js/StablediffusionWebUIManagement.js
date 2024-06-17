const sdQueue = new TaskQueue(1);

document.addEventListener('DOMContentLoaded', function () {
  const hostInput = document.getElementById('Stable_Diffusion_WebUI_apiHost');
  const portInput = document.getElementById('Stable_Diffusion_WebUI_apiPort');

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



var sdWebUI_API_ping = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/internal/ping'
var sdWebUI_API_sampler = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/samplers'
var sdWebUI_API_scheduler = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/schedulers'
var sdWebUI_API_upscaler = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/upscalers'
var sdWebUI_API_sdModel = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/sd-models'
var sdWebUI_API_T2I = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/txt2img'
var sdWebUI_API_I2I = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/img2img'
var sdWebUI_API_options = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/options'
var sdWebUI_API_samplers = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/samplers'
var sdWebUI_API_interrogate = 'http://' + sdWebUIHost + ':' + sdWebUIPort + '/sdapi/v1/interrogate'


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
}

async function sendModelToServer() {
  const modelValue = text2img_basePrompt.text2img_model;

  const data = JSON.stringify({
    sd_model_checkpoint: modelValue
  });

  fetch(sdWebUI_API_options, {
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
    const response = await fetch(sdWebUI_API_options, {
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
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchSampler() {
  const response = await fetch(sdWebUI_API_samplers, { method: 'GET' });
  const models = await response.json();
  updateSamplerDropdown(models);
}

async function fetchUpscaler() {
  console.log("fetchUpscaler");
  const response = await fetch(sdWebUI_API_upscaler, { method: 'GET' });
  const models = await response.json();
  updateUpscalerDropdown(models);
}

async function fetchModels() {
  fetchOptions();
  const response = await fetch(sdWebUI_API_sdModel, { method: 'GET' });
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
  fetch(sdWebUI_API_ping, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
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

document.addEventListener('DOMContentLoaded', function () {
  setInterval(sdwebui_checkAPIStatus, 1000 * 15);
});

document.getElementById('SD_WebUI_pingCheck').addEventListener('change', function () {
  sdwebui_checkAPIStatus();
});

sdwebui_checkAPIStatus();



function baseRequestData(layer) {
  var seed = -1;
  var width = -1;
  var height = -1;

  if (layer.text2img_seed == -2) {
    seed = text2img_basePrompt.text2img_seed;
  } else if (layer.text2img_seed > -1) {
    seed = layer.text2img_seed;
  }

  // console.log("layer.text2img_width", layer.text2img_width);
  if (layer.text2img_width <= 0) {
    width = text2img_basePrompt.text2img_width;
  } else {
    width = layer.text2img_width;
  }

  // console.log("layer.text2img_height", layer.text2img_height);
  if (layer.text2img_height <= 0) {
    height = text2img_basePrompt.text2img_height;
  } else {
    height = layer.text2img_height;
  }

  const requestData = {
    "prompt": text2img_basePrompt.text2img_prompt + layer.text2img_prompt,
    "negative_prompt": text2img_basePrompt.text2img_negativePrompt + layer.text2img_negativePrompt,
    "seed": seed,
    "width": width,
    "height": height,
    "sampler_name": text2img_basePrompt.text2img_samplingMethod,
    "steps": text2img_basePrompt.text2img_samplingSteps,
    "cfg_scale": text2img_basePrompt.text2img_cfg_scale,
    "scheduler": text2img_basePrompt.text2img_scheduler,
    "do_not_save_grid": true,
  };

  if (text2img_basePrompt.text2img_hr_upscaler && text2img_basePrompt.text2img_hr_upscaler != 'None') {
    Object.assign(requestData, {
      enable_hr: true,
      hr_upscaler: text2img_basePrompt.text2img_hr_upscaler,
      hr_scale: text2img_basePrompt.text2img_basePrompt_hr_scale,
      hr_second_pass_steps: text2img_basePrompt.text2img_basePrompt_hr_step,
      denoising_strength: text2img_basePrompt.text2img_basePrompt_hr_denoising_strength,
    });
  }

  return requestData;
}
async function fetchImageData(url, requestData) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    return await response.json();
  } catch (error) {
    createToast("Fetch Error.", "check SD WebUI!");
    return null;
  }
}

async function sdwebui_fetchText2Image(layer) {
  return fetchImageData(sdWebUI_API_T2I, baseRequestData(layer));
}

async function sdwebui_fetchImage2Image(layer) {
  const scaleFactor = 2;
  const { width, height, scaleX, scaleY, clipPath, left, top } = layer;
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = width * scaleX * scaleFactor;
  offscreenCanvas.height = height * scaleY * scaleFactor;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  layer.clipPath = null;
  offscreenCtx.fillStyle = 'white';
  offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  offscreenCtx.scale(scaleFactor, scaleFactor);
  offscreenCtx.translate(-left, -top);
  layer.render(offscreenCtx);
  layer.clipPath = clipPath;

  const requestData = {
    ...baseRequestData(layer),
    init_images: [offscreenCanvas.toDataURL('image/png')],
    denoising_strength: layer.img2img_denoising_strength
  };

  return fetchImageData(sdWebUI_API_I2I, requestData);
}

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

async function handleProcessQueue(layer, spinnerId, fetchFunction, imageName) {
  sdQueue.add(async () => sdwebui_generateImage(layer, fetchFunction))
    .then(async ({ img, responseData }) => {
      if (img) {
        const webpImg = await img2webp(img);
        webpImg.name = imageName;
        setImage2ImageInitPrompt(webpImg); 
        const { centerX, centerY } = calculateCenter(layer);
        putImageInFrame(webpImg, centerX, centerY);

        const infoObject = JSON.parse(responseData.info);
        layer.tempSeed = infoObject.seed;
        webpImg.tempPrompt = infoObject.prompt;
        webpImg.tempNegativePrompt = infoObject.negative_prompt;
      } else {
        createToast("generate error", "");
      }
    })
    .catch(error => {
      createToast("Generation Error.", "check SD WebUI!");
      console.log("error:", error);
    })
    .finally(() => removeSpinner(spinnerId));
}


async function sdWebUI_t2IProcessQueue(layer, spinnerId) {
  handleProcessQueue(layer, spinnerId, sdwebui_fetchText2Image, "t2i");
}

async function sdWebUI_I2IProcessQueue(layer, spinnerId) {
  handleProcessQueue(layer, spinnerId, sdwebui_fetchImage2Image, "i2i");
}


async function sdWebUI_Interrogate(layer, model, spinnerId) {
  sdQueue.add(async () => {
    let base64Image = imageObject2Base64Image(layer);
    const requestBody = {
      image: base64Image,
      model: model
    };

    console.log("sdWebUI_Interrogate", "fetch start");
    const response = await fetch(sdWebUI_API_interrogate, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    console.log("sdWebUI_Interrogate", "fetch end");

    if (!response.ok) {
      const errorText = await response.text();
      createToast("Interrogate error", errorText);
      return null;
    }

    const result = await response.json();
    return result;
  })
  .then(async (result) => {
    if (result) {
      createToast("Interrogate Success. " + model, result.caption);
      if( layer.text2img_prompt ){
        layer.text2img_prompt = layer.text2img_prompt + ", " +  result.caption;
      }else{
        layer.text2img_prompt = result.caption;
      }
    } 
  })
  .catch(error => {
    createToast("Interrogate Error.", "check SD WebUI!");
    console.log("error:", error);
  })
  .finally(() => {
    removeSpinner(spinnerId);
  });
}




function removeSpinner(spinnerId) {
  var removeSpinner = document.getElementById(spinnerId);
  if (removeSpinner) {
    removeSpinner.remove();
  }
}
function createSpinner(index) {
  var spinner = document.createElement('span');
  spinner.id = 'spinner-' + index;
  spinner.className = 'spinner-border text-danger ms-1 spinner-border-sm';
  return spinner;
}
function createSpinnerSuccess(index) {
  var spinner = document.createElement('span');
  spinner.id = 'spinner-' + index;
  spinner.className = 'spinner-border text-success ms-1 spinner-border-sm';
  return spinner;
}