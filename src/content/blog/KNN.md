---
title: K-Nearest Neighbors, KNN
pubDate: 2025-10-14
description: KNN 알고리즘 학습, 실습
author: KT
tags:
  - KNN
  - ML
---
## K-Nearest Neighbors 알고리즘 
KNN의 핵심아이디어는 "비슷한 것들은 가까이 있다."입니다. 새로운 데이터 포인트가 주어졌을 때, 그 주변의 가장 가까운 K개의 이웃들의 정보를 바탕으로 정답을 예측합니다.

---
## KNN 작동원리
#### 1. 학습 단계
KNN은 학습이라는 과정이 실제로 존재하지는 않습니다. 가중치를 학습하거나 모델 파라미터를 최적화하는과정이 없고, 데이터를 메모리에 저장만 합니다.

#### 2. 예측 단계
실제 계산은 예측 단계에서 일어납니다.
1. 거리계산 : 새로운 데이터 포인트와 학습 데이터 간의 거리를 계산합니다.
2. 정렬 : 계산된 거리를 오름차순으로 정렬합니다.
3. 이웃 선택 : 가장 가까운 K개의 데이터 포인트 선택
4. 예측 :
	- 분류 : K개의 이웃 중 가장 많이 나타난 클래스 선택
	- 회귀 : K개의 이웃의 평균 값 계산

---
## 거리 측정 방법
#### 1. 유클리드 거리
우리가 흔히 알고 있는 두 점 사이의 직선거리이다. 가장 직관적이고, 연속형 데이터에 적합하다.
$$
d = √[(x₁-x₂)² + (y₁-y₂)² + ... + (zₙ-zₙ)²]
$$
#### 2. 멘헤튼 거리
격자 형태로 이동하는 거리, 2차원 상으로 볼 때, 점과 점 사이의 가로+세로 길이의 합이다
$$
d = |x₁-x₂| + |y₁-y₂| + ... + |zₙ-zₙ|
$$
---
## K 값 선택
K는 KNN에서 가장 중요한 하이퍼파라미터이다. K값을 어떻게 설정하느냐에 따라 장단점이 존재합니다.
#### 1. K가 너무 작을 때
- 장점
	- 데이터의 세밀한 패턴을 포착 가능하다.

- 단점
	- 노이즈에 매우 민감하다.
	- 결정하는 경계가 복잡하고 불안정하다.
	- 아상치 영향을 많이 받는다.

#### 2. K가 너무 클 때
- 장점
	- 안정적이고, 노이즈에 강하다

- 단점
	- 지역적 패턴을 무시하는 경향이 있다.

#### 3. 적절한 K값 구하기
보통 √n (n=학습데이터 개수)를 시작으로 교차 검증으로 최적값을 찾아 나간다. 이진 분류의 경우에는 동률을 방지하기 위해 홀수로 선택합니다.

---
## 데이터 전처리

#### 1. 스케일링
KNN은 거리 기반 알고리즘으로 스케일링이 필수적입니다. x,y축으로 이루어진 2차원상의 거리가 아닌 각 feaure값 거리이기 때문에 서로 다른 단위의 feature를 단순하게 거리로 계산하게 되면 단위가 큰 값이 거리에 지배적이다. 이를 반드시 스케일링 해줘야한다.
- 정규화 : 0~1 범위로 변환 $$(x - min)/(max - min)$$
- 표준화 : 평균 0, 표준편차 1로 변환 $$(x - 평균)/표준편차$$
#### 2. 결측치
KNN은 결측치가 있으면 거리 계산이 불가하다. 이와 같은 경우는, 평균/중앙값으로 대체하거나, 해당 샘플은 제거한다.

---
## KNN 장단점
#### 장점
1. 직관적이고 이해하기 쉽다.
2. 복잡한 패턴도 학습할 수 있고, 선형 분리가 불가능한 데이터도 처리할 수 있다.
3. 분류/회귀 모두 사용이 가능하다.
4. 학습하는 과정이 따로 필요없다.
5. 확률적으로 해석이 가능하다.

#### 단점
1. 계산 비용이 높다. 모든 데이터와 거리 계산이 필수적
2. 계산양만큼, 모든 데이터를 저장해야하기 때문에 메모리 소모가 크다.
3. feature가 많은 경우에는 성능이 저하된다.
4. 불균형 데이터에 취약하다. 데이터가 많은 정답으로 예측이 편향될 수 있다.

---

## 코드
```
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import confusion_matrix

# Iris 데이터 load
iris = load_iris()
X = iris.data
y = iris.target

# 데이터 셋 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 데이터 스케일링
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
```