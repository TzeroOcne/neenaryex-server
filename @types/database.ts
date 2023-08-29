export type CollectionName = 'manga' | 'md_user';

export interface MangaSchema {
  mangadex_id: string;
  original_lang: string;
  created_at: Date;
  updated_at: Date;
}

export interface MDUserSchema {
  username: string;
  session_key: string;
  refresh_key: string;
}

export type CollectionType<T extends CollectionName> =
  T extends 'manga' ? MangaSchema :
  T extends 'md_user' ? MDUserSchema :
  unknown;

export type QueryType<T> = {
  [key in keyof T]: unknown;
};
