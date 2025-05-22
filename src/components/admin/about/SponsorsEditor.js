import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const SponsorsEditor = ({ data = {}, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  const editorData = {
    ...data,
    logos: [
      ...data.logos
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
    formData.append('directory', 'images/sponsor');
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.filePath) {
        const newLogos = [...editorData.logos];
        newLogos[index] = result.filePath;
        
        onChange({
          ...editorData,
          logos: newLogos
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleAddLogo = () => {
    if (!onChange) return;
    
    onChange({
      ...editorData,
      logos: [...editorData.logos, "/images/sponsor/one.png"]
    });
  };

  const handleRemoveLogo = (index) => {
    if (!onChange || editorData.logos.length <= 1) return;
    
    const newLogos = [...editorData.logos];
    newLogos.splice(index, 1);
    
    onChange({
      ...editorData,
      logos: newLogos
    });
  };

  return (
    <div className="sponsors-editor">
      <div className="sponsors-editor__form">
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
          <div className="logos-header">
            <label>Sponsor Logos</label>
            <button 
              type="button" 
              className="btn btn-sm btn-primary"
              onClick={handleAddLogo}
            >
              Add Logo
            </button>
          </div>
          
          <div className="logos-grid">
            {editorData.logos.map((logo, index) => (
              <div key={index} className="logo-editor">
                <div className="logo-editor__header">
                  <h4>Logo {index + 1}</h4>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveLogo(index)}
                  >
                    Remove
                  </button>
                </div>
                
                <div className="logo-preview">
                  <ImageWithFallback 
                    src={logo} 
                    alt={`Logo ${index + 1}`} 
                    width={150} 
                    height={80} 
                  />
                </div>
                <div className="logo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="form-control-file"
                  />
                  {uploadingImage === index && <span>Uploading...</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .sponsors-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .sponsors-editor__form {
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
        
        .logos-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .logos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }
        
        .logo-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
        }
        
        .logo-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .logo-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .logo-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80px;
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
          .logos-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SponsorsEditor;
