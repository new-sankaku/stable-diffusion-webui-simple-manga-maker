import sys
import os
sys.path.append(os.path.dirname(__file__))
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
from modules import scripts, shared
import random
import os
import cv2
import gradio as gr
import ImageProcessing
from datetime import datetime

manga_panels_image_path = scripts.basedir() + '\mangaPanelsImage'
manga_panels_image_info_path = scripts.basedir() + '\mangaPanelsImage_Info'

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
        now_working_image = cv2.imread(image_filename)
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
    print(f"image_history count: {len(image_history)}")
    image_history = []
    print(f"image_history count: {len(image_history)}")
    image_history.append(now_working_image)
    print(f"image_history count: {len(image_history)}")
    return now_working_image, result

def select_image_gallary(image):
    global select_apply_image

    if isinstance(image, Image.Image):
        image = np.array(image.convert('RGBA'))

    select_apply_image = image

def apply_image(now_working_image) :
    print("apply_image now_working_image:", type(now_working_image))

    global select_apply_image
    global now_working_number
    global now_working_max_number
    global now_manga_panel_image_path
    global now_black_lines_plus_number_mask
    global now_black_lines_mask

    global image_history
    print(f"image_history count: {len(image_history)}")
    image_history.append(now_working_image)
    print(f"image_history count: {len(image_history)}")

    center_x, center_y = ImageProcessing.get_panel_center(now_numbers_panel_json_path, now_working_number)
    seed_point = (center_x, center_y)

    manga_panel_image = cv2.imread(now_manga_panel_image_path)

    panel_coords = ImageProcessing.find_comic_panel_coords(manga_panel_image, seed_point)
    combined_image = ImageProcessing.warp_insert_image_improved(now_working_image, select_apply_image, panel_coords)

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
    
    # 指定したパスにフォルダが存在しない場合は作成
    if not os.path.exists(outputPath):
        os.makedirs(outputPath)
    
    # BGRからRGBに画像を変換
    rgb_image = cv2.cvtColor(work_img_component, cv2.COLOR_BGR2RGB)
    
    # RGB画像を保存
    cv2.imwrite(fullPath, rgb_image)
    return f"Save:\n{fullPath}"

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

def apply_overray(image_apply_component, slider) :
    print("apply_overray image_apply_component:", type(image_apply_component))
    print("apply_overray slider       :", type(slider))
    # apply_overray image_apply_component: <class 'numpy.ndarray'>
    # apply_overray slider       : <class 'float'>

    return image_apply_component

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