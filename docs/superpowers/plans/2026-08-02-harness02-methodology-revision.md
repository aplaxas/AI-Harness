# Harness Development Methodology Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a junior-developer-facing revision of the Harness methodology that explains the six-stage artifact lifecycle and embeds SDD, DDD, and TDD in the stages where they operate.

**Architecture:** Preserve the original article and create one independent revision. Organize the revision by the actual workflow, make `subagent-driven-development` the point where test code and production source code are created, then explain how `spec-flow-e2e` and `spec-wiki` turn that implementation back into reusable project knowledge.

**Tech Stack:** Korean Markdown, Superpowers workflow concepts, spec-tools source documentation, PowerShell validation commands

## Global Constraints

- Create only `draft/harness02-개발방법론-rev.md`; do not modify `draft/harness02-개발방법론.md`.
- Write for junior developers in concise Korean `~다` prose.
- Use the six stages as the main chapter order: brainstorming → writing-plans → spec-explainer → subagent-driven-development → spec-flow-e2e → spec-wiki.
- At first mention, explain that the user's `write-plan` stage maps to the actual skill name `superpowers:writing-plans`.
- Treat `subagent-driven-development` as the stage that creates test code and production source code.
- Treat production source code as the source of truth for current runtime behavior after implementation.
- State that explained and wiki documents are aids, not sources of truth.
- State that `spec-flow-e2e` creates a flow document, not Playwright/Cypress-style E2E test code.
- Remove Deep Module from the central methodology; retain only its useful insight about managing complexity behind understandable boundaries.
- Do not include the original article's YouTube recommendation lists.
- Preserve the distinction between an intended design before implementation and actual behavior after implementation.

---

### Task 1: Write the complete six-stage methodology revision

**Files:**
- Create: `draft/harness02-개발방법론-rev.md`
- Reference: `draft/harness02-개발방법론.md`
- Reference: `docs/superpowers/specs/2026-08-02-harness02-methodology-revision-design.md`
- Reference: `C:/develop/pyan/team-plugins/packages/spec-tools/README.md`
- Reference: `C:/develop/pyan/team-plugins/packages/spec-tools/skills/spec-explainer/SKILL.md`
- Reference: `C:/develop/pyan/team-plugins/packages/spec-tools/skills/spec-flow-e2e/SKILL.md`
- Reference: `C:/develop/pyan/team-plugins/packages/spec-tools/skills/spec-wiki/SKILL.md`

**Interfaces:**
- Consumes: the approved design and the documented source-of-truth rules of the six skills
- Produces: a standalone Markdown article whose headings and terminology Task 2 can validate mechanically

- [ ] **Step 1: Write the opening and workflow map**

Start with this title and opening structure:

```markdown
# AI 시대의 Harness 개발 방법론

## 1. Harness는 개발 흐름을 강제하는 환경이다
```

Define Harness as a development environment and operating principle that preserves agreement, verification, and context. State that producing many documents is not the objective. Explain that the workflow converts conversation into a spec, the spec into a verified implementation sequence, implementation into test and production code, and code back into searchable knowledge.

Include this exact six-stage map:

```text
brainstorming
  요구사항 합의와 spec
      ↓
writing-plans
  TDD를 내장한 구현 순서
      ↓
spec-explainer
  구현 전 사람의 이해와 검토
      ↓
subagent-driven-development
  테스트 코드와 실제 소스코드 생성
      ↓
spec-flow-e2e
  실제 소스코드를 정본으로 한 흐름 복원
      ↓
spec-wiki
  다음 작업에서 재사용할 프로젝트 지식
      ↺
다음 brainstorming의 컨텍스트
```

Immediately explain that this is a cycle, not a document conveyor belt. The wiki and source-backed flow become context for later brainstorming.

- [ ] **Step 2: Write the brainstorming chapter**

Use this heading:

```markdown
## 2. Brainstorming — 무엇을 만들지 합의한다
```

Cover all of the following:

- SDD means finding mismatched interpretations before implementation, not merely writing a long spec.
- The questions are purpose, scope, exclusions, constraints, and observable success conditions.
- DDD begins here through shared terminology: do not guess ambiguous domain words.
- The output is a spec, and the spec is the pre-implementation source of truth for what was agreed.
- The human approves scope and decisions; the AI exposes ambiguity and records the agreement.
- Common junior mistake: treating brainstorming as free-form ideation that can end without a written spec.

Use the six-part repeated pattern: why needed, questions forced on AI, what the human checks, input/output, handoff, common misunderstanding.

- [ ] **Step 3: Write the writing-plans chapter**

Use this heading:

```markdown
## 3. Writing Plans — 합의를 검증 가능한 구현 순서로 바꾼다
```

At first mention, state that this is the user's `write-plan` stage and the actual skill is `superpowers:writing-plans`.

Explain that the plan decomposes the spec into tasks small enough to implement and review independently. Make TDD concrete with this ordered contract:

1. 실패하는 테스트 코드를 작성한다.
2. 테스트가 의도한 이유로 실패하는지 확인한다.
3. 테스트를 통과시키는 최소 실제 코드를 작성한다.
4. 관련 테스트를 실행해 통과를 확인한다.
5. 필요할 때만 리팩터링하고 다시 검증한다.

State that writing-plans does not itself create the test or production code; it creates the execution contract that the implementation stage follows. Common junior mistake: confusing a detailed plan with completed implementation.

- [ ] **Step 4: Write the spec-explainer chapter**

Use this heading:

```markdown
## 4. Spec Explainer — 구현 전에 사람이 이해하고 검토한다
```

Explain these source rules exactly:

- Input: the completed spec/plan pair.
- Output: `explains/<stem>-explained.md`.
- Source of truth: spec and plan; the explained document is not authoritative.
- Primary value: explain why the design exists, why alternatives were rejected, and why plan tasks have that dependency order.
- Timing: before implementation, so a person can find misunderstandings before code generation.
- Common junior mistake: reading only the easier explanation and treating it as a replacement for the original spec and plan.

- [ ] **Step 5: Write the subagent-driven-development chapter**

Use this heading:

```markdown
## 5. Subagent-Driven Development — 테스트 코드와 실제 코드를 만든다
```

Make this chapter the explicit transition between pre-implementation documents and the implemented system. State unambiguously:

- This stage creates test code and production source code.
- Each plan task is implemented as a small unit.
- The failing test demonstrates that the desired behavior is not already passing accidentally.
- Minimal production code makes the behavior pass.
- Requirements review checks conformance to spec/plan; code-quality review checks maintainability and implementation quality.
- Passing tests are evidence for specified behavior, while production source code becomes the source of truth for how the current system actually operates.
- Common junior mistake: interpreting agent parallelism or the amount of generated code as proof of correctness.

Include this transition diagram:

```text
구현 전: spec과 plan이 만들려는 것의 기준
                  ↓
subagent-driven-development
테스트 코드 + 실제 소스코드 생성
                  ↓
구현 후: 실제 소스코드가 현재 동작의 기준
```

- [ ] **Step 6: Write the spec-flow-e2e chapter**

Use this heading:

```markdown
## 6. Spec Flow E2E — 실제 코드에서 시스템 흐름을 복원한다
```

Explain these rules:

- It produces `e2e/<stem>-e2e.md`; it does not produce Playwright/Cypress E2E test code.
- The plan is a map to relevant files, not the authority for actual behavior.
- Production source code is the authority.
- The flow document reconstructs `front → back → db → back → front`, including entry points, gates, failure behavior, transaction/persistence order, and troubleshooting entry points.
- Differences between spec/plan/explained and code are a primary finding to report, not something to hide.
- The readers are the human who wants an overview and the human or AI entering a debugging session.
- Common junior mistake: copying planned class names and code snippets without opening the implemented source files.

- [ ] **Step 7: Write the spec-wiki chapter**

Use this heading:

```markdown
## 7. Spec Wiki — 끝난 작업을 다음 작업의 지식으로 바꾼다
```

Explain these rules:

- It combines spec, plan, explained, and e2e documents sharing one stem.
- It creates `wiki/<stem>-wiki.md`, `wiki/index.md`, `wiki/index.json`, and `dashboard.html`.
- It does not move or modify the source documents.
- The wiki is not authoritative; the four source document types retain their own source relationships.
- `지금 어떻게 도나` can only be written from an e2e document. If e2e is missing, that absence must remain visible.
- Hash-based incremental regeneration keeps the knowledge base current without rewriting unchanged pages.
- The output becomes searchable context for future humans and AI sessions, returning the workflow to brainstorming.
- Common junior mistake: treating the wiki summary as proof that implementation and documentation are current without checking its underlying sources and freshness.

- [ ] **Step 8: Write the synthesis chapter**

Use this heading:

```markdown
## 8. 방법론은 독립된 구호가 아니라 흐름 안의 규율이다
```

Include this table with expanded prose in each cell:

| 방법론 | 작동하는 주요 단계 | 강제하는 판단 | 남는 증거 |
| --- | --- | --- | --- |
| SDD | brainstorming, writing-plans | 무엇을 만들며 성공을 어떻게 확인하는가 | spec, plan |
| DDD | brainstorming부터 전체 흐름 | 같은 용어를 같은 뜻으로 쓰는가 | 합의된 용어가 반영된 모든 산출물 |
| TDD | writing-plans, subagent-driven-development | 원하는 행동을 실패 테스트부터 증명하는가 | 테스트 코드, 실행 결과, 최소 실제 코드 |

Then explain why Deep Module is no longer a central fourth pillar. Do not dismiss it as wrong. Preserve only the useful question, “호출자가 알아야 할 복잡성을 줄였는가?”, as a code-review and flow-comprehension question after implementation. Reject the assumption that a human must completely declare all interfaces before AI can generate code.

End with the article's final thesis: the human owns purpose, meaning, approval, and judgment; the Harness ensures that AI-generated implementation remains connected to agreed intent, executable verification, actual runtime structure, and reusable project knowledge.

- [ ] **Step 9: Run the first structural check**

Run:

```powershell
rg -n '^## ' 'draft/harness02-개발방법론-rev.md'
rg -n 'brainstorming|writing-plans|spec-explainer|subagent-driven-development|spec-flow-e2e|spec-wiki' 'draft/harness02-개발방법론-rev.md'
```

Expected: exactly eight level-two chapters appear in numeric order; all six workflow names appear in explanatory prose, not only in the workflow diagram.

- [ ] **Step 10: Commit the complete draft**

```powershell
git add -- 'draft/harness02-개발방법론-rev.md'
git commit -m "docs: rewrite harness development methodology" -- 'draft/harness02-개발방법론-rev.md'
```

### Task 2: Audit source-of-truth rules and junior readability

**Files:**
- Modify if needed: `draft/harness02-개발방법론-rev.md`
- Verify: `docs/superpowers/specs/2026-08-02-harness02-methodology-revision-design.md`
- Verify: `C:/develop/pyan/team-plugins/packages/spec-tools/README.md`
- Verify: `C:/develop/pyan/team-plugins/packages/spec-tools/skills/spec-explainer/SKILL.md`
- Verify: `C:/develop/pyan/team-plugins/packages/spec-tools/skills/spec-flow-e2e/SKILL.md`
- Verify: `C:/develop/pyan/team-plugins/packages/spec-tools/skills/spec-wiki/SKILL.md`

**Interfaces:**
- Consumes: the complete article from Task 1 and the source documentation listed above
- Produces: a source-aligned article with mechanically verified structure and no stale Deep Module framing

- [ ] **Step 1: Verify the artifact and source-of-truth statements**

Read every paragraph containing `정본`, `산출물`, `테스트 코드`, `실제 소스코드`, or `원문`. Check each claim against the approved design and the three spec-tools skills.

The audit must confirm:

```text
spec-explainer: spec/plan → explained, with spec/plan authoritative
subagent-driven-development: plan execution → test code + production source code
spec-flow-e2e: production source code → e2e flow document, with source code authoritative
spec-wiki: four source document types → wiki/index/dashboard, with source documents preserved
```

Correct any sentence that collapses these distinct relationships into one universal source of truth.

- [ ] **Step 2: Verify junior readability**

For each of chapters 2 through 7, confirm it answers all six repeated questions:

```text
왜 필요한가?
AI에게 무엇을 질문하거나 강제하는가?
사람은 무엇을 확인하는가?
입력과 산출물은 무엇인가?
다음 단계에 무엇을 넘기는가?
주니어가 흔히 오해하는 것은 무엇인가?
```

Where a chapter lacks one answer, add a short paragraph or bullet under the existing chapter; do not add more level-two chapters.

- [ ] **Step 3: Scan for forbidden or stale framing**

Run:

```powershell
rg -n '사람은.*인터페이스.*먼저|AI.*내부 구현만|Deep Module.*핵심|Playwright|Cypress|정본이 아니다|테스트 코드와 실제' 'draft/harness02-개발방법론-rev.md'
```

Expected:

- No sentence asserts that the human must fully design every interface and delegate only internals.
- Deep Module appears only in the synthesis that explains its reduced role.
- Playwright/Cypress appears only to distinguish test automation from the e2e flow document.
- The article explicitly states that explained and wiki documents are not authoritative.
- The article explicitly states that subagent-driven-development creates test code and production source code.

- [ ] **Step 4: Validate headings, workflow order, and Markdown whitespace**

Run:

```powershell
$path = 'draft/harness02-개발방법론-rev.md'
$required = @(
  '## 2. Brainstorming',
  '## 3. Writing Plans',
  '## 4. Spec Explainer',
  '## 5. Subagent-Driven Development',
  '## 6. Spec Flow E2E',
  '## 7. Spec Wiki'
)
$text = Get-Content -Raw -Encoding utf8 $path
$positions = $required | ForEach-Object { $text.IndexOf($_) }
if ($positions -contains -1) { throw '필수 단계 heading 누락' }
for ($i = 1; $i -lt $positions.Count; $i++) {
  if ($positions[$i] -le $positions[$i - 1]) { throw 'workflow heading 순서 오류' }
}
'workflow heading order OK'
git diff --check -- 'draft/harness02-개발방법론-rev.md'
```

Expected: `workflow heading order OK` and no whitespace errors.

- [ ] **Step 5: Review the final diff without disturbing other work**

Run:

```powershell
git diff HEAD~1 -- 'draft/harness02-개발방법론-rev.md'
git status --short
```

Expected: the article is a new standalone revision; the original `draft/harness02-개발방법론.md` remains unchanged. Existing unrelated changes in the worktree remain untouched.

- [ ] **Step 6: Commit audit corrections only if the article changed**

If Task 2 changed the article, run:

```powershell
git add -- 'draft/harness02-개발방법론-rev.md'
git commit -m "docs: align harness methodology with artifact flow" -- 'draft/harness02-개발방법론-rev.md'
```

If Task 2 produced no diff, report that the source audit passed without a corrective commit.
