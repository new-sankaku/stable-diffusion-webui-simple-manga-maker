// Available api models
const apis = {
  A1111: "A1111",
  COMFYUI: "comfyui"
};

function generateZip(){

  saveState();

  var zip = new JSZip();
  zip.file("text2img_basePrompt.json", JSON.stringify(basePrompt));

  stateStack.forEach((json, index) => {
    const paddedIndex = String(index).padStart(6, '0');
    zip.file(`state_${paddedIndex}.json`, JSON.stringify(json));
  });

  imageMap.forEach((value, key) => {
    zip.file(`${key}.img`, value);
  });

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
  return zip;
}


async function loadZip(zip, guid = null){
  stateStack = [];
  imageMap.clear();

  var text2imgBasePromptFile = zip.file("text2img_basePrompt.json");
  if (text2imgBasePromptFile) {
    const content = await text2imgBasePromptFile.async("string");
    Object.assign(basePrompt, JSON.parse(content));
  }

  var canvasInfoFile = zip.file("canvas_info.json");
  var canvasInfo = canvasInfoFile
    ? JSON.parse(await canvasInfoFile.async("string"))
    : { width: 750, height: 850 };

  var sortedFiles = Object.keys(zip.files).sort((a, b) => {
    const numA = a.match(/(\d+)/) ? parseInt(a.match(/(\d+)/)[0]) : -1;
    const numB = b.match(/(\d+)/) ? parseInt(b.match(/(\d+)/)[0]) : -1;
    if (numA === numB) {
      return a.localeCompare(b);
    }
    return numA - numB;
  });

  await Promise.all(sortedFiles.map(async (fileName) => {
    try {
      const content = await zip.file(fileName).async("string");
      if (fileName.endsWith(".img")) {
        let hash = fileName.split('.')[0];
        imageMap.set(hash, content);
      }
    } catch (error) {
      console.error("Failed to load file:", fileName, error);
    }
  }));

  const jsonLoadPromises = sortedFiles.map(async (fileName) => {
    try {
      if (fileName.endsWith(".json") && 
          fileName !== "text2img_basePrompt.json" && 
          fileName !== "canvas_info.json") {
        const content = await zip.file(fileName).async("string");
        return JSON.parse(content);
      }
    } catch (error) {
      console.error("Failed to load file:", fileName, error);
    }
  });

  const jsonResults = await Promise.all(jsonLoadPromises);
  stateStack = jsonResults.filter(data => data !== undefined);

  currentStateIndex = stateStack.length - 1;
  resizeCanvasByNum(canvasInfo.width, canvasInfo.height);
  lastRedo(guid);
  
  if(guid){
    setCanvasGUID(guid);
  }
}


// Variable to keep track of selected api model to use
var API_mode = apis.A1111;

document.addEventListener("DOMContentLoaded", function () {
  var settingsSave = $("settingsSave");
  var settingsLoad = $("settingsLoad");
  settingsSave.addEventListener("click", function () {
    saveSettingsLocalStrage();
  });
  settingsLoad.addEventListener("click", function () {
    loadSettingsLocalStrage();
  });


  var saveButton = $("projectSave");
  var loadButton = $("projectLoad");

  saveButton.addEventListener("click", function () {

    console.log("stateStack.length", stateStack.length);

    if (stateStack.length === 0) {
      createToast("Save Error", "Not Found.");
      return;
    }
  
    const loading = OP_showLoading({
      icon: 'process',step: 'Step1',substep: 'Save Project',progress: 0
    });

    btmSaveZip().then(() => {
      OP_updateLoadingState(loading, {
        icon: 'process',step: 'Step2',substep: 'Zip Start1',progress: 20
      });
      var zip = new JSZip();
      var zipPromises = [];
      btmImageZipMap.forEach((value, key) => {
        zipPromises.push(
          zip.file(`project_${key}.zip`, value.zipBlob, {binary: true})
        );
      });
      return Promise.all(zipPromises).then(() => zip);
    })
    .then((zip) => {
      OP_updateLoadingState(loading, {
        icon: 'process',step: 'Step2',substep: 'Zip Start2',progress: 40
      });

      return zip.generateAsync({ type: "blob" });
    })
    .then((content) => {
      OP_updateLoadingState(loading, {
        icon: 'process',step: 'Step2',substep: 'Download Start',progress: 80
      });

      var url = window.URL.createObjectURL(content);
      var a = document.createElement("a");
      a.href = url;
      a.download = "project.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error during save process:", error);
    })
    .finally(() => {
      OP_hideLoading(loading);
    });;
  });

  

  loadButton.addEventListener("click", function () {
    console.log("loadButton.addEventListener");
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
    fileInput.click();
  
    fileInput.onchange = async function () {
      const loading = OP_showLoading({
        icon: 'process',
        step: 'Step1',
        substep: 'Load Project',
        progress: 0
      });
      
      try {
        var file = this.files[0];
        if (file) {
          OP_updateLoadingState(loading, {
            icon: 'process',
            step: 'Step2',
            substep: 'UnZip',
            progress: 20
          });
  
          const zip = await JSZip.loadAsync(file);
          var hasNestedZip = false;
          var fileCount = 0;
    
          zip.forEach(function (relativePath, zipEntry) {
            fileCount++;
            if (zipEntry.name.toLowerCase().endsWith('.zip')) {
              hasNestedZip = true;
            }
          });
    
          if (hasNestedZip) {
            await processZip(zip);
            document.body.removeChild(fileInput);
          } else {
            await loadZip(zip);
          }
        }
      } catch (error) {
        console.error("Error loading ZIP:", error);
      } finally {
        OP_hideLoading(loading);
      }
    };
  });
  
  
  async function processZip(zip) {
    const zipFiles = Object.keys(zip.files).filter(filename => filename.endsWith('.zip'));
    
    for (let i = 0; i < zipFiles.length; i++) {
      const zipContent = await zip.file(zipFiles[i]).async('blob');
      const innerZip = await JSZip.loadAsync(zipContent);
      const previewImage = innerZip.file('preview-image.jpeg');
      if (!previewImage) {
        continue;
      }
      
      const previewImageBlob = await previewImage.async('blob');
      const previewImageUrl = URL.createObjectURL(previewImageBlob);
  
      const stateFiles = Object.keys(innerZip.files).filter(filename => filename.startsWith('state_') && filename.endsWith('.json'));

      var canvasGuid = null;

      for (const stateFile of stateFiles) {
        const stateContent = await innerZip.file(stateFile).async('text');
        try {
          const state = JSON.parse(stateContent);
          canvasGuid = findCanvasGuid(state);
  
          if (canvasGuid) {
            btmAddImage({ href: previewImageUrl }, zipContent, canvasGuid);
            break;
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      if( canvasGuid ){
        //skip
      }else{
        let guid = generateGUID();
        btmAddImage({ href: previewImageUrl }, zipContent, guid);
      }
    }
  }

  


  function findCanvasGuid(obj) {
    if (typeof obj === 'string') {
      try {
        obj = JSON.parse(obj);
      } catch (error) {
        return null;
      }
    }
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }
  
    if (obj.canvasGuid) {
      return obj.canvasGuid;
    }
  
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        const result = findCanvasGuid(obj[key]);
        if (result) return result;
      }
    }
    return null;
  }


  
  
  //TODO: Maybe moved this to another file
  var selectA1111APIButton = $("Select_a1111_button");
  var selectComfyuiAPIButton = $("Select_comfyui_button");


});


var localSettingsData = null;
  
function loadSettingsLocalStrage() {
    createToast('Settings Load', [
      'Canvas Background Color...',
      'Api port/host/check...',
      'Base Settings...',
      'Dpi...',
      'Grid, Layer, Controle...',
      'Margin From Panel...',
      'Knife Space Size...',
      'Load Completed!!'
    ], 1500);

  const localSettingsData = localStorage.getItem('localSettingsData');

  if (localSettingsData) {
    const localSettings = JSON.parse(localSettingsData);
    var bgColorInputElement = $('bg-color');
    bgColorInputElement.value = localSettings.canvasBgColor || "#ffffff";
    
    var event = new Event('input', { 'bubbles': true, 'cancelable': true });
    bgColorInputElement.dispatchEvent(event);

    $('view_layers_checkbox').checked         = localSettings.view_layers_checkbox ?? true;
    $('view_controles_checkbox').checked      = localSettings.view_controles_checkbox ?? true;
    $('knifePanelSpaceSize').value            = localSettings.knifePanelSpaceSize || "20";
    $('outputDpi').value                      = localSettings.canvasDpi || "450";
    $('gridSizeInput').value                  = localSettings.canvasGridLineSize || "10";
    $('marginFromPanel').value                = localSettings.canvasMarginFromPanel || 20;
    $('Stable_Diffusion_WebUI_apiPort').value = localSettings.Stable_Diffusion_WebUI_apiPort || "7860";
    $('Stable_Diffusion_WebUI_apiHost').value = localSettings.Stable_Diffusion_WebUI_apiHost || "127.0.0.1";
    $('apiHeartbeatCheckbox').checked         = localSettings.apiHeartbeatCheckbox;
    svgPagging                                = localSettings.canvasMarginFromPanel || 20;
    $('basePrompt_model').value          = localSettings.basePrompt_text2img_model || basePrompt.text2img_model;
    $('basePrompt_samplingMethod').value = localSettings.basePrompt_text2img_samplingMethod || basePrompt.text2img_samplingMethod;
    $('basePrompt_prompt').value         = localSettings.basePrompt_text2img_prompt || basePrompt.text2img_prompt;
    $('basePrompt_negative').value       = localSettings.basePrompt_text2img_negative || basePrompt.text2img_negative;
    $('basePrompt_seed').value           = localSettings.basePrompt_text2img_seed || basePrompt.text2img_seed;
    $('basePrompt_cfg_scale').value      = localSettings.basePrompt_text2img_cfg_scale || basePrompt.text2img_cfg_scale;
    $('basePrompt_width').value          = localSettings.basePrompt_text2img_width || basePrompt.text2img_width;
    $('basePrompt_height').value         = localSettings.basePrompt_text2img_height || basePrompt.text2img_height;
    $('basePrompt_samplingSteps').value  = localSettings.basePrompt_text2img_samplingSteps || basePrompt.text2img_samplingSteps;
    $('text2img_hr_upscaler').value    = localSettings.basePrompt_text2img_hr_upscaler || basePrompt.text2img_hr_upscaler;
    $('text2img_hr_scale').value       = localSettings.basePrompt_text2img_hr_scale || basePrompt.text2img_hr_scale;
    $('text2img_hr_denoise').value     = localSettings.basePrompt_text2img_hr_denoise || basePrompt.text2img_hr_denoise;
    $('text2img_hr_step').value        = localSettings.basePrompt_text2img_hr_step || basePrompt.text2img_hr_step;

    $('basePrompt_height').addEventListener('blur', function() {
      var value = parseInt(this.value);
      if (value !== -1) {
        this.value = Math.round(value / 8) * 8;
      }
    });
    $('basePrompt_width').addEventListener('blur', function() {
      var value = parseInt(this.value);
      if (value !== -1) {
        this.value = Math.round(value / 8) * 8;
      }
    });

    var nowExternalMode = localSettings.externalAI || apis.A1111;
    console.log("nowExternalMode, " + nowExternalMode);
    if( nowExternalMode === apis.A1111 ){
      changeExternalAPI( $("sdWebUIButton") );
    }else{
      changeExternalAPI( $("comfyUIButton") );
    }

    basePrompt.text2img_prompt          = $('basePrompt_prompt').value;
    basePrompt.text2img_negative        = $('basePrompt_negative').value;
    basePrompt.text2img_model           = $('basePrompt_model').value;
    basePrompt.text2img_samplingSteps   = $('basePrompt_samplingSteps').value;
    basePrompt.text2img_samplingMethod  = $('basePrompt_samplingMethod').value;
    basePrompt.text2img_width           = $('basePrompt_width').value;
    basePrompt.text2img_height          = $('basePrompt_height').value;
    basePrompt.text2img_seed            = $('basePrompt_seed').value;
    basePrompt.text2img_cfg_scale       = $('basePrompt_cfg_scale').value;
    basePrompt.text2img_hr_upscaler     = $('text2img_hr_upscaler').value;
    basePrompt.text2img_hr_step         = $('text2img_hr_step').value;
    basePrompt.text2img_hr_denoise      = $('text2img_hr_denoise').value;
    basePrompt.text2img_hr_scale        = $('text2img_hr_scale').value;
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
  ], 1500);
  
  localSettingsData = {
    externalAI: API_mode,
    view_layers_checkbox: $('view_layers_checkbox').checked,
    view_controles_checkbox: $('view_controles_checkbox').checked,

    knifePanelSpaceSize: $('knifePanelSpaceSize').value,
    canvasBgColor: $('bg-color').value,
    canvasDpi: $('outputDpi').value,
    canvasGridLineSize: $('gridSizeInput').value,
    canvasMarginFromPanel: $('marginFromPanel').value,
    Stable_Diffusion_WebUI_apiPort: $('Stable_Diffusion_WebUI_apiPort').value,
    Stable_Diffusion_WebUI_apiHost: $('Stable_Diffusion_WebUI_apiHost').value,
    apiHeartbeatCheckbox : $('apiHeartbeatCheckbox').checked ,
    basePrompt_text2img_prompt: basePrompt.text2img_prompt,
    basePrompt_text2img_negative: basePrompt.text2img_negative,
    basePrompt_text2img_seed: basePrompt.text2img_seed,
    basePrompt_text2img_cfg_scale: basePrompt.text2img_cfg_scale,
    basePrompt_text2img_width: basePrompt.text2img_width,
    basePrompt_text2img_height: basePrompt.text2img_height,
    basePrompt_text2img_samplingMethod: basePrompt.text2img_samplingMethod,
    basePrompt_text2img_samplingSteps: basePrompt.text2img_samplingSteps,
    basePrompt_text2img_scheduler: basePrompt.text2img_scheduler,
    basePrompt_text2img_model: basePrompt.text2img_model,
    basePrompt_text2img_hr_upscaler: basePrompt.text2img_hr_upscaler,
    basePrompt_text2img_hr_scale: basePrompt.text2img_hr_scale,
    basePrompt_text2img_hr_step: basePrompt.text2img_hr_step,
    basePrompt_text2img_hr_denoise: basePrompt.text2img_hr_denoise
  };
  localStorage.setItem('localSettingsData', JSON.stringify(localSettingsData));
}

document.addEventListener('DOMContentLoaded', function() {
  loadSettingsLocalStrage();
  changeView("layer-panel", $('view_layers_checkbox').checked);
  changeView("controls", $('view_controles_checkbox').checked);
});

document.addEventListener('DOMContentLoaded', function() {
  $('svgDownload').onclick = function () {
    var svg = canvas.toSVG();
    svgDownload('canvas.svg', svg);
  };
});


function svgDownload(filename, content) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}