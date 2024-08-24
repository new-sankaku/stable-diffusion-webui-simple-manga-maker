function apiHeartbeat(){
  const pingCheck = $('apiHeartbeatCheckbox');
  if (pingCheck.checked) {
    
  } else {
    return;
  }

  if (API_mode == apis.A1111) {
    sdwebui_apiHeartbeat();
  }else if( API_mode == apis.COMFYUI ){
    comufy_apiHeartbeat();
  }
}


document.addEventListener('DOMContentLoaded', function () {
  setInterval(apiHeartbeat, 1000 * 15);
  $('apiHeartbeatCheckbox').addEventListener('change', function () {
    apiHeartbeat();
  });
  apiHeartbeat();
});




function updateUpscalerDropdown(models) {
  const modelDropdown = $('text2img_basePrompt_hr_upscaler');
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
  const modelDropdown = $('text2img_basePrompt_samplingMethod');
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
  const modelDropdown = $('text2img_basePrompt_model');
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
