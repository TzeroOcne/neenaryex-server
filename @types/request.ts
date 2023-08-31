import { Static } from '@sinclair/typebox';
import { SessionRequestBodySchema } from '@typebox';

export type SessionRequestBodyType = Static<typeof SessionRequestBodySchema>;

export interface AuthRequest {
  username: string;
  password: string;
}