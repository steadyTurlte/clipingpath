import React from 'react';

const SocialSettings = ({ data, onChange, preview }) => {
  const handleChange = (field, value) => {
    if (!onChange) return;
    
    onChange({
      ...data,
      [field]: value
    });
  };

  if (preview) {
    return (
      <div className="social-settings-preview">
        <div className="social-settings-preview__item">
          <span className="social-settings-preview__label">Facebook:</span>
          <span className="social-settings-preview__value">{data.facebook}</span>
        </div>
        <div className="social-settings-preview__item">
          <span className="social-settings-preview__label">Twitter:</span>
          <span className="social-settings-preview__value">{data.twitter}</span>
        </div>
        <div className="social-settings-preview__item">
          <span className="social-settings-preview__label">Instagram:</span>
          <span className="social-settings-preview__value">{data.instagram}</span>
        </div>
        <div className="social-settings-preview__item">
          <span className="social-settings-preview__label">LinkedIn:</span>
          <span className="social-settings-preview__value">{data.linkedin}</span>
        </div>
        <div className="social-settings-preview__item">
          <span className="social-settings-preview__label">YouTube:</span>
          <span className="social-settings-preview__value">{data.youtube}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="social-settings">
      <div className="form-group">
        <label htmlFor="facebook">Facebook</label>
        <input
          type="url"
          id="facebook"
          value={data.facebook || ''}
          onChange={(e) => handleChange('facebook', e.target.value)}
          className="form-control"
          placeholder="Enter the Facebook URL"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="twitter">Twitter</label>
        <input
          type="url"
          id="twitter"
          value={data.twitter || ''}
          onChange={(e) => handleChange('twitter', e.target.value)}
          className="form-control"
          placeholder="Enter the Twitter URL"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="instagram">Instagram</label>
        <input
          type="url"
          id="instagram"
          value={data.instagram || ''}
          onChange={(e) => handleChange('instagram', e.target.value)}
          className="form-control"
          placeholder="Enter the Instagram URL"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="linkedin">LinkedIn</label>
        <input
          type="url"
          id="linkedin"
          value={data.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          className="form-control"
          placeholder="Enter the LinkedIn URL"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="youtube">YouTube</label>
        <input
          type="url"
          id="youtube"
          value={data.youtube || ''}
          onChange={(e) => handleChange('youtube', e.target.value)}
          className="form-control"
          placeholder="Enter the YouTube URL"
        />
      </div>
      
      <style jsx>{`
        .social-settings {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
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
      `}</style>
    </div>
  );
};

export default SocialSettings;
