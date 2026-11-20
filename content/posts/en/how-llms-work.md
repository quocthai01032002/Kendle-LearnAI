---
title: "How do LLMs work? A plain-language explanation"
description: "From tokens and embeddings to attention: understand how large language models like ChatGPT, Claude and Gemini generate answers, and why they sometimes get things wrong."
date: 2026-11-14
category: generative-ai
tags: [LLM, transformer, ChatGPT, Claude, basics]
key: how-llms-work
featured: true
hue: 262
author: Kendle Team
---

Every day, hundreds of millions of people chat with ChatGPT, Claude or Gemini. But what is actually happening inside the "black box"? This article explains how **large language models (LLMs)** work without a single equation.

## The core idea: predict the next word

At heart, an LLM does exactly one thing: **guess what text comes next**. Type *"The capital of France is"* and the model scores thousands of possible continuations, then picks a likely one: *"Paris"*.

Repeat that hundreds of times, appending one piece of text each time, and you get a complete answer. Everything that looks "smart" about an LLM, from writing code to summarising documents, comes from this prediction running at enormous scale.

> An LLM doesn't *look up* answers. It *generates* them from patterns learned during training.

## Step 1: Tokens, how machines "read"

Computers don't understand letters, only numbers. So text is split into **tokens**: whole words, word fragments or punctuation.

| Text | Tokens (illustrative) |
|---|---|
| `Hello world` | `Hello` · ` world` |
| `unbelievable` | `un` · `believ` · `able` |

Languages with diacritics, like Vietnamese, often need **more tokens** for the same idea, which can make API usage more expensive.

## Step 2: Embeddings, words as coordinates

Each token becomes a **vector**, a list of thousands of numbers that works like coordinates in a high-dimensional space. Words with related meanings end up close together: "king" sits near "queen", "Paris" near "London".

## Step 3: Attention, understanding context

This is the key invention of the **Transformer** architecture (2017). *Attention* lets every word "look at" every other word to work out context.

In *"The cat didn't jump on the table because **it** was too tired"*, attention helps the model see that "it" means the cat, not the table.

## Step 4: Training at massive scale

The model reads text equivalent to millions of books. Every wrong guess nudges its parameters (sometimes hundreds of billions of them) slightly. Further fine-tuning with human feedback then makes it more helpful and safer.

## Why do LLMs sometimes make things up?

Because LLMs are optimised to produce text that **sounds plausible**, not text that is **true**. When information is missing, they can still produce a fluent but wrong answer. This is called **hallucination**.

How to reduce it:

- Put the source material in your prompt and ask the model to answer *only from it*.
- Ask for citations and double-check important numbers.
- Use **RAG** to connect the model to real data (see our RAG tutorial).

## Summary

1. LLMs predict the next token, over and over.
2. Tokens → embeddings → attention is the core pipeline.
3. Their power comes from the scale of data and parameters.
4. LLMs can be confidently wrong, so always verify what matters.
