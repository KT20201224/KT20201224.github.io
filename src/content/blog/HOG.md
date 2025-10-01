---
title: Histogram of Oriented Gradients, HOG
pubDate: 2025-10-01
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

아래 720x475 크기의 이미지에서 우리는 HOG Featrure Descriptor를 계산하기 위해 100x200 크기를 잘라내고, resize를 진행하였습니다. 또한 앞서 봣듯이 색상은 물체의 형태를 구분하는 데 필요하지 않기 때문에, 이미지를 그레이스케일링 해줍니다. 

[![각 이미지 패치에 대해 고정되고 균일한 종횡비를 유지하기 위한 HOG 전처리.](https://learnopencv.com/wp-content/uploads/2016/11/hog-preprocessing.jpg)](https://learnopencv.com/wp-content/uploads/2016/11/hog-preprocessing.jpg)
#### 2. 이미지 계산
물체를 인식하는 핵심은 바로 "형태"입니다. 그래서 우리는 이제 주어진 이미지에서 Gradient를 계산합니다. 물체의 밝기가 급격하게 변화하는 부분은 물체의 윤곽(Edge)이고, 그것이 Gradient(밝기의 변화량)이죠. 다음 데이터에서 가장 큰 변화율을 가지는 부분은 어딜까요?

```text
[10,11,12,100,101,102]
```

12 -> 100 에서 가장 Gradient가 크죠. 우리는 이미지 파일에서도 똑같이 이 부분을 찾아낼 것입니다.
Gradient는 두가지 성분으로 표현됩니다. 방향과 크기죠.

![HOG-20251001-1.png](/images/blog/HOG-20251001-1.png)

우리는 Sobel을 활용해서 다음을 계산합니다. Sobel을 활용하면 주변픽셀에 가중치를 두어 노이즈를 줄이고, 더 부드러운 Gradient를 찾을 수 있습니다. 실제 단순히 변화량을 계산한 경우와 Sobel을 활용한 결과를 비교해 보았습니다.

```python
from skimage import data, color, feature, transform
import matplotlib.pyplot as plt
import cv2
import numpy as np
  
# Sample Image
image = data.astronaut()
image = image[0:200, 180:280]
resized = transform.resize(image, (128, 64))
  
# gray cale
gray = color.rgb2gray(resized)
gray = np.float32(gray)
  
# 방법 1: 단순 차분
gx_diff = np.zeros_like(gray)
gy_diff = np.zeros_like(gray)

gx_diff[:, 1:-1] = gray[:, 2:] - gray[:, :-2]
gy_diff[1:-1, :] = gray[2:, :] - gray[:-2, :]

# 방법 2: Sobel
gx_sobel = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
gy_sobel = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)

# 크기, 방향
mag_diff, angle_diff = cv2.cartToPolar(gx_diff, gy_diff, angleInDegrees=True)
mag_sobel, angle_sobel = cv2.cartToPolar(gx_sobel, gy_sobel, angleInDegrees=True)
angle_diff = angle_diff % 180
angle_sobel = angle_sobel % 180

# 강한 edge만
threshold_diff = mag_diff.mean() + mag_diff.std()
strong_edges_diff = mag_diff > threshold_diff
threshold_sobel = mag_sobel.mean() + mag_sobel.std()
strong_edges_sobel = mag_sobel > threshold_sobel

# 방향을 색으로
angle_colored_diff = np.zeros((*gray.shape, 3))
angle_colored_diff[strong_edges_diff] = plt.cm.hsv(angle_diff[strong_edges_diff] / 180.0)[:,:3]
angle_colored_sobel = np.zeros((*gray.shape, 3))
angle_colored_sobel[strong_edges_sobel] = plt.cm.hsv(angle_sobel[strong_edges_sobel] / 180.0)[:,:3]

# 시각화
fig, axes = plt.subplots(1,2,figsize=(10, 8))

axes[0].imshow(angle_colored_diff)
axes[0].set_title('diff')
axes[0].axis('off')
axes[1].imshow(angle_colored_sobel)
axes[1].set_title('sobel')
axes[1].axis('off')
```

![HOG-20251001-4.png](/images/blog/HOG-20251001-4.png)
육안으로 그렇게 큰차이는 보이지 않지만, Sobel 방식이 머리카락 부분에서 불필요한 데이터를 조금 더 제거 한 것 같습니다.

#### 8x8 셀 히스토그램
이제 이미지를 8x8 셀로 나누고 각 8x8 셀에 대하여 Gradient Histogram이 계산됩니다. 왜 128x64데이터를 모두 사용 안하고, 8x8로 다시 구분하는지는, 의문이 듭니다. 하지만 고작 128x64의 픽셀 단위로 계산해도 약 8000개의 픽셀 데이터를 다루게 됩니다. 데이터의 양과 정확도는 슬프게도 비례하지 않습니다. (물론 반비례하지도 않습니다.) 너무 많은 정보는 노이즈에 약하다 정도로 알고 가면 좋을 것 같습니다. 셀단위로 나누면 128개의 셀 데이터가 생기는데 이정도 크기로도 사람의 형태를 구분하는데 충분하죠. 


이 글은 아래 링크를 읽고 얻은 내용을 바탕으로 작성하였습니다.
출처 : https://learnopencv.com/histogram-of-oriented-gradients/
출처 : https://ieeexplore.ieee.org/abstract/document/1467360


