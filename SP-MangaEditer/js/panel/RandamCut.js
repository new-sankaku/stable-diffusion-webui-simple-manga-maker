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

$on($("panelRandamCutButton"), "click", () => rundomPanelCut());
