fabric.Object.NUM_FRACTION_DIGITS = 100;

const minCanvasSizeWidth = 600;
const minCanvasSizeHeight = 400;

var canvas = new fabric.Canvas("mangaImageCanvas", {
  renderOnAddRemove: false,
  skipOffscreen: false,
  renderer: fabric.isWebglSupported ? "webgl" : "canvas",
});
document.addEventListener("DOMContentLoaded", function() {
  loadBookSize(210, 297, false);

});

const mode = localStorage.getItem('mode') || 'light-mode';
if (mode === 'dark-mode') {
  canvas.backgroundColor = "gray";
}else{
  canvas.backgroundColor = "white";
}

var clipAreaCoords = {
  left: 0,
  top: 0,
  width: canvas.width,
  height: canvas.height,
};

var svgPagging = 20;
document.getElementById('marginFromPanel').addEventListener('input', function() {
  svgPagging = parseInt(this.value, 20);
});

var sdWebUIPort = 7860;
var sdWebUIHost = "127.0.0.1";

var comfyuiPort = 8188;
var comfyuiHost = "127.0.0.1";



const text2img_basePrompt = {
  text2img_prompt               : "masterpiece, best quality, 1girl, simple background, ",
  text2img_negativePrompt       : "low quality, worst quality, jpeg, normal quality, ",
  text2img_seed                 : -1,
  text2img_cfg_scale            : 7,
  text2img_width                : 1024,
  text2img_height               : 1024,
  text2img_samplingMethod       : "Euler a",
  text2img_samplingSteps        : 20,
  text2img_scheduler            : "Automatic",
  text2img_model                : "",
  text2img_hr_upscaler          : "None",
  text2img_basePrompt_hr_scale  : "1.3",
  text2img_basePrompt_hr_step   : 20,
  text2img_basePrompt_hr_denoising_strength: "0.7",
};

const text2img_initPrompt = {
  isPanel                 : true,
  text2img_prompt         : "",
  text2img_negativePrompt : "",
  text2img_seed           : -2,
  text2img_width          : -1,
  text2img_height         : -1,
};

const img2img_initPrompt = {
  img2img_prompt         : "",
  img2img_negativePrompt : "",
  img2img_seed           : -2,
  img2img_width          : -1,
  img2img_height         : -1,
  img2img_samplingSteps : 20,
  img2img_denoising_strength : 0.75,
};


// 共通プロパティリスト
const commonProperties = [
                          'excludeFromLayerPanel', 
                          'isPanel', 
                          'isIcon',
                          'text2img_prompt', 
                          'text2img_negativePrompt', 
                          'text2img_seed', 
                          'text2img_width', 
                          'text2img_height', 
                          'text2img_samplingMethod', 
                          'text2img_samplingSteps',
                          'initial', 
                          'clipPath.initial',
                          'name'
];

// TODO: Couldn't figure out a good way to reach local json file so I just stored them like this for now, quite the temporary soloution.
var comfyuiPresetT2IWorkflow = {
  "1": {
    "inputs": {
      "seed": "%seed%",
      "steps": "%steps%",
      "cfg": "%cfg%",
      "sampler_name": "%sampler%",
      "scheduler": "normal",
      "denoise": 1,
      "model": [
        "2",
        0
      ],
      "positive": [
        "3",
        0
      ],
      "negative": [
        "4",
        0
      ],
      "latent_image": [
        "5",
        0
      ]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "KSampler"
    }
  },
  "2": {
    "inputs": {
      "ckpt_name": "%model%"
    },
    "class_type": "CheckpointLoaderSimple",
    "_meta": {
      "title": "Load Checkpoint"
    }
  },
  "3": {
    "inputs": {
      "text": "%prompt%",
      "clip": [
        "2",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "4": {
    "inputs": {
      "text": "%negative_prompt%",
      "clip": [
        "2",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "5": {
    "inputs": {
      "width": "%width%",
      "height": "%height%",
      "batch_size": 1
    },
    "class_type": "EmptyLatentImage",
    "_meta": {
      "title": "Empty Latent Image"
    }
  },
  "6": {
    "inputs": {
      "samples": [
        "1",
        0
      ],
      "vae": [
        "2",
        2
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "7": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "6",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  }
}
var comfyuiPresetI2IWorkflow = {
  "1": {
    "inputs": {
      "seed": null,
      "steps": null,
      "cfg": null,
      "sampler_name": "%sampler%",
      "scheduler": "normal",
      "denoise": 1,
      "model": [
        "2",
        0
      ],
      "positive": [
        "3",
        0
      ],
      "negative": [
        "4",
        0
      ],
      "latent_image": [
        "12",
        0
      ]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "KSampler"
    }
  },
  "2": {
    "inputs": {
      "ckpt_name": "%model%"
    },
    "class_type": "CheckpointLoaderSimple",
    "_meta": {
      "title": "Load Checkpoint"
    }
  },
  "3": {
    "inputs": {
      "text": "%prompt%",
      "clip": [
        "2",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "4": {
    "inputs": {
      "text": "%negative_prompt%",
      "clip": [
        "2",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "6": {
    "inputs": {
      "samples": [
        "1",
        0
      ],
      "vae": [
        "2",
        2
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "7": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "6",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "11": {
    "inputs": {
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
      "pixels": [
        "11",
        0
      ],
      "vae": [
        "2",
        2
      ],
      "mask": [
        "11",
        1
      ]
    },
    "class_type": "VAEEncodeForInpaint",
    "_meta": {
      "title": "VAE Encode (for Inpainting)"
    }
  }
}