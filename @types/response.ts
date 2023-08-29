export type Result = 'Ok' | 'Ko';

export interface Response {
  result: Result;
}

export interface Reply {
  'xxx': Response;
}