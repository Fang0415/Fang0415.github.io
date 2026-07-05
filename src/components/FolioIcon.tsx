type IconName =
  | 'arrow-right' | 'arrow-left' | 'arrow-up-right' | 'download'
  | 'search' | 'rss' | 'mail' | 'menu' | 'x-close'
  | 'github' | 'x';

interface Props {
  name: IconName;
  className?: string;
}

export default function FolioIcon({ name, className = 'icon' }: Props) {
  const isBrand = name === 'github' || name === 'x';

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={isBrand ? 'none' : 'currentColor'}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'arrow-right' && <path d="M5 12h14M13 6l6 6-6 6" />}
      {name === 'arrow-left' && <path d="M19 12H5M11 6l-6 6 6 6" />}
      {name === 'arrow-up-right' && <path d="M7 17 17 7M8 7h9v9" />}
      {name === 'download' && <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />}
      {name === 'search' && <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>}
      {name === 'rss' && <><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" /></>}
      {name === 'mail' && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}
      {name === 'menu' && <path d="M4 7h16M4 12h16M4 17h16" />}
      {name === 'x-close' && <path d="M18 6 6 18M6 6l12 12" />}
      {name === 'github' && <path fill="currentColor" stroke="none" d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />}
      {name === 'x' && <path fill="currentColor" stroke="none" d="M18.9 2.5h3.05l-6.66 7.61 7.84 11.39h-6.14l-4.81-6.29-5.5 6.29H3.62l7.12-8.14L3.22 2.5h6.29l4.35 5.75 5.04-5.75Zm-1.07 16.99h1.69L8.58 4.4H6.77l11.06 15.09Z" />}
    </svg>
  );
}
