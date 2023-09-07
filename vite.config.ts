import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { PORT } from './neenaryex.config';

export default ({ mode }:{ mode:string }) => {
  process.env = { ...process.env, ...(loadEnv(mode, process.cwd())) };

  const srcDir = resolve(__dirname, 'src');

  return defineConfig({
    server: {
      port: PORT,
    },
    plugins: [
      ...VitePluginNode({
        adapter: 'fastify',
        appPath: 'src/index.ts',
      }),
    ],
    resolve: {
      alias: [
        { find: '@lib', replacement: resolve(srcDir, '@lib' ) },
        { find: '@consts', replacement: resolve(__dirname, '@consts' ) },
        { find: '@typebox', replacement: resolve(__dirname, '@typebox' ) },
        { find: '@config', replacement: resolve(__dirname, 'neenaryex.config.ts') },
      ],
    },
  });
};
