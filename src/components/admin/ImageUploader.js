import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { deleteImage } from '../../utils/imageUtils';

const ImageUploader = ({
  currentImage,
  onImageChange,
  directory = 'uploads',
  label = 'Image',
  width = 200,
  height = 150,
  className = '',
  imageClassName = '',
  allowUrl = true,
  id = '' // Add an id prop to uniquely identify each uploader
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [error, setError] = useState('');
  const [inputId] = useState(`file-upload-${id || label.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`);
  const [previousImage, setPreviousImage] = useState(currentImage || '');

  // Update local state when currentImage prop changes
  useEffect(() => {
    setImageUrl(currentImage || '');
    setPreviousImage(currentImage || '');
  }, [currentImage]);

  // Helper function to clean image path for deletion
  const cleanImagePath = (path) => {
    if (!path) return null;
    // Remove any cache-busting parameters
    const cleanPath = path.split('?')[0];
    // Only return if it's a valid image path
    if (cleanPath.startsWith('/images/')) {
      return cleanPath;
    }
    return null;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', directory);

      const response = await fetch(`/api/upload/image?folder=${directory}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();

      if (result.path) {
        // Add a timestamp to the image URL to force a refresh
        const newImageUrl = `${result.path}?t=${Date.now()}`;

        // Delete the previous image if it exists and is different from the new one
        const oldImagePath = cleanImagePath(previousImage);
        if (oldImagePath && oldImagePath !== cleanImagePath(newImageUrl)) {
          try {
            await deleteImage(oldImagePath);
            console.log('Previous image deleted:', oldImagePath);
          } catch (deleteError) {
            console.error('Error deleting previous image:', deleteError);
            // Continue with the upload even if deletion fails
          }
        }

        // Update state with new image
        setImageUrl(newImageUrl);
        setPreviousImage(newImageUrl);
        onImageChange(newImageUrl);
      } else {
        throw new Error('No path returned from server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);

      // Get more detailed error message if available
      let errorMessage = 'Failed to upload image. Please try again.';
      if (error.message) {
        errorMessage += ` Error: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = async (e) => {
    const url = e.target.value;

    // If the URL is being changed and there was a previous uploaded image, delete it
    const oldImagePath = cleanImagePath(previousImage);
    if (oldImagePath && url !== previousImage) {
      try {
        await deleteImage(oldImagePath);
        console.log('Previous image deleted after URL change:', oldImagePath);
      } catch (deleteError) {
        console.error('Error deleting previous image after URL change:', deleteError);
        // Continue with the URL change even if deletion fails
      }
    }

    setImageUrl(url);
    setPreviousImage(url);
    onImageChange(url);
  };

  return (
    <div className={`admin-page__image-uploader ${className}`}>
      <label className="admin-page__label">{label}</label>

      <div className="admin-page__image-preview-container">
        {imageUrl ? (
          <div className="admin-page__image-container">
            <Image
              src={imageUrl}
              alt={label}
              className={`admin-page__preview-image ${imageClassName}`}
              width={width}
              height={height}
              style={{ objectFit: "contain", maxWidth: "100%" }}
              unoptimized={imageUrl.startsWith('http') || imageUrl.includes('?')}
            />
          </div>
        ) : (
          <div
            className="admin-page__image-placeholder"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <i className="fa-solid fa-image"></i>
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className="admin-page__image-controls">
        <div className="admin-page__file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="admin-page__file-input"
            id={inputId}
            disabled={uploading}
          />
          <label
            htmlFor={inputId}
            className="admin-page__file-label"
          >
            <i className="fa-solid fa-upload"></i>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </label>
        </div>

        {allowUrl && (
          <div className="admin-page__url-input">
            <label className="admin-page__small-label">Or enter image URL:</label>
            <input
              type="text"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="admin-page__input"
              disabled={uploading}
            />
          </div>
        )}
      </div>

      {error && <div className="admin-page__error-message">{error}</div>}

      {/* Using global admin.css styles */}
    </div>
  );
};

export default ImageUploader;
