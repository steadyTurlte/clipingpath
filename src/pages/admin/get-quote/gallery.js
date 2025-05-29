import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadImage } from '@/utils/imageUtils';

const QuoteGalleryEditor = () => {
  const [galleryData, setGalleryData] = useState({
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch('/api/content/get-quote?section=gallery');
        if (response.ok) {
          const data = await response.json();
          setGalleryData({
            images: data.images || []
          });
        } else {
          setError('Failed to load gallery data');
        }
      } catch (error) {
        console.error('Error fetching gallery data:', error);
        setError('Error loading gallery data');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const handleInputChange = (field, value) => {
    setGalleryData({
      ...galleryData,
      [field]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddImage = async () => {
    if (!imageFile) {
      setError('Please select an image to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const imagePath = await uploadImage(imageFile, 'gallery');

      const newImage = {
        id: Date.now().toString(),
        src: imagePath,
        alt: 'Gallery Image',
        category: 'general'
      };

      if (currentImageIndex !== null) {
        // Update existing image
        const updatedImages = [...galleryData.images];
        updatedImages[currentImageIndex] = {
          ...updatedImages[currentImageIndex],
          src: imagePath
        };

        setGalleryData({
          ...galleryData,
          images: updatedImages
        });
      } else {
        // Add new image
        setGalleryData({
          ...galleryData,
          images: [...galleryData.images, newImage]
        });
      }

      // Reset form
      setImageFile(null);
      setImagePreview('');
      setCurrentImageIndex(null);

    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateImageField = (index, field, value) => {
    const updatedImages = [...galleryData.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };

    setGalleryData({
      ...galleryData,
      images: updatedImages
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...galleryData.images];
    updatedImages.splice(index, 1);

    setGalleryData({
      ...galleryData,
      images: updatedImages
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/get-quote?section=gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(galleryData)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save gallery section');
      }
    } catch (error) {
      console.error('Error saving gallery data:', error);
      setError('Failed to save gallery section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Quote Gallery | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/get-quote" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Edit Quote Gallery</h1>
          </div>

          <button
            className="admin-page__save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {saveSuccess && (
          <div className="admin-page__success">
            <i className="fa-solid fa-check-circle"></i> Gallery settings saved successfully!
          </div>
        )}

        {error && (
          <div className="admin-page__error">
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="admin-page__content">


          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Contact Form Gallery Images</h2>
              <p className="admin-page__description">
                Add up to 6 images to display alongside the contact form (3 for the left side, 3 for the right side).
              </p>
            </div>

            <div className="admin-page__upload-section">
              <div className="admin-page__field">
                <label className="admin-page__label">Upload Image</label>
                <div className="admin-page__file-upload">
                  <input
                    type="file"
                    id="galleryImage"
                    className="admin-page__file-input"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="galleryImage" className="admin-page__file-label">
                    <i className="fa-solid fa-upload"></i> Choose Image
                  </label>
                </div>
                <div className="admin-page__image-help">
                  <p className="admin-page__help-text">
                    <strong>Recommended size:</strong> 400x300px
                  </p>
                  <p className="admin-page__help-text">
                    <strong>Image types:</strong> JPEG, PNG, WEBP
                  </p>
                </div>

                {imagePreview && (
                  <div className="admin-page__image-preview">
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      width={200}
                      height={150}
                      style={{ objectFit: "contain", maxWidth: "100%", borderRadius: "4px" }}
                    />
                  </div>
                )}
              </div>

              <button
                className="admin-page__upload-button"
                onClick={handleAddImage}
                disabled={uploading || !imageFile}
              >
                {uploading ? 'Uploading...' : currentImageIndex !== null ? 'Update Image' : 'Add Image'}
              </button>
            </div>

            <div className="admin-page__gallery">
              {galleryData.images.length === 0 ? (
                <div className="admin-page__message">
                  <p>No gallery images added yet. Upload images to get started.</p>
                </div>
              ) : (
                <div className="admin-page__gallery-grid">
                  {galleryData.images.map((image, index) => (
                    <div key={image.id || index} className="admin-page__gallery-item">
                      <div className="admin-page__gallery-image">
                        <Image
                          src={image.src}
                          alt={image.alt || 'Gallery Image'}
                          width={200}
                          height={150}
                          style={{ objectFit: "cover", width: "100%", height: "auto", borderRadius: "4px 4px 0 0" }}
                        />
                      </div>
                      <div className="admin-page__gallery-details">
                        <div className="admin-page__field">
                          <label className="admin-page__label">Alt Text</label>
                          <input
                            type="text"
                            className="admin-page__input"
                            value={image.alt || ''}
                            onChange={(e) => handleUpdateImageField(index, 'alt', e.target.value)}
                            placeholder="Enter alt text"
                          />
                        </div>
                        <div className="admin-page__field">
                          <label className="admin-page__label">Category</label>
                          <input
                            type="text"
                            className="admin-page__input"
                            value={image.category || ''}
                            onChange={(e) => handleUpdateImageField(index, 'category', e.target.value)}
                            placeholder="Enter category"
                          />
                        </div>
                        <div className="admin-page__gallery-actions">
                          <button
                            className="admin-page__edit-button"
                            onClick={() => {
                              setCurrentImageIndex(index);
                              setImagePreview(image.src);
                            }}
                          >
                            <i className="fa-solid fa-pen"></i> Edit
                          </button>
                          <button
                            className="admin-page__remove-button"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <i className="fa-solid fa-trash"></i> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
        }

        .admin-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-page__title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-page__back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: #f1f5f9;
          color: #1e293b;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .admin-page__back-link:hover {
          background-color: #e2e8f0;
        }

        .admin-page__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-page__save-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .admin-page__save-button:hover:not(:disabled) {
          background-color: #3b5bd9;
        }

        .admin-page__save-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .admin-page__success {
          padding: 12px 16px;
          background-color: #dcfce7;
          color: #166534;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-page__error {
          padding: 12px 16px;
          background-color: #fee2e2;
          color: #b91c1c;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-page__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .admin-page__section {
          margin-bottom: 32px;
        }

        .admin-page__section-header {
          margin-bottom: 16px;
        }

        .admin-page__section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-page__description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-page__field {
          margin-bottom: 16px;
        }

        .admin-page__label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .admin-page__input,
        .admin-page__textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-page__textarea {
          resize: vertical;
        }

        .admin-page__file-upload {
          margin-bottom: 16px;
        }

        .admin-page__file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .admin-page__file-label {
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

        .admin-page__file-label:hover {
          background-color: #e2e8f0;
        }

        .admin-page__image-preview {
          margin-top: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          background-color: #f8fafc;
          max-width: 100%;
        }

        .admin-page__upload-section {
          margin-bottom: 24px;
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .admin-page__upload-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .admin-page__upload-button:hover:not(:disabled) {
          background-color: #3b5bd9;
        }

        .admin-page__upload-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .admin-page__message {
          padding: 16px;
          background-color: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 4px;
          text-align: center;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-page__gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .admin-page__gallery-item {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          background-color: #f8fafc;
        }

        .admin-page__gallery-details {
          padding: 16px;
        }

        .admin-page__gallery-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .admin-page__edit-button {
          padding: 6px 12px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .admin-page__edit-button:hover {
          background-color: #e2e8f0;
        }

        .admin-page__remove-button {
          padding: 6px 12px;
          background-color: #fee2e2;
          color: #b91c1c;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .admin-page__remove-button:hover {
          background-color: #fecaca;
        }
      `}</style>
    </AdminLayout>
  );
};

export default QuoteGalleryEditor;