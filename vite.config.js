import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'GemsFilter',
      fileName: 'gemsfilter',
      formats: ['iife']
    },
    outDir: 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'gemsfilter.[ext]'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  }
});
