// Central site data for the Folio persona. Profile + projects power the
// home hero, showcase, footer, and about page. Real posts come from the
// content collection (see posts.ts); these are the static persona bits.

export const PROFILE = {
  name: 'Fang',
  wordmark: 'Fang',
  mark: 'F',
  role: '学生 · 全栈开发者',
  location: '',
  hero: "There's still so much I don't know, so I keep looking.",
  lead: '这里放我做过的项目，也记录学习和开发时遇到的问题。比起只展示结果，我更想把过程和取舍写清楚。',
  email: '',
  github: 'https://github.com/Fang0415',
  wechat: '',
  // About-page blocks. The three list fields use "左 | 右" per line where the
  // page renders two columns, so the console can edit them in a plain textarea
  // instead of needing a nested form.
  aboutIntro: [
    '你好，我是 Fang，一名学生，也是一名全栈开发者。现在主要学习后端、AI 应用开发和 RAG，也会做一些完整的小项目，把想法从页面一路做到服务端。',
    '我建这个网站，不只是为了摆作品。项目为什么这样设计、途中踩过什么坑、最后怎么解决，我都会尽量写下来。'
      + '如果这些记录刚好能帮你少绕一点路，那就更好了。',
  ].join('\n\n'),
  focus: [
    '后端开发 | 接口、数据库与服务部署',
    'AI 应用 | 从想法到可以使用的产品',
    'RAG | 检索、上下文与效果评估',
  ],
  tools: ['Python', 'Go', 'Rust', 'Postgres', 'pgvector', 'FastAPI', 'DuckDB', 'Neovim', 'Linux'],
  now: [
    '做一个完整的 AI 应用，顺手把工程结构理清楚。',
    '继续学习 RAG，重点看检索和效果评估。',
    '把开发中真正遇到的问题写成文章。',
  ],
  background: [
    '身份 | 学生 / 全栈开发者',
    '关注 | 后端、AI 应用开发、RAG',
    '这个网站 | 项目展示、学习记录和技术文章',
    '写作原则 | 先把问题说明白，再谈解决方案',
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
    role: '系统设计 / 后端实现',
    period: '2026',
    description: '把文档处理、混合检索和简单评估放在一起的本地 RAG 工具，方便快速比较不同方案。',
    highlights: ['可插拔切分与检索策略', '面向实验复现的评估流程'],
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'], repo: '#', demo: '#',
  },
  {
    id: 'notes-cli', title: 'notes-cli', status: 'building', category: '工具链',
    role: 'CLI 设计 / 本地索引',
    period: '2026',
    description: '在终端里记笔记、加标签和搜索的小工具，数据保存为普通文件，换设备也不难搬。',
    highlights: ['Markdown 笔记归档', '轻量搜索与标签整理'],
    stack: ['Go', 'SQLite'], repo: '#',
  },
  {
    id: 'streamq', title: 'streamq', status: 'shipped', category: '后端',
    role: '队列模型 / 可靠投递',
    period: '2025',
    description: '用 Postgres 做的小型持久任务队列，给暂时不需要 Kafka 的服务一个更轻的选择。',
    highlights: ['持久化任务状态', '失败重试与可观测事件'],
    stack: ['Rust', 'Postgres'], repo: '#', demo: '#',
  },
  {
    id: 'embed-bench', title: 'embed-bench', status: 'active', category: 'AI / RAG',
    role: '评估框架 / 数据集整理',
    period: '2025',
    description: '用同一套数据和指标比较 embedding 模型，看看它们在具体检索任务里的差别。',
    highlights: ['多模型对比', '检索指标与样本回放'],
    stack: ['Python', 'DuckDB'], repo: '#',
  },
  {
    id: 'dotfiles', title: 'dotfiles', status: 'archived', category: '工具链',
    role: '开发环境维护',
    period: '长期',
    description: '终端、编辑器和 shell 配置，用来在新机器上快速恢复开发环境。',
    highlights: ['Shell 与编辑器配置', '跨机器初始化脚本'],
    stack: ['Shell', 'Lua'], repo: '#',
  },
  {
    id: 'logpipe', title: 'logpipe', status: 'shipped', category: '后端',
    role: '日志建模 / 查询链路',
    period: '2025',
    description: '把格式混乱的服务日志整理成结构化事件，再写入 ClickHouse，方便之后查询和排错。',
    highlights: ['结构化事件提取', 'ClickHouse 写入与查询'],
    stack: ['Go', 'ClickHouse'], repo: '#', demo: '#',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'ai-infra',
    company: '个人项目',
    role: 'AI 应用与 RAG',
    period: '最近',
    summary: '最近把更多时间放在 AI 应用和 RAG 上，试着从数据处理、检索到接口和页面，完整做完一条链路。',
    highlights: ['比较不同的切分与检索方案', '给实验补上可以重复的评估过程'],
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'],
  },
  {
    id: 'backend-systems',
    company: '课程与练习',
    role: '后端基础',
    period: '持续',
    summary: '用项目练习接口设计、数据库、任务队列和部署。重点不是堆技术，而是把每一层为什么存在想清楚。',
    highlights: ['从接口到数据库完成一条业务链路', '练习部署、日志和问题排查'],
    stack: ['Go', 'Rust', 'Postgres', 'Nginx'],
  },
  {
    id: 'writing-tools',
    company: '这个网站',
    role: '全栈开发与写作',
    period: '现在',
    summary: '自己设计、开发并维护这个网站，用它整理项目和笔记，也顺便练习一套完整的内容管理流程。',
    highlights: ['完成前台页面和内容后台', '把开发过程整理成可以回看的记录'],
    stack: ['Next.js', 'TypeScript', 'Markdown', 'SQLite'],
  },
];

// Status → showcase pill (label + kind class). Mirrors Folio Home.jsx.
export const SHOWCASE_STATUS: Record<ProjectStatus, [string, string]> = {
  active: ['持续更新', 'live'],
  building: ['正在做', 'wip'],
  shipped: ['已完成', 'beta'],
  archived: ['暂停更新', 'archived'],
};

export const NAV_LINKS = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects/' },
  { label: '文章', href: '/blog/' },
  { label: '关于', href: '/about/' },
];
