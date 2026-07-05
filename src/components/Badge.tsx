import type { CSSProperties, ReactNode } from 'react';

interface Props {
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';
  dot?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function Badge({ variant = 'neutral', dot = false, className = '', style, children }: Props) {
  const cls = `folio-badge folio-badge--${variant} ${className}`.trim();
  return (
    <span className={cls} style={style}>
      {dot && <span className="folio-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
