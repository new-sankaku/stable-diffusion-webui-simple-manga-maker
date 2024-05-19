document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.getElementById("projectSave"); // Saveボタンを正確に選択
  var loadButton = document.getElementById("projectLoad"); // Loadボタンを正確に選択

  saveButton.addEventListener("click", function () {
    if (stateStack.length === 0) {
      createErrorToast("Save Error", "Not Found.");
      return;
    }
    createToast("Save Start!", "");
    const startTime = performance.now();
    var zip = new JSZip();

    // text2img_basePromptをzipファイルに追加
    zip.file("text2img_basePrompt.json", JSON.stringify(text2img_basePrompt));

    stateStack.forEach((json, index) => {
      zip.file(`state_${index}.json`, JSON.stringify(json));
    });

    imageMap.forEach((value, key) => {
      zip.file(`${key}.img`, value);
    });

    // Canvasの縦横情報を追加
    var canvasInfo = {
      width: canvas.width,
      height: canvas.height
    };
    zip.file("canvas_info.json", JSON.stringify(canvasInfo));

    removeGrid();
    var previewLink = getCropAndDownloadLinkByMultiplier(1, 'jpeg');
    zip.file("preview-image.jpeg", previewLink.href.substring(previewLink.href.indexOf('base64,') + 7), { base64: true });
    if (isGridVisible) {
      drawGrid();
      isGridVisible = true;
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      var url = window.URL.createObjectURL(content);
      var a = document.createElement("a");
      a.href = url;
      a.download = "project.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      const endTime = performance.now();
      console.log(`Save operation took ${endTime - startTime} milliseconds`);
    });
  });

  loadButton.addEventListener("click", function () {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.onchange = function () {
      var file = this.files[0];
      if (file) {
        createToast("Load Start!", "");
        const startTime = performance.now();
        JSZip.loadAsync(file).then(function (zip) {
          stateStack = [];
          imageMap.clear();


          var text2imgBasePromptFile = zip.file("text2img_basePrompt.json");
          if (text2imgBasePromptFile) {
            text2imgBasePromptFile.async("string").then(function (content) {
              Object.assign(text2img_basePrompt, JSON.parse(content));
            });
          }


          var canvasInfoFile = zip.file("canvas_info.json");

          var canvasInfoPromise = canvasInfoFile
            ? canvasInfoFile.async("string").then(function (content) {
                return JSON.parse(content);
              })
            : Promise.resolve({ width: 750, height: 850 });

          var sortedFiles = Object.keys(zip.files).sort();
          var promises = sortedFiles.map(function (fileName) {
            return zip.file(fileName).async("string").then(function (content) {
              if (fileName.endsWith(".img")) {
                let hash = fileName.split('.')[0];
                imageMap.set(hash, content);
              } else if (fileName.endsWith(".json") && fileName !== "text2img_basePrompt.json" && fileName !== "canvas_info.json") {
                return JSON.parse(content);
              }
            });
          });

          Promise.all([canvasInfoPromise, ...promises]).then(function (allData) {
            var canvasInfo = allData[0];
            stateStack = allData.slice(1).filter(data => data !== undefined);

            console.log("Loaded states:", stateStack);
            console.log("Loaded canvasInfo:", canvasInfo);

            document.body.removeChild(fileInput);
            currentStateIndex = stateStack.length - 1;

            resizeCanvasByNum(canvasInfo.width, canvasInfo.height)

            lastRedo();

            // Canvasのリサイズ
            // adjustCanvasSize();

            const endTime = performance.now();
            console.log(`Load operation took ${endTime - startTime} milliseconds`);
          });
        });
      }
    };
  });

});
