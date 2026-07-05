type IconName =
  | 'arrow-right' | 'arrow-left' | 'arrow-up-right' | 'download'
  | 'search' | 'rss' | 'mail' | 'menu' | 'x-close'
  | 'github' | 'wechat';

interface Props {
  name: IconName;
  className?: string;
}

export default function FolioIcon({ name, className = 'icon' }: Props) {
  const isBrand = name === 'github';

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
      {name === 'wechat' && (
        <>
          <path d="M10.5 6.5c-3.6 0-6.5 2.3-6.5 5.2 0 1.6.9 3 2.3 4l-.7 2 2.4-1.2c.8.3 1.6.4 2.5.4 3.6 0 6.5-2.3 6.5-5.2s-2.9-5.2-6.5-5.2Z" />
          <path d="M14.6 11.2c3 0 5.4 1.9 5.4 4.3 0 1.3-.7 2.5-1.9 3.3l.6 1.7-2-1c-.7.2-1.4.3-2.1.3-2.2 0-4.1-1-4.9-2.5" />
          <circle cx="8.3" cy="11.1" r="0.55" fill="currentColor" stroke="none" />
          <circle cx="12.7" cy="11.1" r="0.55" fill="currentColor" stroke="none" />
          <circle cx="13.4" cy="15.2" r="0.5" fill="currentColor" stroke="none" />
          <circle cx="16.8" cy="15.2" r="0.5" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}
