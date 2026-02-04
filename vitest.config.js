import { defineConfig } from 'vitest/config';
import js from '@eslint/js';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
  },
});
