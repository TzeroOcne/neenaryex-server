interface AppEnv {
  readonly VITE_PORT: string;
}

declare global {
  interface ImportMetaEnv extends AppEnv {
    readonly VITE_DB_URL: string;
    readonly VITE_API_URL: string;
  }

  namespace NodeJS {
    interface ProcessEnv extends AppEnv {
    }
  }
}

export { };

