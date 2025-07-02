import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/common/ImageUploader';
import { toast } from 'react-toastify';

const AboutCtaEditor = () => {
  const [ctaData, setCtaData] = useState({
    title: '',
    description: '',
    image: '',
    imagePublicId: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the CTA data when the component mounts
    const fetchCtaData = async () => {
      try {
        const response = await fetch('/api/content/about?section=cta');
        const data = await response.json();
        
        // Handle both old and new data formats
        if (data.image && typeof data.image === 'object') {
          // New format with publicId
          setCtaData({
            ...data,
            image: data.image.url || '',
            imagePublicId: data.image.publicId || ''
          });
        } else {
          // Old format or no image
          setCtaData({
            ...data,
            image: data.image || '',
            imagePublicId: data.imagePublicId || ''
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CTA data:', error);
        toast.error('Failed to load CTA data');
        setLoading(false);
      }
    };

    fetchCtaData();
  }, []);

  const handleChange = (field, value) => {
    setCtaData({
      ...ctaData,
      [field]: value
    });
  };

  const handleImageUpload = (imageUrl, publicId) => {
    setCtaData(prevData => ({
      ...prevData,
      image: imageUrl,
      imagePublicId: publicId
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // Prepare data with image object containing both URL and publicId
      const dataToSave = {
        ...ctaData,
        image: {
          url: ctaData.image,
          publicId: ctaData.imagePublicId
        }
      };

      const response = await fetch('/api/content/about?section=cta', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        // Set the inline success message
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save CTA section. Please try again.');
      }
    } catch (error) {
      console.error('Error saving CTA data:', error);
      setError('Failed to save CTA section. Please try again.');
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
        <title>Edit CTA Section | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit CTA Section</h1>
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

        {error && (
          <div className="admin-editor__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-editor__success">
            <p>CTA section saved successfully!</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="admin-editor__success">
            <p>Image uploaded successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Call to Action</h2>
            <div className="admin-editor__field">
              <label htmlFor="title" className="admin-editor__label">Title</label>
              <input
                type="text"
                id="title"
                className="admin-editor__input"
                value={ctaData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="description" className="admin-editor__label">Description</label>
              <textarea
                id="description"
                className="admin-editor__textarea"
                value={ctaData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Background Image</label>
              
              <div className="admin-editor__image-uploader-wrapper">
                <ImageUploader
                  value={ctaData.image}
                  onChange={handleImageUpload}
                  folder="about/cta"
                  width={1920}
                  height={600}
                  className="admin-editor__image-uploader"
                />
              </div>
              
              <div className="admin-editor__image-help">
                <p className="admin-editor__help-text">
                  <strong>Recommended size:</strong> 1920x600px
                </p>
                <p className="admin-editor__help-text">
                  <strong>Image types:</strong> JPEG, PNG, WEBP
                </p>
              </div>
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
        
        .admin-editor__image-uploader-wrapper {
          margin-bottom: 16px;
        }
        
        .admin-editor__image-uploader {
          width: 100%;
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

        .admin-editor__image-preview {
          margin-bottom: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          background-color: #f8fafc;
        }

        .admin-editor__preview-img {
          max-width: 100%;
          max-height: 200px;
          display: block;
          margin: 0 auto;
        }

        .admin-editor__file-input {
          margin-top: 8px;
        }

        .admin-editor__uploading {
          display: inline-block;
          margin-left: 8px;
          font-size: 14px;
          color: #64748b;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AboutCtaEditor;
