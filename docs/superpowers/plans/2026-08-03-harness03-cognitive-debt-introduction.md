# Harness 3편 인지 부채 도입부 개정 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 3편이 AI Harness의 필요성에서 인지 부채 문제를 거쳐, superpowers와 spec-tools를 실제 운용 흐름으로 제시하게 한다.

**Architecture:** 기존 여섯 단계와 산출물·정본 설명은 유지한다. 글의 도입에 인지 부채를 문제로 제기하고, 구현 전에는 superpowers가 합의와 이해를 만들며 구현 후에는 spec-tools가 실제 흐름과 재사용 지식을 복원한다는 두 방향의 해법을 연결한다.

**Tech Stack:** 한국어 Markdown 원고, 상대 링크.

## Global Constraints

- 설명형 `~다`체와 저자 1인칭 관점을 유지한다.
- 인지 부채를 완전히 해결한다고 과장하지 않고, 줄이고 발견·복원하는 운영 방식으로 표현한다.
- `spec-tools`가 직접 제공하지 않는 퀴즈·실행형 micro-world는 내 도구의 기능처럼 쓰지 않는다.
- 기존 `> ✍️ **[채우기]**` 블록은 보존한다.
- 원고 구조 변경이므로 이 승인된 계획의 범위 안에서만 편집한다.

---

### Task 1: 문제와 해법의 도입부 추가

**Files:**
- Modify: `draft/harness03-개발흐름.md:서두와 기존 1절 사이`
- Test: 원고 육안 검토

**Interfaces:**
- Consumes: 1편의 Harness 다섯 축과 검증 루프, 2편의 SDD·DDD·TDD·Deep Module.
- Produces: 인지 부채 → 구현 전/후의 두 방향 해법 → 여섯 단계라는 독자의 이해 경로.

- [ ] **Step 1: 기존 3편의 서두와 1절 첫 단락을 읽어 중복될 개념을 찾는다**

  확인할 중복 대상은 `합의·검증·맥락`, `문서를 많이 만드는 일이 아니다`, `순환`이다.

- [ ] **Step 2: 서두 뒤에 `0. 왜 이 흐름이 필요한가 — AI가 남기는 인지 부채`를 쓴다**

  이 절에는 다음을 포함한다.

  - 인지 부채의 정의: 개발자와 팀이 시스템을 이해하고 바꿀 능력이 줄어드는 비용
  - 기술 부채와의 구분
  - 테스트 통과와 이해 보존은 다른 문제라는 설명
  - 구현 전 `superpowers`, 구현 후 `spec-tools`라는 역할 분담
  - spec·plan과 실제 코드의 정본 관계를 간단히 예고

- [ ] **Step 3: 기존 1절의 첫 단락을 새 도입을 이어받도록 고친다**

  첫 문장을 다음 의미로 바꾼다: Harness는 인지 부채를 없애는 마법이 아니라, 합의·검증·맥락이 작업마다 남게 하는 환경이다.

- [ ] **Step 4: 원고를 처음부터 1절 끝까지 읽어 반복과 과장을 제거한다**

  확인 기준: `spec-tools`의 실제 기능은 해설·흐름 복원·지식화이며, 사람의 승인과 판단이 계속 남아야 한다.

### Task 2: 흐름 지도와 끝맺음의 연결 보강

**Files:**
- Modify: `draft/harness03-개발흐름.md:1절 흐름도 설명, 8절과 9절의 연결 문단`
- Test: 원고 육안 검토, 상대 링크 검사

**Interfaces:**
- Consumes: Task 1의 두 방향 해법.
- Produces: 각 단계가 인지 부채를 줄이는 이유와 다음 작업으로 환류되는 운영 설명.

- [ ] **Step 1: 여섯 단계 흐름도 앞뒤에 역할 분담을 한 문단으로 명시한다**

  `brainstorming`부터 `spec-explainer`까지는 구현 전 이해를 만들고, `spec-flow-e2e`와 `spec-wiki`는 구현 후 이해를 복원·공유한다고 쓴다.

- [ ] **Step 2: 8절 또는 9절 끝에 제한을 한 문장으로 명시한다**

  이 흐름은 문서가 많다는 사실을 목표로 삼지 않으며, 사람이 실제로 이해하고 판단할 기회를 남기는 것이 목적이라고 쓴다.

- [ ] **Step 3: 상대 링크와 제목·단계명이 기존 시리즈와 맞는지 확인한다**

  `harness01-하네스란무엇인가.md`, `harness02-개발방법론.md` 링크와 skill 이름 표기가 일치해야 한다.

### Task 3: 원고 검증과 변경 검토

**Files:**
- Modify: `draft/harness03-개발흐름.md`
- Test: `git diff --check -- 'draft/'`, 상대 링크 검사, 전체 원고 육안 검토

**Interfaces:**
- Consumes: 수정된 3편 원고.
- Produces: 공백·개행 오류와 깨진 상대 링크가 없는 원고 변경.

- [ ] **Step 1: 원고 전체를 읽어 문체와 책임 경계를 검토한다**

  확인 기준: 저자가 직접 쓰는 도구와 외부 자료의 문제의식을 구분하고, AI가 사람의 판단을 대체한다는 표현이 없는지 확인한다.

- [ ] **Step 2: 공백·개행 오류를 검사한다**

  Run: `git diff --check -- 'draft/'`

  Expected: 출력 없음.

- [ ] **Step 3: 모든 Markdown 상대 링크의 대상 존재를 검사한다**

  Run: `Select-String -Path 'draft/*.md' -Pattern '\]\(([^)]+)\)' -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique | Where-Object { $_ -notmatch '^https?:' } | Where-Object { -not (Test-Path (Join-Path 'draft' ($_ -replace '#.*$',''))) }`

  Expected: 출력 없음.

- [ ] **Step 4: 변경 diff를 읽고, 1편의 시리즈 표나 앞뒤 링크를 바꿀 필요가 없는지 확인한다**

  Expected: 3편의 논지 보강만으로 시리즈 순서와 제목은 유지된다.

## Self-Review

- 계획은 3편의 도입, 흐름 연결, 검증을 모두 다룬다.
- placeholder, 미결정 용어, 구현하지 않을 기능 약속이 없다.
- 수정 대상은 원고 한 편과 작업 기록 한 편이며, 기존 시리즈 순서는 바꾸지 않는다.
