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
Feature Descriptor는 유용한 정보는 추출하고, 외부 정보는 버리는 방식으로 이미지를 단순화하는 표현입니다.

그렇다면 이미지에서 유용한 정보와 유용하지 않은 정보는 무엇일까? "유용하다"를 정의하려면, 우리는 그것이 무엇을 위해 유용한지 알아야합니다. 우리가 다룰 Feature Vector는 우리가 사진을 구경할 때는 유용하지 않지만,  이미지 인식이나 물체 감지의 영역에서는 "유용"하다. 이러한 알고리즘으로 생성된 Feature Vector는 SVM과 같은 이미지 분류 알고리즘에 공급될 때 좋은 결과를 산출하게 됩니다.

그러면 어떤 "Feature"가 이미지를 분류하는데 유용할까? 예를들어, 우리가 옷에 있는 단추를 감지하는 탐지기를 만든다고 가정해보죠. 단추의 특징을 떠올려 봅시다. 

- 단추는 대부분 동그랗다
- 가운데 구멍이 뚫려있다.
- 플라스틱 소재로 대부분 반짝거린다.
- 옷의 색깔과 보통 비슷한 계열이다.

우리가 단추를 구분하기 위한 "유용"한 정보는 무엇이죠? 바로 "동그랗다"입니다. 혹은 구멍이 뚫려있다까지도 유용할 수 있겠네요. 그럼 이미지에서 단추를 구분할 때 유용한 정보는 "원형"이 되는 것이죠.

HOG Feature Descriptor에서도 Gradient(기울기) 방향의 분포가 특징으로 사용됩니다. 이미지의 Gradient는 가장자리와 모서리 주변에서 Gradient의 크기가 크고 다른 영역보다 물체 모양에 대한 정보를 훨씬 더 많이 담고 있습니다.

## 히스토그램을 계산하고 표현하는 방법

#### 1. 전처리

이미지의 크기는 다양하게 가져갈 수 있지만, "Histograms of oriented gradients for human detection" 에서 도로 위 보행자 검출을 위해 사용했던 크기를 그대로 사용해보겠습니다.

위 논문에서는 64x128 크기를 기준으로 계산됩니다. 

아래 720x475 크기의 이미지에서 우리는 HOG Featrure Descriptor를 계산하기 위해 100x200 크기를 잘라내고, resize를 진행하였습니다.

[![각 이미지 패치에 대해 고정되고 균일한 종횡비를 유지하기 위한 HOG 전처리.](https://learnopencv.com/wp-content/uploads/2016/11/hog-preprocessing.jpg)](https://learnopencv.com/wp-content/uploads/2016/11/hog-preprocessing.jpg)






이 글은 아래 링크를 읽고 얻은 내용을 바탕으로 작성하였습니다.
출처 : https://learnopencv.com/histogram-of-oriented-gradients/
출처 : https://ieeexplore.ieee.org/abstract/document/1467360


