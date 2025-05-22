import React from "react";
import Image from "next/image";

// Default features for fallback
const defaultFeatures = {
  subtitle: "our features",
  title: "Why Choose Our Services",
  items: [
    {
      id: 1,
      icon: "icon-clipping",
      title: "Precision Editing",
      description: "Our team of expert editors ensures pixel-perfect precision for every image."
    },
    {
      id: 2,
      icon: "icon-masking",
      title: "Quick Turnaround",
      description: "We deliver high-quality edits within 24 hours for standard orders."
    },
    {
      id: 3,
      icon: "icon-retouching",
      title: "Affordable Pricing",
      description: "Competitive rates starting at just $0.39 per image with volume discounts."
    },
    {
      id: 4,
      icon: "icon-shadow",
      title: "Dedicated Support",
      description: "Our customer service team is available 24/7 to assist with any questions."
    }
  ]
};

interface FeatureItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesData {
  subtitle?: string;
  title?: string;
  items?: FeatureItem[];
}

interface ServicesFeaturesProps {
  data?: FeaturesData;
}

const ServicesFeatures = ({ data }: ServicesFeaturesProps) => {
  // Use provided data or fallback to defaults
  const featuresData = data || defaultFeatures;
  const items = featuresData.items || defaultFeatures.items;

  return (
    <section className="section features bg-grey">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div
              className="section__header text-center"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <p className="h6 sub-title">{featuresData.subtitle}</p>
              <h2 className="h2 title">{featuresData.title}</h2>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-3">
          {items.map((feature) => (
            <div
              key={feature.id}
              className="col-12 col-md-6 col-lg-3"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={100 + (feature.id * 50)}
            >
              <div className="feature-card">
                <div className="feature-card__icon">
                  {feature.icon && feature.icon.startsWith('http') ? (
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={48}
                      height={48}
                      style={{ objectFit: 'contain' }}
                      unoptimized={true}
                    />
                  ) : (
                    <i className={feature.icon}></i>
                  )}
                </div>
                <div className="feature-card__content">
                  <h3 className="h4 feature-card__title">{feature.title}</h3>
                  <p className="feature-card__description">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features {
          padding: 100px 0;
          background-color: #f8fafc;
        }

        .feature-card {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          height: 100%;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .feature-card__icon {
          font-size: 48px;
          margin-bottom: 20px;
          color: #4569e7;
          display: flex;
          align-items: center;
          height: 48px;
        }

        .feature-card__icon img {
          max-width: 100%;
          max-height: 100%;
        }

        .feature-card__title {
          margin-bottom: 12px;
          color: #1e293b;
        }

        .feature-card__description {
          color: #64748b;
          margin-bottom: 0;
        }
      `}</style>
    </section>
  );
};

export default ServicesFeatures;
