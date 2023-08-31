import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { defaultPort } from './@consts/config';

export default ({ mode }:{ mode:string }) => {
  process.env = { ...process.env, ...(loadEnv(mode, process.cwd())) };

  const port = Number(process.env.VITE_PORT ?? defaultPort);

  return defineConfig({
    server: {
      port,
    },
    plugins: [
      ...VitePluginNode({
        adapter: 'fastify',
        appPath: 'src/index.ts',
      }),
    ],
    resolve: {
      alias: [
        { find: '@lib', replacement: resolve(__dirname, 'src', '@lib' ) },
        { find: '@consts', replacement: resolve(__dirname, '@consts' ) },
        { find: '@typebox', replacement: resolve(__dirname, '@typebox' ) },
      ],
    },
  });
};
