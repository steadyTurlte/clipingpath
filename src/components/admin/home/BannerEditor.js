import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const BannerEditor = ({ data = {}, onChange, preview }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  const editorData = {
    ...data,
    images: {
      ...(data?.images || {}),
      smallImages: [
        ...data.images.smallImages
      ]
    }
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleImageChange = async (field, e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(field);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', 'images/banner');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();

      // Check for filePath property
      if (!result.filePath) {
        throw new Error('No file path returned from server');
      }

      // Add a timestamp to the image URL to force a refresh
      const imageUrl = `${result.filePath}`;

      if (field === 'main') {
        // Use functional update to ensure we're working with the latest state
        onChange(prevData => {
          return {
            ...prevData,
            images: {
              ...prevData.images,
              [field]: imageUrl
            }
          };
        });
      } else if (field.startsWith('smallImage')) {
        const index = parseInt(field.replace('smallImage', ''), 10);

        // Use functional update to ensure we're working with the latest state
        onChange(prevData => {
          const newSmallImages = [...prevData.images.smallImages];
          newSmallImages[index] = imageUrl;

          return {
            ...prevData,
            images: {
              ...prevData.images,
              smallImages: newSmallImages
            }
          };
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', error.message);
      alert(`Failed to upload image: ${error.message}. Please try again.`);
    } finally {
      setUploadingImage(null);
    }
  };

  if (preview) {
    return (
      <div className="banner-preview">
        <div className="banner-preview__content">
          <h3 className="banner-preview__subtitle">{editorData.subtitle}</h3>
          <h2 className="banner-preview__title">{editorData.title}</h2>
          {/* Button preview removed as per requirements */}
        </div>

        <div className="banner-preview__images">
          <div className="banner-preview__main-image">
            {editorData.images.main && (
              <ImageWithFallback
                src={editorData.images.main}
                alt="Banner Main"
                width={200}
                height={150}
              />
            )}
          </div>

          <div className="banner-preview__small-images">
            {editorData.images.smallImages.map((img, index) => (
              <div key={index} className="banner-preview__small-image">
                <ImageWithFallback
                  src={img}
                  alt={`Small Image ${index + 1}`}
                  width={50}
                  height={50}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="banner-editor">
      <div className="banner-editor__form">
        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={editorData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={editorData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <div className="banner-editor__images">
        <h3 className="banner-editor__images-title">Banner Images</h3>

        <div className="banner-editor__image-group">
          <label>Main Image</label>
          <div className="banner-editor__image-preview">
            {editorData.images.main && (
              <ImageWithFallback
                src={editorData.images.main}
                alt="Banner Main"
                width={200}
                height={150}
              />
            )}
          </div>
          <div className="banner-editor__image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange('main', e)}
              className="form-control-file"
            />
            {uploadingImage === 'main' && <span>Uploading...</span>}
          </div>
          <div className="banner-editor__image-help">
            <p className="banner-editor__help-text">
              <strong>Recommended size:</strong> 1920x1080px
            </p>
            <p className="banner-editor__help-text">
              <strong>Image types:</strong> JPEG, PNG, WEBP
            </p>
          </div>
        </div>



        <h4 className="banner-editor__small-images-title">Small Images</h4>

        <div className="banner-editor__small-images">
          {editorData.images.smallImages.map((img, index) => (
            <div key={index} className="banner-editor__small-image-group">
              <label>Small Image {index + 1}</label>
              <div className="banner-editor__image-preview">
                <ImageWithFallback
                  src={img}
                  alt={`Small Image ${index + 1}`}
                  width={100}
                  height={100}
                />
              </div>
              <div className="banner-editor__image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(`smallImage${index}`, e)}
                  className="form-control-file"
                />
                {uploadingImage === `smallImage${index}` && <span>Uploading...</span>}
              </div>
              <div className="banner-editor__image-help">
                <p className="banner-editor__help-text">
                  <strong>Recommended size:</strong> 400x400px
                </p>
                <p className="banner-editor__help-text">
                  <strong>Image types:</strong> JPEG, PNG, WEBP
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .banner-editor {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .banner-editor__form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-control {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .banner-editor__images {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-editor__images-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .banner-editor__image-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .banner-editor__image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100px;
        }

        .banner-editor__small-images-title {
          font-size: 14px;
          font-weight: 600;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .banner-editor__small-images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .banner-editor__small-image-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-control-file {
          font-size: 14px;
        }

        /* Preview Styles */
        .banner-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-preview__content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .banner-preview__subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }

        .banner-preview__title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        /* Button styles removed as per requirements */

        .banner-preview__images {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .banner-preview__main-image {
          flex: 1;
        }

        .banner-preview__small-images {
          display: flex;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .banner-editor {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BannerEditor;
