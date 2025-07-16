import os

name_overrides = {}


def format_name(path):
    name = os.path.basename(path)

    if name in name_overrides:
        return name_overrides[name]

    return name.split('.')[0].replace('_', ' ').title()


artwork = list(sorted([os.path.join('/assets/images/artwork', file)
               for file in os.listdir('src/assets/images/artwork')]))

elements = [f"""<div>
    <div class="drawing">
        <img class="drawing-image" src="{file}"/>
        <p>{format_name(file)}</p>
    </div>
</div>""" for file in artwork]

print(
    f'<div class="photo-grid">\n    {'\n'.join(elements).replace('\n', '\n    ')}\n</div>')
