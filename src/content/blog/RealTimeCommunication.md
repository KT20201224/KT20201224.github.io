---
title: 실시간 통신과 웹소켓
pubDate: 2025-11-29
description: 실시간 통신을 학습하고 네트워크에 대한 이해를 키워본다.
author: KT
tags:
  - WebScoket
  - Netwrok
  - TCP
  - Polling
---
실시간 소통(Real-Time Communication)과 소켓(Socket)은 네트워크/백엔드/프론트엔드 나눌 것 없이 서비스를 개발하려면 반드시 알아야하는 주제이다. 이번 기회에 부족했던 개념들을 한번에 정리하고자 한다.

우선 Web통신을 알아야 합니다. 웹 통신은 기본적으로 클라이언트와 서버 간의 상호작용을 기반으로 합니다. 이를 "클라이언트 - 서버 모델"이라고 부릅니다. 클라이언트는 주로 웹브라우저와 같이 사용자의 요청을 보내는 역할을 하고 서버는 이러한 요청을 처리하고 응답(반환)하는 역할을 합니다. 

![WebSocket-20251129-1.png](/images/blog/WebSocket-20251129-1.png)

HTTP는 웹 통신을 위한 기본 프로토콜로 서버와 클라이언트가 데이터를 주고받기 위한 규약이라고 이해하면 된다. 위 구조에서 요청을 HTTP Request, 응답을 HTTP Response라고 한다. 이때 HTTP 통신은 응답(HTTP Response)를 받으면 연결이 끊어지는 특징이 있습니다. 이를 HTTP의 핵심 특징인 **비연결성(Connectionless)** 이라고 합니다. 그래서 웹은 실시간으로 서비스를 운영할 수 없는 한계가 존재합니다. 이를 마치 "실시간인 것처럼" 하는 기술이 Polling이라는 기술입니다.

---
## Polling
Polling은 클라이언트가 일정 시간마다 서버에 새로운 데이터가 존재하는지 요청을 보내는 방식이다. 예를 들어, SNS 서비스에 폴링을 적용한다면
1. 첫 렌더링이 될 때, 서버에서 API 요청이 발생
2. 이후 N초마다 새 글이 있는지 확인하기 위해 클라이언트 측에서 API 요청을 보냄
3. 새 글이 존재하면 응답을 받고, 클라이언트 측에서 리렌더링
4. N초 후 다시 새 글이 존재하는지 API 요청

![WebSocket-20251129-2.png](/images/blog/WebSocket-20251129-2.png)

HTTP만 알고 있다면 주기적으로 요청만 보내주면 되기에 구현이 아주 쉽습니다. 하지만 갱신사항의 존재 유무와 상관없이 지속적으로 요청을 날리기 때문에, 트래픽이 낭비되고 사용자가 많아진다면 서버 부하가 커집니다. 또 일정 주기로 응답을 받아오기 때문에 진짜 실시간이라고 보기엔 어렵다.

---
## Long Polling
Long Polling은 요청을 서버로 보내면 지정된 시간동안 대기합니다. 새 데이터가 생기면 서버는 클라이언트에게 응답을 보내 연결을 종료합니다. 제한 시간 동안 요청이 완료되지 않으면 timeout을 전달하고, 클라이언트는 새로운 요청을 만들어서 요청-응답 주기를 생성한다. 즉, 서버 측에서 접속을 열어두는 방식이다.

![WebSocket-20251129-3.png](/images/blog/WebSocket-20251129-3.png)

같은 주기로 계속 요청을 보내는 Polling보다는 효율적이다. 조금 더 실시간에 가까워진 방식이지만 연결을 유지해야 하기 때문에 서버가 많은 연결을 처리해야 한다. 사용자가 많은 환경에서는 비효율적이다.

---
## TCP 소켓
TCP 소켓을 공부하려면 우선 TCP가 무엇인지 알아야한다. TCP는 Transmission Control Protocol의 약자로 네트워크를 통해 두 애플리케이션이 데이터를 신뢰성 있게 교환할 수 있도록 하는 통신 표준입니다. TCP/IP 4계층을 기준으로 HTTP/WebSocket/SSE는 Application layer에 존재하고, TCP는 그 아래 Transport layer에서 데이터를 안정적으로 보내주는 역할을 합니다. 

#### IP, Port, 프로세스
앞으로 사용될 용어인 IP, Port, 프로세스를 간단하게 정리만 하고 가겠습니다.
1. IP : 어느 컴퓨터로 가야하는지 
	- 192.168.0.10
2. Prot : 컴퓨터 안에 어떤 프로그램(프로세스)와 통신할 것인가 
	- 80(HTTP)
	- 443(HTTPS)
	- 3306(MySQL)
3. 프로세스 : 우리가 작성한 서버 프로그램

#### TCP
이제 주소는 알았다. 근데 "어떻게 보낼까?"를 아직 다루지 않았는데 이 역할을 하는 것이 TCP(Transmission Control Protocol)이다. 이 TCP의 역할은 크게 4가지가 존재한다.
1. Connection-oriented : "우리 연결하자"라고 합의(handshake)하고나서 데이터를 주고 받는다.
2. Reliable : 중간에 데이터가 일부 사라지면 다시 보내달라 요청한다. 데이터가 깨졌는지 체크(체크섬)하고 빠진 부분이 없이 받도록 해준다.
3. Ordered : 먼저 보낸 데이터가 나중에 도착해도 받는 쪽에서는 원래 순서대로 받도록 조정해준다.
4. Stream : 패킷 하나하나 대신 바이트가 이어지는 형태의 데이터 흐름을 제공한다.

즉, 데이터를 안전하게 형태가 변형되지 않게 보내주는 규칙입니다.

###### 3-Way handshake
TCP가 연결에 대해 합의하는 과정을 handshake라고 표현했는데, 그 흐름을 3-Way handshake라고 하고, 다음과 같은 과정으로 이루어집니다.
1. 클라이언트 -- (SYN) --> 서버  : "우리 연결해요!(SYN)"
2. 서버 -- (ACK + SYN) --> 클라이언트 : "좋아 접속 받아줄게(SYN)" / "요청 확인했어(ACK)"
3. 클라이언트 -- (ACK) --> 서버 : "나도 네 SYN 잘 받았어!(ACK)"

이 3단계를 거치고 서로 데이터를 보내고 받을 수 있는 TCP 연결이 완성됍니다. 이제 이 연결 위에서 HTTP, WebScoket 같은 프로토콜을 자유롭게 올려서 사용할 수 있게 됩니다.

#### 소켓
TCP가 뭔지 알았으니 이제 소켓이 뭔지 알아보겠습니다. 소켓은 OS가 만들어주는 "네트워크 통신용 객체/파일"이다. 이 안에는 내 IP/Port, 상대 IP/Port, TCP 연결 상태, 송수신 버퍼 같은 정보들이 들어있다. 리눅스/맥 관점에서는 소켓을 그냥 파일 디스크립터의 일종이라고도 할 수 있다. 우리가 파일에 read()/wirte() 하듯이 소켓에recv()/send()를 합니다. 


#### TCP 소켓 동작과정
위에서 필요한 개념들은 모두 정리했으니 이제 TCP 소켓이 어떻게 동작하는지 알아보겠습니다. 
![All_of_Network-20251130-3.png](/images/blog/All_of_Network-20251130-3.png)

###### Server Socket flow
1. socket() : 통신용 소켓을 생성한다. 현재는 아무 주소와도 연결되지 않은 상태
2. bind(ip,port) : 해당 IP/Port로 요청을 받겠다고 설정
3. listen() : 포트를 열어두고 접속자를 기다리는 대기 상태 진입
4. accept() : 3way-handshake가 끝나고, 서버에서 새로운 소켓을 하나 생성해서 반환한다. 클라이언트와 연결된 전용 소켓이 생성된다. 이 소켓은 클라이언트를 기다리려고 만든 소켓과는 실제 다른 클라이언트와의 통신용 소켓
5. send() & recv() : 만들어진 소켓으로 양방향 통신을 진행
6. close() : 연결 종료

###### Client Socket flow
1. socket() : 클라이언트 소켓 생성
2. connenct(server ip, port) : 서버로 연결 요청을 전송한다. 연결이 확정되면 서버의 accept()로 이어진다.
3. send() & recv() : 만들어진 소켓으로 양방향 통신을 진행
4. close() : 연결 종료

###### 주의할점
1. listen()의 대기용 소켓과 accept()의 통신용 소켓은 다르다.
2. connect() ~ accept() 과정에 마무리가 "TCP 연결"이다. 이 과정에서 3way-handshake가 내부적으로 발생한다.
3. 연결이 완료되고 양쪽 소켓에서는 그냥 단순하게 send()/recv만 하면된다.

---
## WebSocket
#### HTTP의 한계
HTTP의 기본 구조는 "클라이언트가 요청(Request)을 보내야 서버가 응답(Response)를 돌려줄 수 있다"입니다. 즉, 서버가 클라이언트 측으로 먼저 말을 못걸고 클라이언트가 필요할 때마다 물어봐야 하는 구조이다. 실시간 상황을 보면
- 주식 : 초단위로 데이터가 바뀜
- 채팅 : 상대가 메시지 보내는 타이밍을 알 수 없음
- 게임 : 실시간으로 위치, 체력 정보가 계속 바뀜

이를 HTTP로 처리하려면
- 계속 요청을 날림(Polling)
- 요청을 오래 잡고 기다림(Long Polling)
서버가 먼저 보내주지 않기 때문에 HTTP만으로는 "진짜 실시간 양방향"을 만들기 힘들다. 웹소켓의 목적은 HTTP 처럼 웹 환경에서 쉽게 사용하고 TCP처럼 연결 유지 + 양방향 + 실시간을 모두 동시에 만족하는 것을 추구한다.

#### 웹소켓의 특징
1. 양방향 : 서버가 먼저 push가 가능하다.
2. 연결 유지 : 한 번 handshake 후 해당 TCP 연결을 계속 사용한다.
3. 메시지 단위 통신 : 메시지 경계가 없는 바이트 스트림을 특징으로 가지는 TCP와 다르게 웹소켓은 "프레임" 단위로 메시지를 쪼개서 주고 받는다.
4. 네트워크 효율 : 쓸데없는 HTTP 헤더 반복이 없고, Polling처럼 무의미한 요청이 필요가 없다.

#### WebScoket Handshake
브라우저는 직접 TCP 소켓을 만들 수 없고, 방화벽/프록시/로드밸런서가 HTTP만 허용하는 환경이 많다. 따라서 WebScoket은 HTTP 요청으로 시작해서 WebSocket 프로토콜로 업그레이드 시킨다. WebSocket Handshake는 다음과 같은 과정으로 진행된다.

###### 1. 클라이언트 -> 서버 (WebSocket 요청)
브라우저가 WebSocket을 열면 내부적으로 아래와 같은 HTTP 요청을 보낸다
```
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: XpZ3qYz7qv0bFZ5z1g==
Sec-WebSocket-Version: 13
```
- `Upgrade: websocket` : HTTP에서 WebSocket으로 업그레이드 하고 싶다.
- `Connectoin: Upgrade` HTTP 연결을 끊지 않고 같은 TCP 연결을 다른 프로토콜로 변경한다.
- `Sec-WebSocket-Key: XpZ3qYz7qv0bFZ5z1g==` : 클라이언트가 임의로 만드는 문자열키
- `Sec-WebSocket-Version: 13` : 웹소켓 표준 버전

###### 2. 서버 -> 클라이언트 (Handshake 응답)
서버는 위 요청을 보고 "나도 WebSocket 가능해~"라고 응답해야 한다.
```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: qGEZtWnQb0lSydNF0x2jDP0+9qM=
```
- `101 Switching Protocols` : HTTP에서 WebSocket 프로토콜로 변경 성공
- `Upgrade: websocket` : 서버 측에서도 업그레이드 동의
- `Sec-WebSocket-Accept: qGEZtWnQb0lSydNF0x2jDP0+9qM=` : 웹소켓을 이해하고 있음을 인증하는 키

###### 3. HandShake 이후
이 시간 이후로 같은 TCP 연결을 사용하지만 더 이상 HTTP 규칙이 아닌 웹소켓 프레임 규칙을 따르게 된다.
- text frame
- binary frame
- ping/pong
- close frame
과 같은 웹소켓 전용 메시지로 정보를 주고 받는다.

###### 💡 추가 : 웹소켓의 특별한 인증 과정
HTTP 요청에 `Upgrade: websocket`이라고 적혀있다고 서버가 반드시 WebSocket 서버라는 보장이 없다. 엉뚱한 서버나 프록시가 WebSocket 요청을 받으면 웹소켓 업그레이드를 하지 못하니 그 뒤로 오는 프레임을 전혀이해하지 못하고 이상한 동작을 할 수가 있다. 따라서 위에서 주고 받던 `Sec-WebSocket-Key`가 웹소켓을 이해하고 있는 서버인지 확인하는 키이다. 클라이언트가 서버에게 24바이트 길이의 랜덤 문자열을 전송하면 이 문자열을 특정 알고리즘으로 계산된 응답(`Sec-WebSocket-Accept: qGEZtWnQb0lSydNF0x2jDP0+9qM=`)을 보내 서버가 웹소켓을 이해했는지 보장된다. 이를 Challenge-Response 인증 방식이라고도 부르는데, 쉽게 말해 `Sec-WebSocket-Key`를 통해 서버가 웹소켓 프로토콜을 지원하는지 검증하고 웹소켓을 연결한다.

#### 웹소켓의 프레임 구조
WebSocket은 TCP 스트림 위에서 "메시지" 단위로 통신하기 때문에 데이터가 정확히 메시지 단위로 구분되어 온다. TCP는 바이트 스트림이라 "ABCDEFGHIJK"를 "ABC"+"DEFGHIJK"로 받을지 "ABCDEFGHIJK"로 받을지 모르지만 웹소켓은 한 프레임에 한 메시지로 단위가 명확하고 안정적이다.

###### 프레임
웹소켓에서 프레임은 웹소켓 메시지를 네트워크에서 표현한 최소 단위이다. 웹소켓 프레임은 바이트 스트림과 다르게 Binary 구조의 정형화된 프레임으로 전송된다.
![RealTimeCommunication-20251201-1.png](/images/blog/RealTimeCommunication-20251201-1.png)
```
| FIN | RSV1 | RSV2 | RSV3 | OPCODE | MASK | PAYLOAD LEN | MASKING KEY | PAYLOAD DATA |
```
- FIN(1bit) : 일반적인 메시지는 FIN=1이지만, 큰 파일 전송이 경우에는 FIN=0으로 나눈다.
	- FIN = 1 : 이 프레임이 메시지의 마지막 조각이다. 이 프레임 자체로 하나의 메시지 
	- FIN = 0 : 메시지가 여러 프레임으로 나눠져 있고 아직 중간 조각
- RSV1/2/3(3bit) : 기본 웹소켓에서는 0으로, 확장 기능(Extensions)을 위한 비트
- OPCODE(4bit) : 웹소켓은 OPCODE를 통해 하나의 연결 안에서 다양한 제어 메시지/데이터 메시지를 섞어 보낼 수 있다.
	- 0x1 : 텍스트 메시지(UTF-8)
	- 0x2 : 바이너리 메시지
	- 0x8 : 연결 종료(close)
	- 0x9 : ping
	- 0xA : pong
- MASK(1bit) : 웹소켓의 특별한 특징 중 하나이다. 클라이언트 -> 서버 방향의 프레임은 반드시 MASK를 1로 설정하는데, 이는 중간 프록시나 캐시가 웹소켓 프레임을 HTTP 메시지로 오해하는 것을 막기위한 보호 장치이다. 마스킹이 적용되면 중간에서 payload 내용을 해석할 수 없고, 잘못 처리하는 경우를 방지한다. 
- Payload Length (7bit or extended) : 7비트로 표현 불가능할 만큼 길면 확장 길이 필드가 붙는다. 
	- 0~125byte : 7bit
	- 126 : 16bit
	- 127 : 64bit
- Masking Key(32bit) : MASK=1이면 32bit의 랜덤 키가 붙고 Payload는 이 키로 XOR 마스킹되어 전송된다. 서버는 같은 키로 다시 XOR 해서 payload를 복구
- Payload Data : 실제 메시지 내용

###### 💡Payload Length 추가 설명
7비트는 0~127까지의 숫자가 표현 가능하다. payload의 길이가 127보다 길어질 수 있으니, 7bit에서 표현가능한 길이를 최대 125로 설정하고, 126과 127은 확장 길이 필드에가서 실제 길이를 확인하라는 의미이다. 126은 뒤 16비트에 실제 길이가 들어있다는 의미이고, 127은 뒤 64비트에 실제 길이가 들어있다는 의미이다.

#### WebSocket의 연결유지와 Ping/Pong
웹소켓은 TCP 위에서 돌아가지만, TCP만 믿으면 실시간 서비스는 쉽게 끊겨버릴수 있다. 그래서 웹소켓은 자신만의 Ping/Pong 메커니즘을 가지고 있다. TCP는 연결지향 프로토콜이지만 상대방이 죽었는지, 끊겼는지 바로 알 수 없다. 예를들어, 컴퓨가 꺼지거나, 인터넷이 끊긴 상황을 바로 알 수 없다. Ping/Pong 프레임은 두가지 역할을 한다.

###### 1. 상대방이 살아있는지 확인
서버 혹은 클라이언트가 Ping 프레임을 보내면 상대는 반드시 Pong 프레임으로 응답해야한다. Ping을 보내고 일정 시간안에 Pong이 없으면 연결이 죽었다고 간주하고 연결을 종료한다.

###### 2. 중간 장비(프록시/방화벽)가 idle 연결을 끊지 않도록 유지
프록시나 방화벽은 데이터가 너무 오래 안흐르면 연결을 끊는다. 이때, Ping/Pong 프레임이 주기적으로 연결을 활동 상태로 만들어 중간에서 연결을 죽이지 않게 방지해준다.
cd
###### 💡 추가로 알아야 할 것
1. Ping은 서버도, 클라이언트도 보낼 수 있지만 일반적으로 서버가 주기적으로 클라이언트에게 Ping을 보낸다. 
2. 웹소켓 Ping/Pong과 TCP Keep-Alive는 다르다. TCP Keep-Alive는 너무 느리고 애플리케이션에서 제어가 불가능해 실시간 서비스에서는 반드시 웹소켓 Ping/Pong을 사용해야 한다.




