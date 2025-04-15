import html
import pathlib
import urllib.parse
from modules import script_callbacks
import gradio as gr

try:
    root_path = pathlib.Path(__file__).resolve().parents[1]
except NameError:
    import inspect
    root_path = pathlib.Path(inspect.getfile(lambda: None)).resolve().parents[1]

dir_path = html.escape(str(root_path / "index.html"))

def get_asset_url(file_path: pathlib.Path) -> str:
    timestamp = int(pathlib.Path(file_path).stat().st_mtime)
    return f"/file={file_path.absolute()}?v={timestamp}"

def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as blocks:
        create_ui()
    return [(blocks, "SP-MangaEditer", "sp_manga_editer_tab")]

def create_ui():

    with gr.Tabs(elem_id="sp_manga_editer_main"):
        gr.HTML(
            f"""
            <style>
                #sp_manga_editer_iframe {{
                    width: 100%;
                    height: 85vh;
                    border: none;
                }}
                #sp_manga_editer_main {{
                    overflow-y: hidden;
                    overflow-x: hidden;
                }}
                .sp_notice {{
                    font-size: 14px;
                    margin-bottom: 10px;
                }}
            </style>
            <div class="sp_notice">
                <p>【日本語】<br>
                ExtensionとしてのSP-MangaEditerはサポートを終了しました。インストールディレクトリにあるindex.htmlを起動することでローカルHtmlとして従来の機能が利用できます（{dir_path}）。なお、API設定を変更する必要があります。</p><br>
                <p>【English】<br>
                Support for the SP-MangaEditer extension has ended. You can continue using previous features by launching index.html from the installation directory as a local HTML file ({dir_path}). Note: You need to change the API settings.</p><br>
                <p>【中文】<br>
                SP-MangaEditer 扩展已停止支持。请通过启动安装目录中的 index.html 作为本地 HTML 来继续使用旧功能（{dir_path}）。注意：需要更改 API 设置。</p><br>
                <p>【Deutsch】<br>
                Die Unterstützung für die SP-MangaEditer-Erweiterung wurde eingestellt. Sie können die bisherigen Funktionen weiterhin nutzen, indem Sie die index.html im Installationsverzeichnis ({dir_path}) als lokale HTML-Datei öffnen. Hinweis: Die API-Einstellungen müssen geändert werden.</p><br>
                <p>【Русский】<br>
                Поддержка расширения SP-MangaEditer завершена. Вы можете продолжать использовать старые функции, запустив index.html из каталога установки ({dir_path}) как локальный HTML-файл. Примечание: необходимо изменить настройки API.</p>
            </div>
            """
        )

try:
    from modules import script_callbacks

    script_callbacks.on_ui_tabs(on_ui_tabs)
except ImportError:
    print("ImportError")
