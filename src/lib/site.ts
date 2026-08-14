// Central site data for the Folio persona. Profile + projects power the
// home hero, showcase, footer, and about page. Real posts come from the
// content collection (see posts.ts); these are the static persona bits.

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
    content: {
      zh: `## 项目概览

LinkRag 面向个人与团队的知识管理场景，将文档上传、解析、分块、索引、检索和生成串成一条完整链路。用户可以围绕自己的数据集直接提问，回答通过流式接口返回，并能回到原始知识片段核对依据。

## 三仓协作

系统由三个仓库共同组成。React 前端负责知识库管理与对话交互；Java 管理端负责用户、权限、数据集、文件、模型配置与任务编排；Python RAG 服务负责文档理解、索引构建、混合召回、重排和答案生成。

常规业务请求由前端发送给 Java 服务。开始问答时，前端先向 Java 申请带数据集权限的短期凭证，再凭凭证直连 Python 的 SSE 接口，避免让管理服务承担长连接流量。

## 文档处理

PDF、Word 和 HTML 会被统一整理为结构化 Markdown。分块过程感知标题层级，同时保护表格、代码、公式和图片等完整元素，避免只按固定长度截断造成上下文破坏。每个知识片段都会携带标题路径和来源信息，供检索与引用使用。

## 检索与生成

查询侧并行执行稠密向量、稀疏向量和 BM25 三路召回，再通过 RRF 融合与可选的 rerank 精排收敛结果。生成阶段按 token 预算组织上下文，并要求模型只依据召回内容回答；没有足够依据时返回明确的无答案状态。

## 可靠性设计

文档入库的各阶段状态会写入 MySQL。任务失败后可以从首个未完成阶段继续执行，已经完成的计算无需重复。Java 与 Python 通过 RabbitMQ、MySQL、Redis 和 MinIO 协作，Qdrant 承担向量及稀疏检索。`,
      en: `## Overview

LinkRag is a full-stack knowledge system for individuals and teams. It connects document upload, parsing, chunking, indexing, retrieval, and generation into one workflow. Users can ask questions against their own datasets, receive answers as a stream, and trace each response back to the retrieved source material.

## Three repositories, one product

The system is split across three repositories. The React client provides knowledge-base management and conversation flows. The Java control plane owns users, permissions, datasets, files, model configuration, and task orchestration. The Python RAG engine handles document understanding, indexing, hybrid retrieval, reranking, and answer generation.

Regular application requests go through the Java service. For a conversation, the client first requests a short-lived, dataset-scoped session from Java and then connects directly to the Python SSE endpoint. This keeps long-running streams away from the control plane.

## Document processing

PDF, Word, and HTML inputs are normalized into structured Markdown. Chunking respects heading hierarchy and protects tables, code, formulas, and images from arbitrary fixed-length cuts. Each knowledge unit retains its heading path and source metadata for retrieval and citation.

## Retrieval and generation

Queries run through dense, sparse, and BM25 retrieval in parallel. Results converge through reciprocal-rank fusion with optional reranking. The generation stage assembles retrieved context within a token budget and requires the model to answer from that evidence, including an explicit no-answer outcome when the sources are insufficient.

## Reliability

Each ingestion stage records its state in MySQL. Failed tasks can resume from the first unfinished stage without repeating completed work. Java and Python coordinate through RabbitMQ, MySQL, Redis, and MinIO, while Qdrant provides dense and sparse retrieval.`,
    },
    tags: ['RAG', 'Python', 'FastAPI', 'Java', 'Spring Boot', 'React', 'TypeScript', 'Qdrant', 'RabbitMQ', 'MySQL'],
    github: 'https://github.com/ql-link/LinkRag',
    demo: 'https://linkrag.cn/',
    coverUrl: '/assets/projects/linkrag-cover.png',
    coverAlt: 'Hand-drawn documents flowing through a retrieval funnel into a connected knowledge network',
    featured: true,
    visible: true,
  },
  {
    id: 'notes-cli', title: { en: 'notes-cli', zh: 'notes-cli' }, status: 'in_progress', category: 'Developer Tool',
    summary: {
      en: 'A terminal-first note tool that stores everything as portable Markdown files.',
      zh: '终端笔记工具，数据是普通 Markdown 文件，换机器直接带走。',
    },
    highlights: {
      en: ['Markdown note archiving', 'Lightweight search and tags'],
      zh: ['Markdown 笔记归档', '轻量搜索与标签'],
    },
    tags: ['Go', 'SQLite'], featured: true, visible: true,
  },
  {
    id: 'streamq', title: { en: 'streamq', zh: 'streamq' }, status: 'completed', category: 'Backend',
    summary: {
      en: 'A compact persistent task queue built on Postgres for services that do not need Kafka.',
      zh: '用 Postgres 做的小型持久任务队列，给不需要 Kafka 的服务用。',
    },
    highlights: {
      en: ['Persistent task states', 'Retries and observable events'],
      zh: ['持久化任务状态', '失败重试与可观测事件'],
    },
    tags: ['Rust', 'Postgres'], featured: true, visible: true,
  },
  {
    id: 'embed-bench', title: { en: 'embed-bench', zh: 'embed-bench' }, status: 'in_progress', category: 'AI / RAG',
    summary: {
      en: 'A shared dataset and metric suite for comparing retrieval quality across embedding models.',
      zh: '同一套数据和指标，横向对比 embedding 模型的检索效果。',
    },
    highlights: {
      en: ['Multi-model comparison', 'Retrieval metrics and sample replay'],
      zh: ['多模型对比', '检索指标与样本回放'],
    },
    tags: ['Python', 'DuckDB'], featured: true, visible: true,
  },
  {
    id: 'dotfiles', title: { en: 'dotfiles', zh: 'dotfiles' }, status: 'completed', category: 'Developer Tool',
    summary: {
      en: 'Portable terminal, editor, and shell configuration for restoring a working environment on a new machine.',
      zh: '终端、编辑器、shell 配置，新机器一键恢复环境。',
    },
    highlights: {
      en: ['Shell and editor configuration', 'Cross-machine bootstrap scripts'],
      zh: ['Shell 与编辑器配置', '跨机器初始化脚本'],
    },
    tags: ['Shell', 'Lua'], featured: false, visible: false,
  },
  {
    id: 'logpipe', title: { en: 'logpipe', zh: 'logpipe' }, status: 'completed', category: 'Backend',
    summary: {
      en: 'A pipeline that turns irregular service logs into structured events for ClickHouse queries.',
      zh: '把混乱的服务日志整理成结构化事件，写入 ClickHouse 供排错查询。',
    },
    highlights: {
      en: ['Structured event extraction', 'ClickHouse ingestion and queries'],
      zh: ['结构化事件提取', 'ClickHouse 写入与查询'],
    },
    tags: ['Go', 'ClickHouse'], featured: false, visible: true,
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
  { label: { en: 'About', zh: '关于' }, href: '/about/' },
  { label: { en: 'Work', zh: '项目' }, href: '/projects/' },
  { label: { en: 'Skills', zh: '技能' }, href: '/skills/' },
  { label: { en: 'Writing', zh: '博客' }, href: '/blog/' },
];
