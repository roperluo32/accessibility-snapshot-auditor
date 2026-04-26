from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SOURCE = Path('store-assets/generated/store-hero-base-imagegen.png')
OUT = Path('store-assets/localized')

locales = {
    'en': {
        'headline': 'Catch accessibility gaps before launch',
        'sub': 'Local snapshots for structure, labels, media, ARIA, keyboard, and contrast.',
        'badges': ['Structure', 'Labels', 'ARIA', 'Contrast'],
    },
    'zh_CN': {
        'headline': '上线前，先做无障碍快照',
        'sub': '本地审计页面结构、标签、媒体、ARIA、键盘和颜色对比。',
        'badges': ['结构', '标签', 'ARIA', '对比度'],
    },
    'zh_TW': {
        'headline': '上線前，先做無障礙快照',
        'sub': '本機稽核頁面結構、標籤、媒體、ARIA、鍵盤與色彩對比。',
        'badges': ['結構', '標籤', 'ARIA', '對比度'],
    },
    'ja': {
        'headline': '公開前にアクセシビリティ確認',
        'sub': '構造、ラベル、メディア、ARIA、キーボード、コントラストをローカル監査。',
        'badges': ['構造', 'ラベル', 'ARIA', 'Contrast'],
    },
    'ko': {
        'headline': '출시 전 접근성 스냅샷',
        'sub': '구조, 레이블, 미디어, ARIA, 키보드, 대비를 로컬에서 점검합니다.',
        'badges': ['구조', '레이블', 'ARIA', '대비'],
    },
    'de': {
        'headline': 'Accessibility-Lücken vor dem Launch finden',
        'sub': 'Lokale Snapshots für Struktur, Labels, Medien, ARIA, Tastatur und Kontrast.',
        'badges': ['Struktur', 'Labels', 'ARIA', 'Kontrast'],
    },
    'fr': {
        'headline': 'Repérez les écarts a11y avant publication',
        'sub': 'Snapshots locaux pour structure, libellés, médias, ARIA, clavier et contraste.',
        'badges': ['Structure', 'Libelles', 'ARIA', 'Contraste'],
    },
    'es': {
        'headline': 'Detecta brechas de accesibilidad',
        'sub': 'Snapshots locales de estructura, etiquetas, medios, ARIA, teclado y contraste.',
        'badges': ['Estructura', 'Etiquetas', 'ARIA', 'Contraste'],
    },
    'pt_BR': {
        'headline': 'Encontre falhas de acessibilidade',
        'sub': 'Snapshots locais de estrutura, rótulos, mídia, ARIA, teclado e contraste.',
        'badges': ['Estrutura', 'Rotulos', 'ARIA', 'Contraste'],
    },
}

LATIN_REGULAR = '/System/Library/Fonts/Supplemental/Arial.ttf'
LATIN_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
CJK_FONT = '/System/Library/Fonts/Hiragino Sans GB.ttc'
JP_FONT = '/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc'
KO_FONT = '/System/Library/Fonts/AppleSDGothicNeo.ttc'
FALLBACK = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'


def font_path(locale: str, bold=False):
    if locale in ('zh_CN', 'zh_TW'):
        return CJK_FONT if Path(CJK_FONT).exists() else FALLBACK
    if locale == 'ja':
        return JP_FONT if Path(JP_FONT).exists() else FALLBACK
    if locale == 'ko':
        return KO_FONT if Path(KO_FONT).exists() else FALLBACK
    return LATIN_BOLD if bold else LATIN_REGULAR


def load_font(locale, size, bold=False):
    try:
        return ImageFont.truetype(font_path(locale, bold), size)
    except Exception:
        return ImageFont.truetype(FALLBACK, size)


def crop_resize_cover(image, size):
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def text_width(draw, text, font):
    return draw.textbbox((0, 0), text, font=font)[2]


def wrap_text(draw, text, font, max_width):
    if any('\u3040' <= ch <= '\u30ff' or '\u3400' <= ch <= '\u9fff' or '\uac00' <= ch <= '\ud7af' for ch in text):
        units = list(text)
        lines, line = [], ''
        for unit in units:
            candidate = line + unit
            if text_width(draw, candidate, font) <= max_width or not line:
                line = candidate
            else:
                lines.append(line)
                line = unit
        if line:
            lines.append(line)
        return lines
    lines, line = [], ''
    for word in text.split(' '):
        candidate = word if not line else f'{line} {word}'
        if text_width(draw, candidate, font) <= max_width or not line:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def fit_font(draw, locale, text, max_width, max_lines, start_size, min_size, bold=False):
    for size in range(start_size, min_size - 1, -2):
        font = load_font(locale, size, bold)
        lines = wrap_text(draw, text, font, max_width)
        if len(lines) <= max_lines:
            return font, lines
    font = load_font(locale, min_size, bold)
    return font, wrap_text(draw, text, font, max_width)[:max_lines]


def draw_lines(draw, x, y, lines, font, fill, gap):
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        box = draw.textbbox((x, y), line, font=font)
        y = box[3] + gap
    return y


if not SOURCE.exists():
    raise SystemExit(f'Missing imagegen hero base: {SOURCE}')

OUT.mkdir(parents=True, exist_ok=True)
base = crop_resize_cover(Image.open(SOURCE).convert('RGB'), (1280, 800))

for locale, copy in locales.items():
    image = base.copy()
    overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    panel = (704, 56, 1220, 388)
    draw.rounded_rectangle(panel, radius=26, fill=(255, 255, 255, 224), outline=(20, 33, 61, 36), width=2)
    draw.rounded_rectangle((742, 90, 926, 126), radius=18, fill=(183, 243, 92, 255))
    label_font = load_font(locale, 18, bold=True)
    draw.text((762, 97), 'Accessibility Snapshot', font=label_font, fill=(20, 33, 61, 255))

    headline_font, headline_lines = fit_font(draw, locale, copy['headline'], 426, 2, 40, 27, bold=True)
    y = draw_lines(draw, 742, 148, headline_lines, headline_font, (20, 33, 61, 255), 8)

    sub_font, sub_lines = fit_font(draw, locale, copy['sub'], 426, 2, 22, 17)
    y = draw_lines(draw, 742, y + 10, sub_lines, sub_font, (67, 78, 98, 255), 6)

    badge_font = load_font(locale, 17, bold=True)
    x = 742
    badge_y = max(316, y + 18)
    for badge in copy['badges']:
        width = min(132, int(text_width(draw, badge, badge_font) + 28))
        if x + width > 1192:
            break
        draw.rounded_rectangle((x, badge_y, x + width, badge_y + 32), radius=16, fill=(20, 33, 61, 235))
        draw.text((x + 14, badge_y + 6), badge, font=badge_font, fill=(255, 255, 255, 255))
        x += width + 10

    image = Image.alpha_composite(image.convert('RGBA'), overlay).convert('RGB')
    image.save(OUT / f'{locale}-store-1280x800.png', quality=95)

Path('docs/store-listing-localized.md').write_text(
    '# Accessibility Snapshot Auditor 多语言商店文案\n\n'
    + '\n\n'.join(
        f"## {locale}\n标题：{'无障碍快照审计器' if locale == 'zh_CN' else 'Accessibility Snapshot Auditor'}\n"
        f"短描述：{copy['sub']}\n截图：store-assets/localized/{locale}-store-1280x800.png"
        for locale, copy in locales.items()
    )
    + '\n',
    encoding='utf-8',
)
