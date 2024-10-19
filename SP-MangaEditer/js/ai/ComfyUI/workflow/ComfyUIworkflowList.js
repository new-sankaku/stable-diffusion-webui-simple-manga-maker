function getComfyUI_T2I_BySDXL(){
  return {
    "1": {
      "inputs": {
        "seed": "%seed%",
        "steps": "%steps%",
        "cfg": "%cfg%",
        "sampler_name": "%sampler%",
        "scheduler": "normal",
        "denoise": 1,
        "model": ["2", 0],
        "positive": ["3", 0],
        "negative": ["4", 0],
        "latent_image": ["5", 0]
      },
      "class_type": "KSampler",
      "_meta": { "title": "KSampler" }
    },
    "2": {
      "inputs": { "ckpt_name": "%model%" },
      "class_type": "CheckpointLoaderSimple",
      "_meta": { "title": "Load Checkpoint" }
    },
    "3": {
      "inputs": {
        "text": "%prompt%",
        "clip": ["2", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": { "title": "CLIP Text Encode (Prompt)" }
    },
    "4": {
      "inputs": {
        "text": "%negative%",
        "clip": ["2", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": { "title": "CLIP Text Encode (Prompt)" }
    },
    "5": {
      "inputs": {
        "width": "%width%",
        "height": "%height%",
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": { "title": "Empty Latent Image" }
    },
    "6": {
      "inputs": {
        "samples": ["1", 0],
        "vae": ["2", 2]
      },
      "class_type": "VAEDecode",
      "_meta": { "title": "VAE Decode" }
    },
    "7": {
      "inputs": {
        "filename_prefix": "ComfyUI",
        "images": ["6", 0]
      },
      "class_type": "SaveImage",
      "_meta": { "title": "Save Image" }
    }
};
}

function getComfyUI_I2I_BySDXL(){
return {
  "1": {
    "inputs": {
      "seed": "%seed%",
      "steps": "%steps%",
      "cfg": "%cfg%",
      "sampler_name": "%sampler%",
      "scheduler": "normal",
      "denoise": "%denoise%",
      "model": ["2", 0],
      "positive": ["3", 0],
      "negative": ["4", 0],
      "latent_image": ["12", 0]
    },
    "class_type": "KSampler",
    "_meta": { "title": "KSampler" }
  },
  "2": {
    "inputs": { "ckpt_name": "%model%" },
    "class_type": "CheckpointLoaderSimple",
    "_meta": { "title": "Load Checkpoint" }
  },
  "3": {
    "inputs": {
      "text": "%prompt%",
      "clip": ["2", 1]
    },
    "class_type": "CLIPTextEncode",
    "_meta": { "title": "CLIP Text Encode (Prompt)" }
  },
  "4": {
    "inputs": {
      "text": "%negative%",
      "clip": ["2", 1]
    },
    "class_type": "CLIPTextEncode",
    "_meta": { "title": "CLIP Text Encode (Prompt)" }
  },
  "6": {
    "inputs": {
      "samples": ["1", 0],
      "vae": ["2", 2]
    },
    "class_type": "VAEDecode",
    "_meta": { "title": "VAE Decode" }
  },
  "7": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": ["6", 0]
    },
    "class_type": "SaveImage",
    "_meta": { "title": "Save Image" }
  },
  "11": {
    "inputs": {
      "image": "%uploadImage%",
      "upload": "image"
    },
    "class_type": "LoadImage",
    "_meta": {
      "title": "Load Image"
    }
  },
  "12": {
    "inputs": {
      "grow_mask_by": 6,
      "pixels": ["11", 0],
      "vae": ["2", 2],
      "mask": ["11", 1]
    },
    "class_type": "VAEEncodeForInpaint",
    "_meta": { "title": "VAE Encode (for Inpainting)" }
  }
};
}