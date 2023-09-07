import { API_URL } from '@config';
import { MDAuthResponse, MDAuthToken, MDLoginSchema } from '@types';
import { createFetchError } from '../../fetch/fetch.error';

export const login = async (body:MDLoginSchema):Promise<MDAuthToken> => {
  const authResponse = await fetch(`${API_URL}/auth/login`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (authResponse.status >= 400) {
    throw await createFetchError(authResponse);
  }
  const { token } = await authResponse.json() as MDAuthResponse;

  return token;
};