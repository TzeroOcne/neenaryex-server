import { Type } from '@sinclair/typebox';

export const SessionData = Type.Object({
  username: Type.String(),
  timestamp: Type.Number(),
  ip: Type.String(),
});

export const SessionPayload = Type.Intersect([
  Type.Object({
    id: Type.String(),
  }),
  SessionData,
]) ;