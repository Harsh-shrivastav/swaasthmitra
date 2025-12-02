/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_EMERGENCY_NUMBER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
