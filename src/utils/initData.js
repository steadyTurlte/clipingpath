import fs from 'fs';
import path from 'path';
import { getData, saveData } from './dataUtils';

// Default data for the home page
const defaultHomeData = {
  banner: {
    subtitle: "Get pixel perfect image editing services",
    title: "Photo Editing & Graphic Design Made for Everyone",
    images: {
      main: "/images/banner/thumb.png",
      after: "/images/banner/after.png",
      smallImages: [
        "/images/banner/one.png",
        "/images/banner/two.png",
        "/images/banner/three.png",
        "/images/banner/four.png"
      ]
    }
  },
  services: {
    subtitle: "photodit's service",
    title: "Clipping Path Services for professional images",
    items: [
      {
        id: 1,
        title: "Clipping path services",
        image: "/images/services/slide-one.png",
        price: "$0.39 Only",
        link: "service-details",
        className: "on"
      },
      {
        id: 2,
        title: "Background removal",
        image: "/images/services/slide-two.png",
        price: "$0.39 Only",
        link: "service-details",
        className: "fi"
      },
      {
        id: 3,
        title: "Image masking",
        image: "/images/services/slide-three.png",
        price: "$0.39 Only",
        link: "service-details",
        className: "tw"
      },
      {
        id: 4,
        title: "Shadow creation",
        image: "/images/services/slide-four.png",
        price: "$0.39 Only",
        link: "service-details",
        className: "th"
      },
      {
        id: 5,
        title: "Ghost mannequin",
        image: "/images/services/slide-five.png",
        price: "$0.39 Only",
        link: "service-details",
        className: "fo"
      }
    ]
  },
  about: {
    subtitle: "about us",
    title: "Edit your photo in seconds with photodit",
    description: "Image editing services for ecommerce businesses and pros, from product photographers to Amazon sellers to global brands.",
    additionalText: "Because a quick product shoot can easily turn into a week or more of editing and formatting your images. Let us look after the edits, so you can get back to the work that needs you.",
    priceTag: "Starting at 25¢ / per image",
    image: "/images/about-thumb.png",
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
  whySpecial: {
    subtitle: "why choose us",
    title: "why we are special",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    features: [
      {
        id: 1,
        title: "Automatic & Quick Results",
        description: "Clipping Path Could be a process by which photo editor",
        icon: "/images/choose/icon-one.png"
      },
      {
        id: 2,
        title: "Affordable Price",
        description: "Clipping Path Could be a process by which photo editor",
        icon: "/images/choose/icon-two.png"
      },
      {
        id: 3,
        title: "Experienced Team",
        description: "Clipping Path Could be a process by which photo editor",
        icon: "/images/choose/icon-three.png"
      }
    ]
  },
  trickyBackgrounds: {
    subtitle: "Stunning Quality",
    title: "We've removed these tricky backgrounds",
    categories: [
      {
        id: 1,
        name: "clipping",
        icon: "icon-clipping",
        beforeAfterImages: [
          {
            before: "/images/after/one-before.png",
            after: "/images/after/one-after.png"
          }
        ]
      },
      {
        id: 2,
        name: "masking",
        icon: "icon-masking",
        beforeAfterImages: [
          {
            before: "/images/after/two-before.png",
            after: "/images/after/two-after.png"
          }
        ]
      },
      {
        id: 3,
        name: "retouching",
        icon: "icon-retouching",
        beforeAfterImages: [
          {
            before: "/images/after/three-before.png",
            after: "/images/after/three-after.png"
          }
        ]
      },
      {
        id: 4,
        name: "shadow",
        icon: "icon-shadow",
        beforeAfterImages: [
          {
            before: "/images/after/four-before.png",
            after: "/images/after/four-after.png"
          }
        ]
      },
      {
        id: 5,
        name: "graphics",
        icon: "icon-image",
        beforeAfterImages: [
          {
            before: "/images/after/one-before.png",
            after: "/images/after/one-after.png"
          }
        ]
      }
    ],
    decorativeImages: {
      one: "/images/quality/thumb-one.png",
      two: "/images/quality/thumb-two.png"
    }
  },
  testimonials: {
    subtitle: "testimonials",
    title: "What our clients say",
    items: [
      {
        id: 1,
        name: "Kathryn Murphy",
        position: "CEO, Founder",
        image: "/images/testimonial/one.png",
        rating: 5,
        text: "Photodit is a fantastic service for anyone looking to enhance their product photography. The team is professional, responsive, and delivers high-quality results consistently."
      },
      {
        id: 2,
        name: "Leslie Alexander",
        position: "Marketing Director",
        image: "/images/testimonial/two.png",
        rating: 5,
        text: "I've been using Photodit for all my e-commerce product images, and the results have been outstanding. Their attention to detail and quick turnaround time have helped me improve my online store significantly."
      },
      {
        id: 3,
        name: "Jenny Wilson",
        position: "Product Manager",
        image: "/images/testimonial/three.png",
        rating: 5,
        text: "The team at Photodit has been instrumental in helping us maintain a consistent look across all our product images. Their clipping path service is precise and their customer service is excellent."
      }
    ]
  },
  pricing: {
    subtitle: "pricing plan",
    title: "Choose the perfect plan for your needs",
    plans: [
      {
        id: 1,
        name: "Basic",
        price: "$0.39",
        unit: "per image",
        description: "Perfect for small businesses and individuals",
        features: [
          "Basic Clipping Path",
          "Background Removal",
          "24/7 Support",
          "Quick Delivery",
          "100% Quality Guarantee"
        ],
        recommended: false
      },
      {
        id: 2,
        name: "Standard",
        price: "$0.69",
        unit: "per image",
        description: "Ideal for growing businesses with regular needs",
        features: [
          "Advanced Clipping Path",
          "Background Removal",
          "Shadow Creation",
          "Color Correction",
          "24/7 Priority Support",
          "Express Delivery",
          "100% Quality Guarantee"
        ],
        recommended: true
      },
      {
        id: 3,
        name: "Premium",
        price: "$0.99",
        unit: "per image",
        description: "Best for professional photographers and large businesses",
        features: [
          "Complex Clipping Path",
          "Advanced Background Removal",
          "Natural Shadow Creation",
          "Advanced Color Correction",
          "Image Retouching",
          "24/7 VIP Support",
          "Rush Delivery",
          "100% Quality Guarantee"
        ],
        recommended: false
      }
    ]
  },
  news: {
    subtitle: "photodit news",
    title: "Latest updates and articles",
  },
  cta: {
    title: "Ready to get started?",
    description: "Try our services risk-free with a free trial. No credit card required.",
  },
  sponsors: {
    title: "Trusted by leading brands",
    logos: [
      "/images/sponsor/one.png",
      "/images/sponsor/two.png",
      "/images/sponsor/three.png",
      "/images/sponsor/four.png",
      "/images/sponsor/five.png"
    ]
  }
};

// Default data for settings
const defaultSettingsData = {
  site: {
    title: "Photodit - Clipping Path Service",
    description: "Professional photo editing services for e-commerce businesses and photographers."
  },
  contact: {
    email: "info@photodit.com",
    phone: "+1 (732) 798-0976",
    address: "785 15h Street, Office 478 Berlin"
  },
  email: {
    adminEmail: "mahmud.amaan20104@gmail.com",
    contactFormSubject: "New Contact Form Submission",
    quoteFormSubject: "New Quote Request"
  }
};

// Default data for news
const defaultNewsData = {
  news: []
};

// Initialize data directory and default files
export function initializeData() {
  try {
    // Get the absolute path to the data directory
    const dataDirectory = path.join(process.cwd(), 'src/data');

    // Create the data directory if it doesn't exist
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }

    // Initialize home data
    const homeData = getData('home');
    if (!homeData || Object.keys(homeData).length === 0) {
      saveData('home', defaultHomeData);
    }

    // Initialize settings data
    const settingsData = getData('settings');
    if (!settingsData || Object.keys(settingsData).length === 0) {
      saveData('settings', defaultSettingsData);
    }

    // Initialize news data
    const newsData = getData('news');
    if (!newsData || Object.keys(newsData).length === 0) {
      saveData('news', defaultNewsData);
    }

    return true;
  } catch (error) {
    console.error('Error initializing data:', error);
    return false;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeData();
}

export default initializeData;
