type EzFetchErrorOptions = {
  message?: string;
  originalResponse?: Response;
};

class EzFetchError extends Error {
  readonly url: string | undefined;
  readonly originalResponse: Response | undefined;
  readonly status: number | undefined;

  constructor(input: Partial<EzFetchInput>, options: EzFetchErrorOptions = {}) {
    const { message, originalResponse } = options;

    super(message);

    this.url = input.url;
    this.status = originalResponse?.status;
    this.originalResponse = originalResponse;
  }
}

export function isEzFetchError(err: unknown): err is EzFetchError {
  return err instanceof EzFetchError;
}

type ObjectValues<T extends object> = T[keyof T];

export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethodValue = ObjectValues<typeof HttpMethod>;

export type EzFetchRawResponse = {
  ok: boolean;
  url: string;
  method: HttpMethodValue;
  originalResponse: Response;
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
    try {
      const response = await fetch(this.#actual.url, {
        method: this.#actual.method,
      });

      if (!response.ok) {
        throw new EzFetchError(this.#actual, {
          message:
            `${this.#actual.method} ${this.#actual.url} failed with status ${response.status}.`,
          originalResponse: response,
        });
      }

      return await response.json() as V;
    } catch (error) {
      return this.handleError(error);
    }
  }

  res(this: EzFetch<EzFetchInput>): EzFetchRawResponse {
    return {
      ok: true,
      url: this.#actual.url,
      method: this.#actual.method,
      originalResponse: {} as Response,
    };
  }

  private handleError(error: unknown): never {
    if (isEzFetchError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : undefined;
    throw new EzFetchError(this.#actual, { message });
  }
}

export const ezfetch = EzFetch.create;
