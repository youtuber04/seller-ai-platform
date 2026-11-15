"""Export the shared timeline + per-frame lip-sync envelopes for the code-drawn version."""
import json, subprocess, os
import numpy as np
import timeline as R  # shared timeline + audio mix

FPS = 30
SR = 16000
OUT = R.P("toon")
os.makedirs(OUT, exist_ok=True)

def pcm(path):
    raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", path, "-af", f"atempo={R.TEMPO}", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"])
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0

n = int(round(R.TOTAL * FPS))
env = {"h": np.zeros(n), "w": np.zeros(n)}
segs = []
for s in R.timeline:
    who = "w" if s["col"] == R.Wf else "h"
    thought = s["col"] == R.T
    x = pcm(R.P(f"vo/t{s['vo']:02d}.wav"))
    hop = SR // FPS
    frames = len(x) // hop
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(frames)])
    if not thought:
        f0 = int(round(s["start"] * FPS))
        e = env[who]
        m = min(frames, n - f0)
        e[f0:f0 + m] = np.maximum(e[f0:f0 + m], rms[:m])
    segs.append(dict(vo=s["vo"], scene=s["scene"], show=round(s["show"], 3), hide=round(s["hide"], 3),
                     start=round(s["start"], 3), end=round(s["end"], 3), who=who, thought=thought,
                     sub=s["sub"], sfx=[[a, round(b, 3), c] for a, b, c in s["sfx"]]))

for k in env:
    e = env[k]
    ref = np.percentile(e[e > 0.01], 90) if (e > 0.01).any() else 1
    e = np.clip(e / ref, 0, 1)
    # light smoothing so the jaw doesn't chatter
    e = np.convolve(e, [0.25, 0.5, 0.25], mode="same")
    env[k] = [round(float(v), 3) for v in e]

data = dict(fps=FPS, total=round(R.TOTAL, 3), outro_start=round(R.outro_start, 3), outro=R.OUTRO, segs=segs, lip=env)
with open(os.path.join(OUT, "data.js"), "w") as f:
    f.write("window.DATA = " + json.dumps(data, ensure_ascii=False) + ";\n")
print("frames", n, "total", R.TOTAL)
for s in segs:
    print(s["vo"], s["scene"], s["show"], s["start"], s["end"], s["who"], "T" if s["thought"] else "")
