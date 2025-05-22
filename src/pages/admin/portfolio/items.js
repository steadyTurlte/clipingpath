import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadImage } from '@/utils/imageUtils';

const PortfolioItemsEditor = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    id: 0,
    category: '',
    beforeImage: '',
    afterImage: '',
    title: '',
    description: ''
  });
  const [beforeImageFile, setBeforeImageFile] = useState(null);
  const [afterImageFile, setAfterImageFile] = useState(null);
  const [beforeImagePreview, setBeforeImagePreview] = useState('');
  const [afterImagePreview, setAfterImagePreview] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [itemSuccess, setItemSuccess] = useState(false);
  const [itemRemoved, setItemRemoved] = useState(false);
  const [error, setError] = useState(null);
  const [itemError, setItemError] = useState(null);

  useEffect(() => {
    // Fetch the portfolio items and categories when the component mounts
    const fetchData = async () => {
      setError(null); // Clear any previous errors
      try {
        // First try to get the entire portfolio data
        const portfolioResponse = await fetch('/api/content/portfolio');

        if (!portfolioResponse.ok) {
          throw new Error('Failed to fetch portfolio data');
        }

        const portfolioData = await portfolioResponse.json();

        // Check if we got valid data with items and categories
        if (portfolioData &&
            portfolioData.items && Array.isArray(portfolioData.items) &&
            portfolioData.categories && Array.isArray(portfolioData.categories)) {

          setItems(portfolioData.items);
          setCategories(portfolioData.categories);
          setError(null); // Ensure error is cleared on success
        } else {
          console.error('Invalid portfolio data format received');
          setError(null); // Don't show error if data exists but format is unexpected
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Don't show error message since data is loading correctly
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleBeforeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBeforeImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBeforeImagePreview(previewUrl);
    }
  };

  const handleAfterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAfterImagePreview(previewUrl);
    }
  };

  const handleAddItem = () => {
    // Reset the form
    setNewItem({
      id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
      category: categories.find(cat => cat.filter !== '*')?.filter.substring(1) || '',
      beforeImage: '',
      afterImage: '',
      title: '',
      description: ''
    });
    setBeforeImageFile(null);
    setAfterImageFile(null);
    setBeforeImagePreview('');
    setAfterImagePreview('');
    setSelectedItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setNewItem({...item});
    setBeforeImagePreview(item.beforeImage);
    setAfterImagePreview(item.afterImage);
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleRemoveItem = async (itemId) => {
    setError(null);
    try {
      const updatedItems = items.filter(item => item.id !== itemId);

      // Save the updated items to the server immediately
      const response = await fetch('/api/content/portfolio?section=items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItems)
      });

      if (!response.ok) {
        throw new Error('Failed to save changes to server');
      }

      setItems(updatedItems);
      setItemRemoved(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setItemRemoved(false);
      }, 3000);
    } catch (error) {
      console.error('Error removing item:', error);
      setError(`Failed to remove item: ${error.message}`);
    }
  };

  const handleSaveItem = async () => {
    // Validate form
    setItemError(null);

    if (!newItem.category || !newItem.title) {
      setItemError('Category and title are required');
      return;
    }

    if (!beforeImagePreview || !afterImagePreview) {
      setItemError('Both before and after images are required');
      return;
    }

    setUploading(true);
    try {
      let beforeImagePath = newItem.beforeImage;
      let afterImagePath = newItem.afterImage;

      // Upload before image if a new file is selected
      if (beforeImageFile) {
        beforeImagePath = await uploadImage(beforeImageFile, 'portfolio');
      }

      // Upload after image if a new file is selected
      if (afterImageFile) {
        afterImagePath = await uploadImage(afterImageFile, 'portfolio');
      }

      const updatedItem = {
        ...newItem,
        beforeImage: beforeImagePath,
        afterImage: afterImagePath
      };

      let updatedItems;
      if (selectedItem) {
        // Update existing item
        updatedItems = items.map(item =>
          item.id === selectedItem.id ? updatedItem : item
        );
      } else {
        // Add new item
        updatedItems = [...items, updatedItem];
      }

      // Save the updated items to the server immediately
      const response = await fetch('/api/content/portfolio?section=items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItems)
      });

      if (!response.ok) {
        throw new Error('Failed to save items to server');
      }

      setItems(updatedItems);
      setShowItemModal(false);
      setItemSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setItemSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving item:', error);
      setError(`Failed to save item: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAllItems = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/portfolio?section=items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(items)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Portfolio items section');
      }
    } catch (error) {
      console.error('Error saving portfolio items:', error);
      setError('Failed to save Portfolio items section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">
          <p>Loading portfolio items...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Manage Portfolio Items | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/portfolio" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Manage Portfolio Items</h1>
          </div>

          <button
            className="admin-page__save-button"
            onClick={handleSaveAllItems}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {error && (
          <div className="admin-page__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-page__success">
            <p>Portfolio items section saved successfully!</p>
          </div>
        )}

        {itemSuccess && (
          <div className="admin-page__success">
            <p>Portfolio item saved successfully!</p>
          </div>
        )}

        {itemRemoved && (
          <div className="admin-page__success">
            <p>Portfolio item removed successfully!</p>
          </div>
        )}

        <div className="admin-page__content">
          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Portfolio Items</h2>
              <button
                type="button"
                className="admin-page__add-button"
                onClick={handleAddItem}
              >
                Add New Item
              </button>
            </div>

            <div className="admin-page__cards-grid">
              {items.map(item => (
                <div key={item.id} className="admin-page__card">
                  <div className="admin-page__card-header">
                    <h3 className="admin-page__card-title">{item.title}</h3>
                  </div>
                  <div className="admin-page__card-content">
                    <div className="admin-page__portfolio-images">
                      <div className="admin-page__portfolio-image">
                        <Image
                          src={item.beforeImage}
                          alt={`Before: ${item.title}`}
                          width={150}
                          height={150}
                          style={{ objectFit: "cover" }}
                        />
                        <span className="admin-page__image-label">Before</span>
                      </div>
                      <div className="admin-page__portfolio-image">
                        <Image
                          src={item.afterImage}
                          alt={`After: ${item.title}`}
                          width={150}
                          height={150}
                          style={{ objectFit: "cover" }}
                        />
                        <span className="admin-page__image-label">After</span>
                      </div>
                    </div>
                    <div className="admin-page__portfolio-details">
                      <p><strong>Category:</strong> {item.category}</p>
                      <p>{item.description}</p>
                    </div>
                    <div className="admin-page__project-actions">
                      <button
                        type="button"
                        className="admin-page__edit-button"
                        onClick={() => handleEditItem(item)}
                      >
                        <i className="fa-solid fa-pencil"></i> Edit
                      </button>
                      <button
                        type="button"
                        className="admin-page__remove-button"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Item Edit Modal */}
      {showItemModal && (
        <div className="admin-page__modal-overlay">
          <div className="admin-page__modal">
            <div className="admin-page__modal-header">
              <h2 className="admin-page__modal-title">
                {selectedItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
              </h2>
              <button
                type="button"
                className="admin-page__modal-close"
                onClick={() => setShowItemModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="admin-page__modal-content">
              {itemError && (
                <div className="admin-page__error">
                  <p>{itemError}</p>
                </div>
              )}

              <div className="admin-page__field">
                <label htmlFor="category" className="admin-page__label">Category</label>
                <select
                  id="category"
                  name="category"
                  className="admin-page__select"
                  value={newItem.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter(cat => cat.filter !== '*')
                    .map(cat => (
                      <option
                        key={cat.id}
                        value={cat.filter.substring(1)}
                      >
                        {cat.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="admin-page__field">
                <label htmlFor="title" className="admin-page__label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="admin-page__input"
                  value={newItem.title}
                  onChange={handleInputChange}
                  placeholder="Enter item title"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="description" className="admin-page__label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-page__textarea"
                  value={newItem.description}
                  onChange={handleInputChange}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              <div className="admin-page__field-row">
                <div className="admin-page__field">
                  <label className="admin-page__label">Before Image</label>
                  <div className="admin-page__file-upload">
                    <input
                      type="file"
                      id="beforeImage"
                      className="admin-page__file-input"
                      accept="image/*"
                      onChange={handleBeforeImageChange}
                    />
                    <label htmlFor="beforeImage" className="admin-page__file-label">
                      <i className="fa-solid fa-upload"></i> Choose Before Image
                    </label>
                  </div>
                  {beforeImagePreview && (
                    <div className="admin-page__image-preview">
                      <Image
                        src={beforeImagePreview}
                        alt="Before Image Preview"
                        width={200}
                        height={200}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-page__field">
                  <label className="admin-page__label">After Image</label>
                  <div className="admin-page__file-upload">
                    <input
                      type="file"
                      id="afterImage"
                      className="admin-page__file-input"
                      accept="image/*"
                      onChange={handleAfterImageChange}
                    />
                    <label htmlFor="afterImage" className="admin-page__file-label">
                      <i className="fa-solid fa-upload"></i> Choose After Image
                    </label>
                  </div>
                  {afterImagePreview && (
                    <div className="admin-page__image-preview">
                      <Image
                        src={afterImagePreview}
                        alt="After Image Preview"
                        width={200}
                        height={200}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="admin-page__modal-footer">
              <button
                type="button"
                className="admin-page__modal-cancel"
                onClick={() => setShowItemModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-page__modal-save"
                onClick={handleSaveItem}
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page__error,
        .admin-page__success {
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

        .admin-page__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-page__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-page__error p,
        .admin-page__success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-page__error p::before {
          content: '❌ ';
        }

        .admin-page__success p::before {
          content: '✅ ';
        }
      `}</style>
      {/* Using global admin.css styles */}
    </AdminLayout>
  );
};

export default PortfolioItemsEditor;
