import React, { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const TestimonialsEditor = ({ data = {}, onChange, preview }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  const editorData = {
    ...data,
    items: [
      ...data.items
    ]
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleTestimonialChange = (index, field, value) => {
    if (!onChange) return;

    const newItems = [...editorData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    onChange({
      ...editorData,
      items: newItems
    });
  };

  const handleAddTestimonial = () => {
    if (!onChange) return;

    const newTestimonial = {
      id: Date.now(),
      name: "New Client",
      position: "Position",
      image: "/images/testimonial/one.png",
      text: "Client testimonial text goes here."
    };

    onChange({
      ...editorData,
      items: [...editorData.items, newTestimonial]
    });
  };

  const handleRemoveTestimonial = (index) => {
    if (!onChange) return;

    const newItems = [...editorData.items];
    newItems.splice(index, 1);

    onChange({
      ...editorData,
      items: newItems
    });
  };

  const handleImageUpload = async (index, e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(index);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images/testimonial');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.filePath) {
        const newItems = [...editorData.items];
        newItems[index] = {
          ...newItems[index],
          image: result.filePath
        };

        onChange({
          ...editorData,
          items: newItems
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleDecorativeImageUpload = async (e) => {
    if (!onChange) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage('decorative');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.filePath) {
        // Add a timestamp to the image URL to force a refresh
        const imageUrl = `${result.filePath}?t=${Date.now()}`;

        onChange({
          ...editorData,
          decorativeImage: imageUrl
        });
      }
    } catch (error) {
      console.error('Error uploading decorative image:', error);
      alert('Failed to upload decorative image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  if (preview) {
    return (
      <div className="testimonials-preview">
        <div className="testimonials-preview__decorative-image">
          <h5>Decorative Image:</h5>
          <ImageWithFallback
            src={editorData.decorativeImage}
            alt="Decorative Image"
            width={100}
            height={70}
          />
        </div>
        <div className="testimonials-preview__content">
          <h3 className="testimonials-preview__subtitle">{editorData.subtitle}</h3>
          <h2 className="testimonials-preview__title">{editorData.title}</h2>

          <div className="testimonials-preview__items">
            {editorData.items.map((item, index) => (
              <div key={item.id || index} className="testimonials-preview__item">
                <div className="testimonials-preview__item-header">
                  <div className="testimonials-preview__item-image">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="testimonials-preview__item-info">
                    <h4>{item.name}</h4>
                    <p>{item.position}</p>
                  </div>
                </div>
                <div className="testimonials-preview__item-text">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonials-editor">
      <div className="testimonials-editor__form">
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
          <label>Decorative Image (Bottom Left Corner)</label>
          <div className="testimonial-editor__image-preview">
            <ImageWithFallback
              src={editorData.decorativeImage}
              alt="Decorative Image"
              width={203}
              height={145}
            />
          </div>
          <div className="testimonial-editor__image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleDecorativeImageUpload}
              className="form-control-file"
            />
            {uploadingImage === 'decorative' && <span>Uploading...</span>}
          </div>
          <small className="form-text text-muted">
            This image appears in the bottom left corner of the testimonials section.
            Recommended size: 203x145 pixels.
          </small>
        </div>

        <div className="form-group">
          <div className="testimonials-header">
            <label>Testimonials</label>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleAddTestimonial}
            >
              Add Testimonial
            </button>
          </div>

          {editorData.items.map((item, index) => (
            <div key={item.id || index} className="testimonial-editor">
              <div className="testimonial-editor__header">
                <h4>Testimonial {index + 1}</h4>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveTestimonial(index)}
                >
                  Remove
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`testimonial-name-${index}`}>Name</label>
                  <input
                    type="text"
                    id={`testimonial-name-${index}`}
                    value={item.name}
                    onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`testimonial-position-${index}`}>Position</label>
                  <input
                    type="text"
                    id={`testimonial-position-${index}`}
                    value={item.position}
                    onChange={(e) => handleTestimonialChange(index, 'position', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>



              <div className="form-group">
                <label htmlFor={`testimonial-text-${index}`}>Testimonial Text</label>
                <textarea
                  id={`testimonial-text-${index}`}
                  value={item.text}
                  onChange={(e) => handleTestimonialChange(index, 'text', e.target.value)}
                  className="form-control"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Profile Image</label>
                <div className="testimonial-editor__image-preview">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="testimonial-editor__image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="form-control-file"
                  />
                  {uploadingImage === index && <span>Uploading...</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonials-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .testimonials-editor__form {
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .testimonials-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .testimonial-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .testimonial-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .testimonial-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .testimonial-editor__image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80px;
          margin-bottom: 8px;
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

        /* Preview Styles */
        .testimonials-preview {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .testimonials-preview__decorative-image {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .testimonials-preview__decorative-image h5 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .testimonials-preview__content {
          text-align: center;
          margin-bottom: 16px;
        }

        .testimonials-preview__subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }

        .testimonials-preview__title {
          font-size: 20px;
          font-weight: 700;
          margin: 8px 0 0;
        }

        .testimonials-preview__items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .testimonials-preview__item {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .testimonials-preview__item-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .testimonials-preview__item-image {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .testimonials-preview__item-info h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .testimonials-preview__item-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #64748b;
        }



        .testimonials-preview__item-text p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
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

export default TestimonialsEditor;
