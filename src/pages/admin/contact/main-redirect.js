import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const ContactMainRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main contact page
    router.replace('/admin/contact');
  }, [router]);

  return (
    <AdminLayout>
      <Head>
        <title>Redirecting to Contact | Photodit Admin</title>
      </Head>

      <div className="admin-redirect">
        <div className="admin-redirect__content">
          <div className="admin-redirect__icon">
            <i className="fa-solid fa-sync fa-spin"></i>
          </div>
          <h1 className="admin-redirect__title">Redirecting to Contact Page</h1>
          <p className="admin-redirect__message">
            The contact form editing has been removed. You will be redirected automatically.
          </p>
          <Link href="/admin/contact" className="admin-redirect__link">
            Click here if you are not redirected automatically
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-redirect {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }
        
        .admin-redirect__content {
          text-align: center;
          max-width: 500px;
          padding: 40px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .admin-redirect__icon {
          font-size: 48px;
          color: #4569e7;
          margin-bottom: 24px;
        }
        
        .admin-redirect__title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1e293b;
        }
        
        .admin-redirect__message {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 24px;
        }
        
        .admin-redirect__link {
          display: inline-block;
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .admin-redirect__link:hover {
          background-color: #3a5bc7;
          transform: translateY(-2px);
        }
      `}</style>
    </AdminLayout>
  );
};

export default ContactMainRedirect;
