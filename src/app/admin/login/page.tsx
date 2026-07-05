import { redirect } from 'next/navigation';
import LoginForm from '../../../components/admin/LoginForm';
import { isAdminAuthenticated } from '../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect('/admin/');

  return (
    <section className="admin-page">
      <LoginForm />
    </section>
  );
}
