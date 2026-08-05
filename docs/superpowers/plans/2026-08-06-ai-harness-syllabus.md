# AI Harness 5시간 강의 실라버스 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 70장 강의 자료를 참석자용 A4 3쪽 실라버스로 재구성하고, 수정 가능한 DOCX와 배포용 PDF를 만든다.

**Architecture:** `harness/` 원고와 강의 PPT에서 핵심 용어와 순서를 확인한 뒤, 하나의 Python 빌더가 동일한 콘텐츠로 DOCX를 만든다. DOCX를 전용 렌더러로 PNG와 PDF로 변환하고 세 페이지를 각각 육안 검수한다.

**Tech Stack:** Codex bundled Python, `python-docx`, LibreOffice 기반 `render_docx.py`, Poppler/PDF 검사 도구

## Global Constraints

- 결과물은 A4 세로 3쪽이다.
- 배포용 PDF와 수정 가능한 DOCX를 함께 만든다.
- 별도 표지 없이 첫 쪽 상단에 제목과 핵심 메시지를 둔다.
- 문체는 짧고 단정한 한국어 `~다`체다.
- 스타일은 흰 배경, 짙은 남색 본문, 파란색 강조를 사용한다.
- Harness의 다섯 축은 권한, 도구, 검증, 상태, 관측이다.
- 검증 루프는 생성, 검증, 수정, 재검증 순서다.
- 판단과 책임은 사람의 몫이라는 결론을 유지한다.
- 사용자 수정 상태인 `AI-Harness-5h-Lecture-final.pptx`와 `harness/images/AndrejCarpathy.png`는 수정하거나 커밋하지 않는다.

---

### Task 1: 실라버스 콘텐츠 계약 작성

**Files:**
- Create: `.tmp/ai-harness-syllabus/content.txt`
- Read: `harness/01-하네스란무엇인가.md`
- Read: `harness/02-개발방법론.md`
- Read: `harness/03-개발흐름.md`
- Read: `AI-Harness-5h-Lecture-final.pptx`

**Interfaces:**
- Consumes: 승인된 디자인 문서와 기존 강의 자료
- Produces: 페이지별 제목, 문단, 목록, 시간표를 담은 UTF-8 콘텐츠 계약

- [ ] **Step 1: 강의 핵심 용어를 원고와 대조한다**

  `Select-String`으로 `다섯 축`, `생성`, `정본`, `여섯 단계`, `판단과 책임` 문맥을 확인한다.

- [ ] **Step 2: 3쪽 콘텐츠를 작성한다**

  1쪽에는 소개·대상·학습 목표, 2쪽에는 5시간 커리큘럼, 3쪽에는 준비·진행·기대 결과를 쓴다. 일정, 장소, 강사명은 `________________` 형식의 주최자용 빈칸으로 둔다.

- [ ] **Step 3: 콘텐츠 계약을 기계적으로 점검한다**

  `Select-String`으로 미완성 표식과 `AI는 항상`, `사람을 뺀다` 같은 과한 표현이 없음을 확인하고, 다섯 축이 정확히 한 번 이상 등장하는지 확인한다.

### Task 2: DOCX 빌더 구현

**Files:**
- Create: `.tmp/ai-harness-syllabus/build_syllabus.py`
- Create: `AI-Harness-5h-Syllabus.docx`

**Interfaces:**
- Consumes: `.tmp/ai-harness-syllabus/content.txt`
- Produces: `build_document(output_path: Path) -> None`, `AI-Harness-5h-Syllabus.docx`

- [ ] **Step 1: 문서 스타일 토큰을 정의한다**

  `compact_reference_guide`를 사용한다. A4 override는 210 x 297 mm, 여백은 위·아래 17 mm, 좌·우 18 mm로 고정한다. 본문은 맑은 고딕 10.5 pt, 1.15줄, 문단 뒤 4 pt다. 제목은 25 pt 짙은 남색 `#14202E`, H1은 16 pt 파란색 `#2D7CC8`, H2는 12.5 pt 파란색, 본문은 `#14202E`, 보조 텍스트는 `#657387`을 사용한다.

- [ ] **Step 2: 실제 Word 스타일과 목록 정의를 만든다**

  Normal, Title, Subtitle, Heading 1, Heading 2와 실제 bullet numbering을 생성한다. 글꼴은 `w:ascii`, `w:hAnsi`, `w:eastAsia` 모두 `Malgun Gothic`으로 지정한다.

- [ ] **Step 3: 첫 쪽을 만든다**

  `workshop_agenda` 패턴을 간결하게 적용한다. 제목, 한 문장 소개, 5시간·대상·형식의 3칸 지표, 핵심 질문, 추천 대상, 학습 목표를 배치한다.

- [ ] **Step 4: 둘째 쪽을 만든다**

  정확한 시간 합계가 300분이 되도록 5개 구간과 휴식·질의응답을 시간표로 구성한다. 표 너비는 본문 폭과 같게 하고 고정 DXA 열 너비, 파란색 헤더, 옅은 청회색 행 구분을 사용한다.

- [ ] **Step 5: 셋째 쪽을 만든다**

  사전 준비, 진행 방식, 강의 후 가져갈 것, 운영 정보 빈칸을 배치한다. 마지막 문장은 `검증할 수 있는 만큼만 맡길 수 있다.`로 닫는다.

- [ ] **Step 6: 문서 구조를 점검한다**

  DOCX를 다시 열어 섹션 수, A4 크기, 스타일 존재, 표 너비, 목록 정의, 페이지 나누기 2개를 검사하고 조건 불일치 시 실패하도록 한다.

### Task 3: 렌더링 및 시각 검수

**Files:**
- Create: `.tmp/ai-harness-syllabus/rendered/page-1.png`
- Create: `.tmp/ai-harness-syllabus/rendered/page-2.png`
- Create: `.tmp/ai-harness-syllabus/rendered/page-3.png`
- Create: `.tmp/ai-harness-syllabus/rendered/AI-Harness-5h-Syllabus.pdf`

**Interfaces:**
- Consumes: `AI-Harness-5h-Syllabus.docx`
- Produces: 3쪽 렌더 이미지와 검수용 PDF

- [ ] **Step 1: DOCX를 렌더링한다**

  번들 Python으로 `render_docx.py AI-Harness-5h-Syllabus.docx --output_dir .tmp/ai-harness-syllabus/rendered --emit_pdf`를 실행한다.

- [ ] **Step 2: 페이지 수를 확인한다**

  `page-*.png`가 정확히 3개이고 PDF가 비어 있지 않은지 확인한다.

- [ ] **Step 3: 세 페이지를 100% 크기로 각각 확인한다**

  잘림, 겹침, 잘못된 줄바꿈, 표 행 분리, 깨진 한글, 불균형한 여백을 확인한다. 문제가 있으면 빌더를 수정하고 세 페이지를 모두 다시 렌더링한다.

### Task 4: PDF 검증과 최종 배치

**Files:**
- Create: `output/pdf/AI-Harness-5h-Syllabus.pdf`
- Verify: `AI-Harness-5h-Syllabus.docx`

**Interfaces:**
- Consumes: 시각 검수를 통과한 DOCX와 렌더 PDF
- Produces: 최종 DOCX와 PDF

- [ ] **Step 1: PDF 구조를 확인한다**

  PDF를 다시 열어 페이지 수가 3인지, 각 페이지에서 제목과 주요 문장이 추출되는지 확인한다.

- [ ] **Step 2: 최종 PDF를 배치한다**

  검수용 PDF를 `output/pdf/AI-Harness-5h-Syllabus.pdf`로 복사하고 DOCX와 PDF의 수정 시간을 기록한다.

- [ ] **Step 3: 산출물만 스테이징한다**

  `AI-Harness-5h-Syllabus.docx`와 `output/pdf/AI-Harness-5h-Syllabus.pdf`만 스테이징한다. 사용자 수정 파일은 스테이징하지 않는다.

- [ ] **Step 4: 최종 검증 후 커밋한다**

  페이지 수, 파일 크기, 렌더 검사 결과, `git diff --cached --stat`을 확인하고 `git commit -m "docs: add AI harness course syllabus"`로 커밋한다.
