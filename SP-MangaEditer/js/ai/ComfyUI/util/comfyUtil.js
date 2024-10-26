function Comfyui_isError(response) {
    if (response && typeof response === 'object') {
        const promptId = Object.keys(response)[0];
        if (promptId && response[promptId] && response[promptId].status) {
            const status = response[promptId].status;
            const result = status.status_str === "error";
            console.log('Comfyui_isError return', result);
            return result;
        }
    }
    console.log('Comfyui_isError return false');
    return false;
  }
  function Comfyui_getErrorMessage(response) {
    console.log('Comfyui_getErrorMessage called with:', JSON.stringify(response));
  
    if (Comfyui_isError(response)) {
        const promptId = Object.keys(response)[0];
        const status = response[promptId].status;
        const errorMessage = {
            status_str: status.status_str || 'Unknown error',
            completed: status.completed,
            exception_type: 'Unknown',
            exception_message: 'An error occurred',
            traceback: []
        };
  
        if (Array.isArray(status.messages) && status.messages.length > 0) {
            const lastMessage = status.messages[status.messages.length - 1];
            if (Array.isArray(lastMessage) && lastMessage.length > 1 && typeof lastMessage[1] === 'object') {
                const errorDetails = lastMessage[1];
                errorMessage.exception_type = errorDetails.exception_type || errorMessage.exception_type;
                errorMessage.exception_message = errorDetails.exception_message || errorMessage.exception_message;
                errorMessage.traceback = Array.isArray(errorDetails.traceback) ? errorDetails.traceback : errorMessage.traceback;
            }
        }
  
        console.log('Comfyui_getErrorMessage returning:', errorMessage);
        return errorMessage;
    }
    console.log('Comfyui_getErrorMessage returning null');
    return null;
  }
  
  
  
  
  function Comfyui_replace_placeholders(workflow, requestData, isT2I=true) {
    const builder = createWorkflowBuilder(workflow);
    builder.updateNodesByType("KSampler", {
            seed: requestData["seed"]=="-1" ? Math.floor(Math.random() * 50000000) : requestData["seed"],
            steps: requestData["steps"],
            cfg: requestData["cfg_scale"],
            sampler_name: Comfyui_getValueByID("basePrompt_samplingMethod")
        })
    .updateNodesByType("CheckpointLoaderSimple", {
            ckpt_name: Comfyui_getValueByID("basePrompt_model")
        })
    .updateNodesByType("CLIPTextEncode", {
            text: requestData["prompt"]
        }, "CLIPTextEncode_Prompt")
    .updateNodesByType("CLIPTextEncode", {
            text: requestData["negative_prompt"]
        }, "CLIPTextEncode_Negative")
    .updateNodesByType("EmptyLatentImage", {
            width: requestData["width"],
            height: requestData["height"]
        });

    if( !isT2I ){
        builder.updateNodesByType("KSampler", {
            denoise: Comfyui_getValueByID("img2img_denoise")
        }).updateNodesByType("LoadImage", {
            image: requestData["uploadFileName"]
        });
    }
    const newWorkflow = builder.build();
    return newWorkflow;
  }
  
  function Comfyui_getValueByID(id) {
      const el = $(id);
      if (!el) return "";
      return el.type === "checkbox" ? el.checked : el.value;
  }

  
  function Comfyui_getUrl(){
      const server_address = hostInput.value + ":" + portInput.value;
      return `http://${server_address}/`;
  }
  
  var generateFilenameIndex = 0;
  function generateFilename() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
      var filename = `temp_${year}${month}${day}${hours}${minutes}${seconds}_${milliseconds}_${generateFilenameIndex}.png`;
      generateFilenameIndex++;
      console.log("filename:", filename);
      return filename;
  }