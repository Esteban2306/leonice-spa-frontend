export const adminQueryKeys = {
  all: ["admin"] as const,

  dashboard: {
    all: () => [...adminQueryKeys.all, "dashboard"] as const,
    summary: () => [...adminQueryKeys.dashboard.all(), "summary"] as const,
  },

  reservations: {
    all: () => [...adminQueryKeys.all, "reservations"] as const,
    lists: () => [...adminQueryKeys.reservations.all(), "list"] as const,
    list: (params?: unknown) =>
      [...adminQueryKeys.reservations.lists(), params] as const,
    details: () => [...adminQueryKeys.reservations.all(), "detail"] as const,
    detail: (reservationId: string) =>
      [...adminQueryKeys.reservations.details(), reservationId] as const,
    availability: (params: unknown) =>
      [...adminQueryKeys.reservations.all(), "availability", params] as const,
    availabilityCalendar: (params: unknown) =>
      [
        ...adminQueryKeys.reservations.all(),
        "availability-calendar",
        params,
      ] as const,
  },

  deposits: {
    all: () => [...adminQueryKeys.all, "deposits"] as const,
    lists: () => [...adminQueryKeys.deposits.all(), "list"] as const,
    list: (params?: unknown) =>
      [...adminQueryKeys.deposits.lists(), params] as const,
    pending: (params: unknown) =>
      [...adminQueryKeys.deposits.all(), "pending", params] as const,
    byReservation: (reservationId: string) =>
      [...adminQueryKeys.deposits.all(), "reservation", reservationId] as const,
    credits: (clientId: string) =>
      [...adminQueryKeys.deposits.all(), "credits", clientId] as const,
  },

  clients: {
    all: () => [...adminQueryKeys.all, "clients"] as const,
    lists: () => [...adminQueryKeys.clients.all(), "list"] as const,
    list: (params: unknown) =>
      [...adminQueryKeys.clients.lists(), params] as const,
    details: () => [...adminQueryKeys.clients.all(), "detail"] as const,
    detail: (clientId: string) =>
      [...adminQueryKeys.clients.details(), clientId] as const,
  },

  categories: {
    all: () => [...adminQueryKeys.all, "categories"] as const,
    lists: () => [...adminQueryKeys.categories.all(), "list"] as const,
    details: () => [...adminQueryKeys.categories.all(), "detail"] as const,
    detail: (categoryId: string) =>
      [...adminQueryKeys.categories.details(), categoryId] as const,
  },

  treatments: {
    all: () => [...adminQueryKeys.all, "treatments"] as const,
    lists: () => [...adminQueryKeys.treatments.all(), "list"] as const,
    list: (params?: unknown) =>
      [...adminQueryKeys.treatments.lists(), params] as const,
    details: () => [...adminQueryKeys.treatments.all(), "detail"] as const,
    detail: (treatmentId: string) =>
      [...adminQueryKeys.treatments.details(), treatmentId] as const,
    hairLengthPricing: (treatmentId: string) =>
      [
        ...adminQueryKeys.treatments.all(),
        "hair-length-pricing",
        treatmentId,
      ] as const,
    hairColorSurcharges: (treatmentId: string) =>
      [
        ...adminQueryKeys.treatments.all(),
        "hair-color-surcharges",
        treatmentId,
      ] as const,
    hairPricingMatrix: (treatmentId: string) =>
      [
        ...adminQueryKeys.treatments.all(),
        "hair-pricing-matrix",
        treatmentId,
      ] as const,
  },

  products: {
    all: () => [...adminQueryKeys.all, "products"] as const,
    lists: () => [...adminQueryKeys.products.all(), "list"] as const,
    list: (params?: unknown) =>
      [...adminQueryKeys.products.lists(), params] as const,
    details: () => [...adminQueryKeys.products.all(), "detail"] as const,
    detail: (productId: string) =>
      [...adminQueryKeys.products.details(), productId] as const,

    categories: {
      all: () => [...adminQueryKeys.products.all(), "categories"] as const,
      lists: () =>
        [...adminQueryKeys.products.categories.all(), "list"] as const,
    },

    tags: {
      all: () => [...adminQueryKeys.products.all(), "tags"] as const,
      lists: () => [...adminQueryKeys.products.tags.all(), "list"] as const,
    },

    recommendations: (treatmentId: string) =>
      [
        ...adminQueryKeys.products.all(),
        "recommendations",
        treatmentId,
      ] as const,

    recommendedForClient: (phone: string) =>
      [
        ...adminQueryKeys.products.all(),
        "recommended-for-client",
        phone,
      ] as const,

    related: (productId: string) =>
      [...adminQueryKeys.products.all(), "related", productId] as const,
  },

  promotions: {
    all: () => [...adminQueryKeys.all, "promotions"] as const,
    lists: () => [...adminQueryKeys.promotions.all(), "list"] as const,
    list: (params?: unknown) =>
      [...adminQueryKeys.promotions.lists(), params] as const,
    details: () => [...adminQueryKeys.promotions.all(), "detail"] as const,
    detail: (promotionId: string) =>
      [...adminQueryKeys.promotions.details(), promotionId] as const,
  },

  capacityPools: {
    all: () => [...adminQueryKeys.all, "capacity-pools"] as const,
    byCategory: (categoryId: string) =>
      [...adminQueryKeys.capacityPools.all(), "category", categoryId] as const,
    detail: (poolId: string) =>
      [...adminQueryKeys.capacityPools.all(), "detail", poolId] as const,
  },

  automationRules: {
    all: () => [...adminQueryKeys.all, "automation-rules"] as const,
    lists: () => [...adminQueryKeys.automationRules.all(), "list"] as const,
    list: (params?: unknown) =>
      [...adminQueryKeys.automationRules.lists(), params] as const,
  },

  calendar: {
    all: () => [...adminQueryKeys.all, "calendar"] as const,
    range: (params: unknown) =>
      [...adminQueryKeys.calendar.all(), "range", params] as const,
  },

  schedule: {
    all: () => [...adminQueryKeys.all, "schedule"] as const,
    day: (date: string) =>
      [...adminQueryKeys.schedule.all(), "day", date] as const,
    exceptions: (params: unknown) =>
      [...adminQueryKeys.schedule.all(), "exceptions", params] as const,
  },
};
