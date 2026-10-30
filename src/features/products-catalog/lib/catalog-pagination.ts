export type PageEntry = number | "gap";

const SIBLINGS = 1;

export function pageWindow(page: number, pageCount: number): PageEntry[] {
  const visible = new Set<number>([1, pageCount]);
  for (let offset = -SIBLINGS; offset <= SIBLINGS; offset += 1) {
    const candidate = page + offset;
    if (candidate >= 1 && candidate <= pageCount) visible.add(candidate);
  }
  const sorted = [...visible].sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined) {
      if (value - previous === 2) entries.push(previous + 1);
      else if (value - previous > 2) entries.push("gap");
    }
    entries.push(value);
  });
  return entries;
}
