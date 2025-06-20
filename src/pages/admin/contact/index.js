import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminContact = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Contact Page | Photodit Admin</title>
      </Head>

      <div className="admin-contact">
        <h1 className="admin-contact__title">Contact Page</h1>
        <p className="admin-contact__description">
          Edit the content of your Contact page. Select a section below to edit.
        </p>

        <div className="admin-contact__sections-grid">
          <Link href="/admin/contact/banner" className="admin-contact__section-card">
            <div className="admin-contact__section-card-icon">
              <i className="fa-solid fa-image"></i>
            </div>
            <div className="admin-contact__section-card-content">
              <h3 className="admin-contact__section-card-title">Banner</h3>
              <p className="admin-contact__section-card-description">Edit the banner section</p>
            </div>
          </Link>

          <Link href="/admin/contact/info" className="admin-contact__section-card">
            <div className="admin-contact__section-card-icon">
              <i className="fa-solid fa-info-circle"></i>
            </div>
            <div className="admin-contact__section-card-content">
              <h3 className="admin-contact__section-card-title">Contact Info</h3>
              <p className="admin-contact__section-card-description">Edit contact information, social media links, and map settings</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-contact__title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .admin-contact__description {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .admin-contact__sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .admin-contact__section-card {
          display: flex;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .admin-contact__section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .admin-contact__section-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          background-color: #4569e7;
          color: white;
          font-size: 24px;
        }

        .admin-contact__section-card-content {
          flex: 1;
          padding: 20px;
        }

        .admin-contact__section-card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e293b;
        }

        .admin-contact__section-card-description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminContact;
