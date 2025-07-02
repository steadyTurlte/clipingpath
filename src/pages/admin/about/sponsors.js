import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/common/ImageUploader';
import { toast } from 'react-toastify';

const AboutSponsorsEditor = () => {
  const [sponsorsData, setSponsorsData] = useState({
    title: '',
    logos: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [pendingImages, setPendingImages] = useState({});

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

  // Handle logo upload completion
  const handleLogoUpload = (index, imageUrl, publicId) => {
    if (!imageUrl) return;
    
    setSponsorsData(prev => {
      const updatedLogos = [...prev.logos];
      updatedLogos[index] = imageUrl;
      
      return {
        ...prev,
        logos: updatedLogos
      };
    });
    
    // Also update the logo in the local state immediately
    setLogos(prev => {
      const newLogos = [...prev];
      newLogos[index] = imageUrl;
      return newLogos;
    });
  };

  // Handle logo removal
  const handleRemoveLogo = (index) => {
    setSponsorsData(prev => {
      const updatedLogos = [...prev.logos];
      updatedLogos.splice(index, 1);
      
      return {
        ...prev,
        logos: updatedLogos
      };
    });
    
    // Also update the local state immediately
    setLogos(prev => {
      const newLogos = [...prev];
      newLogos.splice(index, 1);
      return newLogos;
    });
  };
  
  // Add a new logo slot
  const handleAddLogo = () => {
    setSponsorsData(prev => ({
      ...prev,
      logos: [...prev.logos, '']
    }));
    
    // Also update the local state
    setLogos(prev => [...prev, '']);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Filter out any empty logo entries and ensure they're strings
      const validLogos = sponsorsData.logos
        .filter(logo => {
          if (!logo) return false;
          if (typeof logo === 'string') return logo.trim() !== '';
          return false;
        })
        .map(logo => logo.trim());
      
      if (validLogos.length === 0) {
        toast.warning('Please add at least one logo');
        return;
      }
      
      // Prepare data to save
      const dataToSave = {
        title: sponsorsData.title.trim(),
        logos: validLogos
      };

      const response = await fetch('/api/content/about?section=sponsors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        setSaveSuccess(true);
        // Update local state with the saved data
        setSponsorsData(prev => ({
          ...prev,
          logos: validLogos
        }));
        
        // Show success message
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
              <h3 className="admin-editor__section-title">Sponsor Logos</h3>
              <button
                type="button"
                onClick={handleAddLogo}
                className="add-logo"
                disabled={saving}
                style={{
                  background: '#3182ce',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginTop: '20px',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
              >
                <span>+</span> Add Logo
              </button>
            </div>
            <div className="admin-editor__sponsors-help">
              <p className="admin-editor__help-text">
                <strong>Accepted formats:</strong> JPEG, PNG, GIF, WEBP, SVG (max 5MB)
              </p>
              <p className="admin-editor__help-text">
                <strong>Recommended ratio:</strong> 3:2
              </p>
            </div>
            <div className="logo-grid">
              {sponsorsData.logos.map((logo, index) => (
                <div key={index} className="logo-item">
                  <ImageUploader
                    currentImage={logo}
                    onImageUpload={(url) => handleLogoUpload(index, url)}
                    folder="sponsors"
                    label={`Logo ${index + 1}`}
                    helpText="Recommended size: 200x100px"
                    maxSize={2} // 2MB
                    required
                    style={{ marginBottom: '10px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLogo(index)}
                    className="remove-logo"
                    disabled={saving}
                    style={{
                      background: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '100%',
                      marginTop: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c53030'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#e53e3e'}
                  >
                    Remove Logo
                  </button>
                </div>
              ))}
              
              {sponsorsData.logos.length === 0 && (
                <div className="admin-editor__no-logos" style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '20px',
                  color: '#666',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginTop: '10px'
                }}>
                  <p>No logos added yet. Click &quot;Add Logo&quot; to get started.</p>
                </div>
              )}
            </div>
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

        .logo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .logo-item {
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .logo-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .admin-editor__logo-uploader-container {
          position: relative;
          margin-bottom: 12px;
        }
        
        .admin-editor__logo-uploader {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          background-color: #f8fafc;
        }
        
        .admin-editor__logo-uploader .image-uploader__preview {
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          background-color: white;
          border: 1px dashed #cbd5e1;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .admin-editor__logo-uploader .image-uploader__preview-img {
          max-width: 100%;
          max-height: 120px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        
        .admin-editor__uploading-indicator {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          padding: 4px 0;
          font-size: 12px;
          border-radius: 4px;
          z-index: 2;
        }
        
        .admin-editor__logo-uploader-container {
          position: relative;
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
