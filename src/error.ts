import { type EzFetchInput } from './common';

export type EzFetchErrorOptions = {
  message?: string;
  originalResponse?: Response;
};

export class EzFetchError extends Error {
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
