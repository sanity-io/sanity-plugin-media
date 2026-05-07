import {defineConfig} from 'vitest/config'

export default defineConfig({
  esbuild: {
    jsx: 'automatic'
  },
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    passWithNoTests: false,
    css: true
  }
})
