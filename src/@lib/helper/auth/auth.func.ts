import { encryptPayload } from '@lib/util';
import { MDAuthToken, SessionDataType, SessionPayloadType } from '@types';
import { createRecord, deleteRecordById, relateRecord, runSingleQuery, upsertRecord } from '../database/database.func';

export const isSessionValid = async (session_key:string) => {
  const result = await runSingleQuery<SessionPayloadType>(`select * from user_session where session_id = '${session_key}'`);
  return result.length > 0;
};

export const createSsession = async (sessionData:SessionDataType, token:MDAuthToken):Promise<SessionPayloadType> => {
  const { username } = sessionData;
  const { id: sessionID } = await createRecord('user_session', {
    payload: encryptPayload(sessionData),
    md_refresh_key: token.refresh,
    md_session_key: token.session,
  });
  const [{ id:userID }] = await upsertRecord('md_user', { username }, { username });
  const currentTimestamp = new Date();
  await relateRecord({
    source: {
      id: userID,
    },
    target: {
      id: sessionID,
    },
    relation: 'with_session',
    property: {
      created_at: currentTimestamp,
      last_used_at: currentTimestamp,
    },
  });
  return {
    id: sessionID,
    ...sessionData,
  };
};

export const removeSession = async (session_id:string) => {
  return deleteRecordById(session_id);
};
