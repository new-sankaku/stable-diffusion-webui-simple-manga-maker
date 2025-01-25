class ComfyUIWorkflowTab {
  constructor(file, workflow, editor) {
    this.file = file;
    this.workflow = workflow;
    this.editor = editor;
    this.id = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.contentElement = null;
    this.hiddenNodeTypes = ["Note", undefined];
    this.isActive = false;
    this.masonry = null;
    this.resizeObserver = null;
    this.buttonElement = null;
  }

  createTabButton() {
    const button = document.createElement("div");
    button.className = "tab-button";
    button.dataset.tabId = this.id;

    const enabled = this.workflow.enabled || false;
    const currentType = this.workflow.type || "T2I";
    button.innerHTML = `
      <label class="custom-radio">
        <input type="radio" name="enabled-${currentType}" class="tab-enabled-radio" ${
      enabled ? "checked" : ""
    }>
        <span class="custom-radio-label"></span>
      </label>
      <select class="tab-type-dropdown" title="Type">
        ${["T2I", "I2I", "Upscaler"]
          .map(
            (option) => `
          <option value="${option}" ${
              option === currentType ? "selected" : ""
            }>${option}</option>
        `
          )
          .join("")}
      </select>
      <span class="tab-name" title="${this.file.name}">${this.file.name}</span>
      <div class="tab-actions">
        <span class="tab-save" title="Save">⇔</span>
        <span class="tab-download" title="Download">↓</span>
        <span class="tab-close" title="Close">×</span>
      </div>
    `;

    button
      .querySelector(".tab-enabled-radio")
      .addEventListener("change", () => {
        this.editor.onTabEnabledChanged(this.workflow.type, this.id);
      });

    button
      .querySelector(".tab-type-dropdown")
      .addEventListener("change", (e) => {
        this.workflow.type = e.target.value;
        this.editor.tabs.set(this.id, this);
        this.editor.renderTabs();
      });

    button.querySelector(".tab-save").addEventListener("click", () => {
      this.saveWorkflow();
    });

    this.buttonElement = button;
    return button;
  }

  saveWorkflow() {
    workflowRepository
      .saveWorkflow(
        this.workflow.type || "T2I",
        this.workflow.id,
        this.file.name,
        this.workflow,
        this.workflow.enabled
      )
      .then(() => {
        console.log("Workflow saved successfully");
      })
      .catch((error) => {
        console.error("Workflowの保存に失敗しました:", error);
      });
  }

  createContent() {
    const content = document.createElement("div");
    content.className = "tab-content";
    content.dataset.tabId = this.id;
    content.innerHTML = `<div class="node-list" data-tab-id="${this.id}"></div>`;
    this.contentElement = content;
    return content;
  }

  activate() {
    this.isActive = true;
    this.buttonElement?.classList.add("active");
    this.contentElement?.classList.add("active");
    this.initMasonry();
  }

  deactivate() {
    this.isActive = false;
    this.buttonElement?.classList.remove("active");
    this.contentElement?.classList.remove("active");
    if (this.masonry) {
      this.masonry.destroy();
      this.masonry = null;
    }
  }

  destroy() {
    this.buttonElement?.remove();
    this.contentElement?.remove();
    if (this.masonry) {
      this.masonry.destroy();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  getInputValue(nodeId, inputName) {
    if (!this.workflow[nodeId]) return "";
    const inputValue = this.workflow[nodeId].inputs[inputName];
    if (inputValue !== undefined && !Array.isArray(inputValue)) {
      return inputValue;
    }
    return "";
  }

  getDisplayableInputCount(nodeId, apiNode) {
    if (!apiNode?.input?.required) return 0;

    return Object.entries(apiNode.input.required).filter(
      ([inputName, inputDef]) => {
        if (inputDef[0] === "MODEL") return false;
        const inputValue = this.workflow[nodeId]?.inputs[inputName];
        return !Array.isArray(inputValue);
      }
    ).length;
  }

  createInput(nodeId, inputName, inputDef, apiNode) {
    if (inputDef[0] === "MODEL") return "";

    const inputValue = this.workflow[nodeId]?.inputs[inputName];
    if (Array.isArray(inputValue)) return "";

    const id = `${this.id}-node-${nodeId}-input-${inputName}`;
    const value = this.getInputValue(nodeId, inputName);
    const config = inputDef[1] || {};

    if (config.image_upload === true) {
      return `<div class="input-container">
      <label class="input-label" for="${id}">${inputName}</label>
      <select id="${id}" data-node-id="${nodeId}" data-input-name="${inputName}">
        ${inputDef[0]
          .map(
            (option) =>
              `<option value="${option}" ${
                value === option ? "selected" : ""
              }>${option}</option>`
          )
          .join("")}
      </select>
      <div class="image-upload-area">
        <label class="upload-button" for="file-${id}">
          + Add Image
          <input type="file" 
            id="file-${id}"
            accept="image/*"
            data-node-id="${nodeId}"
            data-input-name="${inputName}"
            data-preview-target="${nodeId}-${inputName}-preview">
        </label>
        <div class="image-preview hidden" data-preview-id="${nodeId}-${inputName}-preview">
          <img src="" alt="プレビュー" class="preview-image">
        </div>
      </div>
    </div>`;
    }

    if (Array.isArray(inputDef[0])) {
      return `<div class="input-container">
      <label class="input-label" for="${id}">${inputName}</label>
      <select id="${id}" data-node-id="${nodeId}" data-input-name="${inputName}">
        ${inputDef[0]
          .map(
            (option) =>
              `<option value="${option}" ${
                value === option ? "selected" : ""
              }>${option}</option>`
          )
          .join("")}
      </select>
    </div>`;
    }

    const isMultiline = config.multiline === true;
    const type =
      inputDef[0] === "INT" || inputDef[0] === "FLOAT" ? "number" : "text";

    if (isMultiline) {
      return `<div class="input-container">
      <label class="input-label" for="${id}">${inputName}</label>
      <textarea id="${id}"
        data-node-id="${nodeId}"
        data-input-name="${inputName}"
        rows="4"
        oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"
        style="resize: none; overflow: hidden;">${value}</textarea>
    </div>`;
    }

    return `<div class="input-container">
    <label class="input-label" for="${id}">${inputName}</label>
    <input type="${type}" id="${id}" value="${value}"
      ${config.min !== undefined ? `min="${config.min}"` : ""}
      ${config.max !== undefined ? `max="${config.max}"` : ""}
      ${config.step !== undefined ? `step="${config.step}"` : ""}
      data-node-id="${nodeId}"
      data-input-name="${inputName}">
   </div>`;
  }

  initMasonry() {
    const grid = this.contentElement?.querySelector(".node-list");
    if (!grid) return;

    setTimeout(() => {
      this.masonry = new Masonry(grid, {
        itemSelector: ".node-wrapper",
        columnWidth: ".node-wrapper",
        gutter: 16,
        fitWidth: true,
        transitionDuration: 0,
      });

      let resizeTimeout;
      window.addEventListener("resize", () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
          if (this.isActive && this.masonry) {
            this.masonry.layout();
          }
        }, 5);
      });
    }, 5);
  }

  async initializeImagePreviews() {
    const selects = this.contentElement.querySelectorAll(
      "select[data-input-name]"
    );
    for (const select of selects) {
      const nodeId = select.dataset.nodeId;
      const inputName = select.dataset.inputName;
      const selectedValue = select.value;

      if (selectedValue) {
        const previewTargetId = `${nodeId}-${inputName}-preview`;
        const previewContainer = this.contentElement.querySelector(
          `[data-preview-id="${previewTargetId}"]`
        );

        if (previewContainer) {
          const previewImage = previewContainer.querySelector("img");
          if (previewImage) {
            try {
              const imageUrl = await comfyui_get_image(selectedValue);
              if (imageUrl) {
                previewImage.src = imageUrl;
                previewContainer.classList.remove("hidden");

                previewImage.onload = () => {
                  if (this.masonry) {
                    this.masonry.layout();
                  }
                  URL.revokeObjectURL(imageUrl);
                };
              }
            } catch (error) {
              console.error("画像プレビューの読み込みエラー:", error);
            }
          }
        }
      }
    }
  }

  async renderNodes() {
    const container = this.contentElement.querySelector(".node-list");
    container.innerHTML = "";

    const nodes = Object.entries(this.workflow)
      .filter(([_, node]) => !this.hiddenNodeTypes.includes(node.class_type))
      .map(([id, node]) => {
        const apiNode = this.editor.getNodeType(node.class_type);
        const inputCount = apiNode
          ? this.getDisplayableInputCount(id, apiNode)
          : 0;

        return {
          id,
          node,
          apiNode,
          inputCount,
        };
      })
      .sort((a, b) => b.inputCount - a.inputCount);

    nodes.forEach(({ id, node, apiNode }) => {
      const nodeElement = document.createElement("div");
      nodeElement.className = "node-wrapper";

      const nodeTitle = node._meta?.title || node.class_type;
      const nodeTypeDisplay = `<div class="node-title">${id}: ${nodeTitle}</div>`;

      let inputsDisplay = "";
      if (apiNode?.input?.required) {
        inputsDisplay = Object.entries(apiNode.input.required)
          .map(([inputName, inputDef]) => {
            return this.createInput(id, inputName, inputDef, apiNode);
          })
          .filter((input) => input !== "")
          .join("");
      }

      nodeElement.innerHTML = nodeTypeDisplay + inputsDisplay;
      container.appendChild(nodeElement);
    });

    if (this.masonry) {
      this.masonry.reloadItems();
      this.masonry.layout();
    } else {
      this.initMasonry();
    }

    this.setupInputListeners();
    await this.initializeImagePreviews();
  }

  setupInputListeners() {
    this.contentElement
      .querySelectorAll(
        'input[type="text"], input[type="number"], select, textarea'
      )
      .forEach((input) => {
        const nodeId = input.dataset.nodeId;
        const inputName = input.dataset.inputName;

        // 初期化時に値を強制的に更新
        if (nodeId && inputName && this.workflow[nodeId]) {
          this.workflow[nodeId].inputs[inputName] = input.value;
        }

        input.addEventListener("change", async (e) => {
          const nodeId = e.target.dataset.nodeId;
          const inputName = e.target.dataset.inputName;
          if (this.workflow[nodeId] && inputName) {
            this.workflow[nodeId].inputs[inputName] = e.target.value;

            if (e.target.tagName.toLowerCase() === "select") {
              const selectedValue = e.target.value;
              const previewTargetId = `${nodeId}-${inputName}-preview`;
              const previewContainer = this.contentElement.querySelector(
                `[data-preview-id="${previewTargetId}"]`
              );

              if (previewContainer) {
                const previewImage = previewContainer.querySelector("img");
                if (previewImage) {
                  const imageUrl = await comfyui_get_image(selectedValue);
                  if (imageUrl) {
                    previewImage.src = imageUrl;
                    previewContainer.classList.remove("hidden");

                    previewImage.onload = () => {
                      if (this.masonry) {
                        this.masonry.layout();
                      }
                      URL.revokeObjectURL(imageUrl);
                    };
                  }
                }
              }
            }
          }
        });

        if (input.tagName.toLowerCase() === "textarea") {
          let timeoutId;
          input.addEventListener("input", () => {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
              if (this.masonry && this.isActive) {
                this.masonry.layout();
              }
            }, 5);

            // テキストエリアの値も即時反映
            const nodeId = input.dataset.nodeId;
            const inputName = input.dataset.inputName;
            if (nodeId && inputName && this.workflow[nodeId]) {
              this.workflow[nodeId].inputs[inputName] = input.value;
            }
          });

          if (this.resizeObserver) {
            this.resizeObserver.disconnect();
          }

          this.resizeObserver = new ResizeObserver(() => {
            if (this.masonry) {
              window.dispatchEvent(new Event("resize"));
              this.masonry.layout();
            }
          });

          this.resizeObserver.observe(input);
        }
      });

    this.contentElement
      .querySelectorAll('input[type="file"]')
      .forEach((input) => {
        input.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const nodeId = e.target.dataset.nodeId;
          const inputName = e.target.dataset.inputName;
          const previewTargetId = e.target.dataset.previewTarget;

          if (this.workflow[nodeId] && inputName) {
            try {
              const uploadResult = await comfyui_uploadImage(file);
              if (uploadResult.success) {
                this.workflow[nodeId].inputs[inputName] = uploadResult.name;

                const select = this.contentElement.querySelector(
                  `select[data-node-id="${nodeId}"][data-input-name="${inputName}"]`
                );
                if (select) {
                  const exists = Array.from(select.options).some(
                    (option) => option.value === uploadResult.name
                  );
                  if (!exists) {
                    const option = new Option(
                      uploadResult.name,
                      uploadResult.name,
                      true,
                      true
                    );
                    select.add(option);
                  }
                  select.value = uploadResult.name;
                }
              }
            } catch (error) {
              console.error("アップロードエラー:", error);
            }

            const reader = new FileReader();
            const previewContainer = this.contentElement.querySelector(
              `[data-preview-id="${previewTargetId}"]`
            );
            const previewImage = previewContainer?.querySelector("img");

            if (!previewContainer || !previewImage) return;

            reader.onload = (e) => {
              previewImage.src = e.target.result;
              previewContainer.classList.remove("hidden");
              previewImage.onload = () => {
                if (this.masonry) {
                  this.masonry.layout();
                }
              };
            };

            reader.readAsDataURL(file);
          }
        });
      });
  }

  downloadWorkflow() {
    const jsonStr = JSON.stringify(this.workflow, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.file.name.replace(/\.[^/.]+$/, "")}_edited.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
