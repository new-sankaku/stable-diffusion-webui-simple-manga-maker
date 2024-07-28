function html() {
    return `
<div id="canvas-area">
                <div class="area-header">
                    <span>[Canvas]:</span>
                    <button id="inputImageFile" onclick="inputImageFile()">
                        <span class="material-symbols-outlined">image</span>
                        <input type="file" id="imageInput" multiple style="display: none;" accept="image/*">
                    </button>
                    <button id="zoomIn" onclick="zoomIn()">
                        <span class="material-symbols-outlined">zoom_in</span>
                    </button>
                    <button id="zoomOut" onclick="zoomOut()">
                        <span class="material-symbols-outlined">zoom_out</span>
                    </button>
                    <button id="zoomFit" onclick="zoomFit()">
                        <span class="material-symbols-outlined">1x_mobiledata_badge</span>
                    </button>
                    <button id="clearMode" onclick="operationModeClear()">
                        <span class="material-symbols-outlined">cancel_presentation</span>
                    </button>

                    <label data-i18n="view_layers" style="margin-top: 0px; margin-bottom: 0px;">
                        L
                    </label>
                    <input type="checkbox" id="view_layers_checkbox" checked
                        style="margin-top: 0px; margin-bottom: 0px;">

                    <label data-i18n="view_controles" style="margin-top: 0px; margin-bottom: 0px;">
                        C
                    </label>
                    <input type="checkbox" id="view_controles_checkbox" checked
                        style="margin-top: 0px; margin-bottom: 0px;">


                </div>

                <div id="intro_content" class="content">
                    <div class="resizable-container" id="resizable-container">
                        <div class="canvas-container" id="canvas-container">
                            <canvas id="mangaImageCanvas"></canvas>
                        </div>
                    </div>
                </div>
            </div>
    `;
}
