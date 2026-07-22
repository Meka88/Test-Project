/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import meticulous from '@alwaysmeticulous/recorder-plugin/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // IMPORTANT: Vite does NOT load .env files into process.env when evaluating
  // this config file, so reading process.env.VITE_* here would miss values set
  // in .env.local. Use loadEnv to read the .env files explicitly. loadEnv also
  // merges in matching process.env vars, so values provided by CI/the shell
  // (e.g. VITE_BASE_PATH) keep working too.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const meticulousRecordingToken = env.VITE_METICULOUS_RECORDING_TOKEN

  // Base public path. Defaults to "/" for local dev and root-hosted deploys.
  // GitHub Pages serves project sites from https://<user>.github.io/<repo>/, so the
  // Pages workflow sets VITE_BASE_PATH to "/<repo>/". See .github/workflows/deploy-pages.yml.
  const base = env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [
      react(),
      // Injects the Meticulous session recorder <script> tag. It's a no-op (the
      // plugin is simply omitted) until you provide VITE_METICULOUS_RECORDING_TOKEN
      // — via .env.local for local dev, or an env var / CI secret — so the app
      // runs fine out of the box with zero Meticulous setup.
      //
      //   - enabled: "always" so sessions are also recorded on non-dev builds
      //     such as the GitHub Pages preview (which is a production build).
      //     Recording still only happens when a token is present, since the
      //     plugin is only added in that case.
      //   - data-is-production-environment: "false" tags these as non-production
      //     (localhost / preview) environments, which is what Meticulous expects
      //     for session recording.
      meticulousRecordingToken
        ? meticulous({
            recordingToken: meticulousRecordingToken,
            enabled: 'always',
            attributes: { 'data-is-production-environment': 'false' },
          })
        : null,
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
  }
})
