function rundomPanelCut() {
  var panel = getRandomPanel();
  var maxRetryCount = 1;
  
  if (panel === null) {
    createToastError("Panel is ZERO.");
    console.log("panel is nothing.");
    return;
  }

  var vRandomCount = generateRandomInt($("verticalRandomPanelCount").value);
  var hRandomCount = generateRandomInt($("horizontalRandamPanelCount").value);
  
  // console.log("vRandomCount", vRandomCount);
  // console.log("hRandomCount", hRandomCount);

  try {
    changeDoNotSaveHistory();

    var cuts = [];
    for (var i = 0; i < vRandomCount; i++) cuts.push('vertical');
    for (var i = 0; i < hRandomCount; i++) cuts.push('horizontal');

    cuts.sort(() => Math.random() - 0.5);
    
    var maxRetryCountSum = maxRetryCount * cuts.length;
    var retry = 0;
    
    while (cuts.length > 0) {
      if (retry > maxRetryCountSum) {
        console.log("split retryCount over.");
        return;
      }

      var currentCut = cuts[0];
      var isSplit = blindSplitPanel(panel, currentCut === 'vertical');
      
      if (isSplit) {
        cuts.shift();
        panel = getRandomPanel();
      } else {
        retry++;
      }
    }
  } finally {
    changeDoSaveHistory();
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
  await btmSaveZip();

}
$on($("panelRandamCutButton"), "click", () => rundomPanelCut());
$on($("multiPageGenerate"), "click", () => generateMultipage());