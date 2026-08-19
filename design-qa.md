# Skill Repository — Design QA

## Evidence

- Source visual truth: `/var/folders/q0/866dc7b55j3c61s7h1hfx1r40000gn/T/codex-clipboard-01ed5bcd-5383-4269-9871-c0ab24154ccf.png`
- Source component specification: `/Users/fang/.codex/attachments/dcbdaccb-3934-425c-93d1-54db1f8f5534/pasted-text.txt`
- Browser-rendered implementation: `/Users/fang/Developer/fang-blog/design-audit/skill-repository/open-path-final.jpg`
- Full-view comparison: `/Users/fang/Developer/fang-blog/design-audit/skill-repository/open-path-reference-comparison.jpg`
- Focused poster-asset comparison: `/Users/fang/Developer/fang-blog/design-audit/skill-repository/poster-contact-sheet.jpg`
- Route and state: `http://127.0.0.1:3000/#skills`, desktop, light theme, path animation running.
- Implementation viewport: 1113 × 837 CSS px, device scale 1.
- Source pixels: 2048 × 1248. Implementation screenshot pixels: 1113 × 837. The comparison image normalizes both captures to 600 px height without changing aspect ratio.

## Findings

No actionable P0, P1, or P2 mismatches remain.

- Fonts and typography: the poster lettering is embedded in the exact raster assets from the supplied demo, so no substitute webfont changes the artwork. The right-side repository copy intentionally keeps the site's existing Figma-derived type system.
- Spacing and layout rhythm: the source is a full-width demonstration canvas, while the implementation intentionally places the effect in the existing left grid column. Within that constraint, the open path retains the source proportions, loop direction, image density, tangent rotation, and negative space.
- Colors and visual tokens: the locally stored poster palette matches the supplied demo. The surrounding warm-neutral surface and yellow active state remain the site's existing tokens.
- Image quality and asset fidelity: all 13 original 900–1400 px Cosmos poster images are stored locally and rendered as square, cover-cropped assets. No CSS art, generated icon, placeholder, or technology logo is used in the moving path.
- Copy and content: the effect remains a Skill Repository selector rather than becoming a typography gallery. Thirteen skills map one-to-one to the thirteen poster assets; the right side now contains only the selected skill name and description.
- Interaction: automatic movement, hover stop, click/focus selection, repeated visual sequence, reduced-motion behavior, and empty-area dragging are implemented. Clicking `RAG Systems` updated the right panel and `aria-pressed` state successfully after hover-stop was added.
- Browser console: no errors recorded.

## Comparison History

1. Earlier P1 — wrong path geometry.
   - Evidence: the first implementation used a closed figure-eight path, unlike the source's open left-to-right wave with one tall loop.
   - Fix: replaced it with the exact path data from the supplied demo and changed the viewBox to `0 0 996 330`.
   - Post-fix evidence: `open-path-reference-comparison.jpg`.
2. Earlier P1 — wrong image language.
   - Evidence: technology-logo cards did not match the square experimental typography posters in the source.
   - Fix: downloaded and locally stored all 13 exact demo assets, then removed icon labels, card chrome, and the visible dotted path.
   - Post-fix evidence: `poster-contact-sheet.jpg` and `open-path-final.jpg`.
3. Earlier P2 — excessive poster size and loop congestion.
   - Evidence: 96 × 96 source-space cards crowded the loop intersection.
   - Fix: restored the original demo's 56 × 56 size and tangent rotation; hover scale remains 1.42.
   - Post-fix evidence: `open-path-final.jpg`.
4. Earlier P1 — moving items could not be clicked reliably.
   - Evidence: parent pointer capture and continued movement caused the target to move between pointer down and click.
   - Fix: interactive descendants no longer start parent dragging, and hovering a poster stops path movement before selection.
   - Post-fix evidence: browser interaction test selected `RAG Systems` with `aria-pressed="true"`.
5. Requested simplification — edge behavior and surrounding chrome.
   - Fix: reduced base velocity from 8 to 4.2, added a horizontal edge mask for gradual entry and exit, removed the left background/card treatment, and removed right-side metadata, tags, progress, and divider lines.
   - Post-fix evidence: browser-rendered copy contains only the skill name and description; computed divider widths are `0px` and console errors remain empty.

## Focused Region Review

The poster contact sheet was used as the focused comparison because individual poster typography is too small to judge in the full-page capture. It confirms the source's serif specimens, ampersands, numerals, black line forms, blue/red/tan/green palette, and square crops are present.

## Follow-up Polish

- [P3] If the left column is made substantially narrower in a later layout change, consider reducing repeat count to preserve separation at the loop intersection.

## Implementation Checklist

- [x] Exact open SVG path and viewBox.
- [x] Thirteen real poster assets stored locally with source notes.
- [x] Tangent rotation and original source-space image size.
- [x] Hover stop and reliable click/focus selection.
- [x] Responsive stacking and reduced-motion handling.
- [x] Browser console checked.

final result: passed
