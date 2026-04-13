---
title: Understanding neural networks through sparse circuits, OpenAI
pubDate: 2025-11-14
description: 희소 회로로 이해하는 신경망
author: KT
tags:
  - OpenAI
  - NeuralNetworks
---
현대 인공지능은 놀라울 정도의 성능을 보여줍니다. 하지만, 치명적인 약점이 존재합니다. 제가 느낀 모델은 x -> F(x) 를 대입법으로 함수를 구하는 과정이라고 생각합니다. 즉, 데이터로 학습을 하지만 왜 그렇게 대답했는지는 그 누구도 모르는 것이죠.

이것은 전통적인 신경망의 구조에서 나오는 한계입니다. 일반적인 딥러닝 모델은 "Dense Network"입니다. 각 뉴런이 수천 개의 뉴런과 연결되어 활성화되어 있습니다. 기존의 연구자들은 이렇게 복잡하게 훈련된 모델을 분석하려고 했습니다. 하지만 너무 복잡한 구조로 인해 풀어내지 못했습니다.

이 글에서는 새로운 접근법을 시도합니다. 
"추론 과정을 열심히 알려고 하지말고, 그냥 처음부터 단순하게 만드는게 어떨까?"

"Sparse Model"을 제안합니다. 훨씬 많은 뉴런을 사용하자!! 대신에 연결을 최소한으로 줄여.
연결을 죽이는 방법은 가중치를 0으로 만들면 되죠. 해당 글에서는 가중치의 대부분(약 95%)의 가중치를 강제로 0으로 만들어서 연결을 죽입니다.

![Understanding neural networks through sparse circuits-20251114-1.png](/images/blog/Understanding neural networks through sparse%20circuits-20251114-1.png)

그리고 "Circuit(회로)"라는 단위 개념을 도입합니다. Circuit은 특정 기능을 수행하는 최소한의 뉴런 집합을 의미합니다. 놀랍게도, 전체 모델 약 100,000개의 뉴런 중에서 단 5~6개의 뉴런만으로 특정 작업을 완벽하게 수행할 수 있음을 밝혀냈습니다. 회로는 다음 두가지 특성을 만족해야 합니다.
1. Sufficient : 이 뉴런들만으로 해당 작업이 수행 가능해야 합니다.
2. Neccesary : 이 뉴런들 중 하나라도 제거하면 실패 즉, 모든 뉴런이 필수적으로 해당 기능에 관여합니다.


![Understanding neural networks through sparse circuits-20251114-2.png](/images/blog/Understanding neural networks through sparse%20circuits-20251114-2.png)
일반적으로 AI 모델이 커지고 강력해질수록 내부 작동이 복잡해져 "블랙박스"가 된다고 여겨졌습니다. 성능과 해석 가능성은 trade-off 관계라는 생각이였습니다. 하지만 Sparse 모델에서는 정반대의 결과가 나왔습니다. 위 사진에서 보면 모델의 크기를 키우면서 희소석을 높이면 성능과 해석가능성이 모두 향상되는 것으로 나타났습니다.

![Understanding neural networks through sparse circuits-20251114-3.png](/images/blog/Understanding neural networks through sparse%20circuits-20251114-3.png)
이 다이어그램은 아직 완벽하게 이해하지는 못했지만, 단 6개의 노드로도 single quote와 double quote를 구분할 수 있다는 것 같습니다...

## 앞으로
이 연구는 의미 있는 성과지만, 아직 시작에 불과하다고 합니다. 현재 해석 가능한 모델은 GPT-2 수준의 작은 규모이며 최첨단 모델과는 큰 격차가 있습니다. 따옴표 매칭, 괄호 짝 맞추기 같은 간단한 작업은 완전히 이해할 수 있지만, 아직 복잡한 추론이나 창의적 생성 같은 고차원 능력은 이해하지 못합니다.

