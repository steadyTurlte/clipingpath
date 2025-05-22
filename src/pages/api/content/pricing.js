import { getData, saveData } from '@/utils/dataUtils';

// Default pricing data
const DEFAULT_PRICING_DATA = {
  banner: {
    title: 'Pricing Plan',
    image: ''
  },
  main: {
    subtitle: 'pricing plan',
    title: 'Choose the perfect plan for your needs',
    description: 'We offer competitive pricing for our high-quality image editing services.',
    plans: [
      {
        id: 1,
        name: 'Basic',
        price: '$0.39',
        unit: 'per image',
        description: 'Perfect for small businesses and individuals',
        features: [
          'Basic Clipping Path',
          'Background Removal',
          '24/7 Support',
          'Quick Delivery',
          '100% Quality Guarantee'
        ],
        recommended: false
      },
      {
        id: 2,
        name: 'Standard',
        price: '$0.69',
        unit: 'per image',
        description: 'Ideal for growing businesses with regular needs',
        features: [
          'Advanced Clipping Path',
          'Background Removal',
          'Shadow Creation',
          'Color Correction',
          '24/7 Priority Support',
          'Express Delivery',
          '100% Quality Guarantee'
        ],
        recommended: true
      },
      {
        id: 3,
        name: 'Premium',
        price: '$0.99',
        unit: 'per image',
        description: 'Best for professional photographers and large businesses',
        features: [
          'Complex Clipping Path',
          'Advanced Background Removal',
          'Natural Shadow Creation',
          'Advanced Color Correction',
          'Image Retouching',
          '24/7 VIP Support',
          'Rush Delivery',
          '100% Quality Guarantee'
        ],
        recommended: false
      }
    ]
  },
  project: {
    subtitle: 'our projects',
    title: 'Check out our latest work',
    description: 'See the quality of our image editing services through our recent projects.',
    items: [
      {
        id: 1,
        title: 'Product Photography',
        category: 'E-commerce',
        image: '/images/project/one.jpg',
        link: '/portfolio'
      },
      {
        id: 2,
        title: 'Fashion Photography',
        category: 'Retouching',
        image: '/images/project/two.jpg',
        link: '/portfolio'
      },
      {
        id: 3,
        title: 'Jewelry Photography',
        category: 'Background Removal',
        image: '/images/project/three.jpg',
        link: '/portfolio'
      }
    ]
  },
  faq: {
    subtitle: 'FAQ',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about our pricing and services.',
    items: [
      {
        id: 1,
        question: 'How does your pricing work?',
        answer: 'Our pricing is based on a per-image model. You can choose from our Basic, Standard, or Premium plans depending on your needs. We also offer volume discounts for larger orders.'
      },
      {
        id: 2,
        question: 'Do you offer discounts for bulk orders?',
        answer: 'Yes, we offer volume discounts for bulk orders. The more images you need edited, the lower the per-image price will be. Contact us for a custom quote.'
      },
      {
        id: 3,
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers. Payment is typically required before we begin work on your project.'
      },
      {
        id: 4,
        question: 'Is there a minimum order requirement?',
        answer: 'No, there is no minimum order requirement. You can order as few as one image or as many as you need.'
      },
      {
        id: 5,
        question: 'Do you offer a money-back guarantee?',
        answer: 'Yes, we offer a 100% satisfaction guarantee. If you are not satisfied with our work, we will revise it until you are happy or provide a full refund.'
      }
    ]
  }
};

export default function handler(req, res) {
  // GET request to retrieve pricing data
  if (req.method === 'GET') {
    try {
      const { section } = req.query;

      // Get the pricing data from the JSON file
      let pricingData = getData('pricing');

      // If no data exists, use the default data
      if (!pricingData) {
        pricingData = DEFAULT_PRICING_DATA;
        saveData('pricing', pricingData);
      }

      // If a specific section is requested, return only that section
      if (section && pricingData[section]) {
        return res.status(200).json(pricingData[section]);
      }

      // Return the entire pricing data
      return res.status(200).json(pricingData);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT request to update pricing data
  if (req.method === 'PUT') {
    try {
      const { section } = req.query;
      const updatedData = req.body;

      // Get the current pricing data
      let pricingData = getData('pricing') || DEFAULT_PRICING_DATA;

      // If a specific section is being updated
      if (section) {
        pricingData = {
          ...pricingData,
          [section]: updatedData
        };
      } else {
        // Update the entire pricing data
        pricingData = updatedData;
      }

      // Save the updated data
      const success = saveData('pricing', pricingData);

      if (!success) {
        return res.status(500).json({ message: 'Failed to save pricing data' });
      }

      return res.status(200).json({
        message: 'Pricing data updated successfully',
        data: section ? pricingData[section] : pricingData
      });
    } catch (error) {
      console.error('Error updating pricing data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
