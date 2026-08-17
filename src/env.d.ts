interface ImportMetaEnv {
  readonly BASE_URL: string;
  // add other env vars here as needed
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
