import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

const TeamSponsorsEditor = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the centralized sponsors page
    router.replace('/admin/about/sponsors');
  }, [router]);

  return (
    <AdminLayout>
      <Head>
        <title>Redirecting to Sponsors | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__loading">
          <p>Redirecting to centralized sponsors management...</p>
        </div>
      </div>

      <style jsx>{`
        .admin-editor__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
        }
      `}</style>
    </AdminLayout>
  );
};

export default TeamSponsorsEditor;
