type ObjectValues<T extends object> = T[keyof T];

export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethodValue = ObjectValues<typeof HttpMethod>;

export type EzFetchResponse = {
  ok: boolean;
  url: string;
  method: HttpMethodValue;
};

type EzFetchInput = {
  url: string;
  method: HttpMethodValue;
};

class EzFetch<T extends Partial<EzFetchInput>> {
  readonly #actual: T;

  private constructor(actual: T) {
    this.#actual = actual;
  }

  static create(url: string = "") {
    return new EzFetch({ url });
  }

  setMethod(method: HttpMethodValue) {
    return new EzFetch({ ...this.#actual, method });
  }

  get(url: string = "") {
    return new EzFetch({
      ...this.#actual,
      method: HttpMethod.GET,
      url: `${this.#actual.url ?? ""}${url}`,
    });
  }

  async json<V>(this: EzFetch<EzFetchInput>): Promise<V> {
    const response = await fetch(this.#actual.url, {
      method: this.#actual.method,
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as V;
  }

  send(this: EzFetch<EzFetchInput>): EzFetchResponse {
    return {
      ok: true,
      url: this.#actual.url,
      method: this.#actual.method,
    };
  }
}

export const ezfetch = EzFetch;

export default ezfetch;
