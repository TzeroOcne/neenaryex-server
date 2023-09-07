import { ReadingStatus } from './mangadex';

export type RelationName = 'read' | 'with_session';
export type CollectionName = RelationName | 'md_user' | 'manga' | 'user_session';
export type RecordID<T extends CollectionName> = `${T}:${string}`

export interface DBSchema<T extends CollectionName> {
  id: RecordID<T>;
}

export interface RelationSchema<
  SourceType extends CollectionName,
  TargetType extends CollectionName,
> {
  in: RecordID<SourceType>,
  out: RecordID<TargetType>,
}

export interface MDUserSchema {
  username: string;
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

export interface ReadRelationSchema {
  status: ReadingStatus,
}

export interface SessionRelationSchema {
  created_at: Date,
  last_used_at: Date,
}

export type RelationSchemaType<T extends RelationName> =
  T extends 'read' ? ReadRelationSchema :
  T extends 'with_session' ? SessionRelationSchema :
  object;

export type SchemaType<T extends CollectionName> =
  T extends 'md_user' ? MDUserSchema :
  T extends 'manga' ? MangaSchema :
  T extends 'user_session' ? MDSessionSchema :
  T extends RelationName ? RelationSchemaType<T> :
  object;

export type CollectionRelationType<T extends RelationName> =
  T extends 'read' ? RelationSchema<'md_user','manga'> :
  T extends 'with_session' ? RelationSchema<'md_user','user_session'> :
  object;

export type RelationCollectionType<T extends RelationName> = CollectionRelationType<T> & RelationSchemaType<T>;

export type CollectionType<T extends CollectionName> = DBSchema<T> &
  (T extends RelationName ? RelationCollectionType<T> : SchemaType<T>);

export type QueryType<T> = {
  [key in keyof T]: T[key];
};

export interface ConstructIDParams<T extends CollectionName> {
  collection?: T,
  id?: string,
  recordID?: string,
}

export interface RelateParams<
  NameType extends CollectionName,
  RelationType extends RelationName,
  DataType extends RelationSchemaType<RelationType> = RelationSchemaType<RelationType>,
> {
  source: ConstructIDParams<NameType>;
  target: ConstructIDParams<NameType>;
  relation: RelationType;
  property: DataType;
}
