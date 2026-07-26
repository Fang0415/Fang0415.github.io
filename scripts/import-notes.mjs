import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: '/Users/fang/Developer/fang-blog/.env' });

const notesDir = '/Users/fang/Documents/数据结构笔记';
const postsDir = path.join(notesDir, '数据结构');

const bucket = process.env.MINIO_BUCKET || 'fang-blog';
const endpoint = process.env.MINIO_ENDPOINT || 'http://127.0.0.1:19000';
const publicBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL || `${endpoint.replace(/\/+$/, '')}/${bucket}`;

const s3 = new S3Client({
  region: process.env.MINIO_REGION || 'us-east-1',
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const slugMap = {
  '课程先导.md': 'data-structures-course-intro',
  '数据结构绪论.md': 'data-structures-intro',
  '线性表.md': 'linear-list',
  '栈和队列.md': 'stacks-and-queues',
  '串、数组和广义表.md': 'strings-arrays-generalized-lists',
  '树、二叉树和森林.md': 'trees-binary-trees-forests',
  '图.md': 'graphs',
  '查找.md': 'searching',
  '排序.md': 'sorting',
  'C语言相关的补充.md': 'c-language-supplement',
};

const descriptionMap = {
  'data-structures-course-intro': '数据结构课程的整体结构导览，理清各章节之间的衔接关系与学习路径。',
  'data-structures-intro': '从数据、数据元素到逻辑结构与存储结构，建立数据结构学习的整体框架，并理解算法效率的衡量方式。',
  'linear-list': '顺序表与链表的存储方式、基本操作和适用场景，以及循环链表和双向链表的扩展。',
  'stacks-and-queues': '两种受限线性结构的特性、实现与典型应用，包括表达式求值、层次遍历等场景。',
  'strings-arrays-generalized-lists': '串、数组与广义表三种线性结构变体的存储、操作与模式匹配思想。',
  'trees-binary-trees-forests': '树、二叉树与森林的定义、遍历、存储结构，以及它们之间的相互转换。',
  'graphs': '图的逻辑结构、邻接矩阵与邻接表存储、遍历方法，以及最短路径和最小生成树算法。',
  'searching': '顺序查找、折半查找、二叉排序树、平衡二叉树和散列表的原理与性能比较。',
  'sorting': '常见排序算法的思想、实现与性能分析，包括插入、交换、选择、归并和基数排序。',
  'c-language-supplement': '学习数据结构所需的 C 语言核心概念回顾，包括指针、数组、结构体与函数。',
};

function summaryFor(slug) {
  return descriptionMap[slug] || '';
}

function assetKey(filename) {
  const ext = filename.includes('.') ? filename.slice(filename.lastIndexOf('.')).toLowerCase() : '';
  const safeBase = filename
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'asset';
  const date = new Date();
  const prefix = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  return `uploads/${prefix}/${safeBase}-${crypto.randomUUID()}${ext}`;
}

async function uploadSvg(relPath) {
  const fullPath = path.join(notesDir, relPath);
  const body = fs.readFileSync(fullPath);
  const key = assetKey(path.basename(relPath));
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: 'image/svg+xml',
  }));
  const publicUrl = `${publicBaseUrl.replace(/\/+$/, '')}/${key}`;
  const asset = await prisma.asset.create({
    data: {
      key,
      bucket,
      filename: path.basename(relPath),
      mimeType: 'image/svg+xml',
      size: body.length,
      publicUrl,
    },
  });
  return { relPath, key, publicUrl, assetId: asset.id };
}

async function main() {
  const mdFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  const referencedSet = new Set();
  const fileContents = {};
  for (const f of mdFiles) {
    const raw = fs.readFileSync(path.join(postsDir, f), 'utf8');
    fileContents[f] = raw;
    const matches = raw.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g);
    for (const m of matches) {
      let rel = m[1].replace(/^(\.\.\/)+/, '');
      if (rel.startsWith('/')) rel = rel.slice(1);
      referencedSet.add(rel);
    }
  }
  const referenced = Array.from(referencedSet).filter((r) => r.endsWith('.svg'));
  console.log(`Found ${referenced.length} referenced SVGs`);

  const urlMap = {};
  for (const rel of referenced) {
    const full = path.join(notesDir, rel);
    if (!fs.existsSync(full)) {
      console.warn('Missing referenced asset:', rel);
      continue;
    }
    const result = await uploadSvg(rel);
    urlMap[rel] = result.publicUrl;
    console.log('Uploaded', rel);
  }

  for (const f of mdFiles) {
    const raw = fileContents[f];
    const parsed = matter(raw);
    const body = parsed.content;

    const content = body.replace(/(!\[[^\]]*\])\(([^)]+)\)/g, (match, alt, src) => {
      let rel = src.replace(/^(\.\.\/)+/, '');
      if (rel.startsWith('/')) rel = rel.slice(1);
      const url = urlMap[rel];
      if (!url) return match;
      return `${alt}(${url})`;
    });

    // Title: frontmatter > filename base
    const title = parsed.data.title || f.replace(/\.md$/, '');
    const slug = slugMap[f] || f.replace(/\.md$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const description = parsed.data.description || summaryFor(slug);
    const pubDate = parsed.data.time ? new Date(parsed.data.time) : new Date();

    await prisma.post.create({
      data: {
        slug,
        title,
        description,
        content,
        tags: ['数据结构'],
        status: 'PUBLISHED',
        publishedAt: pubDate,
        featured: false,
      },
    });
    console.log('Imported post:', title, 'slug:', slug);
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
