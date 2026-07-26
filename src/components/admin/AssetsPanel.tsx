'use client';

import { useRef, useState } from 'react';
import { ApiError, api, formatBytes, formatDateTime, type AdminAsset } from '../../lib/admin-client';
import { EmptyState, PanelHeader } from './fields';

interface Props {
  assets: AdminAsset[];
  storageReady: boolean;
  onReload: () => Promise<void>;
  notify: (message: string, kind?: 'ok' | 'error') => void;
}

export default function AssetsPanel({ assets, storageReady, onReload, notify }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Uploads sequentially: the endpoint takes one file per request. */
  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    let ok = 0;
    for (const file of list) {
      const body = new FormData();
      body.append('file', file);
      try {
        await api('/api/admin/assets/', { method: 'POST', body });
        ok += 1;
      } catch (error) {
        notify(`${file.name}：${(error as Error).message}`, 'error');
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
    if (ok) notify(`已上传 ${ok} 个文件`);
    await onReload();
  };

  const remove = async (asset: AdminAsset, force = false) => {
    if (!force && !window.confirm(`删除「${asset.filename}」？对象存储中的文件也会一并删除。`)) return;
    try {
      await api(`/api/admin/assets/${asset.id}/${force ? '?force=1' : ''}`, { method: 'DELETE' });
      notify('资源已删除');
      await onReload();
    } catch (error) {
      // 409 means the asset is still someone's cover. The server names the
      // referencing rows, so the operator can decide instead of guessing.
      if (error instanceof ApiError && error.status === 409) {
        if (window.confirm(`${error.message}。仍要删除吗？相关封面会被清空。`)) {
          await remove(asset, true);
        }
        return;
      }
      notify((error as Error).message, 'error');
    }
  };

  const copy = async (asset: AdminAsset) => {
    try {
      await navigator.clipboard.writeText(asset.publicUrl);
      setCopiedId(asset.id);
      window.setTimeout(() => setCopiedId((current) => (current === asset.id ? null : current)), 1600);
    } catch {
      notify('浏览器拒绝了剪贴板访问，可右键复制链接', 'error');
    }
  };

  const usage = (asset: AdminAsset) => {
    const counts = asset._count;
    if (!counts) return null;
    const total = counts.postCovers + counts.projectCovers + counts.profileAvatars;
    return total ? `被 ${total} 处引用` : '未被引用';
  };

  return (
    <div className="admin-workspace admin-workspace--single">
      {!storageReady && (
        <div className="admin-banner admin-banner--warn">
          未检测到对象存储配置（MINIO_ENDPOINT / ACCESS_KEY / SECRET_KEY）。上传会失败，请先配置并启动 MinIO。
        </div>
      )}

      <section className="admin-card">
        <PanelHeader title="资源" count={assets.length}>
          <button type="button" className="admin-secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
            选择文件
          </button>
        </PanelHeader>

        <div
          className={`admin-drop ${dragging ? 'is-dragging' : ''} ${uploading ? 'is-busy' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void upload(event.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml,application/pdf"
            onChange={(event) => event.target.files && void upload(event.target.files)}
          />
          <strong>{uploading ? '上传中…' : '把图片拖到这里，或点击选择'}</strong>
          <span>PNG / JPEG / WebP / GIF / AVIF / SVG / PDF，单个不超过 10 MB</span>
        </div>

        {assets.length === 0 && <EmptyState>还没有上传任何资源。</EmptyState>}

        <div className="admin-assets">
          {assets.map((asset) => (
            <figure className="admin-asset" key={asset.id}>
              <span className="admin-asset__thumb">
                {asset.mimeType.startsWith('image/')
                  ? <img src={asset.publicUrl} alt={asset.filename} loading="lazy" />
                  : <span className="admin-asset__file">{asset.mimeType.split('/')[1] ?? '文件'}</span>}
              </span>
              <figcaption className="admin-asset__body">
                <strong title={asset.filename}>{asset.filename}</strong>
                <span className="admin-asset__meta">
                  {formatBytes(asset.size)}
                  {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ''}
                </span>
                <span className="admin-asset__meta">{usage(asset)} · {formatDateTime(asset.createdAt)}</span>
                <span className="admin-asset__actions">
                  <button type="button" onClick={() => copy(asset)}>{copiedId === asset.id ? '已复制' : '复制链接'}</button>
                  <a href={asset.publicUrl} target="_blank" rel="noreferrer">打开</a>
                  <button type="button" className="is-danger" onClick={() => remove(asset)}>删除</button>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
