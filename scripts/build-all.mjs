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
  const items = deckNames.map((name) => {
    const title = readTitle(join(decksDir, name, 'slides.md')) || name
    return `<li><a href="${base}${name}/">${escapeHtml(title)}</a><span>${escapeHtml(name)}</span></li>`
  }).join('\n')

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Slidev PPTs</title>
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
      width: min(880px, calc(100% - 40px));
      margin: 0 auto;
      padding: 56px 0;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 32px;
      line-height: 1.15;
    }
    p {
      margin: 0 0 28px;
      color: #5b6575;
    }
    ul {
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 20px;
      border: 1px solid #d8dde6;
      border-radius: 8px;
      background: #fff;
    }
    a {
      color: #1663d8;
      font-weight: 650;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    span {
      color: #687386;
      font-size: 14px;
      white-space: nowrap;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        background: #101418;
        color: #eef2f7;
      }
      p, span {
        color: #aab4c2;
      }
      li {
        border-color: #2e3744;
        background: #171d24;
      }
      a {
        color: #82b6ff;
      }
    }
  </style>
</head>
<body>
  <main>
    <h1>Slidev PPTs</h1>
    <p>当前仓库中的演示文稿列表。</p>
    <ul>
${items}
    </ul>
  </main>
</body>
</html>
`
}

function readTitle(file) {
  const source = readFileSync(file, 'utf8')
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)
  const fromFrontmatter = frontmatter?.[1].match(/^title:\s*(.+)$/m)?.[1]?.trim()
  if (fromFrontmatter) return fromFrontmatter.replace(/^['"]|['"]$/g, '')

  return source.match(/^#\s+(.+)$/m)?.[1]?.trim()
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
