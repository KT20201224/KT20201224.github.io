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

HTTP는 웹 통신을 위한 기본 프로토콜로 서버와 클라이언트가 데이터를 주고받기 위한 규약이라고 이해하면 된다. 위 구조에서 요청을 HTTP Request, 응답을 HTTP Response라고 한다. 이때 HTTP 통신은 응답(HTTP Response)를 받으면 연결이 끊어지는 특징이 있습니다. 이를 HTTP의 **비연결성(Connectionless)**라고 합니다.