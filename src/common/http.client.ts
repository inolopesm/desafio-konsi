import { HttpClientError } from "./http-client.error";

export class HttpClient {
  static async request<T>(
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<{ headers: Headers; data: T }> {
    const response = await fetch(input, init);
    const contentType = response.headers.get("content-type");
    const json = contentType ? contentType.indexOf("json") !== -1 : false;
    const data = json ? await response.json() : null;

    if (!response.ok) {
      if (typeof data?.message === "string") {
        throw new HttpClientError(data.message);
      }

      throw new HttpClientError(`Unexpected error (${response.status})`);
    }

    return { headers: response.headers, data };
  }
}
