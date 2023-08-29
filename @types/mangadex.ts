export interface MDAuthResponse {
  token: {
    session: string;
    refresh: string;
  };
}