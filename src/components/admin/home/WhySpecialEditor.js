import React, { useState } from 'react';
import Image from 'next/image';

// Function to extract YouTube video ID from URL
const getYoutubeVideoId = (url) => {
  if (!url) return "dQw4w9WgXcQ"; // Default video ID

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : "dQw4w9WgXcQ";
};

const getYoutubeThumbnailUrl = (url) => {
  const videoId = getYoutubeVideoId(url);
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const WhySpecialEditor = ({ data, onChange, preview }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...data,
      [field]: value
    });
  };

  const handleFeatureChange = (index, field, value) => {
    if (!onChange) return;

    const newFeatures = [...data.features];
    newFeatures[index] = {
      ...newFeatures[index],
      [field]: value
    };

    onChange({
      ...data,
      features: newFeatures
    });
  };

  const handleAddFeature = () => {
    if (!onChange) return;

    const newFeature = {
      id: Date.now(),
      title: "New Feature",
      description: "Feature description",
      icon: "/images/choose/icon-one.png"
    };

    onChange({
      ...data,
      features: [...data.features, newFeature]
    });
  };

  const handleRemoveFeature = (index) => {
    if (!onChange) return;

    const newFeatures = [...data.features];
    newFeatures.splice(index, 1);

    onChange({
      ...data,
      features: newFeatures
    });
  };

  // No longer need handleImageUpload as we're using YouTube thumbnails

  const handleFeatureIconUpload = async (index, e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(`feature-${index}`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images/choose');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.filePath) {
        // Add a timestamp to the image URL to force a refresh
        const iconUrl = `${result.filePath}?t=${Date.now()}`;

        // Update the feature with the new icon URL
        const newFeatures = [...data.features];
        newFeatures[index] = {
          ...newFeatures[index],
          icon: iconUrl
        };

        onChange({
          ...data,
          features: newFeatures
        });
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      alert('Failed to upload icon. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  if (preview) {
    return (
      <div className="why-special-preview">
        <div className="why-special-preview__content">
          <h3 className="why-special-preview__subtitle">{data.subtitle}</h3>
          <h2 className="why-special-preview__title">{data.title}</h2>
          <p className="why-special-preview__video-url">Video URL: {data.videoUrl}</p>

          <div className="why-special-preview__features">
            {data.features.map((feature, index) => (
              <div key={feature.id || index} className="why-special-preview__feature">
                <div className="why-special-preview__feature-icon">
                  {feature.icon && feature.icon.startsWith('/') ? (
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={30}
                      height={30}
                    />
                  ) : (
                    <i className={feature.icon || 'icon-check'}></i>
                  )}
                </div>
                <div className="why-special-preview__feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="why-special-preview__image">
          <div className="why-special-preview__video-thumbnail">
            <h5>YouTube Thumbnail (Main Image):</h5>
            {data.videoUrl && (
              <Image
                src={getYoutubeThumbnailUrl(data.videoUrl)}
                alt="YouTube Thumbnail"
                width={300}
                height={200}
                style={{ borderRadius: '10px' }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="why-special-editor">
      <div className="why-special-editor__form">
        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={data.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="videoUrl">YouTube Video URL</label>
          <input
            type="text"
            id="videoUrl"
            value={data.videoUrl}
            onChange={(e) => handleChange('videoUrl', e.target.value)}
            className="form-control"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <small className="form-text text-muted">
            Enter a YouTube video URL. This video will play when the user clicks the play button.
            The YouTube video thumbnail will be automatically used as the main image.
          </small>
        </div>

        <div className="form-group">
          <label>YouTube Video Thumbnail</label>
          <div className="why-special-editor__image-preview">
            {data.videoUrl && (
              <Image
                src={getYoutubeThumbnailUrl(data.videoUrl)}
                alt="YouTube Thumbnail"
                width={300}
                height={200}
              />
            )}
          </div>
          <small className="form-text text-muted">
            The YouTube thumbnail will be used as the main image in the Why Special section.
            No separate image upload is needed. This thumbnail is automatically generated from the YouTube video URL.
          </small>
        </div>

        <div className="form-group">
          <div className="features-header">
            <label>Features</label>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleAddFeature}
            >
              Add Feature
            </button>
          </div>

          {data.features.map((feature, index) => (
            <div key={feature.id || index} className="feature-editor">
              <div className="feature-editor__header">
                <h4>Feature {index + 1}</h4>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveFeature(index)}
                >
                  Remove
                </button>
              </div>

              <div className="form-group">
                <label htmlFor={`feature-title-${index}`}>Title</label>
                <input
                  type="text"
                  id={`feature-title-${index}`}
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`feature-description-${index}`}>Description</label>
                <textarea
                  id={`feature-description-${index}`}
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                  className="form-control"
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label htmlFor={`feature-icon-${index}`}>Icon</label>
                <div className="form-row">
                  <input
                    type="text"
                    id={`feature-icon-${index}`}
                    value={feature.icon || ''}
                    onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                    className="form-control"
                    placeholder="Icon path or CSS class"
                  />
                </div>

                <div className="feature-editor__icon-preview">
                  {feature.icon && feature.icon.startsWith('/') ? (
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <i className={feature.icon || 'icon-check'} style={{ fontSize: '24px' }}></i>
                  )}
                </div>

                <div className="feature-editor__icon-upload">
                  <p className="form-text">Or upload an image to use as icon:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFeatureIconUpload(index, e)}
                    className="form-control-file"
                  />
                  {uploadingImage === `feature-${index}` && <span>Uploading...</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .why-special-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .why-special-editor__form {
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

        .form-text {
          font-size: 12px;
          color: #64748b;
        }

        .features-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .feature-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .feature-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .feature-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .feature-editor__icon-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
          margin: 8px 0;
        }

        .feature-editor__icon-upload {
          margin-top: 8px;
        }

        .why-special-preview__feature {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .why-special-preview__feature-icon {
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .why-special-editor__image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
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
      `}</style>
    </div>
  );
};

export default WhySpecialEditor;
