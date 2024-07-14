// Available api models
const apis = {
  A1111: "A1111",
  COMFYUI: "comfyui"
};

// Variable to keep track of selected api model to use
var API_mode = apis.A1111;

document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.getElementById("projectSave");
  var loadButton = document.getElementById("projectLoad");

  //TODO: Maybe moved this to another file
  var selectA1111APIButton = document.getElementById("Select_a1111_button");
  var selectComfyuiAPIButton = document.getElementById("Select_comfyui_button");

  var settingsSave = document.getElementById("settingsSave");
  var settingsLoad = document.getElementById("settingsLoad");

  settingsSave.addEventListener("click", function () {
    saveSettingsLocalStrage();
  });

  settingsLoad.addEventListener("click", function () {
    loadSettingsLocalStrage();
  });

  saveButton.addEventListener("click", function () {
    if (stateStack.length === 0) {
      createToast("Save Error", "Not Found.");
      return;
    }
    createToast("Save Project Start!", "");
    const startTime = performance.now();
    var zip = new JSZip();

    // text2img_basePromptをzipファイルに追加
    zip.file("text2img_basePrompt.json", JSON.stringify(text2img_basePrompt));

    stateStack.forEach((json, index) => {
      const paddedIndex = String(index).padStart(6, '0');
      zip.file(`state_${paddedIndex}.json`, JSON.stringify(json));
      // zip.file(`state_${index}.json`, JSON.stringify(json));
    });

    imageMap.forEach((value, key) => {
      zip.file(`${key}.img`, value);
    });
    createToast("Save IMAGE", "");

    // Canvasの縦横情報を追加
    var canvasInfo = {
      width: canvas.width,
      height: canvas.height
    };
    zip.file("canvas_info.json", JSON.stringify(canvasInfo));

    removeGrid();
    var previewLink = getCropAndDownloadLinkByMultiplier(1, 'jpeg');
    zip.file("preview-image.jpeg", previewLink.href.substring(previewLink.href.indexOf('base64,') + 7), { base64: true });
    if (isGridVisible) {
      drawGrid();
      isGridVisible = true;
    }

    createToast("Save Zip Create Start!", "");
    zip.generateAsync({ type: "blob" }).then(function (content) {
      var url = window.URL.createObjectURL(content);
      var a = document.createElement("a");
      a.href = url;
      a.download = "project.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      const endTime = performance.now();
      console.log(`Save operation took ${endTime - startTime} milliseconds`);
    });

  });

  loadButton.addEventListener("click", function () {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.onchange = function () {
      var file = this.files[0];
      if (file) {
        createToast("Load Project Start!", "");

        const startTime = performance.now();
        JSZip.loadAsync(file).then(function (zip) {
          stateStack = [];
          imageMap.clear();


          var text2imgBasePromptFile = zip.file("text2img_basePrompt.json");
          if (text2imgBasePromptFile) {
            text2imgBasePromptFile.async("string").then(function (content) {
              Object.assign(text2img_basePrompt, JSON.parse(content));
            });
          }


          var canvasInfoFile = zip.file("canvas_info.json");

          var canvasInfoPromise = canvasInfoFile
            ? canvasInfoFile.async("string").then(function (content) {
              return JSON.parse(content);
            })
            : Promise.resolve({ width: 750, height: 850 });

          // var sortedFiles = Object.keys(zip.files).sort();
          var sortedFiles = Object.keys(zip.files).sort((a, b) => {
            const numA = a.match(/(\d+)/) ? parseInt(a.match(/(\d+)/)[0]) : -1;
            const numB = b.match(/(\d+)/) ? parseInt(b.match(/(\d+)/)[0]) : -1;
            if (numA === numB) {
              return a.localeCompare(b);
            }
            return numA - numB;
          });


          //Image sort
          sortedFiles.map(function (fileName) {
            return zip.file(fileName).async("string").then(function (content) {
              if (fileName.endsWith(".img")) {
                let hash = fileName.split('.')[0];
                imageMap.set(hash, content);
              }
            }).catch(function (error) {
              console.error("Failed to load file:", fileName, error);
            });
          });

          var promises = sortedFiles.map(function (fileName) {
            return zip.file(fileName).async("string").then(function (content) {
              if (fileName.endsWith(".json") && fileName !== "text2img_basePrompt.json" && fileName !== "canvas_info.json") {
                try {
                  //console.log( "fileName JSON.parse(content)", fileName, " ", JSON.parse(content).length );
                  return JSON.parse(content);
                } catch (e) {
                  console.error("JSON parse error in file:", fileName, e);
                }
              }
            }).catch(function (error) {
              console.error("Failed to load file:", fileName, error);
            });
          });

          Promise.all([canvasInfoPromise, ...promises]).then(function (allData) {
            var canvasInfo = allData[0];
            stateStack = allData.slice(1).filter((data, index) => {
              const isDataDefined = data !== undefined;
              return isDataDefined;
            });

            document.body.removeChild(fileInput);
            currentStateIndex = stateStack.length - 1;
            resizeCanvasByNum(canvasInfo.width, canvasInfo.height)
            lastRedo();

            const endTime = performance.now();
            console.log(`Load operation took ${endTime - startTime} milliseconds`);
          });
        });
      }
    };
  });


  // // TODO: this is a bit of a scuffed soloution and requires a lot of extra work if a third api model would be added.
  // selectA1111APIButton.addEventListener('click', (event) => {
  //   event.stopPropagation();

  //   API_mode = apis.A1111;

  //   // // Hide comfyui elements and show A1111 elements
  //   // let a1111Elements = document.getElementsByClassName("A1111_api_content");
  //   // let comfyuiElements = document.getElementsByClassName("Comfyui_api_content");

  //   // selectA1111APIButton.style.backgroundColor = "#ffedd3";
  //   // for (let i = 0; i < a1111Elements.length; i++) {
  //   //   a1111Elements[i].style.display = "block";
  //   // }

  //   // selectComfyuiAPIButton.style.backgroundColor = "#ffe1b7"
  //   // for (let i = 0; i < comfyuiElements.length; i++) {
  //   //   comfyuiElements[i].style.display = "none";
  //   // }
  // });

  // selectComfyuiAPIButton.addEventListener('click', (event) => {
  //   event.stopPropagation();

  //   API_mode = apis.COMFYUI;

  //   // // Show comfyui elements and hide A1111 elements
  //   // let a1111Elements = document.getElementsByClassName("A1111_api_content");
  //   // let comfyuiElements = document.getElementsByClassName("Comfyui_api_content");

  //   // selectA1111APIButton.style.backgroundColor = "#ffe1b7";
  //   // for (let i = 0; i < a1111Elements.length; i++) {
  //   //   a1111Elements[i].style.display = "none";
  //   // }

  //   // selectComfyuiAPIButton.style.backgroundColor = "#ffedd3"
  //   // for (let i = 0; i < comfyuiElements.length; i++) {
  //   //   comfyuiElements[i].style.display = "block";
  //   // }
  // });

});



  
function loadSettingsLocalStrage(  ) {
  createToast('Settings Load', [
    'Canvas Background Color...',
    'Api port/host/check...',
    'Base Settings...',
    'Dpi...',
    'Grid, Layer, Controle...',
    'Margin From Panel...',
    'Knife Space Size...',
    'Load Completed!!'
  ]);

  const localSettingsData = localStorage.getItem('localSettingsData');

  if (localSettingsData) {
    const localSettings = JSON.parse(localSettingsData);

    var bgColorInputElement = document.getElementById('bg-color');
    bgColorInputElement.value = localSettings.canvasBgColor || "#ffffff";
    
    var event = new Event('input', { 'bubbles': true, 'cancelable': true });
    bgColorInputElement.dispatchEvent(event);


    document.getElementById('view_layers_checkbox').checked = localSettings.view_layers_checkbox ?? true;
    document.getElementById('view_controles_checkbox').checked = localSettings.view_controles_checkbox ?? true;

    document.getElementById('knifePanelSpaceSize').value = localSettings.knifePanelSpaceSize || "20";
    document.getElementById('outputDpi').value = localSettings.canvasDpi || "300";
    document.getElementById('gridSizeInput').value = localSettings.canvasGridLineSize || "10";
    document.getElementById('marginFromPanel').value = localSettings.canvasMarginFromPanel || "20";
    svgPagging = localSettings.canvasMarginFromPanel || "20";
    document.getElementById('Stable_Diffusion_WebUI_apiPort').value = localSettings.Stable_Diffusion_WebUI_apiPort || "7860";
    document.getElementById('Stable_Diffusion_WebUI_apiHost').value = localSettings.Stable_Diffusion_WebUI_apiHost || "127.0.0.1";
    document.getElementById('apiHeartbeatCheckbox').checked = localSettings.apiHeartbeatCheckbox === "true";

    text2img_basePrompt.text2img_prompt         = localSettings.text2img_basePrompt_text2img_prompt || text2img_basePrompt.text2img_prompt;
    text2img_basePrompt.text2img_negativePrompt = localSettings.text2img_basePrompt_text2img_negativePrompt || text2img_basePrompt.text2img_negativePrompt;
    text2img_basePrompt.text2img_seed           = localSettings.text2img_basePrompt_text2img_seed || text2img_basePrompt.text2img_seed;
    text2img_basePrompt.text2img_cfg_scale      = localSettings.text2img_basePrompt_text2img_cfg_scale || text2img_basePrompt.text2img_cfg_scale;
    text2img_basePrompt.text2img_width          = localSettings.text2img_basePrompt_text2img_width || text2img_basePrompt.text2img_width;
    text2img_basePrompt.text2img_height         = localSettings.text2img_basePrompt_text2img_height || text2img_basePrompt.text2img_height;
    text2img_basePrompt.text2img_samplingMethod = localSettings.text2img_basePrompt_text2img_samplingMethod || text2img_basePrompt.text2img_samplingMethod;
    text2img_basePrompt.text2img_samplingSteps  = localSettings.text2img_basePrompt_text2img_samplingSteps || text2img_basePrompt.text2img_samplingSteps;
    text2img_basePrompt.text2img_scheduler      = localSettings.text2img_basePrompt_text2img_scheduler || text2img_basePrompt.text2img_scheduler;
    text2img_basePrompt.text2img_model          = localSettings.text2img_basePrompt_text2img_model || text2img_basePrompt.text2img_model;
    text2img_basePrompt.text2img_hr_upscaler    = localSettings.text2img_basePrompt_text2img_hr_upscaler || text2img_basePrompt.text2img_hr_upscaler;
    text2img_basePrompt.text2img_basePrompt_hr_scale  = localSettings.text2img_basePrompt_text2img_basePrompt_hr_scale || text2img_basePrompt.text2img_basePrompt_hr_scale;
    text2img_basePrompt.text2img_basePrompt_hr_step   = localSettings.text2img_basePrompt_text2img_basePrompt_hr_step || text2img_basePrompt.text2img_basePrompt_hr_step;
    text2img_basePrompt.text2img_basePrompt_hr_denoising_strength = localSettings.text2img_basePrompt_text2img_basePrompt_hr_denoising_strength || text2img_basePrompt.text2img_basePrompt_hr_denoising_strength;

  } else {
    createToast("Settings Load Failed! (Local storage)", "Settings not found.");
  }
}

function saveSettingsLocalStrage() {
  createToast('Settings Save', [
    'Canvas Background Color...',
    'Api port/host/check...',
    'Base Settings...',
    'Dpi...',
    'Grid, Layer, Controle...',
    'Margin From Panel...',
    'Knife Space Size...',
    'Save Completed!!'
  ]);

  const localSettingsData = {
    view_layers_checkbox: document.getElementById('view_layers_checkbox').checked,
    view_controles_checkbox: document.getElementById('view_controles_checkbox').checked,

    knifePanelSpaceSize: document.getElementById('knifePanelSpaceSize').value,
    canvasBgColor: document.getElementById('bg-color').value,
    canvasDpi: document.getElementById('outputDpi').value,
    canvasGridLineSize: document.getElementById('gridSizeInput').value,
    canvasMarginFromPanel: document.getElementById('marginFromPanel').value,
    Stable_Diffusion_WebUI_apiPort: document.getElementById('Stable_Diffusion_WebUI_apiPort').value,
    Stable_Diffusion_WebUI_apiHost: document.getElementById('Stable_Diffusion_WebUI_apiHost').value,
    apiHeartbeatCheckbox : document.getElementById('apiHeartbeatCheckbox').checked ,
    text2img_basePrompt_text2img_prompt: text2img_basePrompt.text2img_prompt,
    text2img_basePrompt_text2img_negativePrompt: text2img_basePrompt.text2img_negativePrompt,
    text2img_basePrompt_text2img_seed: text2img_basePrompt.text2img_seed,
    text2img_basePrompt_text2img_cfg_scale: text2img_basePrompt.text2img_cfg_scale,
    text2img_basePrompt_text2img_width: text2img_basePrompt.text2img_width,
    text2img_basePrompt_text2img_height: text2img_basePrompt.text2img_height,
    text2img_basePrompt_text2img_samplingMethod: text2img_basePrompt.text2img_samplingMethod,
    text2img_basePrompt_text2img_samplingSteps: text2img_basePrompt.text2img_samplingSteps,
    text2img_basePrompt_text2img_scheduler: text2img_basePrompt.text2img_scheduler,
    text2img_basePrompt_text2img_model: text2img_basePrompt.text2img_model,
    text2img_basePrompt_text2img_hr_upscaler: text2img_basePrompt.text2img_hr_upscaler,
    text2img_basePrompt_text2img_basePrompt_hr_scale: text2img_basePrompt.text2img_basePrompt_hr_scale,
    text2img_basePrompt_text2img_basePrompt_hr_step: text2img_basePrompt.text2img_basePrompt_hr_step,
    text2img_basePrompt_text2img_basePrompt_hr_denoising_strength: text2img_basePrompt.text2img_basePrompt_hr_denoising_strength
  };
  localStorage.setItem('localSettingsData', JSON.stringify(localSettingsData));
}

loadSettingsLocalStrage();

changeView("layer-panel", document.getElementById('view_layers_checkbox').checked);
changeView("controls", document.getElementById('view_controles_checkbox').checked);


function toggleAPI(event) {
  event.stopPropagation();
  event.preventDefault();

  const toggleCheckbox = document.getElementById('toggle-api');
  if (toggleCheckbox.checked) {
    API_mode = apis.COMFYUI;
    console.log('API_mode is now set to:', API_mode);
    createToast("API CHANGE!", "COMFYUI");
  } else {
    API_mode = apis.A1111;
    console.log('API_mode is now set to:', API_mode);
    createToast("API CHANGE!", "WebUI(A1111/Forge)");
  }
}






function executeWithConfirmation(message, callback) {
  var modalHtml = `
      <div class="modal fade" id="dynamicConfirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="confirmModalLabel">Confirm</h5>
                      <button type="button" class="btn-close" id="executeWithConfirmationCloseButton" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      ${message}
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" id="executeWithConfirmationCancelButton">Cancel</button>
                      <button type="button" class="btn btn-primary" id="executeWithConfirmationConfirmButton">Yes</button>
                  </div>
              </div>
          </div>
      </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  var confirmModal = new bootstrap.Modal(document.getElementById('dynamicConfirmModal'));
  confirmModal.show();

  var executeWithConfirmationConfirmButton = document.getElementById('executeWithConfirmationConfirmButton');
  var executeWithConfirmationCancelButton = document.getElementById('executeWithConfirmationCancelButton');
  var executeWithConfirmationCloseButton = document.getElementById('executeWithConfirmationCloseButton');

  function handleConfirm() {
    callback();
    confirmModal.hide();
    cleanup();
  }

  function handleCancel() {
    confirmModal.hide();
    cleanup();
  }

  function cleanup() {
    executeWithConfirmationConfirmButton.removeEventListener('click', handleConfirm);
    executeWithConfirmationCancelButton.removeEventListener('click', handleCancel);
    executeWithConfirmationCloseButton.removeEventListener('click', handleCancel);
    document.getElementById('dynamicConfirmModal').remove();
  }

  executeWithConfirmationConfirmButton.addEventListener('click', handleConfirm);
  executeWithConfirmationCancelButton.addEventListener('click', handleCancel);
  executeWithConfirmationCloseButton.addEventListener('click', handleCancel);
}


document.getElementById('svgDownload').onclick = function () {
  var svg = canvas.toSVG();
  console.log(svg);
  svgDownload('canvas.svg', svg);
};

function svgDownload(filename, content) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}