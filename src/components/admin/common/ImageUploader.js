import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { deleteImage } from '../../../utils/imageUtils';

/**
 * A reusable image uploader component
 * @param {Object} props - Component props
 * @param {string} props.currentImage - The current image URL
 * @param {Function} props.onImageUpload - Callback function when image is uploaded
 * @param {Function} props.onImageSelect - Callback function when image is selected but not yet uploaded
 * @param {string} props.folder - The folder to upload the image to (default: 'uploads')
 * @param {string} props.placeholderImage - The placeholder image URL
 * @param {string} props.label - The label for the uploader
 * @param {boolean} props.showPreview - Whether to show the image preview
 * @param {Object} props.previewStyle - Custom styles for the preview container
 * @param {boolean} props.uploadOnSelect - Whether to upload the image immediately on selection (default: false)
 * @param {string} props.imageRatio - Recommended image ratio (e.g., '16:9', '1:1')
 * @param {string} props.helpText - Additional help text to display
 */
const ImageUploader = forwardRef(function ImageUploader({
  currentImage,
  onImageUpload,
  onImageSelect,
  folder = 'uploads',
  placeholderImage = '/images/placeholder.png',
  label = 'Upload Image',
  showPreview = true,
  previewStyle = {},
  className = '',
  uploadOnSelect = false,
  imageRatio = '',
  helpText = '',
}, ref) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(currentImage || placeholderImage);
  const [previousImage, setPreviousImage] = useState(currentImage || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Update previous image when currentImage changes
  useEffect(() => {
    setPreviousImage(currentImage || '');
    setPreviewImage(currentImage || placeholderImage);
  }, [currentImage, placeholderImage]);

  // Generate a cache-busting URL to prevent browser caching
  const getCacheBustedUrl = (url) => {
    if (!url || url === placeholderImage) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${new Date().getTime()}`;
  };

  // Helper function to clean image path for deletion
  const cleanImagePath = (path) => {
    if (!path || path === placeholderImage) return null;
    // Remove any cache-busting parameters
    const cleanPath = path.split('?')[0];
    // Only return if it's a valid image path
    if (cleanPath.startsWith('/images/')) {
      return cleanPath;
    }
    return null;
  };

  // Function to handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create a preview of the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Store the selected file for later upload
    setSelectedFile(file);

    // If onImageSelect callback is provided, call it with the file
    if (onImageSelect) {
      onImageSelect(file);
    }

    // We no longer upload immediately, even if uploadOnSelect is true
    // This ensures images are only saved when the form is submitted
  };

  // Function to upload the selected image
  const uploadImage = useCallback(async (file) => {
    if (!file) {
      file = selectedFile;
      if (!file) {
        toast.error('No file selected');
        return;
      }
    }

    setUploading(true);
    setProgress(0);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', `images/${folder}`);

      // Upload the image
      const response = await fetch('/api/upload/image?folder=' + folder, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();

      // Delete the previous image if it exists and is different from the new one
      const oldImagePath = cleanImagePath(previousImage);
      if (oldImagePath && oldImagePath !== data.path) {
        try {
          await deleteImage(oldImagePath);
          console.log('Previous image deleted:', oldImagePath);
        } catch (deleteError) {
          console.error('Error deleting previous image:', deleteError);
          // Continue with the upload even if deletion fails
        }
      }

      // Use the cache-busted path from the server if available
      const imagePath = data.cacheBustedPath || data.path;
      const newImagePath = getCacheBustedUrl(imagePath);
      setPreviewImage(newImagePath);
      setPreviousImage(data.path); // Store the clean path for deletion
      setSelectedFile(null);

      // Call the callback function with the new image path
      if (onImageUpload) {
        // Pass the clean path to the parent component
        onImageUpload(data.path);
      }

      toast.success('Image uploaded successfully');
      return data.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
      // Reset the preview image if upload fails
      setPreviewImage(currentImage || placeholderImage);
      return null;
    } finally {
      setUploading(false);
      setProgress(100);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reset progress after a delay
      setTimeout(() => {
        setProgress(0);
      }, 1000);
    }
  }, [selectedFile, folder, previousImage, currentImage, placeholderImage, onImageUpload]);

  // For backward compatibility, always use handleFileSelect
  const handleImageUpload = (e) => {
    handleFileSelect(e);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Expose the uploadImage method for parent components
  React.useImperativeHandle(
    ref,
    () => ({
      uploadImage: () => uploadImage(selectedFile),
      hasSelectedFile: () => !!selectedFile
    }),
    [selectedFile, uploadImage]
  );

  return (
    <div className={`image-uploader ${className}`}>
      {showPreview && (
        <div
          className="image-uploader__preview"
          style={previewStyle}
          onClick={handleBrowseClick}
        >
          <Image
            src={previewImage.startsWith('data:') ? previewImage : getCacheBustedUrl(previewImage)}
            alt="Preview"
            className="image-uploader__preview-img"
            width={300}
            height={150}
            style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
            unoptimized={true}
            onError={() => {
              console.log('Image failed to load:', previewImage);
              setPreviewImage(placeholderImage);
            }}
          />
          {uploading && (
            <div className="image-uploader__progress-overlay">
              <div className="image-uploader__progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          {selectedFile && !uploadOnSelect && (
            <div className="image-uploader__selected-indicator">
              <span>Image selected (not uploaded yet)</span>
            </div>
          )}
        </div>
      )}

      <div className="image-uploader__controls">
        <label className="image-uploader__label">{label}</label>
        <div className="image-uploader__buttons">
          <button
            type="button"
            className="image-uploader__browse-button"
            onClick={handleBrowseClick}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Browse'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={uploadOnSelect ? handleImageUpload : handleFileSelect}
            className="image-uploader__input"
            accept="image/*"
            disabled={uploading}
          />

          {/* Upload Now button removed - images are only uploaded when form is saved */}
        </div>

        {/* Help text and image requirements */}
        <div className="image-uploader__help-text">
          <p>Accepted formats: JPEG, PNG, GIF, WEBP, SVG (max 5MB)</p>
          {imageRatio && <p>Recommended ratio: {imageRatio}</p>}
          {helpText && <p>{helpText}</p>}
        </div>
      </div>

      <style jsx>{`
        .image-uploader {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .image-uploader__preview {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
        }

        .image-uploader__preview-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .image-uploader__progress-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.1);
        }

        .image-uploader__progress-bar {
          height: 100%;
          background-color: #4569e7;
          transition: width 0.3s ease;
        }

        .image-uploader__selected-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 4px 8px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 12px;
          text-align: center;
        }

        .image-uploader__controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-uploader__label {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
        }

        .image-uploader__buttons {
          display: flex;
          gap: 8px;
        }

        .image-uploader__browse-button,
        .image-uploader__upload-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .image-uploader__browse-button {
          background-color: #4569e7;
          color: white;
        }

        .image-uploader__upload-button {
          background-color: #10b981;
          color: white;
        }

        .image-uploader__browse-button:hover {
          background-color: #3a5bc7;
        }

        .image-uploader__upload-button:hover {
          background-color: #059669;
        }

        .image-uploader__browse-button:disabled,
        .image-uploader__upload-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .image-uploader__input {
          display: none;
        }

        .image-uploader__help-text {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .image-uploader__help-text p {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
});

export default ImageUploader;
