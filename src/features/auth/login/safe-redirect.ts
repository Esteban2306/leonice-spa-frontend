const ADMIN_HOME = "/admin";
const LOGIN_PATH = "/admin/login";

export function safeAdminRedirect(target: string | null | undefined): string {
  if (!target) return ADMIN_HOME;
  if (!target.startsWith("/") || target.startsWith("//") || target.includes("\\")) {
    return ADMIN_HOME;
  }
  let url: URL;
  try {
    url = new URL(target, "http://leonice.local");
  } catch {
    return ADMIN_HOME;
  }
  if (url.origin !== "http://leonice.local") return ADMIN_HOME;
  const isAdmin = url.pathname === ADMIN_HOME || url.pathname.startsWith(`${ADMIN_HOME}/`);
  if (!isAdmin || url.pathname.startsWith(LOGIN_PATH)) return ADMIN_HOME;
  return `${url.pathname}${url.search}${url.hash}`;
}
