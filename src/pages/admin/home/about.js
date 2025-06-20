import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import AboutEditor from '@/components/admin/home/AboutEditor';

const AdminHomeAbout = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Fetch about data
    fetch('/api/content/home?section=about')
      .then(res => res.json())
      .then(data => {
        setAboutData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching about data:', err);
        setError('Failed to load about data. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  const handleSave = async (data) => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/content/home?section=about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save about data');
      }

      setAboutData(data);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving about data:', error);
      setError('Failed to save about data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-home-about__loading">
          <p>Loading about data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit About Section | Photodit Admin</title>
      </Head>

      <div className="admin-home-about">
        <div className="admin-home-about__header">
          <div className="admin-home-about__title-wrapper">
            <Link href="/admin/home" className="admin-home-about__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-home-about__title">Edit About Section</h1>
          </div>

          <button
            className="admin-home-about__save-button"
            onClick={() => handleSave(aboutData)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="admin-home-about__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-home-about__success">
            <p>About section saved successfully!</p>
          </div>
        )}

        <div className="admin-home-about__editor">
          <AboutEditor
            data={aboutData}
            onChange={setAboutData}
          />
        </div>
      </div>

      <style jsx>{`
        .admin-home-about__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          position: relative;
        }

        .admin-home-about__title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-home-about__back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background-color: #f1f5f9;
          color: #4b5563;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .admin-home-about__back-link:hover {
          background-color: #e2e8f0;
          transform: translateX(-4px);
        }

        .admin-home-about__title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
          position: relative;
        }

        .admin-home-about__title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: #4569e7;
          border-radius: 2px;
        }

        .admin-home-about__save-button {
          padding: 12px 24px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(69, 105, 231, 0.25);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-home-about__save-button::before {
          content: '💾';
          font-size: 16px;
        }

        .admin-home-about__save-button:hover {
          background-color: #3a5bc7;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(69, 105, 231, 0.3);
        }

        .admin-home-about__save-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .admin-home-about__error,
        .admin-home-about__success {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-home-about__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-home-about__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-home-about__error p,
        .admin-home-about__success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-home-about__error p::before {
          content: '❌ ';
        }

        .admin-home-about__success p::before {
          content: '✅ ';
        }

        .admin-home-about__editor {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding: 32px;
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .admin-home-about__editor:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border-color: #e2e8f0;
        }

        .admin-home-about__loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
        }

        .admin-home-about__loading::after {
          content: '';
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #4569e7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-top: 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .admin-home-about__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .admin-home-about__save-button {
            width: 100%;
            justify-content: center;
          }

          .admin-home-about__editor {
            padding: 24px 16px;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminHomeAbout;
