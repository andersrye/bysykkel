import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//https://stackoverflow.com/a/67923998
function removeDataTestAttrs(node) {
  if (node.type === 1) {
    node.props = node.props.filter(prop =>
        !(prop.type === 6 && prop.name === 'data-test')
    )
  }
}
// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
  plugins: [vue({
    template: {
      compilerOptions: {
        nodeTransforms: mode === 'production' ? [removeDataTestAttrs] : [],
      },
    },
  })],
  base: '',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
}));
