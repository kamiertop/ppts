# Experiment

## 实验步骤

<div style="font-size: 0.72em; line-height: 1.4; margin-bottom: 6px;">
  <b>环境：</b>网络通畅 · NVIDIA 4070 · Fedora &nbsp;|&nbsp; 1h内完成，主要耗时在镜像下载
</div>

<div style="font-size: 0.75em; line-height: 1.45;">
  1. 下载数据集（Google Drive）(185MB)<br>
  2. 安装Docker<br>
  3. 配置NVIDIA Container Toolkit<br>
  4. 下载Docker镜像（12GB）<br>
  5. 下载代码<br>
  6. 修改配置文件<br>
  7. 挂载数据集与配置，启动容器<br>
  8. 进入容器，训练(15min)、测试
</div>

<hr style="margin: 12px 0; border-color: #888;" />

<h2> 自行部署，不依赖Docker </h2>

<div style="font-size: 0.75em; line-height: 1.45; margin-top:10px">
    1. 下载NVCC <br>
    2. 下载/编译合适版本的GCC/G++ <br>
    3. 编译CUDA算子 <br>
    4. 安装Python依赖 <br>
    5. 拉取依赖 <br>
    6. 使用内存缓存所有数据集，加速训练 <br>
</div>

::right::

## 效果对比

<table style="font-size: 0.58em; border-collapse: collapse; width: 100%; line-height: 1.5;">
<thead>
  <tr style="border-bottom: 2px solid #888;">
    <th style="text-align: left; padding: 1px 3px;">方法</th>
    <th style="text-align: center; padding: 1px 3px;">IoU (%) ↑</th>
    <th style="text-align: center; padding: 1px 3px;">ACC (%) ↑</th>
    <th style="text-align: center; padding: 1px 3px;">Pd (%) ↑</th>
    <th style="text-align: center; padding: 1px 3px;">Fa (10⁻⁴) ↓</th>
    <th style="text-align: center; padding: 1px 3px;">备注</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td style="padding: 1px 3px;">论文结果</td>
    <td style="text-align: center; color: green; padding: 1px 3px;">55.18</td>
    <td style="text-align: center; color: green; padding: 1px 3px;">65.02</td>
    <td style="text-align: center; color: green; padding: 1px 3px;">77.53</td>
    <td style="text-align: center; color: green; padding: 1px 3px;">1.63</td>
    <td style="text-align: center; padding: 1px 3px;">原文表格</td>
  </tr>
  <tr style="background: #ffffff08;">
    <td style="padding: 1px 3px;">复现结果-0</td>
    <td style="text-align: center; padding: 1px 3px;">54.09</td><td style="text-align: center; padding: 1px 3px;">68.76</td><td style="text-align: center; padding: 1px 3px;">78.23</td><td style="text-align: center; padding: 1px 3px;">2.85</td><td style="text-align: center; padding: 1px 3px;">Docker</td>
  </tr>
  <tr>
    <td style="padding: 1px 3px;">复现结果-1</td>
    <td style="text-align: center; padding: 1px 3px;">55.58</td><td style="text-align: center; padding: 1px 3px;">67.73</td><td style="text-align: center; padding: 1px 3px;">77.18</td><td style="text-align: center; padding: 1px 3px;">2.90</td><td style="text-align: center; padding: 1px 3px;">Docker</td>
  </tr>
  <tr style="background: #ffffff08;">
    <td style="padding: 1px 3px;">复现结果-2</td>
    <td style="text-align: center; padding: 1px 3px;">61.03</td><td style="text-align: center; padding: 1px 3px;">69.28</td><td style="text-align: center; padding: 1px 3px;">79.85</td><td style="text-align: center; padding: 1px 3px;">1.64</td><td style="text-align: center; padding: 1px 3px;">Docker</td>
  </tr>
  <tr>
    <td style="padding: 1px 3px;">复现结果-3</td>
    <td style="text-align: center; padding: 1px 3px;">56.56</td><td style="text-align: center; padding: 1px 3px;">68.88</td><td style="text-align: center; padding: 1px 3px;">77.74</td><td style="text-align: center; padding: 1px 3px;">3.4</td><td style="text-align: center; padding: 1px 3px;">Docker</td>
  </tr>
  <tr style="background: #ffffff08;">
    <td style="padding: 1px 3px;">复现结果-4</td>
    <td style="text-align: center; padding: 1px 3px;">58.43</td><td style="text-align: center; padding: 1px 3px;">67.84</td><td style="text-align: center; padding: 1px 3px;">78.46</td><td style="text-align: center; padding: 1px 3px;">1.30</td><td style="text-align: center; padding: 1px 3px;">预训练权重</td>
  </tr>
  <tr style="background: #44000022;">
    <td style="padding: 1px 3px;">复现结果-5</td>
    <td style="text-align: center; color: red; padding: 1px 3px;">60.33</td><td style="text-align: center; color: red; padding: 1px 3px;">71.06</td><td style="text-align: center; color: red; padding: 1px 3px;">79.47</td><td style="text-align: center; padding: 1px 3px;">2.01</td><td style="text-align: center; padding: 1px 3px;">本机部署</td>
  </tr>
  <tr style="background: #44000022;">
    <td style="padding: 1px 3px;">复现结果-6</td>
    <td style="text-align: center; color: red; padding: 1px 3px;">60.94</td><td style="text-align: center; color: red; padding: 1px 3px;">68.57</td><td style="text-align: center; color: red; padding: 1px 3px;">78.30</td><td style="text-align: center; color: red; padding: 1px 3px;">1.32</td><td style="text-align: center; padding: 1px 3px;">本机部署</td>
  </tr>
  <tr>
    <td style="padding: 1px 3px;">复现结果-7</td>
    <td style="text-align: center; padding: 1px 3px;">55.58</td><td style="text-align: center; padding: 1px 3px;">65.93</td><td style="text-align: center; padding: 1px 3px;">76.64</td><td style="text-align: center; padding: 1px 3px;">1.80</td><td style="text-align: center; padding: 1px 3px;">本机部署</td>
  </tr>
  <tr style="background: #44000022;">
    <td style="padding: 1px 3px;">复现结果-8</td>
    <td style="text-align: center; color: red; padding: 1px 3px;">64.41</td><td style="text-align: center; color: red; padding: 1px 3px;">71.69</td><td style="text-align: center; color: red; padding: 1px 3px;">80.47</td><td style="text-align: center; padding: 1px 3px;">2.7</td><td style="text-align: center; padding: 1px 3px;">4090</td>
  </tr>
  <tr style="background: #44000022;">
    <td style="padding: 1px 3px;">复现结果-9</td>
    <td style="text-align: center; color: red; padding: 1px 3px;">60.82</td><td style="text-align: center; color: red; padding: 1px 3px;">72.38</td><td style="text-align: center; color: red; padding: 1px 3px;">81.50</td><td style="text-align: center; padding: 1px 3px;">4.4</td><td style="text-align: center; padding: 1px 3px;">4090</td>
  </tr>
  <tr style="background: #44000022;">
    <td style="padding: 1px 3px;">复现结果-10</td>
    <td style="text-align: center; color: red; padding: 1px 3px;">58.98</td><td style="text-align: center; color: red; padding: 1px 3px;">71.04</td><td style="text-align: center; color: red; padding: 1px 3px;">81.27</td><td style="text-align: center; padding: 1px 3px;">3.33</td><td style="text-align: center; padding: 1px 3px;">4090</td>
  </tr>
  <tr>
    <td style="padding: 1px 3px;">复现结果-11</td>
    <td style="text-align: center; padding: 1px 3px;">43.17</td><td style="text-align: center; padding: 1px 3px;">70.31</td><td style="text-align: center; padding: 1px 3px;">78.50</td><td style="text-align: center; padding: 1px 3px;">26.72</td><td style="text-align: center; padding: 1px 3px;">4090</td>
  </tr>
  <tr style="background: #44000022;">
    <td style="padding: 1px 3px;">复现结果-12</td>
    <td style="text-align: center; color: red; padding: 1px 3px;">62.46</td><td style="text-align: center; color: red; padding: 1px 3px;">73.18</td><td style="text-align: center; color: red; padding: 1px 3px;">82.84</td><td style="text-align: center; padding: 1px 3px;">3.31</td><td style="text-align: center; padding: 1px 3px;">4090</td>
  </tr>
</tbody>
</table>

<div style="font-size: 0.52em; line-height: 1.25; margin-top: 4px; color: #ccc;">
  <b>IoU</b> 交集并集比 &nbsp; <b>ACC</b> 预测正确/真实目标总数 &nbsp; <b>Pd</b> 检测概率 &nbsp; <b>Fa</b> 误报率(10⁻⁴)
</div>
