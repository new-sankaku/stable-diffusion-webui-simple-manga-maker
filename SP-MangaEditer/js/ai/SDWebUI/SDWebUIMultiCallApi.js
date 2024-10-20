
function fetchSD_ADModels() {
  fetch(sdWebUI_API_adetilerModel, {
      method: 'GET',
      headers: {
          'accept': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      initTagify(data.ad_model);
  })
  .catch(error => {
      console.error('Error:', error);
      alert('APIからデータを取得できませんでした。');
  });
}



async function sendModelToServer() {
  const modelValue = basePrompt.text2img_model;

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
      basePrompt.text2img_model = data.sd_model_checkpoint;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchSD_Sampler() {
  const response = await fetch(sdWebUI_API_samplers, { method: 'GET' });
  const models = await response.json();
  updateSamplerDropdown(models);
}

async function fetchSD_Upscaler() {
  const response = await fetch(sdWebUI_API_upscaler, { method: 'GET' });
  const models = await response.json();
  updateUpscalerDropdown(models);
}

async function fetchSD_Models() {
  fetchOptions();
  const response = await fetch(sdWebUI_API_sdModel, { method: 'GET' });
  const models = await response.json();
  updateModelDropdown(models);
}


function sdwebui_apiHeartbeat() {
  const label = $('ExternalService_Heartbeat_Label');

  fetch(sdWebUI_API_ping, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        label.innerHTML = 'SD WebUI or Forge ON';
        label.style.color = 'green';

        if(firstSDConnection){
          getDiffusionInfomation();
          firstSDConnection = false;
        }
        return true;
      } else {
        label.innerHTML = 'SD WebUI or Forge OFF';
        label.style.color = 'red';
      }
    })
    .catch(error => {
      label.innerHTML = 'SD WebUI or Forge OFF';
      label.style.color = 'red';
    });
    return false;
}


async function sdWebUI_Interrogate(layer, model, spinnerId) {
  sdQueue.add(async () => {
    let base64Image = imageObject2Base64Image(layer);
    const requestBody = {
      image: base64Image,
      model: model
    };
    const response = await fetch(sdWebUI_API_interrogate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      createToastError("Interrogate error", errorText);
      return null;
    }

    const result = await response.json();
    return result;
  })
    .then(async (result) => {
      if (result) {
        createToast("Interrogate Success. " + model, result.caption);
        if (layer.text2img_prompt) {
          layer.text2img_prompt = layer.text2img_prompt + ", " + result.caption;
        } else {
          layer.text2img_prompt = result.caption;
        }
      }
    })
    .catch(error => {
      var checkSD = getText("checkSD_webUI_Text");
      createToastError("Interrogate Error.", checkSD);
    })
    .finally(() => {
      removeSpinner(spinnerId);
    });
}

