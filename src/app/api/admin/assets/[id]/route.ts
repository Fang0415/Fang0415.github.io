import { NextRequest, NextResponse } from 'next/server';
import { HttpError, adminRoute } from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';
import { deleteObject } from '../../../../../lib/storage';

interface Params {
  id: string;
}

type Ctx = { params: Promise<Params> };

/**
 * Deleting an asset that is still a cover would silently blank that cover
 * (the FK is onDelete: SetNull), so refuse and name the referencing rows.
 * `?force=1` overrides once the operator knows what breaks.
 */
export const DELETE = adminRoute(async (request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const force = new URL(request.url).searchParams.get('force') === '1';

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      postCovers: { select: { title: true } },
      projectCovers: { select: { title: true } },
      profileAvatars: { select: { id: true } },
    },
  });
  if (!asset) throw new HttpError(404, '资源不存在');

  const usedBy = [
    ...asset.postCovers.map((post) => `文章《${post.title}》`),
    ...asset.projectCovers.map((project) => `项目《${project.title}》`),
    ...asset.profileAvatars.map(() => '站点头像'),
  ];
  if (usedBy.length && !force) {
    return NextResponse.json(
      { error: `该资源正被 ${usedBy.join('、')} 使用`, usedBy },
      { status: 409 },
    );
  }

  await prisma.asset.delete({ where: { id } });
  try {
    await deleteObject(asset.key);
  } catch (error) {
    // The row is already gone; a leftover object is a storage-cleanup problem,
    // not a reason to fail the request the operator just made.
    console.error('[assets] object delete failed', asset.key, error);
    return NextResponse.json({ ok: true, warning: '数据库记录已删除，但对象存储清理失败' });
  }

  return NextResponse.json({ ok: true });
});
