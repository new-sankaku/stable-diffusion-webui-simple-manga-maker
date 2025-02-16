async function autoMultiGenerate(){
  let guidList = btmGetGuids();
  for (const [index, guid] of guidList.entries()) {
    await chengeCanvasByGuid(guid);
    let panelList = getPanelObjectList();
    panelList.forEach((panel, panelIndex) =>{
      var spinner = createSpinner(canvasMenuIndex);
      T2I( panel, spinner );
    });
    while(true){
      if( existsWaitQueue() ){
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }else{
        break;
      }
    }
    await btmSaveZip();
  }
}
