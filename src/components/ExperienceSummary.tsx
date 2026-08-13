import { EXPERIENCES, type Experience } from '../lib/site';
import Card from './Card';
import Tag from './Tag';
import Link from 'next/link';
import FolioIcon from './FolioIcon';

interface Props {
  items?: Experience[];
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
  moreHref?: string;
  moreLabel?: string;
}

export default function ExperienceSummary({
  items = EXPERIENCES,
  limit,
  showHeader = true,
  compact = false,
  moreHref,
  moreLabel = '查看更多',
}: Props) {
  const shown = typeof limit === 'number' ? items.slice(0, limit) : items;

  return (
    <div className={`experience-summary ${compact ? 'experience-summary--compact' : ''}`}>
      {showHeader && (
        <div className="sec-head">
          <div>
            <p className="sec-eyebrow">经历</p>
            <h2 className="sec-title">走过的路</h2>
          </div>
          {moreHref && (
            <Link className="sec-link" href={moreHref}>
              {moreLabel} <FolioIcon name="arrow-right" className="icon" />
            </Link>
          )}
        </div>
      )}

      <div className="experience-list">
        {shown.map((item) => (
          <Card key={item.id} className="experience-card">
            <div className="experience-card__rail" aria-hidden="true" />
            <div className="experience-card__body">
              <div className="experience-card__meta">
                <span>{item.period}</span>
                <span>{item.company}</span>
              </div>
              <h3>{item.role}</h3>
              <p>{item.summary}</p>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="experience-card__stack">
                {item.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
