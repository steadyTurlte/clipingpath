import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/common/ImageUploader';
import { toast } from 'react-toastify';
import { deleteImage } from '@/utils/imageUtils';

const AboutSponsorsEditor = () => {
  const [sponsorsData, setSponsorsData] = useState({
    title: '',
    logos: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pendingImages, setPendingImages] = useState({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);

  // Create refs for image uploaders
  const imageUploaderRefs = useRef({});

  useEffect(() => {
    // Fetch the sponsors data when the component mounts
    const fetchSponsorsData = async () => {
      try {
        const response = await fetch('/api/content/about?section=sponsors');
        const data = await response.json();
        setSponsorsData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sponsors data:', error);
        toast.error('Failed to load sponsors data');
        setLoading(false);
      }
    };

    fetchSponsorsData();
  }, []);

  const handleTitleChange = (e) => {
    setSponsorsData({
      ...sponsorsData,
      title: e.target.value
    });
  };

  const handleLogoChange = (index, value) => {
    const updatedLogos = [...sponsorsData.logos];
    updatedLogos[index] = value;

    setSponsorsData({
      ...sponsorsData,
      logos: updatedLogos
    });
  };

  const handleAddLogo = () => {
    setSponsorsData({
      ...sponsorsData,
      logos: [...sponsorsData.logos, '']
    });
  };

  const handleRemoveLogo = (index) => {
    const updatedLogos = [...sponsorsData.logos];
    updatedLogos.splice(index, 1);

    setSponsorsData({
      ...sponsorsData,
      logos: updatedLogos
    });
  };

  // Handle image selection (not immediate upload)
  const handleImageSelect = (index, file) => {
    // Store the pending image in state
    setPendingImages({
      ...pendingImages,
      [index]: file
    });
  };

  // Handle image upload when the form is submitted
  const uploadPendingImages = async () => {
    // Check if there are any pending images
    const pendingIndices = Object.keys(pendingImages);
    if (pendingIndices.length === 0) {
      return true; // No images to upload
    }

    setUploadingImages(true);
    let allUploadsSuccessful = true;

    try {
      // Upload all pending images
      for (const indexStr of pendingIndices) {
        const index = parseInt(indexStr);
        const file = pendingImages[index];

        // Get the uploader ref for this index
        const uploaderRef = imageUploaderRefs.current[index];
        if (uploaderRef && uploaderRef.hasSelectedFile()) {
          const imagePath = await uploaderRef.uploadImage();

          if (imagePath) {
            // Update the logos array with the new image path
            handleLogoChange(index, imagePath);
          } else {
            allUploadsSuccessful = false;
          }
        }
      }

      // Clear pending images after upload
      setPendingImages({});
      return allUploadsSuccessful;
    } catch (error) {
      console.error('Error uploading images:', error);
      return false;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // First, upload any pending images
      const uploadsSuccessful = await uploadPendingImages();

      if (!uploadsSuccessful) {
        setError('Some images failed to upload. Please try again.');
        setSaving(false);
        return;
      }

      // Then save the sponsors data
      const response = await fetch('/api/content/about?section=sponsors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sponsorsData)
      });

      if (response.ok) {
        setSaveSuccess(true);
        // Scroll to top to show the success message
        window.scrollTo(0, 0);
        toast.success('Sponsors section saved successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save Sponsors section');
        toast.error('Failed to save Sponsors section');
      }
    } catch (error) {
      console.error('Error saving sponsors data:', error);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Error saving sponsors data');
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
        <title>Edit Sponsors Section | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit Sponsors Section</h1>
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
            <p>Sponsors section saved successfully!</p>
          </div>
        )}

        {error && (
          <div className="admin-editor__error">
            <p>{error}</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Sponsors Section</h2>
            <div className="admin-editor__field">
              <label htmlFor="title" className="admin-editor__label">Title</label>
              <input
                type="text"
                id="title"
                className="admin-editor__input"
                value={sponsorsData.title}
                onChange={handleTitleChange}
                placeholder="Enter title"
              />
            </div>
          </div>

          <div className="admin-editor__section">
            <div className="admin-editor__section-header">
              <h2 className="admin-editor__section-title">Sponsor Logos</h2>
              <button
                type="button"
                className="admin-editor__add-button"
                onClick={handleAddLogo}
              >
                Add Logo
              </button>
            </div>

            <div className="admin-editor__sponsors-help">
              <p className="admin-editor__help-text">
                <strong>Accepted formats:</strong> JPEG, PNG, GIF, WEBP, SVG (max 5MB)
              </p>
              <p className="admin-editor__help-text">
                <strong>Recommended ratio:</strong> 3:2
              </p>
              <p className="admin-editor__help-text">
                Sponsor logos should be transparent PNG files
              </p>
            </div>

            <div className="admin-editor__logos-grid">
              {sponsorsData.logos.map((logo, index) => (
                <div key={index} className="admin-editor__logo-item">
                  <ImageUploader
                    ref={el => imageUploaderRefs.current[index] = el}
                    currentImage={logo}
                    onImageSelect={(file) => handleImageSelect(index, file)}
                    onImageUpload={(path) => handleLogoChange(index, path)}
                    folder="sponsor"
                    label={`Logo ${index + 1}`}
                    uploadOnSelect={false}
                    className="admin-editor__logo-uploader"
                    imageRatio=""
                    helpText=""
                  />
                  <button
                    type="button"
                    className="admin-editor__remove-button"
                    onClick={() => handleRemoveLogo(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {Object.keys(pendingImages).length > 0 && (
              <div className="admin-editor__pending-notice">
                <p>You have {Object.keys(pendingImages).length} pending image changes. Click &quot;Save Changes&quot; to upload and save them.</p>
              </div>
            )}
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

        .admin-editor__sponsors-help {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .admin-editor__help-text {
          margin: 4px 0;
          font-size: 14px;
          color: #64748b;
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

        .admin-editor__logos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .admin-editor__logo-item {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 16px;
        }

        .admin-editor__logo-preview {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          margin-bottom: 12px;
          padding: 8px;
          overflow: hidden;
          position: relative;
        }

        .admin-editor__preview-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .admin-editor__logo-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-editor__image-upload {
          margin-bottom: 8px;
        }

        .admin-editor__file-input {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .admin-editor__uploading {
          display: inline-block;
          font-size: 14px;
          color: #4569e7;
        }

        .admin-editor__pending-notice {
          margin-top: 20px;
          padding: 12px 16px;
          background-color: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 4px;
          color: #92400e;
        }

        .admin-editor__pending-notice p {
          margin: 0;
          font-size: 14px;
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
          width: 100%;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AboutSponsorsEditor;
