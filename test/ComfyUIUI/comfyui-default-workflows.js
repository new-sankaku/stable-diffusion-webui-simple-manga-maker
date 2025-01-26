const comfyuiDefaultWorkflows = [
  {
    name: "FluxSimple.json",
    type: "T2I",
    workflow: ComfyUI_T2I_ByFluxSimple,
    enabled: true
  },
  {
    name: "FluxNF4.json",
    type: "T2I",
    workflow: ComfyUI_T2I_ByFluxNF4,
    enabled: false
  },
  {
    name: "FluxDiffusion.json",
    type: "T2I",
    workflow: ComfyUI_T2I_ByFluxDiffusion,
    enabled: false
  },
];
