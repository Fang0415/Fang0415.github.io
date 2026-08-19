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
import { AssetPicker, EmptyState, Field, FieldRow, MarkdownField, PanelHeader, Toggle } from './fields';

interface Props {
  projects: AdminProject[];
  assets: AdminAsset[];
  onReload: () => Promise<void>;
  notify: (message: string, kind?: 'ok' | 'error') => void;
}

const empty = {
  titleZh: '',
  titleEn: '',
  slug: '',
  summaryZh: '',
  summaryEn: '',
  contentZh: '',
  contentEn: '',
  highlightsZh: '',
  highlightsEn: '',
  category: '',
  tags: '',
  githubUrl: '',
  demoUrl: '',
  status: 'PLANNING' as AdminProject['status'],
  coverAssetId: '',
  featured: false,
  visible: true,
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
      titleZh: project.title.zh,
      titleEn: project.title.en,
      slug: project.slug,
      summaryZh: project.summary.zh,
      summaryEn: project.summary.en,
      contentZh: project.content?.zh ?? '',
      contentEn: project.content?.en ?? '',
      highlightsZh: project.highlights.zh.join('\n'),
      highlightsEn: project.highlights.en.join('\n'),
      category: project.category,
      tags: project.tags.join(', '),
      githubUrl: project.githubUrl ?? '',
      demoUrl: project.demoUrl ?? '',
      status: project.status,
      coverAssetId: project.coverAssetId ?? '',
      featured: project.featured,
      visible: project.visible,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api(
        editingId ? `/api/admin/projects/${editingId}/` : '/api/admin/projects/',
        json(editingId ? 'PATCH' : 'POST', {
          slug: form.slug,
          title: { zh: form.titleZh, en: form.titleEn },
          summary: { zh: form.summaryZh, en: form.summaryEn },
          content: { zh: form.contentZh, en: form.contentEn },
          highlights: { zh: form.highlightsZh, en: form.highlightsEn },
          category: form.category,
          tags: form.tags,
          githubUrl: form.githubUrl,
          demoUrl: form.demoUrl,
          status: form.status,
          coverAssetId: form.coverAssetId,
          featured: form.featured,
          visible: form.visible,
        }),
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
    if (!window.confirm(`删除项目《${project.title.zh || project.title.en}》？`)) return;
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
                  <strong>{project.title.zh || project.title.en || '未命名'}</strong>
                </div>
                <p className="admin-row__meta">
                  {PROJECT_STATUS_LABEL[project.status]} · {project.category || '未分类'} · #{project.sortOrder}
                </p>
                {project.tags.length > 0 && (
                  <p className="admin-row__tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</p>
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
          <Field label="项目名称（中文）">
            <input value={form.titleZh} onChange={(e) => set('titleZh', e.target.value)} placeholder="ragkit" />
          </Field>
          <Field label="Project name (English)">
            <input value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} placeholder="ragkit" />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="Slug" hint="留空按名称生成">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="ragkit" />
          </Field>
          <Field label="分类" hint="项目页筛选用">
            <input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="AI / RAG" />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="一句话摘要（中文）" hint="卡片与精选区展示">
            <textarea
              rows={3}
              value={form.summaryZh}
              onChange={(e) => set('summaryZh', e.target.value)}
              placeholder="它解决什么问题，用一句话说清"
            />
          </Field>
          <Field label="Summary (English)" hint="Used by cards and featured work">
            <textarea
              rows={3}
              value={form.summaryEn}
              onChange={(e) => set('summaryEn', e.target.value)}
              placeholder="Explain the problem this project solves."
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="状态">
            <select value={form.status} onChange={(e) => set('status', e.target.value as AdminProject['status'])}>
              <option value="PLANNING">筹划中</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="COMPLETED">已完成</option>
              <option value="PUBLISHED">已上架</option>
            </select>
          </Field>
          <Field label="标签" hint="逗号分隔，卡片最多展示四个">
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Java, Python, Redis" />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="GitHub 地址" hint="可暂时留空">
            <input value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/…" />
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
        <FieldRow>
          <Field label="项目要点（中文）" hint="每行一条">
            <textarea rows={5} value={form.highlightsZh} onChange={(e) => set('highlightsZh', e.target.value)} />
          </Field>
          <Field label="Highlights (English)" hint="One item per line">
            <textarea rows={5} value={form.highlightsEn} onChange={(e) => set('highlightsEn', e.target.value)} />
          </Field>
        </FieldRow>
        <Toggle
          label="设为首页精选"
          hint="精选项目优先出现在项目展示区"
          checked={form.featured}
          onChange={(next) => set('featured', next)}
        />
        <Toggle
          label="前台可见"
          hint="关闭后仍保留数据，但不会出现在项目列表"
          checked={form.visible}
          onChange={(next) => set('visible', next)}
        />
        <MarkdownField
          label="项目详情（中文）"
          value={form.contentZh}
          onChange={(next) => set('contentZh', next)}
          rows={12}
          hint="留空则详情页只显示摘要"
        />
        <MarkdownField
          label="Project details (English)"
          value={form.contentEn}
          onChange={(next) => set('contentEn', next)}
          rows={12}
          hint="Falls back to Chinese when left empty"
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
