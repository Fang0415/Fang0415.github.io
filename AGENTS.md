# Fang Blog Project Rules

## Figma is the frontend design reference

Frontend work must use the existing Figma file as a design reference before changing layout, typography, spacing, color, components, or motion:

- Figma file: `AumBqDv9TwjVgDAGzF5Tz8`
- Canvas: `0:1` — `Current Frontend — Desktop`
- Frame 1: `20:2` — `Reference — Agenta Landing Page (Editable)`
  - Reference for the overall visual language: white-led surfaces, spacing rhythm, restrained yellow accents, border/radius treatment, navigation, buttons, and footer composition.
  - Do not copy Agenta's product copy or domain-specific content.
- Frame 2: `47:1293` — `Home — Personal Brand Landing / Fang`
  - Canonical product frame for Fang-specific content, page hierarchy, component choices, typography, project presentation, skills, and writing sections.
  - Keep this frame synchronized with the accepted desktop frontend implementation.

Both frames are required references. Inspect both before implementation; do not use only the Agenta reference or only the previous code. If they differ, preserve the visual principles from Frame 1 while following the Fang-specific structure and content from Frame 2. Explicit user instructions have the highest priority.

## Code and Figma synchronization

- The production frontend is the source of truth for behavior already implemented and accepted by the user, including navigation, light/dark mode, English/Chinese switching, marquees, skill-card motion, blog flip animation, and hover previews.
- Figma is the source of truth for visual intent and design-system consistency. After an accepted frontend visual change, update Frame `47:1293` when synchronization is requested.
- Preserve the stable Frame `47:1293` ID when refreshing the prototype. Use a temporary capture only as a visual/layout source, then consolidate it into the canonical frame.
- Keep the canonical desktop frame at 1430px wide unless the user requests another viewport. Add separate frames for mobile or interaction states instead of overwriting the desktop frame.
- Reuse the local `Fang / Color`, `Fang / Layout`, and `Fang / Primitives` variables and existing components where applicable. Do not introduce unrelated community-library components just to approximate the design.
- Repeated UI should remain componentized in code and represented consistently in Figma. Import source SVG icons instead of redrawing them.
- The Figma capture state must render all content statically. The `data-figma-capture` override may disable entrance-only opacity/transforms, but it must not change normal browser behavior.

## Typography

- Follow Frame `47:1293`: Geist is the primary interface and reading family; Caveat is reserved for the handwritten hero line; Menlo is preferred for monospace metadata.
- Do not restore the previous LXGW WenKai site font.
- Because the bundled Geist asset contains Latin glyphs, Chinese text may fall back to the platform's neutral sans-serif CJK font in production. Do not use a decorative Chinese font unless the user explicitly requests one and the Figma frame is updated accordingly.
