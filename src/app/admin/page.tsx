import { redirect } from 'next/navigation';
import AdminDashboard from '../../components/admin/AdminDashboard';
import { isAdminAuthenticated } from '../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login/');
  return (
    <section className="admin-page">
      <AdminDashboard />
    </section>
  );
}
