[English](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README.md) : [日本語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_JP.md) : [中国語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_CH.md)
  
特徴  
 - シンプルで簡単なマンガ風画像作成機能。  
 - マンガのコマ画像は複数用意されています。  
 - 独自のマンガパネル画像を追加することもできます。  
 - フレームを自動的に検出し、番号が割り当てられます。  
 - 番号に従って画像を適用します。  
 - PNG画像をサポートします。  
 - 透過画像にも対応。  
 - 画像の左右反転  
 - 変更した画像を戻す  

実装が予定されている機能  
 - 吹き出しの追加、テキストの追加、オーバーレイ画像の適用  
 - 画像の縮小、クロップ  
   Web UI側のGradio4対応が必要です。PRが出ているのでそのうち対応されると思います。  
  
# Stable Diffusion Web UI Extension  
シンプルな漫画風画像を作るためのExtensionです。  
このExtensionは手軽に漫画風の画像を作るための機能です。  
高度な操作を求めている方や、画像編集ソフトを持っている方にこのExtensionは必要ないかもしれません。  
  
なお、このExtensionで行えるのはコマ割り画像に手動で選んだ画像を当てはめるという操作です。  
  
画像の生成完了後に自動で漫画風画像を作成はできません。あくまで任意の画像を選ぶ必要があります。  
自動化は技術的には可能ですが、必ずしも思った画像が生成できるわけではないため、実用的ではないと判断しました。  
  

## インストール
・Stable Diffusion WebUIで操作します。

「Extensions」タブを選択、「Install from URL」タブを選択、  
「URL for extension's git repository」に以下のURLを貼り付けてInstallを選択します。  
https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker

## 使用方法  
使用方法は簡単です。  
  
1. コマ割り画像が用意されているので選択します  
2. New Imageボタンをクリックします。  
3. 適用したい画像を選びます。   
4. Apply Imageボタンをクリックします。  
  
## 操作画面  
コマ割り画像を選択します。  
<img src="readme_image/SC_2024-03-10%20022306.jpg" width="400" alt="SC1">  
  
後は任意の画像をApplyするだけです。  
<img src="readme_image/SC_2024-03-10%20022314.jpg" width="400" alt="SC2">  
  
## サンプル画像  
<img src="readme_image/MangaMaker_20240310_022346.jpg" width="400" alt="manga_1">  
<hr>
<img src="readme_image/MangaMaker_20240310_021817.jpg" width="400" alt="manga_2">  
<hr>
<img src="readme_image/MangaMaker_20240310_020432.jpg" width="400" alt="manga_3">  
<hr>
  
Developers  
[https://twitter.com/hypersankaku2](https://twitter.com/hypersankaku2)  
