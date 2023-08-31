import { Static } from '@sinclair/typebox';
import { SessionPayload } from '@typebox/auth';

export type SessionPayloadType = Static<typeof SessionPayload>