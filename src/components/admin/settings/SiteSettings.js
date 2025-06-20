import React, { useState } from 'react';
import Image from 'next/image';

const SiteSettings = ({ data, onChange, preview }) => {
  const [uploadingImage, setUploadingImage] = useState(null);
  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...data,
      [field]: value
    });
  };

  const handleImageUpload = async (field, e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(field);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.filePath) {
        // Add a timestamp to the image URL to force a refresh
        const imageUrl = `${result.filePath}?t=${Date.now()}`;

        onChange({
          ...data,
          [field]: imageUrl
        });
      }
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      alert(`Failed to upload ${field}. Please try again.`);
    } finally {
      setUploadingImage(null);
    }
  };

  if (preview) {
    return (
      <div className="site-settings-preview">
        <div className="site-settings-preview__item">
          <span className="site-settings-preview__label">Site Title:</span>
          <span className="site-settings-preview__value">{data.title}</span>
        </div>
        <div className="site-settings-preview__item">
          <span className="site-settings-preview__label">Site Description:</span>
          <span className="site-settings-preview__value">{data.description}</span>
        </div>
        <div className="site-settings-preview__item">
          <span className="site-settings-preview__label">Logo:</span>
          <Image
            src={data.logo}
            alt="Logo"
            className="site-settings-preview__logo"
            width={120}
            height={40}
            unoptimized={true}
          />
        </div>
        <div className="site-settings-preview__item">
          <span className="site-settings-preview__label">Light Logo:</span>
          <Image
            src={data.logoLight}
            alt="Light Logo"
            className="site-settings-preview__logo"
            width={120}
            height={40}
            unoptimized={true}
          />
        </div>
        <div className="site-settings-preview__item">
          <span className="site-settings-preview__label">Favicon:</span>
          <Image
            src={data.favicon}
            alt="Favicon"
            className="site-settings-preview__favicon"
            width={32}
            height={32}
            unoptimized={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="site-settings">
      <div className="form-group">
        <label htmlFor="title">Site Title</label>
        <input
          type="text"
          id="title"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="form-control"
          placeholder="Enter the site title"
        />
        <small className="form-text text-muted">
          This will appear in the browser tab and in search results.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="description">Site Description</label>
        <textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="form-control"
          placeholder="Enter the site description"
          rows={3}
        />
        <small className="form-text text-muted">
          This will be used for SEO and may appear in search results.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="logo">Logo</label>
        <div className="image-preview">
          {data.logo && (
            <Image
              src={data.logo}
              alt="Logo"
              width={150}
              height={50}
              unoptimized={true}
            />
          )}
        </div>
        <div className="image-upload-container">
          <input
            type="text"
            id="logo"
            value={data.logo || ''}
            onChange={(e) => handleChange('logo', e.target.value)}
            className="form-control"
            placeholder="Enter the logo URL"
          />
          <div className="image-upload">
            <label htmlFor="logo-upload">Or upload an image:</label>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={(e) => handleImageUpload('logo', e)}
              className="form-control-file"
            />
            {uploadingImage === 'logo' && <span>Uploading...</span>}
          </div>
        </div>
        <small className="form-text text-muted">
          This is the main logo used on light backgrounds.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="logoLight">Light Logo</label>
        <div className="image-preview" style={{ backgroundColor: '#333', padding: '10px' }}>
          {data.logoLight && (
            <Image
              src={data.logoLight}
              alt="Light Logo"
              width={150}
              height={50}
              unoptimized={true}
            />
          )}
        </div>
        <div className="image-upload-container">
          <input
            type="text"
            id="logoLight"
            value={data.logoLight || ''}
            onChange={(e) => handleChange('logoLight', e.target.value)}
            className="form-control"
            placeholder="Enter the light logo URL"
          />
          <div className="image-upload">
            <label htmlFor="logoLight-upload">Or upload an image:</label>
            <input
              type="file"
              id="logoLight-upload"
              accept="image/*"
              onChange={(e) => handleImageUpload('logoLight', e)}
              className="form-control-file"
            />
            {uploadingImage === 'logoLight' && <span>Uploading...</span>}
          </div>
        </div>
        <small className="form-text text-muted">
          This logo is used on dark backgrounds.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="favicon">Favicon</label>
        <div className="image-preview">
          {data.favicon && (
            <Image
              src={data.favicon}
              alt="Favicon"
              width={32}
              height={32}
              unoptimized={true}
            />
          )}
        </div>
        <div className="image-upload-container">
          <input
            type="text"
            id="favicon"
            value={data.favicon || ''}
            onChange={(e) => handleChange('favicon', e.target.value)}
            className="form-control"
            placeholder="Enter the favicon URL"
          />
          <div className="image-upload">
            <label htmlFor="favicon-upload">Or upload an image:</label>
            <input
              type="file"
              id="favicon-upload"
              accept="image/*"
              onChange={(e) => handleImageUpload('favicon', e)}
              className="form-control-file"
            />
            {uploadingImage === 'favicon' && <span>Uploading...</span>}
          </div>
        </div>
        <small className="form-text text-muted">
          This is the small icon that appears in browser tabs.
        </small>
      </div>

      <style jsx>{`
        .site-settings {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-control {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-text {
          font-size: 12px;
          color: #64748b;
        }

        .image-preview {
          margin-bottom: 12px;
          padding: 8px;
          border: 1px dashed #e2e8f0;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
        }

        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-upload {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 8px;
        }

        .image-upload label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .form-control-file {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default SiteSettings;
