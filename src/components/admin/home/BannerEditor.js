import React, { useState, useCallback } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';
import ImageUploader from '@/components/admin/common/ImageUploader';

const BannerEditor = ({ data = {}, onChange, preview }) => {
  const [uploadingImage, setUploadingImage] = useState(null);

  // Initialize with default values if not provided
  const editorData = {
    title: data?.title || '',
    subtitle: data?.subtitle || '',
    images: {
      main: data?.images?.main || '',
      after: data?.images?.after || '',
      smallImages: Array.isArray(data?.images?.smallImages) 
        ? [...data.images.smallImages] 
        : ['', '', '', ''], // Initialize with 4 empty strings
      smallImagesPublicIds: Array.isArray(data?.images?.smallImagesPublicIds)
        ? [...data.images.smallImagesPublicIds]
        : []
    }
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleImageChange = useCallback((field, imageUrl, publicId = '') => {
    if (!onChange) return;
    
    console.log(`Image changed for ${field}:`, { imageUrl, publicId });

    if (field === 'main') {
      onChange(prevData => {
        const images = prevData.images || {};
        const updatedData = {
          ...prevData,
          images: {
            ...images,
            main: imageUrl,
            ...(publicId ? { mainPublicId: publicId } : {})
          }
        };
        console.log('Updated main image data:', updatedData);
        return updatedData;
      });
    } else if (field.startsWith('smallImage')) {
      const index = parseInt(field.replace('smallImage', ''), 10);
      
      onChange(prevData => {
        const images = prevData.images || {};
        
        // Ensure smallImages array exists and has enough items
        const currentSmallImages = Array.isArray(images.smallImages) 
          ? [...images.smallImages] 
          : Array(4).fill('');
          
        // Ensure smallImagesPublicIds array exists and has enough items
        const currentPublicIds = Array.isArray(images.smallImagesPublicIds)
          ? [...images.smallImagesPublicIds]
          : [];
          
        // Ensure arrays are large enough
        while (currentSmallImages.length <= index) {
          currentSmallImages.push('');
        }
        while (currentPublicIds.length <= index) {
          currentPublicIds.push('');
        }
        
        // Update the specific image and its public ID
        currentSmallImages[index] = imageUrl;
        if (publicId) {
          currentPublicIds[index] = publicId;
        }
        
        const updatedImages = {
          ...images,
          smallImages: currentSmallImages,
          smallImagesPublicIds: currentPublicIds
        };
        
        const updatedData = {
          ...prevData,
          images: updatedImages
        };
        
        console.log('Updated small image data:', {
          index,
          imageUrl,
          publicId,
          updatedData
        });
        
        return updatedData;
      });
    }
  }, [onChange]);

  // Extract public ID from a Cloudinary URL
  const getPublicIdFromUrl = (url) => {
    if (!url) return '';
    // Extract public ID from Cloudinary URL format
    const matches = url.match(/upload\/v\d+\/([^\/]+)\./);
    return matches ? matches[1] : '';
  };

  if (preview) {
    return (
      <div className="banner-preview">
        <div className="banner-preview__content">
          <h3 className="banner-preview__subtitle">{editorData.subtitle}</h3>
          <h2 className="banner-preview__title">{editorData.title}</h2>
          {/* Button preview removed as per requirements */}
        </div>

        <div className="banner-preview__images">
          <div className="banner-preview__main-image">
            {editorData.images.main && (
              <ImageWithFallback
                src={editorData.images.main}
                alt="Banner Main"
                width={200}
                height={150}
              />
            )}
          </div>

          <div className="banner-preview__small-images">
            {editorData.images.smallImages.map((img, index) => (
              <div key={index} className="banner-preview__small-image">
                <ImageWithFallback
                  src={img}
                  alt={`Small Image ${index + 1}`}
                  width={50}
                  height={50}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="banner-editor">
      <div className="banner-editor__form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={editorData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={editorData.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <div className="banner-editor__images">
        <h3 className="banner-editor__images-title">Banner Images</h3>

        <div className="banner-editor__image-group">
          <label>Main Image</label>
          <div className="banner-editor__image-preview">
            <ImageWithFallback
              src={editorData.images?.main || '/images/placeholder-image.png'}
              alt="Banner Main"
              width={200}
              height={150}
              onError={(e) => {
                e.target.src = '/images/placeholder-image.png';
              }}
            />
          </div>
          <div className="banner-editor__image-upload">
            <ImageUploader
              currentImage={editorData.images?.main}
              onImageUpload={(url) => handleImageChange('main', url, getPublicIdFromUrl(editorData.images?.main))}
              folder="home/banner"
              label="Main Banner Image"
              recommendedSize="1920x1080px"
              className="banner-editor__image-uploader"
            />
          </div>
          <div className="banner-editor__image-help">
            <p className="banner-editor__help-text">
              <strong>Recommended size:</strong> 1920x1080px
            </p>
            <p className="banner-editor__help-text">
              <strong>Image types:</strong> JPEG, PNG, WEBP
            </p>
          </div>
        </div>

        <h4 className="banner-editor__small-images-title">Small Images</h4>

        <div className="banner-editor__small-images">
          {[0, 1, 2, 3].map((index) => {
            const img = editorData.images?.smallImages?.[index] || '';
            const oldPublicId = editorData.images?.smallImagesPublicIds?.[index] || 
                              (img ? getPublicIdFromUrl(img) : '');
            
            return (
              <div key={index} className="banner-editor__small-image-group">
                <label>Small Image {index + 1}</label>
                <div className="banner-editor__image-preview">
                  <ImageWithFallback
                    src={img || '/images/placeholder-image.png'}
                    alt={`Small Image ${index + 1}`}
                    width={100}
                    height={100}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-image.png';
                    }}
                  />
                </div>
                <div className="banner-editor__image-upload">
                  <ImageUploader
                    currentImage={img}
                    onImageSelect={(file) => {
                      console.log(`Small image ${index} selected:`, file);
                      // Store the file for upload
                      setUploadingImage(`smallImage${index}`);
                    }}
                    onImageUpload={(url, publicId) => {
                      console.log(`Small image ${index} uploaded:`, { url, publicId });
                      handleImageChange(`smallImage${index}`, url, publicId);
                      setUploadingImage(null);
                    }}
                    folder="home/banner/small"
                    label={`Small Image ${index + 1}`}
                    recommendedSize="400x400px"
                    className="banner-editor__image-uploader"
                    oldPublicId={oldPublicId}
                    uploadOnSelect={true}
                  />
                  {uploadingImage === `smallImage${index}` && (
                    <div className="uploading-indicator">Uploading...</div>
                  )}
                </div>
                <div className="banner-editor__image-help">
                  <p className="banner-editor__help-text">
                    <strong>Recommended size:</strong> 400x400px
                  </p>
                  <p className="banner-editor__help-text">
                    <strong>Image types:</strong> JPEG, PNG, WEBP
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .banner-editor {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .banner-editor__form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-control {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .banner-editor__images {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-editor__images-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .banner-editor__image-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .banner-editor__image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100px;
        }

        .banner-editor__small-images-title {
          font-size: 14px;
          font-weight: 600;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .banner-editor__small-images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .banner-editor__small-image-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-control-file {
          font-size: 14px;
        }

        /* Preview Styles */
        .banner-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-preview__content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .banner-preview__subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }

        .banner-preview__title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        /* Button styles removed as per requirements */

        .banner-preview__images {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .banner-preview__main-image {
          flex: 1;
        }

        .banner-preview__small-images {
          display: flex;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .banner-editor {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BannerEditor;
