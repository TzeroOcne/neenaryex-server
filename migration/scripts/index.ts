import { existsSync } from 'fs';
import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import Handlebars from 'handlebars';
import minimist, { ParsedArgs } from 'minimist-lite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const argv = minimist(process.argv.slice(2));

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateFolder = resolve(__dirname, 'templates');
const rootFolder = resolve(__dirname, '..');
const queryFolder = resolve(rootFolder, 'query');

if (!existsSync(queryFolder)) {
  await mkdir(queryFolder);
  await writeFile(resolve(queryFolder, 'index.ts'), 'export {};');
}

const addTemplate = Handlebars.compile(await readFile(resolve(templateFolder, 'add.handlebars'), 'utf-8'));
const addIndexTemplate = Handlebars.compile(await readFile(resolve(templateFolder, 'add.index.handlebars'), 'utf-8'));

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
    await writeFile(resolve(queryFolder, 'index.ts'), addIndexTemplate({
      query_list: dirContent.filter(name => name.endsWith('ts') && name !== 'index.ts'),
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
