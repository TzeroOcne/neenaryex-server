import { API_URL } from '@config';
import { STATUS_LIST } from '@consts/mangadex';
import { upsertRecord } from '@lib/helper/database/database.func';
import { createFetchError } from '@lib/helper/fetch/fetch.error';
import { MDReadingResponse, MDUserSchema, MangaSchema, ReadingStatus } from '@types';

export const fetchMangaReadingStatus = async (
  token:string,
  ...filterInput:readonly ReadingStatus[]
) => {
  const response = await fetch(`${API_URL}/manga/status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (response.status >= 400) {
    throw await createFetchError(response);
  }

  const statusFilter = filterInput.length > 0
    ? filterInput
    : STATUS_LIST;

  const { statuses } = await response.json() as MDReadingResponse;
  const readingList = Object.entries(statuses)
    .filter(([ , status ]) => statusFilter.includes(status))
    .map(([ mangadex_id, status ]) => ({ mangadex_id, status }));

  const readingRecordList:MangaSchema[] = [];
  for (const { mangadex_id } of readingList) {
    const [ record ] = await upsertRecord('manga', {
      mangadex_id,
    }, {
      mangadex_id,
    });
    readingRecordList.push(record);
  }

  return {
    token,
    readingRecordList,
  };
};

export const syncMangaReadingStatus = async (mdUser:MDUserSchema) => {
  return mdUser;
};
