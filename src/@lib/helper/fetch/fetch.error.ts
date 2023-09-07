class ResponseError extends Error {
  readonly data: object;

  constructor(data:object) {
    super('response error');
    this.data = data;
  }
}

export const createFetchError = async (response:Response) => {
  return new ResponseError(await response.json());
};
