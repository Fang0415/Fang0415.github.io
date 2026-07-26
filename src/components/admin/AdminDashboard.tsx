'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  api,
  type AdminAsset,
  type AdminExperience,
  type AdminPost,
  type AdminProfile,
  type AdminProject,
  type SessionState,
} from '../../lib/admin-client';
import AssetsPanel from './AssetsPanel';
import ExperiencesPanel from './ExperiencesPanel';
import PostsPanel from './PostsPanel';
import ProfilePanel from './ProfilePanel';
import ProjectsPanel from './ProjectsPanel';

type Tab = 'profile' | 'posts' | 'projects' | 'experiences' | 'assets';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: '站点资料' },
  { id: 'posts', label: '文章' },
  { id: 'projects', label: '项目' },
  { id: 'experiences', label: '经历' },
  { id: 'assets', label: '资源' },
];

interface Notice {
  text: string;
  kind: 'ok' | 'error';
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('posts');
  const [session, setSession] = useState<SessionState | null>(null);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [assets, setAssets] = useState<AdminAsset[]>([]);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [booting, setBooting] = useState(true);

  const notify = useCallback((text: string, kind: 'ok' | 'error' = 'ok') => {
    setNotice({ text, kind });
    // Errors stay put — they usually need reading twice. Success messages clear
    // themselves so the banner does not linger over unrelated work.
    if (kind === 'ok') window.setTimeout(() => setNotice((current) => (current?.text === text ? null : current)), 3200);
  }, []);

  const reload = useCallback(async () => {
    // Health first: a stopped Postgres would otherwise surface as four
    // identical failures with no hint about the shared cause.
    const state = await api<SessionState>('/api/admin/session/');
    setSession(state);
    if (state.database !== 'up') return;

    const [postRes, projectRes, experienceRes, assetRes, profileRes] = await Promise.all([
      api<{ posts: AdminPost[] }>('/api/admin/posts/'),
      api<{ projects: AdminProject[] }>('/api/admin/projects/'),
      api<{ experiences: AdminExperience[] }>('/api/admin/experiences/'),
      api<{ assets: AdminAsset[] }>('/api/admin/assets/'),
      api<{ profile: AdminProfile }>('/api/admin/profile/'),
    ]);
    setPosts(postRes.posts);
    setProjects(projectRes.projects);
    setExperiences(experienceRes.experiences);
    setAssets(assetRes.assets);
    setProfile(profileRes.profile);
  }, []);

  useEffect(() => {
    reload()
      .catch((error: Error) => notify(error.message, 'error'))
      .finally(() => setBooting(false));
  }, [reload, notify]);

  const logout = async () => {
    await fetch('/api/admin/logout/', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/admin/login/';
  };

  const counts: Record<Tab, number | undefined> = {
    profile: undefined,
    posts: posts.length,
    projects: projects.length,
    experiences: experiences.length,
    assets: assets.length,
  };

  const dbDown = session?.database === 'down';

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="sec-eyebrow">Admin</p>
          <h1>内容管理</h1>
          <p className="admin-topbar__sub">
            {posts.filter((post) => post.status === 'PUBLISHED').length} 篇已发布 ·{' '}
            {posts.filter((post) => post.status === 'DRAFT').length} 篇草稿 ·{' '}
            {projects.length} 个项目
          </p>
        </div>
        <div className="admin-topbar__actions">
          <a className="admin-secondary" href="/" target="_blank" rel="noreferrer">查看前台</a>
          <button type="button" className="admin-secondary" onClick={logout}>退出登录</button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="管理分区">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'is-active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
            {counts[item.id] !== undefined && <span className="admin-tabs__count">{counts[item.id]}</span>}
          </button>
        ))}
      </nav>

      {dbDown && (
        <div className="admin-banner admin-banner--error">
          数据库连接失败。请确认 Postgres 已启动、DATABASE_URL 正确，然后
          <button type="button" onClick={() => void reload().catch((error: Error) => notify(error.message, 'error'))}>
            重新加载
          </button>
        </div>
      )}

      {notice && (
        <div className={notice.kind === 'error' ? 'admin-error' : 'admin-message'} role="status">
          {notice.text}
        </div>
      )}

      {booting ? (
        <div className="admin-card admin-loading">正在加载内容…</div>
      ) : dbDown ? null : (
        <>
          {tab === 'profile' && (
            <ProfilePanel profile={profile} assets={assets} onReload={reload} notify={notify} />
          )}
          {tab === 'posts' && (
            <PostsPanel posts={posts} assets={assets} onReload={reload} notify={notify} />
          )}
          {tab === 'projects' && (
            <ProjectsPanel projects={projects} assets={assets} onReload={reload} notify={notify} />
          )}
          {tab === 'experiences' && (
            <ExperiencesPanel experiences={experiences} onReload={reload} notify={notify} />
          )}
          {tab === 'assets' && (
            <AssetsPanel
              assets={assets}
              storageReady={session?.storage ?? false}
              onReload={reload}
              notify={notify}
            />
          )}
        </>
      )}
    </div>
  );
}
