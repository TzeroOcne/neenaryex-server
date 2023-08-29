import { existsSync } from 'fs';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'fs/promises';
import Handlebars from 'handlebars';
import minimist, { ParsedArgs } from 'minimist-lite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const argv = minimist(process.argv.slice(2));

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateFolder = resolve(__dirname, 'templates');
const rootFolder = resolve(__dirname, '..');
const queryFolder = resolve(rootFolder, 'query');
const queryIndexScript = resolve(queryFolder, 'index.ts');
const queryDatabaseScript = resolve(queryFolder, 'database.ts');

const addTemplate = Handlebars.compile(await readFile(resolve(templateFolder, 'add.handlebars'), 'utf-8'));
const queryIndexTemplate = Handlebars.compile(await readFile(resolve(templateFolder, 'query.index.handlebars'), 'utf-8'));

if (!existsSync(queryFolder)) {
  await mkdir(queryFolder);
}
if (!existsSync(queryIndexScript)) {
  await writeFile(queryIndexScript, 'export {}l');
}
if (!existsSync(queryDatabaseScript)) {
  await copyFile(resolve(templateFolder, 'database.ts'), queryDatabaseScript);
}

const execCommand = async (argv:ParsedArgs, desc:string = 'nodesc') => {
  if (!argv.c && !argv.command) throw new Error('no command arg found');
  const currentTimestamp = Date.now();

  switch (argv.command ?? argv.c) {
  case 'add': {
    const filename = `${currentTimestamp}-${desc}`;
    await writeFile(resolve(queryFolder, `${filename}.ts`), addTemplate({
      filename,
    }));
    await writeFile(resolve(queryFolder, `${filename}.surql`), '');
    const dirContent = await readdir(queryFolder);
    await writeFile(queryIndexScript, queryIndexTemplate({
      query_list: dirContent.filter(name => name.endsWith('ts') && ![
        'index.ts', 'database.ts',
      ].includes(name)),
    }));
    break;
  }
  case 'run': {
    await import('../query/index.ts');
    break;
  }
  default:
    break;
  }
};

if ('c' in argv) {
  await execCommand(argv);
}
