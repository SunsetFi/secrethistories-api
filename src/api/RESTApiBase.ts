import fetch from "cross-fetch";

import { APINetworkError } from "../errors.js";

export class RESTApiBase {
  readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request(method: string, path: string, body?: any): Promise<any> {
    path = trimSlash(path);
    if (path.startsWith("api")) {
      path = trimSlash(path.slice(3));
    }

    path = `${this.baseUrl}/api/${path}`;

    const headers: Record<string, string> = {};
    if (body) {
      headers["Content-Type"] = "application/json";
    }
    const options: RequestInit = {
      method,
      body: body && JSON.stringify(body),
      headers,
    };

    const response = await fetch(path, options);

    if (response.status >= 400) {
      throw new APINetworkError(path, response.status, await response.text());
    }

    if (response.status === 200 || response.status === 201) {
      if (
        response.headers.get("Content-Type")?.startsWith("application/json")
      ) {
        return await response.json();
      }
    } else if (response.status !== 204) {
      throw new APINetworkError(
        path,
        response.status,
        `API request to ${path} resulted in unknown status code ${response.status}.`
      );
    }
  }
}

function trimSlash(url: string): string {
  if (url.startsWith("/")) {
    url = url.slice(1);
  }

  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  return url;
}
