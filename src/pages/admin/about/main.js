import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';

const AboutMainEditor = () => {
  const [mainData, setMainData] = useState({
    subtitle: '',
    title: '',
    description: '',
    additionalText: '',
    priceTag: '',
    image: '',
    buttons: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Fetch the main data when the component mounts
    const fetchMainData = async () => {
      try {
        const response = await fetch('/api/content/about?section=main');
        const data = await response.json();
        setMainData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching main data:', error);
        toast.error('Failed to load main data');
        setLoading(false);
      }
    };

    fetchMainData();
  }, []);

  const handleChange = (field, value) => {
    setMainData({
      ...mainData,
      [field]: value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images/about');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.filePath) {
        setMainData({
          ...mainData,
          image: result.filePath
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch('/api/content/about?section=main', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mainData)
      });

      if (response.ok) {
        setSaveSuccess(true);
        // Scroll to top to show the success message
        window.scrollTo(0, 0);
      } else {
        console.error('Failed to save Main section');
      }
    } catch (error) {
      console.error('Error saving main section data:', error);
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
        <title>Edit About Main Section | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit About Main Section</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/about" className="admin-editor__back-button">
              Back to About
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

        {saveSuccess && (
          <div className="admin-editor__success">
            <p>Main section saved successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Main Content</h2>
            <div className="admin-editor__field">
              <label htmlFor="subtitle" className="admin-editor__label">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                className="admin-editor__input"
                value={mainData.subtitle}
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
                value={mainData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="description" className="admin-editor__label">Description</label>
              <textarea
                id="description"
                className="admin-editor__textarea"
                value={mainData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="additionalText" className="admin-editor__label">Additional Text</label>
              <textarea
                id="additionalText"
                className="admin-editor__textarea"
                value={mainData.additionalText}
                onChange={(e) => handleChange('additionalText', e.target.value)}
                placeholder="Enter additional text"
                rows={3}
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="priceTag" className="admin-editor__label">Price Tag</label>
              <input
                type="text"
                id="priceTag"
                className="admin-editor__input"
                value={mainData.priceTag}
                onChange={(e) => handleChange('priceTag', e.target.value)}
                placeholder="Enter price tag"
              />
            </div>
          </div>

          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Main Image</h2>
            <div className="admin-editor__image-preview">
              {mainData.image && (
                <Image
                  src={mainData.image}
                  alt="Main Image"
                  width={300}
                  height={200}
                  className="admin-editor__preview-img"
                  style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                />
              )}
            </div>
            <div className="admin-editor__image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="admin-editor__file-input"
              />
              {uploadingImage && <span className="admin-editor__uploading">Uploading...</span>}
            </div>

            <div className="admin-editor__image-help">
              <p className="admin-editor__help-text">
                <strong>Recommended size:</strong> 600x400px
              </p>
              <p className="admin-editor__help-text">
                <strong>Image types:</strong> JPEG, PNG, WEBP
              </p>
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

        .admin-editor__success {
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          animation: slideIn 0.3s ease-out;
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
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

        .admin-editor__success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-editor__success p::before {
          content: '✅ ';
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
        .admin-editor__textarea,
        .admin-editor__select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__static-field {
          width: 100%;
          padding: 8px 12px;
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
          color: #64748b;
        }

        .admin-editor__textarea {
          resize: vertical;
        }

        .admin-editor__image-preview {
          margin-bottom: 16px;
          max-width: 300px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .admin-editor__preview-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .admin-editor__image-upload {
          margin-bottom: 16px;
        }

        .admin-editor__file-input {
          display: block;
          margin-bottom: 8px;
        }

        .admin-editor__uploading {
          display: inline-block;
          margin-left: 8px;
          font-size: 14px;
          color: #4569e7;
        }

        .admin-editor__button-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 4px;
          margin-bottom: 16px;
          align-items: end;
        }

        .admin-editor__help-text {
          font-size: 14px;
          color: #64748b;
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
          padding: 8px 12px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          height: 38px;
        }

        @media (max-width: 768px) {
          .admin-editor__button-item {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AboutMainEditor;
