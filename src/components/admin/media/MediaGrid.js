import React from 'react';
import Image from 'next/image';

const MediaGrid = ({ files, onSelect, onDelete, selectable = false }) => {
  return (
    <div className="media-grid">
      {files.length === 0 ? (
        <div className="media-grid__empty">
          <p>No media files found.</p>
        </div>
      ) : (
        <div className="media-grid__items">
          {files.map((file, index) => (
            <div key={index} className="media-grid__item">
              <div className="media-grid__item-preview">
                <Image 
                  src={file.url} 
                  alt={file.name} 
                  width={200} 
                  height={150} 
                  objectFit="cover"
                />
              </div>
              <div className="media-grid__item-info">
                <p className="media-grid__item-name">{file.name}</p>
                <p className="media-grid__item-date">{new Date(file.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="media-grid__item-actions">
                {selectable && (
                  <button 
                    className="media-grid__item-select" 
                    onClick={() => onSelect(file)}
                  >
                    Select
                  </button>
                )}
                <button 
                  className="media-grid__item-delete" 
                  onClick={() => onDelete(file)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .media-grid__empty {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 48px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 2px dashed #e2e8f0;
        }
        
        .media-grid__items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .media-grid__item {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
          transition: transform 0.2s;
        }
        
        .media-grid__item:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .media-grid__item-preview {
          height: 150px;
          position: relative;
          background-color: #f8fafc;
        }
        
        .media-grid__item-info {
          padding: 12px;
        }
        
        .media-grid__item-name {
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .media-grid__item-date {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }
        
        .media-grid__item-actions {
          display: flex;
          border-top: 1px solid #e2e8f0;
        }
        
        .media-grid__item-select,
        .media-grid__item-delete {
          flex: 1;
          padding: 8px;
          border: none;
          background: none;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .media-grid__item-select {
          color: #4569e7;
          border-right: 1px solid #e2e8f0;
        }
        
        .media-grid__item-select:hover {
          background-color: #f1f5f9;
        }
        
        .media-grid__item-delete {
          color: #ef4444;
        }
        
        .media-grid__item-delete:hover {
          background-color: #fee2e2;
        }
      `}</style>
    </div>
  );
};

export default MediaGrid;
