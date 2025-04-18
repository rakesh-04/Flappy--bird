// filepath: c:\Users\user\Desktop\Flappy\flappy-bird\vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Flappy--bird/', // Replace with your repository name
  plugins: [react()],
  server: {
    open: true,
  },
  assetsInclude: ['**/*.mp3'], // Include .mp3 files as assets
});