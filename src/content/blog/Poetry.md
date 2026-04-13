---
title: Poetry
pubDate: 2025-12-13
description: Poetry로 환경을 구성할 때 장단점과 그 특징
author: KT
tags:
  - pip
  - venv
  - poetry
---
## 기존의 방식

파이썬으로 개발할 때 초기 세팅은 venv나 conda 같은 가상환경에 `pip install requirements.txt` 방식으로 패키지를 설치해왔다. 독립적인 가상환경으로 의존성을 수정하고 싶은 경우에 가상 환경을 바꿔주면 됐다. 

하지만, 개발/프로덕션 환경에서는 좋지 않은 방법으로 판단이 됐다. 의존성을 수정하려면 매번 `requirements.txt` 파일을 수정하고 패키지를 다시 받아야하는 번거로움이 존재하고 패키지 업데이트 시 버전 충돌에 대한 추적이 어려울 것 같았다. 

비슷한 방식으로 머신러닝/데이터 사이언스 영역에서는 Conda를 많이 사용한다. 하지만, ML/Data쪽 패키지가 주를 이루고 웹개발 쪽 패키지 업데이트가 느리다. 후에 필요한 패키지를 추가하고 싶을 때, 원하는 패키지가 없을 확률이 존재한다.

uv는 최근 새로 떠오르고 있는 Rust 기반 초고속 패키지 관리자이지만, 역사가 짧아 프로젝트 기간동안 발생할 여러 문제들에 대응하기가 어려울 확률이 높다.

따라서 안정적이고, 프로덕션/개발 환경을 분리해서 관리할 수 있는 Poetry를 사용하고자 한다.

| 방식       | 장점                                                                                  | 단점                                                                       |
| -------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| pip+venv | - 추가 도구 설치 불필요<br>- 어디서나 사용가능한 표준<br>- 빠르고 디버깅이 쉬움                                  | - 의존성 충돌 감지 없음<br>- requirements.txt 수동 관리<br>- 하위 의존성 추적 불가             |
| poetry   | - 의존성 문제 자동 해결<br>- 가상환경 자동 관리<br>- 개발/프로덕션 자동 분리<br>- 관련 자료 풍부<br>- 웹 개발 관련 패키지 많음 | - 추가 도구 설치<br>- 의존성 해결해 시간 소요<br>- python 버전 별도 관리                       |
| conda    | - python 버전 포함 관리<br>- 안정적<br>- 컴파일 불필요<br>- ML/DE 패키지 다양함                          | - 매우 느림<br>- 무거움<br>- Docker 이미지가 커져서 빌드시간이 오래걸림                         |
| uv       | - 빠름<br>- Rust 기반<br>- 메모리 효율적                                                      | - 신생이라 불안정 및 자료 부족<br>- 문제 발생 시 대처할 자료 부족<br>- 기능 제한적<br>- 개발/프로덕션 분리 수동 |

## Poetry
> Python 프로젝트 패키지를 관리해주는 도구

Poetry의 2가지 핵심 개념을 이해한다면 환경 세팅이 쾌적해진다.
#### 1. pyproject.toml
내가 필요한 패키지를 적는 toml 파일이다. `requirements.txt` 작성하듯이 작성하면 되는데 한가지 특별한 점이 있다. `^` 로 버전의 범위를 설정해줄 수가 있다.

```toml
fastapi = "^0.109.0" 
langchain = "^0.1.0"
```
위 예시는 fastapi는 0.109.x 버전, langchain은 0.1.x. 버전으로 사용한다는 의미와 동일하다.

#### 2. poetry.lock
위 파일을 보고 Poetry가 자동으로 `poetry.lock`이라는 파일을 만들어준다.

```lock
fastapi==0.109.2 # 정확히 0.109.2 
pydantic==2.5.3 # fastapi가 필요로 하는 것 
starlette==0.35.1 # fastapi가 필요로 하는 것 
typing-extensions==4.9.0 # pydantic이 필요로 하는 것 
annotated-types==0.6.0 # pydantic이 필요로 하는 것 
```
위 파일을 poetry가 알아서 만들어주고 이 파일은 따로 git에 commit,push를 진행해야 한다. 

## Poetry 사용 과정
#### Step 1 : 설치
```bash
# macOS/Linux
curl -sSL https://install.python-poetry.org | python3 -

# 또는
pip install poetry
```

#### Step 2 : 프로젝트 시작
```bash
# 프로젝트 디렉토리로 이동 
cd ~/projects/restaurant-recommendation 

# Poetry 초기화 
poetry init

This command will guide you through creating your pyproject.toml config.

Package name [restaurant_llm_evaluation]:  
Version [0.1.0]:  
Description []:  test
Author [Jerry <76553143+KT20201224@users.noreply.github.com>, n to skip]:  
License []:  
Compatible Python versions [>=3.11]:
...
```
step by step 따라가면 아래와 같은 toml파일이 생성된다.

```toml
[project]
name = "restaurant-llm-evaluation"
version = "0.1.0"
description = "test"
authors = [
    {name = "Jerry",email = "76553143+KT20201224@users.noreply.github.com"}
]
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
]


[build-system]
requires = ["poetry-core>=2.0.0,<3.0.0"]
build-backend = "poetry.core.masonry.api"
```

#### Step 3 : 패키지 설치
처음 init에서도 설치가 가능하지만 다음과 같이 패키지를 설치할 수 있다. 자동으로 toml 파일이 업데이트 된다. 또한 개발 패키지와 프로덕션 패키지로 분리가 가능하다. `--group dev` 는 개발 환경에만 추가되는 패키지이다.
```bash
# 프로덕션 패키지 
poetry add fastapi # 웹 프레임워크 
poetry add uvicorn # 서버 
poetry add langchain # LLM 처리

# 개발 패키지
poetry add --group dev pytest # 테스트 프레임워크 
poetry add --group dev pytest-asyncio # async 테스트 
poetry add --group dev pytest-cov # 커버리지 측정
```

## 정리

Poetry는 패키지 충돌 측면에서 안정적이며 관리 및 배포가 쉬워진다는 장점이 있어 패키지가 많거나 팀 프로젝트 단위에서 사용하기 좋다고 생각한다.



