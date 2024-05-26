document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.getElementById("projectSave");
  var loadButton = document.getElementById("projectLoad");

  var settingsSave = document.getElementById("settingsSave");
  var settingsLoad = document.getElementById("settingsLoad");

  settingsSave.addEventListener("click", function () {
    createToast('Settings Save', [
      'Canvas Background Color...',
      'Api port...',
      'Api host...',
      'Base Settings...',
      'Dpi...',
      'Grid Line Size...',
      'Margin From Panel...',
      'Save Completed!!'
    ]);
    const localSettingsData = {
        canvasBgColor:                                                  document.getElementById('bg-color').value,
        canvasDpi:                                                      document.getElementById('outputDpi').value,
        canvasGridLineSize:                                             document.getElementById('gridSizeInput').value,
        canvasMarginFromPanel:                                          document.getElementById('marginFromPanel').value,
        Stable_Diffusion_WebUI_apiPort:                                 document.getElementById('Stable_Diffusion_WebUI_apiPort').value,
        Stable_Diffusion_WebUI_apiHost:                                 document.getElementById('Stable_Diffusion_WebUI_apiHost').value,
        text2img_basePrompt_text2img_prompt:                            text2img_basePrompt.text2img_prompt, 
        text2img_basePrompt_text2img_negativePrompt:                    text2img_basePrompt.text2img_negativePrompt, 
        text2img_basePrompt_text2img_seed:                              text2img_basePrompt.text2img_seed, 
        text2img_basePrompt_text2img_cfg_scale:                         text2img_basePrompt.text2img_cfg_scale, 
        text2img_basePrompt_text2img_width:                             text2img_basePrompt.text2img_width, 
        text2img_basePrompt_text2img_height:                            text2img_basePrompt.text2img_height, 
        text2img_basePrompt_text2img_samplingMethod:                    text2img_basePrompt.text2img_samplingMethod, 
        text2img_basePrompt_text2img_samplingSteps:                     text2img_basePrompt.text2img_samplingSteps, 
        text2img_basePrompt_text2img_scheduler:                         text2img_basePrompt.text2img_scheduler, 
        text2img_basePrompt_text2img_model:                             text2img_basePrompt.text2img_model, 
        text2img_basePrompt_text2img_hr_upscaler:                       text2img_basePrompt.text2img_hr_upscaler, 
        text2img_basePrompt_text2img_basePrompt_hr_scale:               text2img_basePrompt.text2img_basePrompt_hr_scale, 
        text2img_basePrompt_text2img_basePrompt_hr_step:                text2img_basePrompt.text2img_basePrompt_hr_step, 
        text2img_basePrompt_text2img_basePrompt_hr_denoising_strength:  text2img_basePrompt.text2img_basePrompt_hr_denoising_strength
    };
    localStorage.setItem('localSettingsData', JSON.stringify(localSettingsData));
  });



  settingsLoad.addEventListener("click", function () {
    createToast('Settings Load', [
      'Canvas Background Color...',
      'Api port...',
      'Api host...',
      'Base Settings...',
      'Dpi...',
      'Grid Line Size...',
      'Margin From Panel...',
      'Load Completed!!'
    ]);

    const localSettingsData = localStorage.getItem('localSettingsData');
    if (localSettingsData) {
        const localSettings = JSON.parse(localSettingsData);
        
        var bgColorInputElement = document.getElementById('bg-color');
        bgColorInputElement.value                                       = localSettings.canvasBgColor || "#ffffff";
        var event = new Event('input', { 'bubbles': true,'cancelable': true });
        bgColorInputElement.dispatchEvent(event);

        document.getElementById('outputDpi').value                      = localSettings.canvasDpi || "300";
        document.getElementById('gridSizeInput').value                  = localSettings.canvasGridLineSize || "10";
        document.getElementById('marginFromPanel').value                = localSettings.canvasMarginFromPanel || "20";
        document.getElementById('Stable_Diffusion_WebUI_apiPort').value = localSettings.Stable_Diffusion_WebUI_apiPort || "7860";
        document.getElementById('Stable_Diffusion_WebUI_apiHost').value = localSettings.Stable_Diffusion_WebUI_apiHost || "127.0.0.1";
        text2img_basePrompt.text2img_prompt                             = localSettings.text2img_basePrompt_text2img_prompt || text2img_basePrompt.text2img_prompt;
        text2img_basePrompt.text2img_negativePrompt                     = localSettings.text2img_basePrompt_text2img_negativePrompt || text2img_basePrompt.text2img_negativePrompt ;
        text2img_basePrompt.text2img_seed                               = localSettings.text2img_basePrompt_text2img_seed || text2img_basePrompt.text2img_seed;
        text2img_basePrompt.text2img_cfg_scale                          = localSettings.text2img_basePrompt_text2img_cfg_scale || text2img_basePrompt.text2img_cfg_scale;
        text2img_basePrompt.text2img_width                              = localSettings.text2img_basePrompt_text2img_width || text2img_basePrompt.text2img_width;
        text2img_basePrompt.text2img_height                             = localSettings.text2img_basePrompt_text2img_height || text2img_basePrompt.text2img_height;
        text2img_basePrompt.text2img_samplingMethod                     = localSettings.text2img_basePrompt_text2img_samplingMethod || text2img_basePrompt.text2img_samplingMethod;
        text2img_basePrompt.text2img_samplingSteps                      = localSettings.text2img_basePrompt_text2img_samplingSteps || text2img_basePrompt.text2img_samplingSteps;
        text2img_basePrompt.text2img_scheduler                          = localSettings.text2img_basePrompt_text2img_scheduler || text2img_basePrompt.text2img_scheduler;
        text2img_basePrompt.text2img_model                              = localSettings.text2img_basePrompt_text2img_model || text2img_basePrompt.text2img_model;
        text2img_basePrompt.text2img_hr_upscaler                        = localSettings.text2img_basePrompt_text2img_hr_upscaler || text2img_basePrompt.text2img_hr_upscaler;
        text2img_basePrompt.text2img_basePrompt_hr_scale                = localSettings.text2img_basePrompt_text2img_basePrompt_hr_scale || text2img_basePrompt.text2img_basePrompt_hr_scale;
        text2img_basePrompt.text2img_basePrompt_hr_step                 = localSettings.text2img_basePrompt_text2img_basePrompt_hr_step || text2img_basePrompt.text2img_basePrompt_hr_step;
        text2img_basePrompt.text2img_basePrompt_hr_denoising_strength   = localSettings.text2img_basePrompt_text2img_basePrompt_hr_denoising_strength || text2img_basePrompt.text2img_basePrompt_hr_denoising_strength;

    } else {
      createToast("Settings Load Failed! (Local storage)", "Settings not found.");
    }
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
      zip.file(`state_${index}.json`, JSON.stringify(json));
    });

    imageMap.forEach((value, key) => {
      zip.file(`${key}.img`, value);
    });

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

          var sortedFiles = Object.keys(zip.files).sort();
          var promises = sortedFiles.map(function (fileName) {
            return zip.file(fileName).async("string").then(function (content) {
              if (fileName.endsWith(".img")) {
                let hash = fileName.split('.')[0];
                imageMap.set(hash, content);
              } else if (fileName.endsWith(".json") && fileName !== "text2img_basePrompt.json" && fileName !== "canvas_info.json") {
                return JSON.parse(content);
              }
            });
          });

          Promise.all([canvasInfoPromise, ...promises]).then(function (allData) {
            var canvasInfo = allData[0];
            stateStack = allData.slice(1).filter(data => data !== undefined);

            console.log("Loaded states:", stateStack);
            console.log("Loaded canvasInfo:", canvasInfo);

            document.body.removeChild(fileInput);
            currentStateIndex = stateStack.length - 1;

            resizeCanvasByNum(canvasInfo.width, canvasInfo.height)

            lastRedo();

            // Canvasのリサイズ
            // adjustCanvasSize();

            const endTime = performance.now();
            console.log(`Load operation took ${endTime - startTime} milliseconds`);
          });
        });
      }
    };
  });

});
