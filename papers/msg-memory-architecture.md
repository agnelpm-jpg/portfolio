# MSG: Mnemonic State Graph

## Abstract

Mnemonic State Graph (MSG) treats AI memory as a coordination architecture rather than a storage feature. The central claim is that useful long-term memory requires structured state, selective forgetting, and human checkpoints, not merely larger context windows.

## Core Thesis

Most LLM memory systems behave like append-only logs. MSG reframes memory as a graph:

\[
G_m = (S, E, W, F)
\]

where \(S\) is the set of remembered states, \(E\) is the set of semantic/causal links, \(W\) is relevance weight, and \(F\) is a forgetting policy. The model asks what should be retained, what should decay, and when a human should be pulled into the loop.

## Architecture

- State nodes store compressed user/project/context snapshots.
- Edges encode relationships such as dependency, contradiction, priority, and recurrence.
- Retrieval ranks memory by relevance, recency, confidence, and task fit.
- Forgetting is active, not accidental: low-value or stale nodes decay unless reinforced.
- Human-in-the-loop review is triggered when memory confidence is low or stakes are high.

## Implication

The goal is not perfect recall. The goal is better reasoning continuity. MSG makes memory legible, auditable, and correctable so an AI agent can coordinate across time without drowning in its own history.

## Status

Early architecture research. The next useful step is a small working prototype that compares graph memory against flat transcript retrieval.
