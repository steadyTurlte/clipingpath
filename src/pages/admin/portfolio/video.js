import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadImage } from '@/utils/imageUtils';

const PortfolioVideoEditor = () => {
  const [videoData, setVideoData] = useState({
    embedId: '',
    backgroundImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const response = await fetch('/api/content/portfolio?section=video');
        
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }

        const data = await response.json();
        
        if (data) {
          setVideoData(data);
          setBackgroundImagePreview(data.backgroundImage || '');
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
        setError('Failed to load video data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData({
      ...videoData,
      [name]: value
    });
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBackgroundImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      let backgroundImagePath = videoData.backgroundImage;

      // Upload background image if a new file is selected
      if (backgroundImageFile) {
        backgroundImagePath = await uploadImage(backgroundImageFile, 'portfolio');
      }

      const updatedVideoData = {
        ...videoData,
        backgroundImage: backgroundImagePath
      };

      // Save the updated video data
      const response = await fetch('/api/content/portfolio?section=video', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVideoData)
      });

      if (!response.ok) {
        throw new Error('Failed to save video data');
      }

      setVideoData(updatedVideoData);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving video data:', error);
      setError(`Failed to save video data: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Extract YouTube video ID from URL if a full URL is provided
  const handleYoutubeUrlChange = (e) => {
    const { value } = e.target;
    
    if (value.includes('youtube.com') || value.includes('youtu.be')) {
      // Extract video ID from YouTube URL
      let videoId = '';
      
      if (value.includes('youtube.com/watch?v=')) {
        videoId = value.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (value.includes('youtu.be/')) {
        videoId = value.split('youtu.be/')[1];
        const questionMarkPosition = videoId.indexOf('?');
        if (questionMarkPosition !== -1) {
          videoId = videoId.substring(0, questionMarkPosition);
        }
      }
      
      if (videoId) {
        setVideoData({
          ...videoData,
          embedId: videoId
        });
      } else {
        setVideoData({
          ...videoData,
          embedId: value
        });
      }
    } else {
      // If not a URL, use the value as is
      setVideoData({
        ...videoData,
        embedId: value
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">
          <p>Loading video data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Portfolio Video | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/portfolio" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Portfolio Video</h1>
          </div>

          <button
            className="admin-page__save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="admin-page__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-page__success">
            <p>Video section saved successfully!</p>
          </div>
        )}

        <div className="admin-page__content">
          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Video Settings</h2>
            </div>

            <div className="admin-page__form">
              <div className="admin-page__field">
                <label htmlFor="embedId" className="admin-page__label">YouTube Video ID or URL</label>
                <input
                  type="text"
                  id="embedId"
                  name="embedId"
                  className="admin-page__input"
                  value={videoData.embedId}
                  onChange={handleYoutubeUrlChange}
                  placeholder="Enter YouTube video ID or full URL"
                />
                <div className="admin-page__help-text">
                  <p>Enter either the YouTube video ID (e.g., dQw4w9WgXcQ) or the full YouTube URL.</p>
                </div>
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Background Image</label>
                <div className="admin-page__file-upload">
                  <input
                    type="file"
                    id="backgroundImage"
                    className="admin-page__file-input"
                    accept="image/*"
                    onChange={handleBackgroundImageChange}
                  />
                  <label htmlFor="backgroundImage" className="admin-page__file-label">
                    <i className="fa-solid fa-upload"></i> Choose Background Image
                  </label>
                </div>
                {backgroundImagePreview && (
                  <div className="admin-page__image-preview">
                    <Image
                      src={backgroundImagePreview}
                      alt="Background Image Preview"
                      width={400}
                      height={225}
                      style={{ objectFit: "contain", maxWidth: "100%" }}
                    />
                  </div>
                )}
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Preview</label>
                <div className="admin-page__video-preview">
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoData.embedId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page__error,
        .admin-page__success {
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

        .admin-page__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-page__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-page__error p,
        .admin-page__success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-page__error p::before {
          content: '❌ ';
        }

        .admin-page__success p::before {
          content: '✅ ';
        }

        .admin-page__help-text {
          margin-top: 4px;
          font-size: 12px;
          color: #64748b;
        }

        .admin-page__video-preview {
          margin-top: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          width: 100%;
          max-width: 560px;
          aspect-ratio: 16/9;
        }

        .admin-page__video-preview iframe {
          width: 100%;
          height: 100%;
        }

        .admin-page__image-preview {
          margin-top: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          width: 100%;
          max-width: 400px;
          background-color: #f8fafc;
          padding: 8px;
        }
      `}</style>
    </AdminLayout>
  );
};

export default PortfolioVideoEditor;
