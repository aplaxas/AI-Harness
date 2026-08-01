# AI Literacy Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicated AI definition section with one illustrated learning sequence that takes junior developers from explicit rules to probabilistic LLM output.

**Architecture:** The chapter remains a self-contained section inside the existing Markdown article. Three generated editorial infographics carry the core analogies; the prose supplies all exact terminology and transitions into the existing Agent chapter.

**Tech Stack:** Markdown, GPT Image 2.0 built-in image generation, PNG assets, PowerShell validation commands

## Global Constraints

- Modify only `draft/harness01-rev.md` and add the three specified PNG files under `draft/images/`.
- Preserve the existing section numbering after chapter 2.
- Use a bright warm-white background, black linework, and restrained green, yellow, and red accents across all three images.
- Use landscape editorial-infographic compositions without long Korean text, logos, or watermarks.
- Do not claim that every machine-learning inference is inherently nondeterministic; distinguish LLM generation behavior from compiler guarantees.
- Keep the existing article's short, direct Korean sentences and developer-oriented analogies.

---

### Task 1: Generate the three AI Literacy illustrations

**Files:**
- Create: `draft/images/ai-rule-vs-learning.png`
- Create: `draft/images/ai-parameters-mixer.png`
- Create: `draft/images/ai-context-probability.png`

**Interfaces:**
- Consumes: visual concepts in `simple-ai-literacy/AI Literacy1.pptx`
- Produces: three landscape PNG files referenced by Task 2

- [ ] **Step 1: Generate the rule-versus-learning illustration**

Use GPT Image 2.0 with this prompt:

```text
Use case: educational editorial infographic
Primary request: a clear side-by-side visual comparison between an explicitly programmed rule and a learned relationship. On the left, a simple mechanical air-conditioner temperature dial connects through one crisp fixed path to an electricity-cost meter. On the right, several human height and weight observations feed into a small cluster of adjustable gauges that estimates a new person's weight.
Style/medium: modern flat editorial illustration, precise black ink lines, subtle paper texture, sophisticated technical-book aesthetic
Composition/framing: 16:9 landscape, two balanced halves connected by a subtle visual transition, generous margins
Color palette: warm off-white background, black linework, restrained green, yellow, and red accents only
Constraints: no long text, no Korean text, no equations, no brand marks, no watermark, no photorealism, no dashboard UI, visually understandable without labels
```

Save the selected output as `draft/images/ai-rule-vs-learning.png`.

- [ ] **Step 2: Generate the parameter-mixer illustration**

Use GPT Image 2.0 with this prompt:

```text
Use case: educational editorial infographic
Primary request: explain machine-learning parameters through the metaphor of a professional audio mixing console. Show a wide mixing board with many small knobs and sliders whose combined settings shape one clean output waveform. Make it clear that no single knob represents a complete human-readable rule; the overall configuration produces the result.
Style/medium: modern flat editorial illustration, precise black ink lines, subtle paper texture, sophisticated technical-book aesthetic matching a companion image
Composition/framing: 16:9 landscape, mixing console in three-quarter view across the center, many controls flowing toward one output waveform, generous margins
Color palette: warm off-white background, black linework, restrained green, yellow, and red accents only
Constraints: no text, no numbers, no brand marks, no watermark, no photorealism, no neon studio lighting, no dashboard UI
```

Save the selected output as `draft/images/ai-parameters-mixer.png`.

- [ ] **Step 3: Generate the context-and-probability illustration**

Use GPT Image 2.0 with this prompt:

```text
Use case: educational editorial infographic
Primary request: show that the same ambiguous input can lead to different predicted outputs depending on context and learned data distribution. A neutral sentence card enters from the left, passes through a field of many small weighted gauges, and branches toward two different destination cards on the right. Surrounding context tokens subtly tilt the gauges and change which branch becomes stronger.
Style/medium: modern flat editorial illustration, precise black ink lines, subtle paper texture, sophisticated technical-book aesthetic matching two companion images
Composition/framing: 16:9 landscape, left-to-right flow, one input, central probability field, two possible outputs, generous margins
Color palette: warm off-white background, black linework, restrained green, yellow, and red accents only
Constraints: use only abstract marks instead of readable sentences, no long text, no Korean text, no percentages, no brand marks, no watermark, no photorealism, no dashboard UI
```

Save the selected output as `draft/images/ai-context-probability.png`.

- [ ] **Step 4: Inspect all three images**

Open each PNG at full size. Confirm landscape orientation, consistent palette and linework, clear focal hierarchy, no unwanted text or watermark, and no clipped or malformed objects. Regenerate only the failing asset with a single-change prompt if necessary.

- [ ] **Step 5: Confirm the image files**

Run:

```powershell
Get-Item 'draft/images/ai-rule-vs-learning.png','draft/images/ai-parameters-mixer.png','draft/images/ai-context-probability.png' | Select-Object Name,Length
```

Expected: all three files exist and each has a non-zero length.

### Task 2: Replace chapter 2 with the integrated AI Literacy narrative

**Files:**
- Modify: `draft/harness01-rev.md:80-102`

**Interfaces:**
- Consumes: all three PNG files produced by Task 1
- Produces: chapter 2 Markdown and an unchanged `## 3. Agent — 핵심은 추론이 아니라 판단이다` boundary

- [ ] **Step 1: Replace the current chapter 2 body**

Use these exact subheadings in this order:

```markdown
## 2. AI Literacy — 규칙에서 확률로

### 규칙은 사람이 쓴다
### 학습은 관계를 조정한다
### 파라미터는 지식 목록이 아니다
### 출력은 이해의 증거가 아니라 예측의 결과다
### 컴파일러와 다른 계약
```

Explain the air-conditioner example under the first subheading and embed:

```markdown
![사람이 정한 규칙과 데이터에서 학습한 관계의 차이](images/ai-rule-vs-learning.png)

*왼쪽은 사람이 규칙을 정하고, 오른쪽은 데이터가 파라미터를 조정한다.*
```

Explain height-and-weight learning under the second subheading. State that training adjusts numerical parameters to reduce prediction error, not that the model discovers an unquestionable physical law.

Explain the mixing-console metaphor under the third subheading and embed:

```markdown
![여러 파라미터의 조합이 하나의 출력을 만드는 모습](images/ai-parameters-mixer.png)

*파라미터 하나가 규칙 하나를 뜻하지 않는다. 수많은 값의 조합이 출력을 만든다.*
```

Explain translation and Houston-style classification under the fourth subheading. Describe output as a conditional prediction shaped by training distribution and current context, and embed:

```markdown
![맥락과 학습 분포가 출력 확률을 바꾸는 모습](images/ai-context-probability.png)

*같은 입력도 함께 주어진 맥락과 학습된 분포에 따라 다른 후보가 강해진다.*
```

Under the final subheading, retain the existing abstraction-ladder table and the practical failure modes: hallucination, over-implementation, omission, and subtle distortion. Replace the absolute nondeterminism claim with this distinction: reproducibility can be increased by fixing model, prompt, tools, context, and decoding settings, but an LLM still does not offer the same input-output contract as a compiler.

- [ ] **Step 2: Add the transition to Agent**

End chapter 2 with this argument in the article's voice: unstable output is not handled by trust; it is handled by a loop that can act, observe, and verify. The next chapter names that loop an Agent. Ensure the existing chapter 3 heading remains unchanged and directly follows the new chapter.

- [ ] **Step 3: Check duplication and terminology**

Run:

```powershell
rg -n "AI는 무엇인가|비결정적|에어컨|파라미터|컴파일러|## 3\. Agent" 'draft/harness01-rev.md'
```

Expected: the old chapter title is absent; the new examples appear only where they advance the chapter; `## 3. Agent` appears once.

### Task 3: Validate the completed chapter and assets

**Files:**
- Verify: `draft/harness01-rev.md`
- Verify: `draft/images/ai-rule-vs-learning.png`
- Verify: `draft/images/ai-parameters-mixer.png`
- Verify: `draft/images/ai-context-probability.png`

**Interfaces:**
- Consumes: completed Markdown and image assets
- Produces: a clean diff ready for user review

- [ ] **Step 1: Validate Markdown image links**

Run:

```powershell
$doc = Get-Content -Raw 'draft/harness01-rev.md'
[regex]::Matches($doc, '!\[[^\]]*\]\(([^)]+)\)') | ForEach-Object {
  $target = Join-Path 'draft' $_.Groups[1].Value
  [pscustomobject]@{ Target = $target; Exists = Test-Path $target }
}
```

Expected: every target reports `Exists = True`.

- [ ] **Step 2: Validate heading order and stale content**

Run:

```powershell
rg -n '^## ' 'draft/harness01-rev.md'
rg -n 'AI는 무엇인가 — 결정론을 버린 첫 번째 추상화' 'draft/harness01-rev.md'
```

Expected: sections run from 0 through 7 in order; the second command returns no match.

- [ ] **Step 3: Review the final diff**

Run:

```powershell
git diff --check
git diff -- 'draft/harness01-rev.md'
git status --short
```

Expected: no whitespace errors; the diff contains only the chapter replacement; status contains the three images and intended documentation changes, while the source PPTX remains unmodified.

- [ ] **Step 4: Commit the completed chapter**

```powershell
git add -- 'draft/harness01-rev.md' 'draft/images/ai-rule-vs-learning.png' 'draft/images/ai-parameters-mixer.png' 'draft/images/ai-context-probability.png' 'docs/superpowers/plans/2026-08-01-ai-literacy-chapter.md'
git commit -m "docs: add illustrated AI literacy chapter"
```
