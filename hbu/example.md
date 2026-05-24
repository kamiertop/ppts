---
theme: ./
title: "Event-based Tiny Object Detection: A Benchmark Dataset and Baseline"
---

IEEE Transactions on Circuits and Systems for Video Technology

Published in 2026


---
layout: section
remark: "测试remark"
---

# Introduction

## Motivation

- Event-based tiny object detection is difficult to compare across datasets.
- A reusable theme should support title, evidence, and result pages.
- Section pages should carry content directly, not only divide chapters.

---

# What is Slidev?

Slidev is a slide maker and presentation tool designed for developers. It includes the following features:

- **Text-based** - focus on content with Markdown, then style it later.
- **Themable** - themes can be shared and reused.
- **Developer Friendly** - code highlighting, live coding, and components.
- **Portable** - export to PDF, PPTX, PNGs, or a static site.

<Remark text="what is slidev"/>

---
layout: section
---

# Method

## Theme structure

- Use `cover` for paper metadata.
- Use `section` for chapter title plus content.
- Use `two-cols`, `statement`, and `fact` for common paper presentation patterns.

<Remark text="method"/>

---
layout: two-cols
---

# Two-column Evidence


- Event streams are sparse and asynchronous.
- Tiny objects require dense local evidence.
- Benchmarks need consistent evaluation.

::right::

# Results

> A reusable layout should make comparison and explanation fast.

| Method | mAP | FPS |
| --- | ---: | ---: |
| Baseline | 34.2 | 78 |
| Ours | 41.6 | 64 |

---
layout: two-rows
---

# Two-row Layout

## Top explanation

Use the upper region for the key message, assumptions, or short derivation.

::bottom::

| Variant | Precision | Recall |
| --- | ---: | ---: |
| Events only | 72.4 | 68.1 |
| Frames only | 75.2 | 70.6 |
| Fusion | 81.5 | 76.9 |

---
layout: image-right
image: /hbu.png
backgroundSize: contain
---

# Image-right Layout

- Place method diagrams, framework figures, or qualitative results on the right.
- Keep the explanation compact and readable on the left.
- The image uses `contain` by default to avoid cropping.

---
layout: end
---

# Thanks

Questions & Discussion
