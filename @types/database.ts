export type CollectionName = 'manga' | 'user_session';

export interface DBSchema {
  id: string;
}

export interface MangaSchema {
  mangadex_id: string;
  original_lang: string;
  created_at: Date;
  updated_at: Date;
}

export interface MDSessionSchema {
  payload: string;
  md_session_key: string;
  md_refresh_key: string;
}

export type DataType<T extends CollectionName> =
  T extends 'manga' ? MangaSchema :
  T extends 'user_session' ? MDSessionSchema :
  object;

export type CollectionType<T extends CollectionName> = DBSchema & DataType<T>;

export type QueryType<T> = {
  [key in keyof T]: unknown;
};
