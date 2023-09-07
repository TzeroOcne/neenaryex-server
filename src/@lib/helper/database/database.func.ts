import { CollectionName, CollectionType, ConstructIDParams, QueryType, RelateParams, RelationName, SchemaType } from '@types';
import Surreal from 'surrealdb.js';

const db = new Surreal(import.meta.env.VITE_DB_URL, {
  auth: {
    user: 'root',
    pass: 'root',
  },
  ns: 'nnry',
  db: 'nnry',
});

export const runQuery = async <DataType>(query:string) => {
  const result =  await db.query<[QueryType<DataType>[]]>(query);
  return result;
};

export const runSingleQuery = async <DataType>(query:string) => {
  const result =  await runQuery<DataType>(query);
  return result[0].result ?? [];
};

export const createRecord = async <T extends CollectionName>(
  collection:T, record:QueryType<SchemaType<T>>,
) => {
  const [ newRecord ] =  await db.create(collection, record);
  return newRecord as CollectionType<T>;
};

export const constructID = <T extends CollectionName>({
  collection,
  recordID,
  id,
}:ConstructIDParams<T>) => {
  if (!id && (!collection || !recordID)) {
    throw new Error('require at least "id" or a pair of "collection" and "recordID');
  }
  return id ?? `${collection}:${recordID}`;
};

const parseFieldValue = (value:unknown) => {
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }
  return `'${value}'`;
};

export const constructFieldSetter = <
  RecordType extends CollectionName,
  DataType extends SchemaType<RecordType> = SchemaType<RecordType>,
>(property:DataType) => {
  return Object.entries(property)
    .map(([key, val]) => `${key} = ${parseFieldValue(val)}`)
    .join(', ');
};

export const relateRecord = async <
  NameType extends CollectionName,
  RelationType extends RelationName,
  RecordType extends CollectionType<NameType> = CollectionType<NameType>,
>({
  source,
  target,
  relation,
  property,
}:RelateParams<NameType, RelationType>) => {
  const sourceID = constructID(source);
  const targetID = constructID(target);
  const setterQuery = property
    ? ` SET ${constructFieldSetter(property)}`
    : '';
  const queryString = `RELATE ${sourceID}->${relation}->${targetID}${setterQuery}`;

  return await runSingleQuery<RecordType>(queryString);
};

export const upsertRecord = async <
  NameType extends CollectionName,
  RecordType extends CollectionType<NameType> = CollectionType<NameType>,
  QueryReturnType extends QueryType<RecordType> = QueryType<RecordType>,
>(
  collection: NameType,
  filter: Partial<RecordType>,
  record: Partial<RecordType>,
):Promise<RecordType[]> => {
  const condition = Object
    .entries(filter)
    .map(([ field, value ]) => `${field}='${value}'`)
    .join(' AND ');

  const existingRecordList = await runSingleQuery<RecordType>(
    `SELECT * from ${collection} WHERE ${condition}`,
  );

  if (existingRecordList.length > 0) {
    const updatedList:RecordType[] = [];
    for (const { id } of existingRecordList) {
      const queryResult = await db.update<QueryReturnType>(id, record as QueryReturnType);
      updatedList.push(...queryResult);
    }
    return updatedList;
  }
  return await db.create<QueryReturnType>(collection, record as QueryReturnType);
};

export const deleteRecordById = async (id:string) => {
  return await db.delete(id);
};
