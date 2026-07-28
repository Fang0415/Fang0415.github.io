import type { CSSProperties } from 'react';
import Card from './Card';
import Tag from './Tag';
import Badge from './Badge';
import FolioIcon from './FolioIcon';
import type { ProjectStatus } from '../lib/site';

interface Props {
  title: string;
  description?: string;
  stack?: string[];
  status?: ProjectStatus;
  role?: string;
  period?: string;
  highlights?: string[];
  coverUrl?: string;
  coverAlt?: string;
  href?: string;
  repo?: string;
  demo?: string;
  className?: string;
  style?: CSSProperties;
}

const STATUS_VARIANT: Record<ProjectStatus, 'success' | 'warning' | 'brand' | 'neutral'> = {
  active: 'success',
  building: 'warning',
  shipped: 'brand',
  archived: 'neutral',
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: '持续更新',
  building: '正在做',
  shipped: '已完成',
  archived: '暂停更新',
};

export default function ProjectCard({
  title,
  description,
  stack = [],
  status,
  role,
  period,
  highlights = [],
  coverUrl,
  coverAlt,
  href,
  repo,
  demo,
  className = '',
  style,
}: Props) {
  return (
    <Card interactive={!!href} className={className} style={style}>
      <div className="folio-project">
        {coverUrl && (
          <span className="folio-project__cover">
            <img src={coverUrl} alt={coverAlt || `${title} 封面`} loading="lazy" className="img-fade" />
          </span>
        )}
        <div className="folio-project__head">
          <h3 className="folio-project__title">
            {href ? <a className="folio-project__titlelink" href={href}>{title}</a> : title}
          </h3>
          {status && (
            <Badge variant={STATUS_VARIANT[status] || 'neutral'} dot>{STATUS_LABEL[status]}</Badge>
          )}
        </div>
        {(role || period) && (
          <div className="folio-project__meta">
            {role && <span>{role}</span>}
            {role && period && <span className="dot"></span>}
            {period && <span>{period}</span>}
          </div>
        )}
        {description && <p className="folio-project__desc">{description}</p>}
        {highlights.length > 0 && (
          <ul className="folio-project__highlights">
            {highlights.slice(0, 2).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
        {stack.length > 0 && (
          <div className="folio-project__tags">
            {stack.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>
        )}
        {(repo || demo) && (
          <div className="folio-project__foot">
            {repo && (
              <a href={repo}>
                <FolioIcon name="github" className="icon" /> 代码
              </a>
            )}
            {demo && (
              <a href={demo}>
                <FolioIcon name="arrow-up-right" className="icon" /> 演示
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
