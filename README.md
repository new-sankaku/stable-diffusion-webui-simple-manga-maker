[English](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker) | [日本語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_JP.md) | [中文](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_CN.md)

# Manga Editor Desu! Pro Edition
A web application for manga creation that connects with WebUI, Forge, and ComfyUI.
You can either use the demo site or add it as an extension to WebUI. It runs in your browser.

## Support Status
- WebUI: SD1.5, SDXL, Pony
- Forge: SD1.5, SDXL, Pony, Flux1
- ComfyUI: SD1.5, SDXL, Pony, Flux1  
*Note: Image generation is performed through WebUI, Forge, or ComfyUI API.

All features are available through the demo site alone.

[Web Site: Desu!](https://new-sankaku.github.io/SP-MangaEditer/)

If you prefer to download files locally instead of using the extension (faster method):

git clone https://github.com/new-sankaku/SP-MangaEditer.git
cd SP-MangaEditer
start index.html

The application supports various features including image drag-and-drop, file selection import, Text2Image functionality, and Image2Image capabilities. It comes with pre-built panel layouts for beginners to easily create manga, as well as a professional knife tool for custom panel cutting. The features continue to evolve, and regular updates are recommended.

## Interface Previews

### Main Page
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/01_mainpage.webp" width="700">

### Main Page With Txt2Img Window
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/10_prompt2.webp" width="700">

### Image Prompt Helper
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/03_prompthelper.webp" width="700">

### Language Support
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_trans.webp" height="400">

### Grid Line / Knife Mode
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/05_gridline.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/06_knifemode.webp" height="350">
</div>

### Dark Mode / Light Mode
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/09_darkmode.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/09_lightmode.webp" height="350">
</div>

### Blend Mode and Samples
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/11_blendmode.webp" height="800">

<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/12_blend.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/13_blend.webp" height="350">
</div>

### Drag and Drop
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/14_Drag on drop.webp" width="700">

### Effects
<div style="display: flex; align-items: flex-start;">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix01.webp" width="400">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix02.webp" width="400">
</div>

### Text, Speech Bubbles, Pen
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/08_speechbubble.webp" width="400">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/07_font.webp" width="400">
</div>

## Features

### Core Features
- **Multilingual Support**: English, Japanese, Korean, French, Chinese, Russian, Spanish, Portuguese
- **Page Presets**: Pre-configured comic panel layouts
- **Panel Management**: Create and customize panels with adjustable shapes, colors, and line widths
- **Speech Bubbles**: Over 40 bubble styles with customizable background colors, line colors, and transparency
- **Custom Bubbles**: Create bubbles using coordinate specification or freehand drawing with 7 line types and smoothing
- **Random Cut**: Generate random panel layouts with specified vertical/horizontal cuts, tilt angles, and line start positions
- **Multi-page Creation**: Create multiple pages using random cut information

### Image Handling
- **Auto-fit**: Generated or dropped images automatically scale and crop to fit comic panels
- **Overlay**: Display images dropped outside frames as overlays
- **Layer Management**: Manage images, text, and panels as layers familiar to graphic designers
- **Image Editing**: Adjust angle, position, scale, X/Y axis changes, horizontal/vertical flips
- **Image Effects**: Sepia, grayscale, gamma, blur, vibrance, pixelation
- **Glfx Effects**: Unsharp mask, zoom blur, dot screen, hex pixelate, ink, hue/saturation

### Text and Design
- **Text Features**: Vertical/horizontal writing, bold, shadow, outline, neon, various comic-suitable fonts
- **Image Text**: Preset image-based text
- **Tone Features**: Manga-style background tones
- **Effects**: 
  - One-click color to B&W tone conversion
  - 25 blend modes similar to Adobe Photoshop
  - Glow effects for image outlines

### Workflow Tools
- **Undo/Redo**: Freely revert or redo changes during editing
- **Project Management**: Save and load projects to continue work later
- **Settings Management**: Save and load extension settings for consistent workflows
- **Export Options**: Export completed pages in formats suitable for print or digital distribution
- **AI Integration**: 
  - Text2Image via WebUI, Forge, ComfyUI
  - Image2Image via WebUI
  - Prompt queue for batch character version generation
- **Drawing Tools**: Basic pen and eraser with adjustable width, color, style, and shadow
- **Canvas Control**: Zoom in/out functionality

## Installation

git clone https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker.git

<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_.webp" width="700">

## How to Contribute
- **Bug Reports**: Create a new issue with **[Bug]** in the title
- **Feature Requests**: Create a new issue with **[Feature Request]** in the title
- **Documentation**: Submit pull requests with corrections or improvements

## Community
- Questions or discussions? Post in [Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)
- Join our [Discord](https://discord.gg/XCp7dyHj3N) server

Thank you for your interest in Manga Editor Desu! Pro Edition!
