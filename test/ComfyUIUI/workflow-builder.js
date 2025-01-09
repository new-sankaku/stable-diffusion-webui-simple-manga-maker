class WorkflowBuilder {
  constructor() {
    this.nodes = new Map();
    this.connections = [];
    this.currentNodeId = 1;
    this.nodeTypes = null;
    this.validator = new NodeValidator();
    this.fetchNodeTypes();
  }

  async fetchNodeTypes() {
    try {
      const response = await fetch("http://localhost:8188/object_info");
      this.nodeTypes = await response.json();
    } catch (error) {
      throw new Error("Failed to fetch node types");
    }
  }

  loadWorkflow(workflow) {
    this.nodes.clear();
    this.connections = [];

    Object.entries(workflow).forEach(([id, node]) => {
      const nodeId = parseInt(id);
      this.nodes.set(nodeId, {
        inputs: { ...node.inputs },
        class_type: node.class_type,
        _meta: { ...node._meta },
      });
      this.currentNodeId = Math.max(this.currentNodeId, nodeId + 1);

      Object.entries(node.inputs).forEach(([param, value]) => {
        if (Array.isArray(value)) {
          const [fromNode, fromPort] = value;
          this.connections.push({
            fromNode,
            fromPort,
            toNode: nodeId,
            toParam: param,
          });
        }
      });
    });
    return this;
  }

  async addNode(nodeType, title, inputs = {}) {
    if (!this.nodeTypes) throw new Error("Node types not loaded");
    const typeDefinition = this.nodeTypes[nodeType];
    if (!typeDefinition) throw new Error(`Unknown node type: ${nodeType}`);
    await this.validator.validateInputs(typeDefinition, inputs);
    const node = {
      inputs: { ...inputs },
      class_type: nodeType,
      _meta: { title },
    };
    this.nodes.set(this.currentNodeId, node);
    return this.currentNodeId++;
  }

  connect(fromNode, fromPort, toNode, toParam) {
    const fromNodeData = this.nodes.get(fromNode);
    const toNodeData = this.nodes.get(toNode);
    if (!fromNodeData || !toNodeData) throw new Error("Invalid node reference");
    const fromType = this.nodeTypes[fromNodeData.class_type];
    const toType = this.nodeTypes[toNodeData.class_type];
    this.validator.validateConnection(fromType, fromPort, toType, toParam);
    this.connections.push({ fromNode, fromPort, toNode, toParam });
    const targetNode = this.nodes.get(toNode);
    if (targetNode) targetNode.inputs[toParam] = [fromNode, fromPort];
    return this;
  }

  disconnect(fromNode, toNode) {
    this.connections = this.connections.filter(
      (conn) => !(conn.fromNode === fromNode && conn.toNode === toNode)
    );
    const targetNode = this.nodes.get(toNode);
    if (targetNode) {
      Object.entries(targetNode.inputs).forEach(([key, value]) => {
        if (Array.isArray(value) && value[0] === fromNode)
          delete targetNode.inputs[key];
      });
    }
    return this;
  }

  removeNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);
    const incomingConnections = this.connections.filter(
      (conn) => conn.toNode === nodeId
    );
    const outgoingConnections = this.connections.filter(
      (conn) => conn.fromNode === nodeId
    );
    for (const inConn of incomingConnections) {
      for (const outConn of outgoingConnections) {
        this.connect(
          inConn.fromNode,
          inConn.fromPort,
          outConn.toNode,
          outConn.toParam
        );
      }
    }
    this.nodes.delete(nodeId);
    this.connections = this.connections.filter(
      (conn) => conn.fromNode !== nodeId && conn.toNode !== nodeId
    );
    this.updateAffectedNodes(nodeId);
  }

  updateAffectedNodes(removedNodeId) {
    this.nodes.forEach((node) => {
      Object.entries(node.inputs).forEach(([param, value]) => {
        if (Array.isArray(value) && value[0] === removedNodeId)
          delete node.inputs[param];
      });
    });
  }

  copyNode(nodeId) {
    const sourceNode = this.nodes.get(nodeId);
    if (!sourceNode) throw new Error(`Node ${nodeId} not found`);

    const newNode = {
      inputs: { ...sourceNode.inputs },
      class_type: sourceNode.class_type,
      _meta: { ...sourceNode._meta },
    };

    const newNodeId = this.currentNodeId++;
    this.nodes.set(newNodeId, newNode);

    this.connections
      .filter((conn) => conn.fromNode === nodeId)
      .forEach((conn) => {
        this.connect(newNodeId, conn.fromPort, conn.toNode, conn.toParam);
      });

    return newNodeId;
  }

  getNodeConnections(nodeId) {
    return {
      incoming: this.connections.filter((conn) => conn.toNode === nodeId),
      outgoing: this.connections.filter((conn) => conn.fromNode === nodeId),
    };
  }

  moveNode(nodeId, beforeNodeId) {
    if (!this.nodes.has(nodeId) || !this.nodes.has(beforeNodeId)) {
      throw new Error("Invalid node IDs");
    }

    const nodesArray = Array.from(this.nodes.entries());
    const sourceIdx = nodesArray.findIndex(([id]) => id === nodeId);
    const targetIdx = nodesArray.findIndex(([id]) => id === beforeNodeId);

    if (sourceIdx === -1 || targetIdx === -1) return;

    const [moveEntry] = nodesArray.splice(sourceIdx, 1);
    nodesArray.splice(targetIdx, 0, moveEntry);

    this.nodes = new Map(nodesArray);
    return this;
  }

  build() {
    const workflow = {};
    this.nodes.forEach((node, id) => {
      workflow[id] = {
        inputs: { ...node.inputs },
        class_type: node.class_type,
        _meta: { ...node._meta },
      };
    });
    return workflow;
  }

  clear() {
    this.nodes.clear();
    this.connections = [];
    this.currentNodeId = 1;
    return this;
  }

  exportToJSON() {
    return JSON.stringify(this.build(), null, 2);
  }

  getFirstNodeIdByType(classType) {
    for (const [id, node] of this.nodes) {
      if (node.class_type === classType) {
        return parseInt(id);
      }
    }
    return null;
  }

  getLastNodeIdByType(classType) {
    let lastId = null;
    for (const [id, node] of this.nodes) {
      if (node.class_type === classType) {
        lastId = parseInt(id);
      }
    }
    return lastId;
  }

  getAllNodeIdsByType(classType) {
    const nodeIds = [];
    for (const [id, node] of this.nodes) {
      if (node.class_type === classType) {
        nodeIds.push(parseInt(id));
      }
    }
    return nodeIds;
  }
}
