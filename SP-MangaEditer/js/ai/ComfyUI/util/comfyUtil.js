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




function Comfyui_replace_placeholders(workflow, requestData) {
    workflow = Comfyui_replacePlaceholder(workflow, "%prompt%",     requestData["prompt"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%negative%",   requestData["negative_prompt"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%cfg%",        requestData["cfg_scale"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%steps%",      requestData["steps"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%scheduler%",  requestData["scheduler"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%seed%",       requestData["seed"], true);
    workflow = Comfyui_replacePlaceholder(workflow, "%vae%",        requestData["vae"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%width%",      requestData["width"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%height%",     requestData["height"]);
    workflow = Comfyui_replacePlaceholder(workflow, "%sampler%",    Comfyui_getValueByID("basePrompt_samplingMethod"));
    workflow = Comfyui_replacePlaceholder(workflow, "%model%",      Comfyui_getValueByID("basePrompt_model"));
    workflow = Comfyui_replacePlaceholder(workflow, "%denoise%",    Comfyui_getValueByID("img2img_denoise"));
    return workflow;
}

function Comfyui_getValueByID(id) {
    const el = $(id);
    if (!el) return "";
    return el.type === "checkbox" ? el.checked : el.value;
}

function Comfyui_replacePlaceholder(workflow, placeholder, value) {
    if (value === "") {
        console.log("Comfyui_replacePlaceholder value is empty", value);
        return workflow;
    }

    function checkPlaceholderExists(obj) {
        for (let key in obj) {
            if (typeof obj[key] === "string" && obj[key].includes(placeholder)) {
                return true;
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                if (checkPlaceholderExists(obj[key])) {
                    return true;
                }
            }
        }
        return false;
    }

    if (!checkPlaceholderExists(workflow)) {
        console.log("Placeholder not found in workflow", placeholder);
        return workflow;
    }

    function replaceInObject(obj) {
        for (let key in obj) {
            if (typeof obj[key] === "string") {
                if (value == -1) value = Math.floor(Math.random() * 50000000);
                obj[key] = obj[key].replace(placeholder, value);
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                replaceInObject(obj[key]);
            }
        }
    }

    const newWorkflow = JSON.parse(JSON.stringify(workflow));
    replaceInObject(newWorkflow);

    console.log("置き換えに成功した:placeholder:", placeholder);
    return newWorkflow;
}


function Comfyui_getClassTypeList(workflow) {
    const classTypeList = [];
    for (const key in workflow) {
      if (workflow.hasOwnProperty(key)) {
        classTypeList.push(workflow[key].class_type);
      }
    }
    return classTypeList;
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