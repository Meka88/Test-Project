/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_LATENCY_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
