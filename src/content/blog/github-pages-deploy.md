---
title: "Deploying Astro To GitHub Pages"
description: "A compact checklist for publishing a static Astro site through GitHub Actions and GitHub Pages."
pubDate: 2026-06-15
tags: ["Astro", "GitHub Pages", "DevTools"]
---

GitHub Pages is a good fit for a static technical blog because the deployment path is explicit: install dependencies, build the site, upload `dist`, and let Pages serve the artifact.

For a user site such as `Fang0415.github.io`, the Astro config can stay at the root path:

```js
export default defineConfig({
  site: "https://Fang0415.github.io",
});
```

For a project repository, add `base`:

```js
export default defineConfig({
  site: "https://Fang0415.github.io",
  base: "/fan-blog",
});
```

The common failure mode is forgetting that local routes and deployed routes are not identical when the repository uses a subpath.
