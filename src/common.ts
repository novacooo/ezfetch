import { type ObjectValues } from './utils';

export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethodValue = ObjectValues<typeof HttpMethod>;

export type EzFetchInput = {
  url: string;
  method: HttpMethodValue;
};
