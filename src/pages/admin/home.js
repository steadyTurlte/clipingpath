import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminHome = () => {
  const [homeData, setHomeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch home page data
    fetch('/api/content/home')
      .then(res => res.json())
      .then(data => {
        setHomeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching home data:', err);
        setError('Failed to load home page data. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-dashboard__loading">
          <p>Loading home page data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-dashboard__error">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="admin-dashboard__reload-button"
          >
            Reload Page
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Home Page | Photodit Admin</title>
      </Head>

      <div className="admin-dashboard">
        <h1 className="admin-dashboard__title">Edit Home Page</h1>
        <p className="admin-dashboard__description">
          Edit the content of your home page. Changes will be visible on the website immediately after saving.
        </p>

        <div className="admin-dashboard__cards">
          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-image"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">Banner</h2>
              <p className="admin-dashboard__card-description">Edit the main banner section</p>
              <Link href="/admin/home/banner" className="admin-dashboard__card-link">
                Edit Banner
              </Link>
            </div>
          </div>

          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-cogs"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">Services</h2>
              <p className="admin-dashboard__card-description">Edit the services section</p>
              <Link href="/admin/home/services" className="admin-dashboard__card-link">
                Edit Services
              </Link>
            </div>
          </div>

          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-info-circle"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">About</h2>
              <p className="admin-dashboard__card-description">Edit the about section</p>
              <Link href="/admin/home/about" className="admin-dashboard__card-link">
                Edit About
              </Link>
            </div>
          </div>

          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">Why Special</h2>
              <p className="admin-dashboard__card-description">Edit the why we are special section</p>
              <Link href="/admin/home/why-special" className="admin-dashboard__card-link">
                Edit Why Special
              </Link>
            </div>
          </div>

          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-magic"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">Tricky Backgrounds</h2>
              <p className="admin-dashboard__card-description">Edit the tricky backgrounds section</p>
              <Link href="/admin/home/tricky-backgrounds" className="admin-dashboard__card-link">
                Edit Tricky Backgrounds
              </Link>
            </div>
          </div>

          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-quote-right"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">Testimonials</h2>
              <p className="admin-dashboard__card-description">Testimonials are now managed from the Services page</p>
              <Link href="/admin/services/testimonials" className="admin-dashboard__card-link">
                Go to Testimonials Editor
              </Link>
            </div>
          </div>

          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-tag"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">Pricing</h2>
              <p className="admin-dashboard__card-description">Pricing is now managed from the Pricing page</p>
              <Link href="/admin/pricing/plans" className="admin-dashboard__card-link">
                Go to Pricing Editor
              </Link>
            </div>
          </div>



          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">CTA</h2>
              <p className="admin-dashboard__card-description">Edit the call-to-action section</p>
              <Link href="/admin/home/cta" className="admin-dashboard__card-link">
                Edit CTA
              </Link>
            </div>
          </div>

          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <div className="admin-dashboard__card-content">
              <h2 className="admin-dashboard__card-title">Sponsors</h2>
              <p className="admin-dashboard__card-description">Edit the sponsors section</p>
              <Link href="/admin/home/sponsors" className="admin-dashboard__card-link">
                Edit Sponsors
              </Link>
            </div>
          </div>
        </div>


      </div>

      <style jsx>{`
        .admin-dashboard__title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .admin-dashboard__description {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .admin-dashboard__section-title {
          font-size: 20px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-dashboard__cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .admin-dashboard__card {
          display: flex;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .admin-dashboard__card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          background-color: #4569e7;
          color: white;
          font-size: 24px;
        }

        .admin-dashboard__card-content {
          flex: 1;
          padding: 20px;
        }

        .admin-dashboard__card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .admin-dashboard__card-description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-dashboard__card-link {
          display: inline-block;
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .admin-dashboard__card-link:hover {
          background-color: #e2e8f0;
        }

        .admin-dashboard__loading,
        .admin-dashboard__error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .admin-dashboard__error {
          color: #dc2626;
        }

        .admin-dashboard__reload-button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .admin-dashboard__reload-button:hover {
          background-color: #3a5bc7;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminHome;
