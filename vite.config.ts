import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 4200
  }
});
