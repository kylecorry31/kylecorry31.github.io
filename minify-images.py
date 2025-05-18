import os
import sys
from PIL import Image

def minify_images(directory):
    if not os.path.isdir(directory):
        print(f"Error: {directory} is not a valid directory.")
        return

    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.webp') or file.lower().endswith('.jpg'):
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        if file.lower().endswith('.webp') and img.width <= 500 and img.height <= 500:
                            print(f"Skipped (already under 500x500): {file_path}")
                            continue
                        img.thumbnail((500, 500))
                        output_path = os.path.join(root, f'{file.replace(".jpg", ".webp")}')
                        img.save(output_path, 'WEBP', quality=75)
                        print(f"Minified: {file_path} -> {output_path}")

                        if file.lower().endswith('.jpg'):
                            os.remove(file_path)
                except Exception as e:
                    print(f"Failed to process {file_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python minify-images.py <directory>")
    else:
        minify_images(sys.argv[1])