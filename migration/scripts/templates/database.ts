
// @ts-nocheck
import { Surreal } from 'surrealdb.js';
import Config from '../../migration.config.ts';

const { DB_HOST, USERNAME, PASSWORD, DB, NS } = Config;

export const db = new Surreal(DB_HOST ?? 'http://localhost:8000/rpc', {
  auth: {
    user: USERNAME ?? 'root',
    pass: PASSWORD ?? 'root',
  },
  db: DB ?? 'test',
  ns: NS ?? 'test',
});
