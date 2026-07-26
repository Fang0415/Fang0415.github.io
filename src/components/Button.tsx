import type { CSSProperties, ReactNode } from 'react';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Only meaningful without `href`; renders a real <button>. */
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  style,
  children,
  iconLeft,
  iconRight,
  onClick,
  type = 'button',
  disabled,
}: Props) {
  const cls = `folio-btn folio-btn--${variant} folio-btn--${size} ${className}`.trim();
  const content = (
    <>
      {iconLeft && <span className="folio-btn__icon" aria-hidden="true">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="folio-btn__icon" aria-hidden="true">{iconRight}</span>}
    </>
  );

  if (href) {
    return <a className={cls} href={href} style={style}>{content}</a>;
  }

  return (
    <button className={cls} style={style} type={type} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
