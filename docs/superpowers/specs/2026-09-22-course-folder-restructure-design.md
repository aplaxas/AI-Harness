# 강의별 폴더 재구성 설계

**날짜:** 2026-09-22
**상태:** 승인됨

## 배경

이 저장소는 `AI Harness` 강의 하나를 위해 만들어졌다. 그 강의는 끝났고, 이제 **사무직 종사자와 소상공인을 대상으로 한 두 번째 강의**(codex / GPT 기반 업무 도구 / co-work 활용) 자료를 여기서 준비한다.

문제는 저장소 전체가 "강의 하나"를 전제로 짜여 있다는 점이다. 원고가 루트 바로 아래 `harness/`에 있고, `CLAUDE.md`에는 저장소 규칙과 harness 강의의 가드레일이 한 파일에 섞여 있다. 두 번째 강의를 이 상태에서 시작하면 "주니어 개발자 대상", "harness = AI가 일하는 환경, 다섯 축" 같은 지침이 새 강의에까지 적용된다. 그 지침들은 새 강의에 맞지 않을 뿐 아니라 **해롭다**.

따라서 저장소의 성격을 **"harness 강의"에서 "강의 자료 모음"으로** 바꾼다.

## 목표

- 기존 harness 강의 자료 전부(원고·이미지·PPT·PDF·참고자료)를 한 폴더 안에 모아 동결한다.
- 새 강의를 위한 빈 폴더와 그 강의만의 가드레일 파일을 만든다.
- 두 강의의 지침이 서로 오염되지 않도록 `CLAUDE.md`를 계층으로 나눈다.
- 이동으로 깨지는 링크가 없도록 한다.

## 범위 밖

- **새 강의의 내용 설계.** 청중 정의, 강의 목표, 편 구성, 커리큘럼은 이 spec에서 다루지 않는다. 별도 브레인스토밍에서 정하고, `courses/ai-for-work/CLAUDE.md`는 여기서 뼈대만 만든다.
- **기존 harness 원고의 내용 수정.** 강의가 끝났으므로 동결 대상이다. 파일을 옮기기만 하고 본문은 한 글자도 고치지 않는다.
- **`docs/superpowers/` 재배치.** 작업 기록은 루트에 날짜순으로 계속 쌓는다.

## 결정 사항

### 1. 저장소는 하나, 폴더로 나눈다

새 저장소를 파지 않는다. 이동이 `git mv` 한 번이고, 공통 이미지·도구 설정·훅을 재사용하며, spec/plan 히스토리가 끊기지 않기 때문이다. 저장소 이름(`AI-Harness`)은 그대로 둔다 — 이름이 내용과 어긋나지만, GitHub URL 변경 비용이 그 어긋남보다 크다.

### 2. 원고는 강의 폴더 바로 아래에 평평하게 둔다

`courses/ai-harness/manuscript/01-....md` 처럼 한 단계 더 넣지 않는다. 평평하게 두면 `git mv harness courses/ai-harness` 한 번으로 끝나고, 원고 안의 상대 링크(`02-개발방법론.md`, `images/*.png`)가 **한 글자도 바뀌지 않는다.** 깊이를 더해서 얻는 것이 없다.

### 3. 최종 구조

```
AI-Harness/
├── CLAUDE.md                          공통 규칙만
├── AGENTS.md                          (훅이 생성)
├── courses/
│   ├── ai-harness/                    끝난 강의. 동결.
│   │   ├── CLAUDE.md                  이 강의의 가드레일
│   │   ├── AGENTS.md
│   │   ├── 01-하네스란무엇인가.md
│   │   ├── 02-개발방법론.md
│   │   ├── 03-개발흐름.md
│   │   ├── images/                    삽화 4장
│   │   ├── deck/
│   │   │   └── AI-Harness-5h-Lecture-final.pptx
│   │   ├── output/
│   │   │   └── AI-Harness-5h-Syllabus.pdf
│   │   └── reference/
│   │       └── AI Literacy1.pptx
│   └── ai-for-work/                   새 강의. 비어 있음.
│       ├── CLAUDE.md                  뼈대만
│       ├── AGENTS.md
│       └── images/                    (.gitkeep)
└── docs/superpowers/
    ├── specs/
    └── plans/
```

옮기는 것들의 대응:

| 지금 | 다음 |
| --- | --- |
| `harness/` | `courses/ai-harness/` |
| `AI-Harness-5h-Lecture-final.pptx` (루트) | `courses/ai-harness/deck/` |
| `output/pdf/AI-Harness-5h-Syllabus.pdf` | `courses/ai-harness/output/` |
| `simple-ai-literacy/AI Literacy1.pptx` | `courses/ai-harness/reference/` |
| `docs/superpowers/` | 그대로 |

`simple-ai-literacy/`는 harness 강의를 만들 때 참고한 자료이므로 그 강의 폴더에 넣는다. 새 강의가 이것을 참고하게 되면 그때 옮기거나 복사한다.

### 4. CLAUDE.md를 세 개로 나눈다

지금 한 파일에 있는 내용을 이렇게 가른다.

| 파일 | 담는 것 |
| --- | --- |
| 루트 `CLAUDE.md` | 저장소 성격(강의 원고 모음), 폴더 지도, 글쓰기 원칙, `✍️ [채우기]` 마커 규칙, 검증 명령, 커밋 규칙, AGENTS.md 훅 안내 |
| `courses/ai-harness/CLAUDE.md` | 청중(주니어 개발자), 강의 목표, 가드레일, **흔들리면 안 되는 뼈대**, 편 구성 정본 위치, 용어 정본 위치 |
| `courses/ai-for-work/CLAUDE.md` | 청중(사무직·소상공인), 강의 성격 한 줄, 나머지는 다음 브레인스토밍에서 채운다는 명시 |

가르는 기준은 **"두 강의 모두에 참인가"** 다. 저자 1인칭 톤, `~다`체, 사실과 해석 구분, `✍️ [채우기]` 보존은 두 강의에 다 참이므로 루트에 남는다. "다섯 축", "주니어가 이해할 수 있는 수준", "정본은 하나가 아니다"는 harness 강의의 논지이므로 그 폴더로 내려간다.

Claude Code는 작업 중인 폴더의 상위 `CLAUDE.md`를 모두 읽으므로, `courses/ai-for-work/`에서 일할 때 루트 규칙 + 새 강의 규칙만 적용되고 harness 강의의 뼈대는 딸려오지 않는다.

### 5. 훅과 검증 명령을 양 플랫폼에서 돌게 고친다

`.claude/settings.json`의 AGENTS.md 동기화 훅은 `"shell": "powershell"`로 되어 있어 **현재 macOS 환경에서는 실행되지 않는다.** 재구성 후에는 동기화할 `CLAUDE.md`가 세 개로 늘어나므로 지금 고친다.

기존 PowerShell 항목은 남기고, POSIX 셸 항목을 하나 추가한다. 훅은 여러 개가 모두 실행되므로 macOS에서는 POSIX 쪽이, Windows에서는 PowerShell 쪽이 성공한다. 맞지 않는 쪽은 조용히 실패한다 — 이 실패는 지금도 이미 일어나고 있고 문제를 일으키지 않았다. 한쪽을 지우고 한 플랫폼을 포기하는 것보다 낫다고 판단한다.

두 항목 모두 stdin JSON을 파싱하는 대신 **저장소 안의 모든 `CLAUDE.md`를 옆에 `AGENTS.md`로 복사**하는 형태로 바꾼다. 파싱이 사라져 깨질 구석이 줄고, 파일이 세 개뿐이라 비용도 무시할 수 있다.

루트 `CLAUDE.md`의 검증 스니펫도 PowerShell 전용이다. PowerShell 판과 zsh/bash 판을 나란히 싣고, 경로는 `harness/`에서 `courses/`로 바꾼다.

### 6. 과거 작업 기록은 고치지 않는다

`docs/superpowers/`의 spec·plan 9건에는 `harness/01-...md` 같은 옛 경로가 나온다. 이 문서들은 **그때 무엇을 하기로 했는가의 기록**이므로 경로를 새것으로 바꾸지 않는다. 기록을 사후에 고치면 기록이 아니게 된다.

## 검증

1. `git mv` 후 `git status`에 이름 변경(R)으로만 잡히고 삭제/추가 쌍이 없을 것 — 히스토리 보존 확인
2. `courses/ai-harness/*.md`의 상대 링크와 이미지 경로가 전부 실제 파일을 가리킬 것
3. `git diff --check -- 'courses/'` 가 조용할 것
4. `CLAUDE.md`를 저장했을 때 같은 폴더에 `AGENTS.md`가 갱신될 것 (훅 동작 확인)
5. 세 `CLAUDE.md`를 읽어, 한 문단이 두 곳에 중복되거나 어디에도 없는 내용이 없을 것

## 이후

이 재구성이 끝나면 `ai-for-work` 강의의 내용 설계를 별도 브레인스토밍으로 진행한다. 청중이 개발자가 아니라는 점 때문에 harness 강의의 구성(왜 → 무엇을 → 어떻게 → 어떤 파일로)을 그대로 쓸 수 없을 가능성이 높고, 그 판단은 이 spec의 범위 밖이다.
