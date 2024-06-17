let reader = new FileReader();

var socket = null;
const uuid = crypto.randomUUID();
var selected_workflow = null;
var processing_prompt = false;


const hostInput = document.getElementById('Comfyui_apiHost');
const portInput = document.getElementById('Comfyui_apiPort');
const workflowFileLoad = document.getElementById('Workflow_path_load');

hostInput.value = comfyuiHost;
portInput.value = comfyuiPort;


/* 
* Loads a user workflow and stores it in json format in variable 'selected_workflow'
*/
workflowFileLoad.addEventListener('change', (event) =>  {
    try {
        var workflowPath = event.target.files[0].name;
        reader.readAsText(event.target.files[0], 'utf8');

        reader.addEventListener('loadend', async () => {
            data = reader.result;
            selected_workflow = JSON.parse(data);           
        })
    } catch (e) {
        if (e.code === 'ENOENT') {
            Console.log(`The file ${workflowPath} was not found.`);
        } else if (e.name === 'SyntaxError') {
            console.log(`The file ${workflowPath} contains invalid JSON.`);
        } else {
            console.log(`An unexpected error occurred: ${e.message}`);
        }
        return null;
    }
});

/* 
* Create a websocket connection to the desired comfyui server
*/
function connectToComfyui() {
    try {
        server_address = hostInput.value + ':' + portInput.value;

        socket = new WebSocket('ws://' + server_address + '/ws?clientId=' + uuid);
        socket.addEventListener("open", (event) => {
            // Test connection
            console.log("Connected to comfyui");
        })
    } catch (error) {
        createToast("Connection error.", "Couldn't connect to COMFYUI, check api settings");
    }
};
    
/*
* Sends the prompt using the selected workflow to the comfui server
* returns prompt_id
*/
async function Comfyui_queue_prompt(prompt) {
    try {
        p = {"prompt": prompt, "client_id": uuid};
        const response = await fetch("http://" + server_address + "/prompt", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(p)
        });
        var response_data = await response.json();
        return response_data;
    } catch (error) {
        createToast("Text2Image Error.", "check COMFYUI!");
        return null;
    }
}
/*
* In comfyuis servers history you will find the data of each queued prompt. 
* This function lets us grab the data, like the image data, of a given prompt
* returns finished prompts data
*/
async function Comfyui_get_history(prompt_id) {
    try {
        const response = await fetch("http://" + server_address + "/history/" + prompt_id, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        createToast("Text2Image Error.", "check COMFYUI!");
        return null;
    }
}


/*
* Takes comfyui image data object as a parameter and returns a fabric image object
*/
async function Comfyui_get_image(image_data_to_recieve) {
    try {
        const params = new URLSearchParams({
            filename: image_data_to_recieve.filename,
            subfolder: image_data_to_recieve.subfolder,
            type: image_data_to_recieve.type,
        });
        
        const response = await fetch('http://' + server_address + '/view?' + params.toString());

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();
        var image_src = URL.createObjectURL(blob);
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(image_src, (img) => {
                if (img) {
                    resolve(img);
                } else {
                    reject(new Error('Failed to create a fabric.Image object'));
                }
            });
        });
    } catch (error) {
        console.error('Error fetching image:', error);
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
            const message = JSON.parse(event.data);
            if (message.type === "executing" && message.data.node === null && message.data.prompt_id === prompt_id) {
                resolve("Stop message received with matching prompt_id");
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
async function Comfyui_generate_image(layer, spinnerId) {
    if (!socket) connectToComfyui();

    var requestData = baseRequestData(layer);
    if (text2img_basePrompt.text2img_model != "")
        requestData['model'] = text2img_basePrompt.text2img_model;
    var workflow = Comfyui_replace_placeholders(selected_workflow, requestData);

    // Once constructed the prompt we add it to the queue
    Comfyui_ProcessQueue(workflow, layer, spinnerId);    
}

let isComfyui_Processing = false;

/*
* Waits for already queued prompts before queueing a new one, waits for it to finish before retrieving the image and placing it in layer
*/
async function Comfyui_ProcessQueue(workflow, layer, spinnerId) {
    while(isComfyui_Processing) {
        await sleep(1000);
    }
    isComfyui_Processing = true;
    try {
        // Send prompt to comfyui
        var response = await Comfyui_queue_prompt(workflow);
        if (!response) return null;
        processing_prompt = true;

        var prompt_id = response.prompt_id;

        await Comfyui_track_prompt_progress(prompt_id);

        response = await Comfyui_get_history(prompt_id);
        if (!response) return null;
        // TODO this looks scuffed
        var image_data = response[prompt_id]['outputs'][Object.keys(response[prompt_id]['outputs'])[0]].images['0'];
        
        // place image
        var img = await Comfyui_get_image(image_data);
        var center = calculateCenter(layer);
        putImageInFrame(img, center.centerX, center.centerY);
    } catch (error) {
        createToast("Generation Error.", "check SD WebUI!");
        console.log("error:", error);
    } finally {
        // remove spinner
        var removeSpinner = document.getElementById(spinnerId);
        if (removeSpinner) {
            removeSpinner.remove();
        }
        isComfyui_Processing = false;
    }
}


/*
* If user has input t2i settings and added placeholder values to their workflow we then replace them here.
*/
function Comfyui_replace_placeholders(workflow, requestData) {
    if ("prompt" in requestData && requestData['prompt'] != "")
        workflow = replacePlaceholder(workflow, "%prompt%", requestData['prompt']);
    if ("negative_prompt" in requestData && requestData['negative_prompt'] != "")
        workflow = replacePlaceholder(workflow, "%negative_prompt%", requestData['negative_prompt']);
    if ("cfg_scale" in requestData && requestData['cfg_scale'] != "")
        workflow = replacePlaceholder(workflow, "%cfg%", requestData['cfg_scale']);
    if ("steps" in requestData && requestData['steps'] != "")
        workflow = replacePlaceholder(workflow, "%steps%", requestData['steps']);
    if ("sampler_name" in requestData && requestData['sampler_name'] != "")
        workflow = replacePlaceholder(workflow, "%sampler%", requestData['sampler_name']);
    if ("scheduler" in requestData && requestData['scheduler'] != "")
        workflow = replacePlaceholder(workflow, "%scheduler%", requestData['scheduler']);
    if ("model" in requestData && requestData['model'] != "")
        workflow = replacePlaceholder(workflow, "%model%", requestData['model']);
    if ("seed" in requestData && requestData['seed'] != "")
        workflow = replacePlaceholder(workflow, "%seed%", requestData['seed'], true);
    if ("vae" in requestData && requestData['vae'] != "")
        workflow = replacePlaceholder(workflow, "%vae%", requestData['vae']);
    if ("width" in requestData && requestData['width'] != "")
        workflow = replacePlaceholder(workflow, "%width%", requestData['width']);
    if ("height" in requestData && requestData['prompt'] != "")
        workflow = replacePlaceholder(workflow, "%height%", requestData['height']);
    return workflow;
}

/*
* Helper function to replace placeholder values with input prompt values
* Not gonna lie this was made by our best friend chatgpt
*/
function replacePlaceholder(workflow, placeholder, value) {
    function replaceInObject(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                // Randomize number if its -1, for seed
                if (value == -1) value = Math.floor(Math.random() * 50000000);
                obj[key] = obj[key].replace(placeholder, value);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                replaceInObject(obj[key]);
            }
        }
    }

    // Make a deep copy of the workflow to avoid modifying the original object
    const newWorkflow = JSON.parse(JSON.stringify(workflow));
    
    // Replace placeholders in the copied workflow
    replaceInObject(newWorkflow);
    
    return newWorkflow;
}