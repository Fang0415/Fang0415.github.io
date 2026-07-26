import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: '/Users/fang/Developer/fang-blog/.env' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const descriptions = {
  'data-structures-intro': '从数据、数据元素到逻辑结构与存储结构，建立数据结构学习的整体框架，并理解算法效率的衡量方式。',
  'linear-list': '顺序表与链表的存储方式、基本操作和适用场景，以及循环链表和双向链表的扩展。',
  'stacks-and-queues': '两种受限线性结构的特性、实现与典型应用，包括表达式求值、层次遍历等场景。',
  'strings-arrays-generalized-lists': '串、数组与广义表三种线性结构变体的存储、操作与模式匹配思想。',
  'trees-binary-trees-forests': '树、二叉树与森林的定义、遍历、存储结构，以及它们之间的相互转换。',
  'graphs': '图的逻辑结构、邻接矩阵与邻接表存储、遍历方法，以及最短路径和最小生成树算法。',
  'searching': '顺序查找、折半查找、二叉排序树、平衡二叉树和散列表的原理与性能比较。',
  'sorting': '常见排序算法的思想、实现与性能分析，包括插入、交换、选择、归并和基数排序。',
  'c-language-supplement': '学习数据结构所需的 C 语言核心概念回顾，包括指针、数组、结构体与函数。',
  'data-structures-course-intro': '数据结构课程的整体结构导览，理清各章节之间的衔接关系与学习路径。',
};

async function main() {
  for (const [slug, description] of Object.entries(descriptions)) {
    const result = await prisma.post.updateMany({
      where: { slug },
      data: { description },
    });
    console.log(slug, result.count > 0 ? 'updated' : 'not found');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
