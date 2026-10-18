import { Suspense } from "react";

import { TestimonialsContainer } from "@/src/features/admin/testimonials/page/testimonials-container";

export default function TestimonialsPage() {
  return (
    <Suspense>
      <TestimonialsContainer />
    </Suspense>
  );
}
