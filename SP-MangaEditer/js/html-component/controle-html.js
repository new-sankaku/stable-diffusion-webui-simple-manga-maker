function html() {
    return `
<div id="controls">

                <div class="panel" id="infomationPanel">
                    <div class="area-header" onclick="imageControleTogglePanel('infomationPanel', this)"
                        data-i18n="informationControls">
                        ▼ Infomation Controls
                    </div>
                    <div class="control-content">
                        <div class="control-item">
                            <label>
                                <input type="checkbox" id="InfomationFPS" checked>
                                FPS :0
                            </label>
                        </div>
                        <div class="control-item">
                            <label>
                                <input type="checkbox" id="InfomationCoordinate" checked>
                                X:0.0 Y:0.0
                            </label>
                        </div>
                        <div id="intro_SD_WebUI_pingCheck_Label" class="control-item A1111_api_content">
                            <label id="SD_WebUI_pingCheck_Label">
                                <input type="checkbox" id="apiHeartbeatCheckbox" checked>
                                AI Check
                            </label>
                        </div>
                        <div class="control-item">
                            <label id="SD_WebUI_Heartbeat_Label">SD WebUI Check…</label>
                            <!--TODO COMFYUI-->
                            <label id="ComufyUI_Heartbeat_Label" style="display: none;">ComufyUI Check…</label>
                        </div>
                    </div>
                </div>


                <div class="panel" id="commonControlsPanel">
                    <div class="area-header" onclick="imageControleTogglePanel('commonControlsPanel', this)"
                        data-i18n="commonControls">
                        ▼ Common Controls
                    </div>
                    <div class="control-content">
                        <div class="control-row">
                            <label data-i18n="angle">Angle</label>
                            <input type="range" id="angle-control" min="0" max="360" value="0">
                            <span id="angleValue">0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="scale">Scale</label>
                            <input type="range" id="scale-control" min="0.01" max="2.5" step="0.01" value="1">
                            <span id="scaleValue">1.0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="top">Top</label>
                            <input type="range" id="top-control" min="-300" max="600" value="100">
                            <span id="topValue">100</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="left">Left</label>
                            <input type="range" id="left-control" min="-300" max="600" value="100">
                            <span id="leftValue">100</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="skewX">SkewX</label>
                            <input type="range" id="skewX-control" min="-60" max="60" value="0">
                            <span id="skewXValue">0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="skewY">SkewY</label>
                            <input type="range" id="skewY-control" min="-60" max="60" value="0">
                            <span id="skewYValue">0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="opacity">Opacity</label>
                            <input type="range" id="opacity-control" name="opacity-control" min="0" max="100" step="0.1"
                                value="100">
                            <span id="opacityValue">0</span>
                        </div>
                    </div>
                </div>
                <div class="panel" id="imageControlPanel">
                    <div class="area-header" onclick="imageControleTogglePanel('imageControlPanel', this)"
                        data-i18n="imageControls">
                        ▼ Fast Image Effect
                    </div>
                    <div class="control-content">
                        <div class="control-row">
                            <button onclick="flipHorizontally()"><i class="material-icons">swap_horiz</i> <span
                                    data-i18n="flip">Flip</span></button>
                            <button onclick="flipVertically()"><i class="material-icons">swap_vert</i> <span
                                    data-i18n="flip">Flip</span></button>
                        </div>
                        <hr class="separator">


                        <!-- addGlowButton -> addGlowEffect -->
                        <div class="control-item">
                            <input type="checkbox" id="addGlowEffectCheckBox">
                            <label data-i18n="outloneGlow">
                                Outlone Glow
                            </label>
                        </div>
                        <div class="control-row">
                            <label data-i18n="glowOutLineSize">Size</label>
                            <input type="range" id="glowOutLineSlider" min="0" max="250" value="20">
                            <span id="glowOutLineValue">20</span>
                        </div>
                        <div class="control-row">
                            <label for="glowOutLineColorPicker" data-i18n="glowOutLineColor">Color </label>
                            <input type="color" id="glowOutLineColorPicker" value="#FFFFFF">
                        </div>

                        <hr class="separator">
                        <div class="control-item">
                            <input type="checkbox" id="sepiaEffect">
                            <label data-i18n="sepia">
                                Sepia
                            </label>
                        </div>
                        <hr class="separator">
                        <div class="control-item">
                            <input type="checkbox" id="grayscaleEffect">
                            <label data-i18n="grayscale">
                                Grayscale
                            </label>
                        </div>
                        <div class="control-item radio-options" id="grayscaleOptions">
                            <input type="radio" name="grayscaleMode" value="average" checked>
                            <label data-i18n="average">
                                Average
                            </label>

                            <input type="radio" name="grayscaleMode" value="luminosity">
                            <label data-i18n="luminosity">
                                Luminosity
                            </label>
                        </div>
                        <hr class="separator">
                        <div class="control-row">
                            <label data-i18n="red">Red</label>
                            <input type="range" id="gammaRed" min="0" max="2.2" step="0.003921" value="1">
                            <span id="gammaRedValue">1.0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="green">Green</label>
                            <input type="range" id="gammaGreen" min="0" max="2.2" step="0.003921" value="1">
                            <span id="gammaGreenValue">1.0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="blue">Blue</label>
                            <input type="range" id="gammaBlue" min="0" max="2.2" step="0.003921" value="1">
                            <span id="gammaBlueValue">1.0</span>
                        </div>
                        <hr class="separator">
                        <div class="control-row">
                            <label data-i18n="vibrance">Vibrance</label>
                            <input type="range" id="vibranceValue" min="-1" max="1" step="0.003921" value="0">
                            <span id="vibranceValueDisplay">0.0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="blur">Blur</label>
                            <input type="range" id="blurValue" min="0" max="0.3" step="0.003921" value="0">
                            <span id="blurValueDisplay">0.0</span>
                        </div>
                        <div class="control-row">
                            <label data-i18n="pixelate">Pixelate</label>
                            <input type="range" id="pixelateValue" min="1" max="20" step="1" value="1">
                            <span id="pixelateValueDisplay">1</span>
                        </div>
                    </div>
                </div>

                <div class="panel" id="glfxImageControlPanel">
                    <div class="area-header" onclick="imageControleTogglePanel('glfxImageControlPanel', this)"
                        data-i18n="glfxImageControls">
                        ▼ <span data-i18n="glfxImageControls">Glfx Image Controls</span>
                    </div>
                    <div class="control-content glfxControls">
                        <select id="glfxFilter">
                            <option value="" data-i18n="select">Select</option>
                            <option value="glfxBrightnessContrast" data-i18n="brightnessContrast">Brightness / Contrast
                            </option>
                            <option value="glfxHueSaturation" data-i18n="hueSaturation">Hue / Saturation</option>
                            <option value="glfxSepia" data-i18n="sepia">Sepia</option>
                            <option value="glfxUnsharpMask" data-i18n="unsharpMask">Unsharp Mask</option>
                            <option value="glfxVibrance" data-i18n="vibrance">Vibrance</option>
                            <option value="glfxVignette" data-i18n="vignette">Vignette</option>
                            <option value="glfxLensBlur" data-i18n="lensBlur">Lens Blur</option>
                            <!-- <option value="glfxTiltShift" data-i18n="tiltShift">Tilt Shift</option> -->
                            <option value="glfxTriangleBlur" data-i18n="triangleBlur">Triangle Blur</option>
                            <option value="glfxZoomBlur" data-i18n="zoomBlur">Zoom Blur</option>
                            <option value="glfxColorHalftone" data-i18n="colorHalftone">Color Halftone</option>
                            <option value="glfxDotScreen" data-i18n="dotScreen">Dot Screen</option>
                            <option value="glfxEdgeWork" data-i18n="edgeWork">Edge Work</option>
                            <option value="glfxHexagonalPixelate" data-i18n="hexagonalPixelate">Hexagonal Pixelate
                            </option>
                            <option value="glfxInk" data-i18n="ink">Ink</option>
                            <!-- <option value="glfxBulgePinch" data-i18n="bulgePinch">Bulge / Pinch</option> -->
                            <option value="glfxSwirl" data-i18n="swirl">Swirl</option>
                        </select>


                        <div id="glfxBrightnessContrast" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxBrightness" data-i18n="brightness">Brightness:</label>
                                <input type="range" id="glfxBrightness" min="-1" max="1" step="0.01" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxContrast" data-i18n="contrast">Contrast:</label>
                                <input type="range" id="glfxContrast" min="-1" max="1" step="0.01" value="0">
                            </div>
                        </div>

                        <div id="glfxHueSaturation" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxHue" data-i18n="hue">Hue:</label>
                                <input type="range" id="glfxHue" min="-1" max="1" step="0.01" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxSaturation" data-i18n="saturation">Saturation:</label>
                                <input type="range" id="glfxSaturation" min="-1" max="1" step="0.01" value="0">
                            </div>
                        </div>

                        <div id="glfxSepia" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxSepiaAmount" data-i18n="sepia">Sepia:</label>
                                <input type="range" id="glfxSepiaAmount" min="0" max="1" step="0.01" value="0">
                            </div>
                        </div>

                        <div id="glfxUnsharpMask" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxUnsharpRadius" data-i18n="radius">Radius:</label>
                                <input type="range" id="glfxUnsharpRadius" min="0" max="200" step="0.1" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxUnsharpStrength" data-i18n="strength">Strength:</label>
                                <input type="range" id="glfxUnsharpStrength" min="0" max="5" step="0.1" value="0">
                            </div>
                        </div>

                        <div id="glfxVibrance" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxVibranceAmount" data-i18n="vibrance">Vibrance:</label>
                                <input type="range" id="glfxVibranceAmount" min="-1" max="1" step="0.01" value="0">
                            </div>
                        </div>

                        <div id="glfxVignette" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxVignetteSize" data-i18n="size">Size:</label>
                                <input type="range" id="glfxVignetteSize" min="0" max="1" step="0.01" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxVignetteAmount" data-i18n="amount">Amount:</label>
                                <input type="range" id="glfxVignetteAmount" min="0" max="1" step="0.01" value="0">
                            </div>
                        </div>

                        <div id="glfxLensBlur" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxBlurRadius" data-i18n="radius">Radius:</label>
                                <input type="range" id="glfxBlurRadius" min="0" max="50" step="1" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxBlurBrightness" data-i18n="brightness">Brightness:</label>
                                <input type="range" id="glfxBlurBrightness" min="-1" max="1" step="0.01" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxBlurAngle" data-i18n="angle">Angle:</label>
                                <input type="range" id="glfxBlurAngle" min="-3.14" max="3.14" step="0.01" value="0">
                            </div>
                        </div>

                        <div id="glfxTiltShift" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxStartX" data-i18n="startX">Start X:</label>
                                <input type="range" id="glfxStartX" min="0" max="1" step="0.01" value="0.5">
                            </div>
                            <div class="control-row">
                                <label for="glfxStartY" data-i18n="startY">Start Y:</label>
                                <input type="range" id="glfxStartY" min="0" max="1" step="0.01" value="0.5">
                            </div>
                            <div class="control-row">
                                <label for="glfxEndX" data-i18n="endX">End X:</label>
                                <input type="range" id="glfxEndX" min="0" max="1" step="0.01" value="0.5">
                            </div>
                            <div class="control-row">
                                <label for="glfxEndY" data-i18n="endY">End Y:</label>
                                <input type="range" id="glfxEndY" min="0" max="1" step="0.01" value="0.5">
                            </div>
                            <div class="control-row">
                                <label for="glfxTiltBlurRadius" data-i18n="blurRadius">Blur Radius:</label>
                                <input type="range" id="glfxTiltBlurRadius" min="0" max="50" step="0.01" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxGradientRadius" data-i18n="gradientRadius">Gradient Radius:</label>
                                <input type="range" id="glfxGradientRadius" min="0" max="1" step="0.01" value="0.5">
                            </div>
                        </div>

                        <div id="glfxTriangleBlur" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxTriangleRadius" data-i18n="radius">Radius:</label>
                                <input type="range" id="glfxTriangleRadius" min="0" max="200" step="1" value="0">
                            </div>
                        </div>

                        <div id="glfxZoomBlur" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxZoomCenterX" data-i18n="centerX">Center X:</label>
                                <input type="range" id="glfxZoomCenterX" min="0" max="1024" step="0.01" value="0.5">
                            </div>
                            <div class="control-row">
                                <label for="glfxZoomCenterY" data-i18n="centerY">Center Y:</label>
                                <input type="range" id="glfxZoomCenterY" min="0" max="1024" step="0.01" value="0.5">
                            </div>
                            <div class="control-row">
                                <label for="glfxZoomStrength" data-i18n="strength">Strength:</label>
                                <input type="range" id="glfxZoomStrength" min="0" max="1" step="0.01" value="0">
                            </div>
                        </div>

                        <div id="glfxColorHalftone" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxHalftoneAngle" data-i18n="angle">Angle:</label>
                                <input type="range" id="glfxHalftoneAngle" min="0" max="6.28" step="0.1" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxHalftoneSize" data-i18n="size">Size:</label>
                                <input type="range" id="glfxHalftoneSize" min="1" max="100" step="1" value="10">
                            </div>
                        </div>

                        <div id="glfxDotScreen" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxDotAngle" data-i18n="angle">Angle:</label>
                                <input type="range" id="glfxDotAngle" min="0" max="6.28" step="0.1" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxDotSize" data-i18n="size">Size:</label>
                                <input type="range" id="glfxDotSize" min="1" max="100" step="1" value="10">
                            </div>
                        </div>

                        <div id="glfxEdgeWork" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxEdgeRadius" data-i18n="radius">Radius:</label>
                                <input type="range" id="glfxEdgeRadius" min="0" max="10" step="0.1" value="0">
                            </div>
                        </div>

                        <div id="glfxHexagonalPixelate" class="glfxCcontrol-group">

                            <div class="control-row">
                                <label for="glfxHexScale" data-i18n="scale">Scale:</label>
                                <input type="range" id="glfxHexScale" min="1" max="100" step="1" value="10">
                            </div>
                        </div>

                        <div id="glfxInk" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxInkStrength" data-i18n="strength">Strength:</label>
                                <input type="range" id="glfxInkStrength" min="0" max="1" step="0.1" value="0">
                            </div>
                        </div>

                        <div id="glfxBulgePinch" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxBulgeCenterX" data-i18n="centerX">Center X:</label>
                                <input type="range" id="glfxBulgeCenterX" min="0" max="1024" step="1" value="500">
                            </div>
                            <div class="control-row">
                                <label for="glfxBulgeCenterY" data-i18n="centerY">Center Y:</label>
                                <input type="range" id="glfxBulgeCenterY" min="0" max="1024" step="1" value="500">
                            </div>
                            <div class="control-row">
                                <label for="glfxBulgeRadius" data-i18n="radius">Radius:</label>
                                <input type="range" id="glfxBulgeRadius" min="-1" max="1" step="0.01" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxBulgeStrength" data-i18n="strength">Strength:</label>
                                <input type="range" id="glfxBulgeStrength" min="0" max="600" step="1" value="0">
                            </div>
                        </div>

                        <div id="glfxSwirl" class="glfxCcontrol-group">
                            <div class="control-row">
                                <label for="glfxSwirlCenterX" data-i18n="centerX">Center X:</label>
                                <input type="range" id="glfxSwirlCenterX" min="0" max="1024" step="1" value="256">
                            </div>
                            <div class="control-row">
                                <label for="glfxSwirlCenterY" data-i18n="centerY">Center Y:</label>
                                <input type="range" id="glfxSwirlCenterY" min="0" max="1024" step="1" value="256">
                            </div>
                            <div class="control-row">
                                <label for="glfxSwirlRadius" data-i18n="radius">Radius:</label>
                                <input type="range" id="glfxSwirlRadius" min="0" max="600" step="1" value="0">
                            </div>
                            <div class="control-row">
                                <label for="glfxSwirlAngle" data-i18n="angle">Angle:</label>
                                <input type="range" id="glfxSwirlAngle" min="-25" max="25" step="10" value="0">
                            </div>
                        </div>
                        <div style="margin-top: 5px;">
                            <button id="glfxApplyButton" data-i18n="apply">Apply</button>
                            <button id="glfxResetButton" data-i18n="reset">Reset</button>
                        </div>
                    </div>
                </div>

            </div>
    `;
}
