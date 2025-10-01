---
title: Histogram of Oriented Gradients, HOG
pubDate: 2024-10-01
description: HOG에 대한 공부
author: Kyoungtea Kim
tags:
  - HOG
---
Histogram of Oriented Gradients 직역하면 "기울기 지향 히스토그램" 이다. 히스토그램은 도수분포표를 시각화 한 그래프를 말하는데, 그러면 기울기의 분포를 구간별로 나타낸 그래프라고 해석이 된다.

처음 접하면 내용들이 어려워 한단계씩 정의해 나가야한다. HOG는 머신러닝인가? 라고 한다면 사실 그렇지는 않다. 정확히는 Feature Descriptor이라는 표현이 더 정확하다. 그렇다면 Feature Descriptor는 무엇인가?

## Feature Descriptor
표현이 길어 이 글에서 앞으로는 "FD"로 줄여서 표현합니다. FD는 유용한 정보는 추출하고, 외부 정보는 버리는 방식으로 이미지를 단순화하는 표현입니다.

FD는 Width x Height x 3 크기의 이미지를 길이 n의 특징 배열(벡터)로 변환합니다. **Dalal & Triggs (2005)**에서 도로에서 보행자 검출을 사용할 때, HOG 방식에서 64 x 128 x 3의 이미지 크기를 사용했습니다.



이 글은 아래 링크를 읽고 얻은 내용을 바탕으로 작성하였습니다.
출처 : https://learnopencv.com/histogram-of-oriented-gradients/


