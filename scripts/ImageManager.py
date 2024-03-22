from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
from modules import scripts, shared
import random
import os
import cv2
import gradio as gr
from scripts import ImageProcessing  # noqa
from datetime import datetime

base_dir = Path(scripts.basedir())
manga_panels_image_path = base_dir / 'mangaPanelsImage'
manga_panels_image_info_path = base_dir / 'mangaPanelsImage_Info'

manga_panels_image_paths = None

now_manga_panel_image_path = None
now_working_number = None
now_working_max_number = None
now_numbers_panel_json_path = None
now_black_lines_mask = None
now_black_lines_plus_number_mask = None

select_apply_image = None

black_line = "BlackLine"

image_history = []

def on_manga_panel_gallary_selected(evt: gr.SelectData):
    global now_manga_panel_image_path

    print(f"You selected {evt.value} at {evt.index} from {evt.target}")
    print(f"manga panel filePath:{manga_panels_image_paths[evt.index]}")
    now_manga_panel_image_path = manga_panels_image_paths[evt.index]
    return None

def new_image() :
    print("new_image")

    global now_manga_panel_image_path
    global now_numbers_panel_json_path
    global now_working_number
    global now_working_max_number
    global now_black_lines_plus_number_mask
    global now_black_lines_mask

    if now_manga_panel_image_path is None:
        print("Worning:please select manga panel image.")
        return None, None
    
    print(f"now_manga_panel_image_path:{now_manga_panel_image_path}")

    json_filename = ImageProcessing.getImagePlusJsonFileName(now_manga_panel_image_path)
    image_filename = ImageProcessing.getImagePlusNumberFileName(now_manga_panel_image_path)

    now_working_image = None

    if os.path.exists(json_filename):
        now_numbers_panel_json_path = json_filename
        now_working_image = cv2.imread(str(image_filename))
    else:
        numbers_panel_image, json_filename = ImageProcessing.find_comic_panel_coords_and_save(now_manga_panel_image_path);
        now_numbers_panel_json_path = json_filename
        now_working_image = numbers_panel_image

    now_manga_panel_image = cv2.imread(now_manga_panel_image_path)
    now_black_lines_mask = ImageProcessing.extract_black_lines(now_manga_panel_image)
    now_black_lines_plus_number_mask = ImageProcessing.extract_black_lines(now_working_image)

    now_working_max_number = ImageProcessing.get_max_panel_number(now_numbers_panel_json_path)
    now_working_number = 1

    result = ImageProcessing.createInfomation( now_numbers_panel_json_path, now_working_number, now_working_max_number )

    global image_history
    image_history = []
    image_history.append(now_working_image)
    return now_working_image, result

def select_image_gallary(image):
    global select_apply_image

    if isinstance(image, Image.Image):
        image = np.array(image.convert('RGBA'))

    select_apply_image = image

def apply_image(now_working_image, position_dropdown) :
    print("apply_image now_working_image:", type(now_working_image))

    global select_apply_image
    global now_working_number
    global now_working_max_number
    global now_manga_panel_image_path
    global now_black_lines_plus_number_mask
    global now_black_lines_mask

    global image_history
    image_history.append(now_working_image)

    center_x, center_y = ImageProcessing.get_panel_center(now_numbers_panel_json_path, now_working_number)
    seed_point = (center_x, center_y)
    manga_panel_image = cv2.imread(now_manga_panel_image_path)

    panel_coords = ImageProcessing.find_comic_panel_coords(manga_panel_image, seed_point)

    combined_image = ImageProcessing.warp_insert_image_improved(now_working_image, select_apply_image, panel_coords, position_dropdown)

    (x, y, w, h) = cv2.boundingRect(panel_coords)
    now_black_lines_plus_number_mask = ImageProcessing.remove_black_lines_in_insert_area(now_black_lines_plus_number_mask, 
                                                                                         x, y, w, h)

    final_image = ImageProcessing.apply_black_lines(combined_image, now_black_lines_plus_number_mask)
    final_image = ImageProcessing.apply_black_lines(combined_image, now_black_lines_mask)

    now_working_number = now_working_number + 1;

    resultInfomation = ImageProcessing.createInfomation( now_numbers_panel_json_path, now_working_number, now_working_max_number )

    return final_image, resultInfomation

def save_image( work_img_component ):
    print("save_image image_apply_component:", type(work_img_component))
    print(f"save_image:{scripts.basedir()}")
    fileName = "MangaMaker"

    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    fileName = f"{fileName}_{current_time}.png"
    outputPath = os.path.join(shared.opts.outdir_save, "manga-maker")
    fullPath = os.path.join(outputPath, fileName)
    fullPath = os.path.abspath(fullPath)

    # 指定したパスにフォルダが存在しない場合は作成
    if not os.path.exists(outputPath):
        os.makedirs(outputPath)
    
    # BGRからRGBに画像を変換
    rgb_image = cv2.cvtColor(work_img_component, cv2.COLOR_BGR2RGB)
    
    # RGB画像を保存
    cv2.imwrite(fullPath, rgb_image)

    result = f"Save:{fullPath}"
    result = result + "\n"
    result = result + "\n" + "If you want to change the save destination, please change the following."
    result = result + "\n" + "\"Settings\" tab, \"Paths for saving\", \"Directory for saving images using the Save button\""

    return result

def revert_image():
    print("revert_image")
    
    global image_history
    global now_working_number, now_working_max_number, now_numbers_panel_json_path

    previous_image = None

    print(f"image_history count: {len(image_history)}")
    if image_history:
        previous_image = image_history.pop()
        if not image_history:
            image_history.append(previous_image)
        now_working_number = now_working_number - 1
        if now_working_number < 1 :
            now_working_number = 1
    else:
        previous_image = None
        print("Reverted to the initial image.")

    print(f"image_history count: {len(image_history)}")
    resultInfomation = ImageProcessing.createInfomation( now_numbers_panel_json_path, now_working_number, now_working_max_number )
    return previous_image, resultInfomation

def flipH_image(image_apply_component):
    print("flipH_image image_apply_component:", type(image_apply_component))

    if isinstance(image_apply_component, np.ndarray):
        flipped_image = np.flip(image_apply_component, axis=1)
        return flipped_image
    else:
        print("flipH_image error, not found image.")
        return image_apply_component  # 変更なしで返す

def resize_and_maintain_aspect_ratio(image, base_height, base_width, zoom_percentage):
    """
    画像のサイズを変更し、アスペクト比を保ちます。
    """
    height, width = image.shape[:2]
    if height > width:
        scale = base_height / height
    else:
        scale = base_width / width
    
    # Zoom factorを考慮してscaleを調整
    scale *= zoom_percentage / 100
    
    new_width = int(width * scale)
    new_height = int(height * scale)
    
    resized_image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    return resized_image





def apply_overray(work_img_component, xSlider, ySlider, zoomSlider):
    print("apply_overray work_img_component:", type(work_img_component))

    print("apply_overray xSlider:", xSlider)
    print("apply_overray ySlider:", ySlider)
    print("apply_overray zoomSlider:", zoomSlider)

    global select_apply_image
    global image_history
    image_history.append(work_img_component)

    # 画像をPIL.Imageオブジェクトに変換
    work_image = Image.fromarray(work_img_component).convert("RGBA")
    apply_image = Image.fromarray(select_apply_image).convert("RGBA")

    # apply_imageのリサイズ（アスペクト比を維持）
    ratio = max(work_image.width / apply_image.width, work_image.height / apply_image.height)
    new_size = (int(apply_image.width * ratio), int(apply_image.height * ratio))
    apply_image_resized = apply_image.resize(new_size, Image.ANTIALIAS)

    # zoomSliderを適用してさらにリサイズ
    zoom_factor = zoomSlider / 100
    zoomed_size = (int(new_size[0] * zoom_factor), int(new_size[1] * zoom_factor))
    apply_image_zoomed = apply_image_resized.resize(zoomed_size, Image.ANTIALIAS)

    # apply_imageをwork_imageの指定位置に合成するための準備
    # まずはwork_imageと同じサイズの透明画像を作成
    overlay_image = Image.new("RGBA", work_image.size, (255, 255, 255, 0))

    # overlay_image とapply_image_zoomedの縦横サイズを取得
    overlay_height, overlay_width = overlay_image.size
    apply_zoomed_height, apply_zoomed_width = apply_image_zoomed.size

    # overlay_image とapply_image_zoomedの縦横サイズをprintで出力
    print(f"overlay_image      height_width {overlay_height}_{overlay_width}")
    print(f"apply_image_zoomed height_width {apply_zoomed_height}_{apply_zoomed_width}")

    print(f"xSlider_ySlider {xSlider}_{ySlider}")

    x = int(overlay_height * (xSlider / 100))
    y = int(overlay_width * (ySlider / 100))

    # apply_image_zoomedの幅と高さを取得
    apply_width, apply_height = apply_image_zoomed.size

    # apply_image_zoomedの中心が(x, y)に来るように調整
    adjusted_x = x - (apply_width // 2)
    adjusted_y = y - (apply_height // 2)

    # 調整した位置でapply_image_zoomedをoverlay_imageに貼り付ける
    overlay_image.paste(apply_image_zoomed, (adjusted_x, adjusted_y), apply_image_zoomed)


    # 最終的な画像を合成
    final_image = Image.alpha_composite(work_image, overlay_image)

    # 結果をnumpy配列に変換して返す
    final_img_array = np.array(final_image)
    return final_img_array

    image_history.append(work_img_component)

    print("apply_overray image_apply_component select_apply_image:", type(select_apply_image))
    work_image = ImageProcessing.convertRGBA(work_img_component)
    apply_image = ImageProcessing.convertRGBA(select_apply_image)

    workHeight, workWidth = ImageProcessing.get_height_and_width(work_image)
    applyHeight, applyWidth = ImageProcessing.get_height_and_width(apply_image)

    #★apply_imageの縮尺を変更します。
    #★apply_imageのサイズをwork_imageの縦横いずれか大きい方に合わせてアクセプト比を保ったままサイズを変更します。
    #★変更したapply_imageのサイズをwork_imageのサイズのzoomSliderの数値％にします。
    #★zoomSliderは80等の数値が入ります。
    #★縮尺の変更では縦長、横長の画像に対応してください。

    #★work_imageにapply_imageを上書きします。
    #★上書き位置はX軸がxSlider、Y軸がySliderです。
    #★上書き時にwork_imageの領域をはみ出ないように対応してください。
    #★また、アルファブレンディングを行ってください。

    #★出来上がった画像をfinal_img_arrayに入れて返します。
    final_img_array = None
    return final_img_array


def skip_apply_number() :
    global now_numbers_panel_json_path
    global now_working_number
    global now_working_max_number
    
    now_working_number = now_working_number + 1;
    result = ImageProcessing.createInfomation( now_numbers_panel_json_path, now_working_number, now_working_max_number )
    result = result
    return result

def get_panel_paths():
    global manga_panels_image_paths

    panel_image_paths = [os.path.join(manga_panels_image_path, filename) for filename in os.listdir(manga_panels_image_path) 
                        if filename.endswith(('.png')) and black_line not in filename]
    manga_panels_image_paths = panel_image_paths
    return panel_image_paths

def get_first_panel():
    first_koma_image_path = get_first_panel_path()
    first_koma_image = cv2.imread(first_koma_image_path)
    return first_koma_image

@staticmethod
def get_first_panel_path():
    first_koma_image_path = None
    for filename in os.listdir(manga_panels_image_path):
        if filename.endswith('.png') and black_line not in filename:
            first_koma_image_path = os.path.join(manga_panels_image_path, filename)
            break
    return first_koma_image_path


def get_random_panel():
    koma_images = []
    for filename in os.listdir(manga_panels_image_path):
        if filename.endswith('.png') and black_line not in filename:
            koma_images.append(os.path.join(manga_panels_image_path, filename))

    if not koma_images:
        return None

    random_koma_image_path = random.choice(koma_images)
    print(f"random_koma_image_path:{random_koma_image_path}")
    random_koma_image = cv2.imread(random_koma_image_path)
    return random_koma_image

# def get_first_pamel_

# # 推奨される変数名（スネークケース）
# manga_panels_image_path = "/path/to/manga/panels"

# # クラス名（キャメルケース）
# class MangaPanelLoader:
#     pass

# # 定数（大文字のスネークケース）
# MAX_PANELS = 100