[English](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker) | [日本語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_JP.md) | [中文](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_CN.md)

# Manga Editor Desu! Pro Edition  
WebUI, Forge, ComfyUIに接続する漫画制作用のWebアプリケーションサイトです。  
デモサイトを使用するか、WebUIに拡張機能として追加できます。ブラウザで動きます。  
  
サポート状況  
WebUI:SD1.5, SDXL, Pony  
Forge:SD1.5, SDXL, Pony, Flux1  
ComfyUI:SD1.5, SDXL, Pony, Flux1  
*:画像生成自体はWebUI or Forgeか、ComfyUIのAPIで行います。  

デモサイトのみでもすべての機能を利用できます。

[Web Site:Desu!](https://new-sankaku.github.io/SP-MangaEditer/)


拡張機能ではなくローカル上にファイルを落としたい場合はこちらです。こっちのが早い。
git clone https://github.com/new-sankaku/SP-MangaEditer.git
cd SP-MangaEditer
start index.html


画像のドラッグアンドドロップ、ファイル選択によるインポート、Text2Image機能、Image2Image機能など、多彩な機能をサポートしています。
初心者向けに標準装備されたコマ割りが用意されており、簡単にマンガを作成できます。
また、プロ仕様のコマ割りが可能なナイフツールも備えており、自由にコマを切ることができます。機能は継続して発展し続けており、定期的なアップデートを推奨します。

## Main Page
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/01_mainpage.webp" width="700">

## Main Page With Txt2Img Window
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/10_prompt.webp" width="700">

## Image Prompt Helper
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/03_prompthelper.webp" width="700">

## Support Language
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_trans.webp" height="400">

## Grid Line / Knife Mode
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/05_gridline.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/06_knifemode.webp" height="350">
</div>

## Dark Mode / Light Mode
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/09_darkmode.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/09_lightmode.webp" height="350">
</div>

## Blend Mode
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/11_blendmode.webp" height="800">

## Blend Mode Sample
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/12_blend.webp" height="350">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/13_blend.webp" height="350">
</div>

## Drag on Drop
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/14_Drag on drop.webp" width="700">

## Effect
<div style="display: flex; align-items: flex-start;">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix01.webp" width="400">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/04_gpix02.webp" width="400">
</div>

## Text, Speech Bubbles, Pen
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/08_speechbubble.webp" width="400">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/07_font.webp" width="400">
</div>



## 機能
- **多言語対応**: 英語、日本語、韓国語、フランス語、中国語、ロシア語、スペイン語、ポルトガル語
- **ページプリセット**: プリセットされたコミックパネルのレイアウト。
- **パネル**: パネルの作成とカスタマイズ。形状、色、線の幅などを調整可能。
- **吹き出し**: 40種類以上の吹き出しスタイル、各スタイルは背景色、線の色、透明度の設定が可能。
- **カスタム吹き出し**: 座標指定、フリーハンドで吹き出しを作成できます。線の種類は7種類。スムージング処理もあり。
- **ランダムカット**: 縦と横のカット数、傾斜角度、線開始位置を指定したランダムなパネルカット機能
- **複数ぺージ作成**: ランダムカットの情報を使用して複数ページを丸ごとカットする機能
- **オートフィット**: コミックパネル内に生成された画像やドロップされた画像は自動的に適切にスケールおよびトリミングされます。
- **オーバーレイ**: フレーム外にドロップされた画像をオーバーレイとして表示。
- **レイヤー**: グラフィックデザイナーやアーティストに馴染みのあるレイヤーとして画像、テキスト、パネルを管理。
- **画像編集機能**: 角度、位置、スケール、XおよびY軸に沿った変更、水平反転、垂直反転の調整。
- **画像エフェクト**: セピア、グレースケール、ガンマ、ぼかし、ビビランス、ピクセル化。
- **画像エフェクト(Glfx)**: アンシャープマスク、ズームブラー、ドットスクリーン、六角ピクセレート、インク、色相/彩度。
- **テキスト**: 縦書き、横書き、太字、影、輪郭、ネオン、コミックに適した様々なフォント。
- **画像テキスト**: プリセット化された画像のテキスト。
- **トーン機能**: 漫画の背景で良くあるトーン機能。
- **エフェクト１**: １クリックで実行可能なカラー画像の白黒画像トーン化処理。
- **エフェクト２**: Adobe photoshopなどにあるブレンドモードを25種類。
- **エフェクト３**: 画像輪郭へのグロー（ぼやけた輪郭の光）。
- **アンドゥ/リドゥ機能**: 編集中に自由に変更を元に戻すまたはやり直すことができます。
- **プロジェクトの保存/読み込み**: 作業中のプロジェクトを保存および読み込み、途中から作業を続けることができます。
- **設定の保存/読み込み**: 拡張機能で変更した設定を保存および読み込み、一貫性のある煩わしさのないワークフローを実現します。
- **画像のエクスポート**: 完成したページを印刷やデジタル配信に適した形式でエクスポート。
- **Text2Image**: WebUI, Forge, ComfyUIを介してパネル内で直接画像を生成。
- **Image2Image**: WebUIを介してパネル内で直接画像を生成。
- **プロンプトキュー**: 同じページやパネルで簡単に異なるキャラクターバージョンを生成するためにプロンプトを一括キュー。
- **ペン/消しゴムツール**: 基本的なペンと消しゴムツール、線の幅、色、線のスタイル、影の変更。線や画像の一部を消去。
- **キャンバスのズームイン/ズームアウト**: 基本的なペンと消しゴムツール、線の幅、色、線のスタイル、影の変更。線や画像の一部を消去。

# インストール
https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker.git  
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/02_.webp" width="700">

## 貢献方法
- **バグ報告**: バグを発見した場合は、[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に新しい問題を作成し、タイトルに**[Bug]**を含めてください。
- **機能提案**: 新しい機能のアイデアがある場合は、[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に新しい問題を作成し、タイトルに**[Feature Request]**を含めてください。
- **ドキュメント改善**: ドキュメントに誤字やエラーがある場合は、可能な修正を含むプルリクエストを送信してください。また、必要に応じて[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に追加することもできます。

## コミュニケーション
プロジェクトに関する質問や議論がある場合は、[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に投稿するか、[Discord](https://discord.gg/XCp7dyHj3N)サーバーに参加してください。

ありがとうございます！
