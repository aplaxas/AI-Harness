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
| [docs/memory/](docs/memory/) | 대화가 바뀌어도 이어갈 에이전트 메모리 |

`docs/superpowers/`는 강의별로 나누지 않고 날짜순으로 쌓는다. 과거 문서에 나오는 옛 경로는 그때의 기록이므로 고치지 않는다.

## 메모리

다음 대화에서도 알아야 할 것(작업 환경, 저자의 선호, 받은 피드백)은 사용자 홈의 메모리 폴더가 아니라 **이 저장소의 `docs/memory/`**에 저장한다. 그래야 Claude Code와 Codex가 같은 기억을 쓰고, 다른 컴퓨터에서도 이어진다.

- 작업을 시작하면 `docs/memory/MEMORY.md`를 먼저 읽는다. 이 파일은 자동으로 읽히지 않는다.
- 기억 하나가 파일 하나다. 파일명은 주제를 드러내는 영문 kebab-case다(예: `user-remote-setup.md`).
- `MEMORY.md`는 목록만 둔다. 한 줄에 `- [제목](파일.md) — 한 줄 설명` 하나씩 적는다.
- 코드·원고·git 기록에서 알 수 있는 것은 적지 않는다. 틀린 기억은 고치거나 지운다.

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

zsh/bash (macOS)에서는 이렇게 한다.

```bash
# 공백·개행 오류
git diff --check -- 'courses/'

# 깨진 상대 링크·이미지 경로만 출력
find courses -name '*.md' | while read -r f; do
  d=$(dirname "$f")
  grep -oE '\]\([^)]+\)' "$f" | sed 's/^](//; s/)$//' | grep -v '^https\?:' | sed 's/#.*$//' |
  while read -r l; do
    [ -n "$l" ] && [ ! -e "$d/$l" ] && echo "BROKEN: $f -> $l"
  done
done
```

`rg`는 PowerShell PATH에 없다. 검색은 Grep 도구나 `Select-String`을 쓴다.

## 커밋

영문 Conventional Commits (`docs: ...`). 한글 경로는 pathspec에서 따옴표로 감싼다.
