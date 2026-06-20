# Layout Reference

This site references international developer blogs, engineering blogs, and technology media for information architecture only. Do not copy logos, names, illustrations, brand copy, protected assets, or full page structures.

## Reference Mapping

### Maggie Appleton

- Useful pattern: a personal knowledge system with essays, notes, garden entries, patterns, and research trails.
- Site translation: the home page should feel like an entry point into a long-running technical garden, not just a reverse-chronological feed.
- Current implementation: keep Blog, Projects, and About live now; reserve visible taxonomy for Notes, Garden, Patterns, and Reading as future sections.

### Josh W. Comeau

- Useful pattern: high-quality technical article reading, MDX-first writing, and space for custom article components.
- Site translation: article pages should keep a comfortable reading column and support code blocks, quotes, callouts, tables, and future MDX components.
- Current implementation: `PostLayout.astro` owns the article shell; `src/styles/global.css` owns markdown typography and code panels.

### Overreacted / Dan Abramov

- Useful pattern: minimal article index where title, date, and short summary carry the page.
- Site translation: the blog index should avoid a generic card grid and stay fast to scan.
- Current implementation: `PostCard.astro` is an editorial row, not a decorative card.

### Lee Robinson

- Useful pattern: concise developer identity, selected writing, projects, and social/code links without turning into a resume.
- Site translation: the home page should answer who the author is, what they focus on, what they write, and what they build.
- Current implementation: author profile appears in the hero side panel; About remains a technical archive rather than a job profile.

### Linear

- Useful pattern: dark engineering panels, mono metadata, status markers, fine borders, restrained hover states.
- Site translation: use this only for projects, tags, code blocks, and status surfaces.
- Current implementation: `ProjectCard.astro`, tags, and code blocks carry this influence.

### Vercel Blog / Engineering

- Useful pattern: developer-platform content hierarchy, topic segmentation, and engineering credibility through concise structure.
- Site translation: use clear topic lanes for RAG, Agents, Backend, Tooling, and Infrastructure.
- Current implementation: home and blog index expose topic lanes without becoming a SaaS landing page.

### Stripe Engineering Blog

- Useful pattern: professional long-form engineering writing with clear authorship, date, topic, and reading rhythm.
- Site translation: article pages should feel serious and stable, not decorative.
- Current implementation: narrow article width, large title, mono metadata, and strong typographic hierarchy.

### GitHub Engineering Blog

- Useful pattern: engineering article lists, category clarity, and ecosystem-oriented technical storytelling.
- Site translation: article archives should make topics and publication dates obvious.
- Current implementation: blog index uses editorial rows plus topic navigation.

## Constraints

- Primary direction: personal technical magazine + engineering project archive + digital garden entrance.
- Visual foundation: WIRED-inspired editorial structure with white canvas, black contrast, and clear hierarchy.
- Engineering accents: Linear/Vercel-inspired cards, tags, metadata, and code panels.
- Avoid: domestic blog templates, generic Hexo/CMS feel, Notion-homepage aesthetics, SaaS landing-page composition, heavy gradients, glassmorphism, cyberpunk styling, and scroll-driven spectacle.
