function html() {
    return `
<div id="sidebar">
                <i class="material-icons" id="intro_svg-container-vertical"
                    onclick="toggleVisibility('svg-container-vertical');">crop_portrait</i>
                <i class="material-icons" id="intro_svg-container-landscape"
                    onclick="toggleVisibility('svg-container-landscape');">crop_16_9</i>
                <i class="material-icons" id="intro_page-manager-area"
                    onclick="toggleVisibility('panel-manager-area');">dashboard</i>
                <i class="material-icons" id="intro_custom-panel-manager-area"
                    onclick="toggleVisibility('custom-panel-manager-area');">dashboard_customize</i>
                <i class="material-icons" id="intro_speech-bubble-area1"
                    onclick="toggleVisibility('speech-bubble-area1');">chat_bubble</i>
                <i class="material-icons" id="intro_text-area" onclick="toggleVisibility('text-area');">text_fields</i>
                <i class="material-icons" id="intro_tool-area" onclick="toggleVisibility('tool-area');">brush</i>
                <i class="material-icons" id="intro_shape-area" onclick="toggleVisibility('shape-area');">interests</i>
                <i class="material-icons" id="intro_dummy-area4" onclick="toggleVisibility('dummy-area4');">info</i>
            </div>

            <div id="svg-container-vertical" style="display: none;">
                <div class="area-header" data-i18n="panelsVertical">Panels</div>
                <div id="svg-preview-area-vertical"></div>
            </div>

            <div id="svg-container-landscape" style="display: none;">
                <div class="area-header" data-i18n="panelsLandscape">Panels</div>
                <div id="svg-preview-area-landscape"></div>
            </div>

            <div id="panel-manager-area" style="display: none;">
                <div class="area-header" data-i18n="pageManager">Page Manager</div>
                <div id="panel-manager-items">
                    <hr>
                    <button id="knifeModeButton">
                        <i class="material-icons">edit_square</i>
                        <span data-i18n="knifeMode">Knife Mode: OFF</span>
                    </button>
                    <div class="input-group">
                        <label for="spaceSizeLabel" data-i18n="spaceSizeLabel">Space Size</label>
                        <input type="number" id="knifePanelSpaceSize" name="knifePanelSpaceSize" min="0" max="75"
                            step="1" value="20">
                    </div>
                    <hr>
                    <button id="A4-H">
                        <i class="material-icons">crop_portrait</i>
                        <span data-i18n="A4-H-Scale">A4 Scale Panel</span>
                    </button>
                    <button id="A4-V">
                        <i class="material-icons">crop_landscape</i>
                        <span data-i18n="A4-V-Scale">A4 Scale Panel</span>
                    </button>
                    <button id="B4-H">
                        <i class="material-icons">crop_portrait</i>
                        <span data-i18n="B4-H-Scale">B4 Scale Panel</span>
                    </button>
                    <button id="B4-V">
                        <i class="material-icons">crop_landscape</i>
                        <span data-i18n="B4-V-Scale">B4 Scale Panel</span>
                    </button>
                    <hr>
                    <button id="insta">
                        <i class="fab fa-instagram"></i>
                        <span data-i18n="instagram">IG</span>
                    </button>
                    <button id="insta-story">
                        <i class="fab fa-instagram"></i>
                        <span data-i18n="instagram_story">IG Story</span>
                    </button>
                    <button id="insta-portrait">
                        <i class="fab fa-instagram"></i>
                        <span data-i18n="instagram_portrait">IG Port</span>
                    </button>
                    <hr>

                    <button id="fb-page-cover">
                        <i class="fab fa-facebook"></i>
                        <span data-i18n="fb_page_cover">FB Page</span>
                    </button>
                    <button id="fb-event">
                        <i class="fab fa-facebook"></i>
                        <span data-i18n="fb_event">FB Event</span>
                    </button>
                    <button id="fb-group-header">
                        <i class="fab fa-facebook"></i>
                        <span data-i18n="fb_group_header">FB Group</span>
                    </button>
                    <hr>

                    <button id="youtube-thumbnail">
                        <i class="fab fa-youtube"></i>
                        <span data-i18n="youtube_thumbnail">YT Thumb</span>
                    </button>
                    <button id="youtube-profile">
                        <i class="fab fa-youtube"></i>
                        <span data-i18n="youtube_profile">YT Prof</span>
                    </button>
                    <button id="youtube-cover">
                        <i class="fab fa-youtube"></i>
                        <span data-i18n="youtube_cover">YT Cover</span>
                    </button>
                    <hr>

                    <button id="twitter-profile">
                        <i class="fab fa-twitter"></i>
                        <span data-i18n="twitter_profile">TW Prof</span>
                    </button>
                    <button id="twitter-header">
                        <i class="fab fa-twitter"></i>
                        <span data-i18n="twitter_header">TW Head</span>
                    </button>
                    <hr>
                    <div class="input-group">
                        <label for="customPanelSizeX" data-i18n="customPanelSizeX">Width</label>
                        <input type="number" id="customPanelSizeX" name="customPanelSizeX" min="1" max="4096" step="1"
                            value="1380">
                    </div>
                    <div class="input-group">
                        <label for="customPanelSizeY" data-i18n="customPanelSizeY">Height</label>
                        <input type="number" id="customPanelSizeY" name="customPanelSizeY" min="1" max="4096" step="1"
                            value="4000">
                    </div>
                    <button id="CustomPanelButton">
                        <i class="material-icons">crop_landscape</i>
                        <span data-i18n="customPanel">Custom Size</span>
                    </button>

                </div>
            </div>

            <div id="custom-panel-manager-area" style="display: none;">
                <div class="area-header" data-i18n="panelManager">Panel Manager</div>
                <div id="custom-panel-manager-items">
                    <hr>
                    <div class="input-group">
                        <label for="panelStrokeColor" data-i18n="line">Line:</label>
                        <input type="color" id="panelStrokeColor" name="panelStrokeColor" value="#000000"
                            oninput="changePanelStrokeColor(this.value)">
                    </div>
                    <div class="input-group">
                        <label for="panelFillColor" data-i18n="fill">Fill:</label>
                        <input type="color" id="panelFillColor" name="panelFillColor" value="#FFFFFF"
                            oninput="changePanelFillColor(this.value)">
                    </div>
                    <div class="input-group">
                        <label data-i18n="panelOpacity">Opacity:</label>
                        <input type="number" id="panelOpacity" name="panelOpacity" min="0" max="100" step="1"
                            value="100" oninput="changePanelOpacity(this.value)">
                    </div>
                    <div class="input-group">
                        <label for="panelStrokeWidth" data-i18n="lineWidth">Line Width:</label>
                        <input type="number" id="panelStrokeWidth" name="panelStrokeWidth" min="0.1" max="10" step="0.1"
                            value="2" oninput="changePanelStrokeWidth(this.value)">
                    </div>
                    <button id="add" onclick="panelAllChange()"><i class="material-icons">border_all</i> <span
                            data-i18n="all_change">All Change</span></button>
                    <button id="edit" onclick="Edit()"><i class="material-icons">edit_square</i> <span
                            data-i18n="editingMode">Editing Mode</span></button>

                    <hr>
                    <div class="input-group">
                        <label data-i18n="accept_ratio">Accept Ratio</label>
                    </div>
                    <div class="input-group">
                        <label data-i18n="width">Width</label>
                        <input type="number" id="ar_width" name="ar_width" min="0.01" max="9999" step="1" value="3">
                    </div>
                    <div class="input-group">
                        <label data-i18n="height">Height</label>
                        <input type="number" id="ar_height" name="ar_height" min="0.01" max="9999" step="1" value="4">
                    </div>
                    <button id="addRect" onclick="addArRect()">
                        <i class="material-icons">aspect_ratio</i>
                        <span data-i18n="ar_Rect">AR Rect</span>
                    </button>
                    <hr>
                    <button id="addSquare" onclick="addSquare()">
                        <i class="material-icons">add_box</i>
                        <span data-i18n="square">Square</span>
                    </button>
                    <button id="addTallRect" onclick="addTallRect()">
                        <i class="material-icons">vertical_split</i>
                        <span data-i18n="tallRect">Tall Rectangle</span>
                    </button>
                    <button id="addWideRect" onclick="addWideRect()">
                        <i class="material-icons">horizontal_split</i>
                        <span data-i18n="wideRect">Wide Rectangle</span>
                    </button>

                    <button id="addTrapezoid" onclick="addTrapezoid()">
                        <i class="material-icons">filter_none</i>
                        <span data-i18n="trapezoid">Trapezoid</span>
                    </button>
                    <button id="addTallRightLeaningTrapezoid" onclick="addTallRightLeaningTrapezoid()">
                        <i class="material-icons">filter_none</i>
                        <span data-i18n="tallTrapezoid">Tall Trapezoid</span>
                    </button>
                    <button id="addRightSlantingTrapezoid" onclick="addRightSlantingTrapezoid()">
                        <i class="material-icons">filter_none</i>
                        <span data-i18n="wideTrapezoid">Wide Trapezoid</span>
                    </button>
                    <button id="addTallTrap" onclick="addTallTrap()">
                        <i class="material-icons">filter_none</i>
                        <span data-i18n="tallTrap">Tall Trapezoid</span>
                    </button>
                    <button id="addWideTrap" onclick="addWideTrap()">
                        <i class="material-icons">filter_none</i>
                        <span data-i18n="wideTrap">Wide Trapezoid</span>
                    </button>

                    <button id="addTriangle" onclick="addTriangle()">
                        <i class="material-icons">change_history</i>
                        <span data-i18n="triangle">Triangle</span>
                    </button>
                    <button id="addRhombus" onclick="addRhombus()">
                        <i class="material-icons">diamond</i>
                        <span data-i18n="rhombus">Rhombus</span>
                    </button>
                    <button id="addPentagon" onclick="addPentagon()">
                        <i class="material-icons">pentagon</i>
                        <span data-i18n="pentagon">Pentagon</span>
                    </button>
                    <button id="addHexagon" onclick="addHexagon()">
                        <i class="material-icons">hexagon</i>
                        <span data-i18n="hexagon">Hexagon</span>
                    </button>

                    <button id="addCircle" onclick="addCircle()">
                        <i class="material-icons">radio_button_unchecked</i>
                        <span data-i18n="circle">Circle</span>
                    </button>
                    <button id="addEllipse" onclick="addEllipse()">
                        <i class="material-icons">panorama_fish_eye</i>
                        <span data-i18n="ellipse">Ellipse</span>
                    </button>
                    <button id="addOctagon" onclick="addOctagon()">
                        <i class="material-icons">report</i>
                        <span data-i18n="octagon">Octagon</span>
                    </button>
                    <button id="addStar" onclick="addStar()">
                        <i class="material-icons">star</i>
                        <span data-i18n="star">Star</span>
                    </button>
                </div>
            </div>

            <div id="speech-bubble-area1" style="display: none;">
                <div class="area-header" data-i18n="bubble">Bubble</div>
                <div id="speech-bubble-svg-preview-area1">
                    <div class="input-group">
                        <input type="checkbox" id="applySpeechbubbleChange" data-i18n="enableSettings">
                        <span data-i18n="enableSettings">Enable Settings</span>
                    </div>
                    <hr>
                    <div class="input-group">
                        <label data-i18n="background">Background</label>
                        <input type="color" id="bubbleFillColor" value="#FFFFFF"
                            oninput="changeSpeechBubbleBackgroundColor(this.value)">
                    </div>
                    <div class="input-group">
                        <label data-i18n="line">Line</label>
                        <input type="color" id="bubbleStrokeColor" value="#000000"
                            oninput="changeSpeechBubbleLineColor(this.value)">
                    </div>
                    <div class="input-group">
                        <label data-i18n="opacity">Opacity</label>
                        <input type="number" id="speechBubbleOpacity" name="speechBubbleOpacity" min="0" max="100"
                            step="1" value="80" oninput="changeSpeechBubbleOpacity(this.value)">
                    </div>
                    <label style="display: none;">Line Size</label>
                    <input style="display: none;" type="range" id="speechBubbleLineSizeSlider" min="1" max="10"
                        value="3">
                    <hr>
                </div>
            </div>

            <div id="text-area" style="display: none;">
                <div class="area-header" data-i18n="text">Text</div>
                <div id="text-preview-area">
                    <hr>
                    <div class="input-group">
                        <label data-i18n="font">Font:</label>
                        <select id="fontSelector" onchange="changeFont(this.value)" class="dynamic-font">
                        </select>
                    </div>
                    <div class="input-group">
                        <label data-i18n="textColor">Text</label>
                        <input type="color" id="textColorPicker" value="#000000" oninput="changeTextColor(this.value)">
                    </div>
                    <div class="input-group">
                        <label data-i18n="outlineColor">Outline</label>
                        <input type="color" id="textOutlineColorPicker" value="#000000"
                            oninput="changeOutlineTextColor(this.value)">
                    </div>
                    <div class="input-group">
                        <label data-i18n="fontSize">Size</label>
                        <input type="number" id="fontSizeSlider" min="7" max="150" value="30"
                            oninput="changeFontSize(this.value)">
                    </div>
                    <div class="input-group">
                        <label data-i18n="outlineSize">Outline Size</label>
                        <input type="number" id="fontStrokeWidthSlider" min="0" max="5" step="1" value="1"
                            oninput="changeStrokeWidthSize(this.value)">
                    </div>
                    <div class="input-group-multi">
                        <button id="align-left" class="selected" onclick="alignText('left')">
                            <i class="material-icons">format_align_left</i>
                        </button>
                        <button id="align-center" onclick="alignText('center')">
                            <i class="material-icons">format_align_center</i>
                        </button>
                        <button id="align-right" onclick="alignText('right')">
                            <i class="material-icons">format_align_right</i>
                        </button>
                    </div>
                    <hr>
                    <button onclick="createTextbox()">
                        <i class="material-icons">text_fields</i>
                        <i class="material-icons">east</i>
                        <span data-i18n="newText">New Text</span>
                    </button>
                    <button id="openWindow">
                        <i class="material-icons">text_fields</i>
                        <i class="material-icons">south</i>
                        <span data-i18n="newText">New Text</span>
                    </button>
                    <button onclick="toggleBold()">
                        <i class="material-icons">format_bold</i>
                        <span data-i18n="bold">Bold</span>
                    </button>
                    <hr>
                    <label data-i18n="effects">Effects</label>
                    <div class="input-group">
                        <label data-i18n="firstColor">First Color:</label>
                        <input type="color" id="firstTextEffectColorPicker" value="#F58220"
                            oninput="changeNeonColor(this.value)">
                    </div>
                    <div class="input-group">
                        <label data-i18n="secondColor">Second Color:</label>
                        <input type="color" id="secondTextEffectColorPicker" value="#ff8080"
                            oninput="changeNeonColor(this.value)">
                    </div>
                    <hr>
                    <button onclick="applyCSSTextEffect()">
                        <i class="material-icons">deblur</i>
                        <span data-i18n="shadow">Shadow</span>
                    </button>
                    <button onclick="applyVividGradientEffect()">
                        <i class="material-icons">filter</i>
                        <span data-i18n="vividGradient">Vivid Gradient</span>
                    </button>
                    <button onclick="applyNeonEffect()">
                        <i class="material-icons">flare</i>
                        <span data-i18n="neon">Neon</span>
                    </button>
                    <hr>
                    <label>Sample123</label>
                    <label>参考さんサン１２３</label>
                    <label>샘플 / 样本</label>
                    <label>échantillon</label>
                    <label>образец</label>
                    <label>عينة / ตัวอย่าง</label>
                </div>
            </div>




            <div id="tool-area" style="display: none;">
                <div class="area-header" data-i18n="tools">Tools (β)</div>
                <div id="tool-preview-area">
                    <hr>
                    <div class="input-group">
                        <label data-i18n="size">Size</label>
                        <input type="number" id="drawing-line-width" min="1" max="150" value="5">
                    </div>
                    <div class="input-group">
                        <label for="brush-color" data-i18n="color">Color</label>
                        <input type="color" id="drawing-color" value="#000000">
                    </div>
                    <div class="input-group">
                        <label data-i18n="opacity">Opacity</label>
                        <input type="number" id="drawing-opacity" min="1" max="100" step="1" value="100">
                    </div>
                    <div>
                        <label data-i18n="shadow">Shadow</label>
                    </div>
                    <div class="input-group">
                        <label data-i18n="shadowSize">Size</label>
                        <input type="number" id="drawing-shadow-width" min="0" max="150" value="0">
                    </div>
                    <div class="input-group">
                        <label data-i18n="svg_icon_shadow_offset_x">OffsetX</label>
                        <input type="number" id="drawing-shadow-offsetX" min="1" max="150" value="5">
                    </div>
                    <div class="input-group">
                        <label data-i18n="svg_icon_shadow_offset_y">OffsetY</label>
                        <input type="number" id="drawing-shadow-offsetY" min="1" max="150" value="5">
                    </div>
                    <div class="input-group">
                        <label for="brush-Shadow-color" data-i18n="shadowColor">Color</label>
                        <input type="color" id="drawing-shadow-color" value="#000000">
                    </div>
                    <hr>
                    <button id="PencilButton" onclick="switchPencilType('Pencil')">
                        <span data-i18n="Pencil">Pencil</span>
                        <img src="03_images/preset/brush/Pencil.webp" alt="Pencil Icon"
                            style="width: 72px; height: 24px;">
                    </button>
                    <button id="CircleButton" onclick="switchPencilType('Circle')">
                        <span data-i18n="Circle">Circle</span>
                        <img src="03_images/preset/brush/Circle.webp" alt="Circle Icon"
                            style="width: 72px; height: 24px;">
                    </button>
                    <!-- <button id="VlineButton" onclick="switchPencilType('Vline')">
                        <span data-i18n="Vline">Vline</span>
                        <img src="03_images/preset/brush/Vline.png" alt="Vline Icon" style="width: 72px; height: 24px;">
                    </button>                    
                    <button id="HlineButton" onclick="switchPencilType('Hline')">
                        <span data-i18n="Hline">Hline</span>
                        <img src="03_images/preset/brush/Hline.png" alt="Hline Icon" style="width: 72px; height: 24px;">
                    </button>                    
                    <button id="TextureButton" onclick="switchPencilType('Texture')">
                        <span data-i18n="Texture">Texture</span>
                        <img src="03_images/preset/brush/Texture.png" alt="Texture Icon" style="width: 72px; height: 24px;">
                    </button> -->
                    <button id="CrayonButton" onclick="switchPencilType('Crayon')">
                        <span data-i18n="Crayon">Crayon</span>
                        <img src="03_images/preset/brush/Crayon.webp" alt="Crayon Icon"
                            style="width: 72px; height: 24px;">
                    </button>
                    <button id="InkButton" onclick="switchPencilType('Ink')">
                        <span data-i18n="Ink">Ink</span>
                        <img src="03_images/preset/brush/Ink.webp" alt="Ink Icon" style="width: 72px; height: 24px;">
                    </button>
                    <button id="MarkerButton" onclick="switchPencilType('Marker')">
                        <span data-i18n="Marker">Marker</span>
                        <img src="03_images/preset/brush/Marker.webp" alt="Marker Icon"
                            style="width: 72px; height: 24px;">
                    </button>
                    <div class="input-group">
                        <label for="line-style" data-i18n="lineStyle">Line Style</label>
                        <select id="line-style">
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                        </select>
                    </div>
                    <hr>

                    <button id="EraserButton" onclick="switchPencilType('Eraser')">
                        <span class="material-symbols-outlined">ink_eraser</span>
                        <span data-i18n="Eraser">Eraser</span>
                    </button>
                    <hr>

                    <div class="input-group">
                        <label data-i18n="circle-size">circle-size</label>
                        <input type="number" id="circle-size" min="1" max="300" value="40" />
                    </div>
                    <div class="input-group">
                        <label data-i18n="mosaic-size">mosaic-size</label>
                        <input type="number" id="mosaic-size" min="1" max="100" value="8" />
                    </div>
                    <button id="MosaicButton" onclick="switchPencilType('Mosaic')">
                        <span data-i18n="Mosaic">Mosaic</span>
                        <img src="03_images/preset/brush/Mosaic2.webp" alt="Mosaic Icon"
                            style="width: 72px; height: 24px;">
                    </button>
                    <hr>

                </div>
            </div>







            <div id="shape-area" style="display: none;">
                <div class="area-header" data-i18n="shape">Shape</div>
                <div id="shape-preview-area">
                    <hr>
                    <div class="input-group">
                        <input type="text" id="svg_icon_searchInput" placeholder="Enter icon name"
                            data-i18n="svg_icon_search_placeholder"
                            onkeydown="if (event.key === 'Enter') searchIcon();">
                        <button onclick="searchIcon()" data-i18n="svg_icon_search_button">Search</button>
                    </div>
                    <hr>
                    <div class="input-group">
                        <label for="svg_icon_iconStyle" data-i18n="svg_icon_icon_style">Style</label>
                        <select id="svg_icon_iconStyle" onchange="searchInitialIcons()">
                            <option value="filled" data-i18n="svg_icon_filled">Filled</option>
                            <option value="outlined" data-i18n="svg_icon_outlined">Outlined</option>
                            <option value="rounded" data-i18n="svg_icon_rounded">Rounded</option>
                            <option value="twotone" data-i18n="svg_icon_twotone">Two-tone</option>
                        </select>
                    </div>


                    <div class="input-group">
                        <label for="svg_icon_lineWidth" data-i18n="svg_icon_line_width">Line Width</label>
                        <input type="number" id="svg_icon_lineWidth" min="0" max="5" step="1" value="1"
                            oninput="updateSVGStyles()">
                    </div>
                    <div class="input-group">
                        <label for="svg_icon_lineColor" data-i18n="svg_icon_line_color">Line</label>
                        <input type="color" id="svg_icon_lineColor" value="#000000" onchange="updateSVGStyles()">
                    </div>
                    <div class="input-group">
                        <label for="svg_icon_fillColor" data-i18n="svg_icon_fill_color">Fill</label>
                        <input type="color" id="svg_icon_fillColor" value="#EEEEEE" onchange="updateSVGStyles()">
                    </div>
                    <div class="input-group">
                        <label for="svg_icon_fillOpacity" data-i18n="svg_icon_fill_opacity">Opacity</label>
                        <input type="number" id="svg_icon_fillOpacity" min="0" max="1" step="0.1" value="1"
                            oninput="updateSVGStyles()">
                    </div>
                    <hr>
                    <label>Shadow</label>
                    <div class="input-group">
                        <label for="svg_icon_shadowColor" data-i18n="svg_icon_shadow_color">Color</label>
                        <input type="color" id="svg_icon_shadowColor" value="#FFFFFF" onchange="updateSVGStyles()">
                    </div>
                    <div class="input-group">
                        <label for="svg_icon_shadowBlur" data-i18n="svg_icon_shadow_blur">Blur</label>
                        <input type="number" id="svg_icon_shadowBlur" min="0" max="100" step="1" value="3"
                            oninput="updateSVGStyles()">
                    </div>
                    <div class="input-group">
                        <label for="svg_icon_shadowOffsetX" data-i18n="svg_icon_shadow_offset_x">Offset X</label>
                        <input type="number" id="svg_icon_shadowOffsetX" min="-20" max="20" step="1" value="0"
                            oninput="updateSVGStyles()">
                    </div>
                    <div class="input-group">
                        <label for="svg_icon_shadowOffsetY" data-i18n="svg_icon_shadow_offset_y">Offset Y</label>
                        <input type="number" id="svg_icon_shadowOffsetY" min="-20" max="20" step="1" value="0"
                            oninput="updateSVGStyles()">
                    </div>
                    <hr>
                    <div id="svg_icon_results"></div>
                    <hr>
                    <a
                        href="https://fonts.google.com/icons?icon.size=24&icon.color=%235f6368&icon.query=Loading&icon.set=Material+Icons&icon.style=Filled">Google
                        Icon</a>
                    <hr>
                    <button id="addTv" onclick="addTv()">
                        <i class="material-icons">tv</i>
                        <span data-i18n="tv">tv</span>
                    </button>
                    <button id="addRefinedRazerKishiController" onclick="addRefinedRazerKishiController()">
                        <i class="material-icons">videogame_asset</i>
                        <span data-i18n="videogame_asset">videogame_asset</span>
                    </button>

                </div>
            </div>








            <div id="dummy-area4" style="display: none;">
                <div class="area-header" data-i18n="information">Information</div>
                <div id="dummy-svg-preview-area4">
                    <div id="license-info">
                        <div class="info-section">
                            <p data-i18n="developerLinks">Developer links:</p>
                            <div class="info-item">
                                <i class="fab fa-discord"></i>
                                <a href="https://discord.gg/zuU96TqNUb" target="_blank">
                                    <span data-i18n="discord">Discord</span>
                                </a>
                            </div>
                            <div class="info-item">
                                <i class="fab fa-twitter"></i>
                                <a href="https://twitter.com/hypersankaku2" target="_blank">
                                    <span data-i18n="twitter">Twitter</span>
                                </a>
                            </div>
                            <div class="info-item">
                                <i class="fab fa-github"></i>
                                <a href="https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker"
                                    target="_blank">
                                    <span data-i18n="github">GitHub</span>
                                </a>
                            </div>
                            <div class="info-item">
                                <i class="fab fa-github"></i>
                                <a href="https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues"
                                    target="_blank">
                                    <span data-i18n="bugReport">Bug report / Feature request</span>
                                </a>
                            </div>
                        </div>
                        <div class="info-section">
                            <p data-i18n="libraries">Libraries:</p>
                            <div class="info-item"><i class="fab fa-js"></i>
                                <a href="http://fabricjs.com/" target="_blank">Fabric.js</a>
                            </div>
                            <div class="info-item"><i class="fab fa-js"></i>
                                <a href="https://github.com/brix/crypto-js" target="_blank">crypto-js</a>
                            </div>
                            <div class="info-item"><i class="fab fa-js"></i>
                                <a href="https://github.com/Stuk/jszip" target="_blank">jsZip</a>
                            </div>

                            <div class="info-item"><i class="fab fa-js"></i>
                                <a href="https://www.i18next.com/" target="_blank">i18next</a>
                            </div>
                            <div class="info-item"><i class="fab fa-js"></i>
                                <a href="https://evanw.github.io/glfx.js/" target="_blank">glfx.js</a>
                            </div>

                            <div class="info-item"><i class="fab fa-js"></i>
                                <a href="https://github.com/Donaldcwl/browser-image-compression"
                                    target="_blank">browser-image-compression</a>
                            </div>

                            <div class="info-item"><i class="fab fa-google"></i>
                                <a href="https://fonts.google.com/icons" target="_blank">Google Icons</a>
                            </div>
                            <div class="info-item"><i class="fab fa-google"></i>
                                <a href="https://fonts.google.com" target="_blank">Google Font</a>
                            </div>
                            <div class="info-item"><i class="fab fa-bootstrap"></i>
                                <a href="https://getbootstrap.jp" target="_blank">Bootstrup</a>
                            </div>
                        </div>
                        <div class="info-section">
                            <p data-i18n="materials">Materials:</p>
                            <div class="info-item">
                                <i class="material-icons">image</i>
                                <a href="https://fukidesign.com" target="_blank" data-i18n="speechBubble">Speech
                                    Bubble</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://fonts.google.com/specimen/M+PLUS+Rounded+1c"
                                    target="_blank">M+PLUS+Rounded+1c</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://fonts.google.com/specimen/Stick?subset=japanese"
                                    target="_blank">Stick</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://fonts.google.com/specimen/DotGothic16?subset=japanese"
                                    target="_blank">DotGothic16</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://fonts.google.com/noto/specimen/Noto+Serif+JP?subset=japanese&noto.script=Hira"
                                    target="_blank">Noto+Serif</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://fonts.google.com/specimen/Rampart+One" target="_blank">Rampart+One</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://booth.pm/ja/items/4106184" target="_blank">どきどきファンタジア</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://fonts.google.com/selection" target="_blank">selection</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://pm85122.onamae.jp/851ch-dz.html" target="_blank">851ch-dz</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://hp.vector.co.jp/authors/VA039499/#ohisama" target="_blank">ohisama</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://font.cutegirl.jp/chalk-font-free.html" target="_blank">chalk-font</a>
                            </div>
                            <div class="info-item">
                                <i class="material-icons">text_fields</i>
                                <a href="https://pm85122.onamae.jp/851mkpop.html" target="_blank">851mkpop</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
}
