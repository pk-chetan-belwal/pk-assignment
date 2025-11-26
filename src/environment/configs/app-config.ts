import { AppInterface } from '../interfaces/app';

export const appConfig = () => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
    base_url: process.env.BACKEND_APP_BASE_URL,
  } as AppInterface,
});
