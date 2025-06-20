import { getData, saveData } from '@/utils/dataUtils';

// Default data for the home page
const defaultHomeData = {
  banner: {
    subtitle: 'Welcome to Photodit',
    title: 'Professional Photo Editing Service',
    images: {
      main: '/images/banner/thumb.png',
      after: '/images/banner/after.png',
      smallImages: [
        '/images/banner/one.png',
        '/images/banner/two.png',
        '/images/banner/three.png',
        '/images/banner/four.png'
      ]
    }
  },
  services: {
    subtitle: 'Our Services',
    title: 'What We Offer',
    services: [
      {
        id: 1,
        title: 'Clipping Path',
        description: 'Remove backgrounds from images',
        icon: 'icon-clipping',
        link: '/services/clipping-path'
      },
      {
        id: 2,
        title: 'Image Masking',
        description: 'Perfect for complex edges and hair',
        icon: 'icon-masking',
        link: '/services/image-masking'
      },
      {
        id: 3,
        title: 'Photo Retouching',
        description: 'Enhance and perfect your images',
        icon: 'icon-retouching',
        link: '/services/photo-retouching'
      }
    ]
  },
  about: {
    subtitle: 'About Us',
    title: 'Professional Photo Editing Service',
    description: 'We provide high-quality photo editing services for businesses and individuals.',
    additionalText: 'Our team of experienced editors can handle any photo editing task.',
    priceTag: 'Starting at $0.39 per image',
    buttons: [
      {
        text: 'Get Started',
        link: 'get-quote',
        type: 'primary'
      },
      {
        text: 'Learn More',
        link: 'about',
        type: 'secondary'
      }
    ],
    image: '/images/about/thumb.png'
  },
  whySpecial: {
    subtitle: 'why choose us',
    title: 'why we are special',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    features: [
      {
        id: 1,
        title: 'Automatic & Quick Results',
        description: 'Clipping Path Could be a process by which photo editor',
        icon: '/images/choose/icon-one.png'
      },
      {
        id: 2,
        title: 'Increase Resolution',
        description: 'Clipping Path Could be a process by which photo editor',
        icon: '/images/choose/icon-two.png'
      },
      {
        id: 3,
        title: 'Retain Details',
        description: 'Clipping Path Could be a process by which photo editor',
        icon: '/images/choose/icon-three.png'
      }
    ]
  },
  trickyBackgrounds: {
    subtitle: 'Stunning Quality',
    title: 'We\'ve removed these tricky backgrounds',
    categories: [
      {
        id: 1,
        name: 'people',
        icon: 'icon-user',
        beforeAfterImages: [
          {
            before: '/images/after/one-before.png',
            after: '/images/after/one-after.png'
          }
        ]
      },
      {
        id: 2,
        name: 'products',
        icon: 'icon-hexagon',
        beforeAfterImages: [
          {
            before: '/images/after/two-before.png',
            after: '/images/after/two-after.png'
          }
        ]
      },
      {
        id: 3,
        name: 'animals',
        icon: 'icon-animal',
        beforeAfterImages: [
          {
            before: '/images/after/three-before.png',
            after: '/images/after/three-after.png'
          }
        ]
      },
      {
        id: 4,
        name: 'cars',
        icon: 'icon-car',
        beforeAfterImages: [
          {
            before: '/images/after/four-before.png',
            after: '/images/after/four-after.png'
          }
        ]
      },
      {
        id: 5,
        name: 'graphics',
        icon: 'icon-image',
        beforeAfterImages: [
          {
            before: '/images/after/one-before.png',
            after: '/images/after/one-after.png'
          }
        ]
      }
    ],
    decorativeImages: {
      one: '/images/quality/thumb-one.png',
      two: '/images/quality/thumb-two.png'
    }
  },
  testimonials: {
    subtitle: 'Testimonials',
    title: 'What Our Clients Say',
    items: [
      {
        id: 1,
        name: 'John Doe',
        position: 'Photographer',
        image: '/images/testimonial/one.png',
        rating: 5,
        text: 'Photodit has been a game-changer for my photography business. Their clipping path service is top-notch!'
      },
      {
        id: 2,
        name: 'Jane Smith',
        position: 'E-commerce Manager',
        image: '/images/testimonial/two.png',
        rating: 5,
        text: 'We\'ve been using Photodit for all our product photos. The quality and turnaround time are excellent.'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        position: 'Marketing Director',
        image: '/images/testimonial/three.png',
        rating: 4,
        text: 'Photodit has helped us maintain consistent image quality across all our marketing materials.'
      }
    ]
  },
  pricing: {
    subtitle: 'Pricing Plans',
    title: 'Choose the Right Plan for You',
    plans: [
      {
        id: 1,
        name: 'Basic',
        price: '$0.39',
        unit: 'per image',
        description: 'Perfect for small businesses',
        features: [
          'Clipping Path',
          '24-hour turnaround',
          'Unlimited revisions',
          'Money-back guarantee'
        ],
        recommended: false
      },
      {
        id: 2,
        name: 'Pro',
        price: '$0.79',
        unit: 'per image',
        description: 'Ideal for growing businesses',
        features: [
          'Clipping Path',
          'Image Masking',
          'Shadow Creation',
          '12-hour turnaround',
          'Unlimited revisions',
          'Money-back guarantee'
        ],
        recommended: true
      },
      {
        id: 3,
        name: 'Enterprise',
        price: '$1.29',
        unit: 'per image',
        description: 'For high-volume needs',
        features: [
          'All Pro features',
          'Photo Retouching',
          'Color Correction',
          '6-hour turnaround',
          'Dedicated account manager',
          'API integration'
        ],
        recommended: false
      }
    ]
  },
  news: {
    subtitle: 'Latest News',
    title: 'Stay Updated with Photodit'
  },
  cta: {
    subtitle: 'Ready to Get Started?',
    title: 'Transform Your Images Today',
    description: 'Join thousands of satisfied customers who trust Photodit for their photo editing needs.',
    image: '/images/cta/thumb.png'
  },
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

export default async function handler(req, res) {
  // GET request to retrieve home page data
  if (req.method === 'GET') {
    try {
      const { section } = req.query;

      // Get the home page data from the JSON file
      let data = getData('home');

      // If no data exists, use the default data
      if (!data || Object.keys(data).length === 0) {
        // Save the default data to the JSON file
        saveData('home', defaultHomeData);
        data = { ...defaultHomeData };
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

        // If the section doesn't exist, return the default section data
        if (!data[section] && defaultHomeData[section]) {
          // Update the home data with the default section
          data[section] = defaultHomeData[section];
          saveData('home', data);

          return res.status(200).json(defaultHomeData[section]);
        }

        // Return the requested section
        return res.status(200).json(data[section] || {});
      }

      // Return the entire home page data
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching home page data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT request to update a section of the home page
  if (req.method === 'PUT') {
    try {
      const { section } = req.query;
      const sectionData = req.body;

      if (!section) {
        return res.status(400).json({ message: 'Section parameter is required' });
      }

      // Prevent updating the sponsors section directly - redirect to about page
      if (section === 'sponsors') {
        return res.status(403).json({
          message: 'Sponsors data can only be updated from the about page',
          redirectTo: '/admin/about/sponsors'
        });
      }

      // Get the current home page data
      let homeData = getData('home');

      // If no data exists, use the default data
      if (!homeData || Object.keys(homeData).length === 0) {
        homeData = { ...defaultHomeData };
      }

      // Make sure we have default data for this section if it doesn't exist
      if (!homeData[section] && defaultHomeData[section]) {
        homeData[section] = { ...defaultHomeData[section] };
      }

      // Merge the section data with existing data to ensure we don't lose properties
      if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
        // For objects, merge properties
        homeData[section] = {
          ...(homeData[section] || {}),
          ...sectionData
        };
      } else {
        // For arrays or primitive values, replace completely
        homeData[section] = sectionData;
      }

      // Save the updated data
      const success = saveData('home', homeData);

      if (!success) {
        return res.status(500).json({ message: 'Failed to save home page data' });
      }

      return res.status(200).json({
        message: 'Section updated successfully',
        data: homeData[section]
      });
    } catch (error) {
      console.error('Error updating home page section:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
