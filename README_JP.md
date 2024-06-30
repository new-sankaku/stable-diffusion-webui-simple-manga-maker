[英語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker) : [日本語](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/blob/main/README_JP.md)

# Manga Editor Desu! Pro Edition
これはStable diffusion WebUI (Forge)の拡張機能です。

Manga Editor Desu!は、直感的な操作を目指して設計された軽量なブラウザアプリケーションです。画像のドラッグアンドドロップ、ファイル選択によるインポート、Text2Image機能、Image2Image機能など、多彩な機能をサポートしています。初心者向けに標準装備されたコマ割りが用意されており、簡単にマンガを作成できます。また、プロ仕様のコマ割りが可能なナイフツールも備えており、自由にコマを切ることができます。機能は継続して発展し続けており、定期的なアップデートを推奨します。

アップデートがめんどくさい方はDemoサイトを推奨しています。

## メインページ
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/5.jpg" width="800">

## Txt2Imgウィンドウ付きメインページ
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/4.jpg" width="800">

## ドラッグ＆ドロップ
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/controle.png" width="800">

## エフェクト
<div style="display: flex; align-items: flex-start;">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/output1.webp" width="400">
    <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/output2.webp" width="400">
</div>

## テキスト、吹き出し、ペン
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/6.png" width="400">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/7.png" width="400">
</div>

## ペン、グリッドライン
<div style="display: flex; align-items: flex-start;">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/8.png" width="400">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/1.jpg" width="400">
</div>

## パネルカットナイフ、翻訳
<div style="display: flex; align-items: flex-start;">
 <img src="https://new-sankaku.github.io/SP-MangaEditer-docs/2.jpg" width="400">
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/3.jpg" width="400">
</div>

## 機能
- **多言語対応**: 英語、日本語、韓国語、フランス語、中国語、ロシア語、スペイン語、ポルトガル語
- **ページプリセット**: プリセットされたコミックパネルのレイアウト。縦29種類、横16種類。
- **パネル**: パネルの作成とカスタマイズ。形状、色、線の幅などを調整可能。
- **吹き出し**: 40種類以上の吹き出しスタイル、各スタイルは背景色、線の色、透明度の設定が可能。
- **オートフィット**: コミックパネル内に生成された画像やドロップされた画像は自動的に適切にスケールおよびトリミングされます。
- **オーバーレイ**: フレーム外にドロップされた画像をオーバーレイとして表示。
- **レイヤー**: グラフィックデザイナーやアーティストに馴染みのあるレイヤーとして画像、テキスト、パネルを管理。
- **画像編集機能**: 角度、位置、スケール、XおよびY軸に沿った変更、水平反転、垂直反転の調整。
- **画像エフェクト**: セピア、グレースケール、ガンマ、ぼかし、ビビランス、ピクセル化。
- **画像エフェクト(Glfx)**: アンシャープマスク、ズームブラー、ドットスクリーン、六角ピクセレート、インク、色相/彩度。
- **テキスト**: 縦書き、横書き、太字、影、輪郭、ネオン、コミックに適した様々なフォント。
- **アンドゥ/リドゥ機能**: 編集中に自由に変更を元に戻すまたはやり直すことができます。
- **プロジェクトの保存/読み込み**: 作業中のプロジェクトを保存および読み込み、途中から作業を続けることができます。
- **設定の保存/読み込み**: 拡張機能で変更した設定を保存および読み込み、一貫性のある煩わしさのないワークフローを実現します。
- **画像のエクスポート**: 完成したページを印刷やデジタル配信に適した形式でエクスポート。
- **Text2Image**: ステーブルディフュージョンWebUI（Forge）を介してパネル内で直接画像を生成。
- **Image2Image**: ステーブルディフュージョンWebUI（Forge）を介してパネル内で直接画像を生成。
- **プロンプトキュー**: 同じページやパネルで簡単に異なるキャラクターバージョンを生成するためにプロンプトを一括キュー。
- **ペン/消しゴムツール**: 基本的なペンと消しゴムツール、線の幅、色、線のスタイル、影の変更。線や画像の一部を消去。
- **キャンバスのズームイン/ズームアウト**: 基本的なペンと消しゴムツール、線の幅、色、線のスタイル、影の変更。線や画像の一部を消去。

# デモサイト
[SP-MangaEditer](https://new-sankaku.github.io/SP-MangaEditer/)  
Text2Image / Image2Image機能を使用するには、Stable Diffusion WebUIに接続する必要があります。  

# インストール
https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker.git  
<img src="https://new-sankaku.github.io/SP-MangaEditer-docs/install.png" width="800">
*:すべての機能はデモサイト上で動作します。

## 貢献方法
- **バグ報告**: バグを発見した場合は、[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に新しい問題を作成し、タイトルに**[Bug]**を含めてください。
- **機能提案**: 新しい機能のアイデアがある場合は、[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に新しい問題を作成し、タイトルに**[Feature Request]**を含めてください。
- **ドキュメント改善**: ドキュメントに誤字やエラーがある場合は、可能な修正を含むプルリクエストを送信してください。また、必要に応じて[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に追加することもできます。

## コミュニケーション
プロジェクトに関する質問や議論がある場合は、[Issues](https://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker/issues)に投稿するか、[Discord](https://discord.gg/XCp7dyHj3N)サーバーに参加してください。

ありがとうございます！
