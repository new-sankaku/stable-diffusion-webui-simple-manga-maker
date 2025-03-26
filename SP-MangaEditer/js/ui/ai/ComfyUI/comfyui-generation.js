// const comfyUI = new ComfyUIManager();

// async function generateComfyImage() {
//     // Get values from UI
//     const steps = document.getElementById('comfyui-steps').value;
//     const cfg = document.getElementById('comfyui-cfg').value;
//     const sampler = document.getElementById('comfyui-sampler').value;
//     const model = document.getElementById('comfyui-model').value;

//     const workflow = {
//         "3": {
//             "inputs": {
//                 "seed": Math.floor(Math.random() * 1000000),
//                 "steps": parseInt(steps),
//                 "cfg": parseFloat(cfg),
//                 "sampler_name": sampler,
//                 "scheduler": "normal",
//                 "denoise": 1,
//                 "model": ["4", 0],
//                 "positive": ["6", 0],
//                 "negative": ["7", 0],
//                 "latent_image": ["8", 0]
//             },
//             "class_type": "KSampler"
//         },
//         "4": {
//             "inputs": {
//                 "ckpt_name": model
//             },
//             "class_type": "CheckpointLoaderSimple"
//         },
//         "6": {
//             "inputs": {
//                 "text": document.getElementById('positive-prompt').value,
//                 "clip": ["4", 1]
//             },
//             "class_type": "CLIPTextEncode"
//         },
//         "7": {
//             "inputs": {
//                 "text": document.getElementById('negative-prompt').value,
//                 "clip": ["4", 1]
//             },
//             "class_type": "CLIPTextEncode"
//         },
//         "8": {
//             "inputs": {
//                 "width": 1024,
//                 "height": 1024,
//                 "batch_size": 1
//             },
//             "class_type": "EmptyLatentImage"
//         }
//     };

//     try {
//         const result = await comfyUI.generateImage(workflow);
//         const imageUrl = URL.createObjectURL(result);
//         // Add image to your canvas or display area
//         displayGeneratedImage(imageUrl);
//     } catch (error) {
//         createToast("Generation Error", error.message);
//     }
// } 