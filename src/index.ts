import { defaultPort } from '@consts/config';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { createRecord } from '@lib/database';
import { encryptPayload } from '@lib/util';
import { ResponseSchema } from '@typebox';
import { AuthRequest, MDAuthResponse, ResponseType, SessionPayloadType } from '@types';
import fastify from 'fastify';
import { writeFile } from 'fs/promises';
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
        message: await authResponse.text(),
      };
    }

    const { username } = request.body;

    const authData = await authResponse.json() as MDAuthResponse & ResponseType;
    const payloadData = {
      username,
      timestamp: Date.now(),
      ip: request.ip,
    };
    const payload = encryptPayload(payloadData);
    const sessionRecord = await createRecord('user_session', {
      payload,
      md_session_key: authData.token.session,
      md_refresh_key: authData.token.refresh,
    });
    const sessionPayload:SessionPayloadType = {
      id: sessionRecord.id,
      ...payloadData,
    };

    reply.cookie('session_key', encryptPayload(sessionPayload));
    reply.code(201);
    return {
      result: 'Ok',
    };
  });

  app.register(userRoute, { prefix: '/user' });

  await app.ready();
  await writeFile('openapi.yaml', app.swagger({ yaml: true }));

  return app;
};

const app = await createApp();
const port = Number(import.meta.env.VITE_PORT ?? defaultPort);

if (import.meta.env.PROD) {
  app.listen({ port });
}

export const viteNodeApp = app;
