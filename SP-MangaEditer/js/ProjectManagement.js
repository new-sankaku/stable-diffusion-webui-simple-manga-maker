document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.getElementById("projectSave"); // Saveボタンを正確に選択
  var loadButton = document.getElementById("projectLoad"); // Loadボタンを正確に選択

  saveButton.addEventListener("click", function () {
    if (stateStack.length === 0) {
      createErrorToast("Save Error", "Not Found.");
      return;
    }
    createToast("Save Start!", "")
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

    var previewLink = getCropAndDownloadLink();
    zip.file("preview-image.png", previewLink.href.substring(previewLink.href.indexOf('base64,') + 7), {base64: true});

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
        createToast("Load Start!", "")
        const startTime = performance.now();
        JSZip.loadAsync(file).then(function (zip) {
          stateStack = [];
          imageMap.clear();

          // text2img_basePromptをロード
          var text2imgBasePromptFile = zip.file("text2img_basePrompt.json");
          if (text2imgBasePromptFile) {
            text2imgBasePromptFile.async("string").then(function (content) {
              Object.assign(text2img_basePrompt, JSON.parse(content));
            });
          }

          var sortedFiles = Object.keys(zip.files)
            .sort();
          var promises = sortedFiles.map(function (fileName) {
            return zip.file(fileName).async("string").then(function (content) {
              if (fileName.endsWith(".img")) {
                let hash = fileName.split('.')[0]; // ファイル名からハッシュ値を取得
                imageMap.set(hash, content);
              } else if (fileName.endsWith(".json") && fileName !== "text2img_basePrompt.json") {
                return JSON.parse(content);
              }
            });
          });

          Promise.all(promises).then(function (allData) {
            stateStack = allData.filter(data => data !== undefined);
            console.log("Loaded states:", stateStack);
            document.body.removeChild(fileInput);
            currentStateIndex = stateStack.length - 1;
            lastRedo();
            const endTime = performance.now();
            console.log(`Load operation took ${endTime - startTime} milliseconds`);
          });
        });
      }
    };
  });
});