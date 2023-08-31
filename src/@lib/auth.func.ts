import { SessionPayloadType } from '@types';
import { deleteRecordById, runSingleQuery } from './database';

export const isSessionValid = async (session_key:string) => {
  const result = await runSingleQuery<SessionPayloadType>(`select * from user_session where session_id = '${session_key}'`);
  return result.length > 0;
};

export const removeSession = async (session_id:string) => {
  return deleteRecordById(session_id);
};
