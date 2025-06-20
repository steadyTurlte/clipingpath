import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';

const ServicesFeaturesEditor = () => {
  const [featuresData, setFeaturesData] = useState({
    subtitle: '',
    title: '',
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [featureAdded, setFeatureAdded] = useState(false);
  const [featureRemoved, setFeatureRemoved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the features data when the component mounts
    const fetchFeaturesData = async () => {
      try {
        const response = await fetch('/api/content/services?section=features');
        const data = await response.json();
        setFeaturesData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching features data:', error);
        setError('Failed to load features data');
        setLoading(false);
      }
    };

    fetchFeaturesData();
  }, []);

  const handleChange = (field, value) => {
    setFeaturesData({
      ...featuresData,
      [field]: value
    });
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedItems = [...featuresData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    setFeaturesData({
      ...featuresData,
      items: updatedItems
    });
  };

  const handleAddFeature = () => {
    setFeaturesData({
      ...featuresData,
      items: [
        ...featuresData.items,
        {
          id: Date.now(),
          icon: '',
          title: '',
          description: ''
        }
      ]
    });

    setFeatureAdded(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setFeatureAdded(false);
    }, 3000);
  };

  const handleRemoveFeature = (index) => {
    const updatedItems = [...featuresData.items];
    updatedItems.splice(index, 1);

    setFeaturesData({
      ...featuresData,
      items: updatedItems
    });

    setFeatureRemoved(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setFeatureRemoved(false);
    }, 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/services?section=features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(featuresData)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Features section');
      }
    } catch (error) {
      console.error('Error saving features data:', error);
      setError('Failed to save Features section');
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
        <title>Edit Features Section | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit Features Section</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/services" className="admin-editor__back-button">
              Back to Services
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

        {error && (
          <div className="admin-editor__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-editor__success">
            <p>Features section saved successfully!</p>
          </div>
        )}

        {featureAdded && (
          <div className="admin-editor__success">
            <p>Feature added successfully!</p>
          </div>
        )}

        {featureRemoved && (
          <div className="admin-editor__success">
            <p>Feature removed successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Features Section Header</h2>
            <div className="admin-editor__field">
              <label htmlFor="subtitle" className="admin-editor__label">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                className="admin-editor__input"
                value={featuresData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="title" className="admin-editor__label">Title</label>
              <input
                type="text"
                id="title"
                className="admin-editor__input"
                value={featuresData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>
          </div>

          <div className="admin-editor__section">
            <div className="admin-editor__section-header">
              <h2 className="admin-editor__section-title">Feature Items</h2>
              <button
                type="button"
                className="admin-editor__add-button"
                onClick={handleAddFeature}
              >
                Add Feature
              </button>
            </div>

            {featuresData.items.map((feature, index) => (
              <div key={feature.id || index} className="admin-editor__feature-item">
                <div className="admin-editor__feature-header">
                  <h3 className="admin-editor__feature-title">Feature #{index + 1}</h3>
                  <button
                    type="button"
                    className="admin-editor__remove-button"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="admin-editor__feature-grid">

                  <div className="admin-editor__field">
                    <label className="admin-editor__label">Title</label>
                    <input
                      type="text"
                      className="admin-editor__input"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Enter feature title"
                    />
                  </div>
                </div>

                <div className="admin-editor__field">
                  <label className="admin-editor__label">Description</label>
                  <textarea
                    className="admin-editor__textarea"
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    placeholder="Enter feature description"
                    rows={3}
                  />
                </div>
              </div>
            ))}
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

        .admin-editor__error,
        .admin-editor__success {
          padding: 16px 20px;
          border-radius: 8px;
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

        .admin-editor__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-editor__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-editor__error p,
        .admin-editor__success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-editor__error p::before {
          content: '❌ ';
        }

        .admin-editor__success p::before {
          content: '✅ ';
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

        .admin-editor__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
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

        .admin-editor__feature-item {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .admin-editor__feature-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .admin-editor__feature-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-editor__feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .admin-editor__icon-help {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
          background-color: #f1f5f9;
          padding: 8px 12px;
          border-radius: 4px;
          border-left: 3px solid #4569e7;
        }

        .admin-editor__icon-help p {
          margin-bottom: 4px;
          font-weight: 500;
        }

        .admin-editor__icon-help ul {
          margin: 0;
          padding-left: 16px;
        }

        .admin-editor__icon-help li {
          margin-bottom: 2px;
        }

        .admin-editor__add-button {
          padding: 6px 12px;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .admin-editor__remove-button {
          padding: 6px 12px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .admin-editor__feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default ServicesFeaturesEditor;
