class ComfyUIWorkflowEditor {
  constructor() {
    this.tabs = new Map();
    this.nodeTypes = null;
    this.activeTabId = null;
  }

  async updateObjectInfoAndWorkflows() {
    try {
      const response = await fetch(comfyUIUrls.objectInfoOnly);
      if (!response.ok) {
        throw new Error(`ObjectInfo取得失敗: ステータス ${response.status}`);
      }

      this.nodeTypes = await response.json();
      await objectInfoRepository.saveObjectInfo(this.nodeTypes);

      this.tabs.forEach((tab) => {
        tab.renderNodes();
      });
    } catch (error) {
      console.error("ObjectInfoとWorkflowの更新中にエラー:", error);
    }
  }

  async initialize() {
    try {
      const response = await fetch(comfyUIUrls.objectInfoOnly);
      if (response.ok) {
        this.nodeTypes = await response.json();
        await objectInfoRepository.saveObjectInfo(this.nodeTypes);
      } else {
        throw new Error("ComfyUI接続エラー");
      }
    } catch (error) {
      console.info("ComfyUIへの接続に失敗。IndexedDBを確認します:", error);

      this.nodeTypes = await objectInfoRepository.getObjectInfo();
      if (!this.nodeTypes) {
        console.info(
          "IndexedDBにデータなし。デフォルトのObjectInfoを使用します"
        );
        this.nodeTypes = defaultObjectInfo;
      }
    }

    this.setupFileInput();
    this.setupTabEvents();

    const workflows = await workflowRepository.getAllWorkflows();
    for (const workflowData of workflows) {
      const { id, name, workflowJson, type, enabled } = workflowData;
      const file = new File([JSON.stringify(workflowJson)], name, {
        type: "application/json",
      });

      if (!workflowJson.id) {
        workflowJson.id = id;
      }

      try {
        await this.createTab(file);
      } catch (error) {
        console.error(
          `ワークフロー "${name}" の読み込みに失敗しました:`,
          error
        );
      }
    }

    this.renderTabs();

    monitorComfyUIConnection((isOnline) => {
      if (isOnline) {
        this.updateObjectInfoAndWorkflows();
      }
    });
  }

  setupFileInput() {
    document
      .getElementById("workflowFile")
      .addEventListener("change", async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
          await this.createTab(file);
        }
        e.target.value = "";
        this.renderTabs();
      });
  }

  renderTabs() {
    const tabList = document.getElementById("tabList");
    tabList.innerHTML = "";
    const groupedTabs = this.groupTabsByType();
    Object.keys(groupedTabs).forEach((type) => {
      const typeSeparator = document.createElement("div");
      typeSeparator.className = "tab-type-separator";
      typeSeparator.innerText = type;
      tabList.appendChild(typeSeparator);
      groupedTabs[type].forEach((tab) => {
        const tabButton = tab.createTabButton();
        tabList.appendChild(tabButton);
      });
    });
    if (this.activeTabId) this.activateTab(this.activeTabId);
  }

  async createTab(file) {
    try {
      const text = await file.text();
      const workflow = JSON.parse(text);
      if (!workflow.id) {
        workflow.id = `workflow-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      }

      const tab = new ComfyUIWorkflowTab(file, workflow, this);
      const tabContent = document.getElementById("tabContentContainer");
      tabContent.appendChild(tab.createContent());
      this.tabs.set(tab.id, tab);
      this.activateTab(tab.id);
      tab.renderNodes();
      this.renderTabs();
    } catch (error) {
      console.error("タブ作成エラー:", error);
    }
  }

  groupTabsByType() {
    return Array.from(this.tabs.values()).reduce((groups, tab) => {
      const type = tab.workflow.type || "T2I";
      if (!groups[type]) groups[type] = [];
      groups[type].push(tab);
      return groups;
    }, {});
  }

  onTabEnabledChanged(type, tabId) {
    this.tabs.forEach((tab) => {
      if (tab.workflow.type === type) {
        tab.workflow.enabled = tab.id === tabId;
      }
    });
    this.renderTabs();
  }

  setupTabEvents() {
    document.getElementById("tabList").addEventListener("click", (e) => {
      const tabButton = e.target.closest(".tab-button");
      if (!tabButton) return;

      const tabId = tabButton.dataset.tabId;
      const tab = this.tabs.get(tabId);
      if (!tab) return;

      if (e.target.closest(".tab-close")) {
        this.closeTab(tabId);
      } else if (e.target.closest(".tab-download")) {
        tab.downloadWorkflow();
      } else {
        this.activateTab(tabId);
      }
    });
  }

  activateTab(tabId) {
    const oldTab = this.tabs.get(this.activeTabId);
    if (oldTab) oldTab.deactivate();
    const newTab = this.tabs.get(tabId);
    if (newTab) {
      this.activeTabId = tabId;
      newTab.activate();
    }
  }

  closeTab(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab) return;

    if (tab.workflow.id) {
      workflowRepository.deleteWorkflow(tab.workflow.id).then((result) => {
        if (result) {
          console.log(
            `Workflow with ID ${tab.workflow.id} deleted from IndexedDB`
          );
        } else {
          console.error(`Failed to delete workflow with ID ${tab.workflow.id}`);
        }
      });
    }
    tab.destroy();
    this.tabs.delete(tabId);

    if (this.activeTabId === tabId) {
      const newActiveTab = this.tabs.keys().next().value;
      if (newActiveTab) {
        this.activateTab(newActiveTab);
      }
    }
  }

  getNodeType(className) {
    return this.nodeTypes?.[className] || null;
  }
}

let comfyUIWorkflowEditor;
