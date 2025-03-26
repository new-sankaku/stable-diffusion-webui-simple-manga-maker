const ComfyUI_T2I_BySDXL = {
  3: {
    inputs: {
      seed: 2,
      steps: 25,
      cfg: 6.5,
      sampler_name: "dpmpp_2m_sde",
      scheduler: "exponential",
      denoise: 1,
      model: ["4", 0],
      positive: ["30", 0],
      negative: ["33", 0],
      latent_image: ["5", 0],
    },
    class_type: "KSampler",
    _meta: {
      title: "KSampler",
    },
  },
  4: {
    inputs: {
      ckpt_name: "sd_xl_refiner_1.0_0.9vae.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
    _meta: {
      title: "Load Checkpoint",
    },
  },
  5: {
    inputs: {
      width: 1024,
      height: 1024,
      batch_size: 1,
    },
    class_type: "EmptyLatentImage",
    _meta: {
      title: "Empty Latent Image",
    },
  },
  8: {
    inputs: {
      samples: ["3", 0],
      vae: ["4", 2],
    },
    class_type: "VAEDecode",
    _meta: {
      title: "VAE Decode",
    },
  },
  28: {
    inputs: {
      filename_prefix: "ComfyUI",
      images: ["8", 0],
    },
    class_type: "SaveImage",
    _meta: {
      title: "Save Image",
    },
  },
  30: {
    inputs: {
      width: 4096,
      height: 4096,
      crop_w: 0,
      crop_h: 0,
      target_width: 4096,
      target_height: 4096,
      text_g: "%prompt%",
      text_l: "%prompt%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncodeSDXL",
    _meta: {
      title: "CLIPTextEncodeSDXL",
    },
  },
  33: {
    inputs: {
      width: 4096,
      height: 4096,
      crop_w: 0,
      crop_h: 0,
      target_width: 4096,
      target_height: 4096,
      text_g: "%negative%",
      text_l: "%negative%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncodeSDXL",
    _meta: {
      title: "CLIPTextEncodeSDXL",
    },
  },
};
const ComfyUI_T2I_BySDXL_Lora = {
  3: {
    inputs: {
      seed: 663922647965408,
      steps: 20,
      cfg: 6.5,
      sampler_name: "euler",
      scheduler: "simple",
      denoise: 1,
      model: ["10", 0],
      positive: ["27", 0],
      negative: ["26", 0],
      latent_image: ["5", 0],
    },
    class_type: "KSampler",
    _meta: {
      title: "KSampler",
    },
  },
  4: {
    inputs: {
      ckpt_name: "sdXL_v10VAEFix.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
    _meta: {
      title: "SDXL Base Model",
    },
  },
  5: {
    inputs: {
      width: 1024,
      height: 1024,
      batch_size: 1,
    },
    class_type: "EmptyLatentImage",
    _meta: {
      title: "Empty Latent Image",
    },
  },
  8: {
    inputs: {
      samples: ["3", 0],
      vae: ["4", 2],
    },
    class_type: "VAEDecode",
    _meta: {
      title: "VAE Decode",
    },
  },
  10: {
    inputs: {
      lora_name: "detailed(sdxl).safetensors",
      strength_model: 0.5,
      strength_clip: 1,
      model: ["4", 0],
      clip: ["4", 1],
    },
    class_type: "LoraLoader",
    _meta: {
      title: "SDXL LoRA",
    },
  },
  23: {
    inputs: {
      filename_prefix: "ComfyUI",
      images: ["8", 0],
    },
    class_type: "SaveImage",
    _meta: {
      title: "SDXL Refiner+LoRA Image",
    },
  },
  26: {
    inputs: {
      text: "%negative%",
      clip: ["10", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Prompt)",
    },
  },
  27: {
    inputs: {
      text: "%prompt%",
      clip: ["10", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Prompt)",
    },
  },
};
const ComfyUI_T2I_BySDXL_Refiner = {
  4: {
    inputs: {
      ckpt_name: "sd_xl_base_1.0_0.9vae.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
    _meta: {
      title: "Load Checkpoint",
    },
  },
  5: {
    inputs: {
      width: 1024,
      height: 1024,
      batch_size: 1,
    },
    class_type: "EmptyLatentImage",
    _meta: {
      title: "Empty Latent Image",
    },
  },
  8: {
    inputs: {
      samples: ["38", 0],
      vae: ["37", 0],
    },
    class_type: "VAEDecode",
    _meta: {
      title: "VAE Decode",
    },
  },
  28: {
    inputs: {
      filename_prefix: "ComfyUI",
      images: ["8", 0],
    },
    class_type: "SaveImage",
    _meta: {
      title: "Save Image",
    },
  },
  30: {
    inputs: {
      width: 4096,
      height: 4096,
      crop_w: 0,
      crop_h: 0,
      target_width: 4096,
      target_height: 4096,
      text_g: "%prompt%",
      text_l: "%prompt%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncodeSDXL",
    _meta: {
      title: "CLIPTextEncodeSDXL",
    },
  },
  33: {
    inputs: {
      width: 4096,
      height: 4096,
      crop_w: 0,
      crop_h: 0,
      target_width: 4096,
      target_height: 4096,
      text_g: "%negative%",
      text_l: "%negative%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncodeSDXL",
    _meta: {
      title: "CLIPTextEncodeSDXL",
    },
  },
  36: {
    inputs: {
      add_noise: "enable",
      noise_seed: 319547470435720,
      steps: 30,
      cfg: 6.5,
      sampler_name: "dpmpp_2m_sde",
      scheduler: "exponential",
      start_at_step: 0,
      end_at_step: 25,
      return_with_leftover_noise: "enable",
      model: ["4", 0],
      positive: ["30", 0],
      negative: ["33", 0],
      latent_image: ["5", 0],
    },
    class_type: "KSamplerAdvanced",
    _meta: {
      title: "KSampler (Advanced)",
    },
  },
  37: {
    inputs: {
      vae_name: "sdxl_vae.safetensors",
    },
    class_type: "VAELoader",
    _meta: {
      title: "Load VAE",
    },
  },
  38: {
    inputs: {
      add_noise: "disable",
      noise_seed: 98488767295677,
      steps: 30,
      cfg: 6.5,
      sampler_name: "dpmpp_2m_sde",
      scheduler: "karras",
      start_at_step: 25,
      end_at_step: 10000,
      return_with_leftover_noise: "disable",
      model: ["39", 0],
      positive: ["40", 0],
      negative: ["41", 0],
      latent_image: ["36", 0],
    },
    class_type: "KSamplerAdvanced",
    _meta: {
      title: "KSampler (Advanced)",
    },
  },
  39: {
    inputs: {
      ckpt_name: "sd_xl_refiner_1.0.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
    _meta: {
      title: "Load Checkpoint",
    },
  },
  40: {
    inputs: {
      ascore: 6,
      width: 1024,
      height: 1024,
      text: "%prompt%",
      clip: ["39", 1],
    },
    class_type: "CLIPTextEncodeSDXLRefiner",
    _meta: {
      title: "CLIPTextEncodeSDXLRefiner",
    },
  },
  41: {
    inputs: {
      ascore: 3,
      width: 1024,
      height: 1024,
      text: "%negative%",
      clip: ["39", 1],
    },
    class_type: "CLIPTextEncodeSDXLRefiner",
    _meta: {
      title: "CLIPTextEncodeSDXLRefiner",
    },
  },
};
const ComfyUI_T2I_BySD15 = {
  3: {
    inputs: {
      seed: 8,
      steps: 25,
      cfg: 6.5,
      sampler_name: "dpmpp_2m",
      scheduler: "karras",
      denoise: 1,
      model: ["4", 0],
      positive: ["6", 0],
      negative: ["7", 0],
      latent_image: ["5", 0],
    },
    class_type: "KSampler",
    _meta: {
      title: "KSampler",
    },
  },
  4: {
    inputs: {
      ckpt_name: "dreamshaper_8.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
    _meta: {
      title: "Load Checkpoint",
    },
  },
  5: {
    inputs: {
      width: 512,
      height: 512,
      batch_size: 1,
    },
    class_type: "EmptyLatentImage",
    _meta: {
      title: "Empty Latent Image",
    },
  },
  6: {
    inputs: {
      text: "%prompt%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Positive)",
    },
  },
  7: {
    inputs: {
      text: "%negative%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Negative)",
    },
  },
  8: {
    inputs: {
      samples: ["3", 0],
      vae: ["4", 2],
    },
    class_type: "VAEDecode",
    _meta: {
      title: "VAE Decode",
    },
  },
  9: {
    inputs: {
      filename_prefix: "Result",
      images: ["8", 0],
    },
    class_type: "SaveImage",
    _meta: {
      title: "Save Image",
    },
  },
};
const ComfyUI_T2I_BySD15_VAE = {
  3: {
    inputs: {
      seed: 8,
      steps: 25,
      cfg: 6.5,
      sampler_name: "dpmpp_2m",
      scheduler: "karras",
      denoise: 1,
      model: ["4", 0],
      positive: ["6", 0],
      negative: ["7", 0],
      latent_image: ["5", 0],
    },
    class_type: "KSampler",
    _meta: {
      title: "KSampler",
    },
  },
  4: {
    inputs: {
      ckpt_name: "dreamshaper_8.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
    _meta: {
      title: "Load Checkpoint",
    },
  },
  5: {
    inputs: {
      width: 512,
      height: 512,
      batch_size: 1,
    },
    class_type: "EmptyLatentImage",
    _meta: {
      title: "Empty Latent Image",
    },
  },
  6: {
    inputs: {
      text: "%prompt%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Positive)",
    },
  },
  7: {
    inputs: {
      text: "%negative%",
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Negative)",
    },
  },
  8: {
    inputs: {
      samples: ["3", 0],
      vae: ["15", 0],
    },
    class_type: "VAEDecode",
    _meta: {
      title: "VAE Decode",
    },
  },
  9: {
    inputs: {
      filename_prefix: "Result",
      images: ["8", 0],
    },
    class_type: "SaveImage",
    _meta: {
      title: "Save Image",
    },
  },
  15: {
    inputs: {
      vae_name: "vae-ft-mse-840000-ema-pruned.safetensors",
    },
    class_type: "VAELoader",
    _meta: {
      title: "Load VAE",
    },
  },
};
const ComfyUI_T2I_BySD15_Lora = {
  last_node_id: 17,
  last_link_id: 17,
  nodes: [
    {
      id: 7,
      type: "CLIPTextEncode",
      pos: [820, 400],
      size: { 0: 370, 1: 160 },
      flags: {},
      order: 6,
      mode: 0,
      inputs: [{ name: "clip", type: "CLIP", link: 16 }],
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          links: [6],
          slot_index: 0,
        },
      ],
      title: "CLIP Text Encode (Negative)",
      properties: { "Node name for S&R": "CLIPTextEncode" },
      widgets_values: [
        "blurry, illustration, toy, clay, low quality, flag, nasa, mission patch",
      ],
      color: "#322",
      bgcolor: "#533",
    },
    {
      id: 6,
      type: "CLIPTextEncode",
      pos: [820, 180],
      size: { 0: 370, 1: 160 },
      flags: {},
      order: 5,
      mode: 0,
      inputs: [{ name: "clip", type: "CLIP", link: 15 }],
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          links: [4],
          slot_index: 0,
        },
      ],
      title: "CLIP Text Encode (Positive)",
      properties: { "Node name for S&R": "CLIPTextEncode" },
      widgets_values: [
        "a photo of an anthropomorphic fox wearing a spacesuit inside a sci-fi spaceship\n\ncinematic, dramatic lighting, high resolution, detailed, 4k",
      ],
      color: "#232",
      bgcolor: "#353",
    },
    {
      id: 8,
      type: "VAEDecode",
      pos: [1620, 320],
      size: { 0: 140, 1: 60 },
      flags: {},
      order: 8,
      mode: 0,
      inputs: [
        { name: "samples", type: "LATENT", link: 7 },
        { name: "vae", type: "VAE", link: 12 },
      ],
      outputs: [{ name: "IMAGE", type: "IMAGE", links: [9], slot_index: 0 }],
      properties: { "Node name for S&R": "VAEDecode" },
    },
    {
      id: 9,
      type: "SaveImage",
      pos: [1810, 320],
      size: { 0: 410, 1: 460 },
      flags: {},
      order: 9,
      mode: 0,
      inputs: [{ name: "images", type: "IMAGE", link: 9 }],
      properties: {},
      widgets_values: ["Result"],
    },
    {
      id: 5,
      type: "EmptyLatentImage",
      pos: [970, 620],
      size: { 0: 220, 1: 106 },
      flags: {},
      order: 0,
      mode: 0,
      outputs: [{ name: "LATENT", type: "LATENT", links: [2], slot_index: 0 }],
      properties: { "Node name for S&R": "EmptyLatentImage" },
      widgets_values: [512, 512, 1],
    },
    {
      id: 3,
      type: "KSampler",
      pos: [1270, 320],
      size: { 0: 300, 1: 262 },
      flags: {},
      order: 7,
      mode: 0,
      inputs: [
        { name: "model", type: "MODEL", link: 17 },
        { name: "positive", type: "CONDITIONING", link: 4 },
        { name: "negative", type: "CONDITIONING", link: 6 },
        { name: "latent_image", type: "LATENT", link: 2 },
      ],
      outputs: [{ name: "LATENT", type: "LATENT", links: [7], slot_index: 0 }],
      properties: { "Node name for S&R": "KSampler" },
      widgets_values: [8, "fixed", 25, 6.5, "dpmpp_2m", "karras", 1],
    },
    {
      id: 11,
      type: "Note",
      pos: [420, -10],
      size: { 0: 260, 1: 230 },
      flags: {},
      order: 1,
      mode: 0,
      properties: { text: "" },
      widgets_values: [
        "LORA\n====\n\nSTRENGTH_MODEL and STRENGTH_CLIP are supposed to have the same value, but you can play with the values to get different results.\n\nThe CLIP is responsible of translating the prompts. The MODEL is the actual trained data.\n\n** LORAs can be daisy-chained! You can have as many as you want **",
      ],
      color: "#432",
      bgcolor: "#653",
    },
    {
      id: 4,
      type: "CheckpointLoaderSimple",
      pos: [20, 280],
      size: { 0: 328.5366516113281, 1: 98 },
      flags: {},
      order: 2,
      mode: 0,
      outputs: [
        { name: "MODEL", type: "MODEL", links: [13], slot_index: 0 },
        { name: "CLIP", type: "CLIP", links: [14], slot_index: 1 },
        { name: "VAE", type: "VAE", links: [], slot_index: 2 },
      ],
      properties: { "Node name for S&R": "CheckpointLoaderSimple" },
      widgets_values: ["dreamshaper_8.safetensors"],
    },
    {
      id: 17,
      type: "LoraLoader",
      pos: [420, 280],
      size: { 0: 315, 1: 126 },
      flags: {},
      order: 4,
      mode: 0,
      inputs: [
        { name: "model", type: "MODEL", link: 13 },
        { name: "clip", type: "CLIP", link: 14 },
      ],
      outputs: [
        { name: "MODEL", type: "MODEL", links: [17], shape: 3, slot_index: 0 },
        {
          name: "CLIP",
          type: "CLIP",
          links: [15, 16],
          shape: 3,
          slot_index: 1,
        },
      ],
      properties: { "Node name for S&R": "LoraLoader" },
      widgets_values: ["more_details.safetensors", 1, 1],
    },
    {
      id: 15,
      type: "VAELoader",
      pos: [1250, 640],
      size: { 0: 315, 1: 58 },
      flags: {},
      order: 3,
      mode: 0,
      outputs: [
        { name: "VAE", type: "VAE", links: [12], shape: 3, slot_index: 0 },
      ],
      properties: { "Node name for S&R": "VAELoader" },
      widgets_values: ["vae-ft-mse-840000-ema-pruned.safetensors"],
    },
  ],
  links: [
    [2, 5, 0, 3, 3, "LATENT"],
    [4, 6, 0, 3, 1, "CONDITIONING"],
    [6, 7, 0, 3, 2, "CONDITIONING"],
    [7, 3, 0, 8, 0, "LATENT"],
    [9, 8, 0, 9, 0, "IMAGE"],
    [12, 15, 0, 8, 1, "VAE"],
    [13, 4, 0, 17, 0, "MODEL"],
    [14, 4, 1, 17, 1, "CLIP"],
    [15, 17, 1, 6, 0, "CLIP"],
    [16, 17, 1, 7, 0, "CLIP"],
    [17, 17, 0, 3, 0, "MODEL"],
  ],
  groups: [],
  config: {},
  extra: {},
  version: 0.4,
};
