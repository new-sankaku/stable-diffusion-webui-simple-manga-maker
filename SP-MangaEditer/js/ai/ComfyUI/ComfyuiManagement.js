let reader = new FileReader();
const comfyuiQueue = new TaskQueue(1);

var socket = null;
const uuid = crypto.randomUUID();
var selected_workflow = null;
var processing_prompt = false;

var hostInput = "";
var portInput = "";
var workflowFileLoad = "";

hostInput.value = comfyuiHost;
portInput.value = comfyuiPort;

document.addEventListener("DOMContentLoaded", function () {
  hostInput = $("Comfyui_apiHost");
  portInput = $("Comfyui_apiPort");
  workflowFileLoad = $("Workflow_path_load");
  hostInput.value = comfyuiHost;
  portInput.value = comfyuiPort;
});

function Comfyui_connect() {
  try {
    server_address = hostInput.value + ":" + portInput.value;
    socket = new WebSocket("ws://" + server_address + "/ws?clientId=" + uuid);
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

async function Comfyui_apiHeartbeat() {
  server_address = hostInput.value + ":" + portInput.value;
  const label = $("ExternalService_Heartbeat_Label");
  try {
    const url = "http://" + server_address + "/settings";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });

    if (response.ok) {
      label.innerHTML = "ComufyUI ON";
      label.style.color = "green";

      if (firstComfyConnection) {
        getDiffusionInfomation();
        firstComfyConnection = false;
      }
      return true;
    } else {
      label.innerHTML = "ComufyUI OFF";
      label.style.color = "red";
    }
  } catch (error) {
    label.innerHTML = "ComufyUI OFF";
    label.style.color = "red";
  }
  return false;
}

async function Comfyui_queue_prompt(prompt) {
  console.log("Comfyui_queue_prompt関数が呼び出されました。");
  try {
    p = { prompt: prompt, client_id: uuid };
    console.log("送信するプロンプトデータ:", p);
    const response = await fetch("http://" + server_address + "/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(p),
    });
    console.log("サーバーにプロンプトを送信しました。");
    var response_data = await response.json();
    console.log("サーバーからのレスポンス:", response_data);
    return response_data;
  } catch (error) {
    console.log("Text2Imageエラー:", error);
    createToastError("Text2Image Error.", "check COMFYUI!");
    return null;
  }
}

async function Comfyui_get_history(prompt_id) {
  console.log(
    "Comfyui_get_history関数が呼び出されました。プロンプトID:",
    prompt_id
  );
  try {
    const response = await fetch(
      "http://" + server_address + "/history/" + prompt_id,
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

async function Comfyui_get_image(image_data_to_recieve) {
  console.log(
    "Comfyui_get_image関数が呼び出されました。画像データ:",
    image_data_to_recieve
  );
  try {
    const params = new URLSearchParams({
      filename: image_data_to_recieve.filename,
      subfolder: image_data_to_recieve.subfolder,
      type: image_data_to_recieve.type,
    });

    console.log("リクエストパラメータ:", params.toString());

    const response = await fetch(
      "http://" + server_address + "/view?" + params.toString()
    );
    console.log("画像データをサーバーから取得しました。");

    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }

    const blob = await response.blob();
    var image_src = URL.createObjectURL(blob);
    console.log("画像ソース:", image_src);
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(image_src, (img) => {
        if (img) {
          console.log("fabric.Imageオブジェクトの作成に成功しました。");
          resolve(img);
        } else {
          console.log("fabric.Imageオブジェクトの作成に失敗しました。");
          reject(new Error("Failed to create a fabric.Image object"));
        }
      });
    });
  } catch (error) {
    console.error("画像取得エラー:", error);
    return null;
  }
}

async function Comfyui_track_prompt_progress(prompt_id) {
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

async function Comfyui_handle_process_queue(layer, spinnerId, isT2I = true) {
  console.log("Comfyui_handle_process_queue");
  if (!socket) Comfyui_connect();
  var requestData = baseRequestData(layer);
  if (text2img_basePrompt.text2img_model != "")
    requestData["model"] = text2img_basePrompt.text2img_model;

  if (isT2I) {
    selected_workflow = getComfyUI_T2I_BySDXL();
  } else {
    selected_workflow = getComfyUI_I2I_BySDXL();
  }

  var workflow = Comfyui_replace_placeholders(selected_workflow, requestData);
  if (!isT2I) {
    var uploadFilename = generateFilename();
    await Comfyui_uploadImage(layer, uploadFilename);
    console.log("uploadFilename START:", uploadFilename);
    workflow = Comfyui_replacePlaceholder(workflow, "%uploadImage%", uploadFilename);
  }

  comfyuiQueue.add(async () => Comfyui_generate_image(workflow))
    .then(async (result) => {
      if (result && result.error) {
        console.error("ComfyUI処理エラー:", result.message);
        createToastError("Generation Error", result.message);
        throw new Error(result.message);
      } else if (result) {
        var center = calculateCenter(layer);
        console.log("画像の配置位置:", center);
        putImageInFrame(result, center.centerX, center.centerY);
      } else {
        throw new Error(
          "Unexpected error: No result returned from Comfyui_generate_image"
        );
      }
    })
    .catch((error) => {
      createToastError(
        "Generation Error",
        error.message || "Check COMFYUI for details"
      );
      console.error("エラー:", error);
    })
    .finally(() => {
      console.log("スピナーを削除します。スピナーID:", spinnerId);
      removeSpinner(spinnerId);
    });
}

async function Comfyui_generate_image(workflow) {
  console.log("Comfyui_generate_image関数が呼び出されました。ワークフロー:",workflow);
  var response = await Comfyui_queue_prompt(workflow);
  if (!response) return null;
  processing_prompt = true;
  console.log("プロンプトがキューに追加されました。プロンプトID:",response.prompt_id);

  var prompt_id = response.prompt_id;

  await Comfyui_track_prompt_progress(prompt_id);

  response = await Comfyui_get_history(prompt_id);
  if (!response) return null;
  console.log("プロンプト履歴データ:", JSON.stringify(response));

  if (Comfyui_isError(response)) {
    const errorMessage = Comfyui_getErrorMessage(response);
    console.error("ComfyUI処理エラー:", errorMessage);
    return {
      error: true,
      message:
        errorMessage.exception_message || "ComfyUIで不明なエラーが発生しました",
      details: errorMessage,
    };
  } else {
    var image_data =
      response[prompt_id]["outputs"][
        Object.keys(response[prompt_id]["outputs"])[0]
      ].images["0"];
    console.log("画像データ:", image_data);

    var img = await Comfyui_get_image(image_data);

    return new Promise((resolve) => {
      resolve(img);
    });
  }
}

async function Comfyui_uploadImage(layer, fileName = "i2i_temp.png", overwrite = true) {
  const base64Image = imageObject2Base64ImageEffectKeep(layer);
  if (!base64Image || !base64Image.startsWith("data:image/")) {
    throw new Error("Invalid base64 image data");
  }

  const byteCharacters = atob(base64Image.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/octet-stream" });

  const formData = new FormData();
  formData.append("image", blob, fileName);
  formData.append("overwrite", overwrite.toString());

  try {
    const server_address = hostInput.value + ":" + portInput.value;
    const response = await fetch(`http://${server_address}/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}


async function Comfyui_FetchSampler() {
  try {
    const data = await Comfyui_FetchObjectInfo("KSampler");

    const models = data.KSampler.input.required.sampler_name[0].map((name) => ({
      name: name,
    }));
    updateSamplerDropdown(models);
  } catch (error) {
    console.error("Comfyui_FetchSampler: Fetch error", error);
  }
}

async function Comfyui_FetchUpscaler() {
  try {
    const data = await Comfyui_FetchObjectInfo("UpscaleModelLoader");
    const models = data.UpscaleModelLoader.input.required.model_name[0].map(
      (name) => ({ name: name })
    );
    updateUpscalerDropdown(models);
  } catch (error) {
    console.error("Comfyui_FetchUpscaler: Fetch error", error);
  }
}

async function Comfyui_FetchModels() {
  try {
    const data = await Comfyui_FetchObjectInfo("CheckpointLoaderSimple");
    console.log("Comfyui_FetchModels:", data);
    const models = data.CheckpointLoaderSimple.input.required.ckpt_name[0].map(
      (name) => ({ title: name, model_name: name })
    );
    updateModelDropdown(models);
  } catch (error) {
    console.error("Comfyui_FetchModels: Fetch error", error);
  }
}

async function Comfyui_FetchObjectInfo(nodeName) {
    const url = Comfyui_getUrl() + `object_info/` + nodeName;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Comfyui_FetchObjectInfo:", data);
      return data;
    } catch (error) {
      console.error("Comfyui_Fetch: Fetch error", nodeName);
    }
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