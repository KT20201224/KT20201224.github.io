---
title: LangGraph에서 대화 기록 상태 관리
pubDate: 2026-12-29
description:
author: Kyoungtea Kim
tags:
  - LangGraph
  - BaseMessage
---
LangGraph에서 상태를 누적해서 관리할 때 우리는 operator.add를 사용한다. 이는 List에 append 하는 방식으로 `messages: Annotated[list[str], operator.add]`