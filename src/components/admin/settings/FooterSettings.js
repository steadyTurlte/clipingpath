import React from 'react';

const FooterSettings = ({ data, onChange, preview }) => {
  const handleChange = (field, value) => {
    if (!onChange) return;
    
    onChange({
      ...data,
      [field]: value
    });
  };

  if (preview) {
    return (
      <div className="footer-settings-preview">
        <div className="footer-settings-preview__item">
          <span className="footer-settings-preview__label">Description:</span>
          <span className="footer-settings-preview__value">{data.description}</span>
        </div>
        <div className="footer-settings-preview__item">
          <span className="footer-settings-preview__label">Copyright:</span>
          <span className="footer-settings-preview__value">{data.copyright}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="footer-settings">
      <div className="form-group">
        <label htmlFor="description">Footer Description</label>
        <textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="form-control"
          placeholder="Enter the footer description"
          rows={4}
        />
        <small className="form-text text-muted">
          This text appears in the footer section of the website.
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="copyright">Copyright Text</label>
        <input
          type="text"
          id="copyright"
          value={data.copyright || ''}
          onChange={(e) => handleChange('copyright', e.target.value)}
          className="form-control"
          placeholder="Enter the copyright text"
        />
        <small className="form-text text-muted">
          This text appears at the bottom of the footer. Use © for the copyright symbol.
        </small>
      </div>
      
      <style jsx>{`
        .footer-settings {
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

export default FooterSettings;
