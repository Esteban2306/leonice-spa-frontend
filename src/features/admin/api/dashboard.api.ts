import { httpClient } from "@/src/lib/api/client";

export interface DashboardSummaryResponse {
  date: string;

  header: {
    todayAppointments: number;
    pendingConfirmations: number;
  };

  metrics: {
    completedReservations: {
      value: number;
    };

    pendingReservations: {
      value: number;
    };

    dailyEarnings: {
      value: string;
      currency: string;
    };
  };
}

export const dashboardApi = {
  getSummary(): Promise<DashboardSummaryResponse> {
    return httpClient.request<DashboardSummaryResponse>(
      "/admin/dashboard/summary",
      "GET",
    );
  },
};
