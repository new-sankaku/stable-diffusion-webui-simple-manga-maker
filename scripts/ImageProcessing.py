import sys
import os
sys.path.append(os.path.dirname(__file__))

import ImageManager
import cv2
import numpy as np
import json
import math
from datetime import datetime


def createInfomation(jsonFile, next_working_number, now_working_max_number):

    if next_working_number > now_working_max_number : 
        return f"completed."

    width, height = get_dimensions(jsonFile, next_working_number)
    simplified_width, simplified_height = get_aspect_ratio(width, height)

    # suggestionWidth, suggestionHeight = adjust_dimensions(simplified_width, simplified_height)

    result = ""
    result = result + f"Next Number : {next_working_number}\n"
    result = result + f"Next Panel Size : X={width}, Y={height}\n"
    result = result + f"Next Accept Ratio : X={simplified_width}, Y={simplified_height}\n"
    return result

# 簡素化された幅と高さを元に、それらが一定のサイズを超えるまで倍増させる
def adjust_dimensions(simplified_width, simplified_height):
    start_simplified_width = simplified_width
    start_simplified_height = simplified_height

    while simplified_width <= 1024 and simplified_height <= 1024:
        simplified_width += start_simplified_width * 8
        simplified_height += start_simplified_height * 8
        if simplified_width > 1024 or simplified_height > 1024:
            break
    
    return simplified_width, simplified_height

# 幅と高さからアスペクト比を求め、それを最も簡単な形で返す
def get_aspect_ratio(width, height):
    width = width // 8
    height = height // 8

    gcd_value = math.gcd(width, height)
    
    simplified_width = width // gcd_value
    simplified_height = height // gcd_value

    return simplified_width, simplified_height

# 黒線が追加された画像のファイル名を生成する
def getBlackLineFileName(image_path):
    print(f"getBlackLineFileName image_path:{image_path}")
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    image_filename = f"{base_name}_black_line.png"
    return ImageManager.manga_panels_image_info_path + "\\" + image_filename

# 通し番号が追加された画像のファイル名を生成する
def getImagePlusNumberFileName(image_path):
    print(f"getImagePlusNumberFileName image_path:{image_path}")
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    image_filename = f"{base_name}_plus_number.png"
    return ImageManager.manga_panels_image_info_path + "\\" + image_filename

# パネル情報が含まれるJSONファイルの名前を生成する
def getImagePlusJsonFileName(image_path):
    print(f"getImagePlusJsonFileName image_path:{image_path}")
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    json_filename = f"{base_name}_plus_panel.json"
    return ImageManager.manga_panels_image_info_path + "\\" + json_filename

# 現在の日時を含んだ画像ファイル名を生成する
def getImageFileNamePlusyyyyMMddhhmmss(image_path):
    current_time = datetime.now().strftime("%Y%m%d%H%M%S")
    print(f"getImageFileNamePlusyyyyMMddhhmmss image_path:{image_path}")
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    json_filename = f"{base_name}_Insert_{current_time}.png"
    return ImageManager.manga_panels_image_info_path + "\\" + json_filename

# JSONファイルから指定された番号のパネルの幅と高さを計算します。
def get_dimensions(json_file_path, number):
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    coordinates = data[str(number)]

    x_coords = [coord['x'] for coord in coordinates]
    y_coords = [coord['y'] for coord in coordinates]
    
    width = max(x_coords) - min(x_coords)
    height = max(y_coords) - min(y_coords)
    return width, height

# JSONファイルから最大のパネル番号を取得します。
def get_max_panel_number(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    panel_numbers = [int(number) for number in data.keys()]
    max_panel_number = max(panel_numbers)
    return max_panel_number

# JSONファイルから指定されたパネルの中心座標を計算します。
def get_panel_center(json_file_path, panel_number):
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    
    panel_coords = data[str(panel_number)]
    
    sum_x = sum_y = 0
    for coord in panel_coords:
        sum_x += coord['x']
        sum_y += coord['y']
    center_x = sum_x // len(panel_coords)
    center_y = sum_y // len(panel_coords)
    
    return center_x, center_y

# 輪郭を左上の角でソートします。画像内のオブジェクトを左上から右下へ順に並べます。
def sort_contours_by_top_left_corner(contours):
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    contours_with_bb = zip(contours, bounding_boxes)
    sorted_contours_with_bb = sorted(contours_with_bb, key=lambda b: b[1][0] + b[1][1])
    sorted_contours = [c[0] for c in sorted_contours_with_bb]
    return sorted_contours

# 輪郭を水平方向にソートします。主に左から右への順序でオブジェクトを並べ替える際に使用します。
def sort_contours_horizontally(contours):
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    contours_with_bb = zip(contours, bounding_boxes)
    sorted_contours = sorted(contours_with_bb, key=lambda b: b[1][0])
    return [c[0] for c in sorted_contours]


# 通し番号付きの画像を生成し、ファイル名をカスタマイズして保存する
def find_comic_panel_coords_and_save(image_path):
    img = cv2.imread(image_path)
    temp_img = img.copy()

    gray = cv2.cvtColor(temp_img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
    thresh = cv2.bitwise_not(thresh)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    contours = sort_contours_by_top_left_corner(contours)

    panels_info = {}
    panel_number = 1
    total_pixels = temp_img.shape[0] * temp_img.shape[1]
    for cnt in contours:
        if cv2.contourArea(cnt) < 1000:
            continue
        epsilon = 0.01 * cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, epsilon, True)

        if len(approx) >= 4:
            M = cv2.moments(cnt)
            cx, cy = int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]) if M["m00"] != 0 else (0, 0)
            panel_coords = [{'x': int(point[0][0]), 'y': int(point[0][1])} for point in approx]
            panels_info[panel_number] = panel_coords


            base_font_scale = 3
            font_scale = max(base_font_scale, (total_pixels ** 0.5) / 1000)
            cv2.putText(temp_img, str(panel_number), (cx, cy), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 0), 3, cv2.LINE_AA)
            panel_number += 1

    json_filename = getImagePlusJsonFileName(image_path)
    image_filename = getImagePlusNumberFileName(image_path)

    print(f"save json_filename :{json_filename}")
    print(f"save image_filename:{image_filename}")

    if panels_info:
        cv2.imwrite(image_filename, temp_img)
        with open(json_filename, 'w') as file:
            json.dump(panels_info, file, indent=4)

        return temp_img, json_filename
    else:
        return None, None

# seed_pointのパネル座標を見つける
def find_comic_panel_coords(img, seed_point):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
    thresh = cv2.bitwise_not(thresh)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # contours = sorted(contours, key=cv2.contourArea, reverse=True)
    contours = sort_contours_by_top_left_corner(contours)
    
    for cnt in contours:
        if cv2.contourArea(cnt) < 1000:
            continue
        dist = cv2.pointPolygonTest(cnt, seed_point, False)
        if dist >= 0:
            # 輪郭を近似
            panel_approx = cv2.approxPolyDP(cnt, 0.02 * cv2.arcLength(cnt, True), True)

            # Rectangle only
            if len(panel_approx) == 4:
                return panel_approx.reshape(-1, 2)
            else:
                return None
    return None


def resize_fill_panel(img, target_width, target_height):
    img_height, img_width = img.shape[:2]
    img_aspect = img_width / img_height
    target_aspect = target_width / target_height

    if img_aspect > target_aspect:
        # 画像の高さをターゲットの高さに合わせる
        new_height = target_height
        new_width = int(img_aspect * new_height)
    else:
        # 画像の幅をターゲットの幅に合わせる
        new_width = target_width
        new_height = int(new_width / img_aspect)

    # 拡大の場合は INTER_CUBIC を使用
    if img_height < new_height or img_width < new_width:
        interpolation = cv2.INTER_CUBIC
    else:
        interpolation = cv2.INTER_AREA

    return cv2.resize(img, (new_width, new_height), interpolation=interpolation)


def warp_insert_image_improved(comic_img, insert_img, panel_coords):

    temp_image = comic_img.copy()

    # マスクを作成
    mask = np.zeros(temp_image.shape[:2], dtype=np.uint8)
    cv2.fillPoly(mask, [panel_coords], 255)

    # マスクの反転
    mask_inv = cv2.bitwise_not(mask)
    
    # 挿入する画像のための領域を計算
    (x, y, w, h) = cv2.boundingRect(panel_coords)
    print(f"x:{x} y:{y} w:{w} h:{h}")

    # 挿入する画像をリサイズ（パネルを完全に埋めるように）
    insert_img_resized = resize_fill_panel(insert_img, w, h)

    # 挿入画像を中心から切り取る処理を追加
    if insert_img_resized.shape[1] > w:
        # 新しい画像がパネルの幅よりも広い場合、中央から切り取る
        center_x = insert_img_resized.shape[1] // 2
        start_x = max(center_x - w // 2, 0)
        end_x = start_x + w
        insert_img_clipped = insert_img_resized[:, start_x:end_x]
    else:
        insert_img_clipped = insert_img_resized

    if insert_img_resized.shape[0] > h:
        # 新しい画像がパネルの高さよりも高い場合、中央から切り取る
        center_y = insert_img_resized.shape[0] // 2
        start_y = max(center_y - h // 2, 0)
        end_y = start_y + h
        insert_img_clipped = insert_img_clipped[start_y:end_y, :]

    # # 挿入画像をパネルの大きさにクリップ（はみ出さないように）
    # insert_img_clipped = insert_img_resized[:h, :w]

    # 挿入画像をパネル位置に合わせて配置
    insert_region = comic_img[y:y+h, x:x+w]
    insert_region_masked = cv2.bitwise_and(insert_region, insert_region, mask=mask_inv[y:y+h, x:x+w])
    insert_img_clipped_masked = cv2.bitwise_and(insert_img_clipped, insert_img_clipped, mask=mask[y:y+h, x:x+w])

    # マスクされた挿入画像と元の画像領域をブレンド
    result_region = cv2.add(insert_region_masked, insert_img_clipped_masked)

    # 最終画像に挿入画像を合成
    final_image = comic_img.copy()
    final_image[y:y+h, x:x+w] = result_region

    return final_image

def extract_black_lines(comic_img):
    """
    コミック画像から黒線の枠を抽出します。
    """
    gray = cv2.cvtColor(comic_img, cv2.COLOR_BGR2GRAY)
    _, black_lines = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    black_lines_mask = black_lines == 255
    return black_lines_mask

def apply_black_lines(final_img, black_lines_mask):
    """
    最終的な画像に黒線を適用します。
    """
    final_img[black_lines_mask] = 0  # 黒色で上書き
    return final_img

def remove_black_lines_in_insert_area(black_lines_mask, x, y, w, h):
    """
    x, y, w, hの範囲内のblack_lines_maskを削除します。
    """
    black_lines_mask[y:y+h, x:x+w] = False
    return black_lines_mask
