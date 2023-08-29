import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import Config from '../../migration.config.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { DB_HOST, USERNAME, PASSWORD, DB, NS } = Config;
const authCred = `${USERNAME}:${PASSWORD}`;

await fetch(`${DB_HOST}/sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Accept': 'application/json',
    NS: NS ?? 'test',
    DB: DB ?? 'test',
    'Authorization': `Basic ${Buffer.from(authCred).toString('base64')}`,
  },
  body: await readFile(resolve(__dirname, '1693337669016-nodesc.surql'), 'utf-8'),
});
