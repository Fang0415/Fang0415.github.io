'use client';

import { useEffect, useState } from 'react';
import { api, json, type AdminAsset, type AdminProfile } from '../../lib/admin-client';
import { AssetPicker, Field, FieldRow, PanelHeader } from './fields';

interface Props {
  profile: AdminProfile | null;
  assets: AdminAsset[];
  onReload: () => Promise<void>;
  notify: (message: string, kind?: 'ok' | 'error') => void;
}

const empty = {
  name: '',
  wordmark: '',
  mark: '',
  role: '',
  location: '',
  hero: '',
  lead: '',
  email: '',
  github: '',
  wechat: '',
  aboutIntro: '',
  focus: '',
  tools: '',
  now: '',
  background: '',
  avatarAssetId: '',
};

type Form = typeof empty;

function toForm(profile: AdminProfile): Form {
  return {
    name: profile.name,
    wordmark: profile.wordmark,
    mark: profile.mark,
    role: profile.role,
    location: profile.location,
    hero: profile.hero,
    lead: profile.lead,
    email: profile.email,
    github: profile.github,
    wechat: profile.wechat ?? '',
    // Arrays are edited as one entry per line — a textarea is the honest control
    // for "a short list of short strings".
    aboutIntro: profile.aboutIntro ?? '',
    focus: (profile.focus ?? []).join('\n'),
    tools: (profile.tools ?? []).join('\n'),
    now: (profile.now ?? []).join('\n'),
    background: (profile.background ?? []).join('\n'),
    avatarAssetId: profile.avatarAssetId ?? '',
  };
}

export default function ProfilePanel({ profile, assets, onReload, notify }: Props) {
  const [form, setForm] = useState<Form>(profile ? toForm(profile) : empty);
  const [saving, setSaving] = useState(false);

  // The profile arrives with the first dashboard load, i.e. after this panel has
  // already mounted with an empty form.
  useEffect(() => {
    if (profile) setForm(toForm(profile));
  }, [profile]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api('/api/admin/profile/', json('PUT', form));
      notify('站点资料已保存');
      await onReload();
    } catch (error) {
      notify((error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-workspace admin-workspace--single">
      <form className="admin-card" onSubmit={submit}>
        <PanelHeader title="站点资料" />
        <p className="admin-note">
          这些字段直接决定导航、首页 Hero、页脚和关于页显示的内容，保存后刷新前台即可看到。
        </p>

        <div className="admin-subhead">身份与导航</div>
        <FieldRow>
          <Field label="姓名" hint="署名与头像字母">
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Fang" />
          </Field>
          <Field label="站点字标" hint="导航与浏览器标题">
            <input value={form.wordmark} onChange={(e) => set('wordmark', e.target.value)} placeholder="Fang" />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="标记字母" hint="导航左上方块，1 个字符">
            <input value={form.mark} maxLength={2} onChange={(e) => set('mark', e.target.value)} placeholder="F" />
          </Field>
          <Field label="所在地">
            <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="留空则不显示" />
          </Field>
        </FieldRow>
        <Field label="身份描述" hint="Hero 眉标，如「学生 · 全栈开发者」">
          <input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="学生 · 全栈开发者" />
        </Field>
        <Field label="Hero 标题" hint="首页会直接显示这句话，适合使用简短的英文题词">
          <input value={form.hero} onChange={(e) => set('hero', e.target.value)} placeholder="There's still so much I don't know, so I keep digging." />
        </Field>
        <Field label="首页导语">
          <textarea
            rows={3}
            value={form.lead}
            onChange={(e) => set('lead', e.target.value)}
            placeholder="两三句话，说清这个站点在写什么、为谁写"
          />
        </Field>
        <FieldRow>
          <Field label="邮箱">
            <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="留空则不显示" />
          </Field>
          <Field label="GitHub 主页">
            <input value={form.github} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/…" />
          </Field>
        </FieldRow>
        <Field label="微信 / 其他联系方式" hint="留空则不显示该图标">
          <input value={form.wechat} onChange={(e) => set('wechat', e.target.value)} placeholder="微信号或二维码链接" />
        </Field>
        <div className="admin-subhead">关于页</div>
        <Field label="自我介绍" hint="Markdown，空行分段；显示在关于页第一块">
          <textarea
            rows={6}
            value={form.aboutIntro}
            onChange={(e) => set('aboutIntro', e.target.value)}
            placeholder={'我是……\n\n我喜欢**小而锋利的工具**。'}
          />
        </Field>
        <FieldRow>
          <Field label="关注方向" hint="每行一条，格式「标题 | 说明」">
            <textarea
              rows={4}
              value={form.focus}
              onChange={(e) => set('focus', e.target.value)}
              placeholder={'RAG 与检索 | 切分、混合检索、评估'}
            />
          </Field>
          <Field label="一些背景" hint="每行一条，格式「左栏 | 右栏」">
            <textarea
              rows={4}
              value={form.background}
              onChange={(e) => set('background', e.target.value)}
              placeholder={'身份 | 学生 / 全栈开发者'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="最近在做" hint="每行一条，显示为列表">
            <textarea
              rows={4}
              value={form.now}
              onChange={(e) => set('now', e.target.value)}
              placeholder={'继续学习 RAG，重点看检索和效果评估。'}
            />
          </Field>
          <Field label="常用工具" hint="每行一个，或用逗号分隔">
            <textarea
              rows={4}
              value={form.tools}
              onChange={(e) => set('tools', e.target.value)}
              placeholder={'Python\nPostgres\nNeovim'}
            />
          </Field>
        </FieldRow>

        <AssetPicker
          label="头像"
          assets={assets}
          value={form.avatarAssetId}
          onChange={(next) => set('avatarAssetId', next)}
          hint="留空则用姓名首字母"
        />

        <div className="admin-form-foot">
          <button className="admin-primary" disabled={saving}>{saving ? '保存中…' : '保存资料'}</button>
          <a className="admin-form-foot__note" href="/" target="_blank" rel="noreferrer">在新标签查看前台 →</a>
        </div>
      </form>
    </div>
  );
}
