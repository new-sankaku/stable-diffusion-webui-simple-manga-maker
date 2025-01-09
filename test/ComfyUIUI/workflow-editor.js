class WorkflowEditor {
  constructor() {
   this.tabs = new Map();
   this.nodeTypes = null;
   this.activeTabId = null;
  }
 
  async initialize() {
   try {
    const response = await fetch(comfyUIUrls.objectInfoOnly);
    this.nodeTypes = await response.json();
    this.setupFileInput();
    this.setupTabEvents();
   } catch (error) {
    console.error('初期化エラー:', error);
   }
  }
 
  setupFileInput() {
   document.getElementById('workflowFile').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
     await this.createTab(file);
    }
    e.target.value = '';
   });
  }
 
  async createTab(file) {
   try {
    const text = await file.text();
    const workflow = JSON.parse(text);
    const tab = new WorkflowTab(file, workflow, this);
    
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContentContainer');
    
    tabList.appendChild(tab.createTabButton());
    tabContent.appendChild(tab.createContent());
    
    this.tabs.set(tab.id, tab);
    this.activateTab(tab.id);
    
    tab.renderNodes();
   } catch (error) {
    console.error('タブ作成エラー:', error);
   }
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
   if (oldTab) {
    oldTab.deactivate();
   }
   
   const newTab = this.tabs.get(tabId);
   if (newTab) {
    this.activeTabId = tabId;
    newTab.activate();
   }
  }
 
  closeTab(tabId) {
   const tab = this.tabs.get(tabId);
   if (!tab) return;
   
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