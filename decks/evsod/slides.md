---
theme: hbu
# some information about your slides (markdown enabled)
title: "Event-based Tiny Object Detection: A Benchmark Dataset and Baseline"

# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left

comark: true
# duration of the presentation
duration: 35min
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: "light"
---

[ICCV 2025](https://iccv.thecvf.com/virtual/2025/poster/2540)

---
layout: section
transition: fade
---

# Outline

<Outline/>

---
layout: section
transition: slide-down
---

# Abstract & Conclusion & Contribution

## 问题

- 因为无人机尺寸极小，背景复杂，所以小目标检测在**反无人机**任务中极具挑战
- 传统的**帧式相机**帧率低、动态范围有限、数据冗余，不适配反无人机小目标检测
- **事件相机**：`microsecond temporal resolution`、`high dynamic range`


## 方案

1. **EV-UAV数据集**：构建了首个大规模、多样性的基于事件相机的反无人机小目标检测数据集
2. **EV-SpSegNet**：观察到微小目标在时空事件点云中形成连续曲线，提出了：基于事件的稀疏分割网络
3. **STC**: 设计了时空相关性损失函数

---

# Event-Based Camera

- 事件相机是一种受生物视觉启发的传感器，能够以微秒级时间分辨率（≥10⁶赫兹）和高动态范围（120 分贝）异步捕捉每个像素的亮度变化，每个像素都会独立地对光强变化做出响应
- 当亮度的对数值变化达到阈值时，触发事件：`E=(x,y,t,p)`，将运动信息编码为稀疏的时空事件流

<figure>
  <figcaption>Event Camera vs Frame Camera</figcaption>
  <img src="./assets/vs.png" />
</figure>

<Remark text="x,y表示像素坐标，t表示时间戳，p表示亮度变化的正负"/>

---
transition: slide-up
---

# EV-UAV Dataset

- 捕获动作：前后移动、横向移动、升降以及复杂组合
- 环境：正常、强光、弱光以及多种背景
- 147段数据序列精细标注，超过2030万个目标事件


<figure>
  <figcaption>Event Camera vs Frame Camera</figcaption>
  <img src="./assets/dataset.png" />
</figure>

---

# Annotation

> 把零散的三维事件流先拼成二维帧标框，再把框连成三维时空块，给每个事件点打上 “目标 / 背景” 标签，完成事件级标注

<figure>
  <figcaption>Event Annotation</figcaption>
  <img src="./assets/annotation.png" />
</figure>

<Remark text="二维红色框表示无人机位置，三维红色方框表示无人机在这段时间内所有运动轨迹上的事件点"/>

---

# Dataset Example

```text
uv run scripts/inspect_npz.py /data/ev-uav/train/train_000.npz
file: /data/ev-uav/train/train_000.npz
keys: evs_norm, ev_loc, ev

[evs_norm columns]
  0:x_norm 1:y_norm 2:t_norm 3:polarity 4:label 5:target_id
  label counts: {0: 36379, 1: 2790}
  nonzero target ids: [(1, 2790)]

[evs_norm]
  shape: (39169, 6):
[[0.215909 0.784722 0.       1.       1.       1.      ]
 [0.639205 0.017361 0.001276 1.       0.       0.      ]]

[ev_loc]
  shape: (39169, 3)
  first 5 row(s):
[[ 76 226   0] [ 76 224   0] [ 75 224   1] [ 77 224   1] [225   5  10]]

[ev]
  shape: (39169,)
  dtype: [('x', '<i2'), ('y', '<i2'), ('t', '<f8'), ('p', 'i1'), ('label', 'i1'), ('name', 'i1')]
  first 5 row(s):
[( 76, 226,  0.   , 1, 1, 1) ( 76, 224,  0.166, 0, 1, 1) ( 75, 224,  1.108, 0, 1, 1) ( 77, 224,  1.613, 0, 1, 1) (225,   5, 10.453, 1, 0, 0)]
```

---

# Method

- 通过**分组空洞稀疏卷积**模块捕获局部多尺度特征
- 利用**块注意力**实现跨块的全局特征交互
- 即解决了传统感受野受限的卷积操作无法有效捕捉全局特征的问题，又解决了普通注意力处理大规模事件数据计算量太大的问题，可以很好的区分目标和背景噪声

<div class="flex flex-row">
    <figure>
        <img src="./assets/model.png" class="w-400"/>
        <figcaption>EV-SpSegNet Architecture</figcaption>
        <figcaption>GDSCA(Grouped Dilated Sparse Convolution Attention)</figcaption>
    </figure>
    <ul>
       <li style="font-size: 0.8em">
         Voxelization：将事件点云划分为固定大小的体素网格，形成稀疏的三维体素表示（1 pixel × 1 pixel × 1ms）
       </li>
       <li style="font-size: 0.8em">
         Input-SpConv：使用稀疏卷积对体素化后的事件数据进行初始特征提取，只处理有事件的体素，减少计算量
       </li>
       <li style="font-size: 0.8em">
         编码器部分：(GDSCA+DownSample)*3
       </li>
       <li style="font-size: 0.8em">
         GDSCA 提取局部及多尺度时空特征：
         <ul>
           <li style="font-size: 0.8em">
             Grouped：将通道分为多组，使不同分支学习不同尺度的时空特征
           </li>
           <li style="font-size: 0.8em">
             Dilated Sparse Convolution：通过不同膨胀率的稀疏卷积观察不同距离的邻居，用于捕捉目标事件形成的连续轨迹结构
           </li>
           <li style="font-size: 0.8em">
             Sp-SE：对不同通道的重要性进行建模，增强与目标轨迹相关的特征，抑制背景和噪声特征</li>
           <li style="font-size: 0.8em">
             Patch Attention：在局部 patch 之间建立全局上下文关系，帮助模型区分目标运动轨迹和复杂背景。
           </li>
         </ul>
       </li>
       <li style="font-size: 0.8em">解码器部分：(UpSample+GDSCA)*3</li>
       <li style="font-size: 0.8em">
         跳跃连接：图中的 C 表示 Concatenate，将编码器中的浅层细节特征与解码器中的深层语义特征拼接，既保留小目标的细节位置，又利用高层运动语义。
       </li>
     </ul>
</div>



---
layout: section
---

<script setup>
const bce = String.raw`
L_{BCE}(p,y)=\begin{cases}\log(p), & y=1 \\-\log(1-p), 
& y=0\end{cases}
`
const stc = String.raw`
L_{STC}(p,y)=\begin{cases}
-w_{stc}^{\gamma}\log(p), & y=1 \\
-(1-w_{stc})^{\gamma}\log(1-p), & y=0
\end{cases}
`

const w = String.raw`
{w_{stc}}(p) = sigmoid(\sum\limits_{{e^j} \in {V^{k\tau }}} {{p^j}} )
`

</script>

# Loss

<figure>
    <img src="./assets/loss2.jpg" class="w-168" style="margin-top: -60px"/>
    <figcaption>high-confidence supporting events:p1</figcaption>
    <figcaption>isolated noise:p2</figcaption>

</figure>

<div class="flex flex-row items-start justify-between gap-10">
    <div class="w-1/2">
        <h2 style="text-align:center">BCE(binary cross-entropy)</h2>
        <MathBlock :formula="bce" />
    </div>
    <div class="w-1/2">
        <h2 style="text-align:center">STC(spatiotemporal correlation loss)</h2>
        <MathBlock :formula="stc"/>
        <MathBlock :formula="w"/>
        <MathBlock>
            V^{kt}表示 临近事件点的集合，k*k*t
        </MathBlock>
    </div>
</div>

---
src: ./experiment.md
transition: slide-right
layout: two-cols
---


---
layout: statement
---

# Limitations

事件相机仅能捕捉运动信息，所以当**目标静止或移动缓慢时**，事件相机不会输出任何信息，从而导致检测失败

---
layout: end
transition: fade-out
---

# Thanks
