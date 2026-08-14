import type { Metadata } from 'next';
import SkillsDirectory from '../../components/SkillsDirectory';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'The engineering tools, systems, and practices Fang uses to build.',
};

export default function SkillsPage() {
  return <SkillsDirectory />;
}
