import { HttpClient } from "./http-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

export const httpClient = new HttpClient({
  baseUrl: apiUrl,
  refreshEndpoint: "/auth/refresh",
});
