'use client';

import { useState } from 'react';
import {
  POST_STATUS_LABEL,
  api,
  formatDateTime,
  json,
  type AdminAsset,
  type AdminPost,
} from '../../lib/admin-client';
import { AssetPicker, EmptyState, Field, FieldRow, MarkdownField, PanelHeader, Toggle } from './fields';

interface Props {
  posts: AdminPost[];
  assets: AdminAsset[];
  onReload: () => Promise<void>;
  notify: (message: string, kind?: 'ok' | 'error') => void;
}

const empty = {
  title: '',
  slug: '',
  description: '',
  content: '',
  tags: '',
  status: 'DRAFT' as AdminPost['status'],
  coverAssetId: '',
  featured: false,
};

type Form = typeof empty;

export default function PostsPanel({ posts, assets, onReload, notify }: Props) {
  const [form, setForm] = useState<Form>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const edit = (post: AdminPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
      tags: post.tags.join(', '),
      status: post.status,
      coverAssetId: post.coverAssetId ?? '',
      featured: post.featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api(
        editingId ? `/api/admin/posts/${editingId}/` : '/api/admin/posts/',
        json(editingId ? 'PATCH' : 'POST', form),
      );
      notify(editingId ? '文章已更新' : '文章已创建');
      reset();
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (post: AdminPost) => {
    if (!window.confirm(`删除文章《${post.title}》？此操作不可撤销。`)) return;
    try {
      await api(`/api/admin/posts/${post.id}/`, { method: 'DELETE' });
      if (editingId === post.id) reset();
      notify('文章已删除');
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  /** One-click DRAFT ⇄ PUBLISHED, the only status change worth a shortcut. */
  const togglePublish = async (post: AdminPost) => {
    const next = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api(`/api/admin/posts/${post.id}/`, json('PATCH', { status: next }));
      notify(next === 'PUBLISHED' ? '已发布' : '已转为草稿');
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  return (
    <div className="admin-workspace">
      <section className="admin-card admin-card--list">
        <PanelHeader title="文章" count={posts.length}>
          {editingId && <button type="button" className="admin-secondary" onClick={reset}>新建</button>}
        </PanelHeader>
        {posts.length === 0 && <EmptyState>还没有文章，右侧表单可以创建第一篇。</EmptyState>}
        <div className="admin-rows">
          {posts.map((post) => (
            <article
              key={post.id}
              className={`admin-row ${editingId === post.id ? 'is-editing' : ''}`}
            >
              <div className="admin-row__main">
                <div className="admin-row__title">
                  <span className={`admin-dot admin-dot--${post.status.toLowerCase()}`} aria-hidden="true" />
                  <strong>{post.title || '未命名'}</strong>
                </div>
                <p className="admin-row__meta">
                  {POST_STATUS_LABEL[post.status]} · /blog/{post.slug} · {formatDateTime(post.updatedAt)}
                </p>
                {post.tags.length > 0 && (
                  <p className="admin-row__tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</p>
                )}
              </div>
              <div className="admin-row__actions">
                <button type="button" onClick={() => edit(post)}>编辑</button>
                <button type="button" onClick={() => togglePublish(post)}>
                  {post.status === 'PUBLISHED' ? '转草稿' : '发布'}
                </button>
                {post.status === 'PUBLISHED' && (
                  <a href={`/blog/${post.slug}/`} target="_blank" rel="noreferrer">预览</a>
                )}
                <button type="button" className="is-danger" onClick={() => remove(post)}>删除</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <form className="admin-card" onSubmit={submit}>
        <PanelHeader title={editingId ? '编辑文章' : '新建文章'}>
          {editingId && <button type="button" className="admin-secondary" onClick={reset}>取消编辑</button>}
        </PanelHeader>

        <Field label="标题">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="一句话说清这篇写了什么" />
        </Field>
        <FieldRow>
          <Field label="Slug" hint="留空按标题生成">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="rag-notes" />
          </Field>
          <Field label="状态">
            <select value={form.status} onChange={(e) => set('status', e.target.value as AdminPost['status'])}>
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">发布</option>
              <option value="ARCHIVED">归档</option>
            </select>
          </Field>
        </FieldRow>
        <Field label="摘要" hint="列表页与 RSS 用">
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="两三句话概括结论，读者靠它决定要不要点进来"
          />
        </Field>
        <FieldRow>
          <Field label="标签" hint="逗号分隔，决定分类色">
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="RAG, 检索, 评估" />
          </Field>
          <AssetPicker
            label="封面图"
            assets={assets}
            value={form.coverAssetId}
            onChange={(next) => set('coverAssetId', next)}
          />
        </FieldRow>
        <Toggle
          label="设为精选"
          hint="首页优先展示"
          checked={form.featured}
          onChange={(next) => set('featured', next)}
        />
        <MarkdownField label="正文" value={form.content} onChange={(next) => set('content', next)} />

        <div className="admin-form-foot">
          <button className="admin-primary" disabled={saving}>
            {saving ? '保存中…' : editingId ? '保存修改' : '创建文章'}
          </button>
          {editingId && <span className="admin-form-foot__note">正在编辑现有文章</span>}
        </div>
      </form>
    </div>
  );
}
