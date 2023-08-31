import { Type } from '@sinclair/typebox';

export const SessionPayload = Type.Object({
  id: Type.String(),
  username: Type.String(),
  timestamp: Type.Number(),
  ip: Type.String(),
});