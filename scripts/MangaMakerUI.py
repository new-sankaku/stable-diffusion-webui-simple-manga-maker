import sys
import os
from modules import scripts, shared
import gradio as gr
from scripts import ImageManager  # noqa
import platform
import subprocess as sp
import pathlib
import typing
import html
import urllib.parse

from modules.ui_components import ToolButton
from modules import script_callbacks

komaGallary: gr.Gallery = None
work_img_component: gr.Image = None

try:
    root_path = pathlib.Path(__file__).resolve().parents[1]
except NameError:
    import inspect

    root_path = pathlib.Path(inspect.getfile(lambda: None)).resolve().parents[1]

def get_asset_url(
    file_path: pathlib.Path, append: typing.Optional[dict[str, str]] = None
) -> str:
    if append is None:
        append = {"v": str(os.path.getmtime(file_path))}
    else:
        append = append.copy()
        append["v"] = str(os.path.getmtime(file_path))
    return f"/file={file_path.absolute()}?{urllib.parse.urlencode(append)}"


# def write_config_file() -> pathlib.Path:
#     config_dir = root_path / "downloads"
#     config_dir.mkdir(mode=0o755, parents=True, exist_ok=True)
#     config_path = config_dir / "config.json"
#     return config_path


def open_folder(f):
    if shared.cmd_opts.hide_ui_dir_config:
        return

    if not os.path.exists(f):
        msg = f'Folder "{f}" does not exist. After you create an image, the folder will be created.'
        print(msg)
        # gr.Info(msg)  # gr.Infoを使用している場合、適切なUIライブラリのインポートが必要です。
        return
    elif not os.path.isdir(f):
        msg = f"""
WARNING
An open_folder request was made with an argument that is not a folder.
This could be an error or a malicious attempt to run code on your computer.
Requested path was: {f}
"""
        print(msg, file=sys.stderr)
        # gr.Warning(msg)  # gr.Warningを使用している場合、適切なUIライブラリのインポートが必要です。
        return

    path = os.path.normpath(f)
    if platform.system() == "Windows":
        os.startfile(path)
    elif platform.system() == "Darwin":
        sp.Popen(["open", path])
    elif "microsoft-standard-WSL2" in platform.uname().release:
        sp.Popen(["wsl-open", path])
    else:
        sp.Popen(["xdg-open", path])
 
def on_ui_tabs():
        print("[ui] Creating UI components")
        folder_symbol = '\U0001f4c2'  # 📂
        skip_symbol = '\U000023e9'  # ⏩
        new_symbol = '\U0001F195'  # 🆕
        apply_symbol = '\U00002714'  # ✔️
        apply_over_lay_symbol = '\U0001F5D7'  # 🗗
        flip_H_symbol = '\U00002194'  # ↔️
        reverse_symbol = '\U0001F501'  # 🔁
        save_symbol = '\U0001F4BE'  # 💾


 
        with gr.Blocks(analytics_enabled=False) as ui_component:
                with gr.Row():
                        infomation = ""
                        infomation = infomation + "1.Select manga panel Image. "
                        infomation = infomation + "2.Click New Image. "
                        infomation = infomation + "3.Select Apply Image. "
                        infomation = infomation + "4.Click Apply Image. "
                        gr.Markdown(f"<small>{infomation}</small>", show_label=False)       
                with gr.Row():
                        manga_panel_gallary = gr.Gallery(label='select manga panel image.', 
                                                        object_fit="contain",
                                                        show_label=True,
                                                        show_download_button="false",
                                                        show_share_button="false",
                                                        elem_id='manga_panel_gallary', 
                                                        columns=12,
                                                        height=250,
                                                        value=ImageManager.get_panel_paths, type="image")
                with gr.Row():
                        gr.Markdown(f"<small>**Panels folder:** {ImageManager.manga_panels_image_path}</small>", 
                                        show_label=False)
                with gr.Row():
                        with gr.Row():
                                with gr.Row():
                                        with gr.Group():
                                                new_image_button =  gr.Button(value=new_symbol+"New Image", size="sm")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                        with gr.Group():
                                                skip_button     =  gr.Button(value=skip_symbol+"Skip Number", size="sm")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                        with gr.Group():
                                                revert_button   = gr.Button(value=reverse_symbol+"Revert Change", size="sm")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                        with gr.Group():
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                with gr.Row():
                                        with gr.Group():
                                                apply_button    = gr.Button(value=apply_symbol+"Apply Image", size="sm")
                                                with gr.Accordion(label="Settings", open=True):
                                                        position_dropdown = gr.Dropdown(["Center", "Top-Left", "Top-Center", "Top-Right"
                                                                                        , "Bottom-Left", "Bottom-Center", "Bottom-Right"], 
                                                                                        value="Center", show_label=False, info="Clip Position", interactive=True)
                                        with gr.Group():
                                                flipH_button    = gr.Button(value=flip_H_symbol+"Flip Horizontal", size="sm")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                        with gr.Group():
                                                apply_overray_button   = gr.Button(value=apply_over_lay_symbol+"Apply Overray", size="sm")
                                                with gr.Accordion(label="Settings", open=False):
                                                        xSlider = gr.Slider(info="x axis", value=75, show_label=False, interactive=True)
                                                        ySlider = gr.Slider(info="Y axis", value=75, show_label=False, interactive=True)
                                                        zoomSlider = gr.Slider(info="Zoom",  value=80, show_label=False, interactive=True)
                                                        infomation = infomation + "x and y are the coordinates to which the center point of Apply Image is applied."
                                                        infomation = infomation + "It is assumed that transparent images will be used."
                                                        infomation = infomation + "The method for specifying x and y is difficult to use, so we may need to recreate it."
                                                        gr.Markdown(f"<small>{infomation}</small>", show_label=False)       
                                        with gr.Group():
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                                                gr.Markdown("")
                with gr.Row(): 
                        with gr.Row():
                                work_img_component = gr.Image(interactive=False,
                                                              height=600,
                                                              width=300, 
                                                              show_label=False,
                                                              image_mode="RGBA")
                        with gr.Row():
                                image_apply_component = gr.Image(label="select apply image", 
                                                                        height=600,
                                                                        width=300,
                                                                        show_label=True,
                                                                        image_mode="RGBA")
                with gr.Row():
                        with gr.Row():
                                with gr.Group():
                                        with gr.Row():
                                                save_button   = gr.Button(value=save_symbol+"Save Image", size="sm", min_width=70)                        
                                        with gr.Row():
                                                open_folder_button = ToolButton(folder_symbol, elem_id='MangaMaker_open_folder', 
                                                                        visible=not shared.cmd_opts.hide_ui_dir_config, tooltip="Open images output directory.")
                                with gr.Group():
                                        gr.Markdown("")
                                with gr.Group():
                                        gr.Markdown("")
                                with gr.Group():
                                        gr.Markdown("")
                        with gr.Row():
                                str = ""
                                str = str + "Next Number:" + "1\n"
                                infomationTextBox = gr.Textbox(value=str, lines=2, interactive="False", label="Infomation")

                # with gr.Row():
                #         information = "\n"
                #         information += "1.You can edit it below.  "
                #         information += "2.Make any edits.  "
                #         information += '3.Click <span style="font-weight:bold; color:red;">Send to Manga</span> in the Menu.  '
                #         gr.Markdown(f'<small>{information}</small>', show_label=False)

                # with gr.Row():
                #         # config = {"config": get_asset_url(write_config_file()) or ""}
                #         html_url = get_asset_url(root_path / "miniPaint-minimum" / "index.html", None)
                #         gr.HTML(
                #         f"""
                #         <iframe id="manga_minipaint_iframe" src="{html.escape(html_url)}" style="height:800px; width:100%;" onload="a1111minipaint.onload()"></iframe>
                #         """
                #         )

                new_image_button.click(fn=ImageManager.new_image, inputs=[], outputs=[work_img_component, infomationTextBox])
                skip_button.click(fn=ImageManager.skip_apply_number, inputs=[], outputs=[infomationTextBox])
                apply_button.click(fn=ImageManager.apply_image, inputs=[work_img_component, position_dropdown], outputs=[work_img_component, infomationTextBox])
                apply_overray_button.click(fn=ImageManager.apply_overray, inputs=[work_img_component, xSlider, ySlider, zoomSlider], outputs=[work_img_component] )
                save_button.click(fn=ImageManager.save_image, inputs=[work_img_component], outputs=[infomationTextBox])

                manga_panel_gallary.select(fn=ImageManager.on_manga_panel_gallary_selected, inputs=[], outputs=[infomationTextBox])

                image_apply_component.select(fn=ImageManager.select_image_gallary, inputs=[image_apply_component], outputs=[])
                image_apply_component.change(fn=ImageManager.select_image_gallary, inputs=[image_apply_component], outputs=[])
                image_apply_component.upload(fn=ImageManager.select_image_gallary, inputs=[image_apply_component], outputs=[])
                
                revert_button.click(fn=ImageManager.revert_image, inputs=[], outputs=[work_img_component, infomationTextBox] )
                flipH_button.click(fn=ImageManager.flipH_image, inputs=[image_apply_component], outputs=[image_apply_component] )

                open_folder_button.click(
                fn=lambda: open_folder(shared.opts.outdir_save),
                inputs=[],
                outputs=[],
                )

        return [(ui_component, "Manga Maker", "manga_maker_tab")]

script_callbacks.on_ui_tabs(on_ui_tabs)