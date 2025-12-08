---
title: Prompt caching, OpenAI
pubDate: 2025-12-08
description: OpenAI 프롬프트 캐싱의 원리
author: KT
tags:
  - OpenAI
  - PromptCahcing
---
모델 프롬프트는 가끔 반복되는 내용들이 들어갈 수 있다. OpenAI API에서는 프롬프트 캐싱을 통해 같은 프롬프트에 대한 요청을 빠르고 저렴하게 사용할 수 있는 기능을 자동으로 제공한다. 프롬프트 캐싱은 latency를 최대 80%, token cost를 최대 90%까지 절감 할 수 있다. 해당 기능은 API 요청 시 별도의 과금 없이 자동으로 제공된다.

캐시히트는 프롬프트의 앞부분인 prefix가 정확히 일치해야 작동한다. 캐시 히트를 높이려면 지시문 같은 정적인 내용을 앞에 배치하고 자주바뀌거나 개인적인 내용은 뒤로 배치하는 전략이 유리하다. 이미지나 툴의 경우에도 예외없이 같은 전략을 사용하는 것이 좋다.

![PromptCaching-20251208-1.png](/images/blog/PromptCaching-20251208-1.png)

#### 동작 원리
프롬프트 캐싱은 사용자가 1024개 이상의 긴 프롬프트를 보낼 때 자동으로 활성화가 된다.
###### 1. Cache Routing
요청이 들어오면, 프롬프트의 앞부분(보통 256토큰)을 해시해서 어떤 캐시를 사용할지 결정한다. 작은 차이로도 해시값은 달라지기 때문에, `prompt_cache_key`를 활용하면 동일한 프롬프트가 아니더라도 같은 캐시 그룹으로 처리할 수 있다.

###### 2. Cache Lookup
선택된 캐시 서버에 가서 "이 프롬프트 앞부분(prefix) 이미 계산된 적이 있는가?"를 확인하고 있다면 캐시를 적용하고 없다면 새로 계산을 진행한다.

###### 3. Cahce Hit
해당 프롬프트 앞부분(prefix)가 캐시에서 발견되면, 모델이 미리 계산된 초기 상태를 재사용한다. 캐시 히트가 나면 응답이 빠르고 비용도 줄어든다.

###### 4. Cache Miss
프롬프트 앞부분(prefix)이 캐시에 없다면, 모델이 처음부터 전체 프롬프트를 처리하고, 이 prefix를 캐시에 저장해 다음요청부터 캐시 히트가 가능해진다.

#### Prompt Cache Retention
프롬프트 캐싱은 메모리 기반(in-memory) 또는 확장 보존(extended retention) 중 하나를 사용할 수 있다. 확장 보존의 경우에는 캐시를 더 오래 유지하여 캐시히트율을 높이는 것을 목표로 합니다. 두 방식의 비용은 모두 동일합니다.

###### 1. In-memory prompt cache retention
메모리 기반 프롬프트 캐시 보존 방식은 프롬프트 캐싱을 지원하는 모든 모델에서 사용이 가능하다. 캐싱된 prefix는 5~10분 동안 요청이 없다면 비활성화 될 수 있으며, 최대 1시간까지 유지가 가능합니다. In-memroy 캐시는 휘발성 GPU 메모리 안에만 저장됩니다.

###### 2. Extended prompt cache retnetion
- gpt-5.1
- gpt-5.1-codex
- gpt-5.1-codex-mini
- gpt-5.1-chat-latest
- gpt-5
- gpt-5-codex
- gpt-4.1

위 모델에서만 사용 가능합니다. 확장 프롬프트 캐시는 prefix를 더 오래 유지하면 최대 24시간까지 활성상태를 유지합니다. 확장 캐싱 방식은 GPU 메모리가 가득 찼을 경우, key/value 텐서를 GPU 로컬 스트리지로 오프로딩(offloading)하는 방식으로 작동합니다. 따라서 캐싱 가능한 저장 용량이 크게 증가합니다.

retention 값을 따로 지정하지 않으면 캐시는 자동으로 in-memory 방식으로 저장된다. Extended Retention을 사용하려면 다음과 같이 지정해줘야 한다.

```python
{
  "model": "gpt-5.1",
  "input": "Your prompt goes here...",
  "prompt_cache_retention": "24h"
}
```
너무 다양한 시간 설정을 허용하면 캐시관리가 복잡해지기 때문에 `prompt_cahce_retention`의 파라미터로는 `"in_memory"`와 Extended Retention 방식인 `"24h"`외의 다른 값은 지원하지 않는다. 

#### Prompt Caching Requirements
프롬프트 캐싱은 1024 토큰 이상을 포함한 프롬프트에서만 동작하고, 캐시 히트는 128 토큰 단위로 발생합니다. 예를 들어, 1024, 1152, 1280과 같은 토큰들이 가능합니다. 모든 요청은 `usage.prompt_tokens_details.cached_tokens` 필드를 통해 캐시 히트된 토큰을 표시해줍니다.
```json
"usage": {
  "prompt_tokens": 2006,
  "completion_tokens": 300,
  "total_tokens": 2306,
  "prompt_tokens_details": {
    "cached_tokens": 1920
  },
  "completion_tokens_details": {
    "reasoning_tokens": 0,
    "accepted_prediction_tokens": 0,
    "rejected_prediction_tokens": 0
  }
}
```

#### 캐싱 가능한 것들
1. Message : 시스템, 사용자, 어시스턴트 메시지를 모두 포함하는 전체 messages 배열
2. Images : 사용자 메시지에 포함된 이미지
3. Tool use : 사용 가능한 도구 목록
4. Structured outputs : 구조화된 출력

#### 💡정리
- 프롬프트를 구성할 때, 변하지 않고, 반복되는 내용을 앞부분에 배치하는 전략을 사용해야 한다.
- 공통 prefix를 가진 요청들은 `prompt_cache_key` 파라미터를 일관성 있게 사용해야한다. 또한 분당 15회 이하로 유지해야 캐시 오버플로우를 피할 수 있다.
- 캐시 성능 지표(히트율, latency 등)를 지속적인 모니터링을 통해 전략을 개선해야한다.
