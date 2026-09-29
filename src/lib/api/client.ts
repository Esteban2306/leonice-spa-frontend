import { HttpClient } from "./http-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

const LOGIN_PATH = "/admin/login";

function redirectToLogin(): void {
  if (typeof window === "undefined") return;

  const { pathname, search } = window.location;

  if (pathname.startsWith(LOGIN_PATH)) return;

  window.location.replace(
    `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname + search)}`,
  );
}

export const httpClient = new HttpClient({
  baseUrl: apiUrl,
  refreshEndpoint: "/auth/refresh",
  onSessionExpired: redirectToLogin,
});
