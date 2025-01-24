class WorkflowEditor {
  constructor() {
   this.tabs = new Map();
   this.nodeTypes = null;
   this.activeTabId = null;
  }

  async initialize() {
    try {
      // 初期化時にObjectInfoを取得
      const response = await fetch(comfyUIUrls.objectInfoOnly);
      this.nodeTypes = await response.json();
    } catch (error) {
      console.info("ComfyUIへの接続に失敗しました。デフォルトのObjectInfoを使用します:", error);
      this.nodeTypes = defaultObjectInfo;
    }

    this.setupFileInput();
    this.setupTabEvents();

    // 既存のWorkflowをロード
    const workflows = await workflowRepository.getAllWorkflows();
    for (const workflowData of workflows) {
      const { id, name, workflowJson, type, enabled } = workflowData;
      const file = new File([JSON.stringify(workflowJson)], name, { type: 'application/json' });

      if (!workflowJson.id) {
        workflowJson.id = id;
      }

      try {
        await this.createTab(file);
      } catch (error) {
        console.error(`ワークフロー "${name}" の読み込みに失敗しました:`, error);
      }
    }

    this.renderTabs();

    // 接続状態を監視してObjectInfoを再取得・更新
    monitorComfyUIConnection((isOnline) => {
      if (isOnline) {
        this.updateObjectInfoAndWorkflows();
      }
    });
  }

  async updateObjectInfoAndWorkflows() {
    console.log("開始: ObjectInfoとWorkflowの更新");
    try {
        console.log("ComfyUIからObjectInfoを取得中...");
        const response = await fetch(comfyUIUrls.objectInfoOnly);
        if (!response.ok) {
            console.error(`ObjectInfo取得失敗: ステータス ${response.status}`);
            return;
        }
        this.nodeTypes = await response.json();
        console.log("ObjectInfo取得成功:", this.nodeTypes);

        console.log("全タブのWorkflowを更新中...");
        this.tabs.forEach((tab) => {
            console.log(`更新対象タブID: ${tab.id}`);
            tab.renderNodes();
            console.log(`タブ ${tab.id} の更新完了`);
        });
        console.log("全Workflowの更新が完了しました");
    } catch (error) {
        console.error("ObjectInfoとWorkflowの更新中にエラーが発生:", error);
    }
}






  
 
  setupFileInput() {
    document.getElementById('workflowFile').addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const file of files) {
        await this.createTab(file);
      }
      e.target.value = '';
      this.renderTabs();
    });
  }

 
  renderTabs() {
    const tabList = document.getElementById('tabList');
    tabList.innerHTML = '';
    const groupedTabs = this.groupTabsByType();
    Object.keys(groupedTabs).forEach((type) => {
      const typeSeparator = document.createElement('div');
      typeSeparator.className = 'tab-type-separator';
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
            workflow.id = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        const tab = new WorkflowTab(file, workflow, this);
        const tabContent = document.getElementById('tabContentContainer');
        tabContent.appendChild(tab.createContent());
        this.tabs.set(tab.id, tab);
        this.activateTab(tab.id);
        tab.renderNodes();
        this.renderTabs();
    } catch (error) {
        console.error('タブ作成エラー:', error);
    }
}




 
  groupTabsByType() {
    return Array.from(this.tabs.values()).reduce((groups, tab) => {
      const type = tab.workflow.type || 'T2I';
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
   document.getElementById('tabList').addEventListener('click', (e) => {
    const tabButton = e.target.closest('.tab-button');
    if (!tabButton) return;
    
    const tabId = tabButton.dataset.tabId;
    const tab = this.tabs.get(tabId);
    if (!tab) return;
    
    if (e.target.closest('.tab-close')) {
     this.closeTab(tabId);
    } else if (e.target.closest('.tab-download')) {
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
                console.log(`Workflow with ID ${tab.workflow.id} deleted from IndexedDB`);
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
 
 let workflowEditor = new WorkflowEditor();
 workflowEditor.initialize();