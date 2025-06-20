import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const PricingPlansEditor = () => {
  const [pricingData, setPricingData] = useState({
    subtitle: '',
    title: '',
    description: '',
    plans: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    id: 0,
    name: '',
    price: '',
    unit: '',
    description: '',
    features: [],
    recommended: false
  });
  const [newFeature, setNewFeature] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [planSuccess, setPlanSuccess] = useState(false);
  const [planRemoved, setPlanRemoved] = useState(false);
  const [error, setError] = useState(null);
  const [planError, setPlanError] = useState(null);

  useEffect(() => {
    // Fetch the pricing data when the component mounts
    const fetchPricingData = async () => {
      try {
        const response = await fetch('/api/content/pricing?section=main');
        const data = await response.json();
        setPricingData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        setError('Failed to load pricing data');
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;


    // Create a new object with the updated field
    const updatedData = {
      ...pricingData,
      [name]: value
    };

    // Update the state
    setPricingData(updatedData);
  };

  const handlePlanInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPlan({
      ...newPlan,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;

    setNewPlan({
      ...newPlan,
      features: [...newPlan.features, newFeature.trim()]
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures.splice(index, 1);

    setNewPlan({
      ...newPlan,
      features: updatedFeatures
    });
  };

  const handleAddPlan = () => {
    // Reset the form
    setNewPlan({
      id: pricingData.plans.length > 0 ? Math.max(...pricingData.plans.map(plan => plan.id)) + 1 : 1,
      name: '',
      price: '',
      unit: 'per image',
      description: '',
      features: [],
      recommended: false
    });
    setSelectedPlan(null);
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan) => {
    setNewPlan({...plan});
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleRemovePlan = (planId) => {
    const updatedPlans = pricingData.plans.filter(plan => plan.id !== planId);
    setPricingData({
      ...pricingData,
      plans: updatedPlans
    });

    setPlanRemoved(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setPlanRemoved(false);
    }, 3000);
  };

  const handleSavePlan = () => {
    // Validate form
    if (!newPlan.name || !newPlan.price) {
      setPlanError('Plan name and price are required');
      return;
    }

    let updatedPlans;
    if (selectedPlan) {
      // Update existing plan
      updatedPlans = pricingData.plans.map(plan =>
        plan.id === selectedPlan.id ? newPlan : plan
      );
    } else {
      // Add new plan
      updatedPlans = [...pricingData.plans, newPlan];
    }

    setPricingData({
      ...pricingData,
      plans: updatedPlans
    });
    setShowPlanModal(false);
    setPlanSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setPlanSuccess(false);
    }, 3000);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/pricing?section=main', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pricingData)
      });

      const responseData = await response.json();

      if (response.ok) {
        setSaveSuccess(true);

        // Refresh the data to ensure we have the latest version
        const refreshResponse = await fetch('/api/content/pricing?section=main');
        const refreshedData = await refreshResponse.json();
        setPricingData(refreshedData);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Pricing plans section: ' + (responseData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving pricing data:', error);
      setError('Failed to save Pricing plans section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">
          <p>Loading pricing plans data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Pricing Plans | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/pricing" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Edit Pricing Plans</h1>
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
            <p>Pricing plans section saved successfully!</p>
          </div>
        )}

        {planSuccess && (
          <div className="admin-page__success">
            <p>Pricing plan saved successfully!</p>
          </div>
        )}

        {planRemoved && (
          <div className="admin-page__success">
            <p>Pricing plan removed successfully!</p>
          </div>
        )}

        <div className="admin-page__content">
          <div className="admin-page__info-box">
            <i className="fa-solid fa-info-circle"></i>
            <p>This is the central place to manage all pricing plans. Changes made here will be reflected across the entire website, including the Home page, Services page, and Pricing page.</p>
          </div>

          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Pricing Section Header</h2>
            </div>

            <div className="admin-page__field">
              <label htmlFor="subtitle" className="admin-page__label">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                className="admin-page__input"
                value={pricingData.subtitle}
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
                value={pricingData.title}
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
                value={pricingData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Pricing Plans</h2>
              <button
                type="button"
                className="admin-page__add-button"
                onClick={handleAddPlan}
              >
                Add New Plan
              </button>
            </div>

            <div className="admin-page__cards-grid">
              {pricingData.plans.map(plan => (
                <div key={plan.id} className={`admin-page__card ${plan.recommended ? 'admin-page__card--recommended' : ''}`}>
                  {plan.recommended && (
                    <div className="admin-page__card-badge">Recommended</div>
                  )}
                  <div className="admin-page__card-header">
                    <h3 className="admin-page__card-title">{plan.name}</h3>
                  </div>
                  <div className="admin-page__card-content">
                    <div className="admin-page__plan-price">
                      <span className="admin-page__plan-price-amount">{plan.price}</span>
                      <span className="admin-page__plan-price-unit">{plan.unit}</span>
                    </div>
                    <p className="admin-page__plan-description">{plan.description}</p>
                    <div className="admin-page__plan-features">
                      <h4 className="admin-page__plan-features-title">Features:</h4>
                      <ul className="admin-page__plan-features-list">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="admin-page__plan-feature">{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="admin-page__project-actions">
                      <button
                        type="button"
                        className="admin-page__edit-button"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <i className="fa-solid fa-pencil"></i> Edit
                      </button>
                      <button
                        type="button"
                        className="admin-page__remove-button"
                        onClick={() => handleRemovePlan(plan.id)}
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

      {/* Plan Edit Modal */}
      {showPlanModal && (
        <div className="admin-page__modal-overlay">
          <div className="admin-page__modal">
            <div className="admin-page__modal-header">
              <h2 className="admin-page__modal-title">
                {selectedPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
              </h2>
              <button
                type="button"
                className="admin-page__modal-close"
                onClick={() => setShowPlanModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="admin-page__modal-content">
              {planError && (
                <div className="admin-page__error">
                  <p>{planError}</p>
                </div>
              )}

              <div className="admin-page__field">
                <label htmlFor="name" className="admin-page__label">Plan Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="admin-page__input"
                  value={newPlan.name}
                  onChange={handlePlanInputChange}
                  placeholder="Enter plan name"
                />
              </div>

              <div className="admin-page__field-row">
                <div className="admin-page__field">
                  <label htmlFor="price" className="admin-page__label">Price</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    className="admin-page__input"
                    value={newPlan.price}
                    onChange={handlePlanInputChange}
                    placeholder="Enter price (e.g. $0.39)"
                  />
                </div>
                <div className="admin-page__field">
                  <label htmlFor="unit" className="admin-page__label">Unit</label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    className="admin-page__input"
                    value={newPlan.unit}
                    onChange={handlePlanInputChange}
                    placeholder="Enter unit (e.g. per image)"
                  />
                </div>
              </div>

              <div className="admin-page__field">
                <label htmlFor="description" className="admin-page__label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-page__textarea"
                  value={newPlan.description}
                  onChange={handlePlanInputChange}
                  placeholder="Enter plan description"
                  rows={2}
                />
              </div>



              <div className="admin-page__field admin-page__field--checkbox">
                <input
                  type="checkbox"
                  id="recommended"
                  name="recommended"
                  className="admin-page__checkbox"
                  checked={newPlan.recommended}
                  onChange={handlePlanInputChange}
                />
                <label htmlFor="recommended" className="admin-page__checkbox-label">
                  Mark as Recommended Plan
                </label>
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Features</label>
                <div className="admin-page__features-list">
                  {newPlan.features.map((feature, index) => (
                    <div key={index} className="admin-page__feature-item">
                      <span className="admin-page__feature-text">{feature}</span>
                      <button
                        type="button"
                        className="admin-page__feature-remove"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="admin-page__feature-add">
                  <input
                    type="text"
                    className="admin-page__input"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Enter new feature"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <button
                    type="button"
                    className="admin-page__feature-add-button"
                    onClick={handleAddFeature}
                  >
                    <i className="fa-solid fa-plus"></i> Add
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-page__modal-footer">
              <button
                type="button"
                className="admin-page__modal-cancel"
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-page__modal-save"
                onClick={handleSavePlan}
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page__field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .admin-page__field-row {
            grid-template-columns: 1fr;
          }
        }

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

        .admin-page__info-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          background-color: #e0f2fe;
          border-left: 4px solid #0ea5e9;
          border-radius: 8px;
          margin-bottom: 24px;
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
      `}</style>
      {/* Using global admin.css styles */}
    </AdminLayout>
  );
};

export default PricingPlansEditor;
