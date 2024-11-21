const btmImageZipMap = new Map();

const btmDrawer = document.getElementById('btm-drawer');
const btmDrawerHandle = document.getElementById('btm-drawer-handle');
const btmImageContainer = document.getElementById('btm-image-container');
const btmScrollLeftBtn = document.getElementById('btm-scroll-left');
const btmScrollRightBtn = document.getElementById('btm-scroll-right');

let btmScrollPosition = 0;
let btmIsDragging = false;


function btmToggleDrawer() {
    btmDrawer.classList.toggle('btm-closed');
    btmUpdateHandleText();
    btmUpdateScrollButtons();
}

function btmCloseDrawer() {
    btmDrawer.classList.add('btm-closed');
    btmUpdateHandleText();
}

function btmUpdateHandleText() {
    btmDrawerHandle.textContent = btmDrawer.classList.contains('btm-closed') ? 'OPEN' : 'CLOSE';
}

async function btmSaveZip() {
    return new Promise((resolve, reject) => {
        try {
            const guid = getCanvasGUID();
            const previewLink = getCropAndDownloadLinkByMultiplier(1, 'jpeg');
            const zip = generateZip();
            
            zip.generateAsync({ type: "blob", compression: "STORE", compressionOptions: {level: 1}
            })
                .then(function (content) {
                    btmAddImage(previewLink, content, guid);
                    resolve();
                })
                .catch(function (error) {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

function btmAddImage(imageLink, zipBlob, guid) {
    const zipData = btmImageZipMap.get(guid);
 
    if (zipData) {
        btmImageZipMap.set(guid, { imageLink, zipBlob });
        const image = document.querySelector(`.btm-image[data-index="${guid}"]`);
        if (image) {
            image.src = imageLink.href;
        }
    } else {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'btm-image-wrapper';
        const image = document.createElement('img');
        image.src = imageLink.href;
        image.className = 'btm-image';
        image.dataset.index = guid;
        image.addEventListener('click', () => {
            if (stateStack.length > 2) {
                btmSaveZip().then(() => {
                });
            }
            chengeCanvasByGuid(guid);
        });
 
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.className = 'btm-close-btn';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            btmImageZipMap.delete(guid);
            imageWrapper.remove();
            btmUpdateScrollButtons();
        });
 
        imageWrapper.appendChild(image);
        imageWrapper.appendChild(closeBtn);
        btmImageContainer.appendChild(imageWrapper);
        btmImageZipMap.set(guid, { imageLink, zipBlob });
    }
 
    if (btmDrawer.classList.contains('btm-closed')) {
        btmToggleDrawer();
    } else {
        btmUpdateScrollButtons();
    }
 }

function btmUpdateScrollButtons() {
    const containerWidth = btmDrawer.querySelector('.btm-drawer-content').offsetWidth;
    const scrollWidth = btmImageContainer.scrollWidth;
    btmScrollLeftBtn.style.display = btmScrollPosition > 0 ? 'block' : 'none';
    btmScrollRightBtn.style.display = scrollWidth > containerWidth && btmScrollPosition < scrollWidth - containerWidth ? 'block' : 'none';
}

function btmScroll(direction) {
    const containerWidth = btmDrawer.querySelector('.btm-drawer-content').offsetWidth;
    btmScrollPosition += direction * containerWidth;
    btmScrollPosition = Math.max(0, Math.min(btmScrollPosition, btmImageContainer.scrollWidth - containerWidth));
    btmImageContainer.style.transform = `translateX(-${btmScrollPosition}px)`;
    btmUpdateScrollButtons();
}

document.addEventListener('DOMContentLoaded', function () {
    btmDrawerHandle.addEventListener('click', btmToggleDrawer);
    btmScrollLeftBtn.addEventListener('click', () => btmScroll(-1));
    btmScrollRightBtn.addEventListener('click', () => btmScroll(1));

    document.addEventListener('mousedown', function (event) {
        if (!btmDrawer.contains(event.target) && !btmDrawer.classList.contains('btm-closed')) {
            btmIsDragging = false;
        }
    });

    document.addEventListener('mouseup', function (event) {
        if (!btmDrawer.contains(event.target) && !btmDrawer.classList.contains('btm-closed') && !btmIsDragging) {
            btmCloseDrawer();
        }
        btmIsDragging = false;
    });

    function btmStartDrag(e) {
        e.preventDefault();
        isDragging = true;
        let startX = e.clientX;
        let scrollLeft = btmScrollPosition;

        function btmDrag(e) {
            const diff = startX - e.clientX;
            btmScrollPosition = scrollLeft + diff;
            btmImageContainer.style.transform = `translateX(-${btmScrollPosition}px)`;
        }

        function btmStopDrag() {
            document.removeEventListener('mousemove', btmDrag);
            document.removeEventListener('mouseup', btmStopDrag);
            const containerWidth = btmDrawer.querySelector('.btm-drawer-content').offsetWidth;
            btmScrollPosition = Math.max(0, Math.min(btmScrollPosition, btmImageContainer.scrollWidth - containerWidth));
            btmImageContainer.style.transform = `translateX(-${btmScrollPosition}px)`;
            btmUpdateScrollButtons();
        }

        document.addEventListener('mousemove', btmDrag);
        document.addEventListener('mouseup', btmStopDrag);
    }

    btmImageContainer.addEventListener('mousedown', btmStartDrag);
    window.addEventListener('resize', btmUpdateScrollButtons);
});


async function chengeCanvasByGuid(guid){
    const zipData = btmImageZipMap.get(guid);
    try {
        const zip = await JSZip.loadAsync(zipData.zipBlob);
        await loadZip(zip, guid);
    } catch (error) {
        console.error("Error loading ZIP:", error);
        throw error;
    }
}


//return [string, string]
function btmGetGuids() {
    return Array.from(btmImageZipMap.keys());
}

//return number
function btmGetGuidIndex(targetGuid) {
    const guids = Array.from(btmImageZipMap.keys());
    return guids.indexOf(targetGuid);
}

//return number
function btmGetGuidsSize() {
    return btmImageZipMap.size;
}

//return guid
function btmGetGuidByIndex(index) {
    const guids = Array.from(btmImageZipMap.keys());
    return guids[index];
}

function btmGetFirstGuidByIndex() {
    return Array.from(btmImageZipMap.keys())[0];
 }