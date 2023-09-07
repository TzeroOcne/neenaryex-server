import { AppConfig } from '@types';
import * as __SELF__ from './neenaryex.config.ts';

export const DB_HOST = import.meta?.env?.VITE_DB_URL ?? 'http://127.0.0.1:8000/rpc';
export const NS = 'nnry';
export const DB = 'nnry';
export const USERNAME = 'root';
export const PASSWORD = 'root';
export const API_URL = import.meta?.env?.VITE_API_URL ?? 'https://api.mangadex.org';
export const PORT = Number(import.meta?.env?.VITE_PORT ?? 6765);

__SELF__ satisfies AppConfig;
