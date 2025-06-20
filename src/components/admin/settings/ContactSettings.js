import React from 'react';

const ContactSettings = ({ data, onChange, preview }) => {
  const handleChange = (field, value) => {
    if (!onChange) return;
    
    onChange({
      ...data,
      [field]: value
    });
  };

  if (preview) {
    return (
      <div className="contact-settings-preview">
        <div className="contact-settings-preview__item">
          <span className="contact-settings-preview__label">Email:</span>
          <span className="contact-settings-preview__value">{data.email}</span>
        </div>
        <div className="contact-settings-preview__item">
          <span className="contact-settings-preview__label">Phone:</span>
          <span className="contact-settings-preview__value">{data.phone}</span>
        </div>
        <div className="contact-settings-preview__item">
          <span className="contact-settings-preview__label">Address:</span>
          <span className="contact-settings-preview__value">{data.address}</span>
        </div>
        <div className="contact-settings-preview__item">
          <span className="contact-settings-preview__label">Google Map URL:</span>
          <span className="contact-settings-preview__value">{data.googleMapUrl}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-settings">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          className="form-control"
          placeholder="Enter the contact email address"
        />
        <small className="form-text text-muted">
          This email will be displayed on the contact page and in the footer.
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          id="phone"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="form-control"
          placeholder="Enter the contact phone number"
        />
        <small className="form-text text-muted">
          This phone number will be displayed on the contact page and in the footer.
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          className="form-control"
          placeholder="Enter the physical address"
          rows={3}
        />
        <small className="form-text text-muted">
          This address will be displayed on the contact page and in the footer.
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="googleMapUrl">Google Map URL</label>
        <input
          type="text"
          id="googleMapUrl"
          value={data.googleMapUrl || ''}
          onChange={(e) => handleChange('googleMapUrl', e.target.value)}
          className="form-control"
          placeholder="Enter the Google Map URL"
        />
        <small className="form-text text-muted">
          This URL will be used for the map on the contact page.
        </small>
      </div>
      
      <style jsx>{`
        .contact-settings {
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

export default ContactSettings;
