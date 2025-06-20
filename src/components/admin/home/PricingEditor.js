import React, { useState } from 'react';

const PricingEditor = ({ data, onChange, preview }) => {
  const handleChange = (field, value) => {
    if (!onChange) return;
    
    onChange({
      ...data,
      [field]: value
    });
  };

  const handlePlanChange = (index, field, value) => {
    if (!onChange) return;
    
    const newPlans = [...data.plans];
    newPlans[index] = {
      ...newPlans[index],
      [field]: value
    };
    
    onChange({
      ...data,
      plans: newPlans
    });
  };

  const handleFeatureChange = (planIndex, featureIndex, value) => {
    if (!onChange) return;
    
    const newPlans = [...data.plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures[featureIndex] = value;
    
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: newFeatures
    };
    
    onChange({
      ...data,
      plans: newPlans
    });
  };

  const handleAddPlan = () => {
    if (!onChange) return;
    
    const newPlan = {
      id: Date.now(),
      name: "New Plan",
      price: "$0.00",
      unit: "per image",
      description: "Plan description",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      recommended: false
    };
    
    onChange({
      ...data,
      plans: [...data.plans, newPlan]
    });
  };

  const handleRemovePlan = (index) => {
    if (!onChange) return;
    
    const newPlans = [...data.plans];
    newPlans.splice(index, 1);
    
    onChange({
      ...data,
      plans: newPlans
    });
  };

  const handleAddFeature = (planIndex) => {
    if (!onChange) return;
    
    const newPlans = [...data.plans];
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: [...newPlans[planIndex].features, "New Feature"]
    };
    
    onChange({
      ...data,
      plans: newPlans
    });
  };

  const handleRemoveFeature = (planIndex, featureIndex) => {
    if (!onChange) return;
    
    const newPlans = [...data.plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures.splice(featureIndex, 1);
    
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: newFeatures
    };
    
    onChange({
      ...data,
      plans: newPlans
    });
  };

  if (preview) {
    return (
      <div className="pricing-preview">
        <div className="pricing-preview__content">
          <h3 className="pricing-preview__subtitle">{data.subtitle}</h3>
          <h2 className="pricing-preview__title">{data.title}</h2>
          
          <div className="pricing-preview__plans">
            {data.plans.map((plan, index) => (
              <div 
                key={plan.id || index} 
                className={`pricing-preview__plan ${plan.recommended ? 'recommended' : ''}`}
              >
                <h4 className="pricing-preview__plan-name">{plan.name}</h4>
                <div className="pricing-preview__plan-price">
                  {plan.price} <span>{plan.unit}</span>
                </div>
                <p className="pricing-preview__plan-description">{plan.description}</p>
                <ul className="pricing-preview__plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                {plan.recommended && (
                  <div className="pricing-preview__plan-recommended">Recommended</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-editor">
      <div className="pricing-editor__form">
        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={data.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <div className="plans-header">
            <label>Pricing Plans</label>
            <button 
              type="button" 
              className="btn btn-sm btn-primary"
              onClick={handleAddPlan}
            >
              Add Plan
            </button>
          </div>
          
          {data.plans.map((plan, planIndex) => (
            <div key={plan.id || planIndex} className="plan-editor">
              <div className="plan-editor__header">
                <h4>Plan: {plan.name}</h4>
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemovePlan(planIndex)}
                >
                  Remove Plan
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`plan-name-${planIndex}`}>Name</label>
                  <input
                    type="text"
                    id={`plan-name-${planIndex}`}
                    value={plan.name}
                    onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`plan-price-${planIndex}`}>Price</label>
                  <input
                    type="text"
                    id={`plan-price-${planIndex}`}
                    value={plan.price}
                    onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`plan-unit-${planIndex}`}>Unit</label>
                  <input
                    type="text"
                    id={`plan-unit-${planIndex}`}
                    value={plan.unit}
                    onChange={(e) => handlePlanChange(planIndex, 'unit', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`plan-description-${planIndex}`}>Description</label>
                <input
                  type="text"
                  id={`plan-description-${planIndex}`}
                  value={plan.description}
                  onChange={(e) => handlePlanChange(planIndex, 'description', e.target.value)}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id={`plan-recommended-${planIndex}`}
                    checked={plan.recommended}
                    onChange={(e) => handlePlanChange(planIndex, 'recommended', e.target.checked)}
                    className="form-check-input"
                  />
                  <label htmlFor={`plan-recommended-${planIndex}`} className="form-check-label">
                    Recommended Plan
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="features-header">
                  <label>Features</label>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddFeature(planIndex)}
                  >
                    Add Feature
                  </button>
                </div>
                
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="feature-editor">
                    <div className="feature-editor__content">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(planIndex, featureIndex, e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveFeature(planIndex, featureIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .pricing-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .pricing-editor__form {
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
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        
        .form-control {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-check-input {
          margin: 0;
        }
        
        .plans-header,
        .features-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .plan-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .plan-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .plan-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .feature-editor {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .feature-editor__content {
          flex: 1;
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
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingEditor;
