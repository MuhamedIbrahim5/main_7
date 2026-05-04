# -*- coding: utf-8 -*-

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix all remaining issues
fixes = [
    ('ريال / ريال', 'للفرد / السرير'),
    ('عرض خاص</button>', 'احجز الآن</button>'),
    ('باقة البرنامج الفاخرة', 'باقة البرنامج الذهبية'),
    ('مواصلات مريحة', 'مواصلات فاخرة'),
]

for old, new in fixes:
    content = content.replace(old, new)

# Fix section 2 (rooms) - should be "للغرفة"
lines = content.split('\n')
in_section_2 = False
in_section_3 = False
in_section_4 = False

for i, line in enumerate(lines):
    if 'id="programs-room"' in line:
        in_section_2 = True
        in_section_3 = False
        in_section_4 = False
    elif 'id="makkah-hotel"' in line:
        in_section_2 = False
        in_section_3 = True
        in_section_4 = False
    elif 'id="madinah"' in line:
        in_section_2 = False
        in_section_3 = False
        in_section_4 = True
    
    if in_section_2 and 'للفرد / السرير' in line:
        lines[i] = line.replace('للفرد / السرير', 'للغرفة')
    elif (in_section_3 or in_section_4):
        if 'للفرد / السرير' in line and 'غرفة' in lines[i-20:i+5].__str__():
            lines[i] = line.replace('للفرد / السرير', 'للغرفة')

content = '\n'.join(lines)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Final cleanup completed!")
