import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SectionEditor from '@/components/admin/SectionEditor';
import EmailSettings from '@/components/admin/settings/EmailSettings';


const AdminSettings = () => {
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/content/settings')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch settings: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {

        // Make sure we have all the required sections
        const completeData = {
          site: data.site || {},
          contact: data.contact || {},
          social: data.social || {},
          footer: data.footer || {},
          email: data.email || {}
        };

        setSettingsData(completeData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching settings data:', err);
        setError(`Failed to load settings data: ${err.message}. Please refresh the page.`);
        setLoading(false);
      });
  }, []);

  const handleSaveSection = async (section, data) => {
    try {

      // Make sure we have valid data
      if (!data || Object.keys(data).length === 0) {
        console.warn(`Empty data for ${section} section, using default empty object`);
        data = {};
      }

      // Make the API request
      const response = await fetch(`/api/content/settings?section=${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `Failed to save settings: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }

        throw new Error(errorMessage);
      }

      // Parse the response
      const result = await response.json();

      // Update local state
      setSettingsData(prevData => ({
        ...prevData,
        [section]: data,
      }));

      // Return success without using toast
      return true;
    } catch (error) {
      console.error(`Error saving ${section} section:`, error);
      // Just throw the error, let the SectionEditor handle displaying it
      throw error;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">
          <p>Loading settings data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-page__error">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="admin-page__button"
          >
            <i className="fa-solid fa-rotate"></i> Reload Page
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Settings | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <h1 className="admin-page__title">Settings</h1>
          </div>
        </div>

        <p className="admin-page__description">
          Configure site settings, contact information, and email preferences.
        </p>

        <div className="admin-page__content">
          <SectionEditor
            title="Email Settings"
            data={settingsData.email}
            onSave={(data) => handleSaveSection('email', data)}
          >
            <EmailSettings />
          </SectionEditor>

          <div className="admin-page__info-box">
            <i className="fa-solid fa-info-circle"></i>
            <p>
              <strong>Note:</strong> Contact information, social media links, and other site settings have been moved to the <Link href="/admin/contact/info">Contact Info</Link> page for centralized management.
            </p>
          </div>


        </div>
      </div>

      <style jsx>{`
        .admin-page__info-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          background-color: #e0f2fe;
          border-left: 4px solid #0ea5e9;
          border-radius: 8px;
          margin-top: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .admin-page__info-box i {
          color: #0ea5e9;
          font-size: 20px;
          margin-top: 2px;
        }

        .admin-page__info-box p {
          margin: 0;
          color: #0c4a6e;
          font-size: 15px;
          line-height: 1.5;
        }

        .admin-page__info-box a {
          color: #0284c7;
          font-weight: 500;
          text-decoration: none;
        }

        .admin-page__info-box a:hover {
          text-decoration: underline;
        }
      `}</style>

      {/* Using global admin.css styles */}
    </AdminLayout>
  );
};

export default AdminSettings;
