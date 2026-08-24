import { copyFileSync, cpSync, existsSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const projectRoot = dirname(fileURLToPath(import.meta.url))

function getBase() {
  if (process.env.GITHUB_PAGES !== 'true') return '/'
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
  if (!repo || repo.endsWith('.github.io')) return '/'
  return `/${repo}/`
}

function githubPagesStatic() {
  return {
    name: 'github-pages-static',
    closeBundle() {
      const distDir = resolve(projectRoot, 'dist')
      const indexPath = resolve(distDir, 'index.html')
      if (!existsSync(indexPath)) return

      copyFileSync(indexPath, resolve(distDir, '404.html'))
      writeFileSync(resolve(distDir, '.nojekyll'), '')

      // username.github.io Pages is publishing from the branch root, which
      // cannot execute TypeScript. Copy the compiled site next to the source.
      copyFileSync(indexPath, resolve(projectRoot, 'index.html'))
      copyFileSync(resolve(distDir, '404.html'), resolve(projectRoot, '404.html'))
      writeFileSync(resolve(projectRoot, '.nojekyll'), '')

      const copyDir = (name: string) => {
        const from = resolve(distDir, name)
        const to = resolve(projectRoot, name)
        if (!existsSync(from)) return
        rmSync(to, { recursive: true, force: true })
        cpSync(from, to, { recursive: true })
      }
      copyDir('assets')
      copyDir('brand')

      const favicon = resolve(distDir, 'favicon.svg')
      if (existsSync(favicon)) {
        copyFileSync(favicon, resolve(projectRoot, 'favicon.svg'))
      }
    },
  }
}

export default defineConfig({
  root: resolve(projectRoot, 'src'),
  publicDir: resolve(projectRoot, 'public'),
  envDir: projectRoot,
  plugins: [react(), githubPagesStatic()],
  base: getBase(),
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
  },
})
