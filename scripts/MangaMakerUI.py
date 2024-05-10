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


def get_asset_url(file_path: pathlib.Path) -> str:
    return f"/file={file_path.absolute()}"

def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as blocks:
        create_ui()
    return [(blocks, "SP-MangaEditer", "sp_manga_editer_tab")]

def create_ui():
    
    html_url = get_asset_url(root_path / "SP-MangaEditer" / "index.html")


    with gr.Tabs(elem_id="sp_manga_editer_main"):
        gr.HTML(
            f"""
            <style>
                #sp_manga_editer_iframe {{
                    width: 100%;
                    height: 85vh;
                    border: none;
                }}
                #sp_manga_editer_main{{
                    overflow-y: hidden;
                    overflow-x: hidden;
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
