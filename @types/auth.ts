import { Static } from '@sinclair/typebox';
import { SessionData, SessionPayload } from '@typebox/auth';

export type SessionDataType = Static<typeof  SessionData>;
export type SessionPayloadType = Static<typeof SessionPayload>
