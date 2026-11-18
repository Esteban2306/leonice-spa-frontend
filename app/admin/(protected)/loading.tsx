import { BrandLoader } from "@/src/components/brand/brand-loader";

export default function AdminLoading() {
  return (
    <main className="grid min-h-[70dvh] place-items-center">
      <BrandLoader label="Cargando…" />
    </main>
  );
}
