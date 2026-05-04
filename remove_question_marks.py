# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all question marks and fix Arabic text
# Find all sequences of question marks and replace with proper Arabic
replacements = {
    # Package names - exact matches
    'باقة البرنامج الفاخرة': 'باقة البرنامج الذهبية',
}

# Pattern to find question marks
question_pattern = r'\?+[^\?<>]*\?+'

# Find all matches
matches = re.findall(question_pattern, content)
print(f"Found {len(matches)} question mark sequences")

# Manual replacements for common patterns
manual_fixes = [
    # Remove any remaining question marks around Arabic text
    (r'\?+', ''),
]

for pattern, replacement in manual_fixes:
    content = re.sub(pattern, replacement, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed all question marks!")
