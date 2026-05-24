# Slidev PPTs

这个仓库用于在一个 GitHub 仓库里管理多个 [Slidev](https://cn.sli.dev/) PPT，并通过 GitHub Pages 在线访问。

当前已经包含一个 PPT：

```text
decks/evsod/
```

当前部署使用独立自定义域名：

```text
https://slides.kamier.top/
https://slides.kamier.top/evsod/
```

如果不配置独立自定义域名，GitHub Pages 的默认访问路径一般是：

```text
https://你的用户名.github.io/仓库名/
https://你的用户名.github.io/仓库名/evsod/
```

## 实现思路

GitHub Pages 发布的是静态文件。Slidev 可以把 `slides.md` 构建成静态站点，所以这个仓库做了三件事：

1. 把每个 PPT 放到 `decks/` 下的独立目录中。
2. 用 `scripts/build-all.mjs` 自动扫描 `decks/*/slides.md`，逐个构建。
3. 把所有构建结果汇总到根目录 `dist/`，再由 GitHub Actions 发布到 GitHub Pages。

例如：

```text
decks/evsod/slides.md
```

会构建成：

```text
dist/evsod/index.html
```

首页会自动生成：

```text
dist/index.html
```

## 目录结构

```text
.
├── .github/workflows/pages.yml   # GitHub Pages 自动部署
├── decks/                        # 所有 Slidev PPT
│   └── evsod/
│       ├── slides.md             # PPT 内容
│       ├── package.json          # 这个 PPT 的本地命令
│       ├── components/           # 可选：Vue 组件
│       ├── pages/                # 可选：拆分页面
│       └── snippets/             # 可选：代码片段
├── hbu/                          # 本仓库维护的 Slidev 主题
├── scripts/build-all.mjs         # 构建所有 PPT
├── package.json                  # 根项目脚本和依赖
├── pnpm-workspace.yaml           # pnpm workspace 配置
└── pnpm-lock.yaml                # 锁定依赖版本
```

`dist/` 和 `node_modules/` 是生成目录，不需要提交到 Git。

## 环境要求

建议使用：

```text
Node.js 22+
pnpm 10+
```

本仓库在 `package.json` 中通过 `packageManager` 固定 pnpm 版本：

```json
"packageManager": "pnpm@10.25.0"
```

GitHub Actions 会读取这个版本，因此不要在 `.github/workflows/pages.yml` 里再额外配置 pnpm 的 `version`，否则会出现多个 pnpm 版本声明冲突。

如果本机没有 pnpm，可以先启用 Corepack：

```bash
corepack enable
corepack prepare pnpm@10 --activate
```

## 安装依赖

在仓库根目录执行：

```bash
pnpm install
```

以后拉取仓库后，也是在根目录执行这条命令。

## 本地预览

预览现有的 `evsod`：

```bash
pnpm run dev:evsod
```

默认会打开：

```text
http://localhost:3030
```

如果新增了一个 PPT，例如 `decks/my-talk/`，可以这样预览：

```bash
pnpm --dir decks/my-talk run dev
```

## 构建所有 PPT

本地构建：

```bash
pnpm run build:local
```

构建后会生成：

```text
dist/
├── index.html
└── evsod/
    └── index.html
```

`build:local` 默认假设仓库名是 `ppts`，所以生成的资源路径会带：

```text
/ppts/
```

如果你的 GitHub 仓库名不是 `ppts`，本地测试时可以指定：

```bash
REPOSITORY_NAME=你的仓库名 pnpm run build
```

GitHub Actions 里不需要手动指定，脚本会自动从 GitHub 环境变量读取仓库名。

当前线上部署使用 `slides.kamier.top` 作为独立自定义域名，所以 GitHub Actions 会设置：

```yaml
SITE_BASE: /
CUSTOM_DOMAIN: slides.kamier.top
```

这会让线上构建结果使用根路径：

```text
/
/evsod/
```

如果要在本地模拟自定义域名构建，可以执行：

```bash
pnpm run build:custom-domain
```

这会额外生成：

```text
dist/CNAME
```

## 添加一个新的 PPT

创建新目录：

```bash
mkdir -p decks/my-talk
```

新增 `decks/my-talk/package.json`：

```json
{
  "name": "my-talk",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "slidev --open",
    "build": "slidev build",
    "export": "slidev export"
  },
  "dependencies": {
    "slidev-theme-hbu": "workspace:*"
  }
}
```

新增 `decks/my-talk/slides.md`：

```md
---
theme: hbu
title: My Talk
---

# My Talk

第一页内容

---

# 第二页

更多内容
```

本地预览：

```bash
pnpm --dir decks/my-talk run dev
```

构建全部 PPT：

```bash
pnpm run build:local
```

部署后访问：

```text
https://你的用户名.github.io/仓库名/my-talk/
```

## 使用 HBU 主题

本仓库自带一个本地 Slidev 主题：

```text
hbu/
```

主题包名是：

```text
slidev-theme-hbu
```

在 `slides.md` 中可以简写为：

```md
---
theme: hbu
---
```

### 在本仓库中新建 PPT

如果新 PPT 放在 `decks/` 下，例如：

```text
decks/my-talk/
```

只需要在这个 deck 的 `package.json` 中依赖本地主题：

```json
{
  "name": "my-talk",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "slidev --open",
    "build": "slidev build",
    "export": "slidev export"
  },
  "dependencies": {
    "slidev-theme-hbu": "workspace:*"
  }
}
```

然后在 `slides.md` 顶部写：

```md
---
theme: hbu
title: My Talk
---
```

在仓库根目录安装依赖：

```bash
pnpm install
```

预览：

```bash
pnpm --dir decks/my-talk dev
```

### 在新的同类仓库中复用

如果你复制这个仓库结构到一个新项目，记得同时复制：

```text
hbu/
```

并让 `pnpm-workspace.yaml` 包含主题目录：

```yaml
packages:
  - "decks/*"
  - "hbu"

shamefullyHoist: true
```

然后新 deck 按上一节添加：

```json
"dependencies": {
  "slidev-theme-hbu": "workspace:*"
}
```

`slides.md` 使用：

```md
---
theme: hbu
---
```

### 全部布局

HBU 主题提供 12 种布局：

#### `cover`（封面，默认第一页）

```yaml
---
title: "Paper Title"
presenter: "Zhang San"
affiliation: "Hebei University"
date: "2026-05-24"
---
```

封面自动显示打字机标题。`title` 支持 YAML 多行断行：

```yaml
title: |-
  Event-based Tiny Object Detection:
  A Benchmark Dataset and Baseline
```

冒号处即断行位置。`presenter`、`affiliation`、`date` 均为可选。

#### `section`

```yaml
---
layout: section
---
# Chapter Title

## Subtitle

正文内容……
```

章节分隔页，标题带下划线。内容直接跟在标题后面。

#### `default`

不带 `layout` 时默认使用，标题在顶部、下划线、正文在下。

#### `two-cols`

```yaml
---
layout: two-cols
---
# Title

左侧内容

::right::

右侧内容
```

左右两栏，`::right::` 分隔。

#### `two-rows`

```yaml
---
layout: two-rows
---
# Title

上方内容

::bottom::

下方内容
```

上下布局，`::bottom::` 分隔。下方区域有浅蓝背景。

#### `image-right` / `image-left`

```yaml
---
layout: image-right
image: /path/to/image.png
backgroundSize: contain
---
# Title

左侧文字说明
```

文字 + 图片并排。`image-left` 反之。

#### `statement`

```yaml
---
layout: statement
---
# 核心结论

一句话支撑说明
```

居中大字声明，标题下方有装饰线。

#### `fact`

```yaml
---
layout: fact
---
# 41.6
## mAP on Benchmark

一句话说明
```

大数字强调页，适合展示关键指标。

#### `intro`

```yaml
---
layout: intro
---
# Title

Subtitle or abstract
```

居中介绍页。

#### `team`

```yaml
---
layout: team
---
# Contributors

<div class="hbu-team-grid">
  <div class="hbu-team-member">
    <strong>Name</strong>
    <span>Role</span>
  </div>
</div>
```

团队成员 / 贡献者列表。

#### `refs`

```yaml
---
layout: refs
---
# References

1. Author, "Title," *Venue*, Year.
```

参考文献页，小字号紧凑排版。

#### `end`

```yaml
---
layout: end
---
# Thanks

Questions & Discussion
```

结尾致谢页。

### frontmatter 字段

| 字段 | 说明 | 适用 |
|---|---|---|
| `title` | 论文标题（封面打字机） | cover |
| `presenter` | 汇报人姓名 | cover |
| `affiliation` | 单位 | cover |
| `date` | 日期（左下角） | cover |
| `remark` | 页脚居中备注 | 任意页 |
| `section` | 已移除，不再使用 | — |

### 内联组件

`<Remark text="..." />` — 在正文中直接写，效果等同 frontmatter `remark`，优先级更高。

### 自定义 CSS 类

**提示框：**

```html
<div class="callout">默认（蓝色）提示</div>
<div class="callout-warn">警告（黄色）提示</div>
<div class="callout-good">正面（绿色）提示</div>
```

**关键结论：**

```html
<span class="key-point">行内高亮，带下划线</span>

<div class="key-point-block">
  块级高亮，带蓝色左边框
</div>
```

**表格增强：**

```html
<!-- 高亮行 -->
<tr class="hl-row">

<!-- 最佳结果单元格 -->
<td class="best">41.6</td>
```

表格自动斑马纹（偶数行浅灰背景）。

**图片标题：**

```html
<figure>
  <img src="/fig.png" />
  <figcaption>Fig. 1: Architecture overview.</figcaption>
</figure>
```

**上下标：**

```md
E = mc<sup>2</sup>
H<sub>2</sub>O
```

### 目录

```md
---
layout: section
---
# Outline

<Outline maxDepth="1" />
```

`maxDepth` 控制层级深度，`1` 表示只显示一级标题。

### 全局特性

- **进度条**：页面顶部的蓝色细线，自动反映汇报进度
- **页码**：右下角 `当前页 / 总页数`，封面和结尾页不显示
- **LOGO**：仅在封面右上角显示
- **打字机效果**：封面标题逐字出现，`speed` 和 `startDelay` 在 `TypewriterTitle.vue` 中可调

## GitHub Pages 部署

这个仓库已经包含 GitHub Actions 配置：

```text
.github/workflows/pages.yml
```

它会在推送到 `main` 分支时自动执行：

```bash
pnpm install --frozen-lockfile
pnpm run build
```

然后把 `dist/` 发布到 GitHub Pages。

第一次使用时，需要在 GitHub 仓库页面开启 Pages：

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

如果没有做这一步，Actions 里的 `Configure GitHub Pages` 可能会报：

```text
Get Pages site failed
HttpError: Not Found
```

这表示 GitHub Pages 站点还没有启用，进入上面的设置页面把 Source 改成 `GitHub Actions` 后重新运行 workflow 即可。

workflow 顶部设置了：

```yaml
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
  SITE_BASE: /
  CUSTOM_DOMAIN: slides.kamier.top
```

`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` 是为了让 GitHub Actions 里的 JavaScript action 使用 Node.js 24 runtime，避免 GitHub 对 Node.js 20 action runtime 的弃用警告。项目自身构建使用的 Node 版本仍然由 `actions/setup-node` 的 `node-version` 控制。

`SITE_BASE=/` 表示这个仓库使用独立自定义域名，从域名根路径访问。`CUSTOM_DOMAIN=slides.kamier.top` 会在构建产物里生成 `CNAME` 文件。

workflow 中的 action 使用当前可用的最新主版本，例如：

```yaml
actions/checkout@v6
actions/setup-node@v6
pnpm/action-setup@v6
actions/configure-pages@v6
actions/upload-pages-artifact@v5
actions/deploy-pages@v4
```

这里不写 `@latest`，因为很多 GitHub Action 并不提供稳定的 `latest` tag。使用最新主版本 tag 可以继续接收该主版本下的补丁更新，同时避免引用不存在的 tag。

然后推送代码：

```bash
git add .
git commit -m "setup multi slidev decks"
git branch -M main
git remote add origin git@github.com:你的用户名/仓库名.git
git push -u origin main
```

推送后进入 GitHub 仓库的 `Actions` 页面，等待 `Deploy Slidev PPTs` 工作流完成。

## 从零重新创建一个同类项目

如果以后要新建一个同样结构的仓库，可以按下面步骤做。

创建仓库目录：

```bash
mkdir ppts
cd ppts
git init
```

创建目录：

```bash
mkdir -p decks/demo scripts .github/workflows
```

创建根目录 `package.json`：

```json
{
  "name": "ppts",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "node scripts/build-all.mjs",
    "build:local": "REPOSITORY_NAME=ppts node scripts/build-all.mjs",
    "build:custom-domain": "SITE_BASE=/ CUSTOM_DOMAIN=slides.kamier.top node scripts/build-all.mjs",
    "dev:demo": "pnpm --dir decks/demo dev"
  },
  "devDependencies": {
    "@slidev/cli": "^52.15.2",
    "@slidev/theme-default": "latest",
    "@slidev/theme-seriph": "latest",
    "vue": "^3.5.33"
  },
  "packageManager": "pnpm@10.25.0"
}
```

创建 `pnpm-workspace.yaml`：

```yaml
packages:
  - "decks/*"

shamefullyHoist: true
```

创建 `.gitignore`：

```gitignore
node_modules
dist
.DS_Store
*.local
.vite-inspect
.remote-assets
components.d.ts
```

创建一个 PPT：

```json
{
  "name": "demo",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "slidev --open",
    "build": "slidev build",
    "export": "slidev export"
  }
}
```

上面这段保存到：

```text
decks/demo/package.json
```

再创建：

```text
decks/demo/slides.md
```

内容示例：

```md
---
theme: seriph
title: Demo
---

# Demo

Hello Slidev
```

复制或编写 `scripts/build-all.mjs`，核心逻辑是：

1. 扫描 `decks/*/slides.md`
2. 对每个 deck 执行 `slidev build --base /仓库名/deck名/ --out dist/deck名`
3. 生成 `dist/index.html`

如果使用独立自定义域名，则把 `SITE_BASE` 设置为 `/`，构建路径会变成 `/deck名/`。

当前仓库已经有完整实现，可以直接复用：

```text
scripts/build-all.mjs
```

安装并构建：

```bash
pnpm install
pnpm run build:local
```

再添加 `.github/workflows/pages.yml`，可以直接复用当前仓库里的文件。

## 常见问题

如果 GitHub Pages 打开后样式或 JS 404，通常是 `base` 路径不对。这个项目的构建脚本会自动使用仓库名作为 base：

```text
/仓库名/deck名/
```

如果你使用独立自定义域名，并且希望从根路径访问，可以在构建时设置：

```bash
SITE_BASE=/ pnpm run build
```

如果还想让构建产物包含 GitHub Pages 需要的 `CNAME` 文件，可以设置：

```bash
SITE_BASE=/ CUSTOM_DOMAIN=slides.kamier.top pnpm run build
```

如果新增 deck 后首页没有出现它，检查这个文件是否存在：

```text
decks/你的deck名/slides.md
```

构建脚本只会识别包含 `slides.md` 的目录。
