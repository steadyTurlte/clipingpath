import { getData, saveData } from '@/utils/dataUtils';

// Default portfolio data
const DEFAULT_PORTFOLIO_DATA = {
  banner: {
    title: 'Portfolio',
    image: '',
    breadcrumbs: [
      { text: 'Home', link: '/' },
      { text: 'Portfolio', link: '/portfolio' }
    ]
  },
  video: {
    embedId: 'fSv6UgCkuTU',
    backgroundImage: '/images/video-modal-bg.png'
  },
  categories: [
    { id: 1, name: 'All', filter: '*' },
    { id: 2, name: 'Photo Retouch', filter: '.retouch' },
    { id: 3, name: 'Background Remove', filter: '.background' },
    { id: 4, name: 'Clipping Path', filter: '.path' },
    { id: 5, name: 'Color Correction', filter: '.color' },
    { id: 6, name: 'Drop Shadow', filter: '.drop' },
    { id: 7, name: 'E-commerce Image', filter: '.ecommerce' }
  ],
  items: [
    {
      id: 1,
      category: 'retouch',
      beforeImage: '/images/after/one-before.png',
      afterImage: '/images/after/one-after.png',
      title: 'Photo Retouch Example',
      description: 'Professional photo retouching service'
    },
    {
      id: 2,
      category: 'background',
      beforeImage: '/images/after/two-before.png',
      afterImage: '/images/after/two-after.png',
      title: 'Background Removal Example',
      description: 'Clean background removal service'
    },
    {
      id: 3,
      category: 'path',
      beforeImage: '/images/after/three-before.png',
      afterImage: '/images/after/three-after.png',
      title: 'Clipping Path Example',
      description: 'Precise clipping path service'
    },
    {
      id: 4,
      category: 'color',
      beforeImage: '/images/after/four-before.png',
      afterImage: '/images/after/four-after.png',
      title: 'Color Correction Example',
      description: 'Professional color correction service'
    },
    {
      id: 5,
      category: 'drop',
      beforeImage: '/images/after/one-before.png',
      afterImage: '/images/after/one-after.png',
      title: 'Drop Shadow Example',
      description: 'Natural drop shadow service'
    },
    {
      id: 6,
      category: 'ecommerce',
      beforeImage: '/images/after/one-before.png',
      afterImage: '/images/after/one-after.png',
      title: 'E-commerce Image Example',
      description: 'E-commerce ready image editing'
    }
  ],
  sponsors: {
    title: 'Trusted by Leading Brands',
    logos: [
      '/images/sponsor/one.png',
      '/images/sponsor/two.png',
      '/images/sponsor/three.png',
      '/images/sponsor/four.png',
      '/images/sponsor/five.png'
    ]
  }
};

export default function handler(req, res) {
  // GET request to retrieve portfolio data
  if (req.method === 'GET') {
    try {
      const { section } = req.query;

      // Get the portfolio data from the JSON file
      let portfolioData = getData('portfolio');

      // If no data exists, use the default data
      if (!portfolioData) {
        portfolioData = DEFAULT_PORTFOLIO_DATA;
        saveData('portfolio', portfolioData);
      }

      // If a specific section is requested, return only that section
      if (section) {
        // Special case for sponsors section - use the central sponsors data from about.json
        if (section === 'sponsors') {
          const aboutData = getData('about');
          if (aboutData && aboutData.sponsors) {
            return res.status(200).json(aboutData.sponsors);
          }
        }

        if (portfolioData[section]) {
          return res.status(200).json(portfolioData[section]);
        }
      }

      // Return the entire portfolio data
      return res.status(200).json(portfolioData);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT request to update portfolio data
  if (req.method === 'PUT') {
    try {
      const { section } = req.query;
      const updatedData = req.body;

      // Get the current portfolio data
      let portfolioData = getData('portfolio') || DEFAULT_PORTFOLIO_DATA;

      // If a specific section is being updated
      if (section) {
        // Prevent updating the sponsors section directly - redirect to about page
        if (section === 'sponsors') {
          return res.status(403).json({
            message: 'Sponsors data can only be updated from the about page',
            redirectTo: '/admin/about/sponsors'
          });
        }

        portfolioData = {
          ...portfolioData,
          [section]: updatedData
        };
      } else {
        // Update the entire portfolio data but preserve sponsors section
        const aboutData = getData('about');
        if (aboutData && aboutData.sponsors) {
          portfolioData = {
            ...updatedData,
            sponsors: aboutData.sponsors // Keep the sponsors data from about.json
          };
        } else {
          portfolioData = updatedData;
        }
      }

      // Save the updated data
      const success = saveData('portfolio', portfolioData);

      if (!success) {
        return res.status(500).json({ message: 'Failed to save portfolio data' });
      }

      return res.status(200).json({
        message: 'Portfolio data updated successfully',
        data: section ? portfolioData[section] : portfolioData
      });
    } catch (error) {
      console.error('Error updating portfolio data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
