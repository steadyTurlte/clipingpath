# Photo Edit - Development TODO

## Current Task: Delete Duplicate Images
- [ ] Update `uploadToCloudinary` in `src/utils/cloudinaryUtils.js` to handle old image deletion
- [ ] Modify `ImageUploader` component to pass old public ID when replacing images
- [ ] Update any direct Cloudinary upload calls to handle old image deletion
- [ ] Test image replacement to ensure old images are properly deleted

## Page Implementation Status

### Admin Panel

#### Home Page
- [x] Home Banner
- [x] About Section
- [x] Services Preview
- [x] Why Choose Us
- [x] Testimonials
- [x] CTA Section
- [x] Sponsors
- [x] Pricing

#### About Page
- [x] Banner
- [x] Overview
- [x] Team Members
- [x] FAQ
- [x] CTA
- [x] Sponsors

#### Portfolio
- [x] Portfolio List
- [x] Add/Edit Portfolio Item
- [x] Portfolio Categories
- [x] Portfolio Banner

#### Services
- [x] Services List
- [x] Add/Edit Service
- [x] Service Categories
- [x] Service Banner

#### Contact
- [x] Contact Info
- [x] Map Settings
- [x] Email Settings
- [x] Contact Form Fields

#### Get a Quote
- [x] Quote Form
- [x] Form Fields
- [x] Gallery
- [x] Instructions
- [x] Statistics

#### Media Library
- [x] Media Uploader
- [x] Media Manager
- [ ] Implement duplicate image prevention

### Public Pages

#### Home
- [x] Hero Banner
- [x] Services Showcase
- [x] Portfolio Preview
- [x] About Section
- [x] Testimonials
- [x] CTA Section

#### About Us
- [x] About Banner
- [x] Our Story
- [x] Team Members
- [x] Why Choose Us
- [x] Testimonials

#### Services
- [x] Services List
- [x] Service Details
- [x] Service Categories

#### Portfolio
- [x] Portfolio Grid
- [x] Portfolio Details
- [x] Portfolio Categories
- [x] Filtering

#### Contact
- [x] Contact Form
- [x] Contact Info
- [x] Map

#### Get a Quote
- [x] Quote Form
- [x] File Upload
- [x] Form Validation

## Image Upload Migration to Cloudinary

This document tracks the progress of migrating all image upload functionality to use Cloudinary with database tracking.

## Implementation Status

### Core Components
- [x] Cloudinary utility functions
- [x] Image upload API endpoint
- [x] Basic ImageUploader component
- [x] Common ImageUploader component with preview
- [x] MediaUploader component (updated with Cloudinary integration)

## Pages Needing Updates

### 1. Home Page
- [x] `/admin/home/banner.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/home/cta.js` - Updated to use Cloudinary ImageUploader

### 2. About Page
- [x] `/admin/about/banner.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/about/main.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/about/team.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/about/sponsors.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/about/overview.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/about/faq.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/about/cta.js` - Updated to use Cloudinary ImageUploader

### 3. Services Page
- [x] `/admin/services/testimonials.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/services/services.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/services/banner.js` - Updated to use Cloudinary ImageUploader

### 4. Portfolio Page
- [x] `/admin/portfolio/banner.js` - Updated to use Cloudinary ImageUploader

### 5. Get a Quote Page
- [x] `/admin/get-quote/banner.js` - Updated to use Cloudinary ImageUploader
- [x] `/admin/get-quote/form/index.js` - No image upload functionality needed

### 6. Contact Page
- [x] `/admin/contact/banner.js` - Updated to use Cloudinary ImageUploader

## Components Needing Updates
- [x] `src/components/admin/media/MediaUploader.js` - Updated with Cloudinary integration

## Implementation Notes

1. **For ImageUploader components**:
   - These are already set up to use Cloudinary
   - Just need to ensure `oldPublicId` is passed when replacing images

2. **For direct formData.append usage**:
   - Need to replace with ImageUploader component
   - Or update to use the Cloudinary upload API directly

3. **Database Considerations**:
   - All uploaded images are tracked in the `media_files` table
   - Each entry includes Cloudinary public_id and URL

## Testing Checklist
- [ ] Test image upload for each updated page
- [ ] Verify old images are deleted when replaced
- [ ] Check database entries for new uploads
- [ ] Test with different image formats and sizes
- [ ] Verify error handling for failed uploads

## Technical Improvements
- [ ] Implement proper image optimization
- [ ] Add lazy loading for images
- [ ] Implement proper error handling for image uploads
- [ ] Add image compression before upload
- [ ] Implement proper file type validation
- [ ] Add progress indicators for uploads
- [ ] Implement proper error messages for failed uploads

## Testing
- [ ] Test image replacement across all pages
- [ ] Verify no broken image links after updates
- [ ] Test with different file types and sizes
- [ ] Verify proper error handling

## Documentation
- [ ] Document image upload process
- [ ] Create admin guide for managing images
- [ ] Document API endpoints for image handling

## Notes
- All pages are currently implemented and functional
- The main focus now is on improving the image handling and preventing duplicates
- After completing the duplicate image handling, we can move on to other improvements
