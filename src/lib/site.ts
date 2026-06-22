// Central site data for the Folio persona. Profile + projects power the
// home hero, showcase, footer, and about page. Real posts come from the
// content collection (see posts.ts); these are the static persona bits.

export const PROFILE = {
  name: 'Lin Wei',
  wordmark: 'lin.dev',
  mark: 'L',
  role: 'Backend Developer · RAG Builder',
  location: 'Shenzhen, CN',
  hero: 'backend systems and tools for AI',
  lead: 'I work on backend systems, RAG, and developer tooling — and I write down what I learn so it stays reusable later.',
  email: 'hi@lin.dev',
  github: 'https://github.com/',
  x: 'https://x.com/',
};

export type ProjectStatus = 'active' | 'building' | 'shipped' | 'archived';

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  category: string;
  description: string;
  stack: string[];
  repo?: string;
  demo?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'ragkit', title: 'ragkit', status: 'active', category: 'AI / RAG',
    description: 'A composable, local-first retrieval layer for LLM apps — pluggable chunking, hybrid search, and a small eval harness.',
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'], repo: '#', demo: '#',
  },
  {
    id: 'notes-cli', title: 'notes-cli', status: 'building', category: 'Tooling',
    description: 'A tiny terminal tool for capturing engineering notes straight into a searchable, plain-text archive.',
    stack: ['Go', 'SQLite'], repo: '#',
  },
  {
    id: 'streamq', title: 'streamq', status: 'shipped', category: 'Backend',
    description: 'A lightweight durable queue built on Postgres LISTEN/NOTIFY for small services that do not want Kafka.',
    stack: ['Rust', 'Postgres'], repo: '#', demo: '#',
  },
  {
    id: 'embed-bench', title: 'embed-bench', status: 'active', category: 'AI / RAG',
    description: 'A reproducible benchmark harness for embedding models on domain-specific retrieval tasks.',
    stack: ['Python', 'DuckDB'], repo: '#',
  },
  {
    id: 'dotfiles', title: 'dotfiles', status: 'archived', category: 'Tooling',
    description: 'My terminal, editor, and shell setup. Mostly here so I can re-provision a machine in one command.',
    stack: ['Shell', 'Lua'], repo: '#',
  },
  {
    id: 'logpipe', title: 'logpipe', status: 'shipped', category: 'Backend',
    description: 'A structured-logging shim that turns noisy service logs into queryable events without a vendor agent.',
    stack: ['Go', 'ClickHouse'], repo: '#', demo: '#',
  },
];

// Status → showcase pill (label + kind class). Mirrors Folio Home.jsx.
export const SHOWCASE_STATUS: Record<ProjectStatus, [string, string]> = {
  active: ['Active', 'live'],
  building: ['Building', 'wip'],
  shipped: ['Shipped', 'beta'],
  archived: ['Archived', 'archived'],
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
];
