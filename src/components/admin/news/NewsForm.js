import React, { useState } from 'react';
import Image from 'next/image';

const NewsForm = ({ news, onSave, onCancel }) => {
  const [formData, setFormData] = useState(news || {
    id: Date.now(),
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '/images/news/one.png',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title' && !formData.slug) {
      // Auto-generate slug from title
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      setFormData({
        ...formData,
        title: value,
        slug
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/image?folder=news', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.path) {
        setFormData(prev => ({
          ...prev,
          image: result.path
        }));
      } else {
        throw new Error('No path returned from server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.excerpt) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content) newErrors.content = 'Content is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Failed to save news. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="news-form">
      <div className="news-form__grid">
        <div className="news-form__main">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
            />
            {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
            <small className="form-text text-muted">
              The slug is used in the URL of the news article (e.g., /news/your-slug)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className={`form-control ${errors.excerpt ? 'is-invalid' : ''}`}
              rows={3}
            />
            {errors.excerpt && <div className="invalid-feedback">{errors.excerpt}</div>}
            <small className="form-text text-muted">
              A short summary of the article that appears in listings
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`form-control ${errors.content ? 'is-invalid' : ''}`}
              rows={10}
            />
            {errors.content && <div className="invalid-feedback">{errors.content}</div>}
          </div>
        </div>

        <div className="news-form__sidebar">
          <div className="form-group">
            <label>Featured Image</label>
            <div className="news-form__image-preview">
              {formData.image && (
                <Image
                  src={formData.image}
                  alt="Featured Image"
                  width={300}
                  height={200}
                />
              )}
            </div>
            <div className="news-form__image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-control-file"
              />
              {uploadingImage && <span>Uploading...</span>}
            </div>
            <div className="news-form__image-help">
              <p className="form-text">
                <strong>Recommended size:</strong> 800x600px
              </p>
              <p className="form-text">
                <strong>Image types:</strong> JPEG, PNG, WEBP
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            />
            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`form-control ${errors.author ? 'is-invalid' : ''}`}
            />
            {errors.author && <div className="invalid-feedback">{errors.author}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="news-form__tags-input">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                className="form-control"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>

            <div className="news-form__tags">
              {formData.tags.map((tag, index) => (
                <div key={index} className="news-form__tag">
                  {tag}
                  <button
                    type="button"
                    className="news-form__tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="news-form__actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save News'}
        </button>
      </div>

      <style jsx>{`
        .news-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .news-form__grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .news-form__main,
        .news-form__sidebar {
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

        .form-control.is-invalid {
          border-color: #ef4444;
        }

        .invalid-feedback {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        .form-text {
          font-size: 12px;
          color: #64748b;
        }

        .news-form__image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          margin-bottom: 8px;
        }

        .news-form__tags-input {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .news-form__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .news-form__tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background-color: #f1f5f9;
          border-radius: 4px;
          font-size: 12px;
        }

        .news-form__tag-remove {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .news-form__actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 16px;
        }

        .btn {
          padding: 8px 16px;
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

        .btn-secondary {
          background-color: #f1f5f9;
          color: #1e293b;
        }

        .btn-secondary:hover {
          background-color: #e2e8f0;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .news-form__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
};

export default NewsForm;
