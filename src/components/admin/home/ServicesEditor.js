import React, { useState } from 'react';
import Image from 'next/image';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const ServicesEditor = ({ data = {}, onChange, preview }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  const editorData = {
    ...data,
    services: [
      ...data.services
    ]
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleServiceChange = (index, field, value) => {
    if (!onChange) return;

    const newServices = [...editorData.services];
    newServices[index] = {
      ...newServices[index],
      [field]: value
    };

    // If updating icon, also update image for compatibility
    if (field === 'icon') {
      newServices[index].image = value;
    }

    // If updating image, also update icon for compatibility
    if (field === 'image') {
      newServices[index].icon = value;
    }

    onChange({
      ...editorData,
      services: newServices
    });
  };

  const handleAddService = () => {
    if (!onChange) return;

    const newService = {
      id: Date.now(),
      title: "New Service",
      icon: "icon-clipping",
      image: "/images/services/slide-one.png", // Include image property
      price: "$0.39 Only", // Include price property
      pricePrefix: "starting at", // Include pricePrefix property
      link: "/services/new-service",
      className: "on" // Include className property
    };

    onChange({
      ...editorData,
      services: [...editorData.services, newService]
    });
  };

  const handleRemoveService = (index) => {
    if (!onChange) return;

    const newServices = [...editorData.services];
    newServices.splice(index, 1);

    onChange({
      ...editorData,
      services: newServices
    });
  };

  const handleImageUpload = async (index, e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(index);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images/services');

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
          const newServices = [...prevData.services];
          newServices[index] = {
            ...newServices[index],
            icon: imageUrl,
            image: imageUrl // Update both icon and image for compatibility
          };

          return {
            ...prevData,
            services: newServices
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

  if (preview) {
    return (
      <div className="services-preview">
        <div className="services-preview__content">
          <h3 className="services-preview__subtitle">{editorData.subtitle}</h3>
          <h2 className="services-preview__title">{editorData.title}</h2>
        </div>

        <div className="services-preview__items">
          {editorData.services.map((service, index) => (
            <div
              key={service.id || index}
              className={`services-preview__item ${service.className || 'on'}`}
            >
              <div className="services-preview__item-icon">
                {service.icon && service.icon.startsWith('/') ? (
                  <ImageWithFallback
                    src={service.icon}
                    alt={service.title}
                    width={40}
                    height={40}
                  />
                ) : (
                  <i className={service.icon}></i>
                )}
              </div>
              <div className="services-preview__item-content">
                <h4>{service.title}</h4>
                <div className="services-preview__item-footer">
                  <span className="services-preview__item-link">{service.link}</span>
                  <span className="services-preview__item-price">
                    {service.pricePrefix || "starting at"} {service.price || "$0.39 Only"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="services-editor">
      <div className="services-editor__form">
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
          <div className="services-header">
            <label>Services</label>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleAddService}
            >
              Add Service
            </button>
          </div>

          {editorData.services.map((service, index) => (
            <div key={service.id || index} className="service-editor">
              <div className="service-editor__header">
                <h4>Service {index + 1}</h4>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveService(index)}
                >
                  Remove
                </button>
              </div>

              <div className="form-group">
                <label htmlFor={`service-title-${index}`}>Title</label>
                <input
                  type="text"
                  id={`service-title-${index}`}
                  value={service.title}
                  onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                  className="form-control"
                />
              </div>



              <div className="form-row">
                <div className="form-group form-group-half">
                  <label htmlFor={`service-link-${index}`}>Link</label>
                  <input
                    type="text"
                    id={`service-link-${index}`}
                    value={service.link}
                    onChange={(e) => handleServiceChange(index, 'link', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group form-group-half">
                  <label htmlFor={`service-price-${index}`}>Price</label>
                  <input
                    type="text"
                    id={`service-price-${index}`}
                    value={service.price || "$0.39 Only"}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    className="form-control"
                    placeholder="e.g., $0.39 Only"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`service-pricePrefix-${index}`}>Price Prefix</label>
                <input
                  type="text"
                  id={`service-pricePrefix-${index}`}
                  value={service.pricePrefix || "starting at"}
                  onChange={(e) => handleServiceChange(index, 'pricePrefix', e.target.value)}
                  className="form-control"
                  placeholder="e.g., starting at, from, only"
                />
                <small className="form-text">Text that appears before the price (e.g., &quot;starting at $0.39&quot;)</small>
              </div>

              <div className="form-group">
                <label htmlFor={`service-className-${index}`}>CSS Class</label>
                <select
                  id={`service-className-${index}`}
                  value={service.className || "on"}
                  onChange={(e) => handleServiceChange(index, 'className', e.target.value)}
                  className="form-control"
                >
                  <option value="on">on (Orange)</option>
                  <option value="fi">fi (Blue)</option>
                  <option value="tw">tw (Green)</option>
                  <option value="th">th (Purple)</option>
                  <option value="fo">fo (Red)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor={`service-icon-${index}`}>Icon</label>
                <div className="form-row">
                  <input
                    type="text"
                    id={`service-icon-${index}`}
                    value={service.icon}
                    onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                    className="form-control"
                    placeholder="icon-name or image path"
                  />
                </div>

                <div className="service-editor__icon-preview">
                  {service.icon && service.icon.startsWith('/') ? (
                    <ImageWithFallback
                      src={service.icon}
                      alt={service.title}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <i className={service.icon} style={{ fontSize: '24px' }}></i>
                  )}
                </div>

                <div className="service-editor__icon-upload">
                  <p className="form-text">Or upload an image to use as icon:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="form-control-file"
                  />
                  {uploadingImage === index && <span>Uploading...</span>}
                  <div className="service-editor__icon-help">
                    <p className="form-text">
                      <strong>Recommended size:</strong> 64x64px
                    </p>
                    <p className="form-text">
                      <strong>Image types:</strong> PNG, SVG (transparent background preferred)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Preview Styles */
        .services-preview {
          padding: 20px;
          background-color: #f8fafc;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .services-preview__content {
          text-align: center;
          margin-bottom: 20px;
        }

        .services-preview__subtitle {
          color: #4569e7;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .services-preview__title {
          font-size: 24px;
          margin-bottom: 16px;
        }

        .services-preview__items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .services-preview__item {
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border-left: 3px solid #f97316;
        }

        .services-preview__item.on { border-left-color: #f97316; }
        .services-preview__item.fi { border-left-color: #3b82f6; }
        .services-preview__item.tw { border-left-color: #10b981; }
        .services-preview__item.th { border-left-color: #8b5cf6; }
        .services-preview__item.fo { border-left-color: #ef4444; }

        .services-preview__item-icon {
          margin-bottom: 12px;
        }

        .services-preview__item-content h4 {
          font-size: 16px;
          margin: 0 0 8px 0;
        }

        .services-preview__item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 12px;
        }

        .services-preview__item-link {
          color: #4569e7;
        }

        .services-preview__item-price {
          font-weight: bold;
          color: #f97316;
        }

        /* Editor Styles */
        .services-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .services-editor__form {
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

        .form-group-half {
          flex: 1;
          min-width: 0;
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

        .form-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          width: 100%;
        }

        .services-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .service-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .service-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .service-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .service-editor__icon-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
          margin: 8px 0;
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
      `}</style>
    </div>
  );
};

export default ServicesEditor;
