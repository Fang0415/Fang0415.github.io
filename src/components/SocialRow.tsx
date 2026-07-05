import IconButton from './IconButton';
import FolioIcon from './FolioIcon';
import { PROFILE } from '../lib/site';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SocialRow({ size = 'md', className = '' }: Props) {
  return (
    <div className={`social-row ${className}`.trim()}>
      <IconButton label="GitHub" href={PROFILE.github} size={size}><FolioIcon name="github" /></IconButton>
      <IconButton label="X" href={PROFILE.x} size={size}><FolioIcon name="x" /></IconButton>
      <IconButton label="RSS" href="/rss.xml" size={size}><FolioIcon name="rss" /></IconButton>
      <IconButton label="邮件" href={`mailto:${PROFILE.email}`} size={size}><FolioIcon name="mail" /></IconButton>
    </div>
  );
}
