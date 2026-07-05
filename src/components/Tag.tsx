import type { CSSProperties, ReactNode } from 'react';

interface Props {
  variant?: 'default' | 'solid' | 'teal' | 'amber' | 'sky';
  mono?: boolean;
  dot?: boolean;
  href?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function Tag({
  variant = 'default',
  mono = true,
  dot = false,
  href,
  className = '',
  style,
  children,
}: Props) {
  const cls = `folio-tag folio-tag--${variant} ${mono ? '' : 'folio-tag--sans'} ${className}`.trim();
  const content = <>{dot && <span className="folio-tag__dot" aria-hidden="true" />}{children}</>;

  if (href) return <a className={cls} href={href} style={style}>{content}</a>;
  return <span className={cls} style={style}>{content}</span>;
}
