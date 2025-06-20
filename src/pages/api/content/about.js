import { getData, saveData } from '@/utils/dataUtils';

// Default data for the about page
const defaultAboutData = {
  banner: {
    title: "Something About Us",
    image: "",
    breadcrumbs: [
      {
        text: "Home",
        link: "/"
      },
      {
        text: "About Us",
        link: "/about-us"
      }
    ]
  },
  overview: {
    images: [
      "/images/about/overview-1.png",
      "/images/about/overview-2.png"
    ],
    title: "Our good work goes beyond perfect edits",
    description: "We're a team of passionate photo editors dedicated to delivering high-quality image editing services. Our expertise spans across various industries, helping businesses showcase their products in the best light possible.",
    mission: "Outsourced image editing that's good for your business — and good for the world. We believe outsourcing has the power to change the world for the better. Both for our customers and in the communities where our teams work and live."
  },
  main: {
    subtitle: "about us",
    title: "Edit your photo in seconds with photodit",
    description: "Image editing services for ecommerce businesses and pros, from product photographers to Amazon sellers to global brands.",
    additionalText: "Because a quick product shoot can easily turn into a week or more of editing and formatting your images. Let us look after the edits, so you can get back to the work that needs you.",
    priceTag: "Starting at 25¢ / per image",
    image: "/images/about/thumb.png",
    buttons: [
      {
        text: "Know More",
        link: "about-us",
        type: "primary"
      },
      {
        text: "Contact Us",
        link: "contact-us",
        type: "secondary"
      }
    ]
  },
  sponsors: {
    title: "Serving the world's top brands",
    logos: [
      "/images/sponsor/one.png",
      "/images/sponsor/two.png",
      "/images/sponsor/three.png",
      "/images/sponsor/four.png",
      "/images/sponsor/five.png",
      "/images/sponsor/six.png"
    ]
  },
  team: {
    subtitle: "expert team",
    title: "Meet the awesome team",
    description: "Our team of skilled professionals is dedicated to delivering exceptional results for every project.",
    members: [
      {
        id: 1,
        name: "Achim Thiemer mann",
        position: "Social Media Marketing",
        image: "/images/team/one.png"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        position: "Lead Designer",
        image: "/images/team/two.png"
      },
      {
        id: 3,
        name: "Michael Chen",
        position: "Senior Editor",
        image: "/images/team/three.png"
      },
      {
        id: 4,
        name: "Emily Rodriguez",
        position: "Project Manager",
        image: "/images/team/four.png"
      },
      {
        id: 5,
        name: "David Kim",
        position: "Customer Support",
        image: "/images/team/five.png"
      }
    ]
  },
  faq: {
    subtitle: "FAQ",
    title: "Frequently Asked Questions",
    image: "/images/faq/thumb.png",
    questions: [
      {
        id: 1,
        question: "What is clipping path service?",
        answer: "Clipping path is a photo editing technique that involves creating a closed vector path or shape to remove the background from an image. It's commonly used in product photography, e-commerce, and catalog production to isolate objects from their backgrounds."
      },
      {
        id: 2,
        question: "How long does it take to complete an order?",
        answer: "Our standard turnaround time is 24-48 hours, depending on the complexity and volume of images. We also offer rush services for urgent projects that can be completed in as little as 6 hours."
      },
      {
        id: 3,
        question: "What file formats do you accept?",
        answer: "We accept most common image formats including JPEG, PNG, TIFF, PSD, and RAW files. For best results, we recommend providing high-resolution images in their original format."
      },
      {
        id: 4,
        question: "How do I place an order?",
        answer: "You can place an order by filling out our quote form or contacting us directly via email. Once we understand your requirements, we'll provide a quote and timeline for completion."
      },
      {
        id: 5,
        question: "Do you offer bulk discounts?",
        answer: "Yes, we offer volume-based discounts for bulk orders. The more images you need edited, the lower the per-image price will be. Contact us for a custom quote."
      }
    ]
  },
  cta: {
    title: "Ready to transform your images?",
    description: "Get started with our professional photo editing services today.",
  }
};

export default async function handler(req, res) {
  // GET request to retrieve about page data
  if (req.method === 'GET') {
    try {
      const { section } = req.query;

      // Get the about page data from the JSON file
      let data = getData('about');

      // If no data exists, use the default data
      if (!data || Object.keys(data).length === 0) {
        // Save the default data to the JSON file
        saveData('about', defaultAboutData);
        data = { ...defaultAboutData };
      }

      // If a specific section is requested, return only that section
      if (section) {

        // If the section doesn't exist, return the default section data
        if (!data[section] && defaultAboutData[section]) {
          // Update the about data with the default section
          data[section] = defaultAboutData[section];
          const saveResult = saveData('about', data);

          return res.status(200).json(defaultAboutData[section]);
        }

        // Return the requested section
        return res.status(200).json(data[section] || {});
      }

      // Return the entire about page data
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching about page data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT request to update about page data
  if (req.method === 'PUT') {
    try {
      const { section } = req.query;
      const updatedData = req.body;


      // Get the current about page data
      let data = getData('about') || {};

      if (!data || Object.keys(data).length === 0) {
        data = { ...defaultAboutData };
      }

      // If a specific section is being updated
      if (section) {
        // Update only the specified section
        data = {
          ...data,
          [section]: updatedData
        };
      } else {
        // Update the entire about page data
        data = updatedData;
      }

      const success = saveData('about', data);

      if (!success) {
        console.error('Failed to save about page data');
        return res.status(500).json({ message: 'Failed to save about page data' });
      }

      return res.status(200).json({
        message: 'About page data updated successfully',
        data: section ? data[section] : data
      });
    } catch (error) {
      console.error('Error updating about page data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
