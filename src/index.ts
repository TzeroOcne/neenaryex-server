import { PORT } from '@config';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { createSsession } from '@lib/helper/auth/auth.func';
import { login } from '@lib/helper/mangadex/mdauth/mdauth.func';
import { encryptPayload } from '@lib/util';
import { ResponseSchema } from '@typebox';
import { AuthRequest, ResponseType } from '@types';
import fastify from 'fastify';
import { writeFile } from 'fs/promises';
import { StatusCodes } from 'http-status-codes';
import userRoute from './features/user/user.route';

const createApp = async () => {
  const app = fastify().withTypeProvider<TypeBoxTypeProvider>();

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

  app.post<{ Body: AuthRequest, Reply: ResponseType }>('/auth', {
    schema: {
      tags: [ 'Auth' ],
      body: {
        $ref: 'AuthRequest#',
      },
      response: {
        201: ResponseSchema,
      },
    },
  }, async (request, reply) => {
    try {
      const token = await login(request.body);
      const sessionPayload = await createSsession({
        username: request.body.username,
        timestamp: Date.now(),
        ip: request.ip,
      }, token);

      reply.cookie('session_key', encryptPayload(sessionPayload));
      reply.code(201);
      return {
        result: 'Ok',
      };
    } catch (error) {
      reply.code(StatusCodes.INTERNAL_SERVER_ERROR);
      if (error instanceof Error) {
        return {
          result: 'Ko',
          message: error.message,
          error,
        };
      }
      return {
        result: 'Ko',
      };
    }
  });

  app.register(userRoute, { prefix: '/user' });

  await app.ready();
  await writeFile('openapi.yaml', app.swagger({ yaml: true }));

  return app;
};

const app = await createApp();

if (import.meta.env.PROD) {
  app.listen({
    port: PORT,
  });
}

export const viteNodeApp = app;
