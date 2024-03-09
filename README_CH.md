For emergencies, please click here.
https://twitter.com/hypersankaku2

install
・For Stable Diffusion WebUI
Click the Extensions tab, then click the Install from URL inner tab. Paste the repository URL below and click Install.
https://github.com/new-sankaku/stable-diffusion-webui-metadata-marker.git

・When downloading directly:
Unzip the downloaded zip file to the "extensions" folder of WebUI.

Explanation of Extensions
Images create files starting with the name "metadata_" in the "txt2img-images" folder.
Draw generation information and system information on the output image.
The generation time is about 1 second shorter than the number of seconds displayed on the Web UI, so please treat it as a reference.
Also, you can add any text.
This extension is effective when it is troublesome to open an image file as a text file. I think it is useful when pasting images to Twitter or Discord, which deletes the generation information in the image file.
Any text may include information such as copyright.
The generated information to be drawn is as follows.
Prompt, Nefative Prompt, Steps, Sampler, CFG scale, Seed, Size ,Model, Model hash
The drawing is the following 6 patterns.
Overlay, Overlay Center on the image.
Create margins on either the top, bottom, left, or right.
You can change the following when drawing:
Font, font size, font color, background color, background color opacity, arbitrary text.
If there is a feature you would like to add, please request it.
I will respond if possible.

ーー

急用の際はこちらにどうぞ。
https://twitter.com/hypersankaku2

インストール
・Stable Diffusion WebUIの場合
[拡張機能] タブをクリックし、 [URL からインストール] 内部タブをクリックします。 以下のリポジトリの URL を貼り付け、「インストール」をクリックします。
https://github.com/new-sankaku/stable-diffusion-webui-metadata-marker.git

・直接ダウンロードする場合:
ダウンロードしたZipファイルをWebUIの「extensions」フォルダに解凍します。

Extensionの説明
画像は"txt2img-images"フォルダに”metadata_”という名前から始まるファイルを作成します。
出力する画像に生成情報、システム情報を描画します。
生成時間はWeb UIで表示される秒数より1秒程度短いので、参考程度に扱ってください。
また、任意のテキストを追加できます。
画像ファイルをテキストファイルとして開くのがめんどくさい場合、このExtensionは有効です。画像ファイル内の生成情報を削除してしまうTwitterやDiscordに画像を貼り付ける場合、役に立つと思います。
任意のテキストにコピーライトのような情報を含めても良いでしょう。
描画される生成情報は以下です。
Prompt, Nefative Prompt, Steps, Sampler, CFG scale, Seed, Size ,Model, Model hash
描画は以下の6パターンです。
画像にOverlay, Overlay Centerします。
上下左右のいずれかに余白を作ります。
描画時に以下を変更できます。
フォント、フォントサイズ、フォント色、背景色、背景色不透明度、任意のテキスト。
追加したい機能があればリクエストしてください。
私に可能であれば対応します。