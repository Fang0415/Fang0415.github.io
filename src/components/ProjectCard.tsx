import type { CSSProperties } from 'react';
import Card from './Card';
import Tag from './Tag';
import Badge from './Badge';
import FolioIcon from './FolioIcon';
import { textFor, type LocalizedList, type LocalizedText, type ProjectStatus } from '../lib/site';
import { SiteText } from './SitePreferences';

interface Props {
  title: LocalizedText;
  description?: LocalizedText;
  tags?: string[];
  status?: ProjectStatus;
  highlights?: LocalizedList;
  coverUrl?: string;
  coverAlt?: string;
  href?: string;
  github?: string;
  demo?: string;
  className?: string;
  style?: CSSProperties;
}

const STATUS_VARIANT: Record<ProjectStatus, 'success' | 'warning' | 'brand' | 'neutral'> = {
  planning: 'neutral',
  in_progress: 'warning',
  completed: 'brand',
  published: 'success',
};

const STATUS_LABEL: Record<ProjectStatus, { en: string; zh: string }> = {
  planning: { en: 'Planning', zh: '筹划中' },
  in_progress: { en: 'In progress', zh: '进行中' },
  completed: { en: 'Completed', zh: '已完成' },
  published: { en: 'Live', zh: '已上架' },
};

export default function ProjectCard({
  title,
  description,
  tags = [],
  status,
  highlights = { zh: [], en: [] },
  coverUrl,
  coverAlt,
  href,
  github,
  demo,
  className = '',
  style,
}: Props) {
  const titleFallback = textFor(title, 'en');

  return (
    <Card interactive={!!href} className={className} style={style}>
      <div className="folio-project">
        {coverUrl && (
          <span className="folio-project__cover">
            <img src={coverUrl} alt={coverAlt || `${titleFallback} cover`} loading="lazy" className="img-fade" />
          </span>
        )}
        <div className="folio-project__head">
          <h3 className="folio-project__title">
            {href
              ? <a className="folio-project__titlelink" href={href}><SiteText en={title.en} zh={title.zh} /></a>
              : <SiteText en={title.en} zh={title.zh} />}
          </h3>
          {status && (
            <Badge variant={STATUS_VARIANT[status] || 'neutral'} dot>
              <SiteText en={STATUS_LABEL[status].en} zh={STATUS_LABEL[status].zh} />
            </Badge>
          )}
        </div>
        {description && <p className="folio-project__desc"><SiteText en={description.en} zh={description.zh} /></p>}
        {(highlights.zh.length > 0 || highlights.en.length > 0) && (
          <SiteText
            en={<ul className="folio-project__highlights">{highlights.en.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul>}
            zh={<ul className="folio-project__highlights">{highlights.zh.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul>}
          />
        )}
        {tags.length > 0 && (
          <div className="folio-project__tags">
            {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        )}
        {(github || demo) && (
          <div className="folio-project__foot">
            {github && (
              <a href={github}>
                <FolioIcon name="github" className="icon" /> <SiteText en="Code" zh="代码" />
              </a>
            )}
            {demo && (
              <a href={demo}>
                <FolioIcon name="arrow-up-right" className="icon" /> <SiteText en="Demo" zh="演示" />
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
