# Fang Blog Design System

## Direction

Fang Blog uses a Folio-style personal engineering journal system: warm paper surfaces, a sunflower-led brand color, readable rounded typography, restrained cards, and an image-led home hero. The site should feel like a working developer's notebook rather than a SaaS landing page.

The design favors clarity over decoration. Pages should prioritize writing, project context, and navigation. Visual richness comes from type, spacing, the hero photo, small status signals, and careful color accents.

## Tokens

### Color

Primary neutrals:

- `--white: #ffffff`
- `--paper: #faf7ef`
- `--mist: #f2ede0`
- `--ink-900: #221d13`
- `--ink-700: #41382a`
- `--ink-500: #6f6553`
- `--ink-400: #9b8f78`
- `--line: #e9e2d2`
- `--line-strong: #ddd3bf`

Brand and accents:

- Sunflower gold: `--gold-500: #f6b417`, hover `--gold-600: #e29d09`
- Sky blue links: `--sky-600: #2376c6`, hover `--sky-700: #1a5d9f`
- Leaf green status: `--green-500: #5aa53f`, `--green-600: #41802c`
- Rose accent: `--rose-500: #f0738b`, `--rose-600: #df526f`

Usage:

- Use warm cream only for page bands, code wells, hover surfaces, and soft cards.
- Use gold for primary CTAs, active step indicators, blockquote borders, and key emphasis.
- Use blue only for links and secondary cool accents.
- Use green for live/active state signals.
- Avoid adding new dominant hue families unless the content type requires it.

### Typography

Fonts are imported in `src/styles/global.css`:

- Sans/body: `Nunito`, with `LXGW WenKai` for CJK fallback.
- Mono/meta/code: `JetBrains Mono`, with `LXGW WenKai` fallback.

Scale:

- Display 1: `56px`, weight `800`, line-height `1.08`
- Display 2: `44px`, weight `800`, line-height `1.1`
- H1: `34px`, weight `700`
- H2: `26px`, weight `700`
- H3: `20px`, weight `700`
- Body: `16px`, line-height `1.6`
- Body large: `18px`, line-height `1.6`
- Eyebrow/meta: mono `12px-13px`

Keep letter spacing at `0` for normal text. Display and heading tokens may use the existing slight negative tracking from CSS, but do not introduce viewport-based font scaling.

### Shape

- Cards: `12px`
- Inputs: `8px`
- Tags and buttons: pill radius
- Images: `12px`
- Brand mark: `8px`

Cards should stay simple: one surface, one border, one clear content grouping. Do not nest cards inside cards.

### Elevation

Use borders first. Shadows are subtle and reserved for interactive cards, the floating nav, and the featured showcase preview. Avoid heavy drop shadows.

## Layout

Global containers:

- Standard: `--container-max: 1080px`
- Wide: `--container-wide: 1200px`
- Reading: `--container-read: 720px`

Spacing:

- Normal section: `96px`
- Tight section: `64px`
- Mobile section: `64px`

Patterns:

- The home page starts with a full-width image hero under a transparent nav.
- Inner pages use a compact page header plus content sections.
- Blog article pages use a narrow reading column and generous paragraph spacing.
- Project grids use card density, not oversized marketing blocks.

## Components

### Navigation

The nav is fixed. On the home page it starts transparent over the hero image, then collapses into a glass pill after scroll. On inner pages it appears collapsed immediately.

Links use active state by path prefix. The mobile menu is a full-screen overlay with large navigation links.

### Buttons

Primary buttons use sunflower gold with dark text. Secondary buttons use white surfaces with warm borders. Ghost buttons are reserved for low-emphasis local actions.

Buttons should remain compact and action-oriented. Avoid using large marketing CTAs for normal navigation.

### Cards

Cards use white or soft paper surfaces, a warm hairline border, `12px` radius, and optional hover lift for interactive cards.

Use cards for repeated project/post items and specific framed modules. Do not turn page sections into floating card stacks.

### Tags and Badges

Tags use mono typography for technical labels. Badges use small dots for status states.

Status mapping:

- Active/live: green
- Building/WIP: gold
- Shipped/beta: sky
- Archived: neutral

### Hero

The home hero is image-led and full-width. Text sits directly on the image with a dark bottom gradient for contrast. The brand accent in the hero is gold.

Do not replace the hero with a gradient-only or decorative SVG composition.

### Writing

Article prose uses large body text, warm ink, and a narrow reading column. Code blocks are light warm wells with mono type. Inline code uses a small bordered pill.

Headings should create scan anchors but not overpower the article body.

## Motion

Motion is limited to:

- Scroll reveal fade/rise
- Hero entrance rise
- Floating nav transition
- Small status pulse
- Card hover lift

All motion must respect `prefers-reduced-motion`.

## Implementation Notes

The source of truth for runtime styling is `src/styles/global.css`. Pages are implemented with Next.js and React under `src/app/` and `src/components/`. When changing tokens, update both CSS and this document in the same change.

The design system intentionally avoids Tailwind configuration. Prefer CSS variables and local component classes already present in the React components.
