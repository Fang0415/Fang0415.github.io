export type AiSkill = {
  name: string;
  poster: string;
  summary: string;
  summaryZh: string;
};

export const AI_SKILLS: AiSkill[] = [
  {
    name: 'anthropic-art',
    poster: '/assets/personal-brand/skill-cards-anthropic/backend-systems.png',
    summary: 'Creates full-background editorial illustrations in a warm, hand-drawn Anthropic visual language.',
    summaryZh: '为 AI 提供一套稳定的 Anthropic 手绘编辑插画生成流程与视觉规范。',
  },
  {
    name: 'technical-article-illustrator',
    poster: '/assets/personal-brand/skill-cards-anthropic/java.png',
    summary: 'Turns technical writing into restrained, consistent diagrams and editorial illustrations.',
    summaryZh: '把技术文章中的结构、对比和因果关系转化为统一风格的配图。',
  },
  {
    name: 'hatch-pet',
    poster: '/assets/personal-brand/skill-cards-anthropic/python.png',
    summary: 'Builds and validates complete animated pet sprite packages for Codex.',
    summaryZh: '生成、校验并打包可在 Codex 中使用的完整动画宠物素材。',
  },
  {
    name: 'blog-writer',
    poster: '/assets/personal-brand/skill-cards-anthropic/databases.png',
    summary: 'Writes project-based technical articles from real requirements, implementation, and code context.',
    summaryZh: '基于真实需求、实现逻辑与代码上下文，整理并撰写项目技术博客。',
  },
  {
    name: 'project-readme-writer',
    poster: '/assets/personal-brand/skill-cards-anthropic/caching.png',
    summary: 'Produces bilingual open-source READMEs that balance engineering depth with product clarity.',
    summaryZh: '为开源项目生成兼顾工程深度与产品表达的中英文 README。',
  },
  {
    name: 'deep-interview',
    poster: '/assets/personal-brand/skill-cards-anthropic/rag-systems.png',
    summary: 'Explains interview topics from engineering problems down to OS and CPU fundamentals.',
    summaryZh: '从工程问题出发，下探 OS 与 CPU 原理，组织成可理解的技术面试专题。',
  },
  {
    name: 'tech-research',
    poster: '/assets/personal-brand/skill-cards-anthropic/ai-agents.png',
    summary: 'Runs multi-angle technical research, cross-checks sources, and delivers a cited report.',
    summaryZh: '分解技术问题、多角度检索并交叉验证，最终产出带来源的调研报告。',
  },
  {
    name: 'tech-design-dive',
    poster: '/assets/personal-brand/skill-cards-anthropic/linux.png',
    summary: 'Investigates why mature technologies are designed as they are, including trade-offs and constraints.',
    summaryZh: '追溯成熟技术的设计动机、核心抽象、取舍、约束与长期边界。',
  },
  {
    name: 'tech-learn',
    poster: '/assets/personal-brand/skill-cards-anthropic/docker.png',
    summary: 'Builds a progressive, self-contained learning page for an unfamiliar technical concept.',
    summaryZh: '把陌生技术概念整理为从入门到深入、可独立阅读的学习页面。',
  },
  {
    name: 'code-sketchnote-prompt',
    poster: '/assets/personal-brand/skill-cards-anthropic/typescript.png',
    summary: 'Reads real code and writes image prompts for hand-drawn module sketchnotes.',
    summaryZh: '读取真实代码，为模块生成可直接用于图像模型的手绘笔记提示词。',
  },
  {
    name: 'archify',
    poster: '/assets/personal-brand/skill-cards-anthropic/api-design.png',
    summary: 'Creates standalone architecture, workflow, sequence, and lifecycle diagrams.',
    summaryZh: '生成可独立交付的架构图、流程图、时序图和生命周期图。',
  },
  {
    name: 'excalidraw-skill',
    poster: '/assets/personal-brand/skill-cards-anthropic/deployment.png',
    summary: 'Lets an AI create and iteratively refine diagrams on a live Excalidraw canvas.',
    summaryZh: '让 AI 在实时 Excalidraw 画布中创建、检查并持续调整图形。',
  },
  {
    name: 'fireworks-tech-graph',
    poster: '/assets/personal-brand/skill-cards-anthropic/engineering-notes.png',
    summary: 'Produces structured technical diagrams and visual explanations from system descriptions.',
    summaryZh: '根据系统或流程描述生成结构化技术图示与可视化说明。',
  },
  {
    name: 'skill-creator',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/saturn.png',
    summary: 'Creates, improves, evaluates, and benchmarks reusable AI skills.',
    summaryZh: '创建、改进并评测可复用的 AI Skill，同时检查触发准确性。',
  },
  {
    name: 'mcp-builder',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/mars.png',
    summary: 'Guides the design of reliable MCP servers and model-friendly external tools.',
    summaryZh: '指导 AI 设计可靠的 MCP Server，以及适合模型调用的外部工具。',
  },
  {
    name: 'webapp-testing',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/solar-system.png',
    summary: 'Uses Playwright to inspect, debug, and visually verify local web applications.',
    summaryZh: '使用 Playwright 检查、调试并进行本地 Web 应用的视觉验证。',
  },
  {
    name: 'humanizer-zh',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/computer-science.png',
    summary: 'Finds common AI-writing patterns and rewrites Chinese text into a more natural voice.',
    summaryZh: '识别常见的 AI 写作痕迹，把中文内容调整得更自然、克制。',
  },
  {
    name: 'doc-coauthoring',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/biology.png',
    summary: 'Structures collaborative writing from context gathering through refinement and reader testing.',
    summaryZh: '把协作文档写作组织为背景收集、结构打磨与读者验证三个阶段。',
  },
  {
    name: 'docx',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/physics.png',
    summary: 'Reads, creates, edits, and validates professionally formatted Word documents.',
    summaryZh: '读取、创建、编辑并校验具有专业排版的 Word 文档。',
  },
  {
    name: 'pdf',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/chemistry.png',
    summary: 'Handles PDF extraction, creation, conversion, forms, OCR, and page operations.',
    summaryZh: '处理 PDF 提取、创建、转换、表单、OCR 与页面级操作。',
  },
  {
    name: 'pptx',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/literature.png',
    summary: 'Reads, creates, edits, and validates presentation decks and slide files.',
    summaryZh: '读取、创建、编辑并校验演示文稿与 PPTX 文件。',
  },
  {
    name: 'ppt-master',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/philosophy.png',
    summary: 'Converts source material into designed SVG pages and presentation-ready decks.',
    summaryZh: '把源文档转化为经过设计的 SVG 页面和可交付演示文稿。',
  },
  {
    name: 'xlsx',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/history.png',
    summary: 'Creates, edits, cleans, calculates, and verifies spreadsheet deliverables.',
    summaryZh: '创建、编辑、清洗、计算并校验电子表格交付物。',
  },
  {
    name: 'claude-api',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/mathematics.png',
    summary: 'Builds and debugs Claude API applications with Anthropic SDK best practices.',
    summaryZh: '按照 Anthropic SDK 的工程规范构建和调试 Claude API 应用。',
  },
  {
    name: 'internal-comms',
    poster: '/assets/personal-brand/skill-cards-anthropic/expansion/astronomy.png',
    summary: 'Drafts structured status updates, reports, FAQs, newsletters, and incident communications.',
    summaryZh: '撰写结构化状态更新、报告、FAQ、内部通讯与事故通报。',
  },
];
