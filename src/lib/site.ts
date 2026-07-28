// Central site data for the Folio persona. Profile + projects power the
// home hero, showcase, footer, and about page. Real posts come from the
// content collection (see posts.ts); these are the static persona bits.

export const PROFILE = {
  name: 'Fang',
  wordmark: 'Fang',
  mark: 'F',
  role: '学生 · 全栈开发者',
  location: '',
  hero: "There's still so much I don't know, so I keep digging.",
  lead: '这里放我做过的项目，和一路写下来的笔记。',
  email: '',
  github: 'https://github.com/Fang0415',
  wechat: '',
  // About-page blocks. The three list fields use "左 | 右" per line where the
  // page renders two columns, so the console can edit them in a plain textarea
  // instead of needing a nested form.
  aboutIntro: [
    '你好，我是 Fang，一名学生，也是一名全栈开发者。主要学后端和 AI 应用开发，偶尔做完整的小项目。',
    '这个网站放项目，也记踩过的坑。如果能帮你少绕一点路，那就更好了。',
  ].join('\n\n'),
  focus: [
    '后端开发 | 接口、数据库、部署',
    'AI 应用 | 从想法到能用的产品',
    'RAG | 检索与评估',
  ],
  tools: ['Python', 'Go', 'Rust', 'Postgres', 'pgvector', 'FastAPI', 'DuckDB', 'Neovim', 'Linux'],
  now: [
    '做一个完整的 AI 应用，顺手把工程结构理清楚。',
    '学 RAG，重点看检索和评估。',
    '把踩过的坑写成文章。',
  ],
  background: [
    '身份 | 学生 / 全栈开发者',
    '方向 | 后端、AI 应用、RAG',
    '这个网站 | 项目、笔记、技术文章',
    '联系方式 | GitHub',
  ],
};

/**
 * Splits a `"左 | 右"` line into its two halves. Only the first separator
 * counts, so the right-hand side may itself contain a pipe. A line without a
 * separator becomes a label with no note.
 */
export function splitPair(line: string): [string, string] {
  const index = line.indexOf('|');
  if (index === -1) return [line.trim(), ''];
  return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
}

/**
 * The shape every component takes as a prop. PROFILE above is only the
 * fallback: at runtime the values come from the SiteProfile table via
 * getSiteProfile(), so the admin console can edit them without a deploy.
 */
export type SiteProfileData = typeof PROFILE;

export type ProjectStatus = 'active' | 'building' | 'shipped' | 'archived';

export interface Project {
  /** Also the URL slug: /projects/<id>/. */
  id: string;
  title: string;
  status: ProjectStatus;
  category: string;
  role?: string;
  period?: string;
  description: string;
  highlights?: string[];
  stack: string[];
  repo?: string;
  demo?: string;
  /** Raw Markdown detail body. Absent means the detail page shows only the summary. */
  content?: string;
  coverUrl?: string;
  coverAlt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 'ragkit', title: 'ragkit', status: 'active', category: 'AI / RAG',
    period: '2026',
    description: '本地 RAG 实验工具：切分、检索、评估都在一处，方便对比方案。',
    highlights: ['可插拔的切分与检索策略', '可复现的评估流程'],
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'],
  },
  {
    id: 'notes-cli', title: 'notes-cli', status: 'building', category: '工具',
    period: '2026',
    description: '终端笔记工具，数据是普通 Markdown 文件，换机器直接带走。',
    highlights: ['Markdown 笔记归档', '轻量搜索与标签'],
    stack: ['Go', 'SQLite'],
  },
  {
    id: 'streamq', title: 'streamq', status: 'shipped', category: '后端',
    period: '2025',
    description: '用 Postgres 做的小型持久任务队列，给不需要 Kafka 的服务用。',
    highlights: ['持久化任务状态', '失败重试与可观测事件'],
    stack: ['Rust', 'Postgres'],
  },
  {
    id: 'embed-bench', title: 'embed-bench', status: 'active', category: 'AI / RAG',
    period: '2025',
    description: '同一套数据和指标，横向对比 embedding 模型的检索效果。',
    highlights: ['多模型对比', '检索指标与样本回放'],
    stack: ['Python', 'DuckDB'],
  },
  {
    id: 'dotfiles', title: 'dotfiles', status: 'archived', category: '工具',
    period: '长期',
    description: '终端、编辑器、shell 配置，新机器一键恢复环境。',
    highlights: ['Shell 与编辑器配置', '跨机器初始化脚本'],
    stack: ['Shell', 'Lua'],
  },
  {
    id: 'logpipe', title: 'logpipe', status: 'shipped', category: '后端',
    period: '2025',
    description: '把混乱的服务日志整理成结构化事件，写入 ClickHouse 供排错查询。',
    highlights: ['结构化事件提取', 'ClickHouse 写入与查询'],
    stack: ['Go', 'ClickHouse'],
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'ai-infra',
    company: '个人项目',
    role: 'AI 应用与 RAG',
    period: '最近',
    summary: '从数据处理、检索到接口和页面，完整做完一条链路。',
    highlights: ['对比不同的切分与检索方案', '给实验补上可重复的评估'],
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'],
  },
  {
    id: 'backend-systems',
    company: '课程与练习',
    role: '后端基础',
    period: '持续',
    summary: '用项目练接口设计、数据库、任务队列和部署。',
    highlights: ['从接口到数据库跑通一条业务链路', '部署、日志与问题排查'],
    stack: ['Go', 'Rust', 'Postgres', 'Nginx'],
  },
  {
    id: 'writing-tools',
    company: '这个网站',
    role: '全栈开发与写作',
    period: '现在',
    summary: '自己设计、开发并维护这个网站。',
    highlights: ['前台页面和内容后台', '把开发过程写成记录'],
    stack: ['Next.js', 'TypeScript', 'Markdown', 'SQLite'],
  },
];

// Status → showcase pill (label + kind class). Mirrors Folio Home.jsx.
export const SHOWCASE_STATUS: Record<ProjectStatus, [string, string]> = {
  active: ['在更新', 'live'],
  building: ['在做', 'wip'],
  shipped: ['已完成', 'beta'],
  archived: ['已归档', 'archived'],
};

export const NAV_LINKS = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects/' },
  { label: '文章', href: '/blog/' },
  { label: '关于', href: '/about/' },
];
