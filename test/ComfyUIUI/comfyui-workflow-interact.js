class ComfyUIWorkflowWindow {
  constructor() {
    this.element = null;
    this.x = 0;
    this.y = 0;
  }

  initializeWindow() {
    if (this.element) return;

    this.element = document.createElement("div");
    this.element.style.position = "fixed";
    this.element.style.top = "50%";
    this.element.style.left = "50%";
    this.element.style.transform = "translate(-50%, -50%)";
    this.element.style.backgroundColor = "white";
    this.element.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    this.element.style.display = "none";
    this.element.style.width = "90vw";
    this.element.style.height = "90vh";
    this.element.style.zIndex = "1000";

    this.element.innerHTML = `
    <button id="closeButton" style="position: absolute; right: -30px; top: 0; padding: 5px 10px; background: #fff; border: 1px solid #ccc; cursor: pointer; z-index: 1001; font-size: 16px; border-radius: 4px;">✕</button>
    <div class="comfui-container" style="width: 100%; height: 100%; background-color: white; margin: 0; padding: 8px; border-radius: 0;">
     <div class="comfui-sidebar">
      <div class="comfui-sidebar-header" style="cursor: move;">
       <label class="comfui-file-input-button">
        + Add Workflow
        <input type="file" id="workflowFile" accept=".json,.txt" multiple>
       </label>
      </div>
      <div class="comfui-tab-list" id="tabList"></div>
     </div>
 
     <div class="comfui-main-content">
      <div class="comfui-tab-content-container" id="tabContentContainer"></div>
     </div>
 
     <div class="comfui-right-sidebar">
      <div id="apiSettingsUrlHelpe">
       <label id="ExternalService_Heartbeat_Label">Connection:</label>
      </div>
 
      <div class="comfui-sidebar-input">
       <label class="comfui-input-label">ComfyUI URL</label>
       <input id="comfyUIPageUrl" type="text" class="comfui-input-value" placeholder="テキストを入力" value="http://127.0.0.1:8188">
      </div>
 
      <div class="comfui-sidebar-input">
       <label class="comfui-input-label">generate(1-9999)</label>
       <input id="batchCount" type="number" class="comfui-input-value" min="0" max="9999" value="1">
      </div>
 
      <button id="generateButton" class="comfui-sidebar-button">generate</button>
 
      <div id="generatedImageContainer" class="comfui-generated-image-container">
       <img id="generatedImage" class="comfui-preview-image hidden">
      </div>
     </div>
    </div>`;

    document.body.appendChild(this.element);

    const closeButton = this.element.querySelector("#closeButton");
    closeButton.addEventListener("click", () => this.hide());

    this.setupEventListeners();
  }

  setupEventListeners() {
    interact(this.element)
      .draggable({
        ignoreFrom: 'textarea, input[type="text"]',
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
        listeners: {
          start: () => {
            const rect = this.element.getBoundingClientRect();
            this.x = rect.left;
            this.y = rect.top;
          },
          move: (event) => {
            this.x += event.dx;
            this.y += event.dy;

            this.element.style.transform = `translate(0, 0)`;
            this.element.style.top = `${this.y}px`;
            this.element.style.left = `${this.x}px`;
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        restrictEdges: {
          outer: "parent",
          endOnly: true,
        },
        restrictSize: {
          min: { width: 400, height: 300 },
        },
        inertia: true,
      })
      .on("resizemove", (event) => {
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
        });
      });

    const generateButton = this.element.querySelector("#generateButton");
    generateButton.addEventListener("click", async () => {
      const tabId = comfyUIWorkflowEditor.activeTabId;
      if (!tabId) return;

      const tab = comfyUIWorkflowEditor.tabs.get(tabId);
      if (!tab) return;

      const img = await Comfyui_put_queue(tab.workflow);
      if (!img) return;

      const generatedImage = this.element.querySelector("#generatedImage");
      generatedImage.src = img;
      generatedImage.classList.remove("hidden");
    });
  }

  show() {
    if (!this.element) {
      this.initializeWindow();
    }
    this.element.style.display = "block";
  }

  hide() {
    if (this.element) {
      this.element.style.display = "none";
    }
  }
}
let comfyUIWorkflowWindow = null;

document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("openWorkflowButton");
  openButton.addEventListener("click", () => {
    if (!comfyUIWorkflowWindow) {
      comfyUIWorkflowWindow = new ComfyUIWorkflowWindow();
    }
    comfyUIWorkflowWindow.show();

    comfyUIWorkflowEditor = new ComfyUIWorkflowEditor();
    comfyUIWorkflowEditor.initialize();
    monitorComfyUIConnection();
  });
});
