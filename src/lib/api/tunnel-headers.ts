const TUNNEL_HOST = /(^|\.)ngrok(-free)?\.(dev|app|io)$/i;

export function tunnelHeaders(baseUrl: string): Record<string, string> {
  try {
    return TUNNEL_HOST.test(new URL(baseUrl).hostname) ? { "ngrok-skip-browser-warning": "1" } : {};
  } catch {
    return {};
  }
}
