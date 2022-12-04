declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEB_CLIENT_URL: string;
      SERVER_PORT: number;
    }
  }
}

export {};
