import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const ContactInfoEditor = () => {
  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone: '',
    email: '',
    googleMapUrl: '',
    mapUrl: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the contact info when the component mounts
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/content/contact-info');
        const data = await response.json();
        setContactInfo(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setError('Failed to load contact info');
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (field, value) => {
    setContactInfo({
      ...contactInfo,
      [field]: value
    });
  };

  const handleSocialLinkChange = (platform, value) => {
    setContactInfo({
      ...contactInfo,
      socialLinks: {
        ...contactInfo.socialLinks,
        [platform]: value
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/contact-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactInfo)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Contact info section');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      setError('Failed to save Contact info section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">
          <div className="admin-page__loading-spinner"></div>
          <p>Loading contact information...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Contact Information | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/contact" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Edit Contact Information</h1>
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
            <p>Contact information saved successfully!</p>
          </div>
        )}

        <div className="admin-page__content">
          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Contact Details</h2>
            </div>
            <div className="admin-page__section-content">
              <div className="admin-page__field">
                <label htmlFor="address" className="admin-page__label">Address</label>
                <input
                  type="text"
                  id="address"
                  className="admin-page__input"
                  value={contactInfo.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="phone" className="admin-page__label">Phone</label>
                <input
                  type="text"
                  id="phone"
                  className="admin-page__input"
                  value={contactInfo.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="email" className="admin-page__label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="admin-page__input"
                  value={contactInfo.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="googleMapUrl" className="admin-page__label">Google Map URL</label>
                <input
                  type="text"
                  id="googleMapUrl"
                  className="admin-page__input"
                  value={contactInfo.googleMapUrl}
                  onChange={(e) => handleChange('googleMapUrl', e.target.value)}
                  placeholder="Enter Google Map URL"
                />
                <p className="admin-page__help-text">
                  This is the URL that opens when someone clicks on your address. It should be a direct link to Google Maps.
                </p>
              </div>

              <div className="admin-page__field">
                <label htmlFor="mapUrl" className="admin-page__label">Map Embed URL</label>
                <input
                  type="text"
                  id="mapUrl"
                  className="admin-page__input"
                  value={contactInfo.mapUrl}
                  onChange={(e) => handleChange('mapUrl', e.target.value)}
                  placeholder="Enter Google Map Embed URL"
                />
                <p className="admin-page__help-text">
                  {'This is the embed URL used to display the map on the contact page. To get an embed URL, go to Google Maps, find your location, click "Share", select "Embed a map", and copy the URL from the iframe src attribute.'}
                </p>

                {contactInfo.mapUrl && (
                  <div className="admin-page__map-preview">
                    <h4 className="admin-page__preview-title">Map Preview</h4>
                    <div className="admin-page__iframe-container">
                      <iframe
                        src={contactInfo.mapUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Social Media Links</h2>
            </div>
            <div className="admin-page__section-content">
              <div className="admin-page__field">
                <label htmlFor="facebook" className="admin-page__label">
                  <i className="fa-brands fa-facebook"></i> Facebook
                </label>
                <input
                  type="text"
                  id="facebook"
                  className="admin-page__input"
                  value={contactInfo.socialLinks?.facebook || ''}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  placeholder="Enter Facebook URL"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="twitter" className="admin-page__label">
                  <i className="fa-brands fa-twitter"></i> Twitter
                </label>
                <input
                  type="text"
                  id="twitter"
                  className="admin-page__input"
                  value={contactInfo.socialLinks?.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="Enter Twitter URL"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="instagram" className="admin-page__label">
                  <i className="fa-brands fa-instagram"></i> Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  className="admin-page__input"
                  value={contactInfo.socialLinks?.instagram || ''}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  placeholder="Enter Instagram URL"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="linkedin" className="admin-page__label">
                  <i className="fa-brands fa-linkedin"></i> LinkedIn
                </label>
                <input
                  type="text"
                  id="linkedin"
                  className="admin-page__input"
                  value={contactInfo.socialLinks?.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  placeholder="Enter LinkedIn URL"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page__map-preview {
          margin-top: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .admin-page__preview-title {
          font-size: 14px;
          font-weight: 600;
          padding: 12px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          margin: 0;
        }

        .admin-page__iframe-container {
          height: 300px;
        }

        .admin-page__error,
        .admin-page__success {
          padding: 16px 20px;
          border-radius: 12px;
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

        .admin-page__back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background-color: #f1f5f9;
          color: #4b5563;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .admin-page__back-link:hover {
          background-color: #e2e8f0;
          transform: translateX(-4px);
        }

        .admin-page__title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-page__title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
          position: relative;
        }

        .admin-page__title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: #4569e7;
          border-radius: 2px;
        }

        .admin-page__save-button {
          padding: 12px 24px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(69, 105, 231, 0.25);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-page__save-button::before {
          content: '💾';
          font-size: 16px;
        }

        .admin-page__save-button:hover {
          background-color: #3a5bc7;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(69, 105, 231, 0.3);
        }

        .admin-page__save-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
      `}</style>
    </AdminLayout>
  );
};

export default ContactInfoEditor;
