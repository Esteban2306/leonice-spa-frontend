import Link from "next/link";
import {
  CalendarPlus,
  Cake,
  Keyboard,
  MessageCircle,
  Pencil,
  Phone,
  TriangleAlert,
  Wallet,
} from "lucide-react";

import { formatBogotaDayLabel } from "@/src/lib/date/bogota";
import { formatCopFromThousands } from "@/src/lib/money/cop";
import type { ClientDetail } from "@/src/features/admin/types/clients.types";

import { ClientInitialsAvatar } from "../../components/client-avatar";
import { HairStatusChip } from "../../components/hair-status-chip";
import { ageOn, daysUntilBirthday, isBirthdaySoon } from "../../lib/client-crm";

interface ClientHeaderProps {
  client: ClientDetail;
  todayKey: string;
  creditThousands: number;
  onEditProfile: () => void;
  onNewReservation: () => void;
}

const CHIP = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[11px]";
const ACTION =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export function ClientHeader({
  client,
  todayKey,
  creditThousands,
  onEditProfile,
  onNewReservation,
}: ClientHeaderProps) {
  const age = ageOn(client.birthDate, todayKey);
  const birthdayIn = daysUntilBirthday(client.birthDate, todayKey);
  const whatsapp = `https://wa.me/${client.phone.replace(/\D/g, "")}`;

  return (
    <header className="relative overflow-hidden rounded-[2rem] bg-secondary p-6 text-primary sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border border-tertiary/20" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Ruta" className="font-sans text-xs text-primary/60">
          <Link href="/admin" className="hover:text-primary">Panel admin</Link>
          <span className="mx-2">/</span>
          <Link href="/admin/clients" className="hover:text-primary">Clientes</Link>
          <span className="mx-2">/</span>
          <span className="text-tertiary">Ficha CRM</span>
        </nav>
        <span className="hidden items-center gap-1.5 rounded-full border border-primary/15 px-3 py-1 font-sans text-[11px] text-primary/60 md:inline-flex">
          <Keyboard className="size-3.5" /> E editar · W WhatsApp
        </span>
      </div>

      <div className="relative mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <ClientInitialsAvatar name={client.name} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate font-heading text-3xl sm:text-4xl">{client.name}</h1>
            <p className="mt-1 font-sans text-sm text-primary/65">
              {client.phone} · Alta: {formatBogotaDayLabel(client.createdAt)} · Actualizado:{" "}
              {formatBogotaDayLabel(client.updatedAt)}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <HairStatusChip status={client.hairProfile.status} />
              {creditThousands > 0 && (
                <span className={`${CHIP} bg-primary text-secondary`}>
                  <Wallet className="size-3" />
                  Crédito {formatCopFromThousands(creditThousands)}
                </span>
              )}
              <span className={`${CHIP} ${isBirthdaySoon(client.birthDate, todayKey) ? "bg-tertiary text-secondary" : "bg-primary/10 text-primary/80"}`}>
                <Cake className="size-3" />
                {birthdayIn === 0
                  ? `¡Cumple hoy! · ${age} años`
                  : isBirthdaySoon(client.birthDate, todayKey)
                    ? `Cumple en ${birthdayIn} días · ${age} años`
                    : `${age} años`}
              </span>
              {client.allergies && (
                <span className={`${CHIP} bg-red-100 text-red-800`}>
                  <TriangleAlert className="size-3" />
                  Alerta: alergias
                </span>
              )}
              {client.isPregnant && (
                <span className={`${CHIP} bg-amber-100 text-amber-900`}>Embarazo</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={`tel:${client.phone}`} className={`${ACTION} bg-primary text-secondary hover:bg-quaternary/60`}>
            <Phone className="size-4" /> Llamar
          </a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${ACTION} bg-green-700 text-white hover:bg-green-800`}>
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <button type="button" onClick={onEditProfile} className={`${ACTION} bg-tertiary text-secondary hover:bg-quaternary`}>
            <Pencil className="size-4" /> Editar perfil
          </button>
          <button
            type="button"
            onClick={onNewReservation}
            aria-label="Nueva reserva para este cliente"
            title="Nueva reserva"
            className={`${ACTION} border border-primary/20 px-3.5 text-primary hover:bg-primary/10`}
          >
            <CalendarPlus className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
