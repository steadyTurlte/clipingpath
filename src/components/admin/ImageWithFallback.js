import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * A wrapper around Next.js Image component that handles errors gracefully
 * by showing a fallback image when the original image fails to load.
 */
const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  ...props
}) => {
  // Clean the src by removing query parameters
  const cleanSrc = src ? src.split('?')[0] : '';

  const [imgSrc, setImgSrc] = useState(cleanSrc || fallbackSrc);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filename, setFilename] = useState('');

  // Check if the image exists on the server
  useEffect(() => {
    if (cleanSrc) {
      // Extract filename from path
      const parts = cleanSrc.split('/');
      setFilename(parts[parts.length - 1]);

      // Reset error state when src changes
      setError(false);
      setLoading(true);
      setImgSrc(cleanSrc);
    } else {
      // If no src is provided, use fallback immediately
      setImgSrc(fallbackSrc);
      setError(true);
      setLoading(false);
    }
  }, [cleanSrc, fallbackSrc]);

  const handleError = () => {
    console.log('Image error:', cleanSrc);
    setError(true);
    setImgSrc(fallbackSrc);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="image-with-fallback">
      {loading && (
        <div className="image-loading-overlay">
          <span className="image-loading-message">Loading...</span>
        </div>
      )}

      <Image
        src={imgSrc}
        alt={alt}
        {...props}
        onError={handleError}
        onLoad={handleLoad}
        key={src} // Add a key to force re-render when src changes
      />

      {error && (
        <div className="image-error-overlay">
          <span className="image-error-message">Image not found</span>
          <span className="image-path">{cleanSrc}</span>
          <span className="image-filename">{filename}</span>
        </div>
      )}

      <style jsx>{`
        .image-with-fallback {
          position: relative;
          display: inline-block;
        }

        .image-error-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          text-align: center;
          border-radius: 4px;
        }

        .image-error-message {
          color: white;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .image-path {
          color: #f87171;
          font-size: 10px;
          word-break: break-all;
          max-width: 100%;
          margin-bottom: 4px;
        }

        .image-filename {
          color: #fcd34d;
          font-size: 12px;
          font-weight: 500;
          word-break: break-all;
          max-width: 100%;
        }

        .image-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          z-index: 10;
        }

        .image-loading-message {
          color: white;
          font-size: 12px;
          font-weight: 500;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 4px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ImageWithFallback;
