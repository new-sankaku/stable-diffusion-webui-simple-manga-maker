function html() {
    return `
<div id="layer-panel">
                <div class="area-header" data-i18n="layers">Layers</div>
                <div id="layer-content"></div>
                <div id="layer-buttons">
                    <button onclick="LayersUp()"><i class="material-icons">arrow_upward</i></button>
                    <button onclick="LayersDown()"><i class="material-icons">arrow_downward</i></button>
                    <button onclick="openText2ImageBaseFloatingWindow()"><i class="material-icons">settings</i> <span
                            data-i18n="baseT2I">Base T2I</span></button>
                    <button onclick="View()"><i class="material-icons">visibility</i><span
                            data-i18n="promptView">View</span></button>
                </div>
                <div id="canvas-buttons">
                    <button id="undo" onclick="undo()">
                        <i class="material-icons">undo</i>
                    </button>
                    <button id="redo" onclick="redo()">
                        <i class="material-icons">redo</i>
                    </button>
                    <button id="cropMode">
                        <i class="material-icons">crop_free</i>
                    </button>
                    <button id="crop" anim="glow">
                        <i class="material-icons">crop</i>
                    </button>

                </div>
            </div>
    `;
}
