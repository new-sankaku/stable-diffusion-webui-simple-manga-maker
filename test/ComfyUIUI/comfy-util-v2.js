const uuid = crypto.randomUUID();


class ComfyUIEndpoints {
  #getUrlParts() {
    const serverAddress = $('comfyUIPageUrl').value;
    const url = new URL(serverAddress);
    return {
      protocol: url.protocol.replace(':', ''),
      domain: url.hostname,
      port: url.port || '',
      wsProtocol: url.protocol === 'https:' ? 'wss' : 'ws'
    };
  }
  
  constructor() {
    this.urls = this.setupUrlProxy();
  }

  setupUrlProxy() {
    return new Proxy({}, {
      get: (target, prop) => {
        const { protocol, domain, port, wsProtocol } = this.#getUrlParts();
        const baseUrl = `${protocol}://${domain}${port ? ':' + port : ''}`;
        const wsUrl = `${wsProtocol}://${domain}${port ? ':' + port : ''}`;
        const endpoint = this.getEndpoint(prop);

        if (prop === 'ws') {
          return `${wsUrl}/ws`;
        }
        return `${baseUrl}${endpoint}`;
      }
    });
  }

  getEndpoint(key) {
    const endpoints = {
      settings: '/settings',
      prompt: '/prompt',
      history: '/history/',
      view: '/view',
      uploadImage: '/upload/image',
      objectInfo: '/object_info/',
      objectInfoOnly: '/object_info'
    };
    return endpoints[key] || '';
  }
}

let comfyUI = null;
let comfyUIUrls = null;
comfyUI = new ComfyUIEndpoints();
comfyUIUrls = comfyUI.urls;

async function comfyui_apiHeartbeat() {
  const label = $("ExternalService_Heartbeat_Label");
  try {
    const response = await fetch(comfyUIUrls.settings, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    
    console.log("response.ok", response.ok);
    if (response.ok) {
      console.log("Comfy ON");
      label.innerHTML = "ComufyUI ON";
      label.style.color = "green";
      return true;
    } else {
      console.log("Comfy OFF1");
      label.innerHTML = "ComufyUI OFF";
      label.style.color = "red";
    }
  } catch (error) {
    console.log("Comfy OFF2");
    label.innerHTML = "ComufyUI OFF";
    label.style.color = "red";
  }
  return false;
}

let isOnline = false;
async function monitorComfyUIConnection() {
  while (true) {
      const currentStatus = await comfyui_apiHeartbeat();
      if (currentStatus !== isOnline) {
          isOnline = currentStatus;
          console.log(`接続状態が変更されました: ${isOnline ? 'ON' : 'OFF'}`);
          if (isOnline) {
              console.log("オンライン状態になりました。ワークフロー更新を試みます...");
              workflowEditor.updateObjectInfoAndWorkflows();
          }
      } else {
          console.log(`接続状態に変更なし: ${isOnline ? 'オンライン' : 'オフライン'}`);
      }
      const interval = isOnline ? 15000 : 5000;
      await new Promise(resolve => setTimeout(resolve, interval));
  }
}


monitorComfyUIConnection();



function generateTimestampFileName(extension = 'png') {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  return `${year}${month}${day}-${hours}${minutes}${seconds}-${milliseconds}.${extension}`;
 }
 



 async function comfyui_uploadImage(file, fileName = null, overwrite = true) {
  if (!file) {
    throw new Error("ファイルが指定されていません");
  }

  if (!fileName) {
    fileName = generateTimestampFileName();
  }

  const formData = new FormData();
  formData.append("image", file, fileName);
  formData.append("overwrite", overwrite.toString());

  const response = await fetch(comfyUIUrls.uploadImage, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`アップロードエラー: ${response.status}`);
  }

  const result = await response.json();
  return {
    name: fileName,
    subfolder: result.subfolder,
    type: result.type,
    success: true
  };
}

async function comfyui_handleFileUpload(input) {
  const file = input.files[0];
  const nodeId = input.dataset.nodeId;
  const inputName = input.dataset.inputName;
  const previewTargetId = input.dataset.previewTarget;

  if (!file) return;

  try {
    const uploadResult = await comfyui_uploadImage(file);
    
    if (uploadResult.success) {
      const previewContainer = document.querySelector(`[data-preview-id="${previewTargetId}"]`);
      const previewImage = previewContainer?.querySelector('img');
      
      if (previewContainer && previewImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }

      if (workflow[nodeId] && inputName) {
        workflow[nodeId].inputs[inputName] = uploadResult.name;
      }
    }
  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
  }
}


//type=input output temp
//subfolder: <subfolder>
async function comfyui_get_image(filename, type = 'input') {
  try {
    const baseUrl = document.getElementById('comfyUIPageUrl').value;
    const params = new URLSearchParams({
      filename: filename,
      type: type
    });
    
    const response = await fetch(`${baseUrl}/view?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("画像取得エラー:", error);
    return null;
  }
}











async function Comfyui_put_queue(workflow) {

console.log("Comfyui_put_queue workflow", workflow);

  var response = await Comfyui_queue_prompt(workflow);
  if (!response) return null;
  processing_prompt = true;
  var prompt_id = response.prompt_id;
  await Comfyui_track_prompt_progress(prompt_id);

  response = await Comfyui_get_history(prompt_id);
  if (!response) return { error: true, message: "Unknown error", details: "Please check ComfyUI console.",};

  if (Comfyui_isError(response)) {
    const errorMessage = Comfyui_getErrorMessage(response);
    return {
      error: true,
      message: errorMessage.exception_message || "Unknown error",
      details: errorMessage,
    };
  } else {
    var image_data = response[prompt_id]["outputs"][Object.keys(response[prompt_id]["outputs"])[0]].images["0"];
    var img = await Comfyui_get_image(image_data);

    return new Promise((resolve) => {
      resolve(img);
    });
  }
}

async function Comfyui_get_image(image_data_to_recieve) {
  try {
    const params = new URLSearchParams({
      filename: image_data_to_recieve.filename,
      subfolder: image_data_to_recieve.subfolder,
      type: image_data_to_recieve.type,
    });
    const response = await fetch(comfyUIUrls.view + '?' + params.toString());
    console.log("画像データをサーバーから取得しました。");

    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }

    const blob = await response.blob();
    const image_src = URL.createObjectURL(blob);
    console.log("画像ソース:", image_src);
    
    return image_src;
  } catch (error) {
    console.error("画像取得エラー:", error);
    return null;
  }
}

function Comfyui_getErrorMessage(response) {
  // console.log('Comfyui_getErrorMessage called with:', JSON.stringify(response));

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


async function Comfyui_queue_prompt(prompt) {
  try {
    const p = { prompt: prompt, client_id: uuid };
    const response = await fetch(comfyUIUrls.prompt, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(p),
    });

    if (!response.ok) {
      const errorText = await response.text();
      createToastError(`HTTP error! status: ${response.status}, message: ${errorText}`);
      return null;
    }

    const response_data = await response.json();
    return response_data;

  } catch (error) {
    let errorMessage = "Text2Image Error. ";
    if (error.name === 'TypeError') {
      errorMessage += "Network error or COMFYUI server is down.";
    } else if (error.message.includes('HTTP error!')) {
      errorMessage += error.message;
    } else {
      errorMessage += "check COMFYUI!";
    }

    console.error('Error details:', error);
    createToastError(errorMessage);
    return null;
  }
}


async function Comfyui_get_history(prompt_id) {
  console.log(
    "Comfyui_get_history関数が呼び出されました。プロンプトID:",
    prompt_id
  );
  try {
    const response = await fetch(comfyUIUrls.history + prompt_id,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );
    console.log("サーバーに履歴データをリクエストしました。");
    const data = await response.json();
    console.log("履歴データ:", data);
    return data;
  } catch (error) {
    console.log("Text2Imageエラー:", error);
    createToastError("Text2Image Error.", "check COMFYUI!");
    return null;
  }
}



async function Comfyui_track_prompt_progress(prompt_id) {
  if (!socket) Comfyui_connect();

  return new Promise((resolve, reject) => {
    socket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        //akip
      } else {
        const message = JSON.parse(event.data);
        // console.log('WebSocketメッセージ:', message);
        if (
          message.type === "executing" &&
          message.data.node === null &&
          message.data.prompt_id === prompt_id
        ) {
          resolve("Stop message received with matching prompt_id");
        }
      }
    };
    socket.onerror = (error) => {
      reject(`WebSocket error: ${error}`);
    };
    socket.onclose = () => {
      reject("WebSocket closed before receiving stop message");
    };
  });
}


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


var socket = null;
function Comfyui_connect() {
  try {
    socket = new WebSocket(comfyUIUrls.ws + '?clientId=' + uuid);
    socket.addEventListener("open", (event) => {
      console.log("ComfyUIへの接続に成功しました。");
    });
    socket.addEventListener("close", (event) => {
      socket = null;
    });
    socket.addEventListener("error", (event) => {
      socket = null;
    });
    return;
  } catch (error) {
    socket = null;
  }
}
