import { httpClient } from "@/src/lib/api/client";

export const dashboardApi = {
  getSummary() {
    return httpClient.request("/admin/dashboard/summary", "GET");
  },
};
