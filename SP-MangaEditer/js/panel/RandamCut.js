function rundomPanelCut() {
  var panel = getRandomPanel();
  var maxRetryCount = 1;
  if (panel !== null) {
    var vRandomCount = $("verticalRandomPanelCount").value;
    var hRandomCount = $("horizontalRandamPanelCount").value;
    vRandomCount = generateRandomInt(vRandomCount);
    hRandomCount = generateRandomInt(hRandomCount);
    
    console.log("vRandomCount", vRandomCount);
    console.log("hRandomCount", hRandomCount);

    try {
      changeDoNotSaveHistory();

      var maxRetryCountSum = maxRetryCount * (vRandomCount + hRandomCount);
      var retry = 0;
      while (vRandomCount > 0 || hRandomCount > 0) {
        if (retry > maxRetryCountSum) {
          console.log("split retryCount over.");
          return;
        }

        if (vRandomCount > 0) {
          var isSplit = blindSplitPanel(panel, true);
          if (isSplit) {
            vRandomCount--;
            panel = getRandomPanel();
          } else {
            retry++;
          }
        }
        if (hRandomCount > 0) {
          var isSplit = blindSplitPanel(panel, false);
          if (isSplit) {
            panel = getRandomPanel();
            hRandomCount--;
          } else {
            retry++;
          }
        }
      }
    } finally {
      changeDoSaveHistory();
    }
  } else {
    createToastError("Panel is ZERO.");
    console.log("panel is nothing.");
  }
}






async function generateMultipage(){
  const pageCount = $("pageCount").value;
  var newPage = false;
  const selectedValue = getSelectedValueByGroup("multiPageType");
  for (let page = 1; page <= pageCount; page++) {
    if( selectedValue === 'mA4H' ){
      await loadBookSize(210,297,true,newPage);
      rundomPanelCut();
    }
    if( selectedValue === 'mA4V' ){
      await loadBookSize(297,210,true,newPage);
      rundomPanelCut();
    }
    if( selectedValue === 'mB4H' ){
      await loadBookSize(257,364,true,newPage);
      rundomPanelCut();
    }
    if( selectedValue === 'mB4H' ){
      await loadBookSize(364,257,true,newPage);
      rundomPanelCut();
    }
    newPage = true;
  }
}
$on($("panelRandamCutButton"), "click", () => rundomPanelCut());
$on($("multiPageGenerate"), "click", () => generateMultipage());