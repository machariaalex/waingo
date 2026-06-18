import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SessionProvider } from './SessionProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Allow login page without auth
  return (
    <SessionProvider session={session}>
      {session ? (
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 bg-manila overflow-auto">
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </SessionProvider>
  );
}
