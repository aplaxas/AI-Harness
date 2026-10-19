
## AI 동료를 고르는 다섯 질문

| # | 질문 | 따져볼 것 | 왜 중요한가 |
|---|---|---|---|
| 1 | **어디서 일하는가** | 내 컴퓨터인가, 공급사의 클라우드인가, 둘 다인가 | PC를 꺼 두면 작업이 조용히 실패할 수 있어요 |
| 2 | **무엇에 접근하는가** | 로컬 폴더만인가, 연결된 앱인가, 내 계정으로 로그인한 모든 곳인가 | 접근 범위가 곧 사고가 났을 때 피해 범위예요 |
| 3 | **누가 승인하는가** | 어떤 행동 앞에서 멈추고 나에게 묻는가, 그 설정을 누가 바꿀 수 있는가 | 승인 피로가 쌓이면 마지막 방어선이 사라져요 |
| 4 | **한도는 어떻게 계산되는가** | 숫자로 공개돼 있는가, 대화와 한도를 같이 쓰는가, 새 모델이 나오면 어떻게 바뀌는가 | 꼭 필요할 때 한도가 바닥나는 일을 막아요 |
| 5 | **데이터는 어떤 계약 아래 있는가** | 개인 약관인가 기업 약관인가, 학습에 쓰이는가, 얼마나 보관되는가 | 개인 결제로 회사 데이터를 다루는 일을 막아요 |

책의 결론은, 이 다섯 질문에 답할 수 있으면 벤치마크 점수나 화제성에 휘둘리지 않고 판단할 수 있다는 거예요. 책이 독자에게 남기는 습관은 이 질문과 함께 세 가지예요.

- 새 도구를 들이기 전에 광고가 아니라 **도움말부터 읽기**: 성패를 가르는 정보는 대개 눈에 잘 띄지 않는 한 줄에 있어요.
- **다섯 질문**으로 판단하기
- **기록 남기기**: 작업 지시서, 멈춤 기록, 결정 문서를 남기고, 지시문은 제품 밖에 보관해요.


Let me get details on Dots, Muse, and Grok Bot.여덟 제품을 책의 다섯 질문에 맞춰 정리했어요. 2026년 10월 중순 기준이에요. 표에서 *미공개*라고 적은 건 공식적으로 밝혀지지 않은 항목이에요. Dots와 Muse는 출시된 지 3~6주밖에 안 돼서 이런 칸이 많아요.

## A. 대화형 + 작업형 (사람이 불러서 쓰는 도구)

| 제품 | ① 어디서 일하나 | ② 무엇에 접근하나 | ③ 누가 승인하나 | ④ 한도 계산 | ⑤ 데이터 계약 |
|---|---|---|---|---|---|
| **ChatGPT 웹** | OpenAI 클라우드 (에이전트는 클라우드 브라우저) | 공식 플러그인·앱 커넥터. 로컬 파일과 컴퓨터 사용은 데스크톱 앱에서만 | 중요한 행동(발송, 결제 등) 앞에서 확인. 관리자가 앱 접근을 통제 | 요금제·모델별 사용량 제한. 정확한 수치는 일부만 공개 | 개인 요금제: 학습 사용 여부를 사용자가 선택. Business/Enterprise: 기본적으로 학습 안 함 |
| **Claude 웹 (코워크 통합)** | Anthropic 클라우드 샌드박스. 데스크톱 앱은 로컬 폴더도 다룸 | MCP 커넥터(Drive, Gmail, Slack 등). 컴퓨터 사용은 Pro/Max 개인 요금제만 | 민감한 행동 전에 확인. 앱 접근은 앱별로 허락 | 5시간 단위 + 주간 한도. **대화와 에이전트 작업이 같은 한도를 씀**. 수치는 미공개 | 개인(Free/Pro/Max): 학습 허용 여부 선택. Team/Enterprise: 상업 약관이며 학습 안 함 |
| **Claude Code** | **내 컴퓨터**(터미널·IDE). 클라우드 실행 옵션도 있음 | 작업 폴더의 파일, 셸 명령, MCP 서버 | 권한 모드: 매번 묻기 / 편집 자동 승인 / 자동 모드 / 승인 건너뛰기. 사용자와 관리자 설정으로 조절 | Claude 요금제와 한도를 같이 씀 (웹 사용량과 합산) | Claude 웹과 같은 계약(개인 약관과 기업 약관 구분) |
| **Codex 데스크톱** | 내 컴퓨터 + OpenAI 클라우드 작업 | 작업 폴더(OS 기본 샌드박스 안), 로컬 명령, 클라우드 브라우저 | 샌드박스 3단계(읽기 전용 / 작업 폴더 쓰기 / 전체 접근)와 승인 정책(필요할 때 묻기 / 묻지 않기). '자동 검토' 에이전트에게 승인을 넘길 수도 있음 | ChatGPT 요금제와 한도를 같이 씀 | ChatGPT와 같은 계약. **로컬과 클라우드에 적용되는 정책이 서로 다름** |

## B. 상시 가동 에이전트 ("직원형")

| 제품 | ① 어디서 일하나 | ② 무엇에 접근하나 | ③ 누가 승인하나 | ④ 한도 계산 | ⑤ 데이터 계약 |
|---|---|---|---|---|---|
| **OpenAI Dots** (9/29 출시) | Dot마다 전용 **클라우드 컴퓨터와 브라우저**. 사용자가 연결해야만 내 기기에 접근 | 플러그인 4,000여 개, ChatGPT Space 파일. 저장된 사이트 로그인을 비밀번호 노출 없이 사용. Slack·Teams와 연동 | 규칙별로 허용 / 승인 필요 / 금지를 설정. 자동 검토가 승인 여부를 판단. 비밀번호 변경 등은 사람만 가능 | Pro와 Business Premium에 첫 Dot 포함. 사용량과 추가 비용은 **미공개** | 기업 워크스페이스: 기본적으로 학습 안 함. 개인: 선택. 보관 기간은 미공개. Enterprise는 베타 |
| **Meta Muse** (9/8 출시) | 사용자 전용 **격리된 클라우드 VM** | 브라우저, 메일 커넥터, 대화 간 기억. 실제 로그인 정보는 보지 못하고 토큰으로 대체됨. 소상공인용 연동(Shopify, QuickBooks, Stripe 등) | 발송·구매 전에 사용자 승인. 별도 감시 에이전트(Sentinel)가 모든 연결 동작과 네트워크 요청을 승인. 감사 기록 제공 | **유일하게 수치를 공개**: 무료 주 1억 토큰 / $20 주 5억 / $100 주 30억 | 학습 사용과 보관 기간은 미공개. **미국 전용**(18세 이상) |
| **Grok Bot** (SpaceXAI) | Cursor 클라우드의 상시 컴퓨터. **내 봇들이 컴퓨터 하나를 같이 씀** (파일, 브라우저 세션, 로그인 공유) | 커넥터가 있으면 커넥터를 쓰고, 없으면 화면 조작. 금융 계좌 연결(Plaid) | 승인이 필요할 때만 확인(돈이 걸린 작업은 승인을 켜 두라고 권장). 봇 전용 지출 상한이 없음 | 주간 한도, 초과분은 종량제. 요금제를 겹쳐도 사용량이 합산되지 않음. Cursor Pro $20부터 | 사용자가 에이전트 행동을 책임지고, 배상 한도는 낸 요금과 $100 중 큰 금액. 계정 연결은 **되돌릴 수 없음**. 감사 기록은 Enterprise만 |
| **Gemini Spark** | 구글 클라우드에서 24시간 동작. 로컬 Chrome을 쓰는 작업은 PC가 켜져 있어야 함 | Gmail, 캘린더, Docs, Sheets, Drive 등 구글 앱 전반. Canva, Dropbox 등 외부 앱과 MCP. 원격 브라우저 | 발송, 데이터 변경, 구매, 양식 제출 전에 확인. 단 Google Tasks는 묻지 않고 일괄 수정 | AI Pro($19.99) 이상에 포함. 한도는 요금제 배수로만 안내되고 Spark 전용 한도는 미공개. 동시 작업 15개 | **활동 기록 저장(Keep Activity)을 켜야 함**. **회사 Workspace 계정 미지원**. EEA·영국 등은 제외 |

## 한눈에 보는 차이

- **①번(어디서)** 질문에서 가장 뚜렷하게 갈려요. Claude Code와 Codex는 내 PC가 주 무대이고, B그룹 네 제품은 모두 클라우드에 있는 "자기 컴퓨터"에서 일해요.
- **②·③번(권한·승인)** 기준으로 격리가 가장 두꺼운 건 Muse예요. 반대로 Grok Bot은 봇끼리 컴퓨터를 공유하고 지출 상한도 없어서 가장 얇아요.
- **④번(한도)** 을 숫자로 공개한 곳은 Muse뿐이에요. 나머지는 책이 지적한 "예측 불가능성"에서 벗어나지 못했어요.
- **⑤번(계약)** 에서 1인 사업자가 바로 걸리는 지점이 있어요. Spark는 회사 계정을 지원하지 않고, Muse는 미국에서만 쓸 수 있어요. Dots와 Grok Bot은 기업용 관리 기능이 상위 요금제에 몰려 있어요.

Claude 웹, Claude Code, ChatGPT 웹의 세부 약관(학습 선택, 한도 구조)은 이번에 따로 확인하지 않았어요. 제가 아는 범위로 적은 것이니, 결제 전에 각 도움말 페이지에서 확인해 보세요.

Sources:
- [VentureBeat – OpenAI launches Dots](https://venturebeat.com/technology/openai-launches-dots-always-on-ai-agent-coworkers-and-chatgpt-space-where-they-can-collaborate-with-human-teams)
- [TechCrunch – OpenAI launches Dots](https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/)
- [MarkTechPost – Meta Introduces Muse](https://www.marktechpost.com/2026/09/08/meta-introduces-muse-a-personal-ai-agent-that-runs-on-its-own-dedicated-secure-cloud-computer/)
- [Tech Insider – Meta Muse $20 & $100 tiers](https://tech-insider.org/meta-muse-personal-ai-agent-launch-2026/)
- [Codersera – Grok Bot Complete Guide 2026](https://codersera.com/blog/grok-bot-complete-guide-2026/amp/)
- [Munder Difflin – Gemini Spark: what it costs and who can get it](https://munderdiffl.in/blog/what-is-gemini-spark/)
- [ChatGPT Learn – Sandboxing](https://learn.chatgpt.com/docs/sandboxing)