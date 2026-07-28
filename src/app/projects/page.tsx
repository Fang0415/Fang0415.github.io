import type { Metadata } from 'next';
import ProjectGrid from '../../components/ProjectGrid';
import { getVisibleProjects } from '../../lib/managed-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '项目',
  description: 'Fang 做过和正在做的项目。',
};

export default async function ProjectsPage() {
  const projects = await getVisibleProjects();

  return (
    <>
      <section className="page-head">
        <div className="kit-container">
          <h1 className="rise">项目</h1>
          <p className="rise rise-2">
            一些亲手搭起来的东西，大部分还在改。
          </p>
        </div>
      </section>

      <section className="kit-section--tight kit-section" style={{ paddingTop: 32 }}>
        <div className="kit-container">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
