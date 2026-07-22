/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import meticulous from '@alwaysmeticulous/recorder-plugin/vite'

const meticulousRecordingToken = process.env.VITE_METICULOUS_RECORDING_TOKEN

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Injects the Meticulous session recorder script tag during dev builds
    // so that engineer sessions get captured for replay-based testing. This
    // is a no-op (the plugin is simply omitted) until you set
    // VITE_METICULOUS_RECORDING_TOKEN, so the app runs fine out of the box.
    // See README.md > "Testing with Meticulous.ai" for setup instructions.
    meticulousRecordingToken ? meticulous({ recordingToken: meticulousRecordingToken }) : null,
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/test/**', 'src/main.tsx'],
    },
  },
})
