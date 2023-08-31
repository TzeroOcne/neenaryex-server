import { Static } from '@sinclair/typebox';
import { ResponseSchema, ResultSchema, SessionResponseSchema } from '@typebox';

export type ResultType = Static<typeof ResultSchema>;
export type ResponseType = Static<typeof ResponseSchema>;
export type SessionResponseType = Static<typeof SessionResponseSchema>;
