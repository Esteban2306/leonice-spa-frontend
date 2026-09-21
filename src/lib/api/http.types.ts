export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export interface HttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  refreshEndpoint?: string;
}

export interface RequestOptions {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}
