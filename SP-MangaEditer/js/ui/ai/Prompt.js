function showT2IPrompts(layer) { 
  var otherControlsMini = $("other-controls-mini");
  otherControlsMini.innerHTML = `
<div class="control textarea-control">
    <div class="textarea-label-wrapper">
        <label class="textarea-label" for="textarea">Prompt</label>
    </div>
    <textarea id="text2img_prompt" name="textarea" placeholder=" ">${
      layer.text2img_prompt || ""
    }</textarea>
</div>
<div class="control textarea-control">
    <div class="textarea-label-wrapper">
        <label class="textarea-label" for="textarea">Negative</label>
    </div>
    <textarea id="text2img_negativePrompt" name="textarea" placeholder=" ">${
      layer.text2img_negativePrompt || ""
    }</textarea>
</div>
                    
<div class="dual-number-control">
    <div class="control">
        <input type="number" id="text2img_width" name="number-input-1" placeholder=" " value="${
          layer.text2img_width || 1024
        }">
        <span class="label">Width(-1=Use Base)</span>
    </div>
    <div class="control">
        <input type="number" id="text2img_height" name="number-input-1" placeholder=" " value="${
          layer.text2img_height || 1024
        }">
        <span class="label">Height(-1=Use Base)</span>
    </div>
</div>
                    
<div class="dual-number-control">
    <div class="control">
        <input type="number" id="text2img_seed" name="number-input-1" placeholder=" " value="${
          layer.text2img_seed || -2
        }">
        <span class="label">Seed(-1=Rundom, -2=Use Base)</span>
    </div>
    <div class="control" style="visibility: hidden;">
        <select id="dummy202410130402" name="dropdown">
        </select>
        <span class="label">dummy</span>
    </div>
</div>
    `;

  $("text2img_prompt").addEventListener("input", function () {
    layer.text2img_prompt = this.value;
  });

  $("text2img_negativePrompt").addEventListener("input", function () {
    layer.text2img_negativePrompt = this.value;
  });

  $("text2img_seed").addEventListener("input", function () {
    layer.text2img_seed = this.value;
  });

  $("text2img_height").addEventListener("blur", function () {
    var value = parseInt(this.value);
    if (value !== -1) {
      this.value = Math.round(value / 8) * 8;
    }
    layer.text2img_height = this.value;
  });
  $("text2img_width").addEventListener("blur", function () {
    var value = parseInt(this.value);
    if (value !== -1) {
      this.value = Math.round(value / 8) * 8;
    }
    layer.text2img_width = this.value;
  });

  setAutoSizeingControlMini();
}

function showI2IPrompts(layer) {
  var otherControlsMini = $("other-controls-mini");
  otherControlsMini.innerHTML = `
<div class="control textarea-control">
    <div class="textarea-label-wrapper">
        <label class="textarea-label" for="textarea">Prompt</label>
    </div>
    <textarea id="text2img_prompt" name="textarea" placeholder=" ">${
      layer.text2img_prompt || ""
    }</textarea>
</div>
<div class="control textarea-control">
    <div class="textarea-label-wrapper">
        <label class="textarea-label" for="textarea">Negative</label>
    </div>
    <textarea id="text2img_negativePrompt" name="textarea" placeholder=" ">${
      layer.text2img_negativePrompt || ""
    }</textarea>
</div>
                    
<div class="dual-number-control">
    <div class="control">
        <input type="number" id="text2img_seed" name="number-input-1" placeholder=" " value="${
          layer.text2img_seed || -2
        }">
        <span class="label">Seed(-1=Rundom, -2=Use Base)</span>
    </div>
    <div class="control">
        <input type="number" id="img2imgScale" name="number-input-1" placeholder=" " step="0.1"  min="0.1" value="${
          layer.img2imgScale || 1.2
        }">
        <span class="label">Scale</span>
    </div>
</div>

<div class="dual-number-control">
    <div class="control">
        <input type="number" id="img2img_denoising_strength" name="number-input-1" placeholder=" " step="0.01"  max="1" min="0" value="${
          layer.img2img_denoising_strength || 0.7
        }">
        <span class="label">Seed(-1=Rundom, -2=Use Base)</span>
    </div>
    <div class="control" style="visibility: hidden;">
        <input type="number" id="dummy202410130418">
        <span class="label">dummy202410130418</span>
    </div>
</div>
  `;

  $("text2img_prompt").addEventListener("input", function () {
    layer.text2img_prompt = this.value;
    console.log("layer.text2img_prompt:", layer.text2img_prompt);
  });

  $("text2img_negativePrompt").addEventListener("input", function () {
    layer.text2img_negativePrompt = this.value;
  });

  $("text2img_seed").addEventListener("input", function () {
    layer.text2img_seed = this.value;
  });
  $("img2imgScale").addEventListener("input", function () {
    layer.img2imgScale = this.value;
  });
  $("img2img_denoising_strength").addEventListener("input", function () {
    layer.img2img_denoising_strength = this.value;
  });

  setAutoSizeingControlMini();
}

function adjustToMultipleOfEight(elementId) {
  var inputElement = $(elementId);
  var value = parseInt(inputElement.value);
  if (value !== -1) {
    inputElement.value = Math.round(value / 8) * 8;
  }
}
