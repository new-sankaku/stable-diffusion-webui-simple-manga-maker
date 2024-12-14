async function autoMultiGenerate(){
  let onePanelNumber = $("onePanelGenerateNumber");
  let guidList = btmGetGuids();
  for (const [index, guid] of guidList.entries()) {
    await chengeCanvasByGuid(guid);

    const promises = [];
    let panelList = getPanelObjectList();
    panelList.slice(0, onePanelNumber).forEach((panel, panelIndex) => {
      var spinner = createSpinner(canvasMenuIndex);
      promises.push(T2I(panel, spinner));
    });
    await Promise.all(promises);

    while(true){
      if(existsWaitQueue()){
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }else{
        break;
      }
    }
    await btmSaveZip();
  }
}