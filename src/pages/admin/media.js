import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaUploader from '@/components/admin/media/MediaUploader';
import MediaGrid from '@/components/admin/media/MediaGrid';

const AdminMedia = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch media files
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        setMediaFiles(data.files || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching media files:', err);
        setError('Failed to load media files. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  const handleUploadComplete = (uploadedFiles) => {
    // Add the new files to the state
    setMediaFiles(prevFiles => [...uploadedFiles, ...prevFiles]);
  };

  const handleDeleteFile = async (file) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/media/${encodeURIComponent(file.url)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the deleted file from the state
        setMediaFiles(mediaFiles.filter(f => f.url !== file.url));
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter media files based on search term
  const filteredFiles = mediaFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-media__loading">
          <p>Loading media files...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-media__error">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="admin-media__reload-button"
          >
            Reload Page
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Media Library | Photodit Admin</title>
      </Head>
      
      <div className="admin-media">
        <h1 className="admin-media__title">Media Library</h1>
        <p className="admin-media__description">
          Upload and manage images for your website.
        </p>
        
        <div className="admin-media__uploader">
          <MediaUploader onUploadComplete={handleUploadComplete} />
        </div>
        
        <div className="admin-media__search">
          <input
            type="text"
            placeholder="Search media files..."
            value={searchTerm}
            onChange={handleSearch}
            className="admin-media__search-input"
          />
        </div>
        
        <div className="admin-media__grid">
          <MediaGrid 
            files={filteredFiles} 
            onDelete={handleDeleteFile} 
          />
        </div>
      </div>
      
      <style jsx>{`
        .admin-media__title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .admin-media__description {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }
        
        .admin-media__uploader {
          margin-bottom: 32px;
        }
        
        .admin-media__search {
          margin-bottom: 24px;
        }
        
        .admin-media__search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .admin-media__grid {
          margin-bottom: 32px;
        }
        
        .admin-media__loading,
        .admin-media__error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .admin-media__error {
          color: #dc2626;
        }
        
        .admin-media__reload-button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .admin-media__reload-button:hover {
          background-color: #3a5bc7;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminMedia;
