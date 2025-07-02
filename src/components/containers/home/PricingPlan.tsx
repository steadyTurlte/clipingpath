import React from "react";
import Link from "next/link";

interface PricingPlanProps {
  data: {
    subtitle: string;
    title: string;
    plans: {
      id: number;
      name: string;
      price: string;
      unit: string;
      description: string;
      features: string[];
      recommended: boolean;
    }[];
  };
}

const PricingPlan = ({ data }: PricingPlanProps) => {
  const pricingData = {
    ...data,
    plans: data?.plans,
  };
  return (
    <section className="section pricing-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9 col-xxl-8">
            <div className="section__header text-center">
              <p
                className="h6 sub-title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {pricingData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {pricingData.title}
              </h2>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-10">
            <div className="pricing-section__inner">
              {pricingData.plans.map((plan, index) => {
                return (
                  <div
                    key={plan.id || index}
                    className="pricing-section__inner-item "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <div className="pricing__meta">
                      <div className="content">
                        <h4 className="h4">{plan.name}</h4>
                        <p>{plan.description}</p>
                      </div>
                    </div>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="price-frame">
                        <p className="h6">
                          {feature.split(" ")[0]} {feature.split(" ")[1]}
                        </p>
                        <p>{feature.split(" ").slice(2).join(" ")}</p>
                      </div>
                    ))}
                    <div className="price-plan">
                      <p className="h6">
                        <span>starting at</span> {plan.price} Only
                      </p>
                      <p>{plan.unit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div
              className="section__cta "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <Link
                href="/sign-in"
                aria-label="create account"
                className="btn btn--primary"
              >
                Get Started Now <i className="fa-solid fa-paper-plane"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;
