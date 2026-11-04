export type AutomaticMessageKind = "REMINDER" | "FOLLOW_UP";

export type AutomaticMessageResult = "EXECUTED" | "SKIPPED" | "FAILED";

export interface AutomaticMessage {
  id: string;
  kind: AutomaticMessageKind;
  result: AutomaticMessageResult;
  reason: string | null;
  errorMessage: string | null;
  executedAt: string;
  clientId: string | null;
  clientName: string | null;
  target: string | null;
  templateCode: string | null;
}

export interface FindAutomaticMessagesParams {
  result?: AutomaticMessageResult;
  page?: number;
}

export interface PaginatedAutomaticMessages {
  data: AutomaticMessage[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
