
// @ts-nocheck
import { Surreal } from 'surrealdb.js';
import * as Config from '../../migration.config.ts';

const { DB_HOST, USERNAME, PASSWORD, DB, NS } = Config;

export const db = new Surreal(DB_HOST, {
  auth: {
    user: USERNAME,
    pass: PASSWORD,
  },
  db: DB,
  ns: NS,
});
