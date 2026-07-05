import crypto from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucket = process.env.MINIO_BUCKET || 'fang-blog';
const endpoint = process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000';
const publicBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL || `${endpoint.replace(/\/+$/, '')}/${bucket}`;

export const s3 = new S3Client({
  region: process.env.MINIO_REGION || 'us-east-1',
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
});

export function getAssetPublicUrl(key: string) {
  return `${publicBaseUrl.replace(/\/+$/, '')}/${key}`;
}

export async function uploadObject(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: input.key,
    Body: input.body,
    ContentType: input.contentType,
  }));
  return {
    bucket,
    key: input.key,
    publicUrl: getAssetPublicUrl(input.key),
  };
}

export async function createUploadUrl(input: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: input.key,
    ContentType: input.contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: input.expiresIn ?? 300 });
}

export function assetKey(filename: string) {
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
