export interface HttpErrorInit {
  code?: string | null;
  details?: unknown;
  correlationId?: string | null;
}

export class HttpError extends Error {
  public readonly code: string | null;
  public readonly details: unknown;
  public readonly correlationId: string | null;

  constructor(
    public readonly status: number,
    message: string,
    init: HttpErrorInit = {},
  ) {
    super(message);
    this.name = "HttpError";
    this.code = init.code ?? null;
    this.details = init.details;
    this.correlationId = init.correlationId ?? null;
  }
}
