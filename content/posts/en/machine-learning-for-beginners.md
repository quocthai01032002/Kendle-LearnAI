---
title: "Machine learning for beginners: 5 core concepts you need"
description: "Training data, models, overfitting, supervised learning and evaluation, the foundations behind every other AI article, explained with everyday examples."
date: 2026-10-24
category: machine-learning
tags: [machine learning, basics, overfitting, data]
key: ml-basics
hue: 225
author: Kendle Team
---

Machine learning underpins almost every modern AI application. You don't need advanced maths to grasp the main ideas. Start with these five concepts.

## 1. Learning from examples, not rules

Traditional programming: humans write rules → the machine follows them. Machine learning: humans provide **examples** → the machine works out the rules.

Want to detect spam? Instead of listing thousands of keywords, give the model 100,000 emails labelled "spam" or "not spam". It learns the signals by itself.

## 2. Training data decides everything

> "Garbage in, garbage out."

A model is only as good as its data. If every cat photo shows a white cat, the model may fail on black cats. Data must be **plentiful, diverse and accurate**.

## 3. Three main types of learning

| Type | How it works | Examples |
|---|---|---|
| **Supervised** | Learns from labelled data | House prices, spam filtering |
| **Unsupervised** | Finds groups or structure on its own | Customer segmentation |
| **Reinforcement** | Learns by trial, error and reward | Game-playing AI, robotics |

## 4. Overfitting: memorising instead of learning

Picture a student who memorised last year's exam answers without understanding the subject, then freezes on a new paper. That's **overfitting**: the model memorises its training data so well it can't generalise.

Common remedies:

- More, and more varied, data.
- A model that is only as complex as it needs to be.
- Always test on data the model has **never seen**.

## 5. Evaluate properly

Data is usually split three ways:

- **Train (70%)**: for learning.
- **Validation (15%)**: for tuning.
- **Test (15%)**: used once at the end, like a real exam.

Don't rely on **accuracy** alone. In fraud detection, where 99% of transactions are legitimate, a model that always says "legit" scores 99% and is useless. Look at *precision* and *recall* too.

## Next steps

To get hands-on, try **scikit-learn** (Python) with its built-in sample datasets. About ten lines of code will train your first model.
