import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadImage } from '@/utils/imageUtils';

const TeamSectionEditor = () => {
  const [teamData, setTeamData] = useState({
    subtitle: '',
    title: '',
    description: '',
    largeImage: '',
    members: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [largeImageFile, setLargeImageFile] = useState(null);
  const [largeImagePreview, setLargeImagePreview] = useState('');

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch('/api/content/teams?section=team');
        if (response.ok) {
          const data = await response.json();
          // Set team data
          setTeamData({
            subtitle: data.subtitle || '',
            title: data.title || '',
            description: data.description || '',
            largeImage: data.largeImage || '',
            members: data.members || []
          });

          // Set image preview if image exists
          if (data.largeImage) {
            setLargeImagePreview(data.largeImage);
          }
        } else {
          setError('Failed to load team data');
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Error loading team data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({
      ...teamData,
      [name]: value
    });
  };

  const handleLargeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLargeImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLargeImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      let updatedTeamData = { ...teamData };

      // Upload image if a new file is selected
      if (largeImageFile) {
        setUploading(true);
        try {
          const imagePath = await uploadImage(largeImageFile, 'teams');
          updatedTeamData.largeImage = imagePath;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError('Failed to upload image. Please try again.');
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const response = await fetch('/api/content/teams?section=team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTeamData)
      });

      if (response.ok) {
        // Update the team data with the new image path
        setTeamData(updatedTeamData);
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Team section');
      }
    } catch (error) {
      console.error('Error saving team data:', error);
      setError('Failed to save Team section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-editor__loading">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Team Section | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit Team Section</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/teams" className="admin-editor__back-button">
              Back to Teams
            </Link>
            <button
              className="admin-editor__save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {error && (
          <div className="admin-editor__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-editor__success">
            <p>Team section saved successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Team Section Settings</h2>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Section Subtitle</label>
              <input
                type="text"
                name="subtitle"
                className="admin-editor__input"
                value={teamData.subtitle}
                onChange={handleInputChange}
                placeholder="Enter section subtitle"
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Section Title</label>
              <input
                type="text"
                name="title"
                className="admin-editor__input"
                value={teamData.title}
                onChange={handleInputChange}
                placeholder="Enter section title"
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Section Description</label>
              <textarea
                name="description"
                className="admin-editor__textarea"
                value={teamData.description}
                onChange={handleInputChange}
                placeholder="Enter section description"
                rows={4}
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">Large Image (1410x605px recommended)</label>
              <div className="admin-editor__file-upload">
                <input
                  type="file"
                  id="largeImage"
                  className="admin-editor__file-input"
                  accept="image/*"
                  onChange={handleLargeImageChange}
                />
                <label htmlFor="largeImage" className="admin-editor__file-label">
                  <i className="fa-solid fa-upload"></i> Choose Large Image
                </label>
                <p className="admin-editor__help-text">
                  For best results, use an image with dimensions 1410x605 pixels.
                </p>
              </div>

              {largeImagePreview && (
                <div className="admin-editor__image-preview">
                  <Image
                    src={largeImagePreview}
                    alt="Large Image Preview"
                    width={705}
                    height={302}
                    style={{ objectFit: "cover", maxWidth: "100%", borderRadius: "4px" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-editor__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
        }

        .admin-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-editor__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-editor__actions {
          display: flex;
          gap: 12px;
        }

        .admin-editor__back-button {
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
        }

        .admin-editor__save-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .admin-editor__save-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .admin-editor__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .admin-editor__section {
          margin-bottom: 24px;
        }

        .admin-editor__section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-editor__field {
          margin-bottom: 16px;
        }

        .admin-editor__label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .admin-editor__input,
        .admin-editor__textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__textarea {
          resize: vertical;
          min-height: 100px;
        }

        .admin-editor__error,
        .admin-editor__success {
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

        .admin-editor__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-editor__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-editor__error p,
        .admin-editor__success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-editor__error p::before {
          content: '❌ ';
        }

        .admin-editor__success p::before {
          content: '✅ ';
        }

        .admin-editor__file-upload {
          margin-bottom: 16px;
        }

        .admin-editor__file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .admin-editor__file-label {
          display: inline-block;
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .admin-editor__file-label:hover {
          background-color: #e2e8f0;
        }

        .admin-editor__help-text {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .admin-editor__image-preview {
          margin-top: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          background-color: #f8fafc;
          max-width: 100%;
        }
      `}</style>
    </AdminLayout>
  );
};

export default TeamSectionEditor;
