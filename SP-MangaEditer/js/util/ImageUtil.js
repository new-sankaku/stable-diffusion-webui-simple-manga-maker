var webpQuality = 0.98;

// await img = imgFile2webpFile(img);
async function imgFile2webpFile(file) {
  if (file.type === 'image/webp') {
      return file;
  }
  var options = {
      fileType: 'image/webp',
      initialQuality: webpQuality
  };
  try {
      var compressedFile = await imageCompression(file, options);
      return compressedFile;
  } catch (error) {
      console.error(error);
      throw error;
  }
}




async function img2webp(i) {
  const blob = await fetch(i._element.src).then(response => response.blob());
  const fileType = blob.type;
  const fileName = 'image.' + fileType.split('/')[1];
  const file = new File([blob], fileName, { type: fileType });
  const webpFile = await imgFile2webpFile(file);

  const webpBlob = webpFile.slice(0, webpFile.size, 'image/webp');
  
  // BlobをデータURIに変換
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const webpDataUrl = reader.result;
      const webpImgElement = new Image();
      webpImgElement.src = webpDataUrl;
      webpImgElement.onload = () => {
        const webpImg = {
          ...i,
          _element: webpImgElement,
          _originalElement: webpImgElement,
          cacheKey: 'webp_texture'
        };
        // Copy prototype methods from the original image object
        Object.setPrototypeOf(webpImg, Object.getPrototypeOf(i));
        resolve(webpImg);
      };
    };
    reader.onerror = reject;
    reader.readAsDataURL(webpBlob);
  });
}

