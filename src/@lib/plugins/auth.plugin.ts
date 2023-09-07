import { isSessionValid } from '@lib/helper/auth/auth.func';
import { decryptPayloadString } from '@lib/util';
import { ResponseType } from '@types';
import fp from 'fastify-plugin';
import { StatusCodes } from 'http-status-codes';

export const inSession = fp(async (server) => {
  server.addHook('preHandler', async (request, reply) => {
    const session_key = request.cookies.session_key;
    if (!session_key || !isSessionValid(session_key)) {
      reply.code(StatusCodes.UNAUTHORIZED);
      return {
        result: 'Ko',
        message: 'cookie session is invalid',
      } satisfies ResponseType;
    }
    const payload = decryptPayloadString(session_key);
    request.body = { payload };
  });
});