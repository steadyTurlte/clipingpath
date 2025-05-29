import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const AboutEditor = ({ data = {}, onChange, preview }) => {
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
        onChange({
          ...editorData,
          image: result.filePath
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  if (preview) {
    return (
      <div className="about-preview">
        <div className="about-preview__content">
          <h3 className="about-preview__subtitle">{editorData.subtitle}</h3>
          <h2 className="about-preview__title">{editorData.title}</h2>
          <p className="about-preview__description">{editorData.description}</p>
          <p className="about-preview__additional-text">{editorData.additionalText}</p>
          <p className="about-preview__price-tag">{editorData.priceTag}</p>
          <div className="about-preview__buttons">
            {editorData.buttons.map((button, index) => (
              <div key={index} className={`about-preview__button about-preview__button--${button.type}`}>
                {button.text} → {button.link}
              </div>
            ))}
          </div>
        </div>

        <div className="about-preview__image">
          {editorData.image && (
            <ImageWithFallback
              src={editorData.image}
              alt="About Image"
              width={200}
              height={150}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="about-editor">
      <div className="about-editor__form">
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
            rows={2}
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
      </div>

      <div className="about-editor__image-section">
        <h3 className="about-editor__image-title">About Image</h3>

        <div className="about-editor__image-preview">
          {editorData.image && (
            <ImageWithFallback
              src={editorData.image}
              alt="About Image"
              width={300}
              height={200}
            />
          )}
        </div>

        <div className="about-editor__image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control-file"
          />
          {uploadingImage && <span>Uploading...</span>}
        </div>

        <div className="about-editor__image-help">
          <p className="form-text">
            <strong>Recommended size:</strong> 600x400px
          </p>
          <p className="form-text">
            <strong>Image types:</strong> JPEG, PNG, WEBP
          </p>
        </div>
      </div>

      <style jsx>{`
        .about-editor {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .about-editor__form {
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
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

        .about-editor__image-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .about-editor__image-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .about-editor__image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
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

        /* Preview Styles */
        .about-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .about-preview__content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .about-preview__subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }

        .about-preview__title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .about-preview__description,
        .about-preview__additional-text {
          margin: 8px 0;
          font-size: 14px;
        }

        .about-preview__price-tag {
          font-weight: 600;
          color: #4569e7;
        }

        .about-preview__buttons {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .about-preview__button {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
        }

        .about-preview__button--primary {
          background-color: #4569e7;
          color: white;
        }

        .about-preview__button--secondary {
          background-color: #e2e8f0;
          color: #1e293b;
        }

        @media (max-width: 768px) {
          .about-editor {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutEditor;
