import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/reactivity/reactive.ts'],
  target: 'esnext',
  format: ['esm', 'cjs', 'iife'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vue']
})
