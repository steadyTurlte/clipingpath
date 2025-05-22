import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const PortfolioCategoriesEditor = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the categories data when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/content/portfolio?section=categories');
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value
    };

    setCategories(updatedCategories);
  };

  const handleAddCategory = () => {
    const newId = categories.length > 0
      ? Math.max(...categories.map(cat => cat.id)) + 1
      : 1;

    setCategories([
      ...categories,
      { id: newId, name: '', filter: '' }
    ]);
  };

  const handleRemoveCategory = (index) => {
    // Don't allow removing the "All" category
    if (categories[index].filter === '*') {
      setError('The "All" category cannot be removed');
      return;
    }

    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
    setError(null);
  };

  const handleSave = async () => {
    // Reset states
    setError(null);
    setSaveSuccess(false);

    // Validate categories
    const hasAllCategory = categories.some(cat => cat.filter === '*');
    if (!hasAllCategory) {
      setError('You must have an "All" category with filter "*"');
      return;
    }

    // Check for empty fields
    const hasEmptyFields = categories.some(cat => !cat.name || !cat.filter);
    if (hasEmptyFields) {
      setError('All category fields must be filled');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/content/portfolio?section=categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categories)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Categories section');
      }
    } catch (error) {
      console.error('Error saving categories:', error);
      setError('Failed to save Categories section');
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
        <title>Edit Portfolio Categories | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <div className="admin-editor__title-wrapper">
            <Link href="/admin/portfolio" className="admin-editor__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-editor__title">Edit Portfolio Categories</h1>
          </div>

          <button
            className="admin-editor__save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="admin-editor__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-editor__success">
            <p>Categories section saved successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Portfolio Categories</h2>
            <p className="admin-editor__description">
              Manage the categories and filters for your portfolio items. The &quot;All&quot; category with filter &quot;*&quot; is required.
            </p>

            <div className="admin-editor__categories">
              {categories.map((category, index) => (
                <div key={category.id} className="admin-editor__category">
                  <div className="admin-editor__category-fields">
                    <div className="admin-editor__field">
                      <label className="admin-editor__label">Category Name</label>
                      <input
                        type="text"
                        className="admin-editor__input"
                        value={category.name}
                        onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="admin-editor__field">
                      <label className="admin-editor__label">Filter Value</label>
                      <input
                        type="text"
                        className="admin-editor__input"
                        value={category.filter}
                        onChange={(e) => handleCategoryChange(index, 'filter', e.target.value)}
                        placeholder="Enter filter value (e.g. .retouch, *)"
                        disabled={category.filter === '*'} // Don't allow changing the "All" filter
                      />
                      {category.filter === '*' && (
                        <p className="admin-editor__help-text">
                          The &quot;All&quot; filter cannot be changed.
                        </p>
                      )}
                    </div>
                  </div>
                  {category.filter !== '*' && (
                    <button
                      type="button"
                      className="admin-editor__remove-button"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="admin-editor__add-button"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
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
          margin-bottom: 32px;
          position: relative;
        }

        .admin-editor__title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-editor__back-link {
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

        .admin-editor__back-link:hover {
          background-color: #e2e8f0;
          transform: translateX(-4px);
        }

        .admin-editor__title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
          position: relative;
        }

        .admin-editor__title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: #4569e7;
          border-radius: 2px;
        }

        .admin-editor__save-button {
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

        .admin-editor__save-button::before {
          content: '💾';
          font-size: 16px;
        }

        .admin-editor__save-button:hover {
          background-color: #3a5bc7;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(69, 105, 231, 0.3);
        }

        .admin-editor__save-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
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

        .admin-editor__description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-editor__categories {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
        }

        .admin-editor__category {
          display: flex;
          gap: 16px;
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 4px;
          align-items: flex-start;
        }

        .admin-editor__category-fields {
          flex-grow: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .admin-editor__field {
          margin-bottom: 0;
        }

        .admin-editor__label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .admin-editor__input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__input:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
        }

        .admin-editor__help-text {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .admin-editor__remove-button {
          padding: 8px 16px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 24px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-editor__remove-button::before {
          content: '🗑️';
          font-size: 14px;
        }

        .admin-editor__remove-button:hover {
          background-color: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .admin-editor__add-button {
          padding: 10px 20px;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          margin-top: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
        }

        .admin-editor__add-button::before {
          content: '➕';
          font-size: 14px;
        }

        .admin-editor__add-button:hover {
          background-color: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </AdminLayout>
  );
};

export default PortfolioCategoriesEditor;
