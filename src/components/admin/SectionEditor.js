import React, { useState, useEffect } from 'react';

const SectionEditor = ({ title, data = {}, onSave, children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState(data);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Update editedData when data changes
  useEffect(() => {
    setEditedData(data || {});
  }, [data, title]);

  const handleEdit = () => {
    setEditedData(data || {});
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {

      // Call the onSave function and wait for it to complete
      await onSave(editedData);

      setIsEditing(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(`Error saving ${title} section:`, error);
      // Show a more detailed error message
      const errorMessage = error.message || 'Unknown error occurred';
      setError(`Failed to save changes: ${errorMessage}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-page__section">
      <div className="admin-page__section-header">
        <h2 className="admin-page__section-title">{title}</h2>

        {!isEditing ? (
          <button
            className="admin-page__edit-button"
            onClick={handleEdit}
          >
            <i className="fa-solid fa-pencil"></i>
            <span>Edit</span>
          </button>
        ) : (
          <div className="admin-page__button-group">
            <button
              className="admin-page__cancel-button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <i className="fa-solid fa-times"></i>
              <span>Cancel</span>
            </button>

            <button
              className="admin-page__save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              <i className="fa-solid fa-save"></i>
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="admin-page__error">
          <p>{error}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="admin-page__success">
          <p>{title} saved successfully!</p>
        </div>
      )}

      <div className="admin-page__section-content">
        {isEditing ? (
          React.cloneElement(children, {
            data: editedData,
            onChange: setEditedData
          })
        ) : (
          <div className="admin-page__preview-mode">
            {React.cloneElement(children, {
              data: data,
              preview: true
            })}
          </div>
        )}
      </div>

      {/* Using global admin.css styles */}
      <style jsx>{`
        .admin-page__error,
        .admin-page__success {
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

        .admin-page__error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-page__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
          font-size: 16px;
          font-weight: bold;
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
      `}</style>
    </div>
  );
};

export default SectionEditor;
