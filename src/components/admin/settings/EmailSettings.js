import React from 'react';

const EmailSettings = ({ data, onChange, preview }) => {
  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...data,
      [field]: value
    });
  };

  if (preview) {
    return (
      <div className="admin-page__preview">
        <div className="admin-page__preview-item">
          <span className="admin-page__preview-label">Admin Email:</span>
          <span className="admin-page__preview-value">{data.adminEmail}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page__settings-form">
      <div className="admin-page__field">
        <label htmlFor="adminEmail" className="admin-page__label">Admin Email</label>
        <input
          type="email"
          id="adminEmail"
          value={data.adminEmail}
          onChange={(e) => handleChange('adminEmail', e.target.value)}
          className="admin-page__input"
          placeholder="Enter the email address to receive form submissions"
        />
        <small className="admin-page__help-text">
          This email address will receive all contact form and quote form submissions.
        </small>
      </div>

      <div className="admin-page__notice admin-page__notice--info">
        <p>
          <strong>Note:</strong> All other email settings (SMTP server, ports, etc.) are configured through environment variables.
          Only the admin email can be changed from this interface.
        </p>
        <p>
          <strong>Important:</strong> This admin email will be used for all email communications, including contact form submissions and quote requests.
          Make sure it&apos;s a valid email address that you check regularly.
        </p>
      </div>

      {/* Using global admin.css styles */}
    </div>
  );
};

export default EmailSettings;
