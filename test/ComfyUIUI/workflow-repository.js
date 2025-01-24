const workflowRepository = {
  store: null,

  init() {
      console.log('init called');
      this.store = localforage.createInstance({
          name: 'workflowStorage',
          storeName: 'userWorkflows'
      });
  },

  async saveWorkflow(type, id, name, workflowJson, enabled = false) {
      console.log('saveWorkflow called with:', { type, id, name, enabled });
      const timestamp = new Date().toISOString();
  
      if (!id) {
          throw new Error('Workflow ID is required for saving.');
      }
  
      if (enabled) {
          await this.disableWorkflowsByType(type);
      }
  
      try {
          const existing = await this.store.getItem(id);
          if (existing) {
              existing.workflowJson = workflowJson;
              existing.updatedAt = timestamp;
              existing.enabled = enabled;
              await this.store.setItem(id, existing);
              return true;
          }
  
          await this.store.setItem(id, {
              type,
              name,
              workflowJson,
              createdAt: timestamp,
              updatedAt: timestamp,
              enabled
          });
          return true;
      } catch (error) {
          console.error('Failed to save workflow:', error);
          return false;
      }
  },
  

  async getWorkflow(id) {
      console.log('getWorkflow called with:', { id });
      try {
          const workflowData = await this.store.getItem(id);
          if (!workflowData) {
              throw new Error(`Workflow with ID ${id} not found.`);
          }
          return workflowData;
      } catch (error) {
          console.error('Failed to retrieve workflow:', error);
          return null;
      }
  },
  
  async getAllWorkflows() {
      console.log('getAllWorkflows called');
      const workflows = [];
      try {
          await this.store.iterate((value, key) => {
              workflows.push({ id: key, ...value });
          });
          return workflows;
      } catch (error) {
          console.error('Failed to retrieve workflow list:', error);
          return [];
      }
  },

  async deleteWorkflow(id) {
      console.log('deleteWorkflow called with:', { id });
      try {
          await this.store.removeItem(id);
          return true;
      } catch (error) {
          console.error('Failed to delete workflow:', error);
          return false;
      }
  },

  async updateWorkflow(name, updatedWorkflowJson, enabled) {
      console.log('updateWorkflow called with:', { name, enabled });
      try {
          const existing = await this.getWorkflow(name);
          if (!existing) throw new Error('Workflow not found');

          const timestamp = new Date().toISOString();
          existing.workflowJson = updatedWorkflowJson;
          existing.updatedAt = timestamp;

          if (enabled !== undefined) {
              existing.enabled = enabled;
          }

          await this.store.setItem(name, existing);
          return true;
      } catch (error) {
          console.error('Failed to update workflow:', error);
          return false;
      }
  },

  async disableWorkflowsByType(type) {
      console.log('disableWorkflowsByType called with:', { type });
      try {
          const workflowsToUpdate = [];
          await this.store.iterate((value, key) => {
              if (value.type === type && value.enabled) {
                  value.enabled = false;
                  workflowsToUpdate.push({ key, value });
              }
          });

          for (const { key, value } of workflowsToUpdate) {
              await this.store.setItem(key, value);
          }
          return true;
      } catch (error) {
          console.error('Failed to disable workflows by type:', error);
          return false;
      }
  },
  async getEnabledWorkflowByType(type) {
      console.log('getEnabledWorkflowByType called with:', { type });
      try {
          let enabledWorkflow = null;
          await this.store.iterate((value) => {
              if (value.type === type && value.enabled) {
                  enabledWorkflow = value;
                  return false;
              }
          });
          return enabledWorkflow;
      } catch (error) {
          console.error('Failed to retrieve enabled workflow by type:', error);
          return null;
      }
  }
  
};

workflowRepository.init();