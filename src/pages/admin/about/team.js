import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';

const AboutTeamEditor = () => {
  const [teamData, setTeamData] = useState({
    subtitle: '',
    title: '',
    description: '',
    members: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [memberAdded, setMemberAdded] = useState(false);
  const [memberRemoved, setMemberRemoved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the team data when the component mounts
    const fetchTeamData = async () => {
      try {
        const response = await fetch('/api/content/about?section=team');
        const data = await response.json();
        setTeamData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Failed to load team data');
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleChange = (field, value) => {
    setTeamData({
      ...teamData,
      [field]: value
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...teamData.members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };

    setTeamData({
      ...teamData,
      members: updatedMembers
    });
  };

  const handleAddMember = () => {
    setTeamData({
      ...teamData,
      members: [
        ...teamData.members,
        {
          id: Date.now(),
          name: '',
          position: '',
          image: '',
          socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
          }
        }
      ]
    });

    setMemberAdded(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setMemberAdded(false);
    }, 3000);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = [...teamData.members];
    updatedMembers.splice(index, 1);

    setTeamData({
      ...teamData,
      members: updatedMembers
    });

    setMemberRemoved(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setMemberRemoved(false);
    }, 3000);
  };

  const handleSocialLinkChange = (memberIndex, platform, value) => {
    const updatedMembers = [...teamData.members];
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      socialLinks: {
        ...updatedMembers[memberIndex].socialLinks,
        [platform]: value
      }
    };

    setTeamData({
      ...teamData,
      members: updatedMembers
    });
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(index);
    setUploadSuccess(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images/team');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.filePath) {
        const updatedMembers = [...teamData.members];
        updatedMembers[index] = {
          ...updatedMembers[index],
          image: result.filePath
        };

        setTeamData({
          ...teamData,
          members: updatedMembers
        });

        setUploadSuccess(index);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/about?section=team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamData)
      });

      if (response.ok) {
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
            <Link href="/admin/about" className="admin-editor__back-button">
              Back to About
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

        {memberAdded && (
          <div className="admin-editor__success">
            <p>Team member added successfully!</p>
          </div>
        )}

        {memberRemoved && (
          <div className="admin-editor__success">
            <p>Team member removed successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">Team Section Header</h2>
            <div className="admin-editor__field">
              <label htmlFor="subtitle" className="admin-editor__label">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                className="admin-editor__input"
                value={teamData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="title" className="admin-editor__label">Title</label>
              <input
                type="text"
                id="title"
                className="admin-editor__input"
                value={teamData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="description" className="admin-editor__label">Description</label>
              <textarea
                id="description"
                className="admin-editor__textarea"
                value={teamData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <div className="admin-editor__section">
            <div className="admin-editor__section-header">
              <h2 className="admin-editor__section-title">Team Members</h2>
              <button
                type="button"
                className="admin-editor__add-button"
                onClick={handleAddMember}
              >
                Add Team Member
              </button>
            </div>

            {teamData.members.map((member, index) => (
              <div key={member.id || index} className="admin-editor__member-item">
                <div className="admin-editor__member-header">
                  <h3 className="admin-editor__member-title">Team Member #{index + 1}</h3>
                  <button
                    type="button"
                    className="admin-editor__remove-button"
                    onClick={() => handleRemoveMember(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="admin-editor__member-grid">
                  <div className="admin-editor__field">
                    <label className="admin-editor__label">Name</label>
                    <input
                      type="text"
                      className="admin-editor__input"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="admin-editor__field">
                    <label className="admin-editor__label">Position</label>
                    <input
                      type="text"
                      className="admin-editor__input"
                      value={member.position}
                      onChange={(e) => handleMemberChange(index, 'position', e.target.value)}
                      placeholder="Enter position"
                    />
                  </div>
                </div>

                <div className="admin-editor__field">
                  <label className="admin-editor__label">Profile Image</label>
                  <div className="admin-editor__image-preview">
                    {member.image && (
                      <Image
                        src={member.image}
                        alt={member.name || 'Team Member'}
                        width={150}
                        height={150}
                        className="admin-editor__preview-img"
                      />
                    )}
                  </div>
                  <div className="admin-editor__image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="admin-editor__file-input"
                    />
                    {uploadingImage === index && <span className="admin-editor__uploading">Uploading...</span>}
                    {uploadSuccess === index && (
                      <div className="admin-editor__upload-success">
                        <p>Team member image uploaded successfully!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-editor__social-links">
                  <h4 className="admin-editor__social-title">Social Links</h4>

                  <div className="admin-editor__social-grid">
                    <div className="admin-editor__field">
                      <label className="admin-editor__label">Facebook</label>
                      <input
                        type="text"
                        className="admin-editor__input"
                        value={member.socialLinks?.facebook || ''}
                        onChange={(e) => handleSocialLinkChange(index, 'facebook', e.target.value)}
                        placeholder="Enter Facebook URL"
                      />
                    </div>

                    <div className="admin-editor__field">
                      <label className="admin-editor__label">Twitter</label>
                      <input
                        type="text"
                        className="admin-editor__input"
                        value={member.socialLinks?.twitter || ''}
                        onChange={(e) => handleSocialLinkChange(index, 'twitter', e.target.value)}
                        placeholder="Enter Twitter URL"
                      />
                    </div>

                    <div className="admin-editor__field">
                      <label className="admin-editor__label">Instagram</label>
                      <input
                        type="text"
                        className="admin-editor__input"
                        value={member.socialLinks?.instagram || ''}
                        onChange={(e) => handleSocialLinkChange(index, 'instagram', e.target.value)}
                        placeholder="Enter Instagram URL"
                      />
                    </div>

                    <div className="admin-editor__field">
                      <label className="admin-editor__label">LinkedIn</label>
                      <input
                        type="text"
                        className="admin-editor__input"
                        value={member.socialLinks?.linkedin || ''}
                        onChange={(e) => handleSocialLinkChange(index, 'linkedin', e.target.value)}
                        placeholder="Enter LinkedIn URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

        .admin-editor__error,
        .admin-editor__success,
        .admin-editor__upload-success {
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

        .admin-editor__success,
        .admin-editor__upload-success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-editor__upload-success {
          padding: 8px 12px;
          margin-top: 8px;
          font-size: 14px;
        }

        .admin-editor__error p,
        .admin-editor__success p,
        .admin-editor__upload-success p {
          margin: 0;
          font-weight: 500;
        }

        .admin-editor__error p::before {
          content: '❌ ';
        }

        .admin-editor__success p::before,
        .admin-editor__upload-success p::before {
          content: '✅ ';
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

        .admin-editor__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
        .admin-editor__textarea,
        .admin-editor__select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__textarea {
          resize: vertical;
        }

        .admin-editor__image-preview {
          margin-bottom: 16px;
          max-width: 150px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .admin-editor__image-upload {
          margin-bottom: 16px;
        }

        .admin-editor__file-input {
          display: block;
          margin-bottom: 8px;
        }

        .admin-editor__uploading {
          display: inline-block;
          margin-left: 8px;
          font-size: 14px;
          color: #4569e7;
        }

        .admin-editor__member-item {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .admin-editor__member-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .admin-editor__member-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-editor__member-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .admin-editor__social-links {
          margin-top: 16px;
        }

        .admin-editor__social-title {
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .admin-editor__social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .admin-editor__add-button {
          padding: 6px 12px;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .admin-editor__remove-button {
          padding: 6px 12px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .admin-editor__member-grid,
          .admin-editor__social-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AboutTeamEditor;
