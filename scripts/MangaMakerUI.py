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


def generate_svg_image_tags():
    folder_path = root_path / "SP-MangaEditer" / "mangaPanelsImage"
    print( f"folder_path : {folder_path}" );
    svg_files = [file for file in folder_path.glob('*.svg')]
    image_tags = []
    for file in svg_files:
        file_path = str(file)
        tag = f'<img src="{file_path}" onclick="if (confirm(\'new Image?\')) {{ loadSVG(\'{file_path}\'); }}">'
        image_tags.append(tag)

    return ''.join(image_tags)


def get_asset_url(file_path: pathlib.Path) -> str:
    return f"/file={file_path.absolute()}"

def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as blocks:
        create_ui()
    return [(blocks, "SP-MangaEditer", "sp_manga_editer_tab")]

def create_ui():
    
    html_url = get_asset_url(root_path / "SP-MangaEditer" / "index.html")
    svg_files_html = generate_svg_image_tags()  # SVG画像のタグを生成

    with gr.Tabs(elem_id="sp_manga_editer_main"):
        gr.HTML(
            f"""
            <style>
                body, html {{
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: hidden;
                }}
                #sp_manga_editer_iframe {{
                    width: 100%;
                    height: 82vh;
                    border: none;
                }}
            </style>
            <iframe id="sp_manga_editer_iframe" src="{html.escape(html_url)}"></iframe>
            """
        )

try:
    from modules import script_callbacks

    script_callbacks.on_ui_tabs(on_ui_tabs)
except ImportError:
    print("ImportError")
