function html() {
    return `
    <a class="navbar-brand" href="#">
        <img src="02_images_svg/Logo/black_mode_logo.webp" alt="Manga Editor Desu! Pro Edition Official Logo"
            class="navbar-logo" id="navbar-logo">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span data-i18n="file">File</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li>
                        <a class="dropdown-item" href="#" id="projectSave">
                            <i class="material-icons">folder_zip</i>
                            <span data-i18n="projectSave">Project Save</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" id="projectLoad">
                            <i class="material-icons">folder_zip</i> <span data-i18n="projectLoad">Project
                                Load</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" id="settingsSave">
                            <i class="material-icons">settings</i> <span data-i18n="settingsSave">Settings
                                Save</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" id="settingsLoad">
                            <i class="material-icons">settings</i> <span data-i18n="settingsLoad">Settings
                                Load</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" id="settingsSave" onclick="cropAndDownload()">
                            <span class="material-symbols-outlined">imagesmode</span> <span
                                data-i18n="imageDownload">Image Download</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" id="settingsLoad" onclick="clipCopy()">
                            <i class="material-icons">content_copy</i> <span data-i18n="imageCopy">Image
                                Copy</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" id="svgDownload">
                            <span class="material-symbols-outlined">polyline</span>
                            <span data-i18n="SvgDownload">Svg Download</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" onclick="allRemove()">
                            <i class="material-icons">delete</i> <span data-i18n="allRemove">All Remove</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span data-i18n="prompt">Prompt</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li>
                        <a class="dropdown-item" onclick="openPromptChangeFloatingWindow()">
                            <i class="material-icons">manage_search</i> <span data-i18n="searchReplace">Search &
                                Replace</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="intro_sdWebUI" data-i18n="sdWebUI">SD API</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <!-- <li style="display: flex; justify-content: center; align-items: center; list-style: none; padding: 10px">
                        <button id="Select_a1111_button"  style="margin: 0 10px; padding: 5px; background-color: #ffedd3;">A1111</button>
                        <button id="Select_comfyui_button" style="margin: 0 10px; padding: 5px">Comfyui</button>
                    </li> -->
                    <li style="display: none;">
                        <div class="toggle-container">
                            <span class="toggle-text">WebUI</span>
                            <div class="toggle-switch">
                                <input type="checkbox" id="toggle-api" class="toggle-checkbox"
                                    onchange="toggleAPI(event)">
                                <label for="toggle-api" class="toggle-label"></label>
                            </div>
                            <span class="toggle-text2">ComfyUI</span>
                        </div>
                    </li>

                    <hr>
                    <!--A1111-->
                    <div class="A1111_api_content">
                        <li>
                            <label>
                                <span data-i18n="">WebUI(A1111/Forge)</span>
                            </label>
                            <label for="Stable_Diffusion_WebUI_apiHost">
                                <span data-i18n="apiHost">API Host:</span>
                                <input type="text" id="Stable_Diffusion_WebUI_apiHost">
                            </label>
                        </li>
                        <li>
                            <label for="Stable_Diffusion_WebUI_apiPort">
                                <span data-i18n="apiPort">API Port:</span>
                                <input type="text" id="Stable_Diffusion_WebUI_apiPort">
                            </label>
                        </li>
                        <li>
                            <a href="html/API_Help/stablediffusion_web_ui_settings.html" target="_blank">
                                <i class="material-icons">help_outline</i>
                                <span data-i18n="help_api_connect_settings">
                                    Help:Connect Settings
                                </span>
                            </a>
                        </li>
                    </div>
                    <hr>

                    <!--TODO COMFYUI-->
                    <div class="Comfyui_api_content" style="display: none;">
                        <li>
                            <label>
                                <span data-i18n="">ComufyUI(β)</span>
                            </label>
                        </li>
                        <li>
                            <label for="Comfyui_apiHost">
                                <span data-i18n="apiHost">API Host:</span>
                                <input type="text" id="Comfyui_apiHost">
                            </label>
                        </li>
                        <li>
                            <label for="Comfyui_apiPort">
                                <span data-i18n="apiPort">API Port:</span>
                                <input type="text" id="Comfyui_apiPort">
                            </label>
                        </li>
                        <li>
                            <label class="file-input-label">
                                <input type="file" id="Workflow_path_load" onchange="displayFileName()">
                                <span>Workflow File</span>
                            </label>
                            <label>
                                <span id="file-name">No file</span>
                            </label>
                        </li>
                        <a href="html/API_Help/ComufyUI_settings.html" target="_blank">
                            <i class="material-icons">help_outline</i>
                            <span data-i18n="help_api_connect_settings">
                                Help:Connect Settings
                            </span>
                        </a>
                    </div>
                </ul>
            </li>
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span data-i18n="canvas">Canvas</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item">
                        <i class="material-icons">format_color_fill</i>
                        <span data-i18n="canvasBG">Canvas BG</span>
                        <input type="color" id="bg-color" value="#ffffff">
                    </a>

                    <a class="dropdown-item">
                        <i class="material-icons">photo_size_select_large</i> <span
                            data-i18n="downloadDpi">Download Dpi</span>
                        <input type="number" id="outputDpi" class="dropdown-item-mini-text" value="300" min="96"
                            step="1">
                    </a>
                    <hr>
                    <a class="dropdown-item" href="#" id="toggleGridButton">
                        <i class="material-icons">grid_4x4</i>
                        <span data-i18n="gridLine">Grid Line (Ctrl+G)</span>
                    </a>
                    <a class="dropdown-item">
                        <i class="material-icons">format_line_spacing</i> <span data-i18n="gridLineSize">Grid
                            Line Size</span>
                        <input type="number" id="gridSizeInput" class="dropdown-item-mini-text" value="10"
                            min="1">
                    </a>
                    <hr>
                    <a class="dropdown-item">
                        <i class="material-icons">fit_screen</i> <span data-i18n="marginFromPanel">Margin From
                            Panel</span>
                        <input type="number" id="marginFromPanel" class="dropdown-item-mini-text" value="20"
                            step="1" min="0" max="100">
                    </a>
                </ul>
            </li>
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span data-i18n="help">Help</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="html/Shortcut/shortcut.html" target="_blank">
                        <i class="material-icons">switch_access_shortcut</i>
                        <span data-i18n="shortcutPage">Shortcut Page</span>
                    </a>
                    <a class="dropdown-item" href="html/functionList.html" target="_blank">
                        <i class="material-icons">functions</i>
                        <span data-i18n="functionList">Function List</span>
                    </a>
                </ul>
            </li>
        </ul>


        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="language" data-i18n="language" data-step="1" data-intro="">Language</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a id="Intro_Tutorial" class="dropdown-item" href="#" target="_blank">
                        <i class="material-icons">volunteer_activism</i>
                        <span data-i18n="Tutorial">Tutorial</span>
                    </a>

                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('en', event)">
                        <span class="flag-icon flag-icon-us"></span> <span data-i18n="english">English</span>
                    </a>
                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('ja', event)">
                        <span class="flag-icon flag-icon-jp"></span>
                        <span data-i18n="japanese">日本語</span>
                    </a>
                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('ko', event)">
                        <span class="flag-icon flag-icon-kr"></span> <span data-i18n="korean">한국어</span>
                    </a>
                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('zh', event)">
                        <span class="flag-icon flag-icon-cn"></span> <span data-i18n="chinese">中文</span>
                    </a>
                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('fr', event)">
                        <span class="flag-icon flag-icon-fr"></span> <span data-i18n="french">Français</span>
                    </a>

                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('ru', event)">
                        <span class="flag-icon flag-icon-ru"></span> <span data-i18n="russian">Русский</span>
                    </a>
                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('es', event)">
                        <span class="flag-icon flag-icon-es"></span> <span data-i18n="spanish">Español</span>
                    </a>
                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('pt', event)">
                        <span class="flag-icon flag-icon-pt"></span> <span
                            data-i18n="portuguese">Português</span>
                    </a>
                    <a class="dropdown-item" href="#" target="_blank" onclick="changeLanguage('th', event)">
                        <span class="flag-icon flag-icon-th"></span> <span data-i18n="thailand">Thailand</span>
                    </a>

                </ul>
            </li>
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="intro_links" data-i18n="links">Links</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="https://new-sankaku.github.io/SP-MangaEditer/"
                        target="_blank">
                        <i class="material-icons">emoji_people</i>
                        <span>SP-MANGA EDITER(Standalone)</span>
                    </a>
                    <a class="dropdown-item" href="https://discord.gg/zuU96TqNUb" target="_blank">
                        <i class="fab fa-discord"></i>
                        <span data-i18n="discord">Discord</span>
                    </a>
                    <a class="dropdown-item"
                        href="https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker"
                        target="_blank">
                        <i class="fab fa-github"></i>
                        <span data-i18n="github">GitHub</span>
                    </a>

                </ul>
            </li>
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="intro_links" data-i18n="Share">Share</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" target="_blank" onclick="snsTweet()">
                        <i class="fab fa-twitter"></i>
                        <span>Twitter</span>
                    </a>
                </ul>
            </li>
        </ul>

        <ul class="navbar-nav ms-auto">
            <li class="nav-item">
            </li>
        </ul>
        <ul class="navbar-nav ms-auto">
            <li class="nav-item">
                <i class="fas fa-sun"></i>
                <label class="toggle-switchTermaMode">
                    <input type="checkbox" id="mode-toggle">
                    <span class="slider">
                        <span class="mode-icons">
                        </span>
                    </span>
                </label>
                <i class="fas fa-moon"></i>
            </li>
        </ul>
    </div>
    `;
}
