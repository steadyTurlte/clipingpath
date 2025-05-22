import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';

const ServicesPricingEditor = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the central pricing page
    router.push('/admin/pricing/plans');
  }, [router]);

  return (
    <AdminLayout>
      <Head>
        <title>Redirecting to Pricing Plans | Photodit Admin</title>
      </Head>
      <div className="admin-editor__loading">
        <p>Redirecting to the central pricing management page...</p>
        <p>All pricing data is now managed in one central location.</p>
      </div>

      <style jsx>{`
        .admin-editor__loading {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
          text-align: center;
        }
      `}</style>
    </AdminLayout>
  );
};

export default ServicesPricingEditor;
