from pathlib import Path
from PIL import Image

SOURCE = Path('store-assets/generated/accessibility-snapshot-logo-master.png')
PUBLIC = Path('public')

if not SOURCE.exists():
    raise SystemExit(f'Missing logo master: {SOURCE}')

PUBLIC.mkdir(exist_ok=True)
source = Image.open(SOURCE).convert('RGB')
width, height = source.size
side = min(width, height)
left = (width - side) // 2
top = (height - side) // 2
square = source.crop((left, top, left + side, top + side))

for size in (16, 32, 48, 128):
    icon = square.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(PUBLIC / f'icon-{size}.png', optimize=True)
