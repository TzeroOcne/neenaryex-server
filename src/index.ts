import { defaultPort } from '@consts/config';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import { AuthRequest, MDAuthResponse, Response } from '@types';
import fastify from 'fastify';
import { writeFile } from 'fs/promises';
import Surreal from 'surrealdb.js';

const db = new Surreal(import.meta.env.VITE_DB_URL, {
  auth: {
    user: 'root',
    pass: 'root',
  },
  ns: 'nnry',
  db: 'nnry',
});

const createRecord = async (collection:string, record:Record<string,unknown>) => {
  await db.create(collection, record);
};

const createApp = async () => {
  const app = fastify();

  app.register(cookie, {
    secret: 'my-secret',
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
    },
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Neenaryex API',
        description: 'Fastify API for Neenaryex',
        version: '0.1.0',
      },
      tags: [
        { name: 'Auth', description: 'Auth related endpoint' },
      ],
    },
    refResolver: {
      buildLocalReference(json) {
        return `${json.$id}`;
      },
    },
  });

  app.addSchema({
    $id: 'AuthRequest',
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  });

  app.post<{ Body: AuthRequest, Reply: Response }>('/auth', {
    schema: {
      tags: [ 'Auth' ],
      body: {
        $ref: 'AuthRequest#'
      },
      response: {
        201: {
          description: 'Success',
          type: 'object',
        },
      },
    },
  }, async (request, reply) => {
    const authResponse = await fetch('https://api.mangadex.org/auth/login', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(request.body),
    });
    if (authResponse.status >= 400) {
      reply.code(authResponse.status);
      return {
        result: 'Ko',
      };
    }

    const authData = await authResponse.json() as MDAuthResponse & Response;

    reply.code(201);
    return {
      result: 'Ok',
    };
  });

  await app.ready();
  await writeFile('openapi.yaml', app.swagger({ yaml: true }));

  return app;
};

const app = await createApp();
const port = Number(import.meta.env.VITE_PORT ?? defaultPort);

if (import.meta.env.PROD) {
  app.listen({ port: port });
}

export const viteNodeApp = app;
