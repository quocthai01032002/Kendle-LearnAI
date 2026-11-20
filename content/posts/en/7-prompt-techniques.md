---
title: "7 prompting techniques that make AI more accurate today"
description: "Proven prompt-writing techniques: assigning context, giving examples, breaking down tasks and more, with copy-paste prompt templates you can use right away."
date: 2026-11-07
category: prompt-engineering
tags: [prompt, ChatGPT, Claude, productivity]
key: prompt-techniques
hue: 300
author: Kendle Team
---

With the same AI model, someone who knows how to prompt gets far better answers. Here are seven simple techniques that work across ChatGPT, Claude, Gemini and most other LLMs.

## 1. Say who you are and what you need

The AI doesn't know your context. Spell out who you are, what the output is for and who will read it.

```text
I'm the marketing lead for a coffee chain in Da Nang.
Write 3 email subject lines announcing our winter menu
to loyalty members aged 25–35, in a friendly tone.
```

## 2. Show examples (few-shot)

Instead of describing a style, **show 1–3 examples**. Models are excellent imitators.

```text
Label customer feedback by sentiment.
"Fast delivery, lovely packaging" → Positive
"The shirt has a broken seam" → Negative
"Product is okay, a bit pricey" → ?
```

## 3. Break complex work into steps

Don't ask for "a business plan" in one go. Go step by step: market → competitors → strategy → budget. Review and adjust at each step before moving on.

## 4. Ask it to reason step by step

For logic, maths or analysis, adding *"Reason step by step before giving your conclusion"* noticeably reduces mistakes.

## 5. Specify the output format

Say whether you want a table, list, JSON or prose, and how long.

```text
Answer as a 3-column table: Tool | Strengths | Price.
Maximum 5 rows. No extra explanation.
```

## 6. Use delimiters around data

When pasting long documents, wrap them in tags so the model can tell instructions from data:

```text
Summarise the contract below in 5 key points, flagging any penalty clauses.

<contract>
...paste contract here...
</contract>
```

## 7. Let the AI say "I don't know"

Add: *"If you're not sure, say so instead of guessing."* This one line meaningfully reduces made-up answers.

## A reusable template

Combine everything above into one framework:

```text
[Role & context] I am ..., I need ... in order to ...
[Task] Please ...
[Data] <data> ... </data>
[Examples] ...
[Format] Answer as ..., max ... words.
[Constraints] If unsure, say so.
```

> **Tip:** Save prompts that work into a notes file. After a few weeks you'll have a personal prompt library that saves hours every week.
