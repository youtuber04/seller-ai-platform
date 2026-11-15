"""Music bed + sound effects synthesised from scratch (numpy only), no samples, no AI audio."""
import os, wave
import numpy as np
import timeline as R  # shared timeline + audio mix

SR = 44100
OUT = R.P("sfx_code")
os.makedirs(OUT, exist_ok=True)
rs = np.random.default_rng(7)

def write(path, x):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    peak = np.max(np.abs(x)) or 1
    x = x / peak * 0.89
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def tt(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, d=0.3, curve=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d) ** curve
    return e
def lp(x, fc):  # one-pole low-pass, fc may be an array
    fc = np.broadcast_to(fc, x.shape)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); z = 0.0
    for i in range(len(x)):
        z = (1 - a[i]) * x[i] + a[i] * z; y[i] = z
    return y
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return lp(hp(x, lo), hi)
def noise(d): return rs.uniform(-1, 1, int(d * SR))
def fadeout(x, d=0.05):
    n = int(d * SR); x = x.copy(); x[-n:] *= np.linspace(1, 0, n); return x
def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- instruments ----------------
def pizz(f, d=0.45, v=1.0):
    t = tt(d); x = np.zeros_like(t)
    for k in range(1, 7):
        x += np.sin(2 * np.pi * f * k * t) / k ** 1.3 * np.exp(-t * (7 + 5 * k))
    x[: int(0.004 * SR)] += noise(0.004) * 0.3
    return x * v * np.minimum(1, t / 0.003)
def marimba(f, d=0.5, v=1.0):
    t = tt(d)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 22) + 0.12 * np.sin(2 * np.pi * f * 9.9 * t) * np.exp(-t * 40)
    return x * v * np.minimum(1, t / 0.002)
def bassoon(f, d, v=1.0):
    t = tt(d); x = np.zeros_like(t)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    for k in range(1, 9):
        x += np.sin(ph * k) * (1 / k) * (1.4 if k in (2, 3) else 1)
    e = np.minimum(1, t / 0.04) * np.minimum(1, (d - t) / 0.08)
    return lp(x * e * v, 1400)
def hat(v=1.0):
    x = hp(noise(0.06), 7000) * np.exp(-tt(0.06) * 70); return x * v
def kick(v=1.0):
    t = tt(0.25); f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14) * v

def place(buf, x, at):
    i = int(at * SR)
    if i >= len(buf): return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n]

# ---------------- music bed ----------------
def music():
    total = R.TOTAL + 0.5
    L = np.zeros(int(total * SR)); Rr = np.zeros_like(L)
    bpm = 100; beat = 60 / bpm
    switch = R.timeline[10]["start"] - 0.2   # after the record scratch the music turns "suspicious"
    # section A: C - Am - F - G (sneaky, playful)
    A = [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [57, 60, 65]), (43, [55, 59, 62])]
    melA = [[67, None, 64, 65, 67, None, 72, None], [69, None, 67, 64, 60, None, 62, 63],
            [65, None, 69, 67, 65, None, 64, None], [62, 63, 64, 67, 71, None, 74, None]]
    # section B: Am - Dm - E - Am (tiptoe, minor)
    B = [(45, [57, 60, 64]), (50, [57, 62, 65]), (40, [56, 59, 64]), (45, [57, 60, 64])]
    melB = [[69, None, None, 68, 69, None, 72, None], [74, None, 72, None, 69, None, 65, None],
            [64, None, 68, None, 71, 70, 71, None], [69, None, None, None, 64, None, 57, None]]
    bar = 0
    t0 = 0.0
    while t0 < total:
        sec = "B" if t0 >= switch else "A"
        prog, mel = (B, melB) if sec == "B" else (A, melA)
        root, ch = prog[bar % 4]
        for b in range(4):
            tb = t0 + b * beat
            if b in (0, 2):
                place(L, pizz(midi(root), 0.5, 0.9), tb); place(Rr, pizz(midi(root), 0.5, 0.9), tb)
                place(L, kick(0.35), tb); place(Rr, kick(0.35), tb)
            if b in (1, 3):
                for j, n in enumerate(ch):
                    x = pizz(midi(n), 0.35, 0.28)
                    place(L if j % 2 else Rr, x, tb + 0.012 * j); place(Rr if j % 2 else L, x * 0.6, tb + 0.012 * j)
            if sec == "A" or b % 2 == 0:
                for h in (0.5,):
                    place(L, hat(0.12), tb + h * beat); place(Rr, hat(0.09), tb + h * beat)
        for k, n in enumerate(mel[bar % 4]):
            if n is None: continue
            te = t0 + k * beat / 2
            if sec == "A":
                x = marimba(midi(n), 0.45, 0.42); place(L, x * 0.8, te); place(Rr, x, te)
            else:
                x = bassoon(midi(n - 12), beat * 0.45, 0.22); place(L, x, te); place(Rr, x * 0.9, te)
        t0 += 4 * beat; bar += 1
        if sec == "A" and t0 >= switch: bar = 0
    # tiny reverb-ish smear
    for buf in (L, Rr):
        d = int(0.11 * SR); buf[d:] += buf[:-d] * 0.18
    return np.stack([L, Rr], 1)

# ---------------- sound effects ----------------
def fx_night():
    t = tt(3.0); x = lp(noise(3.0), 400) * 0.08
    for c0 in np.arange(0.05, 3.0, 0.55):
        for p in range(3):
            s = c0 + p * 0.06; m = (t > s) & (t < s + 0.035)
            x[m] += np.sin(2 * np.pi * 4300 * t[m]) * np.sin(np.pi * (t[m] - s) / 0.035) * 0.5
    return x
def fx_shock():
    t = tt(1.6); x = np.zeros_like(t)
    for n in (48, 55, 60, 64, 67, 72):
        for det in (-0.004, 0.004):
            f = midi(n) * (1 + det); x += np.sign(np.sin(2 * np.pi * f * t)) * 0.08
    x = lp(x, 2500 * np.exp(-t * 2) + 300) * np.exp(-t * 3.2)
    boom = np.sin(2 * np.pi * np.cumsum(60 + 40 * np.exp(-t * 20)) / SR) * np.exp(-t * 4)
    return x + boom * 0.8 + hp(noise(1.6), 5000) * np.exp(-t * 5) * 0.2
def fx_dash():
    t = tt(0.9); fc = 400 + 5000 * np.sin(np.pi * t / 0.9) ** 2
    return lp(hp(noise(0.9), 300), fc) * np.sin(np.pi * t / 0.9) ** 1.5
def fx_brush():
    t = tt(3.2); am = 0.5 + 0.5 * np.sin(2 * np.pi * 7 * t) ** 2
    return bp(noise(3.2), 2500, 7000) * am * np.minimum(1, t / 0.05) * np.minimum(1, (3.2 - t) / 0.4)
def fx_spray():
    t = tt(0.45); return hp(noise(0.45), 4000) * np.minimum(1, t / 0.01) * np.exp(-t * 7)
def fx_belly():
    t = tt(0.9); f = 260 + 700 * (t / 0.9) ** 0.7 + 25 * np.sin(2 * np.pi * 18 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.9)
    return lp(np.tanh(x * 3), 3000)
def fx_sparkle():
    t = tt(1.2); x = np.zeros_like(t)
    for i, n in enumerate((84, 88, 91, 96, 100)):
        s = i * 0.06; m = t >= s; tm = t[m] - s
        x[m] += np.sin(2 * np.pi * midi(n) * tm) * np.exp(-tm * 6) * 0.5 + np.sin(2 * np.pi * midi(n) * 2.76 * tm) * np.exp(-tm * 14) * 0.15
    return x
def fx_door():
    t = tt(1.0); f = 220 + 160 * np.sin(2 * np.pi * 1.3 * t) + 40 * lp(noise(1.0), 30) * 20
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 37 * t)))
    x = bp(x, 200, 2500) * np.sin(np.pi * t / 1.0) ** 0.5
    click = np.zeros_like(t); i = int(0.9 * SR); click[i:i + 300] = hp(noise(300 / SR), 2000) * np.exp(-np.arange(300) / 40)
    return x * 0.7 + click
def fx_scratch():
    t = tt(0.55); sp = np.where(t < 0.2, 1 + 4 * t / 0.2, 5 - 9 * (t - 0.2))
    fc = np.clip(800 * np.abs(sp), 150, 6000)
    return lp(hp(noise(0.55), 200), fc) * np.minimum(1, t / 0.01) * np.minimum(1, (0.55 - t) / 0.05) * 1.5
def fx_calc():
    x = np.zeros(int(2.6 * SR))
    for i, s in enumerate(np.arange(0.0, 2.4, 0.16)):
        f = [1800, 2100, 1950, 2300][i % 4]; b = np.sin(2 * np.pi * f * tt(0.05)) * np.hanning(int(0.05 * SR))
        place(x, b * 0.5, s)
    place(x, hp(noise(0.5), 1500) * np.exp(-tt(0.5) * 6) * 0.25, 1.9)
    return x
def fx_trombone():
    x = np.zeros(int(2.6 * SR))
    notes = [(67, 0.0, 0.42), (66, 0.45, 0.42), (65, 0.9, 0.42), (64, 1.35, 1.2)]
    for i, (n, s, d) in enumerate(notes):
        t = tt(d); f = midi(n - 12) * (1 - (0.06 * (t / d) if i == 3 else 0)) * (1 + (0.012 * np.sin(2 * np.pi * 6 * t) if i == 3 else 0))
        ph = 2 * np.pi * np.cumsum(f * np.ones_like(t)) / SR
        saw = sum(np.sin(ph * k) / k for k in range(1, 14))
        wah = 500 + 1800 * np.sin(np.pi * np.minimum(1, t / (d * 0.8))) ** 2
        y = lp(saw, wah) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.06)
        place(x, y, s)
    return x
def fx_gong():
    t = tt(3.0); x = np.zeros_like(t)
    for r, a, dcy in ((1, 1, 1.2), (2.76, 0.6, 0.9), (5.4, 0.4, 0.6), (8.93, 0.25, 0.4), (1.5, 0.5, 1.5)):
        x += np.sin(2 * np.pi * 70 * r * t * (1 + 0.002 * np.sin(2 * np.pi * 3 * t))) * a * np.exp(-t / dcy)
    return x * np.minimum(1, t / 0.004) + lp(noise(3.0), 300) * np.exp(-t * 2) * 0.3
def fx_swoosh():
    t = tt(0.45); fc = 600 + 6000 * np.sin(np.pi * t / 0.45) ** 2
    return lp(hp(noise(0.45), 500), fc) * np.sin(np.pi * t / 0.45) ** 2

if __name__ == "__main__":
    write(R.P("bgm_code.wav"), music())
    for name, fn in [("night", fx_night), ("shock", fx_shock), ("dash", fx_dash), ("brush", fx_brush), ("spray", fx_spray), ("belly", fx_belly),
                     ("sparkle", fx_sparkle), ("door", fx_door), ("scratch", fx_scratch), ("calc", fx_calc), ("trombone", fx_trombone), ("gong", fx_gong), ("swoosh", fx_swoosh)]:
        write(os.path.join(OUT, name + ".wav"), fadeout(fn()))
    print("ok")
