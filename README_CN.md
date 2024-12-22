[English](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker) | [日本語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_JP.md) | [中文](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_CN.md)

# Manga Editor Desu! Pro Edition 漫画编辑器
一个连接WebUI、Forge和ComfyUI的漫画创作网页应用程序。
您可以使用演示网站，或将其作为WebUI的扩展程序。它在浏览器中运行。

## 支持状态
- WebUI: SD1.5, SDXL, Pony
- Forge: SD1.5, SDXL, Pony, Flux1
- ComfyUI: SD1.5, SDXL, Pony, Flux1
*注：图像生成通过WebUI、Forge或ComfyUI API进行。

所有功能都可以通过演示网站使用。

[网站：Desu!](https://new-sankaku.github.io/SP-MangaEditer/)

如果您更喜欢本地下载文件而不是使用扩展程序（更快的方法）：

git clone https://github.com/new-sankaku/SP-MangaEditer.git
cd SP-MangaEditer
start index.html

该应用程序支持多种功能，包括图像拖放、文件选择导入、文字生成图像功能和图像转换功能。它为初学者提供预设的面板布局，便于创建漫画，同时还配备专业的切割工具，可以自定义面板切割。功能不断发展，建议定期更新。

## 界面预览

### 主页面
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/01_mainpage.webp" width="700">

### Image Drop
https://github.com/user-attachments/assets/7cf94e6c-fc39-4aed-a0a1-37ca70260fe4

### Cpeech Bubble(Template)
https://github.com/user-attachments/assets/6f1dae5f-b50f-4b04-8875-f0b07111f2ab

### 图像提示助手
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/03_prompthelper.webp" width="700">

### 语言支持
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_trans.webp" height="400">

### 网格线/切割模式
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/05_gridline.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/06_knifemode.webp" height="350">
</div>

### 暗色模式/亮色模式
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/09_darkmode.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/09_lightmode.webp" height="350">
</div>

### 混合模式和示例
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/11_blendmode.webp" height="800">

<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/12_blend.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/13_blend.webp" height="350">
</div>

### 拖放功能
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/14_Drag on drop.webp" width="700">

### 特效
<div style="display: flex; align-items: flex-start;">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix01.webp" width="400">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix02.webp" width="400">
</div>

### 文字、对话气泡、笔工具
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/08_speechbubble.webp" width="400">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/07_font.webp" width="400">
</div>

## 功能特点

### 核心功能
- **多语言支持**: 英语、日语、韩语、法语、中文、俄语、西班牙语、葡萄牙语
- **页面预设**: 预配置的漫画面板布局
- **面板管理**: 创建和自定义面板，可调整形状、颜色和线条宽度
- **对话气泡**: 超过40种气泡样式，可自定义背景颜色、线条颜色和透明度
- **自定义气泡**: 使用坐标指定或手绘创建气泡，提供7种线型和平滑处理
- **随机切割**: 生成具有指定垂直/水平切割、倾斜角度和线条起始位置的随机面板布局
- **多页面创建**: 使用随机切割信息创建多个页面

### 图像处理
- **自动适应**: 生成或拖入的图像自动缩放和裁剪以适应漫画面板
- **叠加层**: 将框外拖入的图像显示为叠加层
- **图层管理**: 以图形设计师熟悉的方式管理图像、文字和面板图层
- **图像编辑**: 调整角度、位置、比例、X/Y轴变化、水平/垂直翻转
- **图像效果**: 棕褐色、灰度、伽马、模糊、鲜艳度、像素化
- **Glfx效果**: 锐化蒙版、缩放模糊、网点屏幕、六边形像素化、墨水、色相/饱和度

### 文字和设计
- **文字功能**: 垂直/水平书写、粗体、阴影、轮廓、霓虹效果、各种适合漫画的字体
- **图像文字**: 预设的基于图像的文字
- **色调功能**: 漫画风格的背景色调
- **效果**: 
  - 一键将彩色转换为黑白色调
  - 25种类似Adobe Photoshop的混合模式
  - 图像轮廓发光效果

### 工作流工具
- **撤销/重做**: 在编辑过程中自由撤销或重做更改
- **项目管理**: 保存和加载项目以便稍后继续工作
- **设置管理**: 保存和加载扩展设置，保持工作流程一致
- **导出选项**: 以适合打印或数字发布的格式导出完成的页面
- **AI集成**: 
  - 通过WebUI、Forge、ComfyUI进行文字生成图像
  - 通过WebUI进行图像转换
  - 批量角色版本生成的提示队列
- **绘图工具**: 基本的笔和橡皮擦工具，可调整宽度、颜色、样式和阴影
- **画布控制**: 缩放功能

## 安装

git clone https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker.git

<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_.webp" width="700">

## 如何贡献
- **错误报告**: 创建新问题时在标题中加入 **[Bug]**
- **功能请求**: 创建新问题时在标题中加入 **[Feature Request]**
- **文档**: 提交包含更正或改进的拉取请求

## 社区
- 有问题或讨论？请在[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)中发帖
- 加入我们的[Discord](https://discord.gg/XCp7dyHj3N)服务器

感谢您对Manga Editor Desu! Pro Edition的关注！
