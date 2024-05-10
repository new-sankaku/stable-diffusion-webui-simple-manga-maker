function openPromptChangeFloatingWindow() {
  const floatingWindow = document.createElement("div");
  floatingWindow.className = "floating-windowPromptClass";
  floatingWindow.style.cursor = "move"; 

  floatingWindow.innerHTML = `
      <h4>Prompt Replace</h4>
      ${createPromptPair("Old Prompt1", "New Prompt1")}
      ${createPromptPair("Old Prompt2", "New Prompt2")}
      ${createPromptPair("Old Prompt3", "New Prompt3")}
      ${createPromptPair("Old Negative Prompt1", "New Negative Prompt1")}
      ${createPromptPair("Old Negative Prompt2", "New Negative Prompt2")}
      ${createPromptPair("Old Negative Prompt3", "New Negative Prompt3")}
      <button onclick="applyChanges()">All Change</button>
      <button onclick="closePromptChangeFloatingWindow()">Close</button>
  `;

  document.body.appendChild(floatingWindow);
  makeDraggable(floatingWindow); 
}

function createPromptPair(oldLabel, newLabel) {
  // IDのスペースをハイフンに置き換える
  const oldId = oldLabel.replace(/\s/g, '-').toLowerCase();
  const newId = newLabel.replace(/\s/g, '-').toLowerCase();

  return `
    <div class="prompt-replace-form-group">
      <textarea id="${oldId}-old" placeholder="${oldLabel}"></textarea>
      <textarea id="${newId}-new" placeholder="${newLabel}"></textarea>
    </div>
  `;
}
function applyChanges() {
  var layers = canvas.getObjects();

  var prompts = [
    { old: document.getElementById('old-prompt1-old').value, new: document.getElementById('new-prompt1-new').value },
    { old: document.getElementById('old-prompt2-old').value, new: document.getElementById('new-prompt2-new').value },
    { old: document.getElementById('old-prompt3-old').value, new: document.getElementById('new-prompt3-new').value },
    { old: document.getElementById('old-negative-prompt1-old').value, new: document.getElementById('new-negative-prompt1-new').value },
    { old: document.getElementById('old-negative-prompt2-old').value, new: document.getElementById('new-negative-prompt2-new').value },
    { old: document.getElementById('old-negative-prompt3-old').value, new: document.getElementById('new-negative-prompt3-new').value }
  ];

  layers.forEach(function(layer) {
    prompts.forEach(function(prompt) {
      if (layer.text2img_prompt && layer.text2img_prompt.includes(prompt.old)) {
        layer.text2img_prompt = layer.text2img_prompt.replace(new RegExp(prompt.old, 'g'), prompt.new);
      }
      if (layer.text2img_negativePrompt && layer.text2img_negativePrompt.includes(prompt.old)) {
        layer.text2img_negativePrompt = layer.text2img_negativePrompt.replace(new RegExp(prompt.old, 'g'), prompt.new);
      }
    });
  });
}

function closePromptChangeFloatingWindow() {
  const window = document.querySelector('.floating-windowPromptClass');
  document.body.removeChild(window);
}