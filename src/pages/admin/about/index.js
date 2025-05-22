import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminAbout = () => {
  return (
    <AdminLayout>
      <Head>
        <title>About Page | Photodit Admin</title>
      </Head>
      
      <div className="admin-about">
        <h1 className="admin-about__title">About Page</h1>
        <p className="admin-about__description">
          Edit the content of your About Us page. Select a section below to edit.
        </p>
        
        <div className="admin-about__sections-grid">
          <Link href="/admin/about/banner" className="admin-about__section-card">
            <div className="admin-about__section-card-icon">
              <i className="fa-solid fa-image"></i>
            </div>
            <div className="admin-about__section-card-content">
              <h3 className="admin-about__section-card-title">Banner</h3>
              <p className="admin-about__section-card-description">Edit the banner section</p>
            </div>
          </Link>

          <Link href="/admin/about/overview" className="admin-about__section-card">
            <div className="admin-about__section-card-icon">
              <i className="fa-solid fa-eye"></i>
            </div>
            <div className="admin-about__section-card-content">
              <h3 className="admin-about__section-card-title">Overview</h3>
              <p className="admin-about__section-card-description">Edit the overview section</p>
            </div>
          </Link>

          <Link href="/admin/about/main" className="admin-about__section-card">
            <div className="admin-about__section-card-icon">
              <i className="fa-solid fa-align-left"></i>
            </div>
            <div className="admin-about__section-card-content">
              <h3 className="admin-about__section-card-title">Main Content</h3>
              <p className="admin-about__section-card-description">Edit the main content section</p>
            </div>
          </Link>

          <Link href="/admin/about/sponsors" className="admin-about__section-card">
            <div className="admin-about__section-card-icon">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <div className="admin-about__section-card-content">
              <h3 className="admin-about__section-card-title">Sponsors</h3>
              <p className="admin-about__section-card-description">Edit the sponsors section</p>
            </div>
          </Link>

          <Link href="/admin/about/team" className="admin-about__section-card">
            <div className="admin-about__section-card-icon">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="admin-about__section-card-content">
              <h3 className="admin-about__section-card-title">Team</h3>
              <p className="admin-about__section-card-description">Edit the team section</p>
            </div>
          </Link>

          <Link href="/admin/about/faq" className="admin-about__section-card">
            <div className="admin-about__section-card-icon">
              <i className="fa-solid fa-question-circle"></i>
            </div>
            <div className="admin-about__section-card-content">
              <h3 className="admin-about__section-card-title">FAQ</h3>
              <p className="admin-about__section-card-description">Edit the FAQ section</p>
            </div>
          </Link>

          <Link href="/admin/about/cta" className="admin-about__section-card">
            <div className="admin-about__section-card-icon">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <div className="admin-about__section-card-content">
              <h3 className="admin-about__section-card-title">CTA</h3>
              <p className="admin-about__section-card-description">Edit the call-to-action section</p>
            </div>
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .admin-about__title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .admin-about__description {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }
        
        .admin-about__sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .admin-about__section-card {
          display: flex;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .admin-about__section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .admin-about__section-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          background-color: #4569e7;
          color: white;
          font-size: 24px;
        }
        
        .admin-about__section-card-content {
          flex: 1;
          padding: 20px;
        }
        
        .admin-about__section-card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1e293b;
        }
        
        .admin-about__section-card-description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminAbout;
