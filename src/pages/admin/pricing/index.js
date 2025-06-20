import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const PricingAdmin = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Pricing Page | Photodit Admin</title>
      </Head>

      <div className="admin-home">
        <h1 className="admin-home__title">Pricing Page</h1>
        <p className="admin-home__description">
          Edit the content of your Pricing page. Select a section below to edit.
        </p>

        <div className="admin-home__sections-grid">
          <Link href="/admin/pricing/banner" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-image"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">Banner</h3>
              <p className="admin-home__section-card-description">Edit the pricing page banner title.</p>
            </div>
          </Link>

          <Link href="/admin/pricing/plans" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-tags"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">Pricing Plans</h3>
              <p className="admin-home__section-card-description">Manage your pricing plans, features, and pricing details.</p>
            </div>
          </Link>

          <Link href="/admin/pricing/projects" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">Projects</h3>
              <p className="admin-home__section-card-description">Manage the projects section on the pricing page.</p>
            </div>
          </Link>

          <Link href="/admin/pricing/faq" className="admin-home__section-card">
            <div className="admin-home__section-card-icon">
              <i className="fa-solid fa-question-circle"></i>
            </div>
            <div className="admin-home__section-card-content">
              <h3 className="admin-home__section-card-title">FAQs</h3>
              <p className="admin-home__section-card-description">Manage frequently asked questions about pricing.</p>
            </div>
          </Link>
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

export default PricingAdmin;
