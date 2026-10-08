import { HttpClientConfig, HttpMethod, RequestOptions } from "./http.types";
import { HttpError, type HttpErrorInit } from "./http-error";

const MUTATING_METHODS: readonly HttpMethod[] = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];
const IDEMPOTENCY_HEADER = "Idempotency-Key";

let refreshPromise: Promise<void> | null = null;

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly refreshEndpoint: string;
  private readonly onSessionExpired?: () => void;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.refreshEndpoint = config.refreshEndpoint ?? "/auth/refresh";
    this.onSessionExpired = config.onSessionExpired;

    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.defaultHeaders,
    };
  }

  async request<T>(
    path: string,
    method: HttpMethod,
    body?: unknown,
    requestOptions: RequestOptions = {},
  ): Promise<T> {
    const options = this.withIdempotencyKey(method, requestOptions);

    try {
      const response = await this.rawRequest(path, method, body, options);

      return await this.handleResponse<T>(response);
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

  private withIdempotencyKey(
    method: HttpMethod,
    options: RequestOptions,
  ): RequestOptions {
    if (!MUTATING_METHODS.includes(method)) return options;
    if (options.headers?.[IDEMPOTENCY_HEADER]) return options;
    if (typeof crypto === "undefined" || !("randomUUID" in crypto)) {
      return options;
    }

    return {
      ...options,
      headers: {
        [IDEMPOTENCY_HEADER]: crypto.randomUUID(),
        ...options.headers,
      },
    };
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
      refreshPromise = this.refreshToken()
        .catch((error: unknown) => {
          if (
            error instanceof HttpError &&
            (error.status === 401 || error.status === 403)
          ) {
            this.onSessionExpired?.();
          }

          throw error;
        })
        .finally(() => {
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
      headers: this.buildCsrfHeaders("POST"),
    });

    if (!response.ok) {
      throw new HttpError(response.status, "REFRESH_FAILED");
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
      for (const [key, value] of Object.entries(params) as [
        string,
        unknown,
      ][]) {
        if (value === undefined || value === null) continue;

        if (
          typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean"
        ) {
          throw new TypeError(
            `El query param "${key}" debe ser string, number o boolean.`,
          );
        }

        url.searchParams.append(key, String(value));
      }
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const { message, ...init } = await this.extractError(response);

      throw new HttpError(response.status, message, init);
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

  private async extractError(
    response: Response,
  ): Promise<HttpErrorInit & { message: string }> {
    const fallback = `HTTP Error ${response.status}`;

    try {
      const data: unknown = await response.json();

      if (typeof data !== "object" || data === null) {
        return { message: fallback };
      }

      const body = data as Record<string, unknown>;

      return {
        message: typeof body.message === "string" ? body.message : fallback,
        code: typeof body.code === "string" ? body.code : null,
        details: body.details,
        correlationId:
          typeof body.correlationId === "string" ? body.correlationId : null,
      };
    } catch {
      return { message: fallback };
    }
  }
}
