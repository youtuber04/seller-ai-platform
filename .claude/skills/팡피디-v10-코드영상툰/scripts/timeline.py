"""팡피디 V1.0 코드영상툰 — 공유 타임라인 + 오디오 믹스 (+ V0 AI 이미지판 PIL 합성기).

SEG 한 줄 = 대사 한 줄: (vo번호, 장면키, 패널초점, 자막, 색(H/Wf/T), 앞 공백초, 효과음[(이름,대사시작기준초,볼륨)], 의성어, 펀치인)
  H = 남편 대사, Wf = 아내 대사, T = 속마음(입 안 움직임)
작업 폴더(OUT) 구조: vo/tNN.wav(무음 다듬은 대사) · sfx/*.mp3 또는 sfx_code/*.wav · bgm.mp3 또는 bgm_code.wav · fonts/ · toon/
  python timeline.py preview        -> 장면별 show/start/end 시각 확인
  python -c "import timeline as R; R.audio(sfx_dir='sfx_code', ext='wav', bgm='bgm_code.wav', out='audio_code.wav', bgm_vol=0.22)"
"""
import math, subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont

W_DIR = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(W_DIR, *a)
FPS = 30
CW, CH = 1080, 1920
PANEL_Y, PANEL_H = 560, 700
TEMPO = 1.08

F_TITLE = P("fonts/BlackHanSans-Regular.ttf")
F_SUB = P("fonts/GothicA1-Bold.ttf")
F_FX = P("fonts/DoHyeon-Regular.ttf")

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

H, Wf, T = "#111111", "#d6336c", "#555555"  # husband / wife / inner thought
# (vo, scene, focus(x,y,zoom_end), subtitle, color, pre_gap, sfx[(name,offset,vol)], fx(text, x, y, delay, angle), punch)
SEG = [
    (1, "s01", (0.5, 0.45, 1.07), "(결혼 7년 차. 불 끄고 누웠는데…\n아내가 갑자기 내 쪽으로 돌아눕는다.)", T, 0.35, [("swoosh", -0.3, 0.5)], None, False),
    (2, "s02", (0.6, 0.45, 1.08), "자기야… 자? 우리…\n오늘 밤에… 할까?", Wf, 0.35, [("swoosh", -0.25, 0.45)], ("두근", 0.82, 0.25, 0.4, -8), False),
    (3, "s03", (0.5, 0.45, 1.06), "(뭐…? 할까? 이게 대체…\n얼마 만이야?!)", T, 0.3, [("shock", -0.15, 0.8)], ("!?", 0.82, 0.3, 0.0, 10), True),
    (4, "s04", (0.35, 0.5, 1.05), "어, 어! 자기야!\n딱 5분만! 5분만 기다려!", H, 0.3, [("dash", 0.0, 0.8)], ("후다닥!", 0.72, 0.2, 0.1, -6), False),
    (5, "s05", (0.5, 0.4, 1.08), "(양치 두 번에… 가글까지.)", T, 0.4, [("brush", -0.3, 0.45)], ("벅벅벅", 0.2, 0.25, 0.0, -10), False),
    (6, "s06", (0.55, 0.4, 1.08), "(향수는… 세 번.\n아니, 다섯 번.)", T, 0.3, [("spray", -0.2, 0.7), ("spray", 0.9, 0.7), ("spray", 2.0, 0.7)], ("칙! 칙!", 0.2, 0.2, 0.0, -8), False),
    (7, "s07", (0.35, 0.45, 1.07), "(뱃살은… 숨 참으면 된다.\n흡! …완벽해.)", T, 0.3, [("belly", 2.2, 0.6)], ("흐읍!", 0.5, 0.18, 2.2, 6), False),
    (8, "s08", (0.5, 0.4, 1.07), "자기야~ 나 준비 다 됐어~", H, 0.6, [("door", -0.55, 0.7), ("sparkle", 0.8, 0.5)], ("반짝!", 0.25, 0.2, 0.8, -8), False),
    (9, "s09", (0.65, 0.5, 1.06), "오, 빨리 왔네? 자, 여기 앉아.\n이번 달 가계부 정리… 할까?", Wf, 0.3, [("calc", 0.2, 0.35)], None, False),
    (10, "s10", (0.5, 0.45, 1.05), "…가계부?", H, 0.55, [("scratch", -0.5, 0.8)], ("멍-", 0.75, 0.25, 0.0, 0), True),
    (11, "s11", (0.6, 0.5, 1.06), "카드값이 왜 이렇게 많이 나왔는지,\n하나씩 설명해 봐.", Wf, 0.7, [], None, False),
    (12, "s11b", (0.62, 0.42, 1.12), "킁킁… 근데 이 향수 냄새, 처음 맡는데?\n이거 언제 샀어?", Wf, 0.3, [("shock", 3.6, 0.45)], ("킁킁", 0.8, 0.2, 0.0, 8), False),
    (13, "s11c", (0.33, 0.4, 1.12), "(향수는… 뿌리는 게 아니었다.)", T, 0.3, [("trombone", 2.3, 0.55)], None, False),
    (14, "s12", (0.4, 0.55, 1.06), "하암~ 자기야…\n나 이제 졸린데…", H, 1.3, [], None, False),
    (15, "s12b", (0.65, 0.45, 1.12), "앉아.", Wf, 0.35, [("gong", -0.1, 0.85)], ("!!!", 0.85, 0.2, 0.0, 8), True),
]
OUTRO = "(그날 밤, 가계부 정리는\n새벽 2시까지 계속됐다…)"
OUTRO_LEN = 2.3

# ---------- timeline ----------
t = 0.25
timeline = []  # dict per segment
for vo, scene, focus, sub, col, pre, sfx, fx, punch in SEG:
    t += pre
    d = dur(P(f"vo/t{vo:02d}.wav")) / TEMPO
    timeline.append(dict(vo=vo, scene=scene, focus=focus, sub=sub, col=col, start=t, end=t + d, sfx=sfx, fx=fx, punch=punch, pre=pre))
    t += d
outro_start = t + 0.35
TOTAL = outro_start + OUTRO_LEN
print(f"total {TOTAL:.2f}s", file=sys.stderr)
# scene display windows: a scene starts when its segment's pre-gap starts
for i, s in enumerate(timeline):
    s["show"] = s["start"] - s["pre"] if i else 0.0
for i, s in enumerate(timeline):
    s["hide"] = timeline[i + 1]["show"] if i + 1 < len(timeline) else TOTAL

# ---------- images ----------
imgs = {}
def load(name):
    base = {"s11b": "s11", "s11c": "s11", "s12b": "s12"}.get(name, name)
    if base not in imgs:
        imgs[base] = Image.open(P(f"img/{base}.png")).convert("RGB")
    return imgs[base]

def panel_frame(name, focus, local, length, punch):
    im = load(name)
    iw, ih = im.size
    fx, fy, zend = focus
    k = min(local / max(length, 0.01), 1.0)
    k = 0.5 - 0.5 * math.cos(math.pi * k)  # ease in-out
    z = 1.0 + (zend - 1.0) * k
    if punch and local < 0.35:
        z *= 1.0 + 0.12 * (1 - local / 0.35) ** 2
    elif local < 0.15:
        z *= 1.0 + 0.03 * (1 - local / 0.15)
    base = max(CW / iw, PANEL_H / ih)
    s = base * z
    vw, vh = CW / s, PANEL_H / s
    cx = min(max(fx * iw, vw / 2), iw - vw / 2)
    cy = min(max(fy * ih, vh / 2), ih - vh / 2)
    if punch and local < 0.45:
        amp = 10 * (1 - local / 0.45)
        cx += amp * math.sin(local * 90) / s
        cy += amp * math.cos(local * 70) / s
        cx = min(max(cx, vw / 2), iw - vw / 2)
        cy = min(max(cy, vh / 2), ih - vh / 2)
    box = (cx - vw / 2, cy - vh / 2, cx + vw / 2, cy + vh / 2)
    return im.resize((CW, PANEL_H), Image.BILINEAR, box=box)

# ---------- text ----------
_cache = {}
def text_img(txt, font, size, fill, stroke=0, stroke_fill="white", spacing=14):
    key = (txt, font, size, fill, stroke, stroke_fill)
    if key in _cache:
        return _cache[key]
    f = ImageFont.truetype(font, size)
    d = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    bb = d.multiline_textbbox((0, 0), txt, font=f, spacing=spacing, align="center", stroke_width=stroke)
    w, h = int(math.ceil(bb[2] - bb[0])) + 8, int(math.ceil(bb[3] - bb[1])) + 8
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(im).multiline_text((4 - bb[0], 4 - bb[1]), txt, font=f, fill=fill, spacing=spacing, align="center", stroke_width=stroke, stroke_fill=stroke_fill)
    _cache[key] = im
    return im

def paste_center(canvas, im, cx, cy, scale=1.0, alpha=1.0, angle=0):
    if angle:
        im = im.rotate(angle, resample=Image.BICUBIC, expand=True)
    if scale != 1.0:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BILINEAR)
    if alpha < 1.0:
        a = im.getchannel("A").point(lambda v: int(v * alpha))
        im = im.copy(); im.putalpha(a)
    canvas.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)

def pop(local, dur_=0.18):
    if local >= dur_:
        return 1.0, 1.0
    k = local / dur_
    return 0.85 + 0.15 * (1 - (1 - k) ** 3) + 0.06 * math.sin(k * math.pi), k

# ---------- static layer ----------
bg = Image.new("RGB", (CW, CH), "white")
d = ImageDraw.Draw(bg)
l1a = text_img("불 끄자마자 ", F_TITLE, 70, "#111111")
l1b = text_img("“오늘 밤 할까?”", F_TITLE, 70, "#e03131")
l2 = text_img("묻는 아내의 진짜 속셈", F_TITLE, 70, "#111111")
x0 = (CW - (l1a.width + l1b.width)) // 2
bg.paste(l1a, (x0, 300), l1a); bg.paste(l1b, (x0 + l1a.width, 300), l1b)
bg.paste(l2, ((CW - l2.width) // 2, 400), l2)
# brand
brand = text_img("부부썰툰", F_TITLE, 46, "white")
tag = text_img("밤마다 웃긴 부부 이야기", F_SUB, 34, "#333333")
bx = (CW - (brand.width + 40 + 24 + tag.width)) // 2
d.rounded_rectangle((bx, 1608, bx + brand.width + 40, 1608 + brand.height + 22), radius=14, fill="#e03131")
bg.paste(brand, (bx + 20, 1619), brand)
bg.paste(tag, (bx + brand.width + 64, 1608 + (brand.height + 22 - tag.height) // 2), tag)

SUB_Y = 1395

def render():
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{CW}x{CH}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", P("video.mp4")], stdin=subprocess.PIPE)
    n = int(round(TOTAL * FPS))
    for i in range(n):
        tt = i / FPS
        fr = bg.copy()
        seg = next(s for s in timeline if s["show"] <= tt < s["hide"]) if tt < timeline[-1]["hide"] else timeline[-1]
        local = tt - seg["show"]
        pan = panel_frame(seg["scene"], seg["focus"], local, seg["hide"] - seg["show"], seg["punch"])
        if tt >= outro_start:  # dim the final panel for the outro caption
            k = min((tt - outro_start) / 0.5, 1.0)
            pan = Image.blend(pan, Image.new("RGB", pan.size, "black"), 0.45 * k)
        fr.paste(pan, (0, PANEL_Y))
        # onomatopoeia
        if seg["fx"] and tt < outro_start:
            txt, fxp, fyp, dl, ang = seg["fx"]
            lt = tt - seg["start"] - dl
            if lt >= 0:
                sc, _ = pop(lt, 0.22)
                im = text_img(txt, F_FX, 108, "#111111", stroke=9, stroke_fill="white")
                wob = 3 * math.sin(lt * 6)
                paste_center(fr, im, fxp * CW, PANEL_Y + fyp * PANEL_H, scale=sc, angle=ang + wob)
        # subtitle
        if tt >= outro_start:
            lt = tt - outro_start
            sc, _ = pop(lt)
            im = text_img(OUTRO, F_SUB, 52, "white", stroke=0)
            paste_center(fr, im, CW / 2, PANEL_Y + PANEL_H / 2, scale=sc)
        elif tt >= seg["start"] - 0.05:
            lt = tt - seg["start"] + 0.05
            sc, _ = pop(lt, 0.15)
            im = text_img(seg["sub"], F_SUB, 50, seg["col"])
            paste_center(fr, im, CW / 2, SUB_Y, scale=sc)
        # fade from/to white at the very ends
        if tt < 0.2 or tt > TOTAL - 0.35:
            a = (1 - tt / 0.2) if tt < 0.2 else (tt - (TOTAL - 0.35)) / 0.35
            fr = Image.blend(fr, Image.new("RGB", fr.size, "white"), max(0, min(1, a)) * (0.9 if tt > 1 else 1))
        ff.stdin.write(fr.tobytes())
    ff.stdin.close(); ff.wait()

def audio(sfx_dir="sfx", ext="mp3", bgm="bgm.mp3", out="audio.wav", bgm_vol=0.16):
    ins, fl, labels = [], [], []
    idx = 0
    def inp(path, loop=0):
        nonlocal idx
        if loop:
            ins.extend(["-stream_loop", str(loop)])
        ins.extend(["-i", path]); idx += 1
        return idx - 1
    # voices
    for s in timeline:
        k = inp(P(f"vo/t{s['vo']:02d}.wav"))
        ms = int(s["start"] * 1000)
        fl.append(f"[{k}]atempo={TEMPO},aformat=channel_layouts=stereo,adelay={ms}|{ms},volume=1.0[v{k}]"); labels.append(f"[v{k}]")
        for name, off, vol in s["sfx"]:
            k2 = inp(P(f"{sfx_dir}/{name}.{ext}"))
            ms2 = max(0, int((s["start"] + off) * 1000))
            trim = ",atrim=0:2.6,afade=t=out:st=2.1:d=0.5" if name == "calc" else (",atrim=0:3.2,afade=t=out:st=2.4:d=0.8" if name == "brush" else "")
            fl.append(f"[{k2}]aformat=channel_layouts=stereo{trim},adelay={ms2}|{ms2},volume={vol}[x{k2}]"); labels.append(f"[x{k2}]")
    # night ambience under scenes 1-3
    amb_end = timeline[3]["show"]
    k = inp(P(f"{sfx_dir}/night.{ext}"), loop=6)
    fl.append(f"[{k}]aformat=channel_layouts=stereo,atrim=0:{amb_end:.2f},afade=t=in:d=0.6,afade=t=out:st={amb_end-0.8:.2f}:d=0.8,volume=0.35[amb]"); labels.append("[amb]")
    # bgm: stops at the record scratch, comes back when she starts talking about the card bill
    mute_a = timeline[9]["start"] - 0.45
    mute_b = timeline[10]["start"] - 0.2
    k = inp(P(bgm))
    fl.append(f"[{k}]aformat=channel_layouts=stereo,atrim=0:{TOTAL:.2f},volume='if(between(t,{mute_a:.2f},{mute_b:.2f}),0,if(between(t,{mute_b:.2f},{mute_b+1.2:.2f}),{bgm_vol}*(t-{mute_b:.2f})/1.2,{bgm_vol}))':eval=frame,afade=t=out:st={TOTAL-1.8:.2f}:d=1.8[bgm]"); labels.append("[bgm]")
    fl.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
    cmd = ["ffmpeg", "-loglevel", "error", "-y"] + ins + ["-filter_complex", ";".join(fl), "-map", "[aout]", "-ar", "48000", "-t", f"{TOTAL:.2f}", P(out)]
    subprocess.check_call(cmd)

if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("audio", "all"):
        audio()
    if what in ("video", "all"):
        render()
    if what == "all":
        subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", P("video.mp4"), "-i", P("audio.wav"), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", P("final.mp4")])
    if what == "preview":
        for s in timeline:
            print(f"{s['vo']:2d} {s['scene']:5s} show {s['show']:6.2f} start {s['start']:6.2f} end {s['end']:6.2f}")
