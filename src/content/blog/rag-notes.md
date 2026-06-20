---
title: "RAG Notes: Retrieval Quality Before Prompt Polish"
description: "A short implementation note on why RAG systems should inspect retrieval quality before tuning answer style."
pubDate: 2026-06-20
tags: ["RAG", "Python", "Evaluation"]
---

RAG projects often spend too much time on final answer formatting before the retrieval layer is understood. A polished response can hide weak context selection, stale documents, and inconsistent chunk boundaries.

The first debugging surface should show what entered the model:

- query normalization
- retrieved document IDs
- chunk boundaries
- reranker scores
- final context order
- rejected candidates

## A useful trace

A retrieval trace should be readable without opening a notebook. It should answer one question quickly: did the model receive enough evidence to produce the answer?

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

Once the trace is stable, prompt changes become easier to evaluate. Without it, every prompt improvement is partly guesswork.
