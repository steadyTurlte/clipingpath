import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const HomePricingEditor = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the pricing plans page
    router.push('/admin/pricing/plans');
  }, [router]);

  // This page now redirects to the pricing plans page

  return (
    <AdminLayout>
      <Head>
        <title>Redirecting to Pricing Plans | Photodit Admin</title>
      </Head>

      <div className="admin-redirect">
        <div className="admin-redirect__content">
          <div className="admin-redirect__icon">
            <i className="fa-solid fa-sync fa-spin"></i>
          </div>
          <h1 className="admin-redirect__title">Redirecting to Pricing Plans</h1>
          <p className="admin-redirect__message">
            Pricing is now managed centrally from the Pricing page.
            You will be redirected automatically.
          </p>
          <Link href="/admin/pricing/plans" className="admin-redirect__link">
            Click here if you are not redirected automatically
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-redirect {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .admin-redirect__content {
          text-align: center;
          background-color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 500px;
        }

        .admin-redirect__icon {
          font-size: 48px;
          color: #4569e7;
          margin-bottom: 24px;
        }

        .admin-redirect__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .admin-redirect__message {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .admin-redirect__link {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4569e7;
          color: white;
          border-radius: 8px;
          text-decoration: none;
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

export default HomePricingEditor;
