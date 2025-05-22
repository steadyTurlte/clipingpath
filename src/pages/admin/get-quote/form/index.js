import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const QuoteFormEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    personalInfo: [],
    serviceSelection: {
      label: '',
      title: '',
      options: []
    },
    outputOptions: {
      title: '',
      fileFormat: [],
      background: [],
      path: []
    },
    message: {
      id: '',
      label: '',
      type: '',
      placeholder: '',
      required: false
    },
    fileUpload: {
      label: '',
      description: '',
      maxSize: '',
      alternativeText: '',
      linkPlaceholder: ''
    },
    terms: {
      text: '',
      required: true
    },
    submitButton: '',
    successMessage: '',
    errorMessage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch('/api/content/get-quote?section=form');
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          toast.error('Failed to load form data');
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast.error('Error loading form data');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value
      }
    });
  };

  const handlePersonalInfoChange = (index, field, value) => {
    const updatedPersonalInfo = [...formData.personalInfo];
    updatedPersonalInfo[index] = {
      ...updatedPersonalInfo[index],
      [field]: value
    };
    setFormData({
      ...formData,
      personalInfo: updatedPersonalInfo
    });
  };

  const handleServiceOptionChange = (index, value) => {
    const updatedOptions = [...formData.serviceSelection.options];
    updatedOptions[index] = value;
    setFormData({
      ...formData,
      serviceSelection: {
        ...formData.serviceSelection,
        options: updatedOptions
      }
    });
  };

  const handleOutputOptionChange = (type, index, field, value) => {
    const updatedOptions = [...formData.outputOptions[type]];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    setFormData({
      ...formData,
      outputOptions: {
        ...formData.outputOptions,
        [type]: updatedOptions
      }
    });
  };

  const handleAddPersonalInfo = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter value',
      required: false
    };
    setFormData({
      ...formData,
      personalInfo: [...formData.personalInfo, newField]
    });
  };

  const handleRemovePersonalInfo = (index) => {
    const updatedPersonalInfo = [...formData.personalInfo];
    updatedPersonalInfo.splice(index, 1);
    setFormData({
      ...formData,
      personalInfo: updatedPersonalInfo
    });
  };

  const handleAddServiceOption = () => {
    setFormData({
      ...formData,
      serviceSelection: {
        ...formData.serviceSelection,
        options: [...formData.serviceSelection.options, 'New Service']
      }
    });
  };

  const handleRemoveServiceOption = (index) => {
    const updatedOptions = [...formData.serviceSelection.options];
    updatedOptions.splice(index, 1);
    setFormData({
      ...formData,
      serviceSelection: {
        ...formData.serviceSelection,
        options: updatedOptions
      }
    });
  };

  const handleAddOutputOption = (type) => {
    const newOption = {
      id: `${type}_${Date.now()}`,
      label: `New ${type} Option`,
      isDefault: false
    };
    setFormData({
      ...formData,
      outputOptions: {
        ...formData.outputOptions,
        [type]: [...formData.outputOptions[type], newOption]
      }
    });
  };

  const handleRemoveOutputOption = (type, index) => {
    const updatedOptions = [...formData.outputOptions[type]];
    updatedOptions.splice(index, 1);
    setFormData({
      ...formData,
      outputOptions: {
        ...formData.outputOptions,
        [type]: updatedOptions
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/get-quote?section=form', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Form section');
      }
    } catch (error) {
      console.error('Error saving form data:', error);
      setError('Failed to save Form section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Quote Form | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/get-quote" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Edit Quote Form</h1>
          </div>

          <button
            className="admin-page__save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {saveSuccess && (
          <div className="admin-page__success">
            <i className="fa-solid fa-check-circle"></i> Form settings saved successfully!
          </div>
        )}

        {error && (
          <div className="admin-page__error">
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="admin-page__tabs">
          <button
            className={`admin-page__tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`admin-page__tab ${activeTab === 'personal-info' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal-info')}
          >
            Personal Info
          </button>
          <button
            className={`admin-page__tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`admin-page__tab ${activeTab === 'output-options' ? 'active' : ''}`}
            onClick={() => setActiveTab('output-options')}
          >
            Output Options
          </button>
          <button
            className={`admin-page__tab ${activeTab === 'message' ? 'active' : ''}`}
            onClick={() => setActiveTab('message')}
          >
            Message
          </button>
          <button
            className={`admin-page__tab ${activeTab === 'file-upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('file-upload')}
          >
            File Upload
          </button>
          <button
            className={`admin-page__tab ${activeTab === 'submission' ? 'active' : ''}`}
            onClick={() => setActiveTab('submission')}
          >
            Submission
          </button>
        </div>

        <div className="admin-page__content">
          {activeTab === 'general' && (
            <div className="admin-page__section">
              <h2 className="admin-page__section-title">General Form Settings</h2>

              <div className="admin-page__field">
                <label className="admin-page__label">Form Title</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter form title"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Form Description</label>
                <textarea
                  className="admin-page__textarea"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'personal-info' && (
            <div className="admin-page__section">
              <div className="admin-page__section-header">
                <h2 className="admin-page__section-title">Personal Information Fields</h2>
                <button
                  className="admin-page__add-button"
                  onClick={handleAddPersonalInfo}
                >
                  <i className="fa-solid fa-plus"></i> Add Field
                </button>
              </div>

              {formData.personalInfo.length === 0 ? (
                <div className="admin-page__message">
                  <p>No personal info fields added yet. Click &quot;Add Field&quot; to get started.</p>
                </div>
              ) : (
                <div className="admin-page__items">
                  {formData.personalInfo.map((field, index) => (
                    <div key={field.id || index} className="admin-page__item">
                      <div className="admin-page__item-header">
                        <h3 className="admin-page__item-title">{field.label || `Field #${index + 1}`}</h3>
                        <button
                          className="admin-page__remove-button"
                          onClick={() => handleRemovePersonalInfo(index)}
                        >
                          <i className="fa-solid fa-trash"></i> Remove
                        </button>
                      </div>

                      <div className="admin-page__item-fields">
                        <div className="admin-page__field">
                          <label className="admin-page__label">Field ID</label>
                          <input
                            type="text"
                            className="admin-page__input"
                            value={field.id || ''}
                            onChange={(e) => handlePersonalInfoChange(index, 'id', e.target.value)}
                            placeholder="Enter field ID"
                          />
                        </div>

                        <div className="admin-page__field">
                          <label className="admin-page__label">Label</label>
                          <input
                            type="text"
                            className="admin-page__input"
                            value={field.label || ''}
                            onChange={(e) => handlePersonalInfoChange(index, 'label', e.target.value)}
                            placeholder="Enter field label"
                          />
                        </div>

                        <div className="admin-page__field">
                          <label className="admin-page__label">Field Type</label>
                          <select
                            className="admin-page__select"
                            value={field.type || 'text'}
                            onChange={(e) => handlePersonalInfoChange(index, 'type', e.target.value)}
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                          </select>
                        </div>

                        <div className="admin-page__field">
                          <label className="admin-page__label">Placeholder</label>
                          <input
                            type="text"
                            className="admin-page__input"
                            value={field.placeholder || ''}
                            onChange={(e) => handlePersonalInfoChange(index, 'placeholder', e.target.value)}
                            placeholder="Enter placeholder text"
                          />
                        </div>

                        <div className="admin-page__field admin-page__field--checkbox">
                          <input
                            type="checkbox"
                            id={`required-${field.id || index}`}
                            checked={field.required || false}
                            onChange={(e) => handlePersonalInfoChange(index, 'required', e.target.checked)}
                          />
                          <label htmlFor={`required-${field.id || index}`}>Required Field</label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="admin-page__section">
              <h2 className="admin-page__section-title">Service Selection</h2>

              <div className="admin-page__field">
                <label className="admin-page__label">Section Label</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.serviceSelection.label || ''}
                  onChange={(e) => handleNestedChange('serviceSelection', 'label', e.target.value)}
                  placeholder="Enter section label"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Section Title</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.serviceSelection.title || ''}
                  onChange={(e) => handleNestedChange('serviceSelection', 'title', e.target.value)}
                  placeholder="Enter section title"
                />
              </div>

              <div className="admin-page__section-header">
                <h3 className="admin-page__subsection-title">Service Options</h3>
                <button
                  className="admin-page__add-button"
                  onClick={handleAddServiceOption}
                >
                  <i className="fa-solid fa-plus"></i> Add Option
                </button>
              </div>

              {formData.serviceSelection.options.length === 0 ? (
                <div className="admin-page__message">
                  <p>No service options added yet. Click &quot;Add Option&quot; to get started.</p>
                </div>
              ) : (
                <div className="admin-page__items">
                  {formData.serviceSelection.options.map((option, index) => (
                    <div key={index} className="admin-page__item">
                      <div className="admin-page__item-header">
                        <h3 className="admin-page__item-title">Option #{index + 1}</h3>
                        <button
                          className="admin-page__remove-button"
                          onClick={() => handleRemoveServiceOption(index)}
                        >
                          <i className="fa-solid fa-trash"></i> Remove
                        </button>
                      </div>

                      <div className="admin-page__item-fields">
                        <div className="admin-page__field">
                          <label className="admin-page__label">Option Label</label>
                          <input
                            type="text"
                            className="admin-page__input"
                            value={option || ''}
                            onChange={(e) => handleServiceOptionChange(index, e.target.value)}
                            placeholder="Enter option label"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'output-options' && (
            <div className="admin-page__section">
              <h2 className="admin-page__section-title">Output Options</h2>

              <div className="admin-page__field">
                <label className="admin-page__label">Section Title</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.outputOptions.title || ''}
                  onChange={(e) => handleNestedChange('outputOptions', 'title', e.target.value)}
                  placeholder="Enter section title"
                />
              </div>

              <div className="admin-page__subsection">
                <div className="admin-page__section-header">
                  <h3 className="admin-page__subsection-title">File Format Options</h3>
                  <button
                    className="admin-page__add-button"
                    onClick={() => handleAddOutputOption('fileFormat')}
                  >
                    <i className="fa-solid fa-plus"></i> Add Option
                  </button>
                </div>

                {formData.outputOptions.fileFormat.length === 0 ? (
                  <div className="admin-page__message">
                    <p>No file format options added yet. Click &quot;Add Option&quot; to get started.</p>
                  </div>
                ) : (
                  <div className="admin-page__items">
                    {formData.outputOptions.fileFormat.map((option, index) => (
                      <div key={option.id || index} className="admin-page__item">
                        <div className="admin-page__item-header">
                          <h3 className="admin-page__item-title">{option.label || `Option #${index + 1}`}</h3>
                          <button
                            className="admin-page__remove-button"
                            onClick={() => handleRemoveOutputOption('fileFormat', index)}
                          >
                            <i className="fa-solid fa-trash"></i> Remove
                          </button>
                        </div>

                        <div className="admin-page__item-fields">
                          <div className="admin-page__field">
                            <label className="admin-page__label">Option ID</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={option.id || ''}
                              onChange={(e) => handleOutputOptionChange('fileFormat', index, 'id', e.target.value)}
                              placeholder="Enter option ID"
                            />
                          </div>

                          <div className="admin-page__field">
                            <label className="admin-page__label">Option Label</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={option.label || ''}
                              onChange={(e) => handleOutputOptionChange('fileFormat', index, 'label', e.target.value)}
                              placeholder="Enter option label"
                            />
                          </div>

                          <div className="admin-page__field admin-page__field--checkbox">
                            <input
                              type="checkbox"
                              id={`default-fileFormat-${option.id || index}`}
                              checked={option.isDefault || false}
                              onChange={(e) => handleOutputOptionChange('fileFormat', index, 'isDefault', e.target.checked)}
                            />
                            <label htmlFor={`default-fileFormat-${option.id || index}`}>Default Option</label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-page__subsection">
                <div className="admin-page__section-header">
                  <h3 className="admin-page__subsection-title">Background Options</h3>
                  <button
                    className="admin-page__add-button"
                    onClick={() => handleAddOutputOption('background')}
                  >
                    <i className="fa-solid fa-plus"></i> Add Option
                  </button>
                </div>

                {formData.outputOptions.background.length === 0 ? (
                  <div className="admin-page__message">
                    <p>No background options added yet. Click &quot;Add Option&quot; to get started.</p>
                  </div>
                ) : (
                  <div className="admin-page__items">
                    {formData.outputOptions.background.map((option, index) => (
                      <div key={option.id || index} className="admin-page__item">
                        <div className="admin-page__item-header">
                          <h3 className="admin-page__item-title">{option.label || `Option #${index + 1}`}</h3>
                          <button
                            className="admin-page__remove-button"
                            onClick={() => handleRemoveOutputOption('background', index)}
                          >
                            <i className="fa-solid fa-trash"></i> Remove
                          </button>
                        </div>

                        <div className="admin-page__item-fields">
                          <div className="admin-page__field">
                            <label className="admin-page__label">Option ID</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={option.id || ''}
                              onChange={(e) => handleOutputOptionChange('background', index, 'id', e.target.value)}
                              placeholder="Enter option ID"
                            />
                          </div>

                          <div className="admin-page__field">
                            <label className="admin-page__label">Option Label</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={option.label || ''}
                              onChange={(e) => handleOutputOptionChange('background', index, 'label', e.target.value)}
                              placeholder="Enter option label"
                            />
                          </div>

                          <div className="admin-page__field admin-page__field--checkbox">
                            <input
                              type="checkbox"
                              id={`default-background-${option.id || index}`}
                              checked={option.isDefault || false}
                              onChange={(e) => handleOutputOptionChange('background', index, 'isDefault', e.target.checked)}
                            />
                            <label htmlFor={`default-background-${option.id || index}`}>Default Option</label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-page__subsection">
                <div className="admin-page__section-header">
                  <h3 className="admin-page__subsection-title">Path Options</h3>
                  <button
                    className="admin-page__add-button"
                    onClick={() => handleAddOutputOption('path')}
                  >
                    <i className="fa-solid fa-plus"></i> Add Option
                  </button>
                </div>

                {formData.outputOptions.path.length === 0 ? (
                  <div className="admin-page__message">
                    <p>No path options added yet. Click &quot;Add Option&quot; to get started.</p>
                  </div>
                ) : (
                  <div className="admin-page__items">
                    {formData.outputOptions.path.map((option, index) => (
                      <div key={option.id || index} className="admin-page__item">
                        <div className="admin-page__item-header">
                          <h3 className="admin-page__item-title">{option.label || `Option #${index + 1}`}</h3>
                          <button
                            className="admin-page__remove-button"
                            onClick={() => handleRemoveOutputOption('path', index)}
                          >
                            <i className="fa-solid fa-trash"></i> Remove
                          </button>
                        </div>

                        <div className="admin-page__item-fields">
                          <div className="admin-page__field">
                            <label className="admin-page__label">Option ID</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={option.id || ''}
                              onChange={(e) => handleOutputOptionChange('path', index, 'id', e.target.value)}
                              placeholder="Enter option ID"
                            />
                          </div>

                          <div className="admin-page__field">
                            <label className="admin-page__label">Option Label</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={option.label || ''}
                              onChange={(e) => handleOutputOptionChange('path', index, 'label', e.target.value)}
                              placeholder="Enter option label"
                            />
                          </div>

                          <div className="admin-page__field admin-page__field--checkbox">
                            <input
                              type="checkbox"
                              id={`default-path-${option.id || index}`}
                              checked={option.isDefault || false}
                              onChange={(e) => handleOutputOptionChange('path', index, 'isDefault', e.target.checked)}
                            />
                            <label htmlFor={`default-path-${option.id || index}`}>Default Option</label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'message' && (
            <div className="admin-page__section">
              <h2 className="admin-page__section-title">Message Field</h2>

              <div className="admin-page__field">
                <label className="admin-page__label">Field ID</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.message.id || ''}
                  onChange={(e) => handleNestedChange('message', 'id', e.target.value)}
                  placeholder="Enter field ID"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Label</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.message.label || ''}
                  onChange={(e) => handleNestedChange('message', 'label', e.target.value)}
                  placeholder="Enter field label"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Field Type</label>
                <select
                  className="admin-page__select"
                  value={formData.message.type || 'textarea'}
                  onChange={(e) => handleNestedChange('message', 'type', e.target.value)}
                >
                  <option value="textarea">Textarea</option>
                  <option value="text">Text</option>
                </select>
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Placeholder</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.message.placeholder || ''}
                  onChange={(e) => handleNestedChange('message', 'placeholder', e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>

              <div className="admin-page__field admin-page__field--checkbox">
                <input
                  type="checkbox"
                  id="message-required"
                  checked={formData.message.required || false}
                  onChange={(e) => handleNestedChange('message', 'required', e.target.checked)}
                />
                <label htmlFor="message-required">Required Field</label>
              </div>
            </div>
          )}

          {activeTab === 'file-upload' && (
            <div className="admin-page__section">
              <h2 className="admin-page__section-title">File Upload</h2>

              <div className="admin-page__field">
                <label className="admin-page__label">Label</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.fileUpload.label || ''}
                  onChange={(e) => handleNestedChange('fileUpload', 'label', e.target.value)}
                  placeholder="Enter field label"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Description</label>
                <textarea
                  className="admin-page__textarea"
                  value={formData.fileUpload.description || ''}
                  onChange={(e) => handleNestedChange('fileUpload', 'description', e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Max File Size</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.fileUpload.maxSize || ''}
                  onChange={(e) => handleNestedChange('fileUpload', 'maxSize', e.target.value)}
                  placeholder="Enter max file size (e.g., 10MB)"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Alternative Text</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.fileUpload.alternativeText || ''}
                  onChange={(e) => handleNestedChange('fileUpload', 'alternativeText', e.target.value)}
                  placeholder="Enter alternative text"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Link Placeholder</label>
                <input
                  type="text"
                  className="admin-page__input"
                  value={formData.fileUpload.linkPlaceholder || ''}
                  onChange={(e) => handleNestedChange('fileUpload', 'linkPlaceholder', e.target.value)}
                  placeholder="Enter link placeholder"
                />
              </div>
            </div>
          )}

          {activeTab === 'submission' && (
            <div className="admin-page__section">
              <h2 className="admin-page__section-title">Form Submission</h2>

              <div className="admin-page__field">
                <label className="admin-page__label">Terms Text</label>
                <textarea
                  className="admin-page__textarea"
                  value={formData.terms.text || ''}
                  onChange={(e) => handleNestedChange('terms', 'text', e.target.value)}
                  placeholder="Enter terms text"
                  rows={3}
                />
              </div>

              <div className="admin-page__field admin-page__field--checkbox">
                <input
                  type="checkbox"
                  id="terms-required"
                  checked={formData.terms.required}
                  onChange={(e) => handleNestedChange('terms', 'required', e.target.checked)}
                />
                <label htmlFor="terms-required">Required Field</label>
              </div>


              <div className="admin-page__field">
                <label className="admin-page__label">Success Message</label>
                <textarea
                  className="admin-page__textarea"
                  value={formData.successMessage || ''}
                  onChange={(e) => handleInputChange('successMessage', e.target.value)}
                  placeholder="Enter success message"
                  rows={3}
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Error Message</label>
                <textarea
                  className="admin-page__textarea"
                  value={formData.errorMessage || ''}
                  onChange={(e) => handleInputChange('errorMessage', e.target.value)}
                  placeholder="Enter error message"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-page__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
        }

        .admin-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-page__title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-page__back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: #f1f5f9;
          color: #1e293b;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .admin-page__back-link:hover {
          background-color: #e2e8f0;
        }

        .admin-page__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-page__save-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .admin-page__save-button:hover:not(:disabled) {
          background-color: #3b5bd9;
        }

        .admin-page__save-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .admin-page__success {
          padding: 12px 16px;
          background-color: #dcfce7;
          color: #166534;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-page__error {
          padding: 12px 16px;
          background-color: #fee2e2;
          color: #b91c1c;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-page__tabs {
          display: flex;
          gap: 2px;
          margin-bottom: 24px;
          overflow-x: auto;
          background-color: #f1f5f9;
          border-radius: 8px;
        }

        .admin-page__tab {
          padding: 12px 16px;
          background-color: transparent;
          color: #64748b;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .admin-page__tab.active {
          background-color: white;
          color: #4569e7;
          font-weight: 600;
        }

        .admin-page__tab:hover:not(.active) {
          background-color: #e2e8f0;
        }

        .admin-page__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .admin-page__section {
          margin-bottom: 24px;
        }

        .admin-page__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-page__section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-page__subsection {
          margin-top: 24px;
          margin-bottom: 24px;
          padding-top: 16px;
          border-top: 1px dashed #e2e8f0;
        }

        .admin-page__subsection-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-page__add-button {
          padding: 6px 12px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .admin-page__add-button:hover {
          background-color: #3b5bd9;
        }

        .admin-page__field {
          margin-bottom: 16px;
        }

        .admin-page__field--checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-page__label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .admin-page__input,
        .admin-page__textarea,
        .admin-page__select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-page__textarea {
          resize: vertical;
        }

        .admin-page__message {
          padding: 16px;
          background-color: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 4px;
          text-align: center;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-page__items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-page__item {
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .admin-page__item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-page__item-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-page__remove-button {
          padding: 4px 8px;
          background-color: #fee2e2;
          color: #b91c1c;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .admin-page__remove-button:hover {
          background-color: #fecaca;
        }

        .admin-page__item-fields {
          padding: 16px;
        }
      `}</style>
    </AdminLayout>
  );
};

export default QuoteFormEditor;
