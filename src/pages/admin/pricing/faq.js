import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const PricingFaqEditor = () => {
  const [faqData, setFaqData] = useState({
    subtitle: '',
    title: '',
    description: '',
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [faqSuccess, setFaqSuccess] = useState(false);
  const [faqRemoved, setFaqRemoved] = useState(false);
  const [error, setError] = useState(null);
  const [newFaq, setNewFaq] = useState({
    id: 0,
    question: '',
    answer: ''
  });

  useEffect(() => {
    // Fetch the FAQ data when the component mounts
    const fetchFaqData = async () => {
      setError(null);
      try {
        const response = await fetch('/api/content/pricing?section=faq');
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ data');
        }
        const data = await response.json();
        setFaqData(data);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setError('Failed to load FAQ data');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData({
      ...faqData,
      [name]: value
    });
  };

  const handleFaqInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({
      ...newFaq,
      [name]: value
    });
  };

  const handleAddFaq = () => {
    // Reset the form
    setNewFaq({
      id: faqData.items.length > 0 ? Math.max(...faqData.items.map(item => item.id)) + 1 : 1,
      question: '',
      answer: ''
    });
    setSelectedFaq(null);
    setShowFaqModal(true);
  };

  const handleEditFaq = (faq) => {
    setNewFaq({...faq});
    setSelectedFaq(faq);
    setShowFaqModal(true);
  };

  const handleRemoveFaq = (faqId) => {
    const updatedFaqs = faqData.items.filter(faq => faq.id !== faqId);
    setFaqData({
      ...faqData,
      items: updatedFaqs
    });
    setFaqRemoved(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setFaqRemoved(false);
    }, 3000);
  };

  const handleSaveFaq = () => {
    // Validate form
    setError(null);

    if (!newFaq.question || !newFaq.answer) {
      setError('Question and answer are required');
      return;
    }

    let updatedFaqs;
    if (selectedFaq) {
      // Update existing FAQ
      updatedFaqs = faqData.items.map(faq =>
        faq.id === selectedFaq.id ? newFaq : faq
      );
    } else {
      // Add new FAQ
      updatedFaqs = [...faqData.items, newFaq];
    }

    setFaqData({
      ...faqData,
      items: updatedFaqs
    });
    setShowFaqModal(false);
    setFaqSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setFaqSuccess(false);
    }, 3000);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/pricing?section=faq', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(faqData)
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
        <div className="admin-page__loading">
          <p>Loading FAQ data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Pricing FAQs | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/pricing" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Edit Pricing FAQs</h1>
          </div>
          <button
            className="admin-page__save-button"
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {error && (
          <div className="admin-page__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-page__success">
            <p>FAQ section saved successfully!</p>
          </div>
        )}

        {faqSuccess && (
          <div className="admin-page__success">
            <p>FAQ item saved successfully!</p>
          </div>
        )}

        {faqRemoved && (
          <div className="admin-page__success">
            <p>FAQ item removed successfully!</p>
          </div>
        )}

        <div className="admin-page__content">
          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">FAQ Section Header</h2>
            </div>
            <div className="admin-page__field">
              <label htmlFor="subtitle" className="admin-page__label">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                className="admin-page__input"
                value={faqData.subtitle}
                onChange={handleInputChange}
                placeholder="Enter subtitle"
              />
            </div>
            <div className="admin-page__field">
              <label htmlFor="title" className="admin-page__label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="admin-page__input"
                value={faqData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </div>
            <div className="admin-page__field">
              <label htmlFor="description" className="admin-page__label">Description</label>
              <textarea
                id="description"
                name="description"
                className="admin-page__textarea"
                value={faqData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Frequently Asked Questions</h2>
              <button
                type="button"
                className="admin-page__add-button"
                onClick={handleAddFaq}
              >
                Add New FAQ
              </button>
            </div>

            <div className="admin-page__cards-grid">
              {faqData.items.map(faq => (
                <div key={faq.id} className="admin-page__card">
                  <div className="admin-page__card-header">
                    <h3 className="admin-page__card-title">{faq.question}</h3>
                  </div>
                  <div className="admin-page__card-content">
                    <p style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>{faq.answer}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="admin-page__modal-cancel"
                        onClick={() => handleEditFaq(faq)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button
                        type="button"
                        className="admin-page__remove-button"
                        onClick={() => handleRemoveFaq(faq.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Edit Modal */}
      {showFaqModal && (
        <div className="admin-page__modal-overlay">
          <div className="admin-page__modal">
            <div className="admin-page__modal-header">
              <h2 className="admin-page__modal-title">
                {selectedFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button
                type="button"
                className="admin-page__modal-close"
                onClick={() => setShowFaqModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="admin-page__modal-content">
              {error && (
                <div className="admin-page__modal-error">
                  <p>{error}</p>
                </div>
              )}
              <div className="admin-page__field">
                <label htmlFor="question" className="admin-page__label">Question</label>
                <input
                  type="text"
                  id="question"
                  name="question"
                  className="admin-page__input"
                  value={newFaq.question}
                  onChange={handleFaqInputChange}
                  placeholder="Enter question"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="answer" className="admin-page__label">Answer</label>
                <textarea
                  id="answer"
                  name="answer"
                  className="admin-page__textarea"
                  value={newFaq.answer}
                  onChange={handleFaqInputChange}
                  placeholder="Enter answer"
                  rows={5}
                />
              </div>
            </div>
            <div className="admin-page__modal-footer">
              <button
                type="button"
                className="admin-page__modal-cancel"
                onClick={() => setShowFaqModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-page__modal-save"
                onClick={handleSaveFaq}
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page__error,
        .admin-page__success,
        .admin-page__modal-error {
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

        .admin-page__error,
        .admin-page__modal-error {
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
        .admin-page__success p,
        .admin-page__modal-error p {
          margin: 0;
          font-weight: 500;
        }

        .admin-page__error p::before,
        .admin-page__modal-error p::before {
          content: '❌ ';
        }

        .admin-page__success p::before {
          content: '✅ ';
        }
      `}</style>
    </AdminLayout>
  );
};

export default PricingFaqEditor;
