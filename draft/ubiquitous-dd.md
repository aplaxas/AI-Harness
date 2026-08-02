두 스킬은 이름은 비슷하지만 **목적이 완전히 다릅니다.**

Matt Pocock가 `ubiquitous-language`를 deprecated 시킨 이유도 단순히 이름을 바꾼 것이 아니라, **"용어집 작성"에서 "도메인 모델링 프로세스"로 역할을 확장했기 때문**입니다. ([GitHub][1])

아래처럼 생각하면 됩니다.

| 항목  | ubiquitous-language (deprecated) | domain-modeling (current) |
| --- | -------------------------------- | ------------------------- |
| 목적  | 공통 용어(Ubiquitous Language) 유지    | 도메인 모델 자체를 설계             |
| 중심  | 용어(Glossary)                     | 개념 + 관계 + 규칙 + 용어         |
| 결과물 | CONTEXT.md                       | CONTEXT.md + ADR + 모델 개선  |
| 역할  | 정적 문서                            | 지속적인 설계 활동                |
| 상태  | Deprecated                       | 권장                        |

---

# 1. ubiquitous-language의 철학

예전 스킬은 거의 Eric Evans의 DDD에서 말하는

> "Everyone speaks the same language."

에 집중되어 있었습니다.

예를 들면

```
Customer
Order
Invoice
Subscription
```

이런 용어가

코드

```
Customer
```

문서

```
Customer
```

회의

```
Customer
```

모두 동일하게 쓰이는지를 관리합니다.

즉

```
Business
↓

Glossary

↓

Code Naming
```

정도의 흐름입니다.

장점

* 코드 네이밍이 좋아짐
* AI가 프로젝트 용어를 이해함
* 설명이 짧아짐

하지만 여기서 끝입니다.

---

# 2. domain-modeling은 무엇이 다른가?

Matt Pocock는 여기서 한 단계 올라갑니다.

공식 설명도 이렇게 시작합니다.

> Build and sharpen a project's domain model. Challenge fuzzy terms, stress-test relationships, record decisions. ([GitHub][2])

즉

용어를 적는 것이 목적이 아니라

**모델을 발전시키는 것**이 목적입니다.

예를 들면

기존에는

```
Order
```

만 정의했다면

이제는

```
Order

contains

OrderItem

contains

Shipment

contains

Invoice

contains

Refund
```

이런 관계까지 모델링합니다.

---

# 3. 가장 큰 차이

옛 스킬

```
Customer

Order

Invoice
```

정의 끝.

새 스킬

```
Customer

owns

Order

Order

creates

Shipment

Shipment

produces

Tracking

Tracking

belongs to

Carrier
```

즉

**Relationship**가 생깁니다.

---

# 4. Edge Case를 계속 던진다

새 스킬은 AI가 질문을 많이 합니다.

예를 들어

```
Can an Order have multiple Shipments?

```

```
Can Shipment exist without Order?

```

```
Can Refund exceed Payment?

```

```
Can Invoice exist before Payment?

```

이런 질문으로

모델을 다듬습니다.

이게 domain-modeling의 핵심입니다. ([GitHub][1])

---

# 5. 코드와 비교한다


예를 들어

당신은

```
Partial Cancellation exists.
```

라고 말했다.

그런데

코드를 보면

```
Order.cancel()
```

만 있다.

그러면 domain-modeling은

> "당신은 부분 취소가 가능하다고 했는데 코드에서는 전체 Order만 취소됩니다. 어느 쪽이 맞습니까?"

라고 질문합니다. ([GitHub][1])

즉

```
Language

↓

Model

↓

Code

```

세 개가 항상 일치하도록 만듭니다.

---

# 6. ADR까지 관리

예전

```
CONTEXT.md
```

만 관리

새 스킬

```
CONTEXT.md

+

docs/adr/
```

까지 관리합니다.

예를 들면

```
Why did we choose Event Sourcing?

```

같은

되돌리기 어려운 설계 결정은

ADR로 남깁니다. 단, 모든 결정을 기록하는 것이 아니라 **되돌리기 어렵고, 트레이드오프가 있으며, 나중에 보면 의아할 수 있는 결정만** ADR로 남기도록 기준을 두고 있습니다. ([GitHub][1])

---

# 7. 다른 Skill과도 연결된다

이게 이번 구조 변경의 핵심입니다.

예전

```
grill

↓

ubiquitous language
```

현재

```
grill-with-docs
         │
         ▼
domain-modeling
         │
         ▼
CONTEXT.md

         │
         ▼
ADR

         │
         ▼
implement

         │
         ▼
code-review
```

즉

여러 스킬이 공통으로 사용하는 **기반 계층**이 되었습니다. 실제로 `improve-codebase-architecture`, `grill-with-docs`, `tdd` 등도 `domain-modeling`을 재사용하도록 재구성되었습니다. ([GitHub][3])

---
