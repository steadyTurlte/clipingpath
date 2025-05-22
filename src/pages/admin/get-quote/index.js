import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const GetQuoteAdmin = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Get A Quote Page | Photodit Admin</title>
      </Head>

      <div className="admin-home">
        <h1 className="admin-home__title">Get A Quote Page</h1>
        <p className="admin-home__description">
          Edit the content of your Get A Quote page. Select a section below to edit.
        </p>

        <div className="admin-home__sections-grid">
          <Link href="/admin/get-quote/banner" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-image"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">Banner</h3>
              <p className="admin-home__section-card-description">Edit the quote page banner title.</p>
            </div>
          </Link>

          <Link href="/admin/get-quote/hero" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-heading"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">Hero Section</h3>
              <p className="admin-home__section-card-description">Edit the main heading and description.</p>
            </div>
          </Link>

          <Link href="/admin/get-quote/statistics" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">Statistics</h3>
              <p className="admin-home__section-card-description">Edit the statistics counters (professionals, delivery, cost).</p>
            </div>
          </Link>

          <Link href="/admin/get-quote/gallery" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-images"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">Gallery</h3>
              <p className="admin-home__section-card-description">Manage the image gallery with work samples.</p>
            </div>
          </Link>

          {/* Form Fields and Instructions sections removed as per requirements */}
        </div>
      </div>

      <style jsx>{`
        .admin-home__title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .admin-home__description {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .admin-home__sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .admin-home__section-card {
          display: flex;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .admin-home__section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .admin-home__section-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          background-color: #4569e7;
          color: white;
          font-size: 24px;
        }

        .admin-home__section-card-content {
          flex: 1;
          padding: 20px;
        }

        .admin-home__section-card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e293b;
        }

        .admin-home__section-card-description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </AdminLayout>
  );
};

export default GetQuoteAdmin;
