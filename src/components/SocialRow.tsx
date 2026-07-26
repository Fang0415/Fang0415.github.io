import IconButton from './IconButton';
import FolioIcon from './FolioIcon';
import { PROFILE, type SiteProfileData } from '../lib/site';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  profile?: SiteProfileData;
}

export default function SocialRow({ size = 'md', className = '', profile = PROFILE }: Props) {
  return (
    <div className={`social-row ${className}`.trim()}>
      {profile.github && <IconButton label="GitHub" href={profile.github} size={size}><FolioIcon name="github" /></IconButton>}
      {profile.wechat && <IconButton label="微信" href={profile.wechat} size={size}><FolioIcon name="wechat" /></IconButton>}
      <IconButton label="RSS" href="/rss.xml" size={size}><FolioIcon name="rss" /></IconButton>
      {profile.email && <IconButton label="邮件" href={`mailto:${profile.email}`} size={size}><FolioIcon name="mail" /></IconButton>}
    </div>
  );
}
