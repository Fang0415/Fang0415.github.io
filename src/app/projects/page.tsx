import type { Metadata } from 'next';
import ProjectGrid from '../../components/ProjectGrid';
import { getVisibleProjects } from '../../lib/managed-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '项目',
  description: '一些侧项目、工具和实验，主要围绕后端系统与检索基础设施。',
};

export default async function ProjectsPage() {
  const projects = await getVisibleProjects();

  return (
    <>
      <section className="page-head">
        <div className="kit-container">
          <h1 className="rise">我做过的一些项目</h1>
          <p className="rise rise-2">
            这里记录一些侧项目、工具和实验，主要围绕后端系统与检索基础设施。
            有些还在维护，有些已经暂停，但仍然保留它们当时解决问题的思路。
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
