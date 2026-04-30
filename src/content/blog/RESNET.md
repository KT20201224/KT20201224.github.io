---
title: RESNET 분석
pubDate: 2026-04-28
description: RESNET 논문 해석/분석
tags:
- AI
- ML
- DeepL
category: ai-ml
---

# Abstract
신경망은 깊어질 수록 train하기가 어렵다. 깊은 신경망을 쉽게 학습시킬 수 있는 residual learning을 제안한다. 이는 입력과 상관없던 기존의 학습방식과 다르게 레이어 입력을 참조하는 방식이다. 해당 방식이 최적화하기 더 쉬우며 깊이가 증가해도 높은 정확도를 보이는 실험적 증거를 제시한다. ImageNet 데이터셋을 통해 VGG 보다 8배 깊이로 평가합니다. ImageNet 테스트에서 3.57%의 오차율을 기록했습니다. 해당 논문은 ILSVRC 2015 분류 부문에서 1위를 차지했습니다.
또한, 100개와 1000개 레이어를 가진 CIFAR-10 데이터셋에 대한 제시합니다. 표현의 깊이는 비전에서 핵심입니다. 깊은 표현력으로 COCO 객체탐지 데이터셋에서 28%의 상대적인 성능 향상을 기록했습니다.

# Introduction
Deep CNN은 이미지 분류 분야에서 획기적인 성과들을 이끌어냈습니다. low/mid/high-level의 다층 분류기를 합치며, 그 깊이가 깊어질수록 성능이 좋아진다는 사실을 밝혀냈습니다. ImageNet 데이터셋에서 16~30 층에 달하는 깊은 모델들이 주 성과를 이루었습니다.

한가지 의문이 생깁니다. 더 좋은 네트워크를 학습시키는 것이 layer를 더 많이 쌓는 것만큼 쉬운일일까? 층이 많아지면 gradient 소실/폭주 문제가 발생하게 됩니다. 이는 normallized initialization과 intermediate normalization layers 덕분에 상당 부분 해결되어 수십 개의 레이어를 가진 네트워크도 SGD로 