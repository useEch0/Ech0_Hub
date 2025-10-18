import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    vueDevTools(), 
    UnoCSS(),
    // 自定义插件复制 hub.json
    {
      name: 'copy-hub-json',
      apply: 'build',
      generateBundle() {
        const hubJsonPath = path.resolve(__dirname, 'hub/hub.json')
        if (fs.existsSync(hubJsonPath)) {
          const jsonContent = fs.readFileSync(hubJsonPath, 'utf-8')
          this.emitFile({
            type: 'asset',
            fileName: 'hub.json',
            source: jsonContent
          })
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
