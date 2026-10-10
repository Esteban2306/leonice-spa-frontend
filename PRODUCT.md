# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Dueña / administradora de Leonice Spa: configura catálogo, precios, capacidad y promociones con cuidado, principalmente desde computador.
- Recepción: consulta y gestiona reservas, clientes y servicios durante la atención, desde móvil o tablet.
- Ambos usos tienen el mismo peso (confirmado por el usuario el 2026-10-09).

## Product Purpose

Panel de administración del spa: reservas con depósito, calendario operativo, CRM de clientes y catálogo de servicios. Las clientas reservan por WhatsApp (bot Conduit) y por web; el panel es donde el equipo confirma, reagenda, cancela y mantiene el catálogo que alimenta la disponibilidad y los precios que ve el bot.

## Positioning

Spa capilar y de bienestar en Bogotá con perfil capilar por clienta, precios variables según largo y color de cabello, combos de varias categorías el mismo día y depósitos con vencimiento en horas operativas.

## Operating Context

- Zona horaria America/Bogota; montos en miles de COP en la API (35 = $35.000).
- Categorías actuales: Spa Capilar, Spa Coreano, Uñas (y una categoría de pruebas QA).
- La capacidad se controla por pools por categoría (citas simultáneas).
- Un servicio desactivado deja de ofrecerse para nuevas reservas; no existe borrado.

## Capabilities and Constraints

- Backend NestJS + Prisma; frontend Next 16 + React Query + base-ui.
- Todas las mutaciones viajan con Idempotency-Key.
- Arquitectura del frontend: container → view → componentes hoja, hooks de acciones con toasts (`runAdminAction`).

## Brand Commitments

- Nombre: Leonice Spa. Logo en `public/leonice-logo-w.png`.
- Mundo visual incumbente en código (tokens en `src/globals.css`, pantallas Dashboard, Calendario y CRM): se conserva y se extiende.
- Copy en español de Colombia.

## Evidence on Hand

- Catálogo real en base de datos (categorías, servicios, pools). Precios de Uñas entregados por el usuario el 2026-10-09.
- No hay fotos de servicios ni testimonios; no se deben inventar.

## Product Principles

1. El catálogo es la fuente de verdad del bot y del calendario: cada cambio debe ser explícito y confirmado.
2. Nada se borra: se activa o desactiva para conservar el historial de reservas.
3. Mismo lenguaje en todas las pantallas del panel: lo aprendido en Dashboard, Calendario y CRM sirve aquí.
