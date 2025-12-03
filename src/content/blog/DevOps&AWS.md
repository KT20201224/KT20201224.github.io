---
title: DevOps와 AWS 기초
pubDate: 2025-12-03
description: Devops와 AWS의 기초 배우기
author: KT
tags:
  - DevOps
  - NeuralNetworks
  - RDS
  - EC2
  - Docker
---
개발자가 코드를 작성하고 사용자가 실제로 서비스를 이용하기까지 필요한 내용은 다음과 같습니다.
1. 개발자가 코드 작성
2. Github에 Push
3. 테스트/빌드 -> Github Actions
4. 서버에 배포 -> EC2, Docker
5. 데이터 저장 -> RDS, S3
6. 사용자가 서비스 이용

DevOps는 이 전체 과정을 **빠르고 안정적**으로 만드는 방법론 혹은 문화입니다. 

## Github Actions
개발자가 코드를 push하면 자동으로 테스트하고, Docker 이미지 빌드하고, 서버에 배포까지 해주는 CI/CD 도구입니다.
- CI(Continuous Integration) : push할 때마다 자동으로 테스트, "이 코드 합쳐도 돼?"
- CD(Continuous Deployment) : 테스트 통과하면 자동 배포

## AWS 인프라 서비스
#### 1. EC2 = 빌려 쓰는 컴퓨터
EC2는 AWS에서 미리 세팅해둔 컴퓨터를 인터넷으로 빌려 쓰는 것입니다. CPU, RAM 등 원하는 사양을 선택하고, 사용한 만큼 돈을 지불하면 됩니다.

#### 2. RDS = DB관리는 AWS가
EC2에 직접 MySQL 설치도 가능하지만, 백업/업데이트/장애 대응을 직접 해야 합니다. RDS는 이런 귀찮은 DB 운영을 대신 해주기 때문에, 개발자는 SQL 쿼리에만 집중할 수 있습니다.

#### 3. S3 = 무한 파일 저장소
사용자가 업로드한 이미지, 동영상, 로그 파일 등을 저장하는 곳입니다. 용량 제한 없이 저렴하게 사용할 수 있는 객체(Object) 스토리지입니다.

#### 4. Security Group = 가상 방화벽
EC2나 RDS 앞에서 누가 접근할 수 있는지 제어합니다. 예를 들어, 80번 포트는 모두에게 열고, "80번 포트는 모두에게 열고, 22번 포트(SSH)는 회사 IP만 허용"처럼 설정합니다. **Stateful**이라서 들어온 요청에 대한 응답은 자동 허용됩니다.

#### 5. IAM = 권한 관리 시스템
AWS 리소스에 대한 접근 권한을 관리합니다. "A 개발자는 EC2만, 개발자 B는 S3만 접근 가능"처럼 사용자/그룹/역할/정책 단위로 세밀하게 제어할 수 있습니다.

## Docker 
분명 내 컴퓨터에선 문제 없이 돌아갔는데, 다른 환경에서는 안되는 경험이 있을 것이다. 이런 문제가 발생하지 않도록 애플리케이션과 실행 환경(OS, 라이브러리, 설정)을 하나의 이미지로 묶어서 어디서든 동일하게 동작하게 만듭니다. 

#### 1. Dockerfile = 이미지를 만들기 위한 설계도
Dockerfile은 도커 이미지를 만드는 방법을 적어둔 명령어들의 모음이다. 일종의 **레시피**라고 할 수 있다.

```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

#### 2. Docker Image =  컨테이너를 만드는 실행 환경 패키지
Docker Image는 Dockerfile을 통해 만들어지는 완성된 실행 환경 패키지이다. 애플리케이션을 실행하기 위한 모든 것이 포함된 하나의 묶음이다. 이미지는 읽기 전용(Read-only)으로 다음과 같은 내용들을 포함하고 있다.
- OS 레이어(Ubuntu, Alpine 등)
- 런타임(Python/Node/Java)
- 소스코드
- 필요한 라이브러리
- 환경 설정
- 실행 명령

#### 3. Docker Container = 이미지를 실행한 실제 애플리케이션
Docker Container는 이미지를 실행하여 만들어진 실제 동작 중인 애플리케이션이다. 이미지가 프로그램이라면, 컨테이너는 그 프로그램이 실행되고 있는 프로세스이다.

전체적인 흐름은 다음과 같다.
1. Dockerfile
2. `docker build`
3. Docker Image
4. `docker run`
5. Container

#### 4. Docker Compose
실제 서비스에서는 DB, 웹서버, 캐시, 등 여러 컨테이너로 구성됩니다. Docker Compose는 이것들을 하나의 파일로 정의하고 `docker-compose up` 한 번으로 전부 실행할 수 있게 해줍니다.


## 정리
1. DevOps : 빠르고 안정적인 배포를 위한 문화/방법
2. Github Actions : push하면 자동으로 테스트, 빌드, 배포
3. EC2 : 빌려쓰는 서버
4. RDS : 관리형 DB
5. IAM : 권한 관리
6. Docker : 환경째 패키징, 어디서든 동일하게 실행
7. Dockerfile : 이미지 설계도
8. Docker Image : 실행 환경 패키지
9. Docker Container : 실행된 실제 애플리케이션
10. Docker Compose : 멀티 컨테이너 관리





