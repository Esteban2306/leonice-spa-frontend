export type ProductOrderStatus =
  "PENDIENTE_PAGO" | "PAGO_EN_REVISION" | "PAGADO" | "ENTREGADO" | "CANCELADO";

export type ProductFulfillment = "DOMICILIO" | "RECOGER";
export type ProductPaymentMethod = "TRANSFERENCIA" | "CONTRAENTREGA" | "EN_TIENDA";

export interface ProductOrderItem {
  id: string;
  productName: string;
  presentation: string | null;
  quantity: number;
  unitPrice: number | null;
  promoPrice: number | null;
  promotion: string | null;
  priced: boolean;
}

export interface ProductOrder {
  id: string;
  code: string;
  status: ProductOrderStatus;
  clientId: string | null;
  clientName: string | null;
  phone: string | null;
  lid: string | null;
  request: string | null;
  notes: string | null;
  total: number | null;
  priceHeldUntil: string | null;
  proofImageUrl: string | null;
  proofAmount: number | null;
  proofReceivedAt: string | null;
  amountMatches: boolean | null;
  rejectionReason: string | null;
  fulfillment: ProductFulfillment | null;
  paymentMethod: ProductPaymentMethod | null;
  deliveryAddress: string | null;
  verifiedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: ProductOrderItem[];
}

export interface PaginatedProductOrders {
  items: ProductOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FindProductOrdersParams {
  status?: ProductOrderStatus;
  view?: "TO_VERIFY";
  clientId?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductOrdersSummary {
  counts: Record<ProductOrderStatus, number>;
  toVerify: number;
  awaitingPayment: number;
  toDeliver: number;
}
