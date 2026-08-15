// Central site data for the Folio persona. Profile + projects power the
// home hero, showcase, footer, and about page. Real posts come from the
// content collection (see posts.ts); these are the static persona bits.

import { LINKRAG_README_EN, LINKRAG_README_ZH } from './linkrag-readme.ts';

export const PROFILE = {
  name: 'Fang',
  wordmark: 'Fang',
  mark: 'F',
  role: '学生 · 全栈开发者',
  location: '',
  hero: 'From a simple idea, rebuild the whole world.',
  lead: '这里放我做过的项目，和一路写下来的笔记。',
  email: '',
  github: 'https://github.com/Fang0415',
  wechat: '',
  qq: '',
  reddit: '',
  avatarUrl: '',
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

export type SiteLocale = 'en' | 'zh';

export interface LocalizedText extends Record<string, string> {
  en: string;
  zh: string;
}

export interface LocalizedList extends Record<string, string[]> {
  en: string[];
  zh: string[];
}

export function textFor(value: LocalizedText, locale: SiteLocale) {
  return value[locale] || value.zh || value.en;
}

export function listFor(value: LocalizedList, locale: SiteLocale) {
  return value[locale]?.length ? value[locale] : (value.zh.length ? value.zh : value.en);
}

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'published';

export interface Project {
  /** Also the URL slug: /projects/<id>/. */
  id: string;
  title: LocalizedText;
  status: ProjectStatus;
  category: string;
  summary: LocalizedText;
  highlights: LocalizedList;
  tags: string[];
  github?: string;
  demo?: string;
  /** Raw localized Markdown detail body. Absent means the detail page shows only the summary. */
  content?: LocalizedText;
  coverUrl?: string;
  coverAlt?: string;
  featured: boolean;
  visible: boolean;
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
    id: 'linkrag', title: { en: 'LinkRag', zh: 'LinkRag' }, status: 'published', category: 'AI / RAG',
    summary: {
      en: 'A full-stack RAG knowledge system that turns complex documents into searchable, conversational, and traceable knowledge.',
      zh: '一套完整的 RAG 知识库系统，将复杂文档转化为可检索、可对话、可溯源的知识。',
    },
    highlights: {
      en: [
        'Structured parsing for PDF, Word, and HTML documents',
        'Dense, sparse, and BM25 retrieval with fusion and reranking',
        'Asynchronous Java control plane and Python execution engine',
        'Resumable ingestion and traceable streaming answers',
      ],
      zh: [
        '将 PDF、Word 与 HTML 统一解析为结构化内容',
        '稠密、稀疏与 BM25 三路召回并支持融合重排',
        'Java 控制面与 Python 执行端异步解耦',
        '支持断点续跑与可溯源的流式问答',
      ],
    },
    content: { zh: LINKRAG_README_ZH, en: LINKRAG_README_EN },
    tags: ['RAG', 'Python', 'FastAPI', 'Java', 'Spring Boot', 'React', 'TypeScript', 'Qdrant', 'RabbitMQ', 'MySQL'],
    github: 'https://github.com/ql-link/LinkRag',
    demo: 'https://linkrag.cn/',
    coverUrl: '/assets/projects/linkrag-cover.png',
    coverAlt: 'Hand-drawn documents flowing through a retrieval funnel into a connected knowledge network',
    featured: true,
    visible: true,
  },
  {
    id: 'linkrag-eval', title: { en: 'LinkRag-Eval', zh: 'LinkRag 评测' }, status: 'published', category: 'AI / RAG',
    summary: {
      en: 'A standalone RAG evaluation and quality-check platform for measuring retrieval, cleaning, and generation quality.',
      zh: '独立的 RAG 评测与质量检查平台，用于衡量召回、解析清洗和生成链路的效果。',
    },
    highlights: {
      en: ['Isolated evaluation database and result ledger', 'Dense, sparse, and BM25 retrieval evaluation', 'Cleaning, generation, and LLM-judge quality checks', 'Reproducible CLI evaluation workflow'],
      zh: ['独立评测库与结果台账', '支持 dense / sparse / BM25 三路召回评测', '覆盖解析清洗、生成与 LLM Judge', '提供可复现的 CLI 评测流程'],
    },
    content: {
      en: '## Overview\n\nLinkRag-Eval is the standalone evaluation and quality-check project for toLink-Rag. It measures retrieval, document cleaning, generation, and LLM-judge quality in an isolated workflow.\n\n## Workflow\n\nThe CLI covers corpus ingestion, golden-set generation, cleaning checks, retrieval runs, metric computation, and report export.',
      zh: '## 项目概览\n\nLinkRag-Eval 是 toLink-Rag 的独立评测与质量检查项目，负责衡量召回、解析清洗、生成和 LLM Judge 等环节的质量。\n\n## 评测流程\n\n项目提供语料导入、标注集生成、清洗检查、检索运行、指标计算和报告输出等 CLI 流程。',
    },
    tags: ['RAG', 'Evaluation', 'Retrieval', 'Python', 'Qdrant', 'MySQL'],
    github: 'https://github.com/ql-link/LinkRag-Eval',
    coverUrl: '/assets/projects/linkrag-eval-cover.png',
    coverAlt: 'Agent workflow diagram for evaluating retrieval and generation quality',
    featured: true,
    visible: true,
  },
  {
    id: 'linkparse', title: { en: 'LinkParse', zh: 'LinkParse' }, status: 'published', category: 'Backend / Infrastructure',
    summary: {
      en: 'A CPU-first document parsing service that turns PDF, Word, and image inputs into structured Markdown and HTML.',
      zh: 'CPU 优先的文档解析服务，将 PDF、Word 和图片转换为结构化 Markdown 与 HTML。',
    },
    highlights: {
      en: ['PDF parsing with OpenDataLoader and per-page RapidOCR fallback', 'Word parsing through LibreOffice and Mammoth', 'Sync and async jobs with records and API keys', 'Redis concurrency limits and protected asset export'],
      zh: ['使用 OpenDataLoader 解析 PDF，并支持逐页 RapidOCR 兜底', '通过 LibreOffice 与 Mammoth 处理 Word 文档', '提供同步、异步任务、记录查询与 API Key', '使用 Redis 控制并发并保护资源导出'],
    },
    content: {
      en: '## Overview\n\nLinkParse is a CPU-first document parsing service for turning common office and image inputs into structured content.\n\n## Parsing pipeline\n\nPDF pages use OpenDataLoader with RapidOCR fallback. Word files pass through LibreOffice before Mammoth produces semantic HTML and Markdown.\n\n## Service surface\n\nSynchronous and asynchronous parse endpoints, job status and result APIs, health checks, protected asset export, and a visual console are backed by Redis concurrency limits and traceable records.',
      zh: '## 项目概览\n\nLinkParse 是一个 CPU 优先的文档解析服务，面向常见办公文档和图片输入，输出结构化内容。\n\n## 解析链路\n\nPDF 使用 OpenDataLoader 处理，需要视觉识别时按页面回退到 RapidOCR。Word 先经 LibreOffice 转换，再由 Mammoth 生成语义化 HTML 和 Markdown。\n\n## 服务能力\n\n项目提供同步与异步解析、任务状态和结果查询、健康检查、受保护的资源导出及可视化控制台，并用 Redis 控制并发、用记录追踪运行结果。',
    },
    tags: ['Python', 'FastAPI', 'RapidOCR', 'OpenDataLoader', 'Mammoth', 'Redis', 'MySQL'],
    github: 'https://github.com/ql-link/LinkParse',
    demo: '#',
    coverUrl: '/assets/projects/linkparse-cover.png',
    coverAlt: 'Hand-drawn documents passing through a parsing funnel into structured output',
    featured: false,
    visible: true,
  },
  {
    id: 'skill-manager', title: { en: 'Agent Install', zh: 'Skill 管理工具' }, status: 'published', category: 'Developer Tools / AI',
    summary: {
      en: 'A unified toolkit for installing, inspecting, and syncing agent skills, MCP servers, and AGENTS.md configuration.',
      zh: '统一管理 Agent Skill、MCP 服务与 AGENTS.md 配置的开发者工具。',
    },
    highlights: {
      en: ['Scan and inspect skills across local agent workspaces', 'Enable, disable, sync, and repair shared skill sources', 'CLI and Node APIs for repeatable automation', 'Local web manager with diagnostics and doctor checks'],
      zh: ['扫描并检查多个 Agent 工作区中的本地 Skill', '启用、禁用、同步并修复共享 Skill 源', '提供 CLI 与 Node API，支持可复用自动化', '本地 Web 管理界面与诊断、doctor 检查'],
    },
    content: {
      en: '## Overview\n\nAgent Install keeps agent skills and MCP configuration consistent across developer environments. It treats local skill folders, MCP servers, and AGENTS.md files as one inspectable source.\n\n## Workflow\n\nThe CLI scans configured roots, reports health issues, and enables, disables, syncs, or repairs items. A Node API exposes the same operations to scripts, while a local web manager provides a visual workspace overview.',
      zh: '## 项目概览\n\nAgent Install 用来统一维护不同开发环境中的 Agent Skill 与 MCP 配置，把本地 Skill 目录、MCP 服务和 AGENTS.md 文件放到同一个可检查的来源里。\n\n## 工作流\n\nCLI 会扫描配置的根目录、报告健康问题，并支持启用、禁用、同步和修复。Node API 供脚本复用同一套操作，本地 Web 管理界面提供工作区总览。',
    },
    tags: ['TypeScript', 'Node.js', 'CLI', 'MCP', 'Agent Skills', 'Vite'],
    github: 'https://github.com/millionco/agent-install',
    demo: '#',
    coverUrl: '/assets/projects/skill-manager-cover.png',
    coverAlt: 'Hand-drawn skill cards being organized into a connected agent toolbox',
    featured: false,
    visible: true,
  },
  {
    id: 'easy-meeting', title: { en: 'Easy Meeting', zh: 'Easy Meeting' }, status: 'published', category: 'Backend / Realtime',
    summary: {
      en: 'A modular Spring Boot meeting backend with real-time WebSocket signaling, messaging, and meeting lifecycle services.',
      zh: '模块化的 Spring Boot 会议后端，提供实时 WebSocket 信令、消息分发与会议生命周期服务。',
    },
    highlights: {
      en: ['Separated model, core, mapper, component, service, and API modules', 'Meeting creation, joining, invitations, chat, contacts, and reservations', 'Netty WebSocket signaling with Redis and RabbitMQ messaging', 'MySQL and MyBatis persistence with cache-backed services'],
      zh: ['拆分 model、core、mapper、components、service 与 API 模块', '覆盖会议创建、加入、邀请、聊天、联系人和预约流程', 'Netty WebSocket 信令与 Redis、RabbitMQ 消息分发', '基于 MySQL、MyBatis 与缓存的持久化服务'],
    },
    content: {
      en: '## Overview\n\nEasy Meeting is a modular Spring Boot backend for meeting and collaboration workflows. The codebase separates domain models, infrastructure, services, and API adapters.\n\n## Real-time collaboration\n\nNetty and WebSocket provide signaling for meeting sessions. Redis and RabbitMQ support messaging and coordination, while service modules cover meeting creation, joining, invitations, chat, contacts, and reservations.\n\n## Architecture\n\nMaven modules split model, core, mapper, reusable components, service, and API layers. MySQL and MyBatis handle durable data, with cache-backed components keeping frequently accessed state responsive.',
      zh: '## 项目概览\n\nEasy Meeting 是一个面向会议和协作流程的模块化 Spring Boot 后端，将领域模型、基础设施、服务和 API 适配层分开。\n\n## 实时协作\n\nNetty 与 WebSocket 为会议会话提供信令，Redis 和 RabbitMQ 负责消息与协调，业务服务覆盖会议创建、加入、邀请、聊天、联系人和预约。\n\n## 架构拆分\n\nMaven 工程拆分为 model、core、mapper、通用 components、service 和 API 层。MySQL 与 MyBatis 负责持久化，缓存组件提升高频状态访问的响应速度。',
    },
    tags: ['Java', 'Spring Boot', 'Netty', 'WebSocket', 'Redis', 'RabbitMQ', 'MySQL'],
    github: 'https://gitee.com/QingLuoCommunity/easy-meeting',
    demo: '#',
    coverUrl: '/assets/projects/easy-meeting-cover.png',
    coverAlt: 'Hand-drawn meeting table with connected people, speech bubbles, and a live signal',
    featured: false,
    visible: true,
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
export const SHOWCASE_STATUS: Record<ProjectStatus, [LocalizedText, string]> = {
  planning: [{ en: 'Planning', zh: '筹划中' }, 'neutral'],
  in_progress: [{ en: 'In progress', zh: '进行中' }, 'wip'],
  completed: [{ en: 'Completed', zh: '已完成' }, 'beta'],
  published: [{ en: 'Live', zh: '已上架' }, 'live'],
};

export const NAV_LINKS = [
  { label: { en: 'Home', zh: '首页' }, href: '/#top' },
  { label: { en: 'About', zh: '关于' }, href: '/about/' },
  { label: { en: 'Work', zh: '项目' }, href: '/projects/' },
  { label: { en: 'Skills', zh: '技能' }, href: '/skills/' },
  { label: { en: 'Writing', zh: '博客' }, href: '/blog/' },
];
