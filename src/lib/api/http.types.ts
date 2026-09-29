export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export interface HttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  refreshEndpoint?: string;
  onSessionExpired?: () => void;
}

export interface RequestOptions {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
  headers?: Record<string, string>;
  params?: object;
  signal?: AbortSignal;
}
