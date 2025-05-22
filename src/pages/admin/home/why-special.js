import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import WhySpecialEditor from '@/components/admin/home/WhySpecialEditor';

const AdminHomeWhySpecial = () => {
  const [whySpecialData, setWhySpecialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Fetch why special data
    fetch('/api/content/home?section=whySpecial')
      .then(res => res.json())
      .then(data => {
        setWhySpecialData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching why special data:', err);
        setError('Failed to load why special data. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  const handleSave = async (data) => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/content/home?section=whySpecial', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save why special data');
      }

      setWhySpecialData(data);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving why special data:', error);
      setError('Failed to save why special data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-home-why-special__loading">
          <p>Loading why special data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Why Special Section | Photodit Admin</title>
      </Head>

      <div className="admin-home-why-special">
        <div className="admin-home-why-special__header">
          <div className="admin-home-why-special__title-wrapper">
            <Link href="/admin/home" className="admin-home-why-special__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-home-why-special__title">Edit Why Special Section</h1>
          </div>

          <button
            className="admin-home-why-special__save-button"
            onClick={() => handleSave(whySpecialData)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="admin-home-why-special__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-home-why-special__success">
            <p>Why Special section saved successfully!</p>
          </div>
        )}

        <div className="admin-home-why-special__editor">
          <WhySpecialEditor
            data={whySpecialData}
            onChange={setWhySpecialData}
          />
        </div>
      </div>

      <style jsx>{`
        .admin-home-why-special__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          position: relative;
        }

        .admin-home-why-special__title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-home-why-special__back-link {
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

        .admin-home-why-special__back-link:hover {
          background-color: #e2e8f0;
          transform: translateX(-4px);
        }

        .admin-home-why-special__title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
          position: relative;
        }

        .admin-home-why-special__title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: #4569e7;
          border-radius: 2px;
        }

        .admin-home-why-special__save-button {
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

        .admin-home-why-special__save-button::before {
          content: '💾';
          font-size: 16px;
        }

        .admin-home-why-special__save-button:hover {
          background-color: #3a5bc7;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(69, 105, 231, 0.3);
        }

        .admin-home-why-special__save-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .admin-home-why-special__error,
        .admin-home-why-special__success {
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

        .admin-home-why-special__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-home-why-special__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-home-why-special__error p,
        .admin-home-why-special__success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-home-why-special__error p::before {
          content: '❌ ';
        }

        .admin-home-why-special__success p::before {
          content: '✅ ';
        }

        .admin-home-why-special__editor {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding: 32px;
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .admin-home-why-special__editor:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border-color: #e2e8f0;
        }

        .admin-home-why-special__loading {
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

        .admin-home-why-special__loading::after {
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
          .admin-home-why-special__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .admin-home-why-special__save-button {
            width: 100%;
            justify-content: center;
          }

          .admin-home-why-special__editor {
            padding: 24px 16px;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminHomeWhySpecial;
