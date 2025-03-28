const objectInfoRepository = {
  store: null,

  init() {
    this.store = localforage.createInstance({
      name: "objectInfoStorage",
      storeName: "comfyObjectInfo",
    });
  },

  async saveObjectInfo(objectInfo) {
    if (!objectInfo || Object.keys(objectInfo).length === 0) {
      console.error("No valid ObjectInfo specified");
      return false;
    }

    try {
      await this.store.setItem("latestObjectInfo", {
        data: objectInfo,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Failed to save ObjectInfo:", error);
      return false;
    }
  },

  async getObjectInfo() {
    try {
      const result = await this.store.getItem("latestObjectInfo");
      return result ? result.data : null;
    } catch (error) {
      console.error("Failed to retrieve ObjectInfo:", error);
      return null;
    }
  },

  async getLastUpdated() {
    try {
      const result = await this.store.getItem("latestObjectInfo");
      return result ? result.updatedAt : null;
    } catch (error) {
      console.error("Failed to get last update time:", error);
      return null;
    }
  },
};

objectInfoRepository.init();
