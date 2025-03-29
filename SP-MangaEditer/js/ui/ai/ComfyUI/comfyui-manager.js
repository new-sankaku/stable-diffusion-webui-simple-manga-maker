// class ComfyUIManager {
//     constructor() {
//         this.serverUrl = document.getElementById('comfyui-server').value; // Default: http://127.0.0.1:8188
//         this.clientId = Math.random().toString(36).substring(7);
//     }

//     async generateImage(workflow) {
//         try {
//             const response = await fetch(`${this.serverUrl}/prompt`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     prompt: workflow,
//                     client_id: this.clientId
//                 })
//             });
            
//             if (!response.ok) throw new Error('Generation failed');
            
//             const data = await response.json();
//             return this.waitForResult(data.prompt_id);
//         } catch (error) {
//             console.error('ComfyUI generation error:', error);
//             throw error;
//         }
//     }

//     async waitForResult(promptId) {
//         return new Promise((resolve, reject) => {
//             const ws = new WebSocket(`${this.serverUrl.replace('http', 'ws')}/ws`);
            
//             ws.onmessage = (event) => {
//                 const data = JSON.parse(event.data);
//                 if (data.type === 'executed' && data.data.prompt_id === promptId) {
//                     ws.close();
//                     this.getResult(data.data.output).then(resolve);
//                 }
//             };
            
//             ws.onerror = reject;
//         });
//     }

//     async getResult(output) {
//         const response = await fetch(`${this.serverUrl}/view`);
//         return await response.blob();
//     }
// } 