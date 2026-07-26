import crypto from 'node:crypto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

/** True when credentials were configured rather than left at the defaults. */
export function hasStorageConfig() {
  return Boolean(process.env.MINIO_ENDPOINT && process.env.MINIO_ACCESS_KEY && process.env.MINIO_SECRET_KEY);
}

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

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
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

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'application/pdf',
]);

/**
 * Reads width/height straight out of the file header. The Asset table has had
 * width/height columns all along but nothing ever filled them, and pulling in
 * sharp for four header formats is not worth a native dependency.
 */
export function imageSize(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 24) return null;

  // PNG: 8-byte signature, then an IHDR chunk whose payload starts at byte 16.
  if (buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // GIF: "GIF87a"/"GIF89a" then little-endian 16-bit width/height.
  if (buffer.toString('ascii', 0, 3) === 'GIF') {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }

  // WebP (VP8X/VP8 /VP8L) inside a RIFF container.
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const format = buffer.toString('ascii', 12, 16);
    if (format === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
    if (format === 'VP8 ') {
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    }
    if (format === 'VP8L') {
      const bits = buffer.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return null;
  }

  // JPEG: walk the marker chain until a start-of-frame carries the dimensions.
  if (buffer.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      // SOF0-SOF15, skipping DHT(c4), JPG(c8), DAC(cc) which are not frames.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }

  return null;
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
