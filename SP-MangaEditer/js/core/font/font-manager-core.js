

const fmFontData = {
  UserFont: {
    color: "#9f4aff",
    fonts: [
    ],
  },
  QuoteFont: {
    color: "#4a9eff",
    fonts: [
      { name: "Arial Narrow" },
      { name: "Klee One" },
      
      { name: "ZCOOL KuaiLe" },
      { name: "ZCOOL XiaoWei" },

      { name: "Do Hyeon" },
      { name: "East Sea Dokdo" },

      { name: "Architects Daughter" },
      { name: "Comic Neue" },

      { name: "Zen Maru Gothic" },
      { name: "Verdana" },
      { name: "Malgun Gothic" },
      { name: "KleeOne" },
      { name: "Century Gothic" },
      { name: "Yu Gothic" },
      { name: "Meiryo" },
      { name: "Segoe UI" },
      { name: "Arial" },
      { name: "Tahoma" },
      { name: "Trebuchet MS" },
    ],
  },
  DescriptionFont: {
    color: "#4aff4a",
    fonts: [
      { name: "Times New Roman" },
      { name: "Yu Mincho" },
      { name: "Helvetica" },
      { name: "Franklin Gothic Medium" },
      { name: "Courier" },
      { name: "Courier New" },
    ],
  },
  OnomatopoeiaFont: {
    color: "#ff4a4a",
    fonts: [
      { name: "Bangers" },
      { name: "Impact" },
      { name: "851_DZUYOKU" },
      { name: "851_YOWAKU" },
      { name: "851_KAKUKAKU" },
      { name: "851_MkPOP" },
      { name: "Arial Black" },
    ],
  },
  CustomFont: {
    color: "#ff9f4a",
    fonts: [
      { name: "DotGothic16" },
      { name: "Chalk" },
      { name: "Bungee Shade" },
      { name: "Rubik Mono One" },
      { name: "Permanent Marker" },
      { name: "Comic Sans MS" },
    ],
  }
};

const fontManager = {
  existsFont(fontName) {
    return Object.keys(fmFontData).some(key => 
      fmFontData[key].fonts.some(font => font.name === fontName)
    );
  },

  async init() {
    fmFontRepository.init();
    await this.loadSavedFonts();
    await this.setUserFontData();
  },

  async setUserFontData() {
    const userFonts = await this.getFontList();
    fmFontData["UserFont"].fonts = userFonts.map(font => ({
      name: font.name,
      type: font.type,
      url: font.url
    }));
  },

  async loadSavedFonts() {
    const fonts = await fmFontRepository.getAllFonts();
    for (const font of fonts) {
      await this.loadFont(font);
    }
  },

  async loadFont(fontData) {
    try {
      let fontFace;
      if (fontData.type === "upload") {
        fontFace = new FontFace(fontData.name, fontData.buffer);
      } else if (fontData.type === "local") {
        fontFace = new FontFace(fontData.name, `local("${fontData.name}")`);
      } else if (fontData.type === "web") {
        await this.loadWebFontStylesheet(fontData.url);
        return;
      }
      if (fontFace) {
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);
      }
      this.addFontOption(fontData);
    } catch (error) {
      console.error(fontData.name, error);
    }
  },

  async addFontOption(fontData) {
    const id = `fm-font-${fontData.name}`;
    if (!$(id)) {
      const fontArray = await this.getFontList();
      if (!fontArray.some((font) => font.name === fontData.name)) {
        const fontOption = document.createElement("option");
        fontOption.id = id;
        fontOption.value = fontData.name;
        fontOption.textContent = fontData.name;
        fontOption.style.fontFamily = fontData.name;
        fontOption.dataset.type = fontData.type;
        $("fm-userFontGroup").appendChild(fontOption);

        fmFontData["UserFont"].fonts.push({
          name: fontData.name,
          type: fontData.type,
          url: fontData.url
        });
      }
    }
  },

  async getFontList() {
    return await fmFontRepository.getAllFonts();
  },

  async registerLocalFont() {
    const fontNames = $("fm-localFontInput")
        .value.trim()
        .split("\n")
        .filter((name) => name.trim());

    for (const fontName of fontNames) {
        if (this.existsFont(fontName)) {
            createToast(getText("alreadyRegisteredFont"), fontName);
            continue;
        }
        
        const fontVariants = [
            fontName,
            fontName.replace(/\s+/g, ''),
            fontName.split(' ').join(''),
            fontName.replace(/[^\x00-\x7F]/g, '').trim()
        ];

        let loaded = false;
        for (const variant of fontVariants) {
            if (loaded) break;
            
            try {
                const fontFace = new FontFace(fontName, `local("${variant}")`);
                await fontFace.load();
                document.fonts.add(fontFace);
                await fmFontRepository.saveLocalFont(fontName);
                this.addFontOption({ name: fontName, type: "local" });
                loaded = true;
            } catch (error) {
                console.error(`${variant}`, error);
                if (variant === fontVariants[fontVariants.length - 1]) {
                    createToast("Register font is error", error);
                }
            }
        }
    }

    await this.setUserFontData();
    FontSelectorManager.reloadAll();
    fmUserFontManager.updateFontList();
    $("fm-localFontInput").value = "";
},



  async registerWebFont(url = null) {
    const urls = url
      ? [url]
      : $("fm-webFontUrlInput")
        .value.trim()
        .split("\n")
        .filter((url) => url.trim());
    for (const fontUrl of urls) {
      try {
        const fontMatch = fontUrl.match(/family=([^&]+)/);
        if (!fontMatch) throw new Error(i18next.t("error.invalidUrl"));
        const fontName = fontMatch[1].split(":")[0];
        
        if (this.existsFont(fontName)) {
          createToast(getText("alreadyRegisteredFont"), fontName);
          continue;
        }

        await this.loadWebFontStylesheet(fontUrl);
        await fmFontRepository.saveWebFont(fontName, fontUrl);
        this.addFontOption({ name: fontName, type: "web", url: fontUrl });
      } catch (error) {
        console.error(fontUrl, error);
      }
    }
    await this.setUserFontData();
    FontSelectorManager.reloadAll();
    fmUserFontManager.updateFontList();
    if (!url) $("fm-webFontUrlInput").value = "";
  },

  async loadWebFontStylesheet(url) {
    const linkElement = document.createElement("link");
    linkElement.href = url;
    linkElement.rel = "stylesheet";
    return new Promise((resolve, reject) => {
      linkElement.onload = resolve;
      linkElement.onerror = reject;
      document.head.appendChild(linkElement);
    });
  },

  async registerFontFromBuffer(buffer, fontName) {
    if (this.existsFont(fontName)) {
      createToast(getText("alreadyRegisteredFont"), fontName);
      return;
    }

    try {
      const fontFace = new FontFace(fontName, buffer);
      const loadedFont = await fontFace.load();
      document.fonts.add(loadedFont);
      await fmFontRepository.saveUploadedFont(fontName, buffer);
      this.addFontOption({ name: fontName, type: "upload" });
      await this.setUserFontData();
      FontSelectorManager.reloadAll();
      fmUserFontManager.updateFontList();
    } catch (error) {
      console.error(fontName, error);
    }
  },

  async unregisterFont(fontData) {
    // console.log("unregisterFont fontData", JSON.stringify(fontData));
    await fmFontRepository.deleteFont(fontData.value);

    const userFonts = fmFontData["UserFont"].fonts;
    const index = userFonts.findIndex(font => font.name === fontData.value);
    if (index !== -1) {
      userFonts.splice(index, 1);
    }
    FontSelectorManager.reloadAll();
  },

  openUserFontManager() {
    if (!$("fm-fontManagerModal")) {
      fmUserFontManager.createModal();
    }
    $("fm-modalOverlay").style.display = "block";
    $("fm-fontManagerModal").style.display = "block";
    fmUserFontManager.updateFontList();
  },

  closeUserFontManager() {
    $("fm-modalOverlay").style.display = "none";
    $("fm-fontManagerModal").style.display = "none";
  },

  getSelectedFont(id) {
    // console.log("getSelectedFont id", id);
    const currentFont = $("fm-selected-font-" + id).textContent;
    return currentFont;
  },
  
};