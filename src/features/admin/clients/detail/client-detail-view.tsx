import type { ReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";
import type { ClientActions } from "@/src/features/admin/hooks/use-client-actions";
import type { ClientDetail, UpdateClientRequest } from "@/src/features/admin/types/clients.types";
import type { DashboardReservation } from "@/src/features/admin/types/dashboard.types";
import type { ClientCredit, DepositRecordView } from "@/src/features/admin/types/deposits.types";

import type { HistoryStatusFilter } from "../lib/client-crm";
import { ClientHeader } from "./components/client-header";
import { ClientKpis } from "./components/client-kpis";
import { ClientTabs, type ClientTab } from "./components/client-tabs";
import { ConsentsCard } from "./components/consents-card";
import { EditProfileDialog } from "./components/edit-profile-dialog";
import { HairProfileCard } from "./components/hair-profile-card";
import { HealthCard } from "./components/health-card";
import { HistoryTab } from "./components/history-tab";
import { NotesTab } from "./components/notes-tab";
import { PaymentsTab } from "./components/payments-tab";
import { ProfileCard } from "./components/profile-card";
import { UpcomingTab } from "./components/upcoming-tab";

export interface ClientDetailViewProps {
  client: ClientDetail;
  todayKey: string;
  nowMs: number;
  creditThousands: number;
  credits: readonly ClientCredit[];
  deposits: readonly DepositRecordView[];
  isPaymentsLoading: boolean;
  upcoming: readonly DashboardReservation[];
  isUpcomingLoading: boolean;
  tab: ClientTab;
  historyStatus: HistoryStatusFilter;
  historyQuery: string;
  isEditOpen: boolean;
  reservationActions: ReservationActions;
  clientActions: ClientActions;
  onTabChange: (tab: ClientTab) => void;
  onShowHistory: (status: HistoryStatusFilter) => void;
  onHistoryQueryChange: (query: string) => void;
  onEditOpenChange: (open: boolean) => void;
  onUpdate: (data: UpdateClientRequest) => Promise<boolean>;
  onCopy: (text: string, label: string) => void;
  onNewReservation: () => void;
  onOpenInCalendar: (reservationId: string) => void;
  onReschedule: (reservationId: string) => void;
  onViewClient: (clientId: string) => void;
}

export function ClientDetailView(props: ClientDetailViewProps) {
  const { client, todayKey, clientActions, tab } = props;
  const hasHealthConsent = client.consents.some((consent) => consent.type === "DATOS_SALUD");

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <ClientHeader
          client={client}
          todayKey={todayKey}
          creditThousands={props.creditThousands}
          onEditProfile={() => props.onEditOpenChange(true)}
          onNewReservation={props.onNewReservation}
        />

        <ClientKpis
          stats={client.stats}
          creditThousands={props.creditThousands}
          onShowHistory={props.onShowHistory}
          onShowTab={props.onTabChange}
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <ProfileCard client={client} todayKey={todayKey} onUpdate={props.onUpdate} onCopy={props.onCopy} />
            <HairProfileCard
              profile={client.hairProfile}
              nowMs={props.nowMs}
              isSaving={clientActions.isSaving}
              onSave={(data) => clientActions.setHairProfile(client.id, data)}
              onConfirm={() => clientActions.confirmHairProfile(client.id)}
            />
            <HealthCard
              client={client}
              hasConsent={hasHealthConsent}
              isSaving={clientActions.isSaving}
              onUpdate={props.onUpdate}
              onRecordConsent={() => clientActions.recordHealthConsent(client.id)}
            />
            <ConsentsCard consents={client.consents} />
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <ClientTabs tab={tab} upcomingCount={props.upcoming.length} onChange={props.onTabChange} />

            {tab === "upcoming" && (
              <UpcomingTab
                reservations={props.upcoming}
                isLoading={props.isUpcomingLoading}
                actions={props.reservationActions}
                onOpenInCalendar={props.onOpenInCalendar}
                onReschedule={props.onReschedule}
                onViewClient={props.onViewClient}
                onNewReservation={props.onNewReservation}
              />
            )}
            {tab === "history" && (
              <HistoryTab
                reservations={client.reservations}
                status={props.historyStatus}
                query={props.historyQuery}
                onStatusChange={props.onShowHistory}
                onQueryChange={props.onHistoryQueryChange}
                onOpenInCalendar={props.onOpenInCalendar}
              />
            )}
            {tab === "payments" && (
              <PaymentsTab
                clientName={client.name}
                deposits={props.deposits}
                credits={props.credits}
                isLoading={props.isPaymentsLoading}
              />
            )}
            {tab === "notes" && <NotesTab />}
          </div>
        </div>
      </div>

      <EditProfileDialog
        key={`${client.updatedAt}-${props.isEditOpen}`}
        open={props.isEditOpen}
        client={client}
        todayKey={todayKey}
        onOpenChange={props.onEditOpenChange}
        onSave={props.onUpdate}
      />
    </main>
  );
}
