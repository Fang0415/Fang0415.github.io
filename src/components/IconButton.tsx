import type { CSSProperties, ReactNode } from 'react';

interface Props {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'plain' | 'outline';
  href?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function IconButton({
  label,
  size = 'md',
  variant = 'plain',
  href,
  className = '',
  style,
  children,
}: Props) {
  const cls = `folio-iconbtn folio-iconbtn--${size} folio-iconbtn--${variant} ${className}`.trim();
  if (href) {
    return <a className={cls} href={href} style={style} aria-label={label} title={label}>{children}</a>;
  }
  return <button type="button" className={cls} style={style} aria-label={label} title={label}>{children}</button>;
}
