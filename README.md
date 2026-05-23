# Slidev PPTs

这个仓库用于在一个 GitHub 仓库里管理多个 [Slidev](https://cn.sli.dev/) PPT，并通过 GitHub Pages 在线访问。

当前已经包含一个 PPT：

```text
decks/evsod/
```

部署后的访问路径一般是：

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
  }
}
```

新增 `decks/my-talk/slides.md`：

```md
---
theme: seriph
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

如果你使用自定义域名，并且希望从根路径访问，可以在构建时设置：

```bash
SITE_BASE=/ pnpm run build
```

如果新增 deck 后首页没有出现它，检查这个文件是否存在：

```text
decks/你的deck名/slides.md
```

构建脚本只会识别包含 `slides.md` 的目录。
