import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadImage } from '@/utils/imageUtils';

const QuoteHeroEditor = () => {
  const [heroData, setHeroData] = useState({
    subtitle: '',
    title: '',
    description: '',
    mainImage: '',
    decorativeImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // State for image uploads
  const [mainImageFile, setMainImageFile] = useState(null);
  const [decorativeImageFile, setDecorativeImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [decorativeImagePreview, setDecorativeImagePreview] = useState('');

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/content/get-quote?section=hero');
        if (response.ok) {
          const data = await response.json();
          setHeroData({
            subtitle: data.subtitle || '',
            title: data.title || '',
            description: data.description || '',
            mainImage: data.mainImage || '',
            decorativeImage: data.decorativeImage || ''
          });

          // Set image previews if images exist
          if (data.mainImage) {
            setMainImagePreview(data.mainImage);
          }

          if (data.decorativeImage) {
            setDecorativeImagePreview(data.decorativeImage);
          }
        } else {
          setError('Failed to load hero data');
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setError('Error loading hero data');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const handleInputChange = (field, value) => {
    setHeroData({
      ...heroData,
      [field]: value
    });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
    }
  };

  const handleDecorativeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDecorativeImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setDecorativeImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      let updatedHeroData = { ...heroData };

      // Upload main image if a new file is selected
      if (mainImageFile) {
        setUploading(true);
        try {
          const imagePath = await uploadImage(mainImageFile, 'get-quote');
          updatedHeroData.mainImage = imagePath;
        } catch (uploadError) {
          console.error('Error uploading main image:', uploadError);
          setError('Failed to upload main image. Please try again.');
          setSaving(false);
          setUploading(false);
          return;
        }
      }

      // Upload decorative image if a new file is selected
      if (decorativeImageFile) {
        setUploading(true);
        try {
          const imagePath = await uploadImage(decorativeImageFile, 'get-quote');
          updatedHeroData.decorativeImage = imagePath;
        } catch (uploadError) {
          console.error('Error uploading decorative image:', uploadError);
          setError('Failed to upload decorative image. Please try again.');
          setSaving(false);
          setUploading(false);
          return;
        }
      }

      setUploading(false);

      const response = await fetch('/api/content/get-quote?section=hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedHeroData)
      });

      if (response.ok) {
        // Update the hero data with the new image paths
        setHeroData(updatedHeroData);
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Hero section');
      }
    } catch (error) {
      console.error('Error saving hero data:', error);
      setError('Failed to save Hero section');
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
        <title>Edit Quote Hero Section | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit Quote Hero Section</h1>
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

        {error && (
          <div className="admin-editor__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-editor__success">
            <p>Hero section saved successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Hero Section Settings</h2>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Subtitle</label>
              <input
                type="text"
                className="admin-editor__input"
                value={heroData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Title</label>
              <input
                type="text"
                className="admin-editor__input"
                value={heroData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Description</label>
              <textarea
                className="admin-editor__textarea"
                value={heroData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description"
                rows={4}
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Main Image (Recommended size: 600x600px)</label>
              <div className="admin-editor__file-upload">
                <input
                  type="file"
                  id="mainImage"
                  className="admin-editor__file-input"
                  accept="image/*"
                  onChange={handleMainImageChange}
                />
                <label htmlFor="mainImage" className="admin-editor__file-label">
                  <i className="fa-solid fa-upload"></i> Choose Main Image
                </label>
                <p className="admin-editor__help-text">
                  This is the main image shown in the quote overview section.
                </p>
              </div>

              {mainImagePreview && (
                <div className="admin-editor__image-preview">
                  <Image
                    src={mainImagePreview}
                    alt="Main Image Preview"
                    width={300}
                    height={300}
                    style={{ objectFit: "contain", maxWidth: "100%", borderRadius: "4px" }}
                  />
                </div>
              )}
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Decorative Image (Recommended size: 300x300px)</label>
              <div className="admin-editor__file-upload">
                <input
                  type="file"
                  id="decorativeImage"
                  className="admin-editor__file-input"
                  accept="image/*"
                  onChange={handleDecorativeImageChange}
                />
                <label htmlFor="decorativeImage" className="admin-editor__file-label">
                  <i className="fa-solid fa-upload"></i> Choose Decorative Image
                </label>
                <p className="admin-editor__help-text">
                  This is the decorative animation image shown in the quote overview section.
                </p>
              </div>

              {decorativeImagePreview && (
                <div className="admin-editor__image-preview">
                  <Image
                    src={decorativeImagePreview}
                    alt="Decorative Image Preview"
                    width={150}
                    height={150}
                    style={{ objectFit: "contain", maxWidth: "100%", borderRadius: "4px" }}
                  />
                </div>
              )}
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

        .admin-editor__file-upload {
          margin-bottom: 16px;
        }

        .admin-editor__file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .admin-editor__file-label {
          display: inline-block;
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .admin-editor__file-label:hover {
          background-color: #e2e8f0;
        }

        .admin-editor__help-text {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .admin-editor__image-preview {
          margin-top: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          background-color: #f8fafc;
          max-width: 100%;
        }
      `}</style>
    </AdminLayout>
  );
};

export default QuoteHeroEditor;
