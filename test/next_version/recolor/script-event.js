const loadImages = async (files) => {
    $('preview-container').innerHTML = '';
    imageStates.clear();
    for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) {
    alert(`${file.name}は画像ファイルではありません`);
    continue;
    }
    const processor = new ImageProcessor(file, i);
    imageStates.set(processor.id, processor);
    await processor.loadImage();
    }
    };
    
    const processAllImages = () => {
    imageStates.forEach(processor => processor.processImage());
    };
    
    const debounceProcess = (() => {
    let timer;
    return () => {
    clearTimeout(timer);
    timer = setTimeout(processAllImages, 300);
    };
    })();
    
    const setHueRange = (baseHue) => {
    const range = 60;
    let min = baseHue - range;
    let max = baseHue + range;
    if (min < 0) min += 360;
    if (max > 360) max = max % 360;
    $('h1').value = min;
    $('h2').value = max;
    updateValue('h1');
    updateValue('h2');
    debounceProcess();
    };
    
    const dropZone = $('dropZone');
    on(dropZone, 'dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
    });
    
    on(dropZone, 'dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    });
    
    on(dropZone, 'drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    loadImages(e.dataTransfer.files);
    });
    
    on($('i'), 'change', e => loadImages(e.target.files));
    
    ['h1', 'h2', 's1', 's2', 'l1', 'l2', 'blend'].forEach(id => {
    const el = $(id);
    on(el, 'input', () => {
    updateValue(id);
    debounceProcess();
    });
    });
    
    on($('c'), 'input', debounceProcess);
    
    on(window, 'resize', () => {
    imageStates.forEach(processor => processor.resizeCanvas());
    });
    
    const samples = $('samples');
    samples.querySelectorAll('.color-sample').forEach(sample => {
    on(sample, 'click', () => {
    const hue = parseInt(sample.dataset.hue);
    samples.querySelectorAll('.color-sample').forEach(s => s.classList.remove('selected'));
    sample.classList.add('selected');
    setHueRange(hue);
    });
    });