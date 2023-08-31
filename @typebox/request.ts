import { Type } from '@sinclair/typebox';
import { SessionPayload } from './auth';

export const SessionRequestBodySchema = Type.Object({
  payload: SessionPayload,
});
