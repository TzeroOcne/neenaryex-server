import { Type } from '@sinclair/typebox';
import { SessionPayload } from './auth';

export const ResultSchema = Type.Union([
  Type.Literal('Ok'),
  Type.Literal('Ko'),
]);

export const ResponseSchema = Type.Object({
  result: ResultSchema,
  message: Type.Optional(Type.String()),
  error: Type.Optional(Type.Any()),
});

export const SessionResponseSchema = Type.Intersect([
  ResponseSchema,
  Type.Object({
    payload: Type.Optional(SessionPayload),
  }),
]);
