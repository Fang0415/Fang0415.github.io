import type { Metadata } from 'next';
import ProjectGrid from '../../components/ProjectGrid';
import { getVisibleProjects } from '../../lib/managed-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '项目',
  description: 'Fang 做过和正在做的项目，包括后端、AI 应用与 RAG。',
};

export default async function ProjectsPage() {
  const projects = await getVisibleProjects();

  return (
    <>
      <section className="page-head">
        <div className="kit-container">
          <h1 className="rise">做过和正在做的项目</h1>
          <p className="rise rise-2">
            这里会放我的项目和小实验。比起只列技术栈，我更想说清楚它解决了什么、
            为什么这样设计，以及下一步还能怎么改。
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
