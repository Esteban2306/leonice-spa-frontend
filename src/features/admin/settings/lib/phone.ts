export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("57") && digits.length === 12) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export function isPlausiblePhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function initialsOf(name: string): string {
  const letters = name
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0] ?? "")
    .filter(Boolean);
  return (letters.slice(0, 2).join("") || "?").toUpperCase();
}
