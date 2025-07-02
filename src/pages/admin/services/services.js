import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/common/ImageUploader';
import { toast } from 'react-toastify';

const ServicesItemsEditor = () => {
  const [servicesData, setServicesData] = useState([]);
  const [imagePublicIds, setImagePublicIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [serviceAdded, setServiceAdded] = useState(false);
  const [serviceRemoved, setServiceRemoved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the services data when the component mounts
    const fetchServicesData = async () => {
      try {
        const response = await fetch('/api/content/services?section=services');
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Initialize services data and public IDs
          const initialServices = [];
          const initialPublicIds = [];
          
          data.forEach(service => {
            if (service.image && typeof service.image === 'object') {
              initialServices.push({
                ...service,
                image: service.image.url || ''
              });
              initialPublicIds.push(service.image.publicId || '');
            } else {
              initialServices.push({
                ...service,
                image: service.image || ''
              });
              initialPublicIds.push('');
            }
          });
          
          setServicesData(initialServices);
          setImagePublicIds(initialPublicIds);
        } else {
          setServicesData([]);
          setImagePublicIds([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services data:', error);
        setError('Failed to load services data');
        setLoading(false);
      }
    };

    fetchServicesData();
  }, []);

  const handleServiceChange = (index, field, value, publicId = null) => {
    const updatedServices = [...servicesData];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };

    setServicesData(updatedServices);
    
    // Update public ID if provided
    if (publicId !== null && field === 'image') {
      const updatedPublicIds = [...imagePublicIds];
      updatedPublicIds[index] = publicId;
      setImagePublicIds(updatedPublicIds);
    }
  };

  const handleAddService = () => {
    setServicesData([
      ...servicesData,
      {
        id: Date.now(),
        title: '',
        image: '',
        price: '',
        description: '',
        link: 'service-details',
        className: ''
      }
    ]);
    
    // Add an empty public ID for the new service
    setImagePublicIds([...imagePublicIds, '']);

    setServiceAdded(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setServiceAdded(false);
    }, 3000);
  };

  const handleRemoveService = (index) => {
    const updatedServices = [...servicesData];
    updatedServices.splice(index, 1);
    
    const updatedPublicIds = [...imagePublicIds];
    updatedPublicIds.splice(index, 1);

    setServicesData(updatedServices);
    setImagePublicIds(updatedPublicIds);

    setServiceRemoved(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setServiceRemoved(false);
    }, 3000);
  };

  const handleImageUpload = (index, imageUrl, publicId) => {
    // Update the service with the new image URL
    const updatedServices = [...servicesData];
    updatedServices[index] = {
      ...updatedServices[index],
      image: imageUrl
    };
    setServicesData(updatedServices);
    
    // Update the public ID
    const updatedPublicIds = [...imagePublicIds];
    updatedPublicIds[index] = publicId || '';
    setImagePublicIds(updatedPublicIds);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // Prepare data with images including public IDs
      const dataToSave = servicesData.map((service, index) => {
        const serviceData = { ...service };
        
        // Only include image object if there's an image URL
        if (service.image) {
          serviceData.image = {
            url: service.image,
            publicId: imagePublicIds[index] || ''
          };
        } else {
          serviceData.image = '';
        }
        
        return serviceData;
      });

      const response = await fetch('/api/content/services?section=services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Services section');
      }
    } catch (error) {
      console.error('Error saving services data:', error);
      setError('Failed to save Services section');
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
        <title>Edit Services Items | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit Services Items</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/services" className="admin-editor__back-button">
              Back to Services
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
            <p>Services section saved successfully!</p>
          </div>
        )}

        {serviceAdded && (
          <div className="admin-editor__success">
            <p>Service added successfully!</p>
          </div>
        )}

        {serviceRemoved && (
          <div className="admin-editor__success">
            <p>Service removed successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <div className="admin-editor__section-header">
              <h2 className="admin-editor__section-title">Service Items</h2>
              <button
                type="button"
                className="admin-editor__add-button"
                onClick={handleAddService}
              >
                Add Service
              </button>
            </div>

            {servicesData.map((service, index) => (
              <div key={service.id || index} className="admin-editor__service-item">
                <div className="admin-editor__service-header">
                  <h3 className="admin-editor__service-title">Service #{index + 1}</h3>
                  <button
                    type="button"
                    className="admin-editor__remove-button"
                    onClick={() => handleRemoveService(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="admin-editor__service-grid">
                  <div className="admin-editor__field">
                    <label className="admin-editor__label">Title</label>
                    <input
                      type="text"
                      className="admin-editor__input"
                      value={service.title}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                      placeholder="Enter service title"
                    />
                  </div>

                  <div className="admin-editor__field">
                    <label className="admin-editor__label">Price</label>
                    <input
                      type="text"
                      className="admin-editor__input"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      placeholder="Enter price (e.g. $0.39 Only)"
                    />
                  </div>
                </div>

                <div className="admin-editor__field">
                  <label className="admin-editor__label">Description</label>
                  <textarea
                    className="admin-editor__textarea"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    placeholder="Enter service description"
                    rows={3}
                  />
                </div>

                <div className="admin-editor__service-grid">
                  <div className="admin-editor__field">
                    <label className="admin-editor__label">Link</label>
                    <input
                      type="text"
                      className="admin-editor__input"
                      value={service.link}
                      onChange={(e) => handleServiceChange(index, 'link', e.target.value)}
                      placeholder="Enter link (e.g. service-details)"
                    />
                  </div>

                  <div className="admin-editor__field">
                    <label className="admin-editor__label">Class Name</label>
                    <select
                      className="admin-editor__select"
                      value={service.className}
                      onChange={(e) => handleServiceChange(index, 'className', e.target.value)}
                    >
                      <option value="">Select a class</option>
                      <option value="on">Primary (on)</option>
                      <option value="fi">Secondary (fi)</option>
                      <option value="tw">Tertiary (tw)</option>
                      <option value="th">Quaternary (th)</option>
                      <option value="fo">Quinary (fo)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-editor__field">
                  <label className="admin-editor__label">Service Image</label>
                  <div className="admin-editor__image-upload">
                    <ImageUploader
                      currentImage={service.image}
                      onImageSelect={(file) => {
                        const updatedServices = [...servicesData];
                        updatedServices[index] = {
                          ...updatedServices[index],
                          image: URL.createObjectURL(file)
                        };
                        setServicesData(updatedServices);
                      }}
                      onImageUpload={(url, publicId) => handleImageUpload(index, url, publicId)}
                      folder="services/items"
                      label={`Service ${index + 1} Image`}
                      recommendedSize="300x300px"
                      className="admin-editor__image-uploader"
                      oldPublicId={imagePublicIds[index] || ''}
                      uploadOnSelect={true}
                    />
                    {service.image && (
                      <div className="admin-editor__image-preview">
                        <Image
                          src={service.image} 
                          alt={`Preview ${index}`} 
                          width={200}
                          height={200}
                          className="admin-editor__preview-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder-image.png';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="admin-editor__help-text">
                    <strong>Recommended size:</strong> 400x300px
                  </p>
                  <p className="admin-editor__help-text">
                    <strong>Image types:</strong> JPEG, PNG, WEBP
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-editor__image-upload {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .admin-editor__image-preview {
          max-width: 200px;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .admin-editor__preview-image {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .admin-editor__help-text {
          margin: 0.25rem 0;
          color: #64748b;
          font-size: 0.875rem;
        }
        
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
        .admin-editor__success,
        .admin-editor__upload-success {
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

        .admin-editor__success,
        .admin-editor__upload-success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-editor__upload-success {
          padding: 8px 12px;
          margin-top: 8px;
          font-size: 14px;
        }

        .admin-editor__error p,
        .admin-editor__success p,
        .admin-editor__upload-success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-editor__error p::before {
          content: '❌ ';
        }

        .admin-editor__success p::before,
        .admin-editor__upload-success p::before {
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

        .admin-editor__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
        .admin-editor__textarea,
        .admin-editor__select {
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
          margin-bottom: 16px;
          max-width: 200px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .admin-editor__image-upload-wrapper {
          margin-bottom: 16px;
        }
        
        .admin-editor__image-uploader {
          width: 100%;
          max-width: 300px;
        }

        .admin-editor__service-item {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .admin-editor__service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .admin-editor__service-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-editor__service-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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
        }

        @media (max-width: 768px) {
          .admin-editor__service-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default ServicesItemsEditor;
