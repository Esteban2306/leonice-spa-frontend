import { Suspense } from "react";

import { ProductsContainer } from "@/src/features/admin/products/page/products-container";

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContainer />
    </Suspense>
  );
}
