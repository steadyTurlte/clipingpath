import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Photodit</title>
      </Head>

      <div className="admin-dashboard">
        <h1 className="admin-dashboard__title">Welcome to Photodit Admin Panel</h1>
        <div className="admin-dashboard__welcome-box">
          <div className="admin-dashboard__welcome-icon">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div className="admin-dashboard__welcome-content">
            <h2 className="admin-dashboard__welcome-heading">Manage Your Website Content</h2>
            <p className="admin-dashboard__welcome-text">
              This admin panel allows you to easily edit and manage all content on your Photodit website. Use the navigation menu on the left to access different sections of your site.
            </p>
            <p className="admin-dashboard__welcome-text">
              All settings and content are centralized for consistency across your site. Changes you make here will be reflected immediately on your website.
            </p>
            <div className="admin-dashboard__welcome-actions">
              <Link href="/admin/contact/info" className="admin-dashboard__welcome-button admin-dashboard__welcome-button--primary">
                <i className="fa-solid fa-address-card"></i> Edit Contact Info
              </Link>
              <Link href="/admin/services" className="admin-dashboard__welcome-button">
                <i className="fa-solid fa-cogs"></i> Manage Services
              </Link>
              <Link href="/" target="_blank" className="admin-dashboard__welcome-button">
                <i className="fa-solid fa-external-link"></i> View Website
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard__title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #1e293b;
          text-align: center;
        }

        .admin-dashboard__welcome-box {
          display: flex;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          margin-bottom: 40px;
          border: 1px solid #e2e8f0;
        }

        .admin-dashboard__welcome-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          background: linear-gradient(135deg, #4569e7 0%, #3b5bd9 100%);
          color: white;
          font-size: 48px;
          padding: 20px;
        }

        .admin-dashboard__welcome-content {
          flex: 1;
          padding: 32px;
        }

        .admin-dashboard__welcome-heading {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1e293b;
        }

        .admin-dashboard__welcome-text {
          font-size: 16px;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-dashboard__welcome-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .admin-dashboard__welcome-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .admin-dashboard__welcome-button:hover {
          background-color: #e2e8f0;
          transform: translateY(-2px);
        }

        .admin-dashboard__welcome-button--primary {
          background-color: #4569e7;
          color: white;
        }

        .admin-dashboard__welcome-button--primary:hover {
          background-color: #3b5bd9;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
