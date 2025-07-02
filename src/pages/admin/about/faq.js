import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/common/ImageUploader';
import { toast } from 'react-toastify';

const AboutFaqEditor = () => {
  const [faqData, setFaqData] = useState({
    subtitle: '',
    title: '',
    image: '',
    imagePublicId: '',
    questions: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the FAQ data when the component mounts
    const fetchFaqData = async () => {
      try {
        const response = await fetch('/api/content/about?section=faq');
        const data = await response.json();
        
        // Handle both old and new data formats
        if (data.image && typeof data.image === 'object') {
          // New format with publicId
          setFaqData({
            ...data,
            image: data.image.url || '',
            imagePublicId: data.image.publicId || ''
          });
        } else {
          // Old format or no image
          setFaqData({
            ...data,
            image: data.image || '',
            imagePublicId: data.imagePublicId || ''
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setError('Failed to load FAQ data');
        setLoading(false);
      }
    };

    fetchFaqData();
  }, []);

  const handleImageUpload = (imageUrl, publicId) => {
    setFaqData(prevData => ({
      ...prevData,
      image: imageUrl,
      imagePublicId: publicId
    }));
  };

  const handleChange = (field, value) => {
    setFaqData({
      ...faqData,
      [field]: value
    });
  };

  const handleFaqItemChange = (index, field, value) => {
    const updatedQuestions = [...faqData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };

    setFaqData({
      ...faqData,
      questions: updatedQuestions
    });
  };

  const handleAddFaqItem = () => {
    setFaqData({
      ...faqData,
      questions: [
        ...faqData.questions,
        {
          id: Date.now(),
          question: '',
          answer: ''
        }
      ]
    });
  };

  const handleRemoveFaqItem = (index) => {
    const updatedQuestions = [...faqData.questions];
    updatedQuestions.splice(index, 1);

    setFaqData({
      ...faqData,
      questions: updatedQuestions
    });
  };

  // Image upload is now handled by the ImageUploader component

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // Prepare data with image object containing both URL and publicId
      const dataToSave = {
        ...faqData,
        image: {
          url: faqData.image,
          publicId: faqData.imagePublicId
        }
      };

      const response = await fetch('/api/content/about?section=faq', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save FAQ section');
      }
    } catch (error) {
      console.error('Error saving FAQ data:', error);
      setError('Failed to save FAQ section');
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
        <title>Edit FAQ Section | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit FAQ Section</h1>
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
            <p>FAQ section saved successfully!</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="admin-editor__success">
            <p>Image uploaded successfully!</p>
          </div>
        )}

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <h2 className="admin-editor__section-title">FAQ Section Header</h2>
            <div className="admin-editor__field">
              <label htmlFor="subtitle" className="admin-editor__label">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                className="admin-editor__input"
                value={faqData.subtitle}
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
                value={faqData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="admin-editor__field">
              <label htmlFor="description" className="admin-editor__label">Description</label>
              <textarea
                id="description"
                className="admin-editor__textarea"
                value={faqData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="admin-editor__field">
              <label className="admin-editor__label">FAQ Image</label>
              
              <div className="admin-editor__image-uploader-wrapper">
                <ImageUploader
                  value={faqData.image}
                  onChange={handleImageUpload}
                  folder="about/faq"
                  width={1410}
                  height={605}
                  className="admin-editor__image-uploader"
                />
              </div>
              
              <div className="admin-editor__image-help">
                <p className="admin-editor__help-text">
                  <strong>Recommended size:</strong> 1410x605px
                </p>
                <p className="admin-editor__help-text">
                  <strong>Image types:</strong> JPEG, PNG, WEBP
                </p>
              </div>
            </div>
          </div>

          <div className="admin-editor__section">
            <div className="admin-editor__section-header">
              <h2 className="admin-editor__section-title">FAQ Items</h2>
              <button
                type="button"
                className="admin-editor__add-button"
                onClick={handleAddFaqItem}
              >
                Add FAQ Item
              </button>
            </div>

            {faqData.questions.map((question, index) => (
              <div key={question.id || index} className="admin-editor__faq-item">
                <div className="admin-editor__faq-header">
                  <h3 className="admin-editor__faq-title">FAQ Item #{index + 1}</h3>
                  <button
                    type="button"
                    className="admin-editor__remove-button"
                    onClick={() => handleRemoveFaqItem(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="admin-editor__field">
                  <label className="admin-editor__label">Question</label>
                  <input
                    type="text"
                    className="admin-editor__input"
                    value={question.question}
                    onChange={(e) => handleFaqItemChange(index, 'question', e.target.value)}
                    placeholder="Enter question"
                  />
                </div>

                <div className="admin-editor__field">
                  <label className="admin-editor__label">Answer</label>
                  <textarea
                    className="admin-editor__textarea"
                    value={question.answer}
                    onChange={(e) => handleFaqItemChange(index, 'answer', e.target.value)}
                    placeholder="Enter answer"
                    rows={4}
                  />
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
        
        .admin-editor__image-uploader-wrapper {
          margin-bottom: 16px;
        }
        
        .admin-editor__image-uploader {
          width: 100%;
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
        .admin-editor__textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__textarea {
          resize: vertical;
        }

        .admin-editor__faq-item {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .admin-editor__faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .admin-editor__faq-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
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

        .admin-editor__image-preview {
          margin-bottom: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          background-color: #f8fafc;
          height: 220px; /* Fixed height to prevent layout shifts */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .admin-editor__preview-img-container {
          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease;
        }

        .admin-editor__no-image {
          color: #94a3b8;
          font-size: 14px;
          text-align: center;
        }

        .admin-editor__image-loading {
          color: #4569e7;
          font-size: 14px;
          text-align: center;
          position: absolute;
        }

        .hidden {
          display: none;
        }

        .admin-editor__file-input {
          position: relative;
        }

        .admin-editor__uploading {
          display: inline-block;
          margin-top: 8px;
          font-size: 14px;
          color: #4569e7;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AboutFaqEditor;
