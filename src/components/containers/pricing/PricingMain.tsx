import React from "react";
import Image from "next/image";
import Link from "next/link";
import star from "public/images/pricing/star.png";
import starhover from "public/images/pricing/star-hover.png";

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  recommended: boolean;
}

interface PricingMainData {
  subtitle: string;
  title: string;
  description: string;
  plans: PricingPlan[];
}

interface PricingMainProps {
  data: PricingMainData;
}

const PricingMain = ({ data }: PricingMainProps) => {
  const plans = data.plans;
  return (
    <section className="section pricing-main">
      <div className="container">
        {data?.title && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="section__header text-center">
                {data.subtitle && (
                  <span
                    className="subtitle text-uppercase"
                    data-aos="fade-up"
                    data-aos-duration="600"
                  >
                    {data.subtitle}
                  </span>
                )}
                <h2
                  className="title title-animation"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {data.title}
                </h2>
                {data.description && (
                  <p
                    className="paragraph"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="200"
                  >
                    {data.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="row gaper">
          {plans.map((plan, index) => {
            return (
              <div key={plan.id} className="col-12 col-md-6 col-xl-4">
                <div
                  className={`pricing-main__single ${
                    plan.recommended ? "pricing-main__single--recommended" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={
                    index % 3 === 0 ? "100" : index % 3 === 1 ? "300" : "500"
                  }
                >
                  {plan.recommended && (
                    <div className="pricing-main__recommended-badge">
                      Recommended
                    </div>
                  )}

                  <div className="content">
                    <h4 className="h4">{plan.name}</h4>
                    <div className="paragraph">
                      <p>{plan.description}</p>
                      <p>
                        starting at <strong>{plan.price} Only</strong>{" "}
                        <span>{plan.unit}</span>
                      </p>
                    </div>
                    {plan.features && plan.features.length > 0 && (
                      <div className="features">
                        <ul className="features-list">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="feature-item">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="cta__group">
                    <Link
                      href="get-quote"
                      aria-label="Get Started"
                      className="btn btn--secondary text-uppercase"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="anime">
                    <Image src={star} alt="Decoration" />
                    <Image src={starhover} alt="Decoration" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .pricing-main__single--recommended {
          border: 2px solid #4569e7;
          position: relative;
        }

        .pricing-main__recommended-badge {
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

        .features {
          margin-top: 16px;
        }

        .features-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          font-size: 14px;
          color: #334155;
          padding: 4px 0;
          position: relative;
          padding-left: 20px;
        }

        .feature-item:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
        }
      `}</style>
    </section>
  );
};

export default PricingMain;
