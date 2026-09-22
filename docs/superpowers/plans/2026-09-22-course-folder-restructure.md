# 강의별 폴더 재구성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 저장소를 "강의 하나"에서 "강의 자료 모음"으로 재구성한다 — 끝난 AI Harness 강의를 `courses/ai-harness/`로 동결하고, 새 강의를 위한 `courses/ai-for-work/`를 열며, `CLAUDE.md`를 공통 규칙과 강의별 규칙으로 나눈다.

**Architecture:** 세 단계다. (1) `git mv`로 파일만 옮긴다 — 내용은 손대지 않는다. (2) `CLAUDE.md`를 세 파일로 가른다. (3) AGENTS.md 동기화 훅과 검증 스니펫을 새 경로와 macOS에 맞게 고친다. 각 단계는 독립적으로 되돌릴 수 있고 각자 커밋한다.

**Tech Stack:** git, zsh (macOS). 빌드·테스트 러너 없음 — 검증은 셸 명령 출력과 육안 확인이다.

**Spec:** [docs/superpowers/specs/2026-09-22-course-folder-restructure-design.md](../specs/2026-09-22-course-folder-restructure-design.md)

## Global Constraints

- **원고 본문을 수정하지 않는다.** `courses/ai-harness/*.md`의 내용은 한 글자도 바꾸지 않는다. 이동만 한다.
- **`docs/superpowers/`의 기존 spec·plan 9건을 수정하지 않는다.** 옛 `harness/` 경로가 나와도 그대로 둔다. 과거 기록이다.
- **`✍️ [채우기]` 블록을 보존한다.** 저자 본인의 경험이 들어갈 자리이므로 지우거나 채우지 않는다.
- **파일 이동은 반드시 `git mv`를 쓴다.** `mv` + `git add`는 히스토리 추적을 잃을 수 있다.
- **한글 경로는 반드시 따옴표로 감싼다.**
- 커밋 메시지는 영문 Conventional Commits (`docs: ...`, `chore: ...`).
- 커밋 메시지 끝에 `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` 를 넣는다.

---

### Task 1: 파일을 강의별 폴더로 옮긴다

내용은 전혀 건드리지 않고 위치만 바꾼다. 이 태스크가 끝나면 링크가 여전히 전부 살아 있어야 한다.

**Files:**
- Move: `harness/` → `courses/ai-harness/`
- Move: `AI-Harness-5h-Lecture-final.pptx` → `courses/ai-harness/deck/AI-Harness-5h-Lecture-final.pptx`
- Move: `output/pdf/AI-Harness-5h-Syllabus.pdf` → `courses/ai-harness/output/AI-Harness-5h-Syllabus.pdf`
- Move: `simple-ai-literacy/AI Literacy1.pptx` → `courses/ai-harness/reference/AI Literacy1.pptx`
- Create: `courses/ai-for-work/images/.gitkeep`

**Interfaces:**
- Produces: `courses/ai-harness/` (원고 3편 + `images/` + `deck/` + `output/` + `reference/`), `courses/ai-for-work/` — Task 2와 Task 3이 이 경로를 참조한다.

- [ ] **Step 1: 이동 전 상태를 기록한다**

```bash
cd /Users/jongminlee/develop/AI-Harness
git status --porcelain
git ls-files | wc -l
```

기대: `git status`가 비어 있고(clean), 추적 파일 수가 출력된다. 이 숫자를 기억해 둔다 — Step 5에서 같아야 한다. clean이 아니면 멈추고 사용자에게 알린다.

- [ ] **Step 2: 원고 폴더를 통째로 옮긴다**

```bash
mkdir -p courses
git mv harness courses/ai-harness
```

기대: 출력 없음. 오류가 나면 멈춘다.

- [ ] **Step 3: 나머지 산출물과 참고자료를 옮긴다**

```bash
mkdir -p courses/ai-harness/deck courses/ai-harness/output courses/ai-harness/reference
git mv AI-Harness-5h-Lecture-final.pptx courses/ai-harness/deck/
git mv output/pdf/AI-Harness-5h-Syllabus.pdf courses/ai-harness/output/
git mv 'simple-ai-literacy/AI Literacy1.pptx' 'courses/ai-harness/reference/AI Literacy1.pptx'
rmdir output/pdf output simple-ai-literacy 2>/dev/null || true
```

기대: 출력 없음. `rmdir`은 빈 폴더만 지우므로 남은 파일이 있으면 조용히 실패한다 — 그건 정상이다.

- [ ] **Step 4: 새 강의 폴더를 만든다**

```bash
mkdir -p courses/ai-for-work/images
touch courses/ai-for-work/images/.gitkeep
git add courses/ai-for-work/images/.gitkeep
```

기대: 출력 없음.

- [ ] **Step 5: 이동이 이름 변경으로 잡혔는지 확인한다**

```bash
git status --porcelain
git ls-files | wc -l
```

기대: 모든 줄이 `R ` (rename)으로 시작하고, `.gitkeep` 한 줄만 `A `다. `D `(삭제)와 `A `(추가)가 **쌍으로** 나오면 히스토리 추적이 끊긴 것이므로 멈추고 사용자에게 알린다. 파일 수는 Step 1보다 정확히 1개 많아야 한다.

- [ ] **Step 6: 링크가 살아 있는지 확인한다**

```bash
for f in courses/*/*.md; do
  d=$(dirname "$f")
  grep -oE '\]\([^)]+\)' "$f" | sed 's/^](//; s/)$//' | grep -v '^https\?:' | sed 's/#.*$//' |
  while read -r l; do
    [ -n "$l" ] && [ ! -e "$d/$l" ] && echo "BROKEN: $f -> $l"
  done
done
echo "--- 링크 검사 끝 ---"
```

기대: `BROKEN:` 줄이 **하나도 없고** `--- 링크 검사 끝 ---`만 출력된다. 원고의 상대 링크는 전부 형제 파일과 `images/`뿐이므로 폴더를 통째로 옮기면 깨질 것이 없다. 하나라도 나오면 멈춘다.

- [ ] **Step 7: 공백·개행 오류를 확인한다**

```bash
git diff --cached --check -- 'courses/'
```

기대: 출력 없음.

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -F - <<'MSG'
chore: move course materials under courses/

Move the finished AI Harness course into courses/ai-harness/ (manuscript,
images, deck, syllabus PDF, reference deck) and open an empty
courses/ai-for-work/ for the office-worker course. Contents are untouched;
all relative links still resolve because the manuscript folder moved whole.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
git log --oneline -1
```

기대: 커밋 해시와 메시지 첫 줄이 출력된다.

---

### Task 2: CLAUDE.md를 세 개로 나눈다

가르는 기준은 **"두 강의 모두에 참인가"** 다. 참이면 루트, 아니면 강의 폴더.

**Files:**
- Modify: `CLAUDE.md` (전체 재작성)
- Create: `courses/ai-harness/CLAUDE.md`
- Create: `courses/ai-for-work/CLAUDE.md`

**Interfaces:**
- Consumes: Task 1이 만든 `courses/ai-harness/`, `courses/ai-for-work/`
- Produces: 세 개의 `CLAUDE.md` — Task 3의 훅이 이 셋을 모두 동기화 대상으로 삼는다.

- [ ] **Step 1: 루트 CLAUDE.md를 공통 규칙만 남기고 재작성한다**

검증 스니펫은 Task 3에서 고치므로 여기서는 **기존 PowerShell 판을 경로만 `harness/` → `courses/`로 바꿔 그대로 둔다.** 한 태스크에서 한 가지만 바꾼다.

```bash
cat > CLAUDE.md <<'EOF'
# CLAUDE.md

This file provides guidance to Claude Code/Codex when working with code in this repository.

> `AGENTS.md`는 이 파일이 저장될 때 훅이 자동 복사한 사본이다. 직접 고치지 말고 `CLAUDE.md`를 고친다.

## 이 저장소는 무엇인가

**강의 자료 저장소**다. 코드가 아니라 한국어 원고를 담으므로 빌드·테스트가 없다.

강의 하나가 `courses/<강의>/` 폴더 하나를 쓴다. 그 강의의 **청중·목표·가드레일·뼈대는 그 폴더의 `CLAUDE.md`에 있다.** 이 파일에는 모든 강의에 공통인 것만 둔다. 어떤 강의의 일을 하든 먼저 그 폴더의 `CLAUDE.md`를 읽는다.

## 폴더

| 경로 | 내용 |
| --- | --- |
| [courses/ai-harness/](courses/ai-harness/) | 주니어 개발자 대상 AI Harness 강의. **끝난 강의로 동결** |
| [courses/ai-for-work/](courses/ai-for-work/) | 사무직·소상공인 대상 강의. 준비 중 |
| [docs/superpowers/](docs/superpowers/) | 전 강의의 spec/plan (작업 기록, 강의 자료 아님) |

`docs/superpowers/`는 강의별로 나누지 않고 날짜순으로 쌓는다. 과거 문서에 나오는 옛 경로는 그때의 기록이므로 고치지 않는다.

## 글쓰기 원칙

강의가 달라도 이건 안 바뀐다.

- 원고는 전부 **저자 1인칭**이다. 교과서가 아니라 "나는 이렇게 한다"의 기록이라는 톤을 유지한다.
- 설명형 `~다`체. 짧고 단정적인 문장.
- 처음 나오는 용어는 그 자리에서 쉬운 말로 정의한다.
- 사실과 해석을 구분해서 쓴다. 남의 말을 인용할 때는 **"여기서부터는 내 해석이다"**를 명시한다.
- AI를 의인화하지 않고, "AI는 항상 비결정적이다" 같은 과한 단정을 피한다.
- 저자가 안 써본 것을 써본 것처럼 쓰지 않는다.
- 각 편은 서두 인용 블록에서 앞뒤 편을 상대 경로로 링크한다.

원고 구조나 논지를 바꾸는 큰 변경은 먼저 물어본다. 문장 다듬기·오타·용어 통일은 그냥 하면 된다.

### ✍️ [채우기] 마커

`> ✍️ **[채우기]**` 블록은 **저자 본인의 실제 경험이 들어갈 자리**다. 절대 지어내서 채우지 말고, 문서를 재구성할 때 그대로 보존한다.

## 검증

테스트 러너가 없으므로 원고는 눈으로 읽어 확인하는 것이 기본이다. 기계적으로 확인할 수 있는 건 이 정도다 (PowerShell 7, 한글 파일명은 따옴표로 감싼다).

```powershell
# 공백·개행 오류
git diff --check -- 'courses/'

# 깨진 상대 링크·이미지 경로만 출력
Get-ChildItem -Path 'courses' -Filter '*.md' -Recurse | ForEach-Object {
  $dir = $_.DirectoryName
  Select-String -Path $_.FullName -Pattern '\]\(([^)]+)\)' -AllMatches |
    ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -notmatch '^https?:' } |
    Where-Object { -not (Test-Path (Join-Path $dir ($_ -replace '#.*$',''))) } |
    ForEach-Object { "BROKEN: $($_)" }
}
```

`rg`는 PowerShell PATH에 없다. 검색은 Grep 도구나 `Select-String`을 쓴다.

## 커밋

영문 Conventional Commits (`docs: ...`). 한글 경로는 pathspec에서 따옴표로 감싼다.
EOF
echo "--- 줄 수 ---"; wc -l CLAUDE.md
```

기대: 줄 수가 출력된다.

- [ ] **Step 2: AI Harness 강의의 CLAUDE.md를 만든다**

루트에서 내려온 내용(가드레일, 흔들리면 안 되는 뼈대, 편 구성)이 여기로 온다. 문장은 원문을 그대로 옮긴다.

```bash
cat > courses/ai-harness/CLAUDE.md <<'EOF'
# CLAUDE.md — AI Harness 강의

> 저장소 공통 규칙(글쓰기 원칙, `✍️ [채우기]` 마커, 검증, 커밋)은 루트 [CLAUDE.md](../../CLAUDE.md)에 있다. 이 파일은 이 강의에만 적용된다.
>
> `AGENTS.md`는 이 파일이 저장될 때 훅이 자동 복사한 사본이다. 직접 고치지 말고 이 파일을 고친다.

## 이 강의는 무엇인가

**주니어 개발자 대상 하루짜리 강의**다.

강의 목표는 **AI Harness가 왜 필요하고 무엇인지 개념을 잡은 뒤, 실제 개발에서 그것을 어떻게 쓰는지까지 보여주는 것**이다. 저자의 실무 경험을 전달하는 것이 목적이다.

**이 강의는 끝났다. 원고는 동결 상태다.** 오타·깨진 링크 수정 외의 변경은 먼저 물어본다.

## 파일

| 경로 | 내용 |
| --- | --- |
| `NN-<주제>.md` | 원고 본문 연작 |
| [images/](images/) | 본문 삽화 |
| [deck/](deck/) | 강의 발표용 PPT |
| [output/](output/) | 시러버스 PDF |
| [reference/](reference/) | 참고용 기존 PPT. 아이디어만 재해석하고 복제하지 않는다 |

현재 구성과 각 편이 답하는 질문은 [1편](01-하네스란무엇인가.md)의 "이 시리즈의 나머지" 표가 정본이다. 편을 추가하거나 순서를 바꾸면 그 표와 각 편 서두의 앞뒤 링크를 함께 고친다. 여기에는 편 목록을 복제하지 않는다 — 금방 낡는다.

큰 흐름은 **왜(개념) → 무엇을(원칙) → 어떻게(흐름) → 어떤 파일로(실습)** 순이고, 앞쪽이 개념의 뼈대, 뒤쪽이 실제 저장소 시연으로 이어진다.

## 가드레일

**범위 안**

- 주니어가 이해할 수 있는 수준의 개념 설명과 비유
- 저자가 실제로 쓰는 방식과 도구
- 실습에서 직접 보여줄 수 있는 것

**범위 밖 — 확장하지 말 것**

- 이 저장소가 다루지 않는 새로운 방법론·프레임워크·도구를 끌어오는 일
- 강의 하루에 못 담는 깊이 (모델 내부 구조, 논문 수준 논의)
- 특정 기능의 긴 코드 예시. 짧은 예시 한두 문장이면 충분하다

## 흔들리면 안 되는 뼈대

원고 전체가 이 위에 서 있다. 새 문장이 이걸 흐리면 안 된다.

- **harness = AI가 일하는 환경.** 다섯 축: 권한 · 도구 · 검증 · 상태 · 관측 (1편 정본)
- **핵심은 검증이고, 검증 결과가 AI에게 자동으로 되먹임되어야 루프가 된다.** 생성 → 검증 → 수정 → 재검증
- **판단과 책임은 사람 몫.** AI를 루프에서 사람을 빼는 도구로 그리지 않는다
- **정본은 하나가 아니다.** 구현 전 "무엇을 만들기로 했나"는 spec·plan, 구현 후 "지금 뭐가 도나"는 실제 소스코드
- **단계는 건너뛸 수 있다.** 모든 작업에 여섯 단계를 다 돌리는 건 harness가 아니라 의식(儀式)

용어의 정본은 1편 "부록: 용어 정리" 표다. 새 용어를 쓰면 거기에 추가한다.
EOF
echo "--- 줄 수 ---"; wc -l courses/ai-harness/CLAUDE.md
```

기대: 줄 수가 출력된다.

- [ ] **Step 3: 새 강의의 CLAUDE.md 뼈대를 만든다**

내용 설계는 별도 브레인스토밍에서 한다. 여기서는 **아직 정해지지 않았다는 사실 자체를 명시**해서, 나중에 이 폴더에서 일하는 에이전트가 harness 강의의 지침을 끌어다 쓰지 않게 한다.

```bash
cat > courses/ai-for-work/CLAUDE.md <<'EOF'
# CLAUDE.md — 일에 쓰는 AI 강의 (준비 중)

> 저장소 공통 규칙(글쓰기 원칙, `✍️ [채우기]` 마커, 검증, 커밋)은 루트 [CLAUDE.md](../../CLAUDE.md)에 있다. 이 파일은 이 강의에만 적용된다.
>
> `AGENTS.md`는 이 파일이 저장될 때 훅이 자동 복사한 사본이다. 직접 고치지 말고 이 파일을 고친다.

## 이 강의는 무엇인가

**사무직 종사자와 소상공인 대상 강의**다. 개발자가 아닌 사람이 codex / GPT 기반 업무 도구 / co-work 류의 AI 도구를 실제 업무에 쓰는 법을 다룬다.

## 아직 정해지지 않은 것

강의 시간, 구성, 편별 주제, 실습 소재는 **아직 설계하지 않았다.** 별도 브레인스토밍에서 정하고 그 결과를 이 파일에 옮긴다.

**정해지기 전까지 지켜야 할 것:**

- 이 강의의 구성이나 뼈대를 여기서 임의로 정하지 않는다. 물어본다.
- [../ai-harness/](../ai-harness/) 강의의 가드레일과 뼈대를 이 강의에 끌어다 쓰지 않는다. 청중이 다르다. "다섯 축", "spec → plan → 구현" 같은 개념은 그 강의의 것이다.
- 청중이 개발자가 아니다. 코드·터미널·git을 전제하는 설명은 쓰지 않는다.
EOF
echo "--- 줄 수 ---"; wc -l courses/ai-for-work/CLAUDE.md
```

기대: 줄 수가 출력된다.

- [ ] **Step 4: 세 파일을 읽어 중복과 누락을 확인한다**

```bash
for f in CLAUDE.md courses/ai-harness/CLAUDE.md courses/ai-for-work/CLAUDE.md; do
  echo "===== $f ====="; cat "$f"; echo
done
```

육안으로 확인할 것:
1. 옛 `CLAUDE.md`에 있던 문단이 **셋 중 정확히 한 곳에** 있는가 — 두 곳에 중복되거나 어디에도 없는 문단이 없어야 한다. 특히 `✍️ [채우기]`, 커밋 규칙, "흔들리면 안 되는 뼈대" 다섯 항목, 가드레일 범위 안/밖.
2. 강의 폴더 파일에서 루트로 가는 링크(`../../CLAUDE.md`)가 맞는가.
3. `harness/` 로 시작하는 옛 경로가 남아 있지 않은가.

- [ ] **Step 5: 링크를 기계적으로 확인한다**

```bash
for f in CLAUDE.md courses/ai-harness/CLAUDE.md courses/ai-for-work/CLAUDE.md; do
  d=$(dirname "$f")
  grep -oE '\]\([^)]+\)' "$f" | sed 's/^](//; s/)$//' | grep -v '^https\?:' | sed 's/#.*$//' |
  while read -r l; do
    [ -n "$l" ] && [ ! -e "$d/$l" ] && echo "BROKEN: $f -> $l"
  done
done
echo "--- 링크 검사 끝 ---"
```

기대: `BROKEN:` 줄 없음.

- [ ] **Step 6: 커밋**

`AGENTS.md`는 아직 훅이 안 돌아 옛 내용이다. Task 3에서 고치므로 여기서는 커밋하지 않는다.

```bash
git add CLAUDE.md courses/ai-harness/CLAUDE.md courses/ai-for-work/CLAUDE.md
git diff --cached --check
git commit -F - <<'MSG'
docs: split CLAUDE.md into shared and per-course guardrails

The root file now holds only what is true for every course: repo layout,
writing principles, the fill-in marker rule, verification and commit rules.
Course-specific audience, guardrails and load-bearing concepts move into
courses/<name>/CLAUDE.md so the two courses cannot contaminate each other.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
git log --oneline -1
```

기대: `git diff --cached --check`는 출력이 없고, 커밋 해시가 출력된다.

---

### Task 3: 훅과 검증 스니펫을 양 플랫폼에서 돌게 고친다

`.claude/settings.json`의 AGENTS.md 동기화 훅은 `"shell": "powershell"`이라 macOS에서 실행되지 않는다. 동기화할 `CLAUDE.md`가 셋으로 늘었으므로 지금 고친다.

**Files:**
- Modify: `.claude/settings.json`
- Modify: `CLAUDE.md` (검증 절에 zsh 판 추가)
- Create: `AGENTS.md`, `courses/ai-harness/AGENTS.md`, `courses/ai-for-work/AGENTS.md` (훅이 생성)

**Interfaces:**
- Consumes: Task 2가 만든 세 개의 `CLAUDE.md`

- [ ] **Step 1: 훅을 양 플랫폼 2항목으로 바꾼다**

stdin JSON을 파싱하는 대신 저장소 안의 모든 `CLAUDE.md`를 옆에 `AGENTS.md`로 복사한다. 파일이 셋뿐이라 비용이 없고 깨질 구석이 준다. 두 항목 모두 등록하면 맞는 셸 쪽만 성공하고 나머지는 조용히 실패한다 — 의도한 동작이다.

```bash
cat > .claude/settings.json <<'EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "shell": "powershell",
            "command": "try { Get-ChildItem -Path . -Filter CLAUDE.md -Recurse -File | ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $_.DirectoryName 'AGENTS.md') -Force } } catch {}",
            "statusMessage": "AGENTS.md 동기화 (Windows)",
            "timeout": 15
          },
          {
            "type": "command",
            "command": "find . -name CLAUDE.md -not -path './.git/*' -exec sh -c 'cp \"$1\" \"$(dirname \"$1\")/AGENTS.md\"' _ {} \; 2>/dev/null || true",
            "statusMessage": "AGENTS.md 동기화 (POSIX)",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
EOF
python3 -c "import json;json.load(open('.claude/settings.json'));print('JSON OK')"
```

기대: `JSON OK`. 오류가 나면 따옴표 이스케이프를 다시 본다.

- [ ] **Step 2: POSIX 훅 명령을 직접 돌려 본다**

훅은 Claude Code가 실행하므로, 명령 자체가 맞는지 손으로 먼저 확인한다.

```bash
rm -f AGENTS.md
find . -name CLAUDE.md -not -path './.git/*' -exec sh -c 'cp "$1" "$(dirname "$1")/AGENTS.md"' _ {} \;
ls -la AGENTS.md courses/ai-harness/AGENTS.md courses/ai-for-work/AGENTS.md
diff CLAUDE.md AGENTS.md && echo "루트 동기화 OK"
diff courses/ai-harness/CLAUDE.md courses/ai-harness/AGENTS.md && echo "ai-harness 동기화 OK"
diff courses/ai-for-work/CLAUDE.md courses/ai-for-work/AGENTS.md && echo "ai-for-work 동기화 OK"
```

기대: 세 파일이 존재하고 `... 동기화 OK`가 세 줄 출력된다. `diff`가 차이를 출력하면 멈춘다.

- [ ] **Step 3: 루트 CLAUDE.md의 검증 절에 zsh 판을 추가한다**

PowerShell 판은 그대로 두고 아래에 붙인다. 작업 환경이 macOS와 Windows 양쪽이므로 둘 다 싣는다.

`CLAUDE.md`에서 아래 줄을 찾는다:

```
`rg`는 PowerShell PATH에 없다. 검색은 Grep 도구나 `Select-String`을 쓴다.
```

그 **바로 위에** 다음을 삽입한다:

````
zsh/bash (macOS)에서는 이렇게 한다.

```bash
# 공백·개행 오류
git diff --check -- 'courses/'

# 깨진 상대 링크·이미지 경로만 출력
for f in courses/**/*.md; do
  d=$(dirname "$f")
  grep -oE '\]\([^)]+\)' "$f" | sed 's/^](//; s/)$//' | grep -v '^https\?:' | sed 's/#.*$//' |
  while read -r l; do
    [ -n "$l" ] && [ ! -e "$d/$l" ] && echo "BROKEN: $f -> $l"
  done
done
```
````

- [ ] **Step 4: zsh 검증 스니펫이 실제로 도는지 확인한다**

문서에 실어 놓고 안 돌면 의미가 없다. 방금 문서에 넣은 명령을 그대로 실행한다.

```bash
git diff --check -- 'courses/'
for f in courses/**/*.md; do
  d=$(dirname "$f")
  grep -oE '\]\([^)]+\)' "$f" | sed 's/^](//; s/)$//' | grep -v '^https\?:' | sed 's/#.*$//' |
  while read -r l; do
    [ -n "$l" ] && [ ! -e "$d/$l" ] && echo "BROKEN: $f -> $l"
  done
done
echo "--- 검증 끝 ---"
```

기대: `BROKEN:` 줄 없이 `--- 검증 끝 ---`만 출력된다. `courses/**/*.md`가 하위 폴더까지 못 잡으면(bash 4 미만) 파일이 하나도 처리되지 않으므로, 의심되면 `find courses -name '*.md'`로 바꿔 문서와 함께 고친다.

- [ ] **Step 5: 루트 AGENTS.md를 다시 동기화한다**

Step 3에서 `CLAUDE.md`를 고쳤으므로 사본이 낡았다.

```bash
find . -name CLAUDE.md -not -path './.git/*' -exec sh -c 'cp "$1" "$(dirname "$1")/AGENTS.md"' _ {} \;
diff CLAUDE.md AGENTS.md && echo "동기화 OK"
```

기대: `동기화 OK`.

- [ ] **Step 6: 커밋**

```bash
git add .claude/settings.json CLAUDE.md AGENTS.md courses/ai-harness/AGENTS.md courses/ai-for-work/AGENTS.md
git commit -F - <<'MSG'
chore: make the AGENTS.md sync hook and verification run on both platforms

The hook was PowerShell-only and silently did nothing on macOS. Register a
POSIX entry alongside it and drop the stdin JSON parsing: both entries now
copy every CLAUDE.md in the repo to AGENTS.md next to it, which also covers
the two new per-course files. The verification snippet gains a zsh variant.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
git log --oneline -4
git status --porcelain
```

기대: 커밋 4개가 보이고 `git status`가 비어 있다(clean).

---

### Task 4: 최종 확인

세 태스크가 각자 통과해도 전체가 맞는지는 따로 본다.

**Files:** 없음 (읽기만)

- [ ] **Step 1: 최종 구조를 본다**

```bash
find . -not -path './.git/*' -not -path './.obsidian/*' -not -name '.DS_Store' -not -name '.git' | sort
```

기대: spec의 "최종 구조" 트리와 일치한다. 루트에 `courses/`, `docs/`, `.claude/`, `CLAUDE.md`, `AGENTS.md`, `.gitignore` 외의 것이 없어야 한다. `output/`, `simple-ai-literacy/`, `harness/`가 남아 있으면 안 된다.

- [ ] **Step 2: 원고가 변하지 않았는지 확인한다**

이것이 이 계획에서 가장 중요한 확인이다. 이동만 했으므로 내용 차이가 0이어야 한다.

```bash
git diff 22246a9 HEAD --stat -- 'courses/ai-harness/*.md'
git diff 22246a9 HEAD -M --numstat | grep -E '하네스|개발방법론|개발흐름' || echo "(원고 내용 변경 없음)"
```

기대: 이름 변경만 잡히고 추가/삭제 줄 수가 `0	0`이다. 0이 아니면 원고가 수정된 것이므로 사용자에게 알린다.

- [ ] **Step 3: `✍️ [채우기]` 블록이 보존되었는지 확인한다**

```bash
git show 22246a9 --stat > /dev/null
echo "이동 전:"; git grep -c '✍️' 22246a9 -- 'harness/' || echo "0"
echo "이동 후:"; git grep -c '✍️' HEAD -- 'courses/ai-harness/' || echo "0"
```

기대: 두 숫자가 같다.

- [ ] **Step 4: 사용자에게 보고한다**

다음을 전한다:
- 옮긴 것과 새로 만든 것
- 커밋 4개의 해시와 제목
- 확인한 것: 링크 0개 깨짐, 원고 내용 변경 0줄, 훅이 세 폴더 모두 동기화
- **다음 단계:** `courses/ai-for-work/` 강의의 내용 설계는 별도 브레인스토밍이 필요하다. 지금 그 폴더에는 `CLAUDE.md` 뼈대와 빈 `images/`뿐이다.
