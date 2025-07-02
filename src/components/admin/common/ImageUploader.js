import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

/**
 * A reusable image uploader component with preview and upload functionality
 * @param {Object} props - Component props
 * @param {string} props.currentImage - The current image URL
 * @param {Function} props.onImageUpload - Callback when image is uploaded (receives URL and publicId)
 * @param {string} [props.folder='uploads'] - The folder to upload to
 * @param {string} [props.label='Upload Image'] - Label for the uploader
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.accept='image/*'] - Accepted file types
 * @param {number} [props.maxSize=5] - Max file size in MB
 * @param {string} [props.helpText=''] - Help text to display below the uploader
 * @param {Object} [props.style={}] - Additional styles for the container
 * @param {boolean} [props.required=false] - Whether the field is required
 */
const ImageUploader = ({
  currentImage = '',
  onImageUpload,
  folder = 'uploads',
  label = 'Upload Image',
  className = '',
  accept = 'image/*',
  maxSize = 5, // in MB
  helpText = '',
  style = {},
  required = false
}) => {
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset previous errors
    setError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      toast.error('Invalid file type');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Image size should be less than ${maxSize}MB`);
      toast.error(`File too large (max ${maxSize}MB)`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload the file
    try {
      await uploadFile(file);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
      toast.error('Upload failed');
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.path || data.url || data.secure_url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from server');
      }
      
      // Update preview with the final URL
      setPreview(imageUrl);
      
      // Notify parent component
      if (onImageUpload) {
        onImageUpload(imageUrl, data.public_id);
      }
      
      toast.success('Image uploaded successfully');
      return { url: imageUrl, publicId: data.public_id };
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
      toast.error(error.message || 'Upload failed');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Handle image load error
  const handleImageError = (e) => {
    console.error('Error loading image:', preview);
    e.target.src = '/images/placeholder.png';
  };

  // Check if preview is a valid URL or data URL
  const isValidImage = preview && 
    (typeof preview === 'string') && 
    (preview.startsWith('http') || preview.startsWith('data:image') || preview.startsWith('/'));

  return (
    <div className={`image-uploader ${className}`} style={style}>
      {label && (
        <label className="image-uploader-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div 
        className={`preview-container ${uploading ? 'uploading' : ''} ${error ? 'has-error' : ''}`} 
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {isValidImage ? (
          <div className="image-wrapper">
            <Image 
              src={preview} 
              alt="Preview" 
              className="preview-image"
              width={200}
              height={150}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                objectFit: 'contain',
                width: 'auto',
                height: 'auto'
              }}
              onError={handleImageError}
              unoptimized={preview.startsWith('blob:')}
            />
          </div>
        ) : (
          <div className="empty-preview">
            <span>Click to upload image</span>
          </div>
        )}
        
        {uploading && (
          <div className="uploading-overlay">
            <div className="uploading-spinner"></div>
            <span>Uploading...</span>
          </div>
        )}
      </div>
      
      <div className="upload-controls">
        <button 
          type="button" 
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="browse-button"
        >
          {uploading ? 'Uploading...' : 'Choose File'}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {error && <div className="error-message">{error}</div>}
        {helpText && <div className="help-text">{helpText}</div>}
      </div>

      <style jsx>{`
        .image-uploader {
          margin: 10px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        .image-uploader-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #333;
        }
        
        .required {
          color: #e53e3e;
          margin-left: 4px;
        }
        
        .preview-container {
          width: 100%;
          min-height: 150px;
          max-height: 300px;
          border: 2px dashed #ddd;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          background: #f9f9f9;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        
        .preview-container:hover {
          border-color: #bbb;
        }
        
        .preview-container.uploading {
          opacity: 0.7;
          cursor: wait;
        }
        
        .preview-container.has-error {
          border-color: #e53e3e;
        }
        
        .image-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }
        
        .empty-preview {
          color: #666;
          text-align: center;
          padding: 20px;
        }
        
        .uploading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .uploading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        
        .browse-button {
          padding: 8px 16px;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .browse-button:hover:not(:disabled) {
          background: #2c5282;
        }
        
        .browse-button:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #e53e3e;
          font-size: 12px;
          margin-top: 6px;
        }
        
        .help-text {
          color: #718096;
          font-size: 12px;
          margin-top: 6px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

ImageUploader.propTypes = {
  currentImage: PropTypes.string,
  onImageUpload: PropTypes.func.isRequired,
  folder: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  helpText: PropTypes.string,
  style: PropTypes.object,
  required: PropTypes.bool
};

export default ImageUploader;
