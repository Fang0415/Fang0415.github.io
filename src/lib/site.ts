// Central site data for the Folio persona. Profile + projects power the
// home hero, showcase, footer, and about page. Real posts come from the
// content collection (see posts.ts); these are the static persona bits.

export const PROFILE = {
  name: 'Lin Wei',
  wordmark: 'lin.dev',
  mark: 'L',
  role: '后端开发 · RAG 实践者',
  location: '深圳',
  hero: '面向 AI 的后端系统和工具',
  lead: '我关注后端系统、RAG 和开发工具链，也会把实践中踩过的坑和形成的判断写下来，方便之后复用。',
  email: 'hi@lin.dev',
  github: 'https://github.com/Fang0415',
  wechat: '',
};

export type ProjectStatus = 'active' | 'building' | 'shipped' | 'archived';

export interface Project {
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
    description: '一个面向 LLM 应用的本地优先检索层，支持可插拔切分、混合检索和轻量评估工具。',
    highlights: ['可插拔切分与检索策略', '面向实验复现的评估流程'],
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'], repo: '#', demo: '#',
  },
  {
    id: 'notes-cli', title: 'notes-cli', status: 'building', category: '工具链',
    role: 'CLI 设计 / 本地索引',
    period: '2026',
    description: '一个小型命令行工具，用来把工程笔记直接沉淀成可搜索的纯文本档案。',
    highlights: ['Markdown 笔记归档', '轻量搜索与标签整理'],
    stack: ['Go', 'SQLite'], repo: '#',
  },
  {
    id: 'streamq', title: 'streamq', status: 'shipped', category: '后端',
    role: '队列模型 / 可靠投递',
    period: '2025',
    description: '基于 Postgres LISTEN/NOTIFY 的轻量持久队列，适合暂时不想引入 Kafka 的小服务。',
    highlights: ['持久化任务状态', '失败重试与可观测事件'],
    stack: ['Rust', 'Postgres'], repo: '#', demo: '#',
  },
  {
    id: 'embed-bench', title: 'embed-bench', status: 'active', category: 'AI / RAG',
    role: '评估框架 / 数据集整理',
    period: '2025',
    description: '一个可复现实验框架，用来评估 embedding 模型在垂直领域检索任务上的表现。',
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
    description: '一个结构化日志适配层，把嘈杂的服务日志转换成可查询事件，不依赖外部 agent。',
    highlights: ['结构化事件提取', 'ClickHouse 写入与查询'],
    stack: ['Go', 'ClickHouse'], repo: '#', demo: '#',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'ai-infra',
    company: '个人项目 / AI 工程实践',
    role: '后端与检索系统构建',
    period: '现在',
    summary: '围绕 RAG 应用的检索、评估、数据流转和服务化，把原型能力整理成可以复用的工程模块。',
    highlights: ['整理检索管线与评估基线', '沉淀 Postgres、pgvector、FastAPI 实践'],
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'],
  },
  {
    id: 'backend-systems',
    company: '后端工程实践',
    role: '服务设计与基础设施',
    period: '之前',
    summary: '关注接口边界、任务队列、日志与部署，把复杂度控制在项目当前规模能够承受的范围内。',
    highlights: ['设计轻量任务队列和日志链路', '维护部署、反代和对象存储流程'],
    stack: ['Go', 'Rust', 'Postgres', 'Nginx'],
  },
  {
    id: 'writing-tools',
    company: '写作与工具链',
    role: '知识沉淀与自动化',
    period: '持续',
    summary: '把项目复盘、工程笔记和命令行工具串起来，让经验可以被搜索、复用和继续迭代。',
    highlights: ['维护技术博客与 Markdown 内容', '构建本地优先的小工具'],
    stack: ['Next.js', 'TypeScript', 'Markdown', 'SQLite'],
  },
];

// Status → showcase pill (label + kind class). Mirrors Folio Home.jsx.
export const SHOWCASE_STATUS: Record<ProjectStatus, [string, string]> = {
  active: ['活跃维护', 'live'],
  building: ['开发中', 'wip'],
  shipped: ['已发布', 'beta'],
  archived: ['已归档', 'archived'],
};

export const NAV_LINKS = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects/' },
  { label: '文章', href: '/blog/' },
  { label: '关于', href: '/about/' },
];
