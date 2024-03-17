[English](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README.md) : [日本語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_JP.md) : [中文](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_CH.md)
  
特征  
    - 简单易用的漫画风格图像创建功能。  
    - 提供多个漫画面板图像。  
    - 您还可以添加自己的漫画面板图像。  
    - 自动检测框架并分配编号。  
    - 根据编号应用图像。 
    - 支持 PNG 图像。 
    - 还支持透明图像。  
   -水平翻转图像  
   - 恢复更改的图像

计划实施的功能  
   - 添加标注、添加文本、应用覆盖图像  
   - 图像缩小、裁剪  
     Web UI 端需要兼容 Gradio4。  
     有一个 PR，所以我认为它很快就会得到解决。  
  
# Stable Diffusion Web UI 扩展  
这是一个用于创建简单漫画风格图片的扩展。  
该扩展旨在简化创建漫画风格图片的过程，无需进行高级操作或拥有图像编辑软件。  

请注意，此扩展允许您手动将选定的图片适配到漫画面板布局中。  

图片生成完成后，无法自动创建漫画风格图片。您必须手动选择图片。  
虽然技术上可以实现自动化，但由于不总是能生成预期的图片，因此认为这不是实际可行的。  

## 安装指南
- 在Stable Diffusion WebUI中进行操作。

1. 选择"Extensions"标签。
2. 选择"Install from URL"标签。
3. 在"URL for extension's git repository"输入框中，粘贴以下URL：
   `https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker`
4. 点击"Install"按钮进行安装。

## 如何使用  
使用方法很简单：  

1. 选择提供的漫画面板图片。  
2. 点击“New Image”按钮。  
3. 选择您想要应用的图片。   
4. 点击“Apply Image”按钮。  

## 操作界面  
选择一个漫画面板图片。  
<img src="readme_image/SC_2024-03-10%20022306.jpg" width="400" alt="SC1">  
<hr>
接下来，只需应用任何您想要的图片。  
<img src="readme_image/SC_2024-03-10%20022314.jpg" width="400" alt="SC2">  
<hr>
## 样本图片  
<img src="readme_image/MangaMaker_20240310_022346.jpg" width="400" alt="manga_1">  
<hr>
<img src="readme_image/MangaMaker_20240310_021817.jpg" width="400" alt="manga_2">  
<hr>
<img src="readme_image/MangaMaker_20240310_020432.jpg" width="400" alt="manga_3">  
<hr>

开发者  
[https://twitter.com/hypersankaku2](https://twitter.com/hypersankaku2)  
