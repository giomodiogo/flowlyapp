/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the remote API used by the web build (e.g. https://api.flowly.app). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
