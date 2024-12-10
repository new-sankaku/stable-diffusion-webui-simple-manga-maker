const sdQueue = new TaskQueue(1);
const comfyuiQueue = new TaskQueue(1);

var firstSDConnection = true;
var firstComfyConnection = true;

$('sdWebUIPageUrlDefaultUrl').addEventListener('click', (event) => {
  event.stopPropagation();
  const defaultUrl = 'http://127.0.0.1:7860';
  $('sdWebUIPageUrl').value = defaultUrl;
});

$('comfyUIPageUrlDefaultUrl').addEventListener('click', (event) => {
  event.stopPropagation();
  const defaultUrl = 'http://127.0.0.1:8188';
  $('comfyUIPageUrl').value = defaultUrl;
});




function existsWaitQueue() {
  const sdQueueStatus = sdQueue.getStatus();
  if( sdQueueStatus.total > 0 ){
    return true;
  }

  const comfyuiQueueStatus = sdQueue.getStatus();
  if( comfyuiQueueStatus.total > 0 ){
    return true;
  }
}


async function T2I( layer, spinner ){
  if (API_mode == apis.A1111) {
    sdwebui_T2IProcessQueue(layer, spinner.id);
  }else if (API_mode == apis.COMFYUI){
    return Comfyui_handle_process_queue(layer, spinner.id);
  }
}
function I2I( layer, spinner ){
  if (API_mode == apis.A1111) {
    sdwebui_I2IProcessQueue(layer, spinner.id);
  }else if (API_mode == apis.COMFYUI){
    var isI2I = false;
    Comfyui_handle_process_queue(layer, spinner.id, isI2I);
  }
}

  


function getDiffusionInfomation() {
  if (API_mode == apis.A1111) {
    fetchSDOptions().then(() => {
      fetchSD_Models();
      fetchSD_Sampler();
      fetchSD_Upscaler();
      fetchSD_ADModels();
      fetchSD_Modules();  
    });
    
  }else if( API_mode == apis.COMFYUI ){
    Comfyui_FetchModels();
    Comfyui_FetchSampler();
    Comfyui_FetchUpscaler();
    Comfyui_VaeLoader();
    Comfyui_ClipModels();
    Comfyui_FetchObjectInfoOnly();
  }
}


function apiHeartbeat(){
  const pingCheck = $('apiHeartbeatCheckbox');
  if (pingCheck.checked) {
  } else {
    return;
  }

  if (API_mode == apis.A1111) {
    sdwebui_apiHeartbeat();
  }else if( API_mode == apis.COMFYUI ){
    Comfyui_apiHeartbeat();
  }
}


function updateUpscalerDropdown(models) {
  const modelDropdown = $('text2img_hr_upscaler');
  modelDropdown.innerHTML = '';
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;

    if (basePrompt.text2img_hr_upscaler === model.name) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}

function updateSamplerDropdown(models) {
  const modelDropdown = $('basePrompt_samplingMethod');
  modelDropdown.innerHTML = '';
  basePrompt.text2img_samplingMethod

  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;

    if (basePrompt.text2img_samplingMethod === model.name) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}

function updateModelDropdown(models) {
  const modelDropdown = $('basePrompt_model');
  modelDropdown.innerHTML = '';
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.title;
    option.textContent = model.model_name;

    if (basePrompt.text2img_model === removeHashStr(model.title)) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}

function updateVaeDropdown(models) {
  // console.log("updateVaeDropdown", JSON.stringify(models))

  const dropdown = $('vaeDropdownId');
  dropdown.innerHTML = '';
  models.forEach(model => {
    console.log("updateVaeDropdown push ", model.name)
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;
    dropdown.appendChild(option);
  });
}


//Before:ABC.safetensors [23e4fa2b6f]
//After :ABC.safetensors
function removeHashStr(str) {
  return str.replace(/\s*\[[^\]]+\]\s*$/, '');
}

$('basePrompt_model').addEventListener('change', function(event){
  if (API_mode == apis.A1111) {
    sendModelToServer();
  }else if( API_mode == apis.COMFYUI ){
    //TODO
  }
});

$('clipDropdownId').addEventListener('change', function(event){
  if (API_mode == apis.A1111) {
    sendClipToServer();
  }else if( API_mode == apis.COMFYUI ){
    //TODO
  }
});
