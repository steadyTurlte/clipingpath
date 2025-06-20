import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import smallone from "public/images/pricing/small-one.png";
import smalltwo from "public/images/pricing/small-two.png";
import smallthree from "public/images/pricing/small-three.png";
import smallfour from "public/images/pricing/small-four.png";

interface PricingPlan {
  id?: number;
  title?: string;
  name?: string; // Support both title and name
  price?: string;
  unit?: string;
  features?: string[];
  popular?: boolean;
  recommended?: boolean; // Support both popular and recommended
  image?: string;
  className?: string;
  description?: string;
}

interface PricingData {
  subtitle?: string;
  title?: string;
  description?: string;
  plans?: PricingPlan[];
}

interface ServicePricingProps {
  data?: PricingData;
}

const ServicePricing: React.FC<ServicePricingProps> = ({ data }) => {
  const [centralPricingData, setCentralPricingData] =
    useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  // Add styles for the component
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = `
        .plan-description {
          margin: 10px 0;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
        }

        .plan-description p {
          margin: 0;
        }

        .pricing-two__single--alt {
          border: 2px solid #4569e7;
          position: relative;
        }

        .pricing-two__single--alt::before {
          content: "Recommended";
          position: absolute;
          top: 0;
          right: 0;
          background-color: #4569e7;
          color: white;
          font-size: 12px;
          padding: 4px 8px;
          border-bottom-left-radius: 4px;
          z-index: 1;
        }
      `;
      document.head.appendChild(styleElement);

      // Clean up function to remove the style element when component unmounts
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, []);

  // Fetch the central pricing data
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await fetch("/api/content/pricing?section=main");
        const data = await response.json();
        setCentralPricingData(data);
      } catch (error) {
        console.error("Error fetching central pricing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // Use the central pricing data if available, otherwise fall back to the provided data
  const pricingData = centralPricingData ||
    data || {
      subtitle: "clipping path cost",
      title: "How much do clipping path services cost?",
      description:
        "We offer competitive pricing for our high-quality image editing services.",
      plans: [
        {
          id: 1,
          title: "Clipping Path",
          price: "$19",
          unit: "39¢ PER IMAGE",
          features: [
            "3 downloads per day",
            "Access to all products",
            "Access to new releases",
            "15% renewal discount",
          ],

          popular: false,
          image: "/images/pricing/small-one.png",
          className: "",
        },
        {
          id: 2,
          title: "Catalogue Making",
          price: "$39",
          unit: "39¢ PER IMAGE",
          features: [
            "3 downloads per day",
            "Access to all products",
            "Access to new releases",
            "15% renewal discount",
          ],

          popular: false,
          image: "/images/pricing/small-two.png",
          className: "yel",
        },
        {
          id: 3,
          title: "Background Removal",
          price: "$59",
          unit: "39¢ PER IMAGE",
          features: [
            "3 downloads per day",
            "Access to all products",
            "Access to new releases",
            "15% renewal discount",
          ],

          popular: true,
          image: "/images/pricing/small-three.png",
          className: "pri",
        },
        {
          id: 4,
          title: "image masking",
          price: "$79",
          unit: "39¢ PER IMAGE",
          features: [
            "3 downloads per day",
            "Access to all products",
            "Access to new releases",
            "15% renewal discount",
          ],

          popular: false,
          image: "/images/pricing/small-four.png",
          className: "tri",
        },
      ],
    };

  return (
    <section className="section pricing-two">
      <div className="container">
        <div className="row align-items-center section__header--alt">
          <div className="col-12">
            <div className="section__header text-center">
              <p
                className="h6 sub-title"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {pricingData.subtitle}
              </p>
              <h2
                className="h2 title"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {pricingData.title}
              </h2>
              {pricingData.description && (
                <p
                  className="paragraph"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {pricingData.description}
                </p>
              )}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="row">
            <div className="col-12 text-center">
              <p>Loading pricing plans...</p>
            </div>
          </div>
        ) : (
          <div className="row gaper">
            {pricingData.plans &&
              pricingData.plans.map((plan, index) => {
                // Support both naming conventions (title/name and popular/recommended)
                const planTitle = plan.title || plan.name || "";
                const isPopular = plan.popular || plan.recommended || false;

                return (
                  <div
                    key={plan.id || index}
                    className="col-12 col-md-6 col-lg-6 col-xxl-3"
                  >
                    <div
                      className={`pricing-two__single ${
                        isPopular ? "pricing-two__single--alt" : ""
                      }`}
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay={100 + index * 50}
                    >
                      <h5 className={`h5 ${plan.className || ""}`}>
                        {planTitle}
                      </h5>
                      <div className="meta">
                        <div className="content">
                          <h2 className="h2 title">{plan.price}</h2>
                          <p>{plan.unit}</p>
                        </div>
                        <div className="thumb">
                          {plan.image && plan.image.startsWith("/") ? (
                            <Image
                              src={plan.image}
                              alt={planTitle || "Plan Image"}
                              width={60}
                              height={60}
                              unoptimized={plan.image.startsWith("/images/")}
                            />
                          ) : (
                            <Image
                              src={
                                index === 0
                                  ? smallone
                                  : index === 1
                                  ? smalltwo
                                  : index === 2
                                  ? smallthree
                                  : smallfour
                              }
                              alt={planTitle || "Plan Image"}
                            />
                          )}
                        </div>
                      </div>
                      <hr />
                      {plan.description && (
                        <div className="plan-description">
                          <p>{plan.description}</p>
                        </div>
                      )}
                      <ul>
                        {plan.features &&
                          plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>
                              <i className="fa-solid fa-check"></i>
                              {feature}
                            </li>
                          ))}
                      </ul>
                      <hr />
                      <Link href="/get-quote" className="btn btn--secondary">
                        Get Started Now
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicePricing;
