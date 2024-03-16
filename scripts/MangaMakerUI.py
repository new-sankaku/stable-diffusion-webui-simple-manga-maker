import sys
import os
sys.path.append(os.path.dirname(__file__))

from modules import scripts
import gradio as gr
import ImageManager

from modules import script_callbacks

komaGallary: gr.Gallery = None
work_img_component: gr.Image = None

 
def on_ui_tabs():
        print("[ui] Creating UI components")
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
                                                        height=270,
                                                        value=ImageManager.get_panel_paths, type="image")
                with gr.Row():
                        gr.Markdown(f"<small>**Panels folder:** {ImageManager.manga_panels_image_path}</small>", 
                                        show_label=False)
                with gr.Row():
                        with gr.Row():
                                new_image_button =  gr.Button(value="New Image", size="sm", min_width=150)
                                skip_button     =  gr.Button(value="Skip Number", size="sm", min_width=150)
                        with gr.Row():
                                apply_button    = gr.Button(value="Apply Image", size="sm", min_width=150)
                                flipH_button    = gr.Button(value="Flip Horizontal", size="sm", min_width=150)
                        with gr.Row():
                                # apply_overray_button   = gr.Button(value="Apply Overray(Transparency)", size="sm", min_width=150)
                                revert_button   = gr.Button(value="Revert Changes", size="sm", min_width=150)
                                save_button   = gr.Button(value="Save Image", size="sm", min_width=150)
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
                # with gr.Row():
                #         with gr.Row():
                #                 slider = gr.Slider(value=75, minimum=1, maximum=100, label="Overlay X-Point", info="1-100")
                #         with gr.Row():
                #                 gr.Markdown( "" )
                with gr.Row():
                        with gr.Row():
                                        str = ""
                                        str = str + "Next Number:" + "1\n"
                                        infomationTextBox = gr.Textbox(value=str, lines=4, interactive="False", label="Infomation")

                apply_button.click(fn=ImageManager.apply_image, inputs=[work_img_component], outputs=[work_img_component, infomationTextBox])
                save_button.click(fn=ImageManager.save_image, inputs=[work_img_component], outputs=[infomationTextBox])
                skip_button.click(fn=ImageManager.skip_apply_number, inputs=[], outputs=[infomationTextBox])
                new_image_button.click(fn=ImageManager.new_image, inputs=[], outputs=[work_img_component, infomationTextBox])
                
                manga_panel_gallary.select(fn=ImageManager.on_manga_panel_gallary_selected, inputs=[], outputs=[infomationTextBox])
                
                image_apply_component.select(fn=ImageManager.select_image_gallary, inputs=[image_apply_component], outputs=[])
                image_apply_component.change(fn=ImageManager.select_image_gallary, inputs=[image_apply_component], outputs=[])
                image_apply_component.upload(fn=ImageManager.select_image_gallary, inputs=[image_apply_component], outputs=[])
                
                revert_button.click(fn=ImageManager.revert_image, inputs=[], outputs=[work_img_component, infomationTextBox] )
                flipH_button.click(fn=ImageManager.flipH_image, inputs=[image_apply_component], outputs=[image_apply_component] )
                # apply_overray_button.click(fn=ImageManager.apply_overray, inputs=[image_apply_component, slider], outputs=[image_apply_component] )

        return [(ui_component, "Manga Maker", "manga_maker_tab")]

script_callbacks.on_ui_tabs(on_ui_tabs)