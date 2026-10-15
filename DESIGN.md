---
name: Leonice Arenas Spa Capilar
description: Spa capilar con criterio clínico; crema, verde profundo y oro bajo una luz de ventana que se mueve con el scroll.
colors:
  ink: "#062112"
  ink-hover: "#0D3320"
  forest: "#0B2C1A"
  cream: "#F2EBDB"
  paper: "#FDF8F1"
  linen: "#EDE3D0"
  gold: "#BF9250"
  sand: "#E0BC87"
  sand-hover: "#D4AA6A"
  umber: "#7A5A2C"
  umber-deep: "#5C4521"
typography:
  display:
    fontFamily: "Italiana, serif"
    fontSize: "clamp(2.75rem, 5.2vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Italiana, serif"
    fontSize: "clamp(2.25rem, 4.6vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Italiana, serif"
    fontSize: "clamp(1.5rem, 2.2vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.25
  title-sans:
    fontFamily: "Inria Sans, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.375
  numeral:
    fontFamily: "Inria Sans, sans-serif"
    fontSize: "clamp(3rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  body-lg:
    fontFamily: "Inria Sans, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Inria Sans, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inria Sans, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  pill: "9999px"
  surface-lg: "2rem"
  surface-md: "1.75rem"
  surface-sm: "1.5rem"
  surface-xs: "1.25rem"
spacing:
  gutter-mobile: "1.25rem"
  gutter: "2rem"
  card: "1.5rem"
  section-mobile: "6rem"
  section: "8rem"
components:
  button-sand:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    typography: "{typography.body}"
    height: "3rem"
    padding: "0 1.5rem"
  button-sand-hover:
    backgroundColor: "{colors.sand-hover}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "3rem"
    padding: "0 1.5rem"
  button-ink-hover:
    backgroundColor: "{colors.ink-hover}"
  button-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "3.5rem"
    padding: "0 1.75rem"
  button-outline-ink:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
    padding: "0 1rem"
  button-outline-ink-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  card-treatment:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface-lg}"
    padding: "{spacing.card}"
  card-product:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface-md}"
    padding: "1.25rem"
  card-metric:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface-md}"
    padding: "{spacing.card}"
  card-promise:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
    rounded: "{rounded.surface-lg}"
    padding: "2rem"
  nav-panel:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface-md}"
    padding: "{spacing.card}"
  chip-status:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sand}"
    rounded: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "0.375rem 0.75rem"
---

# Design System: Leonice Arenas Spa Capilar

## Overview

**Creative North Star: "Luz de ventana"**

Leonice es una sala de tratamiento con una ventana a un lado: una luz cálida entra desde la izquierda y todo en la página responde a ella. Las superficies proyectan su sombra hacia el lado contrario al sol, encienden un filo claro en el borde que mira a la luz y, al tocarlas, emiten un brillo propio que sigue al puntero. Con el scroll el sol baja de la mañana a la tarde, y las sombras giran con él. Esa luz es el sistema; los colores, radios y tipos existen para que se note.

El mundo es el incumbente del proyecto, compartido con el panel administrativo: papel crema, verde profundo para los bloques de autoridad, oro y arena como acentos que funcionan como luz. Italiana pone la voz serena y alta de los titulares; Inria Sans lleva el texto, los precios y los datos. La densidad es holgada: secciones de 6 a 8 rem, superficies grandes y redondeadas, pocos elementos por vista. La calidez es literal: no hay sombras grises ni negras sobre crema, solo sombras marrón tostado.

Donde todavía no hay fotografía, el sistema lo dice con honestidad: los marcos de imagen muestran un estado "Sin imagen" rayado y nombrado, nunca una foto de relleno.

**Key Characteristics:**
- Un vector de sol compartido (`--sun-dx`, `--sun-dy`) gobierna todas las sombras, filos y reflejos de la página.
- Paleta cálida de tres familias: crema/papel, verde profundo, oro/arena; sin grises neutros en la superficie pública.
- Titulares en Italiana a gran escala con interlineado apretado; texto y cifras en Inria Sans.
- Superficies grandes y muy redondeadas (20–32 px) y acciones en píldora.
- Estado "sin imagen" explícito y digno en lugar de imágenes genéricas.
- Movimiento con desaceleración larga (expo out) y respeto estricto por `prefers-reduced-motion`.

## Colors

Una paleta de papel cálido y bosque profundo en la que el oro no decora: es la luz.

### Primary
- **Verde Bosque Profundo** (ink): color de autoridad. Todo el texto principal sobre crema, la acción "ink", el footer, los chips de promoción y los fondos de bloques oscuros. Es casi negro pero siempre verde; nunca se sustituye por negro puro.
- **Bosque de Sombra** (forest): fondo de las tarjetas oscuras de la promesa, un paso más claro que ink para que el gradiente de lectura inferior se distinga del bloque.
- **Bosque Encendido** (ink-hover): solo estado hover de las superficies y botones ink.

### Secondary
- **Oro de Tarde** (gold): el acento de luz. Subrayados de enlace, indicador activo del navbar, barra inferior de las tarjetas de tratamiento, sufijos de las métricas, anillo de foco (2 px, desplazado 3 px), selección de texto y barra de scroll. Como campo completo aparece una sola vez: el bloque de visita y contacto.
- **Arena Cálida** (sand): la acción principal (botón "sand"), los títulos de columna del footer, los filos encendidos sobre superficies oscuras y el texto de chips sobre verde.
- **Arena Tostada** (sand-hover): solo estado hover de las acciones sand.

### Neutral
- **Papel** (paper): fondo de la página y de las tarjetas claras de tratamiento y métricas.
- **Crema** (cream): superficies elevadas sobre papel (paneles del navbar, mapa, tarjetas-portal claras) y texto sobre verde.
- **Lino** (linen): fondo de las tarjetas de producto, un tono más tostado para separarlas de los tratamientos.
- **Tierra** (umber): texto del estado "sin imagen" y pies de figura de las historias.
- **Tierra Profunda** (umber-deep): texto secundario descriptivo sobre crema y lino (detalle de tratamiento, marca del producto).

Las transparencias de ink (85 %, 80 %, 70 %, 45 %) son la escala de jerarquía de texto sobre claro; las de cream (80 %, 75 %, 70 %, 60 %) lo son sobre verde.

### Named Rules
**The Warm Shadow Rule.** Las sombras sobre superficies claras se tiñen de marrón tostado (`rgb(74 46 16)`), nunca de gris ni de negro. El negro solo aparece en la sombra de las superficies verdes, donde un marrón se perdería.

**The Gold Is Light Rule.** El oro marca lo que la luz toca: foco, subrayado, estado activo, un filo. No se usa como fondo de tarjetas ni de botones; el único campo dorado completo es el bloque de visita.

## Typography

**Display Font:** Italiana (con serif)
**Body Font:** Inria Sans (con sans-serif)

**Character:** Italiana es alta, fina y de un solo peso: aporta la calma de un rótulo de spa y solo funciona grande. Inria Sans es humanista y algo cálida, firme en negrita para precios y cifras.

### Hierarchy
- **Display** (400, clamp 2.75–4.75 rem, 1.02): titular del héroe, uno por página. Se revela por palabras con máscara de línea.
- **Headline** (400, clamp 2.25–4 rem, 1.02): títulos de sección (`SectionHeading`), con `text-balance` y un leve texto iluminado por el sol.
- **Title** (400, clamp 1.5–2 rem, 1.25): títulos dentro de tarjetas-portal y superficies grandes; en el menú móvil sube a 2.25 rem.
- **Title Sans** (700, 1.25 rem, 1.375): nombres de tratamientos y productos. Los nombres de catálogo van en Inria Sans porque son datos, no voz.
- **Numeral** (700, clamp 3–4.5 rem, 1, cifras tabulares): valores de las métricas.
- **Body Large** (400, 1.125 rem, 1.625): entradillas de sección, máximo 46–58 ch.
- **Body** (400, 0.95 rem, 1.625): texto de tarjetas y navegación.
- **Label** (700, 11–14 px, 0.12–0.16 em, mayúsculas): solo rótulos funcionales: términos de una lista de datos (horario, WhatsApp, dirección), títulos de columna del footer, chips de estado ("Sin imagen", "Antes/Después", "Próximamente").

### Named Rules
**The Display Is Italiana Only Rule.** Todo titular de sección o héroe es Italiana a escala de clamp; nunca Inria Sans en negrita haciendo de titular.

**The Label Is Data Rule.** Las mayúsculas espaciadas nombran un dato o un estado. No van encima de un titular como antetítulo decorativo.

## Layout

Contenedor centrado de 1440 px con márgenes laterales de 1.25 rem en móvil y 2 rem desde 640 px. Las secciones respiran con 6 rem verticales en móvil y 8 rem desde 640 px (la de visita usa 7 rem). La rejilla cambia a composición de escritorio en el breakpoint propio `desk` (64 rem): el héroe pasa a tres columnas (texto, línea vertical, portales), la sección de métricas y la de visita a dos columnas asimétricas (0.9/1.1 y 1/1.05). Por debajo de 64 rem todo se apila en una columna y las rejillas de tarjetas bajan a dos columnas en 640 px.

Los huecos internos siguen un ritmo de 1.25, 1.5, 2, 2.5 y 3.5 rem: 1.25 rem entre tarjetas, 2–2.5 rem entre bloques de texto, 3–3.5 rem entre columnas. Las tarjetas usan 1.5 rem de padding (2 rem en las de la promesa desde 640 px).

El navbar es fijo, mide 5.5 rem y se compacta a 4.5 rem al hacer scroll; las secciones con ancla reservan ese alto con `scroll-margin-top`. El héroe ocupa al menos `100svh`.

## Elevation & Depth

El sol vive en la barra de desplazamiento. Está justo fuera del borde derecho de la ventana, a la altura del pulgar de la barra (`scrollThumbCenter`), y se desliza hacia esa altura con una inercia suave (14 % por frame) para que la luz nunca salte. Cada superficie visible recibe su propia relación con ese sol: dirección normalizada desde el sol hacia su centro (`--sx`, `--sy`) y distancia relativa a la diagonal de la ventana (`--sd`). Con esos tres números la sombra exterior cae hacia el lado contrario al sol y un brillo interno aparece en el borde que lo mira; un componente arriba y otro abajo se iluminan distinto, y al bajar por la página el sol baja con la barra y las sombras giran. Las páginas del admin no usan este sistema.

Implementación: `useScrollSun` (en `SunlightStage`) observa con `IntersectionObserver` solo las superficies visibles, mide todas las posiciones y después escribe, y solo reescribe una variable cuando su valor cuantizado cambia (dirección en pasos de 0.04, distancia en 0.05). `--sx`, `--sy` y `--sd` están registradas con `@property` como no heredables, así un cambio solo recalcula esa superficie. La raíz guarda una versión gruesa (`--sun-dx`, `--sun-dy`) para el texto iluminado y controles pequeños. Con movimiento reducido el sol queda fijo al 25 % del recorrido.

### Shadow Vocabulary
Todas las sombras salen de una sola receta en `src/features/landing/sunlight.css` (un único `box-shadow` de seis capas y cinco pasadas de desenfoque: sombra proyectada que se alarga y suaviza con la distancia, sombra de contacto, filo encendido del lado del sol, penumbra interna del lado opuesto que da relieve, brillo ámbar cercano al borde iluminado y resplandor dorado amplio). La intensidad sigue `--sun-heat`, el cuadrado de la cercanía al sol medida hasta el borde más próximo del componente: lo que está junto a la barra se enciende mucho más que lo lejano. Mientras el sol se mueve las superficies se actualizan en saltos gruesos (0.1) y al detenerse reciben el valor fino (0.04); al pasar el mouse, `.lit-hover` además de elevarse sube el brillo interno. Las clases solo cambian sus parámetros (`--lift`, `--sun-tint`, `--sun-cast`, `--sun-rim`, `--sun-shine`, `--sun-glow`):
- **`.lit`**: superficie clara sobre papel o dorado; sombra tostada `rgb(74 46 16)`, filo crema, resplandor crema cálido.
- **`.lit-dark`**: superficie verde; sombra negra, filo y resplandor arena.
- **`.sun-shadow`**: acciones y piezas pequeñas claras (botones sand y cream, el asa de las historias); `--lift` 7 px.
- **`.sun-shadow-ink`**: acciones y barras verdes (botón ink, CTA de galería, barra de reserva móvil, número activo del ritual).
- **`.sun-glass`**: vidrio flotante (navbar, barras de filtros); filo blanco y sombra más amplia.
- **`.sun-panel`**: paneles grandes; las galerías (`.why-gallery`, `.treatments-gallery`) usan la misma receta con sus parámetros.
- **`.lit-hover`**: sube `--lift` de 18 a 30 px en hover o foco, solo con puntero fino; la elevación se anima por ser una propiedad registrada.
- **Halo del sol** (`.sun-halo`): luz ámbar cálida que nace del borde derecho a la altura de la barra; núcleo difuso que respira (7 s) y cinco haces anchos y desiguales sin bordes, desenfocados con blur (26–32 px) para que lean como luz real y no como rayos; los haces se balancean ±5° en 22 s desde un contenedor, sin re-rasterizar el blur. Se mueve solo con `transform`. En escritorio se mezcla en soft-light; en táctil queda tenue.
- **Penumbra** (`.sun-shade`): degradado radial tostado (`rgb(74 46 16)` de 0 a 11–14 %) centrado en el sol, que oscurece suavemente la página lejos de la luz para que la iluminación se note; mezcla normal y movida solo con `transform`.
- **Barra de desplazamiento**: pulgar dorado con degradado radial y resplandor propio; pista de papel. Firefox usa `scrollbar-color` dorado.
- **Brillo al puntero** (`.glow`) y **texto iluminado** (`.sunlit-text`) se mantienen.

### Named Rules
**The Scrollbar Sun Rule.** Ninguna sombra lleva desplazamiento fijo: toda superficie que proyecte sombra usa una de las clases solares y queda registrada en `SUN_SURFACES`. Un `shadow-[…]` de Tailwind en la web pública rompe el mundo; los únicos brillos permitidos fuera del sistema son emisiones de luz (el indicador del navbar, la línea de las historias) y anillos de foco.

**The Lift On Intent Rule.** Las superficies se elevan (de 18 a 30 px de `--lift`) solo ante hover o foco interno, y solo en dispositivos con hover. En táctil la elevación queda en reposo.

## Shapes

Formas blandas y generosas. Las superficies grandes (tratamientos, portales, promesa, mapa) usan 2 rem; las medianas (productos, métricas, paneles del navbar) 1.75 rem; los avisos y la tarjeta de reseñas 1.5 rem; las tarjetas de producto compactas 1.25 rem. Todo lo accionable (botones, chips, iconos circulares, enlaces subrayados con zona de toque) es píldora. Las imágenes se recortan con `overflow-hidden` dentro del radio de su superficie; el brillo del puntero hereda el radio. Los bordes son raros y finos: un trazo de ink al 15 % en las métricas, oro al 25 % en paneles y separadores del menú, y trazo discontinuo solo para marcar estados pendientes.

## Components

### Buttons
Píldoras tácticas y cálidas que reaccionan a la luz.
- **Shape:** píldora completa (9999 px). Tres tamaños: 2.5, 3 y 3.5 rem de alto con 1, 1.5 y 1.75 rem de padding horizontal.
- **Sand (principal):** fondo arena, texto ink, Inria Sans 700; es la acción de reserva.
- **Ink:** fondo verde profundo, texto crema; acción fuerte sobre claro.
- **Cream:** fondo crema sobre el degradado del héroe; hover a blanco.
- **Outline ink / outline cream:** trazo al 70 % que se rellena por completo en hover.
- **Enlace:** texto con subrayado de 2 px desplazado 6 px, oro sobre claro o arena sobre verde; el subrayado toma el color del texto en hover.
- **Hover / Focus:** cambio de fondo en 300 ms con expo out, un destello diagonal que cruza el botón en 700 ms y una flecha que avanza 4 px; al pulsar escala a 0.97. El foco es un anillo dorado de 2 px desplazado 3 px.

### Chips
- **Estado:** píldora de 11–12 px en Label. Promoción: verde con texto arena e icono. Antes/Después: verde al 85 % o papel al 90 % sobre la foto.
- **Pendiente:** trazo discontinuo en oro (sobre claro) o arena (sobre verde) para "Sin imagen" y para datos que aún no están configurados ("Próximamente": mapa, WhatsApp, reseñas). En verde al 70 % sobre el campo dorado.

### Cards / Containers
- **Corner Style:** 2 rem (tratamiento, promesa), 1.75 rem (producto, métrica), 1.25 rem (producto compacto).
- **Background:** papel para tratamientos y métricas, lino para productos, bosque para la promesa, crema para portales claros.
- **Shadow Strategy:** superficie iluminada clara u oscura más brillo al puntero (ver Elevation & Depth).
- **Border:** solo las métricas llevan un trazo de ink al 15 %.
- **Internal Padding:** 1.5 rem; 2 rem en la promesa desde 640 px.
- **Tratamiento:** la imagen se acerca un 5 % en 1.2 s, una barra dorada de 3 px se completa en la base de la imagen y el detalle se despliega (fila de rejilla de 0 a 1 fr) en hover, foco o con "Ver más".

### Navigation
- **Navbar:** transparente sobre el héroe; al hacer scroll pasa a papel al 88 % con desenfoque y sombra solar, y baja de 5.5 a 4.5 rem. Rejilla de tres columnas: enlaces, logo centrado, acción de reserva.
- **Enlaces:** Inria Sans 0.95 rem en píldoras de 2.75 rem de alto; el activo lleva una línea dorada de 2 px que se desliza entre enlaces.
- **Paneles de vista previa:** desde el navbar se despliegan paneles crema con radio de 1.75 rem, borde dorado al 25 % y superficie iluminada, revelados con recorte vertical en 500 ms.
- **Móvil:** menú a pantalla completa sobre papel con enlaces en Italiana de 2.25 rem, separados por trazos dorados al 25 % y revelados en cascada.

### Marco de imagen (signature)
El `MediaFrame` muestra la foto cuando existe y, si no, un estado "Sin imagen" con rayado diagonal de 1 px cada 14 px sobre un degradado tostado (o verde en tono oscuro), un chip discontinuo con icono y la descripción de la foto que falta. Es un estado del sistema, no un placeholder temporal: cualquier superficie con imagen lo hereda.

### Sol del escenario (signature)
El `SunlightStage` envuelve todas las páginas públicas (landing, tratamientos y productos), pone el sol en el pulgar de la barra de desplazamiento y da a cada superficie visible su propia luz (ver Elevation & Depth). El halo del sol nace del borde derecho a la altura de la barra; en escritorio con hover se mezcla en soft-light con más intensidad, en móvil queda tenue.

### Atmósfera de sección (signature)
Cada sección de la landing y el footer llevan detrás del contenido una `SectionAtmosphere` (preset por sección en `atmosphere-presets.ts`, tonos `hero`, `paper`, `cream`, `forest` y `gold`) que hace visible la sala con ventana:
- **Luz de ventana:** cuatro paños de luz cálida separados por el parteluz, inclinados y desenfocados (16 px), con un resplandor radial alrededor. Con el scroll la mancha cruza la sección en diagonal, gira unos grados y se enciende hacia el centro de la sección, como el sol moviéndose por la tarde.
- **Sombra de hojas:** dentro de la luz, una rama de olivo o eucalipto (geometría generada en `atmosphere-geometry.ts`) en marrón tostado o negro sobre verde, desenfocada 2.5 px, que se mece ±2° en 9 s solo mientras la sección está en pantalla.
- **Hebras doradas:** un mechón de 5 a 6 hebras de 1 px (oro sobre claro, arena sobre verde, crema sobre el campo dorado) que se dibuja con el scroll al entrar la sección; un brillo corto recorre la hebra central a medida que avanzas.
- **Grano de papel:** ruido fino tostado (crema sobre verde) al 5–8 %.
Solo se animan `transform`, `opacity` y `stroke-dashoffset`; la capa usa `contain: strict` y queda en `z-index: -1` dentro de la sección aislada. Con movimiento reducido las hebras aparecen dibujadas y nada se mueve.

### Transición del hero
Solo el paso del hero a "Por qué Leonice" se monta: el hero es `position: sticky` y queda fijo, sin achicarse ni oscurecerse, mientras la sección siguiente sube por encima con las esquinas superiores redondeadas (2.5 rem). Cuando la sección cubre por completo, `useSectionStack` marca el hero como cubierto (`visibility: hidden`) y el motor del sol lo ignora. Las demás secciones se desplazan normalmente. Con movimiento reducido el hero no se fija. `scrollToSection` aterriza en la posición natural y el navbar elige la sección activa con `currentLayerId`.

### Galerías
La galería en acordeón del "porqué" y el carrusel circular de historias son componentes vendorizados que la landing tiñe con el mismo sistema: los paneles del acordeón usan sombra solar y filo de arena (el activo sube a una elevación mayor con un halo interior cálido) y el carrusel divide cada cara en antes/después según el giro, ocultando los rótulos mientras gira.

### Páginas de tratamientos
Las rutas `/tratamientos` heredan el mismo mundo y todo sale del catálogo (`/showcase` del backend); ningún tratamiento tiene diseño propio.
- **Carta de categorías:** una fila por categoría sobre papel, con icono en círculo arena, nombre en Italiana a gran escala, frase guía y datos (servicios, duración, desde) en cifras tabulares. Al pasar, un barrido verde de izquierda a derecha inunda la fila (700 ms, expo out) y el texto cambia a crema y arena. La primera categoría lleva más aire.
- **Doble bisel:** las tarjetas de video viven dentro de una bandeja de 0.375 rem (`.bezel`, ink al 5 % con trazo interior al 6 %) y el núcleo usa el radio concéntrico `calc(2rem - 0.375rem)` con un filo crema superior. Solo para medios (video) y tarjetas de tratamiento.
- **Video del procedimiento:** se reproduce en silencio al estar visible en más del 55 % (portada) o al pasar el puntero (tarjeta), con controles circulares crema translúcidos, barra de progreso arena de 2 px y pantalla completa. Sin video, el marco usa el estado rayado verde con el chip discontinuo "Video en preparación" y anima los títulos reales de los pasos, uno tras otro; nunca un video de relleno.
- **Ritual paso a paso (signature):** columna izquierda fija con el título y la acción; a la derecha, pasos numerados sobre una línea dorada que se llena con el scroll. El paso en lectura se enciende (círculo ink con número arena y tarjeta iluminada); los anteriores quedan encendidos y los siguientes al 60 %.
- **Contenido en revisión:** mientras el spa no valide la descripción de un servicio, la ficha muestra el chip discontinuo "Descripción en revisión".
- **Barra de reserva móvil:** al salir de la portada aparece una píldora verde fija abajo con nombre, duración, precio y la acción arena; solo por debajo de `desk`.

### Vitrina de productos
`/productos` es una rejilla de tarjetas (1 columna en móvil, 2 desde 480 px, 3 en `desk`, 4 en xl); todo sale de `/catalog/products` del backend.
- **Tarjeta de producto:** doble bisel con superficie iluminada; foto sobre lino (4:5, 4:3 en una sola columna) con hasta dos necesidades en píldoras de papel; nombre en Inria Sans negrita (dato de catálogo), para qué sirve en dos líneas, dos cualidades con estrella dorada y pie con precio tabular, presentaciones y flecha arena. Toda la tarjeta lleva a la página del producto.
- **Movimiento de la tarjeta:** se eleva con sombra solar y brilla bajo el puntero; la foto se acerca un 5 % en 1.2 s mientras un barrido de luz crema la cruza; "Vista rápida" sube desde el borde inferior de la foto (550 ms expo out). En táctil la acción está siempre visible. Solo transform y opacidad.
- **Sin foto:** rayado tostado con la marca en Italiana y el chip discontinuo "Sin foto" abajo; la esquina superior queda para las necesidades.
- **Filtros vivos:** barra de papel al 97 % sin desenfoque (más barata al hacer scroll); chips de necesidad con conteo que rueda, categoría, rango de precio y orden. Al quedar fija en escritorio se compacta a búsqueda, orden y "Filtros". Al filtrar, una línea dorada recorre su borde y la rejilla se recompone con FLIP (posición, 600 ms) con entrada escalonada de hasta 8 tarjetas.
- **Vista rápida:** panel lateral de papel que entra un 30 % desde la derecha (500 ms) con su contenido escalonado (opacidad y desplazamiento); fondo verde al 28 % sin desenfoque.
- **Precio como dato de exhibición:** en el selector de presentación el precio elegido se muestra en Italiana grande; la presentación activa es una tarjeta verde con el precio en arena.
- **Imágenes:** solo se muestran fotos de la cuenta de Cloudinary configurada en `next.config.ts` (`allowedImageUrl`); cualquier otra URL cae al estado "Sin foto".

## Do's and Don'ts

### Do:
- **Do** derivar cada sombra, filo y reflejo del sol de la barra de desplazamiento usando las clases solares (`.lit`, `.lit-dark`, `.sun-shadow`, `.sun-shadow-ink`, `.sun-glass`, `.sun-panel`) en lugar de sombras fijas.
- **Do** teñir las sombras sobre claro con el marrón tostado `rgb(74 46 16)` y opacidades de 0.18 a 0.36.
- **Do** usar el estado "Sin imagen" del marco de imagen cuando falte una foto y nombrar en el texto alternativo la imagen esperada.
- **Do** marcar con un chip discontinuo cualquier dato o recurso pendiente en lugar de ocultarlo o inventarlo.
- **Do** animar con desaceleración larga, `cubic-bezier(0.16, 1, 0.3, 1)` en CSS y `expo.out` en GSAP, y envolver toda coreografía de scroll en `prefers-reduced-motion: no-preference`.
- **Do** mostrar precios en Inria Sans con cifras tabulares y en miles de COP.
- **Do** mantener los titulares en Italiana a escala de clamp con interlineado 1.02.

### Don't:
- **Don't** usar sombras grises o negras sobre crema ni sombras con desplazamiento fijo que ignoren el sol.
- **Don't** rellenar tarjetas o botones con oro; el oro es luz y el único campo dorado es el bloque de visita.
- **Don't** usar fotos de stock o imágenes de relleno para cubrir un marco vacío.
- **Don't** poner antetítulos en mayúsculas espaciadas encima de los titulares; la etiqueta en mayúsculas es solo para datos y estados.
- **Don't** usar el negro puro como texto; el texto oscuro es siempre el verde bosque profundo.
- **Don't** elevar superficies en táctil ni activar el brillo al puntero sin hover.
