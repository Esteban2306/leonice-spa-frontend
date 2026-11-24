import Link from "@/src/features/admin/components/admin-link";
import { ExternalLink, MapPin, MessageCircle, Wallet } from "lucide-react";
import { useState } from "react";

import type {
  ProductOrder,
  ProductOrdersSummary,
} from "@/src/features/admin/types/product-orders.types";

import {
  canDeliver,
  canVerify,
  chatHref,
  formatPesos,
  FULFILLMENT_TEXT,
  isOpen,
  itemLine,
  ORDER_TABS,
  type OrderTab,
  PAYMENT_CHECK_LABEL,
  PAYMENT_TEXT,
  paymentCheck,
  paymentStatus,
  tabCount,
  verifyLabel,
} from "../lib/orders-page";

interface OrdersViewProps {
  tab: OrderTab;
  summary: ProductOrdersSummary | null;
  orders: readonly ProductOrder[];
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  onTabChange: (tab: OrderTab) => void;
  onVerify: (order: ProductOrder) => void;
  onReject: (order: ProductOrder, reason: string) => void;
  onDeliver: (order: ProductOrder) => void;
  onCancel: (order: ProductOrder) => void;
  onSetTotal: (order: ProductOrder, total: number) => void;
  onRetry: () => void;
}

const BUTTON =
  "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 font-sans text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary disabled:cursor-not-allowed disabled:opacity-50";

const CHECK_TONE = {
  MATCHES: "bg-emerald-50 text-emerald-800 border-emerald-200",
  SHORT: "bg-amber-50 text-amber-900 border-amber-200",
  UNREAD: "bg-amber-50 text-amber-900 border-amber-200",
  NO_TOTAL: "bg-red-50 text-red-800 border-red-200",
} as const;

const dateTime = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : "";

function OrderCard({
  order,
  props,
}: {
  order: ProductOrder;
  props: OrdersViewProps;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [total, setTotal] = useState("");
  const check = paymentCheck(order);
  const chat = chatHref(order.phone);
  const paid = paymentStatus(order);

  return (
    <article className="flex flex-col gap-4 rounded-[1.5rem] border border-tertiary/30 bg-[#FCF6EB] p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-sans text-xs font-semibold tracking-wide text-secondary/60 uppercase">
            Pedido {order.code} · {dateTime(order.createdAt)}
          </p>
          <h2 className="font-heading text-2xl text-secondary">
            {order.clientName ?? "Cliente sin registrar"}
          </h2>
          <p className="font-sans text-sm text-secondary/75">
            {order.phone ?? "Número oculto por WhatsApp"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs text-secondary/60">Total</p>
          <p className="font-sans text-2xl font-bold text-secondary tabular-nums">
            {formatPesos(order.total)}
          </p>
          {order.priceHeldUntil && (
            <p className="font-sans text-xs text-secondary/60">
              Promoción hasta {dateTime(order.priceHeldUntil)}
            </p>
          )}
        </div>
      </header>

      <ul className="flex flex-col gap-1 font-sans text-sm text-secondary">
        {order.items.map((item) => (
          <li key={item.id}>{itemLine(item)}</li>
        ))}
      </ul>
      <dl className="grid gap-2 rounded-2xl bg-white/70 p-3 font-sans text-sm text-secondary sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <MapPin
            className="mt-0.5 size-4 shrink-0 text-secondary/60"
            aria-hidden
          />
          <div>
            <dt className="text-xs text-secondary/60">Cómo lo recibe</dt>
            <dd className="font-semibold">
              {order.fulfillment
                ? FULFILLMENT_TEXT[order.fulfillment]
                : "Sin indicar"}
            </dd>
            {order.deliveryAddress && <dd>{order.deliveryAddress}</dd>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Wallet
            className="mt-0.5 size-4 shrink-0 text-secondary/60"
            aria-hidden
          />
          <div>
            <dt className="text-xs text-secondary/60">Cómo paga</dt>
            <dd className="font-semibold">
              {order.paymentMethod
                ? PAYMENT_TEXT[order.paymentMethod]
                : "Sin indicar"}
            </dd>
            {paid && <dd>{paid}</dd>}
          </div>
        </div>
      </dl>

      {order.request && (
        <p className="font-sans text-sm text-secondary/75">
          En sus palabras: {order.request}
        </p>
      )}
      {order.notes && (
        <p className="font-sans text-sm text-secondary/75">
          Notas: {order.notes}
        </p>
      )}

      {order.proofImageUrl && (
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={order.proofImageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-secondary underline"
          >
            Ver comprobante <ExternalLink className="size-4" />
          </a>
          <span className="font-sans text-sm text-secondary">
            Pagó {formatPesos(order.proofAmount)}
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-sans text-xs font-semibold ${CHECK_TONE[check]}`}
          >
            {PAYMENT_CHECK_LABEL[check]}
          </span>
        </div>
      )}
      {order.rejectionReason && order.status === "PENDIENTE_PAGO" && (
        <p className="font-sans text-sm text-red-800">
          Último comprobante rechazado: {order.rejectionReason}
        </p>
      )}

      {order.total === null &&
        (order.status === "PENDIENTE_PAGO" ||
          order.status === "PAGO_EN_REVISION") && (
          <form
            className="flex flex-wrap items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const value = Number(total.replace(/\D/g, ""));
              if (value > 0) props.onSetTotal(order, value);
            }}
          >
            <label
              className="font-sans text-sm text-secondary"
              htmlFor={`total-${order.id}`}
            >
              Total del pedido
            </label>
            <input
              id={`total-${order.id}`}
              inputMode="numeric"
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              placeholder="196000"
              className="h-10 w-36 rounded-full border border-tertiary/40 bg-white px-4 font-sans text-sm"
            />
            <button
              type="submit"
              disabled={props.isPending}
              className={`${BUTTON} bg-secondary text-primary`}
            >
              Guardar total
            </button>
          </form>
        )}

      <footer className="flex flex-wrap gap-2">
        {canVerify(order) && (
          <button
            type="button"
            disabled={props.isPending}
            onClick={() => props.onVerify(order)}
            className={`${BUTTON} bg-secondary text-primary hover:bg-secondary/90`}
          >
            {verifyLabel(order)}
          </button>
        )}
        {order.status === "PAGO_EN_REVISION" && !rejecting && (
          <button
            type="button"
            disabled={props.isPending}
            onClick={() => setRejecting(true)}
            className={`${BUTTON} border border-red-300 text-red-800 hover:bg-red-50`}
          >
            Rechazar comprobante
          </button>
        )}
        {canDeliver(order) && (
          <button
            type="button"
            disabled={props.isPending}
            onClick={() => {
              if (
                !isOpen(order) ||
                window.confirm(
                  `¿Marcar el pedido ${order.code} como entregado sin verificarlo antes?`,
                )
              ) {
                props.onDeliver(order);
              }
            }}
            className={`${BUTTON} bg-tertiary text-secondary hover:bg-quaternary`}
          >
            Entregado
          </button>
        )}
        {chat && (
          <Link
            href={chat}
            className={`${BUTTON} border border-tertiary/40 text-secondary hover:bg-quaternary/25`}
          >
            <MessageCircle className="size-4" /> Abrir chat
          </Link>
        )}
        {(order.status === "PENDIENTE_PAGO" ||
          order.status === "PAGO_EN_REVISION" ||
          order.status === "PAGADO") && (
          <button
            type="button"
            disabled={props.isPending}
            onClick={() => {
              if (window.confirm(`¿Cancelar el pedido ${order.code}?`)) {
                props.onCancel(order);
              }
            }}
            className={`${BUTTON} text-secondary/70 hover:bg-quaternary/25`}
          >
            Cancelar pedido
          </button>
        )}
      </footer>

      {rejecting && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (reason.trim().length >= 3) {
              props.onReject(order, reason.trim());
              setRejecting(false);
              setReason("");
            }
          }}
        >
          <label
            className="font-sans text-sm text-secondary"
            htmlFor={`reason-${order.id}`}
          >
            Motivo que verá la clienta
          </label>
          <input
            id={`reason-${order.id}`}
            value={reason}
            maxLength={300}
            onChange={(event) => setReason(event.target.value)}
            placeholder="el monto no coincide con el total"
            className="h-10 rounded-full border border-tertiary/40 bg-white px-4 font-sans text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={props.isPending || reason.trim().length < 3}
              className={`${BUTTON} bg-red-700 text-white`}
            >
              Rechazar y avisarle
            </button>
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className={`${BUTTON} text-secondary`}
            >
              Volver
            </button>
          </div>
        </form>
      )}
    </article>
  );
}

export function OrdersView(props: OrdersViewProps) {
  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="rounded-[2rem] bg-secondary p-6 text-primary sm:p-8">
          <h1 className="font-heading text-4xl sm:text-5xl">Pedidos</h1>
          <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
            Lo que las clientas piden por WhatsApp, con cómo lo quieren recibir
            y pagar. Al verificarlo, la clienta recibe el aviso de que puede
            recogerlo o de que va en camino, y el pedido pasa a por entregar. Si
            rechazas un comprobante, le llega el motivo.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Estado del pedido"
          className="flex flex-wrap gap-2"
        >
          {ORDER_TABS.map((tab) => {
            const selected = props.tab === tab.value;
            const count = tabCount(tab.value, props.summary);
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => props.onTabChange(tab.value)}
                className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                  selected
                    ? "border-secondary bg-secondary text-primary"
                    : "border-tertiary/40 text-secondary hover:bg-quaternary/25"
                }`}
              >
                {tab.label}
                {count !== null && (
                  <span className="tabular-nums opacity-70">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {props.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudieron cargar los pedidos.
            <button
              type="button"
              onClick={props.onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {props.isLoading && (
          <p className="font-sans text-sm text-secondary/70">
            Cargando pedidos…
          </p>
        )}

        {!props.isLoading && !props.isError && props.orders.length === 0 && (
          <p className="rounded-[1.5rem] border border-dashed border-tertiary/40 p-8 text-center font-sans text-sm text-secondary/70">
            No hay pedidos en esta pestaña.
          </p>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {props.orders.map((order) => (
            <OrderCard key={order.id} order={order} props={props} />
          ))}
        </div>
      </div>
    </main>
  );
}
