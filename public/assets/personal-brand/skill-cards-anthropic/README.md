# Anthropic-style skill cards

Generated for the Skill Repository with the local `anthropic-art` skill and the built-in image generator.

## Visual system

- Full-frame opaque accent background.
- One irregular ivory `#FAF9F5` carrier shape.
- Bold, rounded, deliberately uneven near-black `#141413` linework.
- One metaphor per image, no labels, logos, or watermarks.

## Cover library

These illustrations are reusable visual covers for the AI Skill repository. They are not labels for personal competencies. Runtime name, description, and cover assignments live in `src/lib/ai-skills.ts`.

| File | Original visual theme | Background | Metaphor |
| --- | --- | --- | --- |
| `backend-systems.png` | Backend Systems | cactus `#BCD1CA` | Data streams converging into a stable hub |
| `java.png` | Java | heather `#CBCADB` | Structured blocks held by a boundary |
| `python.png` | Python | fig `#C46686` | A flexible automation path |
| `databases.png` | Databases | oat `#E3DACC` | Stacked vessels holding data |
| `caching.png` | Caching | clay `#D97757` | A deliberate shortcut into a nearby pocket |
| `rag-systems.png` | RAG Systems | heather `#CBCADB` | Selecting one useful page from many |
| `ai-agents.png` | AI Agents | coral `#EBCECE` | Hands passing a tool between nodes |
| `linux.png` | Linux | olive `#788C5D` | A plant rooted in system processes |
| `docker.png` | Docker | sky `#6A9BCC` | Nested cargo inside a stable vessel |
| `typescript.png` | TypeScript | sky `#6A9BCC` | A fitted bridge between different shapes |
| `api-design.png` | API Design | cactus `#BCD1CA` | Two connectors meeting through an adapter |
| `deployment.png` | Deployment | clay `#D97757` | A package moving along a repeatable release path |
| `engineering-notes.png` | Engineering Notes | oat `#E3DACC` | A notebook whose idea continues into the world |

## Shared prompt contract

Each image used the same square editorial-card prompt structure: a full-bleed opaque palette color, an irregular ivory carrier shape, one centered symbolic relationship, naive thick black ink gestures, flat two-dimensional forms, no text, and thumbnail-scale readability. The specific subject, metaphor, and palette were changed per skill using the mapping above. All three bundled `anthropic-art` reference images were supplied as style references only.

## Interdisciplinary expansion

The `expansion/` directory contains a second twelve-card set generated as one 4 × 3 contact sheet and exported as 362 × 362 PNG assets. Each grid cell uses a 2px safety inset before resampling so anti-aliased pixels from a neighbouring card cannot remain on an outer edge.

| File | Theme |
| --- | --- |
| `expansion/saturn.png` | Saturn and orbital balance |
| `expansion/mars.png` | Mars and exploration |
| `expansion/solar-system.png` | Coordinated planetary systems |
| `expansion/computer-science.png` | Computer science and networks |
| `expansion/biology.png` | Biology and adaptation |
| `expansion/physics.png` | Physics and measurable motion |
| `expansion/chemistry.png` | Chemistry and composition |
| `expansion/literature.png` | Literature and narrative |
| `expansion/philosophy.png` | Philosophy and inquiry |
| `expansion/history.png` | History and context |
| `expansion/mathematics.png` | Mathematics and abstraction |
| `expansion/astronomy.png` | Astronomy and scale |

The uncropped source is retained as `expansion/source-contact-sheet.png`. See `expansion/PROMPT.md` for the reusable generation prompt.
