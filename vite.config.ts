import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function getBase() {
  if (process.env.GITHUB_PAGES !== 'true') return '/'
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
  if (!repo || repo.endsWith('.github.io')) return '/'
  return `/${repo}/`
}

function spaFallback() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const indexPath = resolve('dist/index.html')
      if (!existsSync(indexPath)) return
      copyFileSync(indexPath, resolve('dist/404.html'))
      writeFileSync(resolve('dist/.nojekyll'), '')
    },
  }
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  base: getBase(),
})