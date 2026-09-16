import { defineConfig } from 'vite';

export default defineConfig({
  base: '/TeaTest/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
