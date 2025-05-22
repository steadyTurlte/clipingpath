/**
 * Utility function to fetch data for pages using SSR
 * This ensures that pages always show the latest data from the admin panel
 */

import { getData } from './dataUtils';

/**
 * Fetch data for a specific page
 * @param {string} page - The page to fetch data for (e.g., 'home', 'about', 'services')
 * @returns {Object} - The page data
 */
export const fetchPageData = (page) => {
  try {
    // Get the page data from the JSON file
    const pageData = getData(page);

    // Return the entire page data
    return pageData || {};
  } catch (error) {
    console.error(`Error fetching data for page ${page}:`, error);
    return {};
  }
};

/**
 * Fetch settings data
 * @returns {Object} - The settings data
 */
export const fetchSettings = () => {
  try {
    const settings = getData('settings') || {};
    return settings;
  } catch (error) {
    console.error('Error fetching settings data:', error);
    return {};
  }
};
