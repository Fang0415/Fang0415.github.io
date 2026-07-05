interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  src?: string;
  square?: boolean;
}

const SIZE_MAP = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 72,
};

export default function Avatar({ name, size = 'md', src, square = false }: Props) {
  const px = typeof size === 'number' ? size : SIZE_MAP[size];
  const initial = name.trim().slice(0, 1).toUpperCase();
  return (
    <span className={`folio-avatar ${square ? 'folio-avatar--square' : ''}`} style={{ '--_s': `${px}px` } as CSSProperties}>
      {src ? <img src={src} alt={name} /> : initial}
    </span>
  );
}
import type { CSSProperties } from 'react';
