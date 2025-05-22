import { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const CtaEditor = ({ data = {}, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const editorData = {
    ...data
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
    formData.append('directory', 'images');
    
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

  return (
    <div className="cta-editor">
      <div className="cta-editor__form">
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
          <label>CTA Image</label>
          <div className="cta-image-preview">
            <ImageWithFallback 
              src={editorData.image} 
              alt="CTA Image" 
              width={400} 
              height={300} 
            />
          </div>
          <div className="cta-image-upload">
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
        .cta-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .cta-editor__form {
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
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .cta-image-preview {
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
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CtaEditor;
