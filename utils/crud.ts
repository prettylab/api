import { DELETE, GET, PATCH, POST } from "@prettylab/api/utils/request";

export type ListResponse = {
  success: boolean;
  message: string;
  limit: number;
  count: number;
  page: number;
  data?: Array<any>;
};

export async function list(
  url: string,
  query?: Record<string, any>,
): Promise<ListResponse> {
  const qs = query
    ? "?" +
      new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]))
    : "";

  return GET(url + qs);
}

export async function read(
  url: string,
): Promise<{ success: boolean; message: string; data?: any }> {
  return GET(url);
}

export async function create(
  url: string,
  body: any,
): Promise<{ success: boolean; message: string; data?: any }> {
  return POST(url, JSON.stringify(body));
}

export async function update(
  url: string,
  body: any,
): Promise<{ success: boolean; message: string; data?: any }> {
  return PATCH(url, JSON.stringify(body));
}

export async function remove(
  url: string,
): Promise<{ success: boolean; message: string }> {
  return DELETE(url);
}

export async function restore(
  url: string,
): Promise<{ success: boolean; message: string }> {
  return PATCH(url);
}
