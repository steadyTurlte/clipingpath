import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

const PortfolioSponsorsRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the centralized sponsors editor in the about section
    router.push('/admin/about/sponsors');
  }, [router]);

  return (
    <AdminLayout>
      <Head>
        <title>Sponsors Centralized | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Sponsors Management Centralized</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/portfolio" className="admin-editor__back-button">
              Back to Portfolio
            </Link>
            <Link href="/admin/about/sponsors" className="admin-editor__primary-button">
              Go to Sponsors Editor
            </Link>
          </div>
        </div>

        <div className="admin-editor__content">
          <div className="admin-editor__message">
            <p>Sponsors data has been centralized to the About section.</p>
            <p>You will be redirected to the About Sponsors editor automatically.</p>
            <p>If you are not redirected, please click the &quot;Go to Sponsors Editor&quot; button above.</p>
          </div>
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

        .admin-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-editor__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-editor__actions {
          display: flex;
          gap: 12px;
        }

        .admin-editor__back-button {
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
        }

        .admin-editor__primary-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
        }

        .admin-editor__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .admin-editor__message {
          padding: 20px;
          background-color: #f8fafc;
          border-radius: 8px;
          text-align: center;
          color: #1e293b;
        }

        .admin-editor__message p {
          margin: 10px 0;
        }
      `}</style>
    </AdminLayout>
  );
};

export default PortfolioSponsorsRedirect;
