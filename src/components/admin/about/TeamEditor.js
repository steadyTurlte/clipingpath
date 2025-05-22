import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const TeamEditor = ({ data = {}, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  const editorData = {
    ...data,
    members: [
      ...data.members
    ]
  };

  const handleChange = (field, value) => {
    if (!onChange) return;
    
    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleMemberChange = (index, field, value) => {
    if (!onChange) return;
    
    const newMembers = [...editorData.members];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value
    };
    
    onChange({
      ...editorData,
      members: newMembers
    });
  };

  const handleSocialLinkChange = (index, platform, value) => {
    if (!onChange) return;
    
    const newMembers = [...editorData.members];
    newMembers[index] = {
      ...newMembers[index],
      socialLinks: {
        ...newMembers[index].socialLinks,
        [platform]: value
      }
    };
    
    onChange({
      ...editorData,
      members: newMembers
    });
  };

  const handleAddMember = () => {
    if (!onChange) return;
    
    const newMember = {
      id: Date.now(),
      name: "New Team Member",
      position: "Position",
      image: "/images/team/one.png",
      socialLinks: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    };
    
    onChange({
      ...editorData,
      members: [...editorData.members, newMember]
    });
  };

  const handleRemoveMember = (index) => {
    if (!onChange || editorData.members.length <= 1) return;
    
    const newMembers = [...editorData.members];
    newMembers.splice(index, 1);
    
    onChange({
      ...editorData,
      members: newMembers
    });
  };

  const handleImageUpload = async (index, e) => {
    if (!onChange) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(index);
    
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
        const newMembers = [...editorData.members];
        newMembers[index] = {
          ...newMembers[index],
          image: result.filePath
        };
        
        onChange({
          ...editorData,
          members: newMembers
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <div className="team-editor">
      <div className="team-editor__form">
        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={editorData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={editorData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={editorData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <div className="members-header">
            <label>Team Members</label>
            <button 
              type="button" 
              className="btn btn-sm btn-primary"
              onClick={handleAddMember}
            >
              Add Team Member
            </button>
          </div>
          
          {editorData.members.map((member, index) => (
            <div key={member.id || index} className="member-editor">
              <div className="member-editor__header">
                <h4>Team Member {index + 1}</h4>
                {editorData.members.length > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveMember(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`member-name-${index}`}>Name</label>
                  <input
                    type="text"
                    id={`member-name-${index}`}
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`member-position-${index}`}>Position</label>
                  <input
                    type="text"
                    id={`member-position-${index}`}
                    value={member.position}
                    onChange={(e) => handleMemberChange(index, 'position', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Profile Image</label>
                <div className="member-image-preview">
                  <ImageWithFallback 
                    src={member.image} 
                    alt={member.name} 
                    width={150} 
                    height={150} 
                  />
                </div>
                <div className="member-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="form-control-file"
                  />
                  {uploadingImage === index && <span>Uploading...</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Social Links</label>
                <div className="social-links">
                  <div className="form-group">
                    <label htmlFor={`member-facebook-${index}`}>Facebook</label>
                    <input
                      type="text"
                      id={`member-facebook-${index}`}
                      value={member.socialLinks?.facebook || ''}
                      onChange={(e) => handleSocialLinkChange(index, 'facebook', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`member-twitter-${index}`}>Twitter</label>
                    <input
                      type="text"
                      id={`member-twitter-${index}`}
                      value={member.socialLinks?.twitter || ''}
                      onChange={(e) => handleSocialLinkChange(index, 'twitter', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`member-instagram-${index}`}>Instagram</label>
                    <input
                      type="text"
                      id={`member-instagram-${index}`}
                      value={member.socialLinks?.instagram || ''}
                      onChange={(e) => handleSocialLinkChange(index, 'instagram', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`member-linkedin-${index}`}>LinkedIn</label>
                    <input
                      type="text"
                      id={`member-linkedin-${index}`}
                      value={member.socialLinks?.linkedin || ''}
                      onChange={(e) => handleSocialLinkChange(index, 'linkedin', e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .team-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .team-editor__form {
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
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .members-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .member-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .member-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .member-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .member-image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 150px;
          margin-bottom: 8px;
        }
        
        .social-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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
        
        @media (max-width: 768px) {
          .form-row, .social-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TeamEditor;
