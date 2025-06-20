import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';

const QuoteOverviewEditor = () => {
  const [overviewData, setOverviewData] = useState({
    subtitle: '',
    title: '',
    description: '',
    steps: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await fetch('/api/content/get-quote?section=overview');
        if (response.ok) {
          const data = await response.json();
          setOverviewData(data);
        } else {
          toast.error('Failed to load overview data');
        }
      } catch (error) {
        console.error('Error fetching overview data:', error);
        toast.error('Error loading overview data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const handleInputChange = (field, value) => {
    setOverviewData({
      ...overviewData,
      [field]: value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/get-quote?section=overview', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(overviewData)
      });

      if (response.ok) {
        toast.success('Overview section saved successfully!');
      } else {
        toast.error('Failed to save Overview section');
      }
    } catch (error) {
      console.error('Error saving overview data:', error);
      toast.error('Failed to save Overview section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-editor__loading">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Quote Overview | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit Quote Overview</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/get-quote" className="admin-editor__back-button">
              Back to Get A Quote
            </Link>
            <button
              className="admin-editor__save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Overview Settings</h2>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Subtitle</label>
              <input
                type="text"
                className="admin-editor__input"
                value={overviewData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Title</label>
              <input
                type="text"
                className="admin-editor__input"
                value={overviewData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Description</label>
              <textarea
                className="admin-editor__textarea"
                value={overviewData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </div>

          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Overview Steps</h2>
            <p className="admin-editor__description">
              Manage your overview steps here. You can add, edit, or remove steps.
            </p>

            <div className="admin-editor__message">
              <p>Steps editor will be implemented soon.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-editor__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
        }

        .admin-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-editor__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-editor__actions {
          display: flex;
          gap: 12px;
        }

        .admin-editor__back-button {
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
        }

        .admin-editor__save-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .admin-editor__save-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .admin-editor__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .admin-editor__section {
          margin-bottom: 24px;
        }

        .admin-editor__section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-editor__description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-editor__field {
          margin-bottom: 16px;
        }

        .admin-editor__label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .admin-editor__input,
        .admin-editor__textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__textarea {
          resize: vertical;
        }

        .admin-editor__message {
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 4px;
          font-size: 14px;
          color: #64748b;
          text-align: center;
        }
      `}</style>
    </AdminLayout>
  );
};

export default QuoteOverviewEditor;
