/**
 * Uploads an image file to the server
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder to save the image in (e.g., 'sponsor', 'project')
 * @returns {Promise<string>} - The path to the uploaded image
 */
export const uploadImage = async (file, folder = 'uploads') => {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);

    // Send the file to the server
    const response = await fetch(`/api/upload/image?folder=${folder}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    // Return the path with a timestamp to force cache busting
    return data.cacheBustedPath || `${data.path}?t=${Date.now()}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Deletes an image file from the server
 * @param {string} imagePath - The path to the image to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
export const deleteImage = async (imagePath) => {
  try {
    // Send a request to delete the image
    const response = await fetch(`/api/upload/delete?path=${encodeURIComponent(imagePath)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete image');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * Adds a cache-busting parameter to an image URL to prevent browser caching
 * @param {string} url - The image URL
 * @param {string} placeholderImage - Optional placeholder image to use if URL is empty
 * @returns {string} - The URL with a cache-busting parameter
 */
export const getCacheBustedUrl = (url, placeholderImage = '/images/placeholder.png') => {
  // Handle data URLs (for previews) and placeholder images
  if (!url || url === placeholderImage || url.startsWith('data:')) {
    return url || placeholderImage;
  }

  // If the URL already has a timestamp parameter, use it
  if (url.includes('t=') && (url.includes('?t=') || url.includes('&t='))) {
    return url;
  }

  // Add a timestamp parameter
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${new Date().getTime()}`;
};
