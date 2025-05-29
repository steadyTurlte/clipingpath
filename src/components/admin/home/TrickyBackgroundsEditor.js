import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const TrickyBackgroundsEditor = ({ data = {}, onChange, preview }) => {
  const [uploadingImage, setUploadingImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const editorData = {
    ...data,
    categories: [
      ...data.categories
    ],
    decorativeImage: data.decorativeImage
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleCategoryChange = (index, field, value) => {
    if (!onChange) return;

    const newCategories = [...editorData.categories];
    newCategories[index] = {
      ...newCategories[index],
      [field]: value
    };

    onChange({
      ...editorData,
      categories: newCategories
    });
  };

  const handleBeforeAfterImageChange = (categoryIndex, imageIndex, field, value) => {
    if (!onChange) return;

    const newCategories = [...editorData.categories];
    const newBeforeAfterImages = [...newCategories[categoryIndex].beforeAfterImages];

    newBeforeAfterImages[imageIndex] = {
      ...newBeforeAfterImages[imageIndex],
      [field]: value
    };

    newCategories[categoryIndex] = {
      ...newCategories[categoryIndex],
      beforeAfterImages: newBeforeAfterImages
    };

    onChange({
      ...editorData,
      categories: newCategories
    });
  };

  const handleAddCategory = () => {
    if (!onChange) return;

    const newCategory = {
      id: Date.now(),
      name: "New Category",
      icon: "icon-image",
      beforeAfterImages: [
        {
          before: "/images/after/one-before.png",
          after: "/images/after/one-after.png"
        }
      ]
    };

    onChange({
      ...editorData,
      categories: [...editorData.categories, newCategory]
    });

    // Set the new category as active
    setActiveCategory(editorData.categories.length);
  };

  const handleRemoveCategory = (index) => {
    if (!onChange) return;

    const newCategories = [...editorData.categories];
    newCategories.splice(index, 1);

    onChange({
      ...editorData,
      categories: newCategories
    });

    // Adjust active category if needed
    if (activeCategory >= newCategories.length) {
      setActiveCategory(Math.max(0, newCategories.length - 1));
    }
  };

  const handleAddBeforeAfterImage = (categoryIndex) => {
    if (!onChange) return;

    const newCategories = [...editorData.categories];
    const newBeforeAfterImages = [...newCategories[categoryIndex].beforeAfterImages];

    newBeforeAfterImages.push({
      before: "/images/after/one-before.png",
      after: "/images/after/one-after.png"
    });

    newCategories[categoryIndex] = {
      ...newCategories[categoryIndex],
      beforeAfterImages: newBeforeAfterImages
    };

    onChange({
      ...editorData,
      categories: newCategories
    });
  };

  const handleRemoveBeforeAfterImage = (categoryIndex, imageIndex) => {
    if (!onChange) return;

    const newCategories = [...editorData.categories];
    const newBeforeAfterImages = [...newCategories[categoryIndex].beforeAfterImages];

    newBeforeAfterImages.splice(imageIndex, 1);

    newCategories[categoryIndex] = {
      ...newCategories[categoryIndex],
      beforeAfterImages: newBeforeAfterImages
    };

    onChange({
      ...editorData,
      categories: newCategories
    });
  };

  const handleImageUpload = async (categoryIndex, imageIndex, type, e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(`${categoryIndex}-${imageIndex}-${type}`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images/after');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.filePath) {
        handleBeforeAfterImageChange(categoryIndex, imageIndex, type, result.filePath);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  // Decorative image upload functionality has been removed as per requirements

  if (preview) {
    return (
      <div className="tricky-backgrounds-preview">
        <div className="tricky-backgrounds-preview__content">
          <h3 className="tricky-backgrounds-preview__subtitle">{editorData.subtitle}</h3>
          <h2 className="tricky-backgrounds-preview__title">{editorData.title}</h2>

          <div className="tricky-backgrounds-preview__categories">
            {editorData.categories.map((category, index) => (
              <div key={category.id || index} className="tricky-backgrounds-preview__category">
                <h4>{category.name} <small>({category.icon})</small></h4>
                <div className="tricky-backgrounds-preview__images">
                  {category.beforeAfterImages.map((image, imageIndex) => (
                    <div key={imageIndex} className="tricky-backgrounds-preview__image-pair">
                      <div className="tricky-backgrounds-preview__image">
                        <span>Before</span>
                        <ImageWithFallback
                          src={image.before}
                          alt="Before"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="tricky-backgrounds-preview__image">
                        <span>After</span>
                        <ImageWithFallback
                          src={image.after}
                          alt="After"
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Decorative image preview has been removed as per requirements */}
        </div>
      </div>
    );
  }

  return (
    <div className="tricky-backgrounds-editor">
      <div className="tricky-backgrounds-editor__form">
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
          <div className="categories-header">
            <label>Categories</label>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>

          <div className="categories-tabs">
            {editorData.categories.map((category, index) => (
              <button
                key={category.id || index}
                type="button"
                className={`category-tab ${activeCategory === index ? 'active' : ''}`}
                onClick={() => setActiveCategory(index)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {editorData.categories.map((category, categoryIndex) => (
            <div
              key={category.id || categoryIndex}
              className={`category-editor ${activeCategory === categoryIndex ? 'active' : ''}`}
            >
              <div className="category-editor__header">
                <h4>Category: {category.name}</h4>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveCategory(categoryIndex)}
                >
                  Remove Category
                </button>
              </div>

              <div className="form-group">
                <label htmlFor={`category-name-${categoryIndex}`}>Name</label>
                <input
                  type="text"
                  id={`category-name-${categoryIndex}`}
                  value={category.name}
                  onChange={(e) => handleCategoryChange(categoryIndex, 'name', e.target.value)}
                  className="form-control"
                />
              </div>



              <div className="form-group">
                <div className="before-after-header">
                  <label>Before/After Images</label>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddBeforeAfterImage(categoryIndex)}
                  >
                    Add Image Pair
                  </button>
                </div>

                <div className="before-after-help">
                  <p className="form-text">
                    <strong>Recommended size:</strong> 600x400px (both before and after images)
                  </p>
                  <p className="form-text">
                    <strong>Image types:</strong> JPEG, PNG, WEBP
                  </p>
                </div>

                {category.beforeAfterImages.map((image, imageIndex) => (
                  <div key={imageIndex} className="before-after-editor">
                    <div className="before-after-editor__header">
                      <h5>Image Pair {imageIndex + 1}</h5>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveBeforeAfterImage(categoryIndex, imageIndex)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="before-after-editor__images">
                      <div className="before-after-editor__image">
                        <label>Before Image</label>
                        <div className="image-preview">
                          {image.before && (
                            <ImageWithFallback
                              src={image.before}
                              alt="Before"
                              width={150}
                              height={150}
                            />
                          )}
                        </div>
                        <div className="image-upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(categoryIndex, imageIndex, 'before', e)}
                            className="form-control-file"
                          />
                          {uploadingImage === `${categoryIndex}-${imageIndex}-before` && <span>Uploading...</span>}
                        </div>
                      </div>

                      <div className="before-after-editor__image">
                        <label>After Image</label>
                        <div className="image-preview">
                          {image.after && (
                            <ImageWithFallback
                              src={image.after}
                              alt="After"
                              width={150}
                              height={150}
                            />
                          )}
                        </div>
                        <div className="image-upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(categoryIndex, imageIndex, 'after', e)}
                            className="form-control-file"
                          />
                          {uploadingImage === `${categoryIndex}-${imageIndex}-after` && <span>Uploading...</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative image section has been removed as per requirements */}
      </div>

      <style jsx>{`
        .tricky-backgrounds-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tricky-backgrounds-editor__form {
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

        .form-text {
          font-size: 12px;
          color: #64748b;
        }

        .categories-header,
        .before-after-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .categories-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .category-tab {
          padding: 8px 16px;
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .category-tab.active {
          background-color: #4569e7;
          color: white;
          border-color: #4569e7;
        }

        .category-editor {
          display: none;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .category-editor.active {
          display: block;
        }

        .category-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .category-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .before-after-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .before-after-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .before-after-editor__header h5 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .before-after-editor__images {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .image-preview {
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

        /* Decorative images styles removed as they are not editable */

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
          .before-after-editor__images {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TrickyBackgroundsEditor;
