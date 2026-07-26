'use client';

import { useState } from 'react';
import {
  PROJECT_STATUS_LABEL,
  api,
  json,
  moveInList,
  type AdminAsset,
  type AdminProject,
} from '../../lib/admin-client';
import { AssetPicker, EmptyState, Field, FieldRow, MarkdownField, PanelHeader } from './fields';

interface Props {
  projects: AdminProject[];
  assets: AdminAsset[];
  onReload: () => Promise<void>;
  notify: (message: string, kind?: 'ok' | 'error') => void;
}

const empty = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: '',
  stack: '',
  repoUrl: '',
  demoUrl: '',
  status: 'BUILDING' as AdminProject['status'],
  coverAssetId: '',
};

type Form = typeof empty;

export default function ProjectsPanel({ projects, assets, onReload, notify }: Props) {
  const [form, setForm] = useState<Form>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const edit = (project: AdminProject) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      content: project.content ?? '',
      category: project.category,
      stack: project.stack.join(', '),
      repoUrl: project.repoUrl ?? '',
      demoUrl: project.demoUrl ?? '',
      status: project.status,
      coverAssetId: project.coverAssetId ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api(
        editingId ? `/api/admin/projects/${editingId}/` : '/api/admin/projects/',
        json(editingId ? 'PATCH' : 'POST', form),
      );
      notify(editingId ? '项目已更新' : '项目已创建');
      reset();
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (project: AdminProject) => {
    if (!window.confirm(`删除项目《${project.title}》？`)) return;
    try {
      await api(`/api/admin/projects/${project.id}/`, { method: 'DELETE' });
      if (editingId === project.id) reset();
      notify('项目已删除');
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  /**
   * The showcase and the projects page both read sortOrder, so ordering is
   * editorial rather than cosmetic. Arrows send the whole reordered id list.
   */
  const move = async (index: number, direction: -1 | 1) => {
    const next = moveInList(projects, index, direction);
    if (next === projects) return;
    setReordering(true);
    try {
      await api('/api/admin/projects/reorder/', json('PUT', { ids: next.map((item) => item.id) }));
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="admin-workspace">
      <section className="admin-card admin-card--list">
        <PanelHeader title="项目" count={projects.length}>
          {editingId && <button type="button" className="admin-secondary" onClick={reset}>新建</button>}
        </PanelHeader>
        <p className="admin-note">顺序即首页精选与项目页的展示顺序。</p>
        {projects.length === 0 && <EmptyState>还没有项目。</EmptyState>}
        <div className="admin-rows">
          {projects.map((project, index) => (
            <article key={project.id} className={`admin-row ${editingId === project.id ? 'is-editing' : ''}`}>
              <div className="admin-row__main">
                <div className="admin-row__title">
                  <span className={`admin-dot admin-dot--${project.status.toLowerCase()}`} aria-hidden="true" />
                  <strong>{project.title}</strong>
                </div>
                <p className="admin-row__meta">
                  {PROJECT_STATUS_LABEL[project.status]} · {project.category || '未分类'} · #{project.sortOrder}
                </p>
                {project.stack.length > 0 && (
                  <p className="admin-row__tags">{project.stack.map((s) => <span key={s}>{s}</span>)}</p>
                )}
              </div>
              <div className="admin-row__actions">
                <span className="admin-move">
                  <button
                    type="button"
                    aria-label="上移"
                    disabled={index === 0 || reordering}
                    onClick={() => move(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="下移"
                    disabled={index === projects.length - 1 || reordering}
                    onClick={() => move(index, 1)}
                  >
                    ↓
                  </button>
                </span>
                <button type="button" onClick={() => edit(project)}>编辑</button>
                <a href={`/projects/${project.slug}/`} target="_blank" rel="noreferrer">预览</a>
                <button type="button" className="is-danger" onClick={() => remove(project)}>删除</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <form className="admin-card" onSubmit={submit}>
        <PanelHeader title={editingId ? '编辑项目' : '新建项目'}>
          {editingId && <button type="button" className="admin-secondary" onClick={reset}>取消编辑</button>}
        </PanelHeader>

        <FieldRow>
          <Field label="项目名称">
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="ragkit" />
          </Field>
          <Field label="Slug" hint="留空按名称生成">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="ragkit" />
          </Field>
        </FieldRow>
        <Field label="一句话摘要" hint="卡片与精选区展示">
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="它解决什么问题，用一句话说清"
          />
        </Field>
        <FieldRow>
          <Field label="分类" hint="项目页筛选用">
            <input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="AI / RAG" />
          </Field>
          <Field label="状态">
            <select value={form.status} onChange={(e) => set('status', e.target.value as AdminProject['status'])}>
              <option value="BUILDING">开发中</option>
              <option value="ACTIVE">活跃维护</option>
              <option value="SHIPPED">已发布</option>
              <option value="ARCHIVED">已归档（前台隐藏）</option>
            </select>
          </Field>
        </FieldRow>
        <Field label="技术栈" hint="逗号分隔">
          <input value={form.stack} onChange={(e) => set('stack', e.target.value)} placeholder="Python, Postgres, pgvector" />
        </Field>
        <FieldRow>
          <Field label="仓库地址" hint="http(s):// 或 /">
            <input value={form.repoUrl} onChange={(e) => set('repoUrl', e.target.value)} placeholder="https://github.com/…" />
          </Field>
          <Field label="演示地址">
            <input value={form.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://…" />
          </Field>
        </FieldRow>
        <AssetPicker
          label="封面图"
          assets={assets}
          value={form.coverAssetId}
          onChange={(next) => set('coverAssetId', next)}
          hint="详情页顶部展示"
        />
        <MarkdownField
          label="项目详情"
          value={form.content}
          onChange={(next) => set('content', next)}
          rows={12}
          hint="留空则详情页只显示摘要"
        />

        <div className="admin-form-foot">
          <button className="admin-primary" disabled={saving}>
            {saving ? '保存中…' : editingId ? '保存修改' : '创建项目'}
          </button>
        </div>
      </form>
    </div>
  );
}
