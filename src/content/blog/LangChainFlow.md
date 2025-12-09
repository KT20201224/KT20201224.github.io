---
title: 랭체인의 전체적인 흐름
pubDate: 2025-12-09
description: 랭체인에서 이루어지는 과정들을 간단하게 정리
author: KT
tags:
  - LangChain
  - Prompt
  - Embedding
  - VectorStore
---
#### 1. 데이터 로더
여러 raw data(pdf, Markdown, web Page)를 한 곳에 모아 LangChain이 쓸 수 있는 Document 객체 리스트로 만든다. LangChain은 다양한 로더들이 존재하기 때문에 어떤 형식의 문서도 Document화 시킬 수 있다.
1. PDF 로더 : pdf의 경우에는 각 페이지가 한 document로 로드된다.
2. HWP 로더 : 문서 로드 자체는 이루어지지만, 일부 기능은 지원되지 않는다.
3. CSV 로더 : 각 행마다 document 객체로 반환
4. DataFrame 로더 
외에도 정말 다양한 데이터 로더들이 존재하기 때문에, 상황에 맞게 데이터 로더를 잘 사용해야 한다.

Document는 `page_content` + `metadata`로 이루어지고, RAG 품질에 큰 영향을 주기 때문에 처음 document 객체 로드 단계에서 같이 설계하는 것이 좋다.


#### 텍스트 분할
데이터 로드 단계에서 다양한 raw data를 받아와서 document 객체로 통일 시켰다면, 텍스트 분할은 document로 된 긴 텍스트들을 적당한 크기의 청크(chunks)로  잘게 나누는 단계입니다. 페이지 전체를 넣어도 좋지만, 정말 필요한 정보만 선별해서 LLM에 넣는 방식이 더 높은 답변 품질을 제공하게 될 확률이 높습니다. 문서를 분할하는 전략은 문단, 문장, 글자 수, 토큰 수 등 다양한 전략이 존재하며 정답은 없습니다.

필요에 따라 소스 타입별로 spliter를 다르게 적용할 수 있지만, 보통 `RecursiveCharacterTextSplitter`로 기본 splitter를 구성해도 좋은 성능이 나온다고 합니다.

또한 chunk 단위로 나눈다고 하더라도, 원본 document의 메타데이터가 따라오기 때문에 출처를 역으로 trace도 가능하다고 합니다.