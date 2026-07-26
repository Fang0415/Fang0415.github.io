/**
 * Browser-side counterpart to lib/admin-api.ts. Every dashboard panel talks to
 * the API through `api()` so a 401 always lands the operator back on the login
 * page instead of silently showing an empty list, and every other failure
 * surfaces the server's own Chinese message rather than a generic "失败".
 */

export interface AdminAsset {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  publicUrl: string;
  createdAt: string;
  _count?: { postCovers: number; projectCovers: number; profileAvatars: number };
}

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  coverAssetId: string | null;
  coverAsset?: AdminAsset | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string | null;
  category: string;
  stack: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  coverAssetId: string | null;
  coverAsset?: AdminAsset | null;
  status: 'BUILDING' | 'ACTIVE' | 'SHIPPED' | 'ARCHIVED';
  sortOrder: number;
  updatedAt: string;
}

export interface AdminExperience {
  id: string;
  slug: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
  visible: boolean;
  sortOrder: number;
}

export interface AdminProfile {
  id: string;
  name: string;
  wordmark: string;
  mark: string;
  role: string;
  location: string;
  hero: string;
  lead: string;
  email: string;
  github: string;
  wechat: string;
  aboutIntro: string;
  focus: string[];
  tools: string[];
  now: string[];
  background: string[];
  avatarAssetId: string | null;
  avatarAsset?: AdminAsset | null;
}

export interface SessionState {
  authenticated: boolean;
  database: 'up' | 'down' | 'unknown';
  storage?: boolean;
}

/** Thrown by `api()`; carries the HTTP status so callers can special-case 409. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

const LOGIN_URL = '/admin/login/';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, init);
  } catch {
    throw new ApiError(0, '网络请求失败，请确认服务仍在运行');
  }

  if (res.status === 401) {
    // The cookie is a hard 7-day expiry, so this is a real re-login, not a
    // transient blip worth retrying.
    window.location.href = LOGIN_URL;
    throw new ApiError(401, '登录状态已失效，正在跳转登录页');
  }

  const body = res.status === 204
    ? {}
    : (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    throw new ApiError(res.status, String(body.error || `请求失败（${res.status}）`), body);
  }
  return body as T;
}

export function json(method: 'POST' | 'PATCH' | 'PUT', payload: unknown): RequestInit {
  return {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

export function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return '—';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Returns a copy of `ids` with the item at `index` moved one slot up or down.
 * The reorder endpoints take a full ordered list, so the caller sends the whole
 * array back rather than a delta.
 */
export function moveInList<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export const POST_STATUS_LABEL: Record<AdminPost['status'], string> = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
};

export const PROJECT_STATUS_LABEL: Record<AdminProject['status'], string> = {
  BUILDING: '开发中',
  ACTIVE: '活跃维护',
  SHIPPED: '已发布',
  ARCHIVED: '已归档',
};
