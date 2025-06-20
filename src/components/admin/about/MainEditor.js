import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const MainEditor = ({ data = {}, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const editorData = {
    ...data,
    buttons: [
      ...data.buttons
    ]
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };


  const handleImageUpload = async (e) => {
    if (!onChange) return;

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
        // Add a timestamp to the image URL to force a refresh
        const imageUrl = `${result.filePath}?t=${Date.now()}`;

        // Use functional update to ensure we're working with the latest state
        onChange(prevData => {
          return {
            ...prevData,
            image: imageUrl
          };
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="main-editor">
      <div className="main-editor__form">
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

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={editorData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalText">Additional Text</label>
          <textarea
            id="additionalText"
            value={editorData.additionalText}
            onChange={(e) => handleChange('additionalText', e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priceTag">Price Tag</label>
          <input
            type="text"
            id="priceTag"
            value={editorData.priceTag}
            onChange={(e) => handleChange('priceTag', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Main Image</label>
          <div className="main-image-preview">
            <ImageWithFallback
              src={editorData.image}
              alt="Main Image"
              width={300}
              height={300}
            />
          </div>
          <div className="main-image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control-file"
            />
            {uploadingImage && <span>Uploading...</span>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .main-editor__form {
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

        .form-control-static {
          padding: 8px 12px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
          color: #64748b;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .buttons-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .buttons-note {
          color: #64748b;
          font-size: 12px;
          font-style: italic;
        }

        .button-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .button-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .button-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .main-image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          margin-bottom: 8px;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-primary {
          background-color: #4569e7;
          color: white;
        }

        .btn-primary:hover {
          background-color: #3a5bc7;
        }

        .btn-danger {
          background-color: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background-color: #dc2626;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MainEditor;
