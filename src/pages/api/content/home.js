import { getData, saveData } from "@/utils/dataUtils";

// Default data for the home page
const defaultHomeData = {
  banner: {
    subtitle: "Welcome to Photodit",
    title: "Professional Photo Editing Service",
    images: {
      main: "/images/banner/thumb.png",
      after: "/images/banner/after.png",
      smallImages: [
        "/images/banner/one.png",
        "/images/banner/two.png",
        "/images/banner/three.png",
        "/images/banner/four.png",
      ],
    },
  },
  services: {
    subtitle: "Our Services",
    title: "What We Offer",
    services: [
      {
        id: 1,
        title: "Clipping Path",
        description: "Remove backgrounds from images",
        icon: "icon-clipping",
        link: "/services/clipping-path",
      },
      {
        id: 2,
        title: "Image Masking",
        description: "Perfect for complex edges and hair",
        icon: "icon-masking",
        link: "/services/image-masking",
      },
      {
        id: 3,
        title: "Photo Retouching",
        description: "Enhance and perfect your images",
        icon: "icon-retouching",
        link: "/services/photo-retouching",
      },
    ],
  },
  about: {
    subtitle: "About Us",
    title: "Professional Photo Editing Service",
    description:
      "We provide high-quality photo editing services for businesses and individuals.",
    additionalText:
      "Our team of experienced editors can handle any photo editing task.",
    priceTag: "Starting at $0.39 per image",
    buttons: [
      {
        text: "Get Started",
        link: "get-quote",
        type: "primary",
      },
      {
        text: "Learn More",
        link: "about",
        type: "secondary",
      },
    ],
    image: "/images/about/thumb.png",
  },
  whySpecial: {
    subtitle: "why choose us",
    title: "why we are special",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    features: [
      {
        id: 1,
        title: "Automatic & Quick Results",
        description: "Clipping Path Could be a process by which photo editor",
        icon: "/images/choose/icon-one.png",
      },
      {
        id: 2,
        title: "Increase Resolution",
        description: "Clipping Path Could be a process by which photo editor",
        icon: "/images/choose/icon-two.png",
      },
      {
        id: 3,
        title: "Retain Details",
        description: "Clipping Path Could be a process by which photo editor",
        icon: "/images/choose/icon-three.png",
      },
    ],
  },
  trickyBackgrounds: {
    subtitle: "Stunning Quality",
    title: "We've removed these tricky backgrounds",
    categories: [
      {
        id: 1,
        name: "people",
        icon: "icon-user",
        beforeAfterImages: [
          {
            before: "/images/after/one-before.png",
            after: "/images/after/one-after.png",
          },
        ],
      },
      {
        id: 2,
        name: "products",
        icon: "icon-hexagon",
        beforeAfterImages: [
          {
            before: "/images/after/two-before.png",
            after: "/images/after/two-after.png",
          },
        ],
      },
      {
        id: 3,
        name: "animals",
        icon: "icon-animal",
        beforeAfterImages: [
          {
            before: "/images/after/three-before.png",
            after: "/images/after/three-after.png",
          },
        ],
      },
      {
        id: 4,
        name: "cars",
        icon: "icon-car",
        beforeAfterImages: [
          {
            before: "/images/after/four-before.png",
            after: "/images/after/four-after.png",
          },
        ],
      },
      {
        id: 5,
        name: "graphics",
        icon: "icon-image",
        beforeAfterImages: [
          {
            before: "/images/after/one-before.png",
            after: "/images/after/one-after.png",
          },
        ],
      },
    ],
    decorativeImages: {
      one: "/images/quality/thumb-one.png",
      two: "/images/quality/thumb-two.png",
    },
  },
  testimonials: {
    subtitle: "Testimonials",
    title: "What Our Clients Say",
    items: [
      {
        id: 1,
        name: "John Doe",
        position: "Photographer",
        image: "/images/testimonial/one.png",
        rating: 5,
        text: "Photodit has been a game-changer for my photography business. Their clipping path service is top-notch!",
      },
      {
        id: 2,
        name: "Jane Smith",
        position: "E-commerce Manager",
        image: "/images/testimonial/two.png",
        rating: 5,
        text: "We've been using Photodit for all our product photos. The quality and turnaround time are excellent.",
      },
      {
        id: 3,
        name: "Mike Johnson",
        position: "Marketing Director",
        image: "/images/testimonial/three.png",
        rating: 4,
        text: "Photodit has helped us maintain consistent image quality across all our marketing materials.",
      },
    ],
  },
  pricing: {
    subtitle: "Pricing Plans",
    title: "Choose the Right Plan for You",
    plans: [
      {
        id: 1,
        name: "Basic",
        price: "$0.39",
        unit: "per image",
        description: "Perfect for small businesses",
        features: [
          "Clipping Path",
          "24-hour turnaround",
          "Unlimited revisions",
          "Money-back guarantee",
        ],
        recommended: false,
      },
      {
        id: 2,
        name: "Pro",
        price: "$0.79",
        unit: "per image",
        description: "Ideal for growing businesses",
        features: [
          "Clipping Path",
          "Image Masking",
          "Shadow Creation",
          "12-hour turnaround",
          "Unlimited revisions",
          "Money-back guarantee",
        ],
        recommended: true,
      },
      {
        id: 3,
        name: "Enterprise",
        price: "$1.29",
        unit: "per image",
        description: "For high-volume needs",
        features: [
          "All Pro features",
          "Photo Retouching",
          "Color Correction",
          "6-hour turnaround",
          "Dedicated account manager",
          "API integration",
        ],
        recommended: false,
      },
    ],
  },
  news: {
    subtitle: "Latest News",
    title: "Stay Updated with Photodit",
  },
  cta: {
    subtitle: "Ready to Get Started?",
    title: "Transform Your Images Today",
    description:
      "Join thousands of satisfied customers who trust Photodit for their photo editing needs.",
    image: "/images/cta/thumb.png",
  },
  sponsors: {
    title: "Trusted by Leading Brands",
    logos: [
      "/images/sponsor/one.png",
      "/images/sponsor/two.png",
      "/images/sponsor/three.png",
      "/images/sponsor/four.png",
      "/images/sponsor/five.png",
    ],
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let data = await getData("home");
      if (!data || Object.keys(data).length === 0) {
        await saveData("home", defaultHomeData);
        data = { ...defaultHomeData };
      }
      const { section } = req.query;
      if (section) {
        if (section === "sponsors") {
          const aboutData = await getData("about");
          if (aboutData && aboutData.sponsors) {
            return res.status(200).json(aboutData.sponsors);
          }
        }
        if (section === "whySpecial") {
          if (!data[section]) {
            data[section] = defaultHomeData[section];
          } else if (!data[section].videoUrl) {
            data[section].videoUrl = defaultHomeData.whySpecial.videoUrl;
          }
          await saveData("home", data);
          return res.status(200).json(data[section]);
        }
        if (!data[section] && defaultHomeData[section]) {
          data[section] = defaultHomeData[section];
          await saveData("home", data);
          return res.status(200).json(defaultHomeData[section]);
        }
        return res.status(200).json(data[section] || {});
      }
      if (data.whySpecial && !data.whySpecial.videoUrl) {
        data.whySpecial.videoUrl = defaultHomeData.whySpecial.videoUrl;
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching home data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  if (req.method === "PUT") {
    console.log('PUT request received:', { 
      query: req.query, 
      body: JSON.parse(JSON.stringify(req.body)) // Create a clean copy for logging
    });
    
    try {
      const { section } = req.query;
      const updatedData = req.body;
      
      if (!section) {
        console.log('No section specified in query');
        return res.status(400).json({ message: "Section parameter is required" });
      }
      
      // Get existing data
      let data = {};
      try {
        data = (await getData("home")) || {};
        console.log('Existing data loaded:', JSON.stringify(data, null, 2));
      } catch (dbError) {
        console.error('Error loading existing data:', dbError);
        return res.status(500).json({ 
          message: "Failed to load existing data",
          error: dbError.message 
        });
      }
      
      // If this is the banner section, ensure we maintain the proper structure
      if (section === 'banner') {
        console.log('Processing banner section update');
        
        // Ensure images object exists
        updatedData.images = updatedData.images || {};
        console.log('Updated images object:', updatedData.images);
        
        // Ensure smallImages is an array with 4 items
        if (!Array.isArray(updatedData.images.smallImages)) {
          console.log('Initializing smallImages array');
          updatedData.images.smallImages = Array(4).fill('');
        }
        
        // Ensure smallImagesPublicIds exists if we have public IDs
        if ((updatedData.images.mainPublicId || updatedData.images.smallImagesPublicIds) && 
            !Array.isArray(updatedData.images.smallImagesPublicIds)) {
          console.log('Initializing smallImagesPublicIds array');
          updatedData.images.smallImagesPublicIds = Array(4).fill('');
        }
        
        console.log('Processed banner data:', JSON.stringify(updatedData, null, 2));
      }
      
      // Update only the specified section
      console.log(`Updating section '${section}'`);
      data[section] = updatedData;
      
      // Save the updated data
      console.log('Saving updated data...');
      const success = await saveData("home", data);
      
      if (!success) {
        console.error('Failed to save data to database');
        return res.status(500).json({ 
          message: "Failed to save home data to database" 
        });
      }
      
      console.log('Data saved successfully');
      
      // Return the updated section data
      const responseData = { 
        message: `Home section '${section}' updated successfully`, 
        data: data[section] 
      };
      
      console.log('Sending response:', responseData);
      return res.status(200).json(responseData);
      
      // Note: Removed the else block since we're now handling section updates only
      // and the section check is done at the beginning of the function
    } catch (error) {
      console.error("Error updating home data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
