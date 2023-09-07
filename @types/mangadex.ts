import { STATUS_LIST } from '@consts/mangadex';
import { ResponseType } from './response';

export type ReadingStatus = typeof STATUS_LIST[number];

export interface MDLoginSchema {
  username: string;
  password: string;
}

export interface MDAuthToken {
  session: string;
  refresh: string;
}

export interface MDAuthResponse extends ResponseType {
  token: MDAuthToken;
}

export type MDReadingList = Record<string,ReadingStatus>;

export interface MDReadingResponse extends ResponseType {
  statuses: MDReadingList;
}
