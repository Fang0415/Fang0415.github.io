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
  description: string;
  stack: string[];
  repo?: string;
  demo?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'ragkit', title: 'ragkit', status: 'active', category: 'AI / RAG',
    description: '一个面向 LLM 应用的本地优先检索层，支持可插拔切分、混合检索和轻量评估工具。',
    stack: ['Python', 'Postgres', 'pgvector', 'FastAPI'], repo: '#', demo: '#',
  },
  {
    id: 'notes-cli', title: 'notes-cli', status: 'building', category: '工具链',
    description: '一个小型命令行工具，用来把工程笔记直接沉淀成可搜索的纯文本档案。',
    stack: ['Go', 'SQLite'], repo: '#',
  },
  {
    id: 'streamq', title: 'streamq', status: 'shipped', category: '后端',
    description: '基于 Postgres LISTEN/NOTIFY 的轻量持久队列，适合暂时不想引入 Kafka 的小服务。',
    stack: ['Rust', 'Postgres'], repo: '#', demo: '#',
  },
  {
    id: 'embed-bench', title: 'embed-bench', status: 'active', category: 'AI / RAG',
    description: '一个可复现实验框架，用来评估 embedding 模型在垂直领域检索任务上的表现。',
    stack: ['Python', 'DuckDB'], repo: '#',
  },
  {
    id: 'dotfiles', title: 'dotfiles', status: 'archived', category: '工具链',
    description: '终端、编辑器和 shell 配置，用来在新机器上快速恢复开发环境。',
    stack: ['Shell', 'Lua'], repo: '#',
  },
  {
    id: 'logpipe', title: 'logpipe', status: 'shipped', category: '后端',
    description: '一个结构化日志适配层，把嘈杂的服务日志转换成可查询事件，不依赖外部 agent。',
    stack: ['Go', 'ClickHouse'], repo: '#', demo: '#',
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
