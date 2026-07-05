import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminResponse } from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';
import { assetKey, uploadObject } from '../../../../lib/storage';

export async function GET() {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const assets = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ assets });
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '请选择文件' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const key = assetKey(file.name);
  const uploaded = await uploadObject({
    key,
    body: bytes,
    contentType: file.type || 'application/octet-stream',
  });

  const asset = await prisma.asset.create({
    data: {
      key: uploaded.key,
      bucket: uploaded.bucket,
      publicUrl: uploaded.publicUrl,
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
    },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
