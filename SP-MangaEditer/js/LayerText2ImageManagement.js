
var floatingWindowItem = null; 
function openfloatingWindowItem(layer) {
  if (floatingWindowItem) {
    updatefloatingWindowItem(layer);
    return;
  }

  floatingWindowItem = document.createElement("div");
  floatingWindowItem.className = "floating-windowPromptClass";
  floatingWindowItem.style.cursor = "move"; 
  floatingWindowItem.innerHTML = `
    <h4>Text2Image Settings</h4>
    <div class="form-group">
      <label for="text2img_prompt">Prompt:</label>
      <textarea id="text2img_prompt" rows="3">${layer.text2img_prompt || ''}</textarea>
    </div>
    <div class="form-group">
      <label for="text2img_negativePrompt">Negative Prompt:</label>
      <textarea id="text2img_negativePrompt" rows="3">${layer.text2img_negativePrompt || ''}</textarea>
    </div>
    <div class="form-group form-row">
      <label for="text2img_seed">Seed(-1=Rundom, -2=Use Base):</label>
      <input type="number" id="text2img_seed" value="${layer.text2img_seed || -2}">
    </div>
    <div class="form-group form-row">
      <label for="text2img_width">Width(-1=Use Base):</label>
      <input type="number" id="text2img_width" step="8"  min="0" value="${layer.text2img_width || 1024}">
    </div>
    <div class="form-group form-row">
      <label for="text2img_height">Height(-1=Use Base):</label>
      <input type="number" id="text2img_height" step="8"  min="0" value="${layer.text2img_height || 1024}">
    </div>

    <div class="button-group">
      <button id="text2imgItem_saveButton">Save</button>
      <button id="text2imgItem_closeButton">Close</button>
    </div>
  `;
  document.body.appendChild(floatingWindowItem);

  document.getElementById('text2img_height').addEventListener('blur', function() {
    var value = parseInt(this.value);
    if (value !== -1) {
      this.value = Math.round(value / 8) * 8;
    }
  });
  document.getElementById('text2img_width').addEventListener('blur', function() {
    var value = parseInt(this.value);
    if (value !== -1) {
      this.value = Math.round(value / 8) * 8;
    }
  });

  makeDraggable(floatingWindowItem); 
  updatefloatingWindowItem(layer);

  // Add event listener for the Save button
  var text2imgItem_saveButton = document.getElementById("text2imgItem_saveButton");
  text2imgItem_saveButton.onclick = function () {
    adjustToMultipleOfEight('text2img_height');
    adjustToMultipleOfEight('text2img_width');

    saveLayerText2ImageAttributes(layer);
    closefloatingWindowItem();
  };

  // Add event listener for the Close button
  var text2imgItem_closeButton = document.getElementById("text2imgItem_closeButton");
  text2imgItem_closeButton.onclick = function () {
    closefloatingWindowItem();
  };
}

function adjustToMultipleOfEight(elementId) {
  var inputElement = document.getElementById(elementId);
  var value = parseInt(inputElement.value);
  if (value !== -1) {
    inputElement.value = Math.round(value / 8) * 8;
  }
}

function updatefloatingWindowItem(layer) {
  var canvasRect = canvas.getElement().getBoundingClientRect();
  floatingWindowItem.style.left = 50 + "px";
  floatingWindowItem.style.top = 50 + "px";
  floatingWindowItem.style.width = "30%";
  
  console.log("updatefloatingWindowItem left top", floatingWindowItem.style.left, floatingWindowItem.style.top);
}

function saveLayerText2ImageAttributes(layer) {
  layer.text2img_prompt = document.getElementById("text2img_prompt").value;
  layer.text2img_negativePrompt = document.getElementById("text2img_negativePrompt").value;
  layer.text2img_seed = parseInt(document.getElementById("text2img_seed").value);
  layer.text2img_width = parseInt(document.getElementById("text2img_width").value);
  layer.text2img_height = parseInt(document.getElementById("text2img_height").value);

  console.log("Saved layer attributes:", layer);
  console.log("applyChanges", "saveState");
  saveState();
}

function closefloatingWindowItem() {
  if (floatingWindowItem) {
    document.body.removeChild(floatingWindowItem);
    floatingWindowItem = null;
  }
}

function openBaseText2ImagefloatingWindow() {
  openfloatingWindowItem(basePrompt);
}





function openText2ImageBaseFloatingWindow() {
  // フローティングウィンドウの作成
  const floatingWindow = document.createElement("div");
  floatingWindow.className = "floating-windowPromptClass";
  floatingWindow.style.cursor = "move"; 
  floatingWindow.innerHTML = `
      <h4>Text2Image Base Settings</h4>
      <div class="form-group">
          <label>Prompt:</label>
          <textarea id="text2img_basePrompt_prompt" rows="3">${text2img_basePrompt.text2img_prompt}</textarea>
      </div>
      <div class="form-group">
          <label>Negative Prompt:</label>
          <textarea id="text2img_basePrompt_negativePrompt" rows="3">${text2img_basePrompt.text2img_negativePrompt}</textarea>
      </div>
      <div class="form-group form-row">
          <label>Seed:</label>
          <input type="number" id="text2img_basePrompt_seed"  min="-2" value="${text2img_basePrompt.text2img_seed}">
      </div>
      <div class="form-group form-row">
          <label>CFG Scale:</label>
          <input type="number" id="text2img_basePrompt_cfg_scale" min="1" value="${text2img_basePrompt.text2img_cfg_scale}">
      </div>
      <div class="form-group form-row">
          <label>Width:</label>
          <input type="number" id="text2img_basePrompt_width" step="8" min="0" value="${text2img_basePrompt.text2img_width}">
      </div>
      <div class="form-group form-row">
          <label>Height:</label>
          <input type="number" id="text2img_basePrompt_height" step="8"  min="0" value="${text2img_basePrompt.text2img_height}">
      </div>
      <div class="form-group form-row">
          <label>Sampling Method:</label>
          <select id="text2img_basePrompt_samplingMethod"></select>
      </div>
      <div class="form-group form-row">
          <label>Sampling Steps:</label>
          <input type="number" id="text2img_basePrompt_samplingSteps" value="${text2img_basePrompt.text2img_samplingSteps}">
      </div>
      <div class="form-group form-row">
          <label>HR Upscaler:</label>
          <input type="text" id="text2img_basePrompt_hr_upscaler" value="${text2img_basePrompt.text2img_hr_upscaler}">
      </div>

      <div class="form-group form-row">
        <label>Model:</label>
        <select id="text2img_basePrompt_model"></select>
      </div>

      <button onclick="updateText2ImgBasePrompt()">Save</button>
      <button onclick="closeFloatingWindowPromptClass()">Close</button>
  `;

  document.body.appendChild(floatingWindow);

  document.getElementById('text2img_basePrompt_height').addEventListener('blur', function() {
    var value = parseInt(this.value);
    if (value !== -1) {
      this.value = Math.round(value / 8) * 8;
    }
  });
  document.getElementById('text2img_basePrompt_width').addEventListener('blur', function() {
    var value = parseInt(this.value);
    if (value !== -1) {
      this.value = Math.round(value / 8) * 8;
    }
  });


  makeDraggable(floatingWindow); 
  fetchModels();
  fetchSampler();
}

function updateText2ImgBasePrompt() {
  adjustToMultipleOfEight('text2img_basePrompt_width');
  adjustToMultipleOfEight('text2img_basePrompt_height');
  text2img_basePrompt.text2img_prompt = document.getElementById('text2img_basePrompt_prompt').value;
  text2img_basePrompt.text2img_negativePrompt = document.getElementById('text2img_basePrompt_negativePrompt').value;
  text2img_basePrompt.text2img_seed = parseInt(document.getElementById('text2img_basePrompt_seed').value, 10);
  text2img_basePrompt.text2img_cfg_scale = parseInt(document.getElementById('text2img_basePrompt_cfg_scale').value, 10);
  text2img_basePrompt.text2img_width = parseInt(document.getElementById('text2img_basePrompt_width').value, 10);
  text2img_basePrompt.text2img_height = parseInt(document.getElementById('text2img_basePrompt_height').value, 10);
  text2img_basePrompt.text2img_samplingSteps = parseInt(document.getElementById('text2img_basePrompt_samplingSteps').value, 10);
  text2img_basePrompt.text2img_hr_upscaler = document.getElementById('text2img_basePrompt_hr_upscaler').value;

  var selectedModel = document.getElementById('text2img_basePrompt_model').value;
  text2img_basePrompt.text2img_model = selectedModel;

  var selectedSampler = document.getElementById('text2img_basePrompt_samplingMethod').value;
  text2img_basePrompt.text2img_samplingMethod = selectedSampler;

  console.log('Updated selectedModel:', selectedModel);
  closeFloatingWindowPromptClass();

  sendModelToServer();
}
