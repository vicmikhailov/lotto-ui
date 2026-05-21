import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const rootDir = process.cwd()
const distDir = resolve(rootDir, 'dist')
const releaseDir = resolve(rootDir, 'release')
const browserDir = resolve(releaseDir, 'browser')

await access(distDir).catch(() => {
  throw new Error('dist/ was not found. Run "npm run build" before packaging a release.')
})

await rm(browserDir, { recursive: true, force: true })
await mkdir(browserDir, { recursive: true })
await cp(distDir, browserDir, { recursive: true })

await writeFile(
  resolve(releaseDir, 'manifest.json'),
  `${JSON.stringify(
    {
      type: 'static-browser-app',
      entry: 'browser/index.html',
      notes: 'Serve the browser directory from any static host or open index.html directly in a browser.',
    },
    null,
    2,
  )}\n`,
)

console.log('Packaged static browser release in release/browser')
