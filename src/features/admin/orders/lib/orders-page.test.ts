import { describe, expect, it } from "vitest";

import type { ProductOrder } from "@/src/features/admin/types/product-orders.types";

import {
  canDeliver,
  canVerify,
  chatHref,
  formatPesos,
  paymentStatus,
  tabParams,
  verifyLabel,
  itemLine,
  paymentCheck,
  whatsappUrl,
} from "./orders-page";

const order = (overrides: Partial<ProductOrder> = {}): ProductOrder => ({
  id: "o1",
  code: "P-0042",
  status: "PAGO_EN_REVISION",
  clientId: null,
  clientName: "Sandra",
  phone: "+573001112233",
  lid: null,
  request: null,
  notes: null,
  total: 392000,
  priceHeldUntil: "2026-11-23T20:00:00.000Z",
  proofImageUrl: "https://img/p.jpg",
  proofAmount: 392000,
  proofReceivedAt: "2026-11-22T20:00:00.000Z",
  amountMatches: true,
  rejectionReason: null,
  fulfillment: "RECOGER",
  paymentMethod: "TRANSFERENCIA",
  deliveryAddress: null,
  verifiedAt: null,
  deliveredAt: null,
  cancelledAt: null,
  createdAt: "2026-11-22T19:00:00.000Z",
  updatedAt: "2026-11-22T20:00:00.000Z",
  items: [],
  ...overrides,
});

describe("pedidos en el panel", () => {
  it("dice si el monto del comprobante alcanza el total", () => {
    expect(paymentCheck(order())).toBe("MATCHES");
    expect(paymentCheck(order({ proofAmount: 336000 }))).toBe("SHORT");
    expect(paymentCheck(order({ proofAmount: null }))).toBe("UNREAD");
    expect(paymentCheck(order({ total: null }))).toBe("NO_TOTAL");
  });

  it("solo deja verificar un pedido con total que espera o revisa su pago", () => {
    expect(canVerify(order())).toBe(true);
    expect(canVerify(order({ total: null }))).toBe(false);
    expect(canVerify(order({ status: "PAGADO" }))).toBe(false);
  });

  it("arma el enlace de WhatsApp solo con un teléfono real", () => {
    expect(whatsappUrl("+57 300 111 2233")).toBe("https://wa.me/573001112233");
    expect(whatsappUrl(null)).toBeNull();
  });

  it("muestra cada producto con su precio de promoción", () => {
    expect(
      itemLine({
        id: "i",
        productName: "Ritual Jolly Kids",
        presentation: "Ritual",
        quantity: 2,
        unitPrice: 245000,
        promoPrice: 196000,
        promotion: "Kits con 20 %",
        priced: true,
      }),
    ).toBe("2 × Ritual Jolly Kids (Ritual) · $196.000 · Kits con 20 %");
    expect(formatPesos(null)).toBe("Por confirmar");
  });

  it("por verificar junta los pedidos con y sin comprobante", () => {
    expect(tabParams("TO_VERIFY")).toEqual({ view: "TO_VERIFY", pageSize: 50 });
    expect(tabParams("PAGADO")).toEqual({ status: "PAGADO", pageSize: 50 });
  });

  it("el botón dice qué se le avisa a la clienta según cómo pidió el producto", () => {
    expect(verifyLabel(order())).toBe("Verificar y avisar que puede recogerlo");
    expect(verifyLabel(order({ fulfillment: "DOMICILIO" }))).toBe(
      "Verificar y avisar que va en camino",
    );
  });

  it("se puede verificar y entregar un pedido que paga al recibirlo, sin comprobante", () => {
    const cash = order({
      status: "PENDIENTE_PAGO",
      paymentMethod: "CONTRAENTREGA",
      fulfillment: "DOMICILIO",
      proofImageUrl: null,
    });
    expect(canVerify(cash)).toBe(true);
    expect(canDeliver(cash)).toBe(true);
    expect(paymentStatus(cash)).toBeNull();
    expect(paymentStatus(order({ status: "PENDIENTE_PAGO" }))).toBe(
      "Aún no envía el comprobante",
    );
  });

  it("el chat se abre dentro del panel", () => {
    expect(chatHref("+573108525522")).toBe(
      "/admin/whatsapp/inbox?buscar=573108525522",
    );
    expect(chatHref("+573108525522", "c1")).toBe(
      "/admin/whatsapp/inbox?chat=c1&buscar=573108525522",
    );
    expect(chatHref(null)).toBeNull();
  });
});
