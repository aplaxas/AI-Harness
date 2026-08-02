# AI Harness 5시간 강의 덱 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `harness/` 1~3편을 약 70장의 편집 가능한 5시간 발표용 PowerPoint와 발표자 노트로 재구성한다.

**Architecture:** 구현 코드는 저장소의 임시 빌드 폴더 `.tmp/ai-harness-lecture/`에 둔다. 콘텐츠는 네 막별 모듈로 분리하고, 공통 테마·레이아웃 함수가 `@oai/artifact-tool`로 슬라이드를 생성한다. 최종 산출물만 저장소 루트의 `AI-Harness-5h-Lecture.pptx`로 내보낸다.

**Tech Stack:** JavaScript ES modules, `@oai/artifact-tool`, PowerPoint PPTX, 번들 Python 렌더링·검사 도구

## Global Constraints

- 대상은 AI 코딩 경험이 있지만 검증 방법을 체계적으로 배우지 못한 주니어 개발자다.
- 휴식 제외 5시간이며, 네 막 280분과 안내·전환·질의응답 20분으로 구성한다.
- 전체는 약 70장, 핵심 본편 약 55장, 선택 모듈 약 15장이다.
- 16:9, 밝은 회백색 바탕, 먹색 본문, 파란색 한 가지 포인트 색을 사용한다.
- 제목 36pt 이상, 본문 20~26pt를 기본으로 하고 16pt 아래로 줄이지 않는다.
- 본문은 담백하게 유지하고 코드·파일·명령·검증 흐름에서만 개발자 문법을 사용한다.
- 카파시 원문 캡처와 토발즈 커밋 메시지 원문은 각각 한 슬라이드 전체를 사용한다.
- 각 슬라이드에는 원고 기반 설명, 전환 문장, 예상 시간, 선택 모듈 여부, 필요한 `[Sources]` 블록을 발표자 노트로 기록한다.
- `✍️ [채우기]` 경험은 지어내지 않는다.
- 원고의 다섯 축, 검증 루프, 사람의 판단과 책임, 정본 이동, 단계 생략 원칙을 바꾸지 않는다.
- 원고 파일은 수정하지 않는다.
- 구현에는 `@oai/artifact-tool`의 JavaScript ES module API만 사용한다. `python-pptx`를 사용하지 않는다.
- 최종 PPTX 전달 전 모든 슬라이드를 렌더링하고 겹침·잘림·줄바꿈·발표자 노트를 검증한다.

---

## File Map

- Create: `.tmp/ai-harness-lecture/theme.mjs` — 색, 글꼴, 여백, 공통 슬라이드 장식과 텍스트 유틸리티
- Create: `.tmp/ai-harness-lecture/layouts.mjs` — 표지·막 구분·주장·비교·흐름·원문·사례·정리 레이아웃
- Create: `.tmp/ai-harness-lecture/content/act1.mjs` — 1막 슬라이드 사양과 노트
- Create: `.tmp/ai-harness-lecture/content/act2.mjs` — 2막 슬라이드 사양과 노트
- Create: `.tmp/ai-harness-lecture/content/act3.mjs` — 3막 슬라이드 사양과 노트
- Create: `.tmp/ai-harness-lecture/content/act4.mjs` — 4막 슬라이드 사양과 노트
- Create: `.tmp/ai-harness-lecture/content/appendix.mjs` — 5·3·2시간 축약 가이드
- Create: `.tmp/ai-harness-lecture/validate-content.mjs` — 장수, 필수 메시지, 시간, 노트, 출처, 선택 모듈 검증
- Create: `.tmp/ai-harness-lecture/build-deck.mjs` — 콘텐츠를 레이아웃에 전달하고 PNG·몽타주·PPTX를 내보내는 진입점
- Create: `.tmp/ai-harness-lecture/source-notes.txt` — 사용한 원고·이미지·외부 링크의 출처 기록
- Create: `AI-Harness-5h-Lecture.pptx` — 최종 편집 가능한 강의 덱

### Shared Interfaces

모든 콘텐츠 모듈은 다음 형태의 객체 배열을 export한다.

```js
export const act1Slides = [
  {
    id: "01-01",
    layout: "statement",
    section: "왜 Harness인가",
    title: "AI에게 일을 맡기기 전에 만들어야 하는 것",
    body: ["검증할 수 있는 만큼만 맡길 수 있다."],
    minutes: 2,
    optional: false,
    notes: "이 슬라이드에서 강의의 질문을 제시한다.\n\n[Sources]\n- harness/01-하네스란무엇인가.md",
  },
];
```

`layouts.mjs`는 다음 인터페이스를 제공한다.

```js
export function renderSlide(presentation, spec, context) {
  // context: { slideNumber, totalSlides, assets, fonts }
  // returns the created Slide facade
}
```

`theme.mjs`는 다음 값을 제공한다.

```js
export const CANVAS = { width: 1280, height: 720 };
export const COLORS = {
  background: "#F5F7FA",
  paper: "#FFFFFF",
  ink: "#18222D",
  muted: "#667180",
  accent: "#2878C7",
  code: "#162334",
  codeText: "#DCEBFA",
  line: "#D9E0E8",
};
export const FRAME = { left: 76, top: 64, width: 1128, height: 588 };
export function resolveFonts(installedFamilies) {
  return {
    body: installedFamilies.has("Pretendard") ? "Pretendard" : "Malgun Gothic",
    code: installedFamilies.has("D2Coding") ? "D2Coding" : "Consolas",
  };
}
```

---

### Task 1: Build the content contract and validator

**Files:**
- Create: `.tmp/ai-harness-lecture/validate-content.mjs`
- Create: `.tmp/ai-harness-lecture/content/act1.mjs`
- Create: `.tmp/ai-harness-lecture/content/act2.mjs`
- Create: `.tmp/ai-harness-lecture/content/act3.mjs`
- Create: `.tmp/ai-harness-lecture/content/act4.mjs`
- Create: `.tmp/ai-harness-lecture/content/appendix.mjs`

**Interfaces:**
- Consumes: `harness/01-하네스란무엇인가.md`, `harness/02-개발방법론.md`, `harness/03-개발흐름.md`, approved design spec
- Produces: `act1Slides`, `act2Slides`, `act3Slides`, `act4Slides`, `appendixSlides`; each slide follows the Shared Interfaces contract

- [ ] **Step 1: Initialize the artifact workspace**

Run:

```powershell
& 'C:\Users\JongminLee\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'C:\Users\JongminLee\.codex\plugins\cache\openai-primary-runtime\presentations\26.802.11031\skills\presentations\container_tools\setup_artifact_tool_workspace.mjs' --workspace 'C:\develop\AI\AI-Harness\.tmp\ai-harness-lecture'
```

Expected: `.tmp/ai-harness-lecture/package.json`과 `node_modules`가 준비된다.

- [ ] **Step 2: Write the validator before the slide content**

`validate-content.mjs`는 다섯 콘텐츠 배열을 합쳐 다음 조건을 검사하고 하나라도 어기면 `process.exitCode = 1`로 끝낸다.

```js
const allowedLayouts = new Set(["title", "section", "statement", "compare", "flow", "source-image", "source-code", "example", "summary"]);
assert(slides.length >= 65 && slides.length <= 75, "slide count must be 65–75");
assert(slides.every((s) => /^\d{2}-\d{2}$/.test(s.id)), "every slide needs a stable id");
assert(new Set(slides.map((s) => s.id)).size === slides.length, "slide ids must be unique");
assert(slides.every((s) => allowedLayouts.has(s.layout)), "layout must be supported");
assert(slides.every((s) => s.title && s.minutes > 0 && typeof s.optional === "boolean"), "title, minutes, optional are required");
assert(slides.every((s) => s.notes.includes("[Sources]")), "every slide needs a Sources block");
assert(slides.reduce((sum, s) => sum + s.minutes, 0) === 280, "content time must total 280 minutes");
assert(slides.filter((s) => s.optional).length >= 12, "at least 12 optional slides are required");
assert(slides.some((s) => s.layout === "source-image" && s.asset === "AndrejCarpathy.png"), "Karpathy source slide is required");
assert(slides.some((s) => s.layout === "source-code" && s.title.includes("토발즈")), "Torvalds source slide is required");
```

- [ ] **Step 3: Run the empty-content validator and verify it fails**

Run:

```powershell
& 'C:\Users\JongminLee\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.tmp\ai-harness-lecture\validate-content.mjs'
```

Expected: FAIL with `slide count must be 65–75`.

- [ ] **Step 4: Author the complete slide specifications**

Create 65–75 slide specs across the five modules. Use this sequence and source mapping:

- `act1.mjs`: title, Karpathy original, Torvalds original, author interpretation, rule vs learning, parameters, probability, compiler contract, LLM vs Agent, human judgment. Source: 1편 sections 1–3.
- `act2.mjs`: harness definition, five axes, Torvalds remapping, verification feedback, loop, Agent·Task·Skill, enforceability levels, human responsibility. Source: 1편 sections 4–6.
- `act3.mjs`: SDD, DDD, TDD, Deep Module, common misconceptions, harness enforcement, four-way comparison. Source: 2편.
- `act4.mjs`: cognitive debt, six-step map, source-of-truth transition, six detailed steps, order-cancellation example, skip criteria, method placement, Deep Module review question. Source: 3편.
- `appendix.mjs`: 5-hour, 3-hour, and 2-hour removal paths. Appendix time is recorded as part of the final 280 minutes, not as extra hidden time.

Visible copy must be audience-facing. Timing and `optional` instructions belong only in `notes`.

- [ ] **Step 5: Run the validator and verify it passes**

Run the Step 3 command again.

Expected: PASS and output `validated 65–75 slides / 280 minutes` with the actual count.

---

### Task 2: Implement the visual system and all layout renderers

**Files:**
- Create: `.tmp/ai-harness-lecture/theme.mjs`
- Create: `.tmp/ai-harness-lecture/layouts.mjs`
- Create: `.tmp/ai-harness-lecture/build-deck.mjs`

**Interfaces:**
- Consumes: Shared Interfaces content objects and local PNG assets
- Produces: `renderSlide(presentation, spec, context)` plus a 1280×720 editable PowerPoint deck

- [ ] **Step 1: Add a renderer contract check**

At the start of `build-deck.mjs`, assert that every distinct `spec.layout` has a renderer registered in `LAYOUTS`.

```js
const missing = [...new Set(slides.map((s) => s.layout))].filter((name) => !LAYOUTS[name]);
if (missing.length) throw new Error(`Missing layout renderers: ${missing.join(", ")}`);
```

- [ ] **Step 2: Run the build and verify it fails before renderers exist**

Run:

```powershell
& 'C:\Users\JongminLee\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.tmp\ai-harness-lecture\build-deck.mjs'
```

Expected: FAIL with `Missing layout renderers`.

- [ ] **Step 3: Implement theme and shared chrome**

Implement `CANVAS`, `COLORS`, `FRAME`, and `resolveFonts()` exactly as defined in Shared Interfaces. Add helpers:

```js
export function addFooter(slide, { section, slideNumber, totalSlides, fonts }) {}
export function addTitle(slide, text, { fonts, top = 64, width = 1128 }) {}
export function addBodyLines(slide, lines, { fonts, left, top, width, height }) {}
export async function readImageBytes(path) {}
```

`addFooter` renders a small section label at bottom-left and `slideNumber / totalSlides` at bottom-right. General slides use `COLORS.background`; source slides may use `COLORS.paper` or `COLORS.code`.

- [ ] **Step 4: Implement all nine renderers**

Implement `title`, `section`, `statement`, `compare`, `flow`, `source-image`, `source-code`, `example`, and `summary` in `LAYOUTS`. Rules:

- `source-image` uses `fit: "contain"` for `AndrejCarpathy.png`; no interpretation text appears on the slide.
- `source-code` keeps the complete Torvalds message visible in one 16:9 slide using the code font and at least 16pt.
- `flow` creates connectors before nodes, keeps labels short, and uses one accent color.
- `compare` uses a flat two-column composition without card chrome.
- `statement` uses one large claim and at most three supporting lines.
- every created shape has a stable `name` prefixed by the slide id.

- [ ] **Step 5: Add speaker notes and exports**

For each rendered slide:

```js
slide.speakerNotes.textFrame.setText(spec.notes);
slide.speakerNotes.setVisible(true);
```

Export every slide to `.tmp/ai-harness-lecture/rendered/slide-N.png`, every layout to `.tmp/ai-harness-lecture/layouts/slide-N.layout.json`, the montage to `.tmp/ai-harness-lecture/deck-montage.webp`, and the PPTX to `AI-Harness-5h-Lecture.pptx`.

- [ ] **Step 6: Run the build and verify it succeeds**

Run the Step 2 command again.

Expected: PASS; final PPTX, all PNGs, all layout JSON files, and montage exist. PNG count equals slide count.

---

### Task 3: Verify content, notes, and source provenance

**Files:**
- Create: `.tmp/ai-harness-lecture/source-notes.txt`
- Modify: `.tmp/ai-harness-lecture/content/act1.mjs`
- Modify: `.tmp/ai-harness-lecture/content/act2.mjs`
- Modify: `.tmp/ai-harness-lecture/content/act3.mjs`
- Modify: `.tmp/ai-harness-lecture/content/act4.mjs`
- Modify: `.tmp/ai-harness-lecture/content/appendix.mjs`

**Interfaces:**
- Consumes: final content specs and source manuscripts
- Produces: traceable `[Sources]` notes and a provenance ledger

- [ ] **Step 1: Record provenance**

Write `source-notes.txt` with the three manuscript paths, four local image paths, Karpathy X URL, Torvalds commit URL, and the cognitive-debt article URL already present in the manuscripts. Do not add new claims or sources.

- [ ] **Step 2: Run a source-block scan**

Extend `validate-content.mjs` to require every notes string to end with a non-empty `[Sources]` block and to reject `TBD`, `TODO`, `✍️`, or `[채우기]` in visible copy.

Expected before cleanup: FAIL if any placeholder or empty source remains.

- [ ] **Step 3: Fix every reported content or note issue**

For manuscript-only slides, use the relevant `harness/*.md` path. For the two original-source slides, include the direct external URL. For local images, include both the image path and the manuscript path that explains it.

- [ ] **Step 4: Re-run content validation**

Run:

```powershell
& 'C:\Users\JongminLee\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.tmp\ai-harness-lecture\validate-content.mjs'
```

Expected: PASS with no placeholders and all notes sourced.

---

### Task 4: Render, inspect, and repair the complete deck

**Files:**
- Modify: `.tmp/ai-harness-lecture/layouts.mjs`
- Modify: `.tmp/ai-harness-lecture/content/*.mjs`
- Modify: `AI-Harness-5h-Lecture.pptx`

**Interfaces:**
- Consumes: generated PPTX and rendered PNGs
- Produces: visually verified final deck

- [ ] **Step 1: Run the overflow test**

Run:

```powershell
& 'C:\Users\JongminLee\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\JongminLee\.codex\plugins\cache\openai-primary-runtime\presentations\26.802.11031\skills\presentations\container_tools\slides_test.py' 'C:\develop\AI\AI-Harness\AI-Harness-5h-Lecture.pptx'
```

Expected: no objects outside the slide canvas.

- [ ] **Step 2: Render the exported PPTX independently**

Run:

```powershell
& 'C:\Users\JongminLee\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\JongminLee\.codex\plugins\cache\openai-primary-runtime\presentations\26.802.11031\skills\presentations\container_tools\render_slides.py' 'C:\develop\AI\AI-Harness\AI-Harness-5h-Lecture.pptx'
```

Expected: one rendered PNG per slide in `AI-Harness-5h-Lecture/`.

- [ ] **Step 3: Create and inspect a montage**

Run:

```powershell
& 'C:\Users\JongminLee\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\JongminLee\.codex\plugins\cache\openai-primary-runtime\presentations\26.802.11031\skills\presentations\container_tools\create_montage.py' --input_dir 'C:\develop\AI\AI-Harness\AI-Harness-5h-Lecture' --output_file 'C:\develop\AI\AI-Harness\.tmp\ai-harness-lecture\final-montage.png'
```

Inspect the montage for narrative rhythm, repeated silhouettes, density spikes, missing footer labels, and inconsistent section transitions.

- [ ] **Step 4: Inspect every slide at full size**

Open all slide PNGs individually. Check title wrapping, body clipping, image sharpness, code readability, connector routing, table alignment, and source-slide legibility. Record issues in `.tmp/ai-harness-lecture/qa-ledger.txt` as `slide number | issue | correction`.

- [ ] **Step 5: Repair and rebuild until clean**

Fix renderer-level issues in `layouts.mjs` and slide-specific copy issues in the relevant content module. Re-run Tasks 1, 2, and Steps 1–4 until the overflow test is clean and the QA ledger has no unresolved lines.

- [ ] **Step 6: Verify repository integrity**

Run:

```powershell
git diff --check -- 'harness/' 'docs/superpowers/'
```

Expected: no whitespace errors. Confirm `git status --short` still shows the user's pre-existing manuscript and image changes separately from the new PPTX.

---

### Task 5: Final delivery commit

**Files:**
- Create: `AI-Harness-5h-Lecture.pptx`

**Interfaces:**
- Consumes: verified PPTX
- Produces: repository deliverable and clean handoff

- [ ] **Step 1: Final artifact checks**

Confirm the file exists, has a non-zero size, opens through the independent renderer, contains the validated slide count, and includes visible speaker notes on every slide.

- [ ] **Step 2: Stage only the final deck**

Run:

```powershell
git add -- 'AI-Harness-5h-Lecture.pptx'
git diff --cached --stat
```

Expected: only `AI-Harness-5h-Lecture.pptx` is staged.

- [ ] **Step 3: Commit the final deck**

Run:

```powershell
git commit -m "docs: add AI harness lecture deck"
```

Expected: commit succeeds without including the user's existing `harness/` changes.
