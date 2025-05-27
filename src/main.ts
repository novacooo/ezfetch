type ObjectValues<T extends object> = T[keyof T];

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const;

export type HttpMethodValue = ObjectValues<typeof HttpMethod>;

export type EzFetchResponse = {
  ok: boolean;
}

type EzFetchInput = {
  baseUrl: string;
  method: HttpMethodValue;
}

class EzFetch<T extends Partial<EzFetchInput>> {
  #actual: T;

  private constructor(actual: T) {
    this.#actual = actual;
  }

  static create(baseUrl: string) {
    return new EzFetch({ baseUrl });
  }

  setMethod(method: HttpMethodValue) {
    return new EzFetch({ ...this.#actual, method });
  }

  send(this: EzFetch<EzFetchInput>): EzFetchResponse {
    return {
      ok: true,
    }
  }
}

export const ezfetch = EzFetch;

export default ezfetch;
