---
title: "RAG 笔记：先看召回质量，再调提示词"
description: "一个关于 RAG 调试顺序的短笔记：在打磨回答风格之前，先检查模型到底拿到了什么上下文。"
pubDate: 2026-06-20
tags: ["RAG", "Python", "评估"]
---

RAG 项目很容易过早进入提示词调优阶段。回答看起来更顺了，不代表系统真的变可靠了；它可能只是把召回质量差、文档过期、切分边界混乱这些问题包装得更不明显。

我更倾向于先做一个能看清上下文的调试面板，至少显示这些信息：

- 查询是否被改写
- 召回了哪些文档 ID
- chunk 边界在哪里
- 重排分数是多少
- 最终上下文顺序如何
- 哪些候选内容被丢弃

## 一条有用的 trace

一条 retrieval trace 应该不用打开 notebook 也能读懂。它要快速回答一个问题：模型拿到的证据是否足够支撑最终答案？

```python
def inspect_context(query, results):
    return [
        {
            "rank": index + 1,
            "score": item.score,
            "source": item.metadata["source"],
            "preview": item.text[:240],
        }
        for index, item in enumerate(results)
    ]
```

当 trace 稳定之后，提示词调整才更容易评估。否则每一次“效果变好”都可能只是偶然。
