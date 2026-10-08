const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const COP_THOUSAND = 1000;

export function thousandsToPesos(value: number | string): number {
  return Number(value) * COP_THOUSAND;
}

export function pesosToThousands(pesos: number): number {
  return Math.round((pesos / COP_THOUSAND) * 100) / 100;
}

export function formatCopFromThousands(value: number | string): string {
  return COP_FORMATTER.format(thousandsToPesos(value));
}

export function formatCop(pesos: number): string {
  return COP_FORMATTER.format(pesos);
}
