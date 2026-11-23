import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";
import type {
  FindProductOrdersParams,
  PaginatedProductOrders,
  ProductOrder,
  ProductOrdersSummary,
} from "../types/product-orders.types";

export const productOrdersApi = {
  findMany(params?: FindProductOrdersParams, options: QueryOptions = {}) {
    return httpClient.request<PaginatedProductOrders>(
      "/product-orders",
      "GET",
      undefined,
      { params, signal: options.signal },
    );
  },

  summary(options: QueryOptions = {}) {
    return httpClient.request<ProductOrdersSummary>(
      "/product-orders/summary",
      "GET",
      undefined,
      { signal: options.signal },
    );
  },

  verifyPayment(orderId: string) {
    return httpClient.request<ProductOrder>(
      `/product-orders/${orderId}/verify-payment`,
      "PATCH",
    );
  },

  rejectPayment(orderId: string, reason: string) {
    return httpClient.request<ProductOrder>(
      `/product-orders/${orderId}/reject-payment`,
      "PATCH",
      { reason },
    );
  },

  deliver(orderId: string) {
    return httpClient.request<ProductOrder>(
      `/product-orders/${orderId}/deliver`,
      "PATCH",
    );
  },

  cancel(orderId: string) {
    return httpClient.request<ProductOrder>(
      `/product-orders/${orderId}/cancel`,
      "PATCH",
    );
  },

  setTotal(orderId: string, total: number) {
    return httpClient.request<ProductOrder>(
      `/product-orders/${orderId}/total`,
      "PATCH",
      { total },
    );
  },
};
