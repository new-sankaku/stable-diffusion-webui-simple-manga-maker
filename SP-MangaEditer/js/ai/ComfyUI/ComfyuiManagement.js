let reader = new FileReader();
const comfyuiQueue = new TaskQueue(1);

var socket = null;
const uuid = crypto.randomUUID();
var selected_workflow = null;
var processing_prompt = false;

var hostInput = '';
var portInput = '';
var workflowFileLoad = '';

hostInput.value = comfyuiHost;
portInput.value = comfyuiPort;

document.addEventListener('DOMContentLoaded', function() {
    hostInput = $('Comfyui_apiHost');
    portInput = $('Comfyui_apiPort');
    workflowFileLoad = $('Workflow_path_load');
    
    hostInput.value = comfyuiHost;
    portInput.value = comfyuiPort;

});


/* 
* Loads a user workflow and stores it in json format in variable 'selected_workflow'
*/
// document.addEventListener('DOMContentLoaded', function() {
//     workflowFileLoad.addEventListener('change', (event) => {
//         //console.log('ワークフローファイルの選択が変更されました。');
//         // File Cancel.
//         if (event.target.files.length === 0) {
//             //console.log('ファイル選択がキャンセルされました。');
//             return;
//         }

//         try {
//             var workflowPath = event.target.files[0].name;
//             //console.log('選択されたファイル:', workflowPath);
//             reader.readAsText(event.target.files[0], 'utf8');

//             reader.addEventListener('loadend', async () => {
//                 try {
//                     const data = reader.result;
//                     //console.log('ファイルの内容が読み込まれました。データ:', data);
//                     selected_workflow = JSON.parse(data);
//                     //console.log('ワークフローが正常に読み込まれました:', selected_workflow);
//                     createToast("Workflow loaded successfully.", workflowPath);
//                 } catch (e) {
//                     if (e.name === 'SyntaxError') {
//                         //console.log(`ファイル ${workflowPath} は無効なJSONです。`);
//                         createToastError("Workflow Error.", "The file " + workflowPath + " contains invalid JSON.");
//                     } else {
//                         //console.log(`予期しないエラーが発生しました: ${e.message}`);
//                         createToastError("Workflow Error.", "An unexpected error occurred: " + e.message);
//                     }
//                 }
//             }, { once: true });

//         } catch (e) {
//             if (e.code === 'ENOENT') {
//                 //console.log(`ファイル ${workflowPath} が見つかりません。`);
//             } else {
//                 //console.log(`予期しないエラーが発生しました: ${e.message}`);
//             }
//         }
//     });
// });


function displayFileName() {
    console.log('displayFileName関数が呼び出されました。');
    var input = $('Workflow_path_load');
    var fileName = input.files.length > 0 ? input.files[0].name : 'No file chosen';
    console.log('表示されるファイル名:', fileName);
    $('file-name').textContent = fileName;
}

/* 
* Create a websocket connection to the desired comfyui server
*/
function connectToComfyui() {
    try {
        server_address = hostInput.value + ':' + portInput.value;
        socket = new WebSocket('ws://' + server_address + '/ws?clientId=' + uuid);
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


/* 
* Accesses the specified URL and logs the response
*/
async function comufy_apiHeartbeat() {

    server_address = hostInput.value + ':' + portInput.value;
    // console.log( "comufy_apiHeartbeat", "start" );
    const label = $('ExternalService_Heartbeat_Label');
    try {
        const url = "http://" + server_address +  "/settings";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });

        if( response.ok ){
        //   console.log("apiHeartbeat", "comufy_isAlive");
          label.innerHTML = 'ComufyUI ON';
          label.style.color = 'green';
          
          if(firstComfyConnection){
            getDiffusionInfomation();
            firstComfyConnection = false;
          }
          return true;
        }else{
        //   console.log("apiHeartbeat", "comufy_notAlive");
          label.innerHTML = 'ComufyUI OFF';
          label.style.color = 'red';
        }
    } catch (error) {
        // console.log("apiHeartbeat", error);
        // console.log("apiHeartbeat", "error comufy_notAlive");
        label.innerHTML = 'ComufyUI OFF';
        label.style.color = 'red';
  }
  return false;
}

/*
* Sends the prompt using the selected workflow to the comfui server
* returns prompt_id
*/
async function Comfyui_queue_prompt(prompt) {
    console.log('Comfyui_queue_prompt関数が呼び出されました。');
    try {
        p = { "prompt": prompt, "client_id": uuid };
        console.log('送信するプロンプトデータ:', p);
        const response = await fetch("http://" + server_address + "/prompt", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(p)
        });
        console.log('サーバーにプロンプトを送信しました。');
        var response_data = await response.json();
        console.log('サーバーからのレスポンス:', response_data);
        return response_data;
    } catch (error) {
        console.log("Text2Imageエラー:", error);
        createToastError("Text2Image Error.", "check COMFYUI!");
        return null;
    }
}
/*
* In comfyuis servers history you will find the data of each queued prompt. 
* This function lets us grab the data, like the image data, of a given prompt
* returns finished prompts data
*/
async function Comfyui_get_history(prompt_id) {
    console.log('Comfyui_get_history関数が呼び出されました。プロンプトID:', prompt_id);
    try {
        const response = await fetch("http://" + server_address + "/history/" + prompt_id, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            },
        });
        console.log('サーバーに履歴データをリクエストしました。');
        const data = await response.json();
        console.log('履歴データ:', data);
        return data;
    } catch (error) {
        console.log("Text2Imageエラー:", error);
        createToastError("Text2Image Error.", "check COMFYUI!");
        return null;
    }
}


/*
* Takes comfyui image data object as a parameter and returns a fabric image object
*/
async function Comfyui_get_image(image_data_to_recieve) {
    console.log('Comfyui_get_image関数が呼び出されました。画像データ:', image_data_to_recieve);
    try {
        const params = new URLSearchParams({
            filename: image_data_to_recieve.filename,
            subfolder: image_data_to_recieve.subfolder,
            type: image_data_to_recieve.type,
        });

        console.log('リクエストパラメータ:', params.toString());

        const response = await fetch('http://' + server_address + '/view?' + params.toString());
        console.log('画像データをサーバーから取得しました。');

        if (!response.ok) {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }

        const blob = await response.blob();
        var image_src = URL.createObjectURL(blob);
        console.log('画像ソース:', image_src);
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(image_src, (img) => {
                if (img) {
                    console.log('fabric.Imageオブジェクトの作成に成功しました。');
                    resolve(img);
                } else {
                    console.log('fabric.Imageオブジェクトの作成に失敗しました。');
                    reject(new Error('Failed to create a fabric.Image object'));
                }
            });
        });
    } catch (error) {
        console.error('画像取得エラー:', error);
        return null;
    }
}


/*
* Allows to track the progress of a specific prompt_id and also serves as a st
*/
// TODO more accuractly track and display progress being made
// console log message.data to get an idea of how this can be done by looking at progress messages and node states
async function Comfyui_track_prompt_progress(prompt_id) {
    return new Promise((resolve, reject) => {
        socket.onmessage = (event) => {
            if (event.data instanceof Blob) {
                //akip
            }else{
                const message = JSON.parse(event.data);
                // console.log('WebSocketメッセージ:', message);
                if (message.type === "executing" && message.data.node === null && message.data.prompt_id === prompt_id) {
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

/*
* Starts generating the proper prompt from the workflow and sends it to the queue
*/
async function comfyui_handle_process_queue(layer, spinnerId, isT2I=true) {
    console.log('comfyui_handle_process_queue');
    if (!socket) connectToComfyui();
    var requestData = baseRequestData(layer);
    if (text2img_basePrompt.text2img_model != "")
        requestData['model'] = text2img_basePrompt.text2img_model;

    if( isT2I ){
        selected_workflow = getComfyUI_T2I_BySDXL();
    }else{
        uploadComfyUIImage(layer);
        selected_workflow = getComfyUI_I2I_BySDXL();
    }
    console.log('comfyui_handle_process_queue selected_workflow:', selected_workflow);

    var workflow = Comfyui_replace_placeholders(selected_workflow, requestData);
    console.log('プレースホルダーが置換されたワークフロー:', workflow);

    comfyuiQueue.add(async () => Comfyui_generate_image(workflow))
        .then(async (result) => {
            if (result && result.error) {
                console.error('ComfyUI処理エラー:', result.message);
                createToastError("Generation Error", result.message);
                throw new Error(result.message);
            } else if (result) {
                var center = calculateCenter(layer);
                console.log('画像の配置位置:', center);
                putImageInFrame(result, center.centerX, center.centerY);
            } else {
                throw new Error("Unexpected error: No result returned from Comfyui_generate_image");
            }
        })
        .catch(error => {
            createToastError("Generation Error", error.message || "Check COMFYUI for details");
            console.error("エラー:", error);
        })
        .finally(() => {
            console.log('スピナーを削除します。スピナーID:', spinnerId);
            removeSpinner(spinnerId);
        });
}



/*
* Waits for already queued prompts before queueing a new one, waits for it to finish before retrieving the image and placing it in layer
*/
async function Comfyui_generate_image(workflow) {
    console.log('Comfyui_generate_image関数が呼び出されました。ワークフロー:', workflow);
    var response = await Comfyui_queue_prompt(workflow);
    if (!response) return null;
    processing_prompt = true;
    console.log('プロンプトがキューに追加されました。プロンプトID:', response.prompt_id);

    var prompt_id = response.prompt_id;

    await Comfyui_track_prompt_progress(prompt_id);

    response = await Comfyui_get_history(prompt_id);
    if (!response) return null;
    console.log('プロンプト履歴データ:', JSON.stringify(response));

    if( isErrorByComfyUi(response) ){
        const errorMessage = getErrorMessageByComfyUi(response);
        console.error('ComfyUI処理エラー:', errorMessage);
        return {
            error: true,
            message: errorMessage.exception_message || 'ComfyUIで不明なエラーが発生しました',
            details: errorMessage
        };
    }else{
        var image_data = response[prompt_id]['outputs'][Object.keys(response[prompt_id]['outputs'])[0]].images['0'];
        console.log('画像データ:', image_data);
    
        var img = await Comfyui_get_image(image_data);
    
        return new Promise((resolve) => {
            resolve(img);
        });
    }
}

async function uploadComfyUIImage(layer, fileName = "i2i_temp.png", overwrite = true) {
    const base64Image = imageObject2Base64ImageEffectKeep(layer);

    // Base64データの検証
    if (!base64Image || !base64Image.startsWith('data:image/')) {
        throw new Error('Invalid base64 image data');
    }

    // Base64データからBlobを作成
    const byteCharacters = atob(base64Image.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/octet-stream'});

    // FormDataオブジェクトを作成
    const formData = new FormData();
    formData.append('image', blob, fileName);
    formData.append('overwrite', overwrite.toString());

    try {
        const server_address = hostInput.value + ':' + portInput.value;
        const response = await fetch(`http://${server_address}/upload/image`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Upload successful:', result);
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}


/*
* If user has input t2i settings and added placeholder values to their workflow we then replace them here.
*/
function Comfyui_replace_placeholders(workflow, requestData) {
    //console.log('Comfyui_replace_placeholders関数が呼び出されました。');
    if ("prompt" in requestData && requestData['prompt'] != "")
        workflow = replacePlaceholder(workflow, "%prompt%", requestData['prompt']);
    if ("negative_prompt" in requestData && requestData['negative_prompt'] != "")
        workflow = replacePlaceholder(workflow, "%negative_prompt%", requestData['negative_prompt']);
    if ("cfg_scale" in requestData && requestData['cfg_scale'] != "")
        workflow = replacePlaceholder(workflow, "%cfg%", requestData['cfg_scale']);
    if ("steps" in requestData && requestData['steps'] != "")
        workflow = replacePlaceholder(workflow, "%steps%", requestData['steps']);
    if ("scheduler" in requestData && requestData['scheduler'] != "")
        workflow = replacePlaceholder(workflow, "%scheduler%", requestData['scheduler']);
    if ("seed" in requestData && requestData['seed'] != "")
        workflow = replacePlaceholder(workflow, "%seed%", requestData['seed'], true);
    if ("vae" in requestData && requestData['vae'] != "")
        workflow = replacePlaceholder(workflow, "%vae%", requestData['vae']);
    if ("width" in requestData && requestData['width'] != "")
        workflow = replacePlaceholder(workflow, "%width%", requestData['width']);
    if ("height" in requestData && requestData['height'] != "")
        workflow = replacePlaceholder(workflow, "%height%", requestData['height']);

    workflow = replacePlaceholder(workflow, "%sampler%", $('text2img_basePrompt_samplingMethod').value);
    workflow = replacePlaceholder(workflow, "%model%",   $('text2img_basePrompt_model').value);

    console.log("置き換え Model   ", $('text2img_basePrompt_model').value);
    console.log("置き換え Sampler ", $('text2img_basePrompt_samplingMethod').value);

    return workflow;
}

/*
* Helper function to replace placeholder values with input prompt values
* Not gonna lie this was made by our best friend chatgpt
*/
function replacePlaceholder(workflow, placeholder, value) {
    //console.log('replacePlaceholder関数が呼び出されました。');
    function replaceInObject(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                // Randomize number if its -1, for seed
                if (value == -1) value = Math.floor(Math.random() * 50000000);
                obj[key] = obj[key].replace(placeholder, value);
                //console.log(`置換されたプレースホルダー: ${placeholder}, 新しい値: ${value}`);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                replaceInObject(obj[key]);
            }
        }
    }

    // Make a deep copy of the workflow to avoid modifying the original object
    const newWorkflow = JSON.parse(JSON.stringify(workflow));

    // Replace placeholders in the copied workflow
    replaceInObject(newWorkflow);

    //console.log('プレースホルダーが置換された新しいワークフロー:', newWorkflow);
    return newWorkflow;
}






async function comufySampler() {
    //console.log("comufySampler: Function called");
    const server_address = hostInput.value + ':' + portInput.value;
    const url = `http://${server_address}/object_info/KSampler`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("comufySampler: Data fetched", data);
        const models = data.KSampler.input.required.sampler_name[0].map(name => ({ name: name }));
        console.log("comufySampler: Models processed", models);
        updateSamplerDropdown(models);
    } catch (error) {
        console.error("comufySampler: Fetch error", error);
    }
}

async function comufyUpscaler() {
    //console.log("comufyUpscaler: Function called");
    const server_address = hostInput.value + ':' + portInput.value;
    const url = `http://${server_address}/object_info/UpscaleModelLoader`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("comufyUpscaler: Data fetched", data);
        const models = data.UpscaleModelLoader.input.required.model_name[0].map(name => ({ name: name }));
        //console.log("comufyUpscaler: Models processed", models);
        updateUpscalerDropdown(models);
    } catch (error) {
        console.error("comufyUpscaler: Fetch error", error);
    }
}

async function comufyModels() {
    //console.log("comufyModels: Function called");
    const server_address = hostInput.value + ':' + portInput.value;
    const url = `http://${server_address}/object_info/CheckpointLoaderSimple`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("comufyModels: Data fetched", data);
        const models = data.CheckpointLoaderSimple.input.required.ckpt_name[0].map(name => ({ title: name, model_name: name }));
        //console.log("comufyModels: Models processed", models);
        updateModelDropdown(models);
    } catch (error) {
        console.error("comufyModels: Fetch error", error);
    }
}