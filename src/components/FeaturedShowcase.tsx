import Link from 'next/link';
import { PROJECTS, type Project } from '../lib/site';
import FolioIcon from './FolioIcon';
import ProjectShowcase from './ProjectShowcase';

interface Props {
  projects?: Project[];
}

/**
 * The homepage uses the same coverflow viewer as the project index, but keeps
 * the editorial heading and limits the selection to four featured projects.
 */
export default function FeaturedShowcase({ projects }: Props) {
  const items = (projects?.length ? projects : PROJECTS).slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="kit-section kit-section--tight home-projects" aria-labelledby="showcase-title">
      <div className="kit-container">
        <div className="sec-head">
          <div>
            <p className="sec-eyebrow">项目</p>
            <h2 className="sec-title" id="showcase-title">最近做的几个项目</h2>
          </div>
          <Link className="sec-link" href="/projects/">
            全部项目 <FolioIcon name="arrow-right" className="icon" />
          </Link>
        </div>

        <ProjectShowcase projects={items} />
      </div>
    </section>
  );
}
