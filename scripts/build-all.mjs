import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(new URL('..', import.meta.url).pathname)
const decksDir = join(root, 'decks')
const distDir = join(root, 'dist')
const repositoryName = process.env.REPOSITORY_NAME || process.env.GITHUB_REPOSITORY?.split('/')[1] || basename(root)
const siteBase = normalizeBase(process.env.SITE_BASE || `/${repositoryName}/`)
const customDomain = process.env.CUSTOM_DOMAIN?.trim()

const decks = readdirSync(decksDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => existsSync(join(decksDir, name, 'slides.md')))
  .sort()

if (decks.length === 0) {
  throw new Error(`No Slidev decks found in ${decksDir}`)
}

rmSync(distDir, { recursive: true, force: true })
mkdirSync(distDir, { recursive: true })

for (const deck of decks) {
  const deckDir = join(decksDir, deck)
  const outDir = join(distDir, deck)
  const base = `${siteBase}${deck}/`

  console.log(`Building ${deck} with base ${base}`)
  const result = spawnSync(
    'pnpm',
    ['exec', 'slidev', 'build', '--base', base, '--out', outDir],
    { cwd: deckDir, stdio: 'inherit' },
  )

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

writeFileSync(join(distDir, 'index.html'), renderIndex(decks, siteBase))

if (customDomain) {
  writeFileSync(join(distDir, 'CNAME'), `${customDomain}\n`)
}

function renderIndex(deckNames, base) {
  const decks = deckNames.map((name) => {
    const metadata = readDeckMetadata(join(decksDir, name, 'slides.md'))
    return {
      name,
      title: metadata.title || name,
      info: metadata.info || '',
      duration: metadata.duration || '',
      updatedAt: metadata.updatedAt,
      href: `${base}${name}/`,
    }
  })

  const items = decks.map((deck) => {
    const details = [
      deck.duration ? `<span>${escapeHtml(deck.duration)}</span>` : '',
      deck.updatedAt ? `<span>Updated ${escapeHtml(deck.updatedAt)}</span>` : '',
    ].filter(Boolean).join('')

    return `<li>
      <a href="${deck.href}" aria-label="打开 ${escapeHtml(deck.title)}">
        <strong>${escapeHtml(deck.title)}</strong>
        ${deck.info ? `<p>${escapeHtml(deck.info)}</p>` : ''}
        <div>${details}<span>${escapeHtml(deck.name)}</span></div>
      </a>
    </li>`
  }).join('\n')

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Slides</title>
  <style>
    :root {
      color-scheme: light dark;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f6f7f9;
      color: #1d2430;
    }
    body {
      margin: 0;
      min-height: 100vh;
    }
    main {
      width: min(980px, calc(100% - 40px));
      margin: 0 auto;
      padding: 64px 0;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 38px;
      line-height: 1.15;
    }
    .lead {
      margin: 0 0 34px;
      color: #5b6575;
      line-height: 1.7;
    }
    ul {
      display: grid;
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      border: 1px solid #d8dde6;
      border-radius: 8px;
      background: #fff;
    }
    a {
      display: block;
      padding: 20px 22px;
      color: inherit;
      text-decoration: none;
    }
    a:hover strong {
      color: #1663d8;
    }
    strong {
      display: block;
      font-size: 19px;
      line-height: 1.35;
    }
    li p {
      margin: 8px 0 0;
      color: #5b6575;
      line-height: 1.55;
    }
    div {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }
    span {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 0 9px;
      border: 1px solid #d8dde6;
      border-radius: 999px;
      color: #687386;
      font-size: 14px;
      background: #f8fafc;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        background: #101418;
        color: #eef2f7;
      }
      .lead, li p, span {
        color: #aab4c2;
      }
      li {
        border-color: #2e3744;
        background: #171d24;
      }
      a:hover strong {
        color: #82b6ff;
      }
      span {
        border-color: #2e3744;
        background: #121820;
      }
    }
  </style>
</head>
<body>
  <main>
    <h1>Slides</h1>
    <p class="lead">当前共有 ${decks.length} 个演示文稿。选择一个标题进入播放页面。</p>
    <ul>
${items}
    </ul>
  </main>
</body>
</html>
`
}

function readDeckMetadata(file) {
  const source = readFileSync(file, 'utf8')
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)
  const title = readFrontmatterValue(frontmatter?.[1], 'title') || source.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const info = readInfo(frontmatter?.[1])
  const duration = readFrontmatterValue(frontmatter?.[1], 'duration')

  return {
    title,
    info,
    duration,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function normalizeBase(value) {
  return `/${value}/`.replace(/^\/+/, '/').replace(/\/+$/, '/')
}

function readFrontmatterValue(frontmatter, key) {
  const value = frontmatter?.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim()
  return value?.replace(/^['"]|['"]$/g, '')
}

function readInfo(frontmatter) {
  const block = frontmatter?.match(/^info:\s*\|\n((?:\s{2,}.+\n?)*)/m)?.[1]
  if (!block) return ''

  return block
    .split('\n')
    .map((line) => line.replace(/^ {2}/, '').trim())
    .filter((line) => line && !line.startsWith('#'))
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .slice(0, 180)
}
