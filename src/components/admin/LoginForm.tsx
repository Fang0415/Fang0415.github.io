'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || '登录失败');
      return;
    }
    window.location.href = '/admin/';
  };

  return (
    <form className="admin-card admin-login" onSubmit={submit}>
      <h1>管理后台</h1>
      <p>输入管理员口令后管理博客、项目和资源。</p>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="管理员口令"
        autoFocus
      />
      {error && <div className="admin-error">{error}</div>}
      <button className="admin-primary" disabled={loading}>{loading ? '登录中...' : '登录'}</button>
    </form>
  );
}
