---
name: "팡피디-v10-코드영상툰"
description: "팡피디 V1.0 코드영상툰 스킬(사용자 전용). 레퍼런스 썰툰 쇼츠(유튜브 링크)를 분석해 대본을 새로 쓰고(베끼기 금지), 이미지 생성 AI 없이 Claude Code가 코드(SVG 캐릭터 리그 + 시간 함수 렌더)로만 그린 9:16 꽉 찬 화면 1분 애니메이션 숏폼을 만든다. 목소리는 ElevenLabs 고정 성우(남편 Harry / 아내 수진, eleven_v4)로 대사별 녹음, 입은 음성 크기에 맞춰 립싱크, 배경음악·효과음은 numpy 코드 합성(옵션: ElevenLabs 음악·효과음판도 함께). HeyGen HyperFrames 스킬의 렌더 규약(renderAt(t) 시크·캡처, 세로 세이프존, 모션·자막 원칙)을 로컬 Playwright로 구현. \"코드영상툰\", \"코드로만 영상툰\", \"썰툰 코드로 만들어\", \"재흙 영상툰\" 이라고 하거나 /팡피디-V1.0-코드영상툰 으로 실행할 때 사용한다."
argument-hint: "<레퍼런스 유튜브 링크>  [길이(초), 기본 60]"
user-invocable: true
metadata:
  version: "1.0"
  made: "2026-11-15"
  based_on: "세션 'V1.0 재흙 영상툰 코드만사용' — 예제 '불 끄자마자 오늘 밤 할까? 묻는 아내의 진짜 속셈'"
---

# 팡피디 V1.0 코드영상툰

레퍼런스 썰툰 쇼츠를 보고 **같은 스타일·같은 결의 코미디**를, **대본은 새로 써서**, **그림은 코드로만** 그려 9:16 1분 숏폼으로 만든다.

## 사용자 규칙 (반드시)
1. **대본은 레퍼런스를 분석만 하고 새로 쓴다.** 대사·전개를 그대로 옮기지 않는다. 큰 틀(상황·반전 구조)만 참고하고 반전·대사는 새로.
2. **화면은 Claude Code 코드로만.** 이미지·영상 생성 AI(gpt-image, Higgsfield, Kling 등) 금지. SVG 리그로 그린다.
3. **목소리는 우리가 쓰던 것**: ElevenLabs `eleven_v4`, 남편 `Harry - Character`(`wMrz30qBeYiSkAtnZGtn`), 아내 `수진 - 밝고 친근한 여성`(`9cino9hfS3ougiPeFvp1`). 대사 1줄 = 1 생성, `generations_count: 1`.
4. **9:16 꽉 찬 화면**(1080×1920, 흰 여백·패널 레이아웃 금지), 약 60초, 배경음악 + 목소리 + 효과음.
5. 기본 납품은 **코드사운드판**(음악·효과음 코드 합성). 사용자가 원하면 ElevenLabs 음악·효과음판도 같은 영상에 믹스만 바꿔 함께 낸다.
6. 끝나면 완성 영상만 남기고 소스는 `휴지통/` 폴더로 옮긴다(바로 삭제하지 않는다).

## 모델 확인
사용자가 특정 모델(예: Fable 5.2)로 만들라고 하면 `mcp__claude-code-remote__get_session` 으로 `session_context.model` 과 `last_served_model` 을 확인해 **실제 모델을 정직하게 알린다**. 다르면 `/model` 로 바꾸고 다시 요청하라고 안내한다(모델 비교용이면 특히).

## 파일 구성
```
scripts/timeline.py   SEG(대사·장면·효과음 타임라인) + 오디오 믹스 audio() + (V0) AI 이미지판 PIL 합성
scripts/prep.py       타임라인·자막·립싱크 포락선 → toon/data.js
scripts/synth.py      배경음악(장조 → 반전 후 단조) + 효과음 13종 numpy 합성 → bgm_code.wav, sfx_code/
scripts/toon/index.html  renderAt(t): 카메라·펀치인·휘프·플래시·제목·자막 오버레이
scripts/toon/lib.js      남편/아내 리그(눈 10종, 눈썹, 입, 볼터치, 땀, 눈물, 핏대), 소품, 의성어
scripts/toon/scenes.js   장면 함수 15개 + 아웃트로 (예제 이야기 — 새 이야기마다 다시 쓴다)
scripts/toon/render.mjs  Playwright 시크·캡처 렌더러 (snap / video 4워커)
assets/fonts/         Black Han Sans(제목·의성어), Gothic A1 ExtraBold/Bold(자막), Do Hyeon — 모두 OFL
references/hyperframes-notes.md  HyperFrames 스킬에서 가져온 원칙 요약
examples/오늘밤할까/대본.txt     예제 대본(구성·효과음 표기 형식)
```

## 작업 순서

### PHASE 0 — 작업 폴더
`OUT=<scratchpad>/<제목>` 를 만들고 `scripts/*.py` → `OUT/`, `scripts/toon/*` → `OUT/toon/`, `assets/fonts/*` → `OUT/fonts/` 와 `OUT/toon/fonts/` 로 복사.

### PHASE 1 — 레퍼런스 분석
- `/watch` 스킬로 링크를 본다. 클라우드에서 YouTube가 봇 확인으로 막으면(429/“Sign in to confirm”) 우회하지 말고 공개 메타데이터만:
  `curl "https://www.youtube.com/oembed?url=<링크>&format=json"`, 썸네일 `https://i.ytimg.com/vi/<ID>/hqdefault.jpg`, `hq1.jpg`, `hq2.jpg`, `hq3.jpg`(영상 25/50/75% 지점 자동 캡처) → Read 로 본다.
- 정리: 제목 형식, 캐릭터(성별·나이·옷), 장소, 자막 위치·색, 상황과 반전 구조. **대사는 받아 적지 않는다.**

### PHASE 2 — 새 대본 (약 60초)
- 대사 12~16줄, 6~8개 비트: 상황 → 오해/설렘 → 과한 준비(몸개그) → 반전 → 추궁 → 굴욕 → 결정타 한마디 → 엔딩 자막.
- 줄마다 화자(H/Wf/T=속마음), 장면, 효과음, 의성어를 정한다(예제 형식: `examples/오늘밤할까/대본.txt`).
- 제목 훅 2줄: 1줄에 강조 문구(빨강) 하나. 원본 제목과 다르게.

### PHASE 3 — 목소리 (ElevenLabs)
- `creative_create_flow` 로 흐름 하나를 만들고, 대사마다 `creative_generate_speech`(model `eleven_v4`, 위 voice_id, `generations_count: 1`). 감정 태그를 앞에: `[whispering]`, `[shyly, softly]`, `[excited, flustered]`, `[stunned, flat]`, `[sniffing, suspicious]`, `[yawns]`, `[firm, cold]` …
- `creative_get_flow_run_status` 로 URL을 받아 `OUT/vo/NN.mp3` 로 내려받고 앞뒤 무음을 다듬는다:
  `ffmpeg -i vo/NN.mp3 -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse" -ar 44100 -ac 2 vo/tNN.wav`
- 다시 생성하지 않는다(재시도 = 추가 과금). 대사 합계가 길면 `TEMPO`(기본 1.08)와 앞 공백으로 60초에 맞춘다.

### PHASE 4 — 타임라인
- `timeline.py` 의 `SEG`, `OUTRO`, `OUTRO_LEN`, `TEMPO` 를 새 대본으로 바꾸고 `python timeline.py preview` 로 총 길이·장면 시각을 본다(목표 58~62초).
- `python prep.py` → `toon/data.js`(장면 구간, 자막, 남편·아내 립싱크 포락선 30fps).

### PHASE 5 — 코드로 그리기 (HyperFrames 규약)
- `scenes.js` 에 장면 키마다 함수 `(t, seg, lt, st, D) => { body, cam:{s,cx,cy}, punch?, whipIn?, flash? }` 를 쓴다. `lt`=장면 시작부터, `st`=대사 시작부터.
- 모든 것은 **t 만의 함수**: `Math.random()`/타이머 금지, `rng(seed)`·`noise1`·`spring()` 사용.
- 리그 사용: `husbandBust(t,x,y,s,{eyes,brows,mouth,open,blush,...},{hem,belly,gray})`, `wifeBust(t,x,y,s,{eyes,mouth,open,glasses,glare,shine,...})`. 말하는 줄은 `open: lipAt("h"|"w", t)`, 속마음 줄은 입을 움직이지 않는다.
- 연기: 표정 변화는 `spring()` 으로 눌림→튐→안착. 양팔·양눈을 똑같이 움직이지 않는다. 충격 비트는 `punch`(확대+흔들림).
- 전환은 3종 이상 섞는다: 컷, `whipIn`(가로 블러 휘프), `flash`(불 켜짐), 아웃트로 딥.
- 레이아웃(9:16 세이프존): 위 168px 안 비움, 제목 y≈262/356, 얼굴·핵심은 400~1150, 자막은 y≈1296 기준(두 줄이면 위로), 1330 아래는 몸·이불 같은 배경만.
- 확인: `node toon/render.mjs snap 3,9,12.5,...` → `toon/snaps/*.png` 를 Read 로 본다. 장면마다 한 장 이상.

### PHASE 6 — 사운드
- 코드판: `python synth.py` → `bgm_code.wav`, `sfx_code/*.wav`(night, shock, dash, brush, spray, belly, sparkle, door, scratch, calc, trombone, gong, swoosh). 새 이야기에 맞게 코드·이름을 고친다.
- (선택) ElevenLabs판: 음악 `eleven_music_v2_5` 65초 1개, 효과음 `eleven_text_to_sound_v2` 각 1개 → `bgm.mp3`, `sfx/*.mp3`.
- 믹스: `R.audio(sfx_dir='sfx_code', ext='wav', bgm='bgm_code.wav', out='audio_code.wav', bgm_vol=0.22)` / `R.audio(out='audio_eleven.wav')`. 반전 순간(레코드 스크래치)에 배경음악을 끊었다가 다시 올린다. 결과는 `loudnorm` 으로 −14 LUFS, true peak −1.5 dB 근처.

### PHASE 7 — 렌더·검수·납품
- `node toon/render.mjs video 4` (4워커, 1080×1920 30fps 61초 ≈ 2분 30초) → `toon/video.mp4`.
- `ffmpeg -i toon/video.mp4 -i audio_code.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart <제목>_9x16_코드사운드.mp4`
- 검수: 16장 컨택트시트(`ffmpeg -ss t ... tile=8x2`)로 모든 장면·자막·의성어를 본다. `ffprobe` 로 길이·해상도, `ebur128` 로 음량. 소리는 들을 수 없으니 “측정만 했다”고 보고한다.
- `SendUserFile` 로 완성본을 보내고, 모델·적용 스킬·확인 못 한 점을 짧게 보고.
- 마무리 요청이 오면 완성 영상은 `완성영상/` 에, 나머지 소스는 `휴지통/` 으로 옮긴다.

## 겪은 함정 (다시 밟지 말 것)
- `npx hyperframes …`(외부 패키지 실행)은 권한 정책에서 막힌다 → 원칙만 적용하고 렌더러는 `scripts/toon/render.mjs`.
- Playwright는 CommonJS: `import pw from "/opt/node-tools/node_modules/playwright/index.js"; const { chromium } = pw;`
- Do Hyeon 폰트에는 `…`, `✦` 글리프가 없어 네모(□)가 뜬다 → 의성어는 Black Han Sans, 특수문자는 피한다.
- 자막은 다음 장면이 시작하는 순간(`show`) 지운다. 대사 끝 +0.6초까지 남기면 컷을 넘어가 어색하다.
- 흔들림(shake) 뒤에는 카메라 박스를 이미지 안쪽으로 다시 clamp(V0 PIL판 `box offset can't be negative`).
- PIL `textbbox` 는 float → `int(math.ceil(...))`.
- 큰 흰 원·그라데이션 박스 같은 배경 장식은 제목/자막 영역에서 경계가 보이면 지운다.
- ElevenLabs 생성은 같은 요청을 다시 보내면 추가 과금. 결과 URL은 몇 시간 뒤 만료되니 바로 받는다.
