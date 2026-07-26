'use client';

import { useState } from 'react';
import { api, json, moveInList, type AdminExperience } from '../../lib/admin-client';
import { EmptyState, Field, FieldRow, PanelHeader, Toggle } from './fields';

interface Props {
  experiences: AdminExperience[];
  onReload: () => Promise<void>;
  notify: (message: string, kind?: 'ok' | 'error') => void;
}

const empty = {
  company: '',
  role: '',
  period: '',
  summary: '',
  highlights: '',
  stack: '',
  visible: true,
};

type Form = typeof empty;

export default function ExperiencesPanel({ experiences, onReload, notify }: Props) {
  const [form, setForm] = useState<Form>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const edit = (experience: AdminExperience) => {
    setEditingId(experience.id);
    setForm({
      company: experience.company,
      role: experience.role,
      period: experience.period,
      summary: experience.summary,
      // One highlight per line: they are full sentences, so commas belong
      // inside a highlight rather than between two of them.
      highlights: experience.highlights.join('\n'),
      stack: experience.stack.join(', '),
      visible: experience.visible,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api(
        editingId ? `/api/admin/experiences/${editingId}/` : '/api/admin/experiences/',
        json(editingId ? 'PATCH' : 'POST', form),
      );
      notify(editingId ? '经历已更新' : '经历已创建');
      reset();
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (experience: AdminExperience) => {
    if (!window.confirm(`删除「${experience.company}」这条经历？`)) return;
    try {
      await api(`/api/admin/experiences/${experience.id}/`, { method: 'DELETE' });
      if (editingId === experience.id) reset();
      notify('经历已删除');
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  const toggleVisible = async (experience: AdminExperience) => {
    try {
      await api(`/api/admin/experiences/${experience.id}/`, json('PATCH', { visible: !experience.visible }));
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = moveInList(experiences, index, direction);
    if (next === experiences) return;
    setReordering(true);
    try {
      await api('/api/admin/experiences/reorder/', json('PUT', { ids: next.map((item) => item.id) }));
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
        <PanelHeader title="经历" count={experiences.length} />
        <p className="admin-note">首页「学习与实践」和关于页时间线读的是这份列表。</p>
        {experiences.length === 0 && <EmptyState>还没有经历条目。</EmptyState>}
        <div className="admin-rows">
          {experiences.map((experience, index) => (
            <article
              key={experience.id}
              className={`admin-row ${editingId === experience.id ? 'is-editing' : ''} ${experience.visible ? '' : 'is-muted'}`}
            >
              <div className="admin-row__main">
                <div className="admin-row__title">
                  <span className={`admin-dot ${experience.visible ? 'admin-dot--active' : 'admin-dot--archived'}`} aria-hidden="true" />
                  <strong>{experience.company}</strong>
                </div>
                <p className="admin-row__meta">
                  {experience.role} · {experience.period || '未填时间'} · {experience.visible ? '显示中' : '已隐藏'}
                </p>
              </div>
              <div className="admin-row__actions">
                <span className="admin-move">
                  <button type="button" aria-label="上移" disabled={index === 0 || reordering} onClick={() => move(index, -1)}>↑</button>
                  <button type="button" aria-label="下移" disabled={index === experiences.length - 1 || reordering} onClick={() => move(index, 1)}>↓</button>
                </span>
                <button type="button" onClick={() => edit(experience)}>编辑</button>
                <button type="button" onClick={() => toggleVisible(experience)}>
                  {experience.visible ? '隐藏' : '显示'}
                </button>
                <button type="button" className="is-danger" onClick={() => remove(experience)}>删除</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <form className="admin-card" onSubmit={submit}>
        <PanelHeader title={editingId ? '编辑经历' : '新增经历'}>
          {editingId && <button type="button" className="admin-secondary" onClick={reset}>取消编辑</button>}
        </PanelHeader>

        <FieldRow>
          <Field label="机构 / 项目">
            <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="个人项目" />
          </Field>
          <Field label="角色">
            <input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="AI 应用与 RAG" />
          </Field>
        </FieldRow>
        <Field label="时间" hint="自由文本，如「现在」「2024–2025」">
          <input value={form.period} onChange={(e) => set('period', e.target.value)} placeholder="现在" />
        </Field>
        <Field label="概述">
          <textarea
            rows={3}
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="做了什么、解决了什么问题"
          />
        </Field>
        <Field label="要点" hint="一行一条">
          <textarea
            rows={4}
            value={form.highlights}
            onChange={(e) => set('highlights', e.target.value)}
            placeholder={'比较不同的切分与检索方案\n给实验补上可以重复的评估过程'}
          />
        </Field>
        <Field label="技术栈" hint="逗号分隔">
          <input value={form.stack} onChange={(e) => set('stack', e.target.value)} placeholder="Python, Postgres, FastAPI" />
        </Field>
        <Toggle
          label="在前台显示"
          checked={form.visible}
          onChange={(next) => set('visible', next)}
        />

        <div className="admin-form-foot">
          <button className="admin-primary" disabled={saving}>
            {saving ? '保存中…' : editingId ? '保存修改' : '新增经历'}
          </button>
        </div>
      </form>
    </div>
  );
}
