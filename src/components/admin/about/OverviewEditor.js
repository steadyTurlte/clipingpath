import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const OverviewEditor = ({ data = {}, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  const editorData = {
    ...data,
    images: [
      ...data.images
    ]
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleImageUpload = async (index, e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(index);

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
        // Add a timestamp to the image URL to force a refresh
        const imageUrl = `${result.filePath}?t=${Date.now()}`;

        // Use functional update to ensure we're working with the latest state
        onChange(prevData => {
          const newImages = [...prevData.images];
          newImages[index] = imageUrl;

          return {
            ...prevData,
            images: newImages
          };
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <div className="overview-editor">
      <div className="overview-editor__form">
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

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={editorData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="form-control"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Images</label>
          <div className="overview-images">
            <div className="overview-image-editor">
              <label>Image One</label>
              <div className="image-preview">
                <ImageWithFallback
                  src={editorData.images[0]}
                  alt="Overview Image 1"
                  width={300}
                  height={200}
                />
              </div>
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(0, e)}
                  className="form-control-file"
                />
                {uploadingImage === 0 && <span>Uploading...</span>}
              </div>
            </div>

            <div className="overview-image-editor">
              <label>Image Two</label>
              <div className="image-preview">
                <ImageWithFallback
                  src={editorData.images[1]}
                  alt="Overview Image 2"
                  width={300}
                  height={200}
                />
              </div>
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(1, e)}
                  className="form-control-file"
                />
                {uploadingImage === 1 && <span>Uploading...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .overview-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .overview-editor__form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .form-control {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .overview-images {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .overview-image-editor {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .overview-images {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OverviewEditor;
