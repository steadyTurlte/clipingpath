import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminServices = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Services Page | Photodit Admin</title>
      </Head>

      <div className="admin-services">
        <h1 className="admin-services__title">Services Page</h1>
        <p className="admin-services__description">
          Edit the content of your Services page. Select a section below to edit.
        </p>

        <div className="admin-services__sections-grid">
          <Link href="/admin/services/banner" className="admin-services__section-card">
            <div className="admin-services__section-card-icon">
              <i className="fa-solid fa-image"></i>
            </div>
            <div className="admin-services__section-card-content">
              <h3 className="admin-services__section-card-title">Banner</h3>
              <p className="admin-services__section-card-description">Edit the banner section</p>
            </div>
          </Link>

          <Link href="/admin/services/main" className="admin-services__section-card">
            <div className="admin-services__section-card-icon">
              <i className="fa-solid fa-cogs"></i>
            </div>
            <div className="admin-services__section-card-content">
              <h3 className="admin-services__section-card-title">Main Services</h3>
              <p className="admin-services__section-card-description">Edit the main services section</p>
            </div>
          </Link>

          <Link href="/admin/services/services" className="admin-services__section-card">
            <div className="admin-services__section-card-icon">
              <i className="fa-solid fa-list"></i>
            </div>
            <div className="admin-services__section-card-content">
              <h3 className="admin-services__section-card-title">Service Items</h3>
              <p className="admin-services__section-card-description">Edit individual service items</p>
            </div>
          </Link>

          <Link href="/admin/services/features" className="admin-services__section-card">
            <div className="admin-services__section-card-icon">
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="admin-services__section-card-content">
              <h3 className="admin-services__section-card-title">Features</h3>
              <p className="admin-services__section-card-description">Edit the features section</p>
            </div>
          </Link>

          <Link href="/admin/services/pricing" className="admin-services__section-card">
            <div className="admin-services__section-card-icon">
              <i className="fa-solid fa-tag"></i>
            </div>
            <div className="admin-services__section-card-content">
              <h3 className="admin-services__section-card-title">Pricing</h3>
              <p className="admin-services__section-card-description">Edit the pricing section</p>
            </div>
          </Link>

          <Link href="/admin/services/testimonials" className="admin-services__section-card">
            <div className="admin-services__section-card-icon">
              <i className="fa-solid fa-quote-right"></i>
            </div>
            <div className="admin-services__section-card-content">
              <h3 className="admin-services__section-card-title">Testimonials</h3>
              <p className="admin-services__section-card-description">Edit the testimonials section</p>
            </div>
          </Link>

          <Link href="/admin/services/sponsors" className="admin-services__section-card">
            <div className="admin-services__section-card-icon">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <div className="admin-services__section-card-content">
              <h3 className="admin-services__section-card-title">Sponsors</h3>
              <p className="admin-services__section-card-description">Edit the sponsors section</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-services__title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .admin-services__description {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .admin-services__sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .admin-services__section-card {
          display: flex;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .admin-services__section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .admin-services__section-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          background-color: #4569e7;
          color: white;
          font-size: 24px;
        }

        .admin-services__section-card-content {
          flex: 1;
          padding: 20px;
        }

        .admin-services__section-card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e293b;
        }

        .admin-services__section-card-description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminServices;
