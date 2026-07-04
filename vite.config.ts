import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `--mode single` produces a fully self-contained dist/index.html
// (all JS/CSS inlined) suitable for hosting anywhere as one file.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: {
    target: 'es2022',
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    chunkSizeWarningLimit: 1200,
  },
}))
