import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';

const AboutOverviewEditor = () => {
  const [overviewData, setOverviewData] = useState({
    images: [],
    title: '',
    description: '',
    mission: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the overview data when the component mounts
    const fetchOverviewData = async () => {
      try {
        const response = await fetch('/api/content/about?section=overview');
        const data = await response.json();
        setOverviewData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overview data:', error);
        toast.error('Failed to load overview data');
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const handleTitleChange = (e) => {
    setOverviewData({
      ...overviewData,
      title: e.target.value
    });
  };

  const handleDescriptionChange = (e) => {
    setOverviewData({
      ...overviewData,
      description: e.target.value
    });
  };

  const handleMissionChange = (e) => {
    setOverviewData({
      ...overviewData,
      mission: e.target.value
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...overviewData.images];
    updatedImages[index] = value;

    setOverviewData({
      ...overviewData,
      images: updatedImages
    });
  };

  const [uploadingImage, setUploadingImage] = useState(null);

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(index);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', 'images/about');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.filePath) {
        throw new Error('No file path returned from server');
      }

      // Update the image URL in the state
      const updatedImages = [...overviewData.images];
      updatedImages[index] = result.filePath;

      setOverviewData({
        ...overviewData,
        images: updatedImages
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/about?section=overview', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(overviewData)
      });

      if (response.ok) {
        // Set the inline success message
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Overview section. Please try again.');
      }
    } catch (error) {
      console.error('Error saving overview data:', error);
      setError('Failed to save Overview section. Please try again.');
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
        <title>Edit About Overview | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit About Overview</h1>
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
            <p>Overview section saved successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Overview Content</h2>
            <div className="admin-editor__field">
              <label htmlFor="title" className="admin-editor__label">Title</label>
              <input
                type="text"
                id="title"
                className="admin-editor__input"
                value={overviewData.title}
                onChange={handleTitleChange}
                placeholder="Enter overview title"
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="description" className="admin-editor__label">Description</label>
              <textarea
                id="description"
                className="admin-editor__textarea"
                value={overviewData.description}
                onChange={handleDescriptionChange}
                placeholder="Enter overview description"
                rows={4}
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="mission" className="admin-editor__label">Our Mission</label>
              <textarea
                id="mission"
                className="admin-editor__textarea"
                value={overviewData.mission}
                onChange={handleMissionChange}
                placeholder="Enter mission statement"
                rows={4}
              />
              <p className="admin-editor__help-text">
                This text appears under the &quot;Our Mission&quot; heading in the overview section.
              </p>
            </div>
          </div>

          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Overview Images</h2>

            <div className="admin-editor__image-help">
              <p className="admin-editor__help-text">
                <strong>Recommended size:</strong> 400x300px
              </p>
              <p className="admin-editor__help-text">
                <strong>Image types:</strong> JPEG, PNG, WEBP
              </p>
            </div>

            {overviewData.images.map((image, index) => (
              <div key={index} className="admin-editor__image-field">
                <div className="admin-editor__field">
                  <label className="admin-editor__label">Image {index + 1}</label>
                  <div className="admin-editor__input-group">
                    <input
                      type="text"
                      className="admin-editor__input"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL"
                    />
                    <div className="admin-editor__upload-wrapper">
                      <label className="admin-editor__upload-button">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          className="admin-editor__file-input"
                        />
                        {uploadingImage === index ? 'Uploading...' : 'Upload'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="admin-editor__image-preview">
                  {image && (
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="admin-editor__preview-img"
                      width={100}
                      height={100}
                      style={{ objectFit: 'contain' }}
                      unoptimized={true}
                    />
                  )}
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

        .admin-editor__input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
          resize: vertical;
        }

        .admin-editor__image-field {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .admin-editor__field {
          flex: 1;
        }

        .admin-editor__image-preview {
          width: 100px;
          height: 100px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .admin-editor__preview-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .admin-editor__input-group {
          display: flex;
          gap: 8px;
        }

        .admin-editor__input {
          flex: 1;
        }

        .admin-editor__upload-wrapper {
          flex-shrink: 0;
        }

        .admin-editor__upload-button {
          display: inline-block;
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-editor__file-input {
          display: none;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AboutOverviewEditor;
