import { BrandLoader } from "@/src/components/brand/brand-loader";

export default function AdminLoading() {
  return (
    <main className="grid min-h-[70dvh] place-items-center bg-primary">
      <BrandLoader label="Cargando…" />
    </main>
  );
}
