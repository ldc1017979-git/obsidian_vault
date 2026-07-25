import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-v5',
    emptyOutDir: true,
    rollupOptions: {input: resolve(process.cwd(), 'prototype-v5.html')},
  },
});
