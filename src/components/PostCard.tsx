import type { CSSProperties } from 'react';
import Card from './Card';
import Tag from './Tag';

interface Props {
  title: string;
  excerpt?: string;
  date?: string;
  readingTime?: string;
  category?: string;
  tags?: string[];
  coverUrl?: string;
  href?: string;
  layout?: 'card' | 'row';
  className?: string;
  style?: CSSProperties;
}

export default function PostCard({
  title,
  excerpt,
  date,
  readingTime,
  category,
  tags = [],
  coverUrl,
  href,
  layout = 'card',
  className = '',
  style,
}: Props) {
  if (layout === 'row') {
    return (
      <Card interactive href={href} className={className} style={{ border: 'none', borderRadius: 0, padding: '20px 0', ...style }}>
        <div className="folio-post folio-post--row">
          <div className="folio-post__date">{date}</div>
          <div className="folio-post__body">
            <h3 className="folio-post__title">{title}</h3>
            {excerpt && <p className="folio-post__excerpt">{excerpt}</p>}
            {(tags.length > 0 || readingTime) && (
              <div className="folio-post__tags">
                {tags.map((t) => <Tag key={t} mono={false}>{t}</Tag>)}
                {readingTime && (
                  <span style={{ alignSelf: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                    {readingTime}
                  </span>
                )}
              </div>
            )}
          </div>
          {coverUrl && (
            <span className="folio-post__thumb">
              <img src={coverUrl} alt="" loading="lazy" />
            </span>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card interactive href={href} className={className} style={style}>
      <div className="folio-post">
        {coverUrl && (
          <span className="folio-post__cover">
            <img src={coverUrl} alt="" loading="lazy" />
          </span>
        )}
        <div className="folio-post__meta">
          {category && <span style={{ color: 'var(--link)', fontWeight: 600 }}>{category}</span>}
          {category && <span className="dot" />}
          {date && <span>{date}</span>}
          {readingTime && <><span className="dot" /><span>{readingTime}</span></>}
        </div>
        <h3 className="folio-post__title">{title}</h3>
        {excerpt && <p className="folio-post__excerpt">{excerpt}</p>}
      </div>
    </Card>
  );
}
