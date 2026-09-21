import { HttpClientConfig, HttpMethod, RequestOptions } from "./http.types";
import { HttpError } from "./http-error";

let refreshPromise: Promise<void> | null = null;

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly refreshEndpoint: string;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.refreshEndpoint = config.refreshEndpoint ?? "/auth/refresh";

    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.defaultHeaders,
    };
  }

  async request<T>(
    path: string,
    method: HttpMethod,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    try {
      const response = await this.rawRequest(path, method, body, options);

      return this.handleResponse<T>(response);
    } catch (error) {
      if (
        error instanceof HttpError &&
        error.status === 401 &&
        options.auth !== false &&
        options.retryOnUnauthorized !== false
      ) {
        return this.handle401<T>(path, method, body, options);
      }

      throw error;
    }
  }

  private async rawRequest(
    path: string,
    method: HttpMethod,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<Response> {
    const headers = this.buildHeaders(options, method, body);

    return fetch(this.buildUrl(path, options.params), {
      method,
      headers,
      credentials: "include",
      signal: options.signal,
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    });
  }

  private async handle401<T>(
    path: string,
    method: HttpMethod,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    if (options.auth === false) {
      throw new HttpError(401, "UNAUTHORIZED");
    }

    if (!refreshPromise) {
      refreshPromise = this.refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise;
    } catch {
      throw new HttpError(401, "SESSION_EXPIRED");
    }

    const response = await this.rawRequest(path, method, body, options);

    return this.handleResponse<T>(response);
  }

  private async refreshToken(): Promise<void> {
    const response = await fetch(this.buildUrl(this.refreshEndpoint), {
      method: "POST",
      credentials: "include",
      headers: this.buildCsrfHeaders(),
    });

    if (!response.ok) {
      throw new HttpError(401, "SESSION_EXPIRED");
    }
  }

  private buildHeaders(
    options: RequestOptions,
    method: HttpMethod,
    body?: unknown,
  ): HeadersInit {
    const isFormData = body instanceof FormData;

    return {
      ...(isFormData ? {} : this.defaultHeaders),
      ...this.buildCsrfHeaders(method),
      ...options.headers,
    };
  }

  private buildCsrfHeaders(method?: HttpMethod): Record<string, string> {
    if (
      typeof document === "undefined" ||
      !method ||
      ["GET", "HEAD", "OPTIONS"].includes(method)
    ) {
      return {};
    }

    const csrfToken = this.getCookie("csrf_token");

    if (!csrfToken) {
      return {};
    }

    return {
      "X-CSRF-Token": csrfToken,
    };
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split("; ");

    const cookie = cookies.find((item) => item.startsWith(`${name}=`));

    if (!cookie) {
      return null;
    }

    return decodeURIComponent(cookie.substring(name.length + 1));
  }

  private buildUrl(path: string, params?: RequestOptions["params"]): string {
    const url = new URL(
      `${this.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const message = await this.extractErrorMessage(response);

      throw new HttpError(response.status, message);
    }

    if (response.status === 204) {
      return null as T;
    }

    const text = await response.text();

    if (!text) {
      return null as T;
    }

    return JSON.parse(text) as T;
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const data: unknown = await response.json();

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }

      return `HTTP Error ${response.status}`;
    } catch {
      return `HTTP Error ${response.status}`;
    }
  }
}
