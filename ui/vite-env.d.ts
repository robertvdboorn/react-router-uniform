/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNIFORM_API_KEY: string;
  readonly VITE_UNIFORM_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

