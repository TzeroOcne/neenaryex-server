import { removeSession } from '@lib/helper/auth/auth.func';
import { inSession } from '@lib/plugins/auth.plugin';
import { ResponseSchema, ResultSchema, SessionResponseSchema } from '@typebox';
import { ResponseType, SessionRequestBodyType, SessionResponseType } from '@types';
import { FastifyPluginCallback } from 'fastify';
import { StatusCodes } from 'http-status-codes';

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

  server.get<{ Body: SessionRequestBodyType, Reply: ResponseType }>('/sync/download', {
    schema: {
      response: {
        default: ResultSchema,
      },
    },
  }, async (request, reply) => {
    try {
      console.log(request.body.payload);

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
}) satisfies FastifyPluginCallback;