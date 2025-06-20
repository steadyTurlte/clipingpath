import React from "react";
import Image from "next/image";
import Link from "next/link";
import Thumb from "public/images/about-thumb.png";

interface AboutMainProps {
  data: {
    subtitle?: string;
    title?: string;
    description?: string;
    additionalText?: string;
    priceTag?: string;
    image?: string;
  };
}

const AboutMain = ({ data }: AboutMainProps) => {
  const mainData = {
    ...data,
  };
  return (
    <section className="section bg-alt about-section">
      <div className="container">
        <div className="row gaper align-items-center">
          <div className="col-12 col-lg-5 col-xl-6">
            <div
              className="about-section__thumb "
              data-aos="fade-left"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <Image
                src={mainData.image || Thumb}
                alt="About Image"
                width={600}
                height={600}
              />
              <div className="about-section__thumb-content">
                <p className="h5">{mainData.priceTag}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 col-xl-6">
            <div className="about-section__content section__content">
              <p
                className="h6 sub-title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {mainData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {mainData.title}
              </h2>
              <div
                className="paragraph "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="600"
              >
                <p className="fw-5">{mainData.description}</p>
                <p>{mainData.additionalText}</p>
              </div>
              <div
                className="cta__group justify-content-start "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {[
                  {
                    text: "Know More",
                    link: "about-us",
                    type: "primary",
                  },
                  {
                    text: "Contact Us",
                    link: "contact-us",
                    type: "secondary",
                  },
                ].map((button, index) => (
                  <Link
                    key={index}
                    href={button.link}
                    className={`btn btn--${button.type}`}
                  >
                    {button.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMain;
