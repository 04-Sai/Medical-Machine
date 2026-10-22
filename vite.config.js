import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base ensures asset links work on GitHub Pages subpaths, custom domains, and local preview
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
