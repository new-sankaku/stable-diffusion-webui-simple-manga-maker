import sys
import os
sys.path.append(os.path.dirname(__file__))

from modules import scripts
import gradio as gr
import ImageManager

komaGallary: gr.Gallery = None
work_img_component: gr.Image = None

class MangaMakerExtensionScript(scripts.Script):
        def get_image(image_path):
                with open(image_path, "rb") as file:
                        return file.read()
                
        def title(self):
                # title = "Derived Script"
                # print("[title] Title of the script:", title)
                return "Manga Maker"
        
        def show(self, is_img2img):
                if is_img2img:
                        return False    
                else:
                        return scripts.AlwaysVisible
                
        def ui(self, is_img2img):
                is_img2img = False
                print("[ui] Creating UI components")
                print("[ui] is_img2img:", is_img2img)
                with gr.Accordion('Manga Maker', open=False):
                        with gr.Row():
                                infomation = ""
                                infomation = infomation + "1.Select manga panel Image.\n"
                                infomation = infomation + "2.Click New Image.\n"
                                infomation = infomation + "3.Select Apply Image.\n"
                                infomation = infomation + "4.Click Apply Image.\n"
                                gr.Markdown(f"<small>{infomation}</small>", show_label=False)       
                        with gr.Row():
                                manga_panel_gallary = gr.Gallery(label='select manga panel image.', 
                                                                show_label=True,
                                                                show_download_button="false",
                                                                show_share_button="false",
                                                                elem_id='manga_panel_gallary', 
                                                                columns=6,
                                                                height=280,
                                                                value=ImageManager.get_panel_paths, type="image")
                        with gr.Row():
                                gr.Markdown(f"<small>**Panels folder:** {ImageManager.manga_panels_image_path}</small>", show_label=False)
                        with gr.Row():
                                #選択されているコマを元にNew Image
                                new_image_button =  gr.Button(value="New Image")
                                #選択された生成画像を当てはめます。
                                apply_button    = gr.Button(value="Apply Image")
                        with gr.Row():
                                #現在表示されている枠をスキップ
                                skip_button     =  gr.Button(value="Skip Number")
                                save_button   = gr.Button(value="Save Image")

                                        # #当てはめた生成画像を元に戻す
                                        # revert_button   = gr.Button(value="Revert Changes")
                        with gr.Row():
                                with gr.Row():
                                        work_img_component = gr.Image(interactive=False, show_label=False)
                                with gr.Row():
                                        image_gallary_component = gr.Image(label="select apply image", show_label=True)
                        with gr.Row():
                                        str = ""
                                        str = str + "Next Number:" + "1\n"
                                        infomationTextBox = gr.Textbox(value=str, lines=5, interactive="False", label="Infomation")

                apply_button.click(fn=ImageManager.apply_image, 
                                   inputs=[], outputs=[work_img_component, infomationTextBox])
                
                save_button.click(fn=ImageManager.save_image, 
                                   inputs=[], outputs=[infomationTextBox])
                # revert_button.click(fn=ImageManager.revert_image, 
                #                    inputs=[], outputs=[work_img_component, infomationTextBox])
                skip_button.click(fn=ImageManager.skip_apply_number, 
                                   inputs=[], outputs=[infomationTextBox])
                new_image_button.click(fn=ImageManager.new_image, 
                                   inputs=[], outputs=[work_img_component, infomationTextBox])
                
                manga_panel_gallary.select(fn=ImageManager.on_manga_panel_gallary_selected, 
                                   inputs=[], outputs=[infomationTextBox])
                
                image_gallary_component.select(fn=ImageManager.select_image_gallary, inputs=[image_gallary_component], outputs=[])
                image_gallary_component.change(fn=ImageManager.select_image_gallary, inputs=[image_gallary_component], outputs=[])
                image_gallary_component.upload(fn=ImageManager.select_image_gallary, inputs=[image_gallary_component], outputs=[])
                
                return [apply_button, skip_button, new_image_button, 
                        infomationTextBox, work_img_component, image_gallary_component, manga_panel_gallary ]

        # def postprocess(self, p, processed, *args):
                # print("[postprocess] Postprocessing")
                # print("[postprocess] p (JSON):", p)
                # print("[postprocess] processed (JSON):", processed)
                # print("[postprocess] args:", args)