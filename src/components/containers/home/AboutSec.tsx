import React from "react";
import Image from "next/image";
import Link from "next/link";
import AboutThumb from "public/images/about-thumb.png";

interface AboutSecProps {
  data: {
    subtitle: string;
    title: string;
    description: string;
    additionalText: string;
    priceTag: string;
    image: string;
  };
}

const AboutSec = ({ data }: AboutSecProps) => {
  const aboutData = {
    ...data,
  };
  return (
    <section className="section bg-white about-section">
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
                src={aboutData.image || AboutThumb}
                alt="About Image"
                width={600}
                height={600}
              />
              <div className="about-section__thumb-content">
                <p className="h5">{aboutData.priceTag}</p>
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
                {aboutData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {aboutData.title}
              </h2>
              <div
                className="paragraph "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <p className="fw-5 ">{aboutData.description}</p>
                <p>{aboutData.additionalText}</p>
              </div>
              <div
                className="cta__group justify-content-start "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <Link href="/about-us" className="btn btn--primary">
                  Know More
                </Link>
                <Link href="/contact-us" className="btn btn--secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSec;
