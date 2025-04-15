import os
import sys

def generate_js_svg_array(directory, output_js_filepath, array_name):
    svg_entries = []

    for filename in os.listdir(directory):
        if filename.endswith(".svg"):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                svg_content = file.read()
                svg_content_escaped = svg_content.replace('\n', '').replace('"', '\\"')
                svg_entries.append(f'{{ name: "{filename[:-4]}", svg: "{svg_content_escaped}" }}')

    js_array_content = f"const {array_name} = [\n  " + ",\n  ".join(svg_entries) + "\n];"
    os.makedirs(os.path.dirname(output_js_filepath), exist_ok=True)
    with open(output_js_filepath, 'w', encoding='utf-8') as js_file:
        js_file.write(js_array_content)

    print(f"JavaScript file written: {output_js_filepath}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python script_name.py <directory_path> <output_js_filepath> <array_name>")
    else:
        directory_path = sys.argv[1]
        output_js_filepath = sys.argv[2]
        array_name = sys.argv[3]
        generate_js_svg_array(directory_path, output_js_filepath, array_name)
