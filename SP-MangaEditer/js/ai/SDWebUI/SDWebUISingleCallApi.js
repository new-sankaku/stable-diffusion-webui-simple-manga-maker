const sdQueue = new TaskQueue(1);

async function processQueue(layer, spinnerId, fetchFunction, imageName) {
  console.log(`Processing queue for ${imageName}`);
  try {
    const { img, responseData } = await sdQueue.add(() => sdwebui_generateImage(layer, fetchFunction));
    if (img) {
      await handleSuccessfulGeneration(img, responseData, layer, imageName);
    } else {
      createToastError("Generation error", "");
    }
  } catch (error) {
    handleGenerationError(error);
  } finally {
    removeSpinner(spinnerId);
  }
}

async function handleSuccessfulGeneration(img, responseData, layer, imageName) {
  const webpImg = await img2webp(img);
  webpImg.name = imageName;
  setImage2ImageInitPrompt(webpImg);
  const { centerX, centerY } = calculateCenter(layer);
  putImageInFrame(webpImg, centerX, centerY);

  const infoObject = JSON.parse(responseData.info);
  layer.tempSeed = infoObject.seed;
  webpImg.tempPrompt = infoObject.prompt;
  webpImg.tempNegativePrompt = infoObject.negative_prompt;
}

const sdWebUI_t2IProcessQueue = (layer, spinnerId) => processQueue(layer, spinnerId, sdwebui_fetchText2Image, "t2i");
const sdWebUI_I2IProcessQueue = (layer, spinnerId) => processQueue(layer, spinnerId, sdwebui_fetchImage2Image, "i2i");

async function sdwebui_fetchText2Image(layer) {
  return post(sdWebUI_API_T2I, baseRequestData(layer));
}

async function sdwebui_fetchImage2Image(layer) {
  const base64Image = imageObject2Base64ImageEffectKeep(layer);
  const requestData = {
    ...baseRequestData(layer),
    init_images: [base64Image.split(',')[1]],
    denoising_strength: layer.img2img_denoising_strength
  };
  console.log( "sdwebui_fetchImage2Image requestData", requestData );
  return post(sdWebUI_API_I2I, requestData);
}

async function post(url, requestData) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    return await response.json();
  } catch (error) {
    var checkSD = getText("checkSD_webUI_Text");
    createToastError("Fetch Error", checkSD);
    return null;
  }
}

async function sdwebui_generateImage(layer, fetchFunction) {
  const responseData = await fetchFunction(layer);
  if (!responseData) return null;

  const base64ImageData = responseData.images[0];
  const imageSrc = 'data:image/png;base64,' + base64ImageData;

  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imageSrc, (img) => {
      img ? resolve({ img, responseData }) : reject(new Error('Failed to create a fabric.Image object'));
    });
  });
}

async function sdWebUI_RembgProcessQueue(layer, spinnerId) {
  console.log("Processing queue for rembg");
  try {
    const responseData = await sdQueue.add(() => sdwebui_removeBackground(layer));
    if (responseData && typeof responseData === 'string') {
      await handleSuccessfulRembg(responseData, layer);
    } else {
      createToastError("Invalid background removal response", "");
    }
  } catch (error) {
    handleGenerationError(error);
  } finally {
    removeSpinner(spinnerId);
  }
}

async function sdwebui_removeBackground(layer) {
  const base64Image = imageObject2Base64ImageEffectKeep(layer);

  const requestData = rembgRequestData(layer);
  requestData.input_image = base64Image.split(',')[1];
  const response = await post(sdWebUI_API_rembg, requestData);

  if (typeof response === 'object' && response.hasOwnProperty('image')) {
    return response.image;
  } else if (typeof response === 'string') {
    return response;
  } else {
    throw new Error('Unexpected response format from rembg API');
  }
}

async function handleSuccessfulRembg(responseData, layer) {
  if (!responseData.startsWith('data:image')) {
    responseData = 'data:image/png;base64,' + responseData;
  }

  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(responseData, (img) => {
      if (img) {
        const { centerX, centerY } = calculateCenter(layer);
        putImageInFrame(img, centerX, centerY);
        resolve(img);
      } else {
        reject(new Error('Failed to create a fabric.Image object from rembg result'));
      }
    }, { crossOrigin: 'anonymous' });
  });
}
