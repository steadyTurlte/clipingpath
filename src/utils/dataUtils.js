import fs from 'fs';
import path from 'path';

// Get the absolute path to the data directory
const dataDirectory = path.join(process.cwd(), 'src/data');

// Create the data directory if it doesn't exist
try {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
} catch (error) {
  console.error(`Error creating data directory: ${error.message}`);
}

/**
 * Read data from a JSON file
 * @param {string} filename - The name of the JSON file to read (without extension)
 * @returns {Object} The parsed JSON data
 */
export function getData(filename) {
  try {
    const filePath = path.join(dataDirectory, `${filename}.json`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`File ${filename}.json does not exist. Creating it with default data.`);

      // Make sure the data directory exists
      if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory, { recursive: true });
      }

      // Create default data based on filename
      let defaultData = {};
      if (filename === 'home') {
        defaultData = {
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
      } else if (filename === 'news') {
        defaultData = { news: [] };
      } else if (filename === 'pricing') {
        defaultData = {
          banner: {
            title: 'Pricing Plan',
            breadcrumbs: [
              { text: 'Home', link: '/' },
              { text: 'Pricing', link: '/pricing' }
            ]
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
              }
            ]
          }
        };
      } else if (filename === 'portfolio') {
        defaultData = {
          banner: {
            title: "Portfolio",
            breadcrumbs: [
              { text: "Home", link: "/" },
              { text: "Portfolio", link: "/portfolio" }
            ]
          },
          categories: [
            { id: 1, name: "All", filter: "*" },
            { id: 2, name: "Photo Retouch", filter: ".retouch" },
            { id: 3, name: "Background Remove", filter: ".background" },
            { id: 4, name: "Clipping Path", filter: ".path" },
            { id: 5, name: "Color Correction", filter: ".color" },
            { id: 6, name: "Drop Shadow", filter: ".drop" },
            { id: 7, name: "E-commerce Image", filter: ".ecommerce" }
          ],
          items: [
            {
              id: 1,
              category: "retouch",
              beforeImage: "/images/after/one-before.png",
              afterImage: "/images/after/one-after.png",
              title: "Photo Retouch Example",
              description: "Professional photo retouching service"
            },
            {
              id: 2,
              category: "background",
              beforeImage: "/images/after/two-before.png",
              afterImage: "/images/after/two-after.png",
              title: "Background Removal Example",
              description: "Clean background removal service"
            },
            {
              id: 3,
              category: "path",
              beforeImage: "/images/after/three-before.png",
              afterImage: "/images/after/three-after.png",
              title: "Clipping Path Example",
              description: "Precise clipping path service"
            },
            {
              id: 4,
              category: "color",
              beforeImage: "/images/after/four-before.png",
              afterImage: "/images/after/four-after.png",
              title: "Color Correction Example",
              description: "Professional color correction service"
            }
          ],
          sponsors: {
            title: "Trusted by Leading Brands",
            logos: [
              "/images/sponsor/one.png",
              "/images/sponsor/two.png",
              "/images/sponsor/three.png",
              "/images/sponsor/four.png",
              "/images/sponsor/five.png"
            ]
          }
        };
      } else if (filename === 'settings') {
        defaultData = {
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
            adminEmail: "mahmud.amaan20104@gmail.com"
          }
        };
      }

      // Save the default data
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading or creating ${filename}.json:`, error);

    // Return empty object instead of null to prevent undefined errors
    return {};
  }
}

/**
 * Write data to a JSON file
 * @param {string} filename - The name of the JSON file to write to (without extension)
 * @param {Object} data - The data to write
 * @returns {boolean} True if successful, false otherwise
 */
export function saveData(filename, data) {
  try {
    // Validate input
    if (!filename || typeof filename !== 'string') {
      console.error('Invalid filename:', filename);
      return false;
    }

    if (!data || typeof data !== 'object') {
      console.error('Invalid data:', data);
      return false;
    }

    const filePath = path.join(dataDirectory, `${filename}.json`);

    // Make sure the data directory exists
    if (!fs.existsSync(dataDirectory)) {
      try {
        fs.mkdirSync(dataDirectory, { recursive: true });
      } catch (dirError) {
        console.error(`Error creating directory ${dataDirectory}:`, dirError);
        return false;
      }
    }

    // Convert data to JSON string
    let jsonString;
    try {
      jsonString = JSON.stringify(data, null, 2);
    } catch (jsonError) {
      console.error(`Error stringifying data for ${filename}.json:`, jsonError);
      return false;
    }

    // Write the data to the file
    try {
      fs.writeFileSync(filePath, jsonString, 'utf8');

      // Verify the file was written correctly
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          console.error(`File ${filePath} was created but is empty`);
          return false;
        }
      } else {
        console.error(`File ${filePath} was not created`);
        return false;
      }

      return true;
    } catch (writeError) {
      console.error(`Error writing to ${filename}.json:`, writeError);
      return false;
    }
  } catch (error) {
    console.error(`Unexpected error saving ${filename}.json:`, error);
    return false;
  }
}

/**
 * Update a specific section in a JSON file
 * @param {string} filename - The name of the JSON file to update (without extension)
 * @param {string} section - The section to update
 * @param {Object} newData - The new data for the section
 * @returns {boolean} True if successful, false otherwise
 */
export function updateSection(filename, section, newData) {
  try {
    const data = getData(filename);
    if (!data) return false;

    data[section] = newData;
    return saveData(filename, data);
  } catch (error) {
    console.error(`Error updating section ${section} in ${filename}.json:`, error);
    return false;
  }
}

/**
 * Get a specific section from a JSON file
 * @param {string} filename - The name of the JSON file to read (without extension)
 * @param {string} section - The section to get
 * @returns {Object|null} The section data or null if not found
 */
export function getSection(filename, section) {
  try {
    const data = getData(filename);
    if (!data) return null;

    return data[section] || null;
  } catch (error) {
    console.error(`Error getting section ${section} from ${filename}.json:`, error);
    return null;
  }
}

/**
 * Save an uploaded file to the public directory
 * @param {File} file - The file to save
 * @param {string} directory - The directory within public to save to
 * @returns {string|null} The path to the saved file or null if failed
 */
export async function saveUploadedFile(file, directory) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create directory if it doesn't exist
    const dir = path.join(process.cwd(), 'public', directory);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = file.name;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, buffer);

    return `/${directory}/${filename}`;
  } catch (error) {
    console.error('Error saving uploaded file:', error);
    return null;
  }
}
