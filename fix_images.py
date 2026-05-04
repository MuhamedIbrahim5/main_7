import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find broken image tags
pattern = r'<img src="\s+\$result.*?"\s+alt="([^"]+)">'

# Counter for images
image_counter = [3]  # Start from 3 since we already fixed 1 and 2

def replace_image(match):
    alt_text = match.group(1)
    img_num = image_counter[0]
    image_counter[0] += 1
    return f'<img src="images/{img_num}.jfif" alt="{alt_text}">'

# Replace all broken image tags
content = re.sub(pattern, replace_image, content, flags=re.DOTALL)

# Write back to file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed {image_counter[0] - 3} images")
