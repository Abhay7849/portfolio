import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Dimensions & Specs
WIDTH, HEIGHT = 1280, 720
FPS = 30
DURATION_SEC = 15.0
TOTAL_FRAMES = int(FPS * DURATION_SEC)

# Paths
ROOT = r"C:\Users\ASUS\.gemini\antigravity\scratch\freelance-portfolio"
PHOTO_PATH = os.path.join(ROOT, "assets", "abhay-photo.jpg")
DOWNLOADS_DIR = os.path.join(os.environ.get("USERPROFILE", r"C:\Users\ASUS"), "Downloads")

OUT_FILE1 = os.path.join(DOWNLOADS_DIR, "abhay-singh-upwork-intro.mp4")
OUT_FILE2 = os.path.join(ROOT, "abhay-singh-upwork-intro.mp4")

# Captions with timestamps
CAPTIONS = [
    (0.0, 3.5, "Hi, I'm Abhay Singh — a Full Stack Web Developer."),
    (3.5, 8.5, "I specialize in building fast, scalable MERN stack web applications..."),
    (8.5, 12.0, "...and modern, interactive 3D digital experiences."),
    (12.0, 15.0, "Check out my portfolio below, and let's build something great together!")
]

# Load and prepare photo
raw_photo = Image.open(PHOTO_PATH).convert("RGBA")

# Try to load Windows standard fonts
def get_font(size, bold=False):
    font_names = [
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf"
    ]
    for fn in font_names:
        if os.path.exists(fn):
            try:
                return ImageFont.truetype(fn, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_tag = get_font(18, bold=True)
font_name = get_font(46, bold=True)
font_sub = get_font(20, bold=False)
font_tech = get_font(15, bold=True)
font_link = get_font(18, bold=True)
font_caption = get_font(24, bold=True)

# Pre-render static background gradient
bg_arr = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
center_x, center_y = int(WIDTH * 0.65), int(HEIGHT * 0.45)
max_dist = np.sqrt(WIDTH**2 + HEIGHT**2) * 0.7

y_coords, x_coords = np.ogrid[:HEIGHT, :WIDTH]
dist_from_center = np.sqrt((x_coords - center_x)**2 + (y_coords - center_y)**2) / max_dist
dist_from_center = np.clip(dist_from_center, 0.0, 1.0)

# Colors: BGR in OpenCV
# Center: #111a2e (deep navy), Outer: #04060a (black)
b_grad = (26 * (1.0 - dist_from_center) + 8 * dist_from_center).astype(np.uint8)
g_grad = (20 * (1.0 - dist_from_center) + 5 * dist_from_center).astype(np.uint8)
r_grad = (15 * (1.0 - dist_from_center) + 3 * dist_from_center).astype(np.uint8)
bg_arr[:, :, 0] = b_grad
bg_arr[:, :, 1] = g_grad
bg_arr[:, :, 2] = r_grad

# Add grid lines
grid_size = 60
for x in range(0, WIDTH, grid_size):
    cv2.line(bg_arr, (x, 0), (x, HEIGHT), (40, 35, 30), 1)
for y in range(0, HEIGHT, grid_size):
    cv2.line(bg_arr, (0, y), (WIDTH, y), (40, 35, 30), 1)

base_bg_img = Image.fromarray(cv2.cvtColor(bg_arr, cv2.COLOR_BGR2RGB))

# Initialize VideoWriter
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
writer = cv2.VideoWriter(OUT_FILE1, fourcc, FPS, (WIDTH, HEIGHT))

print(f"Generating {TOTAL_FRAMES} frames ({DURATION_SEC}s) at {WIDTH}x{HEIGHT}...")

photo_center_x = int(WIDTH * 0.28)
photo_center_y = int(HEIGHT * 0.46)
base_radius = 180

for f in range(TOTAL_FRAMES):
    t = f / FPS
    progress = f / (TOTAL_FRAMES - 1)

    # Copy base background
    frame_img = base_bg_img.copy()
    draw = ImageDraw.Draw(frame_img, "RGBA")

    # 1. Circular Photo with Ken Burns Zoom
    zoom = 1.0 + progress * 0.08
    current_radius = int(base_radius * zoom)

    # Circular mask for user photo
    mask = Image.new("L", (current_radius * 2, current_radius * 2), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, current_radius * 2, current_radius * 2), fill=255)

    # Scale user photo
    crop_w, crop_h = int(current_radius * 2.3), int(current_radius * 2.3 * (raw_photo.height / raw_photo.width))
    scaled_photo = raw_photo.resize((crop_w, crop_h), Image.Resampling.LANCZOS)
    
    # Center crop
    left = (crop_w - current_radius * 2) // 2
    top = int((crop_h - current_radius * 2) * 0.38)
    cropped_face = scaled_photo.crop((left, top, left + current_radius * 2, top + current_radius * 2))

    # Paste circular photo
    photo_box = (photo_center_x - current_radius, photo_center_y - current_radius)
    frame_img.paste(cropped_face, photo_box, mask)

    # Halo / glowing ring
    pulse_halo = (np.sin(t * 4) + 1.0) / 2.0
    halo_alpha = int(140 + pulse_halo * 80)
    draw.ellipse(
        (photo_center_x - current_radius - 6, photo_center_y - current_radius - 6,
         photo_center_x + current_radius + 6, photo_center_y + current_radius + 6),
        outline=(0, 245, 255, halo_alpha),
        width=5
    )

    # 2. Right Side: Text & Credentials
    text_x = int(WIDTH * 0.52)

    # Top Tag
    draw.text((text_x, int(HEIGHT * 0.23)), "FULL STACK WEB DEVELOPER", font=font_tag, fill=(0, 245, 255, 255))

    # Name
    draw.text((text_x, int(HEIGHT * 0.29)), "Abhay Singh", font=font_name, fill=(255, 255, 255, 255))
    
    # Verified Checkmark Badge
    badge_x = text_x + 310
    badge_y = int(HEIGHT * 0.325)
    draw.ellipse((badge_x - 14, badge_y - 14, badge_x + 14, badge_y + 14), fill=(16, 185, 129, 255))
    draw.text((badge_x - 6, badge_y - 9), "✓", font=font_sub, fill=(255, 255, 255, 255))

    # Role Subtitle
    draw.text((text_x, int(HEIGHT * 0.38)), "MERN Stack • Three.js 3D • Scalable REST APIs", font=font_sub, fill=(160, 175, 200, 255))

    # 3. Dynamic Tech Tags
    tech_tags = [
        ("React 18", (0, 245, 255), 1.0),
        ("Node.js", (16, 185, 129), 3.0),
        ("Three.js 3D", (99, 102, 241), 5.0),
        ("MongoDB", (16, 185, 129), 7.0),
        ("Verified Full Stack", (245, 158, 11), 9.0)
    ]
    cur_x = text_x
    tag_y = int(HEIGHT * 0.46)
    for tag_name, tag_col, appear_t in tech_tags:
        if t >= appear_t:
            bbox = font_tech.getbbox(tag_name)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            pad_x, pad_y = 12, 6
            # Pill background
            draw.rounded_rectangle(
                (cur_x, tag_y, cur_x + tw + pad_x * 2, tag_y + th + pad_y * 2 + 4),
                radius=6,
                fill=(20, 30, 50, 200),
                outline=tag_col + (220,),
                width=1
            )
            draw.text((cur_x + pad_x, tag_y + pad_y - 1), tag_name, font=font_tech, fill=(255, 255, 255, 255))
            cur_x += tw + pad_x * 2 + 10

    # 4. Portfolio Link Box
    link_y = int(HEIGHT * 0.54)
    draw.rounded_rectangle(
        (text_x, link_y, text_x + 500, link_y + 48),
        radius=8,
        fill=(10, 18, 35, 220),
        outline=(148, 163, 184, 80),
        width=1
    )
    draw.text((text_x + 18, link_y + 12), "🌐 https://abhay7849.github.io/portfolio/", font=font_link, fill=(0, 245, 255, 255))

    # 5. Lower Third Subtitle Bar (Bottom)
    bar_h = 90
    bar_y = HEIGHT - bar_h - 25
    bar_x = 60
    bar_w = WIDTH - 120

    # Card background
    draw.rounded_rectangle(
        (bar_x, bar_y, bar_x + bar_w, bar_y + bar_h),
        radius=14,
        fill=(8, 12, 22, 240),
        outline=(0, 245, 255, 90),
        width=2
    )

    # Pulsing Live Indicator Dot
    pulse_dot = (np.sin(t * 8) + 1.0) / 2.0
    dot_r = 7 + int(pulse_dot * 3)
    dot_cx = bar_x + 36
    dot_cy = bar_y + bar_h // 2
    draw.ellipse((dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r), fill=(239, 68, 68, 255))

    # Subtitle Text for current timestamp
    curr_caption = CAPTIONS[-1][2]
    for start_t, end_t, text_val in CAPTIONS:
        if start_t <= t < end_t:
            curr_caption = text_val
            break

    draw.text((bar_x + 65, bar_y + 28), f'"{curr_caption}"', font=font_caption, fill=(255, 255, 255, 255))

    # Animated Progress Bar at bottom of card
    fill_w = int(bar_w * progress)
    if fill_w > 4:
        draw.rectangle((bar_x + 2, bar_y + bar_h - 6, bar_x + fill_w, bar_y + bar_h - 2), fill=(0, 245, 255, 240))

    # Convert back to BGR for OpenCV
    frame_cv = cv2.cvtColor(np.array(frame_img), cv2.COLOR_RGB2BGR)
    writer.write(frame_cv)

writer.release()
print(f"Video saved to: {OUT_FILE1}")

# Also copy to project directory
import shutil
shutil.copy2(OUT_FILE1, OUT_FILE2)
print(f"Video copied to: {OUT_FILE2}")

file_size = os.path.getsize(OUT_FILE1) / (1024 * 1024)
print(f"Done! Final file size: {file_size:.2f} MB")
