async function xxxxx() {
  const loading = OP_showLoading({
    icon: 'process',step: 'Step1',substep: 'Ink up',progress: 0
  });

  try {
      OP_updateLoadingState(loading, {
        icon: 'process',step: 'Step2',substep: 'Brightness Contrast',progress: 50
      });

      OP_updateLoadingState(loading, {
        icon: 'save',step: 'Step3',substep: 'Dot',progress: 100
      });
  } finally {
    OP_hideLoading(loading);
  }
}
