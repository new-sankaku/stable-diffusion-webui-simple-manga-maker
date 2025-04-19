[English](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker) | 
[日本語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_JP.md) | 
[中文](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_CN.md)

# 漫画编辑器 Desu! 专业版

这是一款连接ComfyUI、A1111 WebUI和Forge的漫画创作Web应用程序。  
您可以使用演示网站或下载后在浏览器中运行。  
*注：由于A1111/Forge的开发前景不明确，我们计划在未来仅支持ComfyUI。

支持状态：
- ComfyUI：SD1.5、SDXL、Pony、Flux1（您也可以使用自己的工作流）
- WebUI：SD1.5、SDXL、Pony
- Forge：SD1.5、SDXL、Pony、Flux1
*图像生成通过ComfyUI或A1111 WebUI或Forge API完成。

仅使用演示网站即可使用所有功能。
[网站：Desu!](https://new-sankaku.github.io/manga-editor-desu/)


如果您想在本地下载文件（运行速度更快），请使用：
git clone https://github.com/new-sankaku/manga-editor-desu.git
cd manga-editor-desu
start index.html


该应用程序支持各种功能，如图像拖放、文件选择导入、文本生成图像功能、图像生成图像功能等。
为初学者预装了标准面板布局，使创建漫画变得简单。
它还包括用于专业面板切割的刀具工具，允许您自由切割面板。功能不断发展，建议定期更新。

## 主页面
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/01_mainpage.webp" width="700">

### 图像拖放
https://github.com/user-attachments/assets/7cf94e6c-fc39-4aed-a0a1-37ca70260fe4

### 对话气泡（模板）
https://github.com/user-attachments/assets/6f1dae5f-b50f-4b04-8875-f0b07111f2ab

### 图像提示助手
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/03_prompthelper.webp" width="700">

## 支持语言
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_trans.webp" height="400">

## 网格线 / 刀具模式
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/05_gridline.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/06_knifemode.webp" height="350">
</div>

## 暗模式
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/09_darkmode.webp" height="350">
</div>

## 混合模式示例
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/12_blend.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/13_blend.webp" height="350">
</div>

## 特效
<div style="display: flex; align-items: flex-start;">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix01.webp" height="350">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix02.webp" height="350">
</div>

## 文本、对话气泡、笔工具
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/08_speechbubble.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/07_font.webp" height="350">
</div>



## 功能
- **多语言支持**：英语、日语、韩语、法语、中文、俄语、西班牙语、葡萄牙语
- **页面预设**：预设的漫画面板布局。
- **面板**：创建和自定义面板。调整形状、颜色、线宽等。
- **对话气泡**：超过40种对话气泡样式，每种样式都可以配置背景颜色、线条颜色和透明度。
- **自定义对话气泡**：通过指定坐标或徒手创建对话气泡。有7种线条类型可用。也提供平滑处理。
- **随机切割**：指定垂直和水平切割数量、倾斜角度和线条起始位置的随机面板切割功能
- **多页面创建**：使用随机切割信息一次性切割多个页面的功能
- **自动适应**：漫画面板中生成的图像或拖放的图像会自动适当缩放和裁剪。
- **叠加层**：将框架外拖放的图像显示为叠加层。
- **图层**：将图像、文本和面板作为图层管理，适合图形设计师和艺术家使用。
- **图像编辑功能**：调整角度、位置、缩放、沿X和Y轴的变化、水平翻转、垂直翻转。
- **图像效果**：棕褐色、灰度、伽马、模糊、鲜艳度、像素化。
- **图像效果（Glfx）**：锐化蒙版、缩放模糊、点屏、六角像素化、墨水、色相/饱和度。
- **文本**：纵向书写、横向书写、粗体、阴影、轮廓、霓虹灯、适合漫画的各种字体。
- **图像文本**：预设的图像文本。
- **网点功能**：漫画背景中常见的网点功能。
- **效果1**：一键将彩色图像处理成黑白网点图像。
- **效果2**：25种类似于Adobe Photoshop中的混合模式。
- **效果3**：为图像轮廓添加发光（模糊轮廓光）。
- **撤销/重做功能**：在编辑过程中自由撤销或重做更改。
- **项目保存/加载**：保存和加载进行中的工作，从上次离开的地方继续工作。
- **设置保存/加载**：保存和加载在扩展中更改的设置，实现一致、无障碍的工作流程。
- **图像导出**：以适合打印或数字分发的格式导出完成的页面。
- **文本生成图像**：通过WebUI、Forge、ComfyUI直接在面板中生成图像。
- **图像生成图像**：通过WebUI直接在面板中生成图像。
- **提示队列**：批量队列提示，轻松在同一页面或面板中生成不同的角色版本。
- **笔/橡皮擦工具**：基本的笔和橡皮擦工具，更改线宽、颜色、线条样式、阴影。擦除线条或图像部分。
- **画布放大/缩小**：基本的笔和橡皮擦工具，更改线宽、颜色、线条样式、阴影。擦除线条或图像部分。

# 安装
https://github.com/new-sankaku/manga-editor-desu.git  
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_.webp" width="700">

## 如何贡献
- **错误报告**：如果您发现错误，请在[Issues](https://github.com/new-sankaku/manga-editor-desu/issues)中创建一个新问题，并在标题中包含**[Bug]**。
- **功能建议**：如果您有新功能的想法，请在[Issues](https://github.com/new-sankaku/manga-editor-desu/issues)中创建一个新问题，并在标题中包含**[Feature Request]**。
- **文档改进**：如果文档中有拼写错误或错误，请提交带有可能更正的拉取请求。如有必要，您也可以将其添加到[Issues](https://github.com/new-sankaku/manga-editor-desu/issues)中。

## 交流
如果您对项目有疑问或讨论，请在[Issues](https://github.com/new-sankaku/manga-editor-desu/issues)中发帖或加入[Discord](https://discord.gg/XCp7dyHj3N)服务器。

谢谢！