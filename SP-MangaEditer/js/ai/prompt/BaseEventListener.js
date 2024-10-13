$('text2img_basePrompt_prompt').addEventListener('change', function(event){
  text2img_basePrompt.text2img_prompt = event.target.value;
});
$('text2img_basePrompt_negativePrompt').addEventListener('change', function(event){
  text2img_basePrompt.text2img_negativePrompt = event.target.value;
});
$('text2img_basePrompt_model').addEventListener('change', function(event){
  text2img_basePrompt.text2img_model = event.target.value;
});
$('text2img_basePrompt_samplingSteps').addEventListener('change', function(event){
  text2img_basePrompt.text2img_samplingSteps = event.target.value;
});
$('text2img_basePrompt_samplingMethod').addEventListener('change', function(event){
  text2img_basePrompt.text2img_samplingMethod = event.target.value;
});
$('text2img_basePrompt_width').addEventListener('change', function(event){
  text2img_basePrompt.text2img_width = event.target.value;
});
$('text2img_basePrompt_height').addEventListener('change', function(event){
  text2img_basePrompt.text2img_height = event.target.value;
});
$('text2img_basePrompt_seed').addEventListener('change', function(event){
  text2img_basePrompt.text2img_seed = event.target.value;
});
$('text2img_basePrompt_cfg_scale').addEventListener('change', function(event){
  text2img_basePrompt.text2img_cfg_scale = event.target.value;
});
$('text2img_basePrompt_hr_upscaler').addEventListener('change', function(event){
  text2img_basePrompt.text2img_hr_upscaler = event.target.value;
});
$('text2img_basePrompt_hr_step').addEventListener('change', function(event){
  text2img_basePrompt.text2img_basePrompt_hr_step = event.target.value;
});
$('text2img_basePrompt_hr_denoising_strength').addEventListener('change', function(event){
  text2img_basePrompt.text2img_basePrompt_hr_denoising_strength = event.target.value;
});
$('text2img_basePrompt_hr_scale').addEventListener('change', function(event){
  text2img_basePrompt.text2img_basePrompt_hr_scale = event.target.value;
});

