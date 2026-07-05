'use client';

import { useEffect, useMemo, useState } from 'react';

type Tab = 'posts' | 'projects' | 'assets';

interface Asset {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  publicUrl: string;
  createdAt: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  coverAssetId?: string | null;
  status: string;
  updatedAt: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string | null;
  category: string;
  stack: string[];
  repoUrl?: string | null;
  demoUrl?: string | null;
  coverAssetId?: string | null;
  sortOrder: number;
  status: string;
  updatedAt: string;
}

const emptyPost = {
  title: '',
  slug: '',
  description: '',
  content: '',
  tags: '',
  status: 'DRAFT',
  coverAssetId: '',
};

const emptyProject = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: '',
  stack: '',
  repoUrl: '',
  demoUrl: '',
  status: 'BUILDING',
  coverAssetId: '',
  sortOrder: '0',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [postForm, setPostForm] = useState(emptyPost);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const assetOptions = useMemo(() => assets.map((asset) => (
    <option value={asset.id} key={asset.id}>{asset.filename}</option>
  )), [assets]);

  const load = async () => {
    const [postRes, projectRes, assetRes] = await Promise.all([
      fetch('/api/admin/posts/'),
      fetch('/api/admin/projects/'),
      fetch('/api/admin/assets/'),
    ]);
    if (postRes.ok) setPosts((await postRes.json()).posts);
    if (projectRes.ok) setProjects((await projectRes.json()).projects);
    if (assetRes.ok) setAssets((await assetRes.json()).assets);
  };

  useEffect(() => {
    load().catch((error) => setMessage(`加载失败：${error.message}`));
  }, []);

  const logout = async () => {
    await fetch('/api/admin/logout/', { method: 'POST' });
    window.location.href = '/admin/login/';
  };

  const submitPost = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch(editingPostId ? `/api/admin/posts/${editingPostId}/` : '/api/admin/posts/', {
      method: editingPostId ? 'PATCH' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(postForm),
    });
    setLoading(false);
    if (!res.ok) {
      setMessage((await res.json().catch(() => ({}))).error || '保存文章失败');
      return;
    }
    setPostForm(emptyPost);
    setEditingPostId(null);
    setMessage(editingPostId ? '文章已更新' : '文章已创建');
    await load();
  };

  const submitProject = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch(editingProjectId ? `/api/admin/projects/${editingProjectId}/` : '/api/admin/projects/', {
      method: editingProjectId ? 'PATCH' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(projectForm),
    });
    setLoading(false);
    if (!res.ok) {
      setMessage((await res.json().catch(() => ({}))).error || '保存项目失败');
      return;
    }
    setProjectForm(emptyProject);
    setEditingProjectId(null);
    setMessage(editingProjectId ? '项目已更新' : '项目已创建');
    await load();
  };

  const editPost = (post: Post) => {
    setTab('posts');
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
      tags: post.tags.join(', '),
      status: post.status,
      coverAssetId: post.coverAssetId || '',
    });
    setMessage('');
  };

  const editProject = (project: Project) => {
    setTab('projects');
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      content: project.content || '',
      category: project.category,
      stack: project.stack.join(', '),
      repoUrl: project.repoUrl || '',
      demoUrl: project.demoUrl || '',
      status: project.status,
      coverAssetId: project.coverAssetId || '',
      sortOrder: String(project.sortOrder || 0),
    });
    setMessage('');
  };

  const resetPostForm = () => {
    setPostForm(emptyPost);
    setEditingPostId(null);
  };

  const resetProjectForm = () => {
    setProjectForm(emptyProject);
    setEditingProjectId(null);
  };

  const uploadAsset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/assets/', { method: 'POST', body: form });
    setLoading(false);
    if (!res.ok) {
      setMessage((await res.json().catch(() => ({}))).error || '上传失败');
      return;
    }
    setFile(null);
    setMessage('资源已上传');
    await load();
  };

  const remove = async (kind: 'posts' | 'projects', id: string) => {
    if (!window.confirm('确认删除？')) return;
    const res = await fetch(`/api/admin/${kind}/${id}/`, { method: 'DELETE' });
    if (!res.ok) {
      setMessage('删除失败');
      return;
    }
    setMessage('已删除');
    await load();
  };

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="sec-eyebrow">Admin</p>
          <h1>内容管理</h1>
        </div>
        <button className="admin-secondary" onClick={logout}>退出登录</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'posts' ? 'is-active' : ''} onClick={() => setTab('posts')}>文章</button>
        <button className={tab === 'projects' ? 'is-active' : ''} onClick={() => setTab('projects')}>项目</button>
        <button className={tab === 'assets' ? 'is-active' : ''} onClick={() => setTab('assets')}>资源</button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {tab === 'posts' && (
        <div className="admin-grid">
          <form className="admin-card" onSubmit={submitPost}>
            <div className="admin-form-head">
              <h2>{editingPostId ? '编辑文章' : '新建文章'}</h2>
              {editingPostId && <button type="button" className="admin-secondary" onClick={resetPostForm}>取消编辑</button>}
            </div>
            <input placeholder="标题" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} />
            <input placeholder="Slug（留空自动生成）" value={postForm.slug} onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })} />
            <input placeholder="摘要" value={postForm.description} onChange={(e) => setPostForm({ ...postForm, description: e.target.value })} />
            <input placeholder="标签，逗号分隔" value={postForm.tags} onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })} />
            <select value={postForm.coverAssetId} onChange={(e) => setPostForm({ ...postForm, coverAssetId: e.target.value })}>
              <option value="">不设置封面</option>
              {assetOptions}
            </select>
            <select value={postForm.status} onChange={(e) => setPostForm({ ...postForm, status: e.target.value })}>
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">发布</option>
              <option value="ARCHIVED">归档</option>
            </select>
            <textarea placeholder="Markdown 内容" rows={12} value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} />
            <button className="admin-primary" disabled={loading}>{editingPostId ? '保存文章' : '创建文章'}</button>
          </form>
          <List title="文章列表" items={posts.map((post) => ({
            id: post.id,
            title: post.title,
            meta: `${post.status} · /blog/${post.slug}`,
            onEdit: () => editPost(post),
            onDelete: () => remove('posts', post.id),
          }))} />
        </div>
      )}

      {tab === 'projects' && (
        <div className="admin-grid">
          <form className="admin-card" onSubmit={submitProject}>
            <div className="admin-form-head">
              <h2>{editingProjectId ? '编辑项目' : '新建项目'}</h2>
              {editingProjectId && <button type="button" className="admin-secondary" onClick={resetProjectForm}>取消编辑</button>}
            </div>
            <input placeholder="项目名称" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
            <input placeholder="Slug（留空自动生成）" value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} />
            <input placeholder="摘要" value={projectForm.summary} onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })} />
            <input placeholder="分类" value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} />
            <input placeholder="技术栈，逗号分隔" value={projectForm.stack} onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })} />
            <input placeholder="仓库 URL" value={projectForm.repoUrl} onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })} />
            <input placeholder="演示 URL" value={projectForm.demoUrl} onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })} />
            <select value={projectForm.coverAssetId} onChange={(e) => setProjectForm({ ...projectForm, coverAssetId: e.target.value })}>
              <option value="">不设置封面</option>
              {assetOptions}
            </select>
            <select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}>
              <option value="BUILDING">开发中</option>
              <option value="ACTIVE">活跃维护</option>
              <option value="SHIPPED">已发布</option>
              <option value="ARCHIVED">已归档</option>
            </select>
            <input placeholder="排序值，数字越小越靠前" value={projectForm.sortOrder} onChange={(e) => setProjectForm({ ...projectForm, sortOrder: e.target.value })} />
            <textarea placeholder="项目详情" rows={8} value={projectForm.content} onChange={(e) => setProjectForm({ ...projectForm, content: e.target.value })} />
            <button className="admin-primary" disabled={loading}>{editingProjectId ? '保存项目' : '创建项目'}</button>
          </form>
          <List title="项目列表" items={projects.map((project) => ({
            id: project.id,
            title: project.title,
            meta: `${project.status} · ${project.category}`,
            onEdit: () => editProject(project),
            onDelete: () => remove('projects', project.id),
          }))} />
        </div>
      )}

      {tab === 'assets' && (
        <div className="admin-grid">
          <form className="admin-card" onSubmit={uploadAsset}>
            <h2>上传资源</h2>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button className="admin-primary" disabled={loading || !file}>上传到 MinIO</button>
          </form>
          <div className="admin-card">
            <h2>资源列表</h2>
            <div className="admin-list">
              {assets.map((asset) => (
                <div className="admin-list-item" key={asset.id}>
                  <div>
                    <strong>{asset.filename}</strong>
                    <span>{asset.mimeType} · {Math.round(asset.size / 1024)} KB</span>
                  </div>
                  <a href={asset.publicUrl} target="_blank">打开</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function List({ title, items }: {
  title: string;
  items: Array<{ id: string; title: string; meta: string; onEdit: () => void; onDelete: () => void }>;
}) {
  return (
    <div className="admin-card">
      <h2>{title}</h2>
      <div className="admin-list">
        {items.map((item) => (
          <div className="admin-list-item" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
            </div>
            <div className="admin-list-actions">
              <button onClick={item.onEdit}>编辑</button>
              <button onClick={item.onDelete}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
