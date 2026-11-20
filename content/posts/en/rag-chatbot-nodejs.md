---
title: "What is RAG? Build a document Q&A chatbot in Node.js in 30 minutes"
description: "A step-by-step guide to Retrieval-Augmented Generation: chunk documents, create embeddings, run semantic search and let an LLM answer from your own data."
date: 2026-10-31
category: tutorials
tags: [RAG, Node.js, embedding, chatbot, LLM]
key: rag-nodejs
hue: 190
author: Kendle Team
---

LLMs are great with language but know nothing about your company's internal documents. **RAG (Retrieval-Augmented Generation)** fixes that: before answering, the system *retrieves* relevant passages and hands them to the LLM as context.

## RAG in four steps

1. **Chunking:** split documents into 300–800-word passages.
2. **Embedding:** turn each passage into a vector and store it.
3. **Retrieval:** for each question, find the passages with the closest vectors.
4. **Generation:** send the question plus retrieved passages to the LLM.

## Setup

```bash
mkdir rag-demo && cd rag-demo
npm init -y
npm install dotenv
```

You need an API key from a provider that offers both embeddings and chat. Store it in `.env` and **never** commit that file to GitHub.

## Step 1: Chunk the documents

```js
function chunkText(text, size = 600, overlap = 100) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}
```

The `overlap` keeps ideas intact when a sentence is cut between two chunks.

## Step 2: Measure similarity

Once each chunk has a vector (from your provider's embedding API), compare them with **cosine similarity**:

```js
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function topK(queryVec, store, k = 3) {
  return store
    .map((item) => ({ ...item, score: cosine(queryVec, item.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
```

## Step 3: Build a grounded prompt

```js
function buildPrompt(question, chunks) {
  const context = chunks.map((c, i) => `[${i + 1}] ${c.text}`).join('\n\n');
  return `Answer only from the documents below.
If they don't contain the answer, say "I couldn't find this information".
Cite the passage numbers you used.

<documents>
${context}
</documents>

Question: ${question}`;
}
```

## Step 4: Put it together

The full flow: receive question → embed it → `topK` → `buildPrompt` → call the chat API → return the answer.

## When do you need a vector database?

For a few hundred passages, a JSON file and a simple loop like the one above is fast enough. At tens of thousands, consider dedicated options such as **pgvector** (PostgreSQL), **Qdrant** or **Chroma**.

## Quality tips

- **Clean your data** before chunking: strip repeated headers, footers and tables of contents.
- **Attach metadata** (file name, section, date) to each chunk for clear citations.
- **Evaluate regularly:** keep 20–30 sample questions with known answers and re-test after every change.

> RAG doesn't make an LLM "smarter", but it makes it **more faithful** to your data.
