import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  href?: string;
  interactive?: boolean;
  soft?: boolean;
  flat?: boolean;
  dark?: boolean;
  padLg?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Card({
  children,
  href,
  interactive,
  soft,
  flat,
  dark,
  padLg,
  className = '',
  style,
}: Props) {
  const cls = [
    'folio-card',
    soft && 'folio-card--soft',
    flat && 'folio-card--flat',
    dark && 'folio-card--dark',
    padLg && 'folio-card--pad-lg',
    (interactive || href) && 'folio-card--interactive',
    className,
  ].filter(Boolean).join(' ');

  if (href) {
    return <a className={cls} href={href} style={style}>{children}</a>;
  }

  return <div className={cls} style={style}>{children}</div>;
}
