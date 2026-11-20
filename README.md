# Kairo UI — design kit

Sistema de diseño y componentes de interfaz de Kairo, extraído para reutilizar
solo el diseño. **No incluye backend, API, autenticación, prompts, datos de
clientes ni claves.**

Demo: ejecuta el proyecto en local y abre la galería.

## Arrancar

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Qué hay dentro

```
src/
├── App.tsx                 galería de todos los componentes
├── index.css               entrada de estilos
├── styles/
│   ├── theme.css           tokens de color, sombras, radios y tipografía
│   ├── typography.css      escala tipográfica (text-title-1-semibold, …)
│   ├── globals.css         base, animaciones y utilidades
│   ├── apple-design.css    materiales y profundidad
│   ├── color-depth.css     recetas de superficies
│   └── transitions.css     transiciones compartidas
├── components/
│   ├── base/               botones, inputs, selects, tabs, badges, avatares…
│   ├── foundations/        iconos propios
│   ├── ui/                 piezas auxiliares (charts, cards, skeletons…)
│   └── application/        piezas con carácter: dock de cristal, calendario,
│                           folder de ideas, loaders, feed de outliers…
├── hooks/                  hooks de UI
└── utils/                  helpers de clases (cx, tailwind-merge)
```

## Cómo reutilizarlo

1. Copia `src/styles/` y `src/utils/`.
2. Importa `src/index.css` (o solo `styles/globals.css`) en tu entrada.
3. Copia los componentes que necesites; todos usan el alias `@/`.
4. Cambia la marca y los textos de ejemplo.

### Retematizar

La rampa `--color-accent-*` controla botones, foco, selección y acentos.
Sobrescríbela en tu CSS para recolorear todo el sistema:

```css
:root {
  --color-accent-500: #0f766e;
  --color-accent-600: #0d5f59;
  --color-accent-700: #0b4d48;
}
```

El modo oscuro se activa con la clase `.dark` en `<html>`.

## Qué se ha dejado fuera

- Llamadas a API, SSE, proxies y variables de entorno.
- Autenticación, almacenamiento y sincronización.
- Pantallas y componentes de plantilla de dashboard/ajustes de terceros.
- Copia de producto, prompts, datos de clientes y cualquier credencial.
- Nombres, correos y handles reales: los ejemplos usan `ejemplo.com`.

## Créditos y licencias

- Componentes base inspirados en [BoardUI](https://www.boardui.com/) (MIT).
- Utilidades de shadcn/ui (MIT).
- Iconos: [Remix Icon](https://remixicon.com/) y [Lucide](https://lucide.dev/).
- Tipografías: Inter, Instrument Serif y JetBrains Mono (SIL OFL).
- Movimiento: Motion / Framer Motion (MIT).

Las dependencias mantienen sus licencias originales.

## Licencia

MIT. Ver [LICENSE](./LICENSE).
