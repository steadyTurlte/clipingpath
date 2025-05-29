import React, { useState, useRef } from 'react';

const MediaUploader = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    setProgress(0);
    setUploadSuccess(false);
    setError(null);

    const uploadedFiles = [];
    const totalFiles = files.length;
    let hasErrors = false;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', 'uploads');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();

          uploadedFiles.push({
            name: file.name,
            url: result.filePath,
            size: file.size,
            type: file.type,
            createdAt: new Date().toISOString()
          });
        } else {
          hasErrors = true;
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        hasErrors = true;
      }

      // Update progress
      setProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    setUploading(false);
    setProgress(0);

    if (uploadedFiles.length > 0) {
      if (onUploadComplete) {
        onUploadComplete(uploadedFiles);
      }

      setUploadSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }

    if (hasErrors) {
      setError('Some files could not be uploaded. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="media-uploader">
      {error && (
        <div className="media-uploader__error">
          <p>{error}</p>
        </div>
      )}

      {uploadSuccess && (
        <div className="media-uploader__success">
          <p>Files uploaded successfully!</p>
        </div>
      )}

      <div
        className={`media-uploader__dropzone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="media-uploader__input"
          multiple
          accept="image/*"
        />

        {uploading ? (
          <div className="media-uploader__progress">
            <div className="media-uploader__progress-bar" style={{ width: `${progress}%` }}></div>
            <div className="media-uploader__progress-text">Uploading... {progress}%</div>
          </div>
        ) : (
          <div className="media-uploader__content">
            <div className="media-uploader__icon">
              <i className="fa-solid fa-cloud-upload-alt"></i>
            </div>
            <p className="media-uploader__text">
              Drag and drop files here, or click to browse
            </p>
            <p className="media-uploader__subtext">
              <strong>Recommended size:</strong> Up to 5MB per file
            </p>
            <p className="media-uploader__subtext">
              <strong>Image types:</strong> JPEG, PNG, GIF, SVG, WEBP
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .media-uploader__error,
        .media-uploader__success {
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

        .media-uploader__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .media-uploader__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .media-uploader__error p,
        .media-uploader__success p {
          margin: 0;
          font-weight: 500;
        }

        .media-uploader__error p::before {
          content: '❌ ';
        }

        .media-uploader__success p::before {
          content: '✅ ';
        }

        .media-uploader__dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 2px dashed #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .media-uploader__dropzone.dragging {
          background-color: #eff6ff;
          border-color: #4569e7;
        }

        .media-uploader__dropzone.uploading {
          cursor: default;
        }

        .media-uploader__input {
          display: none;
        }

        .media-uploader__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .media-uploader__icon {
          font-size: 48px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .media-uploader__text {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px;
        }

        .media-uploader__subtext {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .media-uploader__progress {
          width: 100%;
          max-width: 300px;
        }

        .media-uploader__progress-bar {
          height: 8px;
          background-color: #4569e7;
          border-radius: 4px;
          margin-bottom: 8px;
          transition: width 0.2s;
        }

        .media-uploader__progress-text {
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default MediaUploader;
