import type { CSSProperties } from 'react';
import Card from './Card';
import Tag from './Tag';
import Badge from './Badge';
import type { ProjectStatus } from '../lib/site';

interface Props {
  title: string;
  description?: string;
  stack?: string[];
  status?: ProjectStatus;
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
  active: '活跃维护',
  building: '开发中',
  shipped: '已发布',
  archived: '已归档',
};

export default function ProjectCard({
  title,
  description,
  stack = [],
  status,
  href,
  repo,
  demo,
  className = '',
  style,
}: Props) {
  return (
    <Card interactive={!!href} className={className} style={style}>
      <div className="folio-project">
        <div className="folio-project__head">
          <h3 className="folio-project__title">
            {href ? <a className="folio-project__titlelink" href={href}>{title}</a> : title}
          </h3>
          {status && (
            <Badge variant={STATUS_VARIANT[status] || 'neutral'} dot>{STATUS_LABEL[status]}</Badge>
          )}
        </div>
        {description && <p className="folio-project__desc">{description}</p>}
        {stack.length > 0 && (
          <div className="folio-project__tags">
            {stack.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>
        )}
        {(repo || demo) && (
          <div className="folio-project__foot">
            {repo && <a href={repo}>⌥ 代码</a>}
            {demo && <a href={demo}>↗ 演示</a>}
          </div>
        )}
      </div>
    </Card>
  );
}
