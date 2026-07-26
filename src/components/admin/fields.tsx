'use client';

import { useMemo, useState, type ReactNode } from 'react';
import MarkdownIt from 'markdown-it';
import { formatBytes, type AdminAsset } from '../../lib/admin-client';

/**
 * Every input in the console is wrapped in a labelled field. The old dashboard
 * relied on placeholders alone, which vanish the moment you start typing — with
 * eleven near-identical text inputs on the profile form that made it impossible
 * to tell which box you were in.
 */
export function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`admin-field ${wide ? 'admin-field--wide' : ''}`}>
      <span className="admin-field__label">
        {label}
        {hint && <span className="admin-field__hint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="admin-field-row">{children}</div>;
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="admin-toggle__track" aria-hidden="true"><span className="admin-toggle__knob" /></span>
      <span className="admin-toggle__text">
        {label}
        {hint && <span className="admin-field__hint">{hint}</span>}
      </span>
    </label>
  );
}

/**
 * Cover / avatar chooser. A bare `<select>` of filenames was unusable once the
 * bucket held more than a handful of near-identically named screenshots, so the
 * current choice is always rendered as a thumbnail next to it.
 */
export function AssetPicker({
  label,
  assets,
  value,
  onChange,
  hint,
}: {
  label: string;
  assets: AdminAsset[];
  value: string;
  onChange: (next: string) => void;
  hint?: string;
}) {
  const selected = assets.find((asset) => asset.id === value);

  return (
    <Field label={label} hint={hint}>
      <div className="admin-assetpick">
        <span className="admin-assetpick__thumb" aria-hidden="true">
          {selected && selected.mimeType.startsWith('image/')
            ? <img src={selected.publicUrl} alt="" />
            : <span className="admin-assetpick__empty">{selected ? '文件' : '无'}</span>}
        </span>
        <span className="admin-assetpick__body">
          <select value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="">不设置</option>
            {assets.map((asset) => (
              <option value={asset.id} key={asset.id}>
                {asset.filename}（{formatBytes(asset.size)}）
              </option>
            ))}
          </select>
          {selected && (
            <span className="admin-assetpick__meta">
              {selected.width && selected.height ? `${selected.width}×${selected.height} · ` : ''}
              <a href={selected.publicUrl} target="_blank" rel="noreferrer">查看原图</a>
            </span>
          )}
        </span>
      </div>
    </Field>
  );
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

/**
 * Markdown textarea with a preview tab. Rendered with the same markdown-it
 * options the server uses in lib/posts.ts, so what the preview shows is what
 * the published article gets.
 */
export function MarkdownField({
  label,
  value,
  onChange,
  rows = 16,
  hint,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  hint?: string;
}) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const html = useMemo(() => (mode === 'preview' ? md.render(value || '') : ''), [mode, value]);
  const chars = value.replace(/\s+/g, '').length;

  return (
    <div className="admin-field admin-field--wide">
      <span className="admin-field__label">
        {label}
        <span className="admin-field__hint">
          {hint ? `${hint} · ` : ''}{chars} 字 · 约 {Math.max(1, Math.round(chars / 400))} 分钟
        </span>
      </span>
      <div className="admin-md">
        <div className="admin-md__tabs">
          <button type="button" className={mode === 'write' ? 'is-active' : ''} onClick={() => setMode('write')}>
            编辑
          </button>
          <button type="button" className={mode === 'preview' ? 'is-active' : ''} onClick={() => setMode('preview')}>
            预览
          </button>
        </div>
        {mode === 'write' ? (
          <textarea
            rows={rows}
            value={value}
            spellCheck={false}
            onChange={(event) => onChange(event.target.value)}
            placeholder="支持标准 Markdown：## 标题、列表、`代码`、```代码块```、> 引用"
          />
        ) : (
          <div className="admin-md__preview prose">
            {value.trim()
              ? <div dangerouslySetInnerHTML={{ __html: html }} />
              : <p className="admin-md__blank">还没有内容。</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export function PanelHeader({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children?: ReactNode;
}) {
  return (
    <div className="admin-panel-head">
      <h2>
        {title}
        {count !== undefined && <span className="admin-panel-head__count">{count}</span>}
      </h2>
      {children && <div className="admin-panel-head__actions">{children}</div>}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="admin-empty">{children}</p>;
}
