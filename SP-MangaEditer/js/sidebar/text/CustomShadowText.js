let t2_shadow_textSvg,
  t2_shadow_defs,
  t2_shadow_filter,
  t2_shadow_primaryShadowFlood,
  t2_shadow_secondaryShadowFlood,
  t2_shadow_mainText;

var nowT2ShadowStr = null;

function createFeMergeNode(inValue) {
  const feMergeNode = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feMergeNode"
  );
  feMergeNode.setAttribute("in", inValue);
  return feMergeNode;
}

function t2_shadow_deleteSvg() {
  t2_shadow_textSvg = null;
  t2_shadow_defs = null;
  t2_shadow_filter = null;
  t2_shadow_primaryShadowFlood = null;
  t2_shadow_secondaryShadowFlood = null;
  t2_shadow_mainText = null;
  nowT2ShadowStr = null;
}

function t2_shadow_createSvg(left=50, top=100) {
  t2_shadow_textSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  t2_shadow_textSvg.setAttribute("id", "t2_shadow_textSvg");
  t2_shadow_textSvg.setAttribute("width", "600");
  t2_shadow_textSvg.setAttribute("height", "300");
  t2_shadow_textSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  t2_shadow_textSvg.setAttribute("xml:space", "preserve");
  t2_shadow_textSvg.style.position = 'absolute';
  t2_shadow_textSvg.style.visibility = 'visible';
  
  t2_shadow_defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  
  t2_shadow_filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  t2_shadow_filter.setAttribute("id", "t2_shadow_dualShadow");
  t2_shadow_filter.setAttribute("x", "-50%");
  t2_shadow_filter.setAttribute("y", "-50%");
  t2_shadow_filter.setAttribute("width", "200%");
  t2_shadow_filter.setAttribute("height", "200%");
  
  const feMorphology = document.createElementNS("http://www.w3.org/2000/svg", "feMorphology");
  feMorphology.setAttribute("in", "SourceAlpha");
  feMorphology.setAttribute("operator", "dilate");
  feMorphology.setAttribute("radius", "2");
  feMorphology.setAttribute("result", "expand");
  t2_shadow_filter.appendChild(feMorphology);
  
  for (let i = 1; i <= 3; i++) {
    const feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
    feOffset.setAttribute("in", "expand");
    feOffset.setAttribute("dx", i);
    feOffset.setAttribute("dy", i);
    feOffset.setAttribute("result", `primaryShadow_${i}`);
    t2_shadow_filter.appendChild(feOffset);
  }
  
  const feMergePrimary = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
  feMergePrimary.setAttribute("result", "primaryShadow");
  feMergePrimary.appendChild(createFeMergeNode("expand"));
  for (let i = 1; i <= 3; i++) {
    feMergePrimary.appendChild(createFeMergeNode(`primaryShadow_${i}`));
  }
  t2_shadow_filter.appendChild(feMergePrimary);
  
  t2_shadow_primaryShadowFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
  t2_shadow_primaryShadowFlood.setAttribute("id", "t2_shadow_primaryShadowFlood");
  t2_shadow_primaryShadowFlood.setAttribute("flood-color", "#ebe7e0");
  t2_shadow_filter.appendChild(t2_shadow_primaryShadowFlood);
  
  const feCompositePrimary = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
  feCompositePrimary.setAttribute("in2", "primaryShadow");
  feCompositePrimary.setAttribute("operator", "in");
  feCompositePrimary.setAttribute("result", "primaryShadow");
  t2_shadow_filter.appendChild(feCompositePrimary);
  
  const feMorphologySecondary = document.createElementNS("http://www.w3.org/2000/svg", "feMorphology");
  feMorphologySecondary.setAttribute("in", "primaryShadow");
  feMorphologySecondary.setAttribute("operator", "dilate");
  feMorphologySecondary.setAttribute("radius", "1");
  feMorphologySecondary.setAttribute("result", "secondaryShadowBase");
  t2_shadow_filter.appendChild(feMorphologySecondary);
  
  for (let i = 1; i <= 5; i++) {
    const feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
    feOffset.setAttribute("in", "secondaryShadowBase");
    feOffset.setAttribute("dx", i);
    feOffset.setAttribute("dy", i);
    feOffset.setAttribute("result", `secondaryShadow_${i}`);
    t2_shadow_filter.appendChild(feOffset);
  }
  
  const feMergeSecondary = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
  feMergeSecondary.setAttribute("result", "secondaryShadow");
  feMergeSecondary.appendChild(createFeMergeNode("secondaryShadowBase"));
  for (let i = 1; i <= 5; i++) {
    feMergeSecondary.appendChild(createFeMergeNode(`secondaryShadow_${i}`));
  }
  t2_shadow_filter.appendChild(feMergeSecondary);
  
  t2_shadow_secondaryShadowFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
  t2_shadow_secondaryShadowFlood.setAttribute("id", "t2_shadow_secondaryShadowFlood");
  t2_shadow_secondaryShadowFlood.setAttribute("flood-color", "#35322a");
  t2_shadow_filter.appendChild(t2_shadow_secondaryShadowFlood);
  
  const feCompositeSecondary = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
  feCompositeSecondary.setAttribute("in2", "secondaryShadow");
  feCompositeSecondary.setAttribute("operator", "in");
  feCompositeSecondary.setAttribute("result", "secondaryShadow");
  t2_shadow_filter.appendChild(feCompositeSecondary);
  
  const feMergeFinal = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
  feMergeFinal.appendChild(createFeMergeNode("secondaryShadow"));
  feMergeFinal.appendChild(createFeMergeNode("primaryShadow"));
  feMergeFinal.appendChild(createFeMergeNode("SourceGraphic"));
  t2_shadow_filter.appendChild(feMergeFinal);
  
  t2_shadow_defs.appendChild(t2_shadow_filter);
  
  t2_shadow_textSvg.appendChild(t2_shadow_defs);
  
  t2_shadow_mainText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t2_shadow_mainText.setAttribute("id", "t2_shadow_mainText");
  t2_shadow_mainText.setAttribute("filter", "url(#t2_shadow_dualShadow)");
  t2_shadow_mainText.setAttribute("xml:space", "preserve");
  
  t2_shadow_textSvg.appendChild(t2_shadow_mainText);
  
  document.body.appendChild(t2_shadow_textSvg);
  
  t2_shadow_updateText();
  
  document.body.removeChild(t2_shadow_textSvg);
  
  t2_shadow_addSvg(left, top);
}

function t2_shadow_updateText() {
  const t2_shadow_lines = t2_text.value.split("\n");
  
  t2_shadow_mainText.innerHTML = "";
  const t2_shadow_fontSize = parseFloat(t2_fontSize.value);
  const t2_shadow_lineHeight = parseFloat(t2_lineHeight.value);
  let t2_shadow_totalHeight = 0;
  
  if (nowT2Orientation === "vertical") {
    t2_shadow_mainText.setAttribute("writing-mode", "vertical-rl");
    t2_shadow_mainText.setAttribute("dominant-baseline", "ideographic");
    t2_shadow_mainText.setAttribute("glyph-orientation-vertical", "0");
    t2_shadow_mainText.setAttribute("text-orientation", "upright"); 
    t2_shadow_mainText.removeAttribute("text-anchor");
    t2_shadow_mainText.setAttribute("style", `
      font-size: ${t2_fontSize.value}px;
      fill: ${t2_fillColor.value};
      fill-opacity: ${t2_fillOpacity.value};
      letter-spacing: ${t2_letterSpacing.value}em;
      font-family: "${t2_fontT2Selector.value}", "Noto Sans JP", "Yu Gothic", sans-serif;
      writing-mode: vertical-rl;
      text-orientation: upright;
      glyph-orientation-vertical: 0;
      dominant-baseline: ideographic;
    `);
  
    t2_shadow_lines.forEach((t2_shadow_line, t2_shadow_index) => {
      const t2_shadow_tspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan"
      );
      t2_shadow_tspan.textContent = t2_shadow_line;
      t2_shadow_tspan.setAttribute("y", "0");
      t2_shadow_tspan.setAttribute("x", `${-t2_shadow_totalHeight}px`);
      t2_shadow_mainText.appendChild(t2_shadow_tspan);
      t2_shadow_totalHeight += t2_shadow_fontSize * t2_shadow_lineHeight;
    });
  } else {
    t2_shadow_mainText.removeAttribute("writing-mode");
    t2_shadow_mainText.setAttribute("dominant-baseline", "hanging");
    t2_shadow_mainText.setAttribute("text-anchor", nowT2Aligin);
    t2_shadow_mainText.setAttribute("style", `font-family: "${t2_fontT2Selector.value}", "Noto Sans JP", "Yu Gothic", sans-serif;`);
    t2_shadow_lines.forEach((t2_shadow_line, t2_shadow_index) => {
      const t2_shadow_tspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan"
      );
      t2_shadow_tspan.textContent = t2_shadow_line;
      t2_shadow_tspan.setAttribute("x", "0");
      t2_shadow_tspan.setAttribute(
        "dy",
        t2_shadow_index === 0 ? "0" : `${t2_shadow_lineHeight}em`
      );
      t2_shadow_mainText.appendChild(t2_shadow_tspan);
    });
  }
  t2_shadow_updateStyles();
}

function t2_shadow_updateStyles() {
  t2_shadow_mainText.style.fontSize = `${t2_fontSize.value}px`;
  t2_shadow_mainText.style.fill = t2_fillColor.value;
  t2_shadow_mainText.style.fillOpacity = t2_fillOpacity.value;
  t2_shadow_mainText.style.letterSpacing = `${t2_letterSpacing.value}em`;
  
  if (t2_shadow_primaryShadowFlood) {
    t2_shadow_primaryShadowFlood.setAttribute(
      "flood-opacity",
      t2_shadow1Opacity.value
    );
    t2_shadow_primaryShadowFlood.setAttribute(
      "flood-color",
      t2_shadow1Color.value
    );
  }
  if (t2_shadow_secondaryShadowFlood) {
    t2_shadow_secondaryShadowFlood.setAttribute(
      "flood-opacity",
      t2_shadow2Opacity.value
    );
    t2_shadow_secondaryShadowFlood.setAttribute(
      "flood-color",
      t2_shadow2Color.value
    );
  }
  
  const t2_shadow_filter = document.querySelector("#t2_shadow_dualShadow");
  if (t2_shadow_filter) {
    t2_shadow_filter
      .querySelectorAll('feOffset[result^="primaryShadow_"]')
      .forEach((t2_shadow_offset, t2_shadow_index) => {
        const t2_shadow_value = Math.min(
          t2_shadow_index + 1,
          parseFloat(t2_shadow1Size.value) || 1
        );
        t2_shadow_offset.setAttribute("dx", t2_shadow_value);
        t2_shadow_offset.setAttribute("dy", t2_shadow_value);
      });
    
    t2_shadow_filter
      .querySelectorAll('feOffset[result^="secondaryShadow_"]')
      .forEach((t2_shadow_offset, t2_shadow_index) => {
        const t2_shadow_value = Math.min(
          t2_shadow_index + 1,
          parseFloat(t2_shadow2Size.value) || 1
        );
        t2_shadow_offset.setAttribute("dx", t2_shadow_value);
        t2_shadow_offset.setAttribute("dy", t2_shadow_value);
      });
  }
  
  t2_shadow_updateSvgSize();
}

function t2_shadow_updateSvgSize() {

  // const err = new Error();
  // console.log("t2_shadow_updateSvgSize", err.stack);

  try {
    const t2_shadow_bbox = t2_shadow_mainText.getBBox();
    const t2_shadow_maxShadowSize = Math.max(
      parseFloat(t2_shadow1Size.value) || 1,
      parseFloat(t2_shadow2Size.value) || 1
    );

    const t2_shadow_fontSize = parseFloat(t2_fontSize.value) || 40;
    
    let t2_shadow_x, t2_shadow_y, t2_shadow_width, t2_shadow_height;
    if (nowT2Orientation === "vertical") {
      t2_shadow_x = t2_shadow_bbox.x - t2_shadow_maxShadowSize;
      t2_shadow_y = t2_shadow_bbox.y - t2_shadow_maxShadowSize;
      t2_shadow_width = t2_shadow_bbox.width + 2 * t2_shadow_maxShadowSize + t2_shadow_fontSize;
      t2_shadow_height = t2_shadow_bbox.height + 2 * t2_shadow_maxShadowSize;
    } else {
      t2_shadow_x = t2_shadow_bbox.x - t2_shadow_maxShadowSize;
      t2_shadow_y = t2_shadow_bbox.y - t2_shadow_maxShadowSize;
      t2_shadow_width = t2_shadow_bbox.width + 2 * t2_shadow_maxShadowSize + t2_shadow_fontSize;
      t2_shadow_height = t2_shadow_bbox.height + 2 * t2_shadow_maxShadowSize;
    }

    // console.log("-------");
    // console.log("t2_shadow1Size.value   ", t2_shadow1Size.value);
    // console.log("t2_shadow2Size.value   ", t2_shadow2Size.value);
    // console.log("t2_shadow_maxShadowSize", t2_shadow_maxShadowSize);
    // console.log("t2_shadow_fontSize     ", t2_shadow_fontSize);
    // console.log("t2_shadow_x            ", t2_shadow_x);
    // console.log("t2_shadow_y            ", t2_shadow_y);
    // console.log("t2_shadow_width        ", t2_shadow_width);
    // console.log("t2_shadow_height       ", t2_shadow_height);

    
    t2_shadow_textSvg.setAttribute(
      "viewBox",
      `${t2_shadow_x} ${t2_shadow_y} ${t2_shadow_width} ${t2_shadow_height}`
    );
    t2_shadow_textSvg.setAttribute("width", t2_shadow_width);
    t2_shadow_textSvg.setAttribute("height", t2_shadow_height);
  } catch (error) {}
}

function t2_shadow_addSvg(left, top) {
  // console.log("t2_shadow_addSvg start");
  const svgString = new XMLSerializer().serializeToString(t2_shadow_textSvg);
  
  var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  
  var reader = new FileReader();
  reader.onload = function (f) {
    var data = f.target.result;
    
    fabric.Image.fromURL(data, function (img) {
      img.left = left;
      img.top = top;
      nowT2ShadowStr = img;
      
      // console.log("t2_shadow_addSvg canvas.add");
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
  };
  
  reader.readAsDataURL(svgBlob);
}

function t2_shadow_updateAll() {
  // console.log("t2_shadow_updateAll start");

  var t2Left = 50;
  var t2Top  = 100;
  if (nowT2ShadowStr) {
    t2Left = nowT2ShadowStr.left;
    t2Top  = nowT2ShadowStr.top;
    // console.log("nowT2ShadowStr is not null");
    canvas.remove(nowT2ShadowStr);
    canvas.renderAll();
    nowT2ShadowStr = null;
  }

  t2_shadow_deleteSvg();
  t2_shadow_createSvg(t2Left, t2Top);
  // t2_shadow_addSvg();
}
