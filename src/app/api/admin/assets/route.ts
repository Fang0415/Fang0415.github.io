import { NextRequest, NextResponse } from 'next/server';
import { HttpError, adminRoute } from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  assetKey,
  imageSize,
  uploadObject,
} from '../../../../lib/storage';

export const GET = adminRoute(async () => {
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { postCovers: true, projectCovers: true, profileAvatars: true } },
    },
  });
  return NextResponse.json({ assets });
});

export const POST = adminRoute(async (request: NextRequest) => {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, '请选择文件');
  if (file.size === 0) throw new HttpError(400, '文件内容为空');
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new HttpError(413, `文件超过 ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB 上限`);
  }

  const mimeType = file.type || 'application/octet-stream';
  if (!ALLOWED_UPLOAD_TYPES.has(mimeType)) {
    throw new HttpError(415, `不支持的文件类型：${mimeType}`);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dimensions = mimeType.startsWith('image/') ? imageSize(bytes) : null;

  let uploaded;
  try {
    uploaded = await uploadObject({ key: assetKey(file.name), body: bytes, contentType: mimeType });
  } catch (error) {
    // A missing bucket or a stopped MinIO is by far the most common cause here,
    // and the raw SDK error says nothing useful to whoever is uploading.
    console.error('[assets] upload failed', error);
    throw new HttpError(502, '对象存储写入失败，请检查 MinIO 服务与 bucket 配置');
  }

  const asset = await prisma.asset.create({
    data: {
      key: uploaded.key,
      bucket: uploaded.bucket,
      publicUrl: uploaded.publicUrl,
      filename: file.name,
      mimeType,
      size: file.size,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
    },
  });

  return NextResponse.json({ asset }, { status: 201 });
});
