class ComfyUIWorkflowBuilder {
    constructor(workflow) {
        this.originalWorkflow = workflow;
        this.hasInitialized = false;
        this.workflowCopy = null;
    }

    initialize() {
        if (!this.hasInitialized) {
            this.workflowCopy = JSON.parse(JSON.stringify(this.originalWorkflow));
            this.hasInitialized = true;
        }
    }

    updateNodesByType(targetClassType, inputs, metaTitle = null) {
        this.initialize();
        
        const validInputs = {};
        Object.entries(inputs).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                validInputs[key] = value;
            }
        });

        if (Object.keys(validInputs).length > 0) {
            Object.entries(this.workflowCopy).forEach(([id, node]) => {
                const classTypeMatch = node.class_type === targetClassType;
                const metaMatch = !metaTitle || (
                    node._meta && node._meta.title === metaTitle
                );

                if (classTypeMatch && metaMatch) {
                    node.inputs = {
                        ...node.inputs,
                        ...validInputs
                    };
                }
            });
        }
        
        return this;
    }

    build() {
        if (!this.hasInitialized) {
            return this.originalWorkflow;
        }
        return this.workflowCopy;
    }
}

function createWorkflowBuilder(workflow) {
    return new ComfyUIWorkflowBuilder(workflow);
}

function example() {
    const workflow = getComfyUI_I2I_BySDXL();
    const newWorkflow = createWorkflowBuilder(workflow)
        .updateNodesByType("KSampler", {
            steps: 20,
            cfg: 7.5
        })
        .updateNodesByType("CLIPTextEncode", {
            samples: ["1", 1]
        })
        .updateNodesByType("CLIPTextEncode", {
            text: "new prompt"
        }, "CLIP Text Encode (Prompt)")
        .build();
}

