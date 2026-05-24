---
theme: ./
title: |-
  Event-based Tiny Object Detection:
  A Benchmark Dataset and Baseline
date: "2026-05-24"
---

Published in 2026

---
layout: section
---

# Outline

<Outline maxDepth="1" columns="2" />

---
layout: section
---

# Introduction

## Motivation

- Event-based tiny object detection is **difficult to compare** across datasets.
- A reusable theme should support title, evidence, and result pages.
- Section pages should carry content directly, not only divide chapters.

<div class="key-point-block">
  Key insight: event streams are sparse and asynchronous, requiring specialized detection pipelines.
</div>

## Related Work

Existing benchmarks<sup>1</sup> focus on frame-based detection, while event-based methods<sup>2</sup> are underexplored. Previous work H<sub>2</sub>O-Net uses a hybrid architecture.

<div class="callout">
  This work introduces the first standardized benchmark for event-based tiny object detection.
</div>

<Remark text="IEEE TCSVT, 2026" />

---
layout: two-cols
---

# Architecture Overview

## Encoder-Decoder Pipeline

- Sparse event representation via voxel grid
- Multi-scale feature pyramid
- Lightweight detection head

<div class="callout-warn">
  Voxel grid resolution is a critical hyperparameter — too coarse loses detail, too fine increases latency.
</div>

::right::

## Key Components

<figure>
  <img src="/hbu.png" />
  <figcaption>Fig. 1: Overall architecture of the proposed method.</figcaption>
</figure>

| Component | FLOPs | Params |
| --------- | ----: | -----: |
| Encoder   |  2.4G |   3.1M |
| Neck      |  1.8G |   2.6M |
| Head      |  0.6G |   1.2M |

---
layout: two-rows
---

# Benchmark Results

## Comparison with State-of-the-Art

| Method   |      mAP | AP<sub>S</sub> | AP<sub>M</sub> | FPS |
| -------- | -------: | -------------: | -------------: | --: |
| RED      |     32.1 |           18.4 |           38.7 |  82 |
| RVT      |     34.8 |           20.1 |           41.3 |  71 |
| **Ours** | **41.6** |       **26.8** |       **49.2** |  64 |

<span class="key-point">Our method achieves +6.8 mAP over the strongest baseline.</span>

::bottom::

## Ablation Study

| Variant       | Precision |   Recall |
| ------------- | --------: | -------: |
| Events only   |      72.4 |     68.1 |
| Frames only   |      75.2 |     70.6 |
| Fusion (Ours) |  **81.5** | **76.9** |

---
layout: image-right
image: /hbu.png
---

# Qualitative Results

- Place method diagrams, framework figures, or qualitative results on the right.
- Keep the explanation compact and readable on the left.
- The image uses `contain` by default to avoid cropping.

<div class="callout-good">
  Our method consistently detects tiny objects (< 16×16 px) that baselines miss entirely.
</div>

<Remark text="Qualitative comparison on Gen1 dataset" />

---
layout: section
---

# Our method sets a new state-of-the-art on event-based tiny object detection

The first standardized benchmark with 41.6 mAP

---
layout: fact
---

# 41.6

## mAP on Gen1 Benchmark

+6.8 over the previous best method

---
layout: section
---

# Conclusion

## Summary

- Introduced the first **standardized benchmark** for event-based tiny object detection.
- Proposed a **multi-scale fusion architecture** achieving 41.6 mAP.
- Extensive ablations validate each design choice.

## Future Work

- Extend to **neuromorphic temporal data**.
- Explore **self-supervised pre-training** for event streams.

<Remark text="Thank you for listening" />

---
layout: team
---

# Contributors

<div class="hbu-team-grid">
  <div class="hbu-team-member">
    <strong>Zhang San</strong>
    <span>Algorithm Design</span>
  </div>
  <div class="hbu-team-member">
    <strong>Li Si</strong>
    <span>Experiments</span>
  </div>
  <div class="hbu-team-member">
    <strong>Wang Wu</strong>
    <span>Data Collection</span>
  </div>
  <div class="hbu-team-member">
    <strong>Prof. Zhao</strong>
    <span>Advisor</span>
  </div>
</div>

---
layout: refs
---

# References

1. Rebecq et al., "Event-based Vision: A Survey," _IEEE TPAMI_, 2024.
2. Gehrig et al., "RVT: Recurrent Vision Transformers for Object Detection with Event Cameras," _CVPR_, 2025.
3. Zhang et al., "H<sub>2</sub>O-Net: A Hybrid Architecture for Frame-Event Fusion," _ECCV_, 2025.
4. Perot et al., "RED: Recurrent Event Detector," _ICCV_, 2023.

---
layout: end
---
# Thanks

Questions & Discussion
