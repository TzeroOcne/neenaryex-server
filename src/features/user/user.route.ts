import { removeSession } from '@lib/auth.func';
import { inSession } from '@lib/plugins/auth';
import { ResponseSchema, SessionResponseSchema } from '@typebox';
import { ResponseType, SessionRequestBodyType, SessionResponseType } from '@types';
import { FastifyPluginCallback } from 'fastify';

export default (async (server) => {
  server.register(inSession);

  server.get<{ Body: SessionRequestBodyType, Reply: SessionResponseType }>('/me', {
    schema: {
      response: {
        default: ResponseSchema,
        200: SessionResponseSchema,
      },
    },
  }, async (request, reply) => {
    try {
      return {
        result: 'Ok',
        payload: request.body.payload,
      };
    } catch (error) {
      reply.code(500);
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

  server.get<{ Body: SessionRequestBodyType, Reply: ResponseType }>('/logout', {
    schema: {
      response: {
        default: ResponseSchema,
      },
    },
  }, async (request, reply) => {
    const { payload } = request.body;
    await removeSession(payload.id);
    reply.clearCookie('session_key');

    return {
      result: 'Ok',
    };
  });
}) satisfies FastifyPluginCallback;