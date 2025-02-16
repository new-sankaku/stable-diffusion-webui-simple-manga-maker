async function autoMultiGenerate() {
  let onePanelNumber = $("onePanelGenerateNumber").value;

  let guidList = btmGetGuids();
  for (const [index, guid] of guidList.entries()) {
   await chengeCanvasByGuid(guid);
 
   for (let i = 0; i < onePanelNumber; i++) {
    const promises = [];
    let panelList = getPanelObjectList();
    
    panelList.forEach((panel, panelIndex) => {
     var spinner = createSpinner(canvasMenuIndex);
     promises.push(T2I(panel, spinner));
    });
    
    await Promise.all(promises);
 
    while (true) {
     if (existsWaitQueue()) {
      await new Promise((r) => setTimeout(r, 2000));
      continue;
     } else {
      break;
     }
    }
    
   }
 
   await btmSaveProjectFile();
  }
 }