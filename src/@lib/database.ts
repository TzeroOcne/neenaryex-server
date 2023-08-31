import { CollectionName, CollectionType, DataType, QueryType } from '@types';
import Surreal from 'surrealdb.js';

const db = new Surreal(import.meta.env.VITE_DB_URL, {
  auth: {
    user: 'root',
    pass: 'root',
  },
  ns: 'nnry',
  db: 'nnry',
});

export const createRecord = async <T extends CollectionName>(
  collection:T, record:QueryType<DataType<T>>,
) => {
  const [ newRecord ] =  await db.create(collection, record);
  return newRecord as CollectionType<T>;
};

export const deleteRecordById = async (id:string) => {
  return await db.delete(id);
};

export const runSingleQuery = async <DataType>(query:string) => {
  const result =  await db.query<[QueryType<DataType>[]]>(query);
  return result[0].result ?? [];
};
