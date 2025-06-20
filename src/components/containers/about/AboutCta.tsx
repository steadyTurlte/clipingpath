import React from "react";
import Image from "next/image";
import Link from "next/link";
import ctaThumb from "public/images/cta-thumb.png";
import upload from "public/images/upload.png";

interface AboutCtaProps {
  data?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

const AboutCta = ({ data }: AboutCtaProps) => {
  const ctaData = {
    ...data,
  };
  return (
    <section className="try-cta bg-white section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-10">
            <div className="try-cta__inner">
              <div className="row gaper align-items-center">
                <div className="col-12 col-lg-6">
                  <div
                    className="try-cta__thumb "
                    data-aos="fade-left"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <Image
                      src={ctaData.image || ctaThumb}
                      alt="CTA Image"
                      width={600}
                      height={400}
                      unoptimized={ctaData.image?.startsWith("/images/")}
                    />
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="try-cta__content section__content">
                    <p
                      className="h6 sub-title "
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      try free now
                    </p>
                    <h2
                      className="h2 title "
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      {ctaData.title}
                    </h2>
                    <div
                      className="paragraph "
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      <p>{ctaData.description}</p>
                    </div>
                    <div
                      className="cta__group "
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      <Link href="/get-quote" className="btn btn--secondary">
                        <Image src={upload} alt="Image" /> Get a Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCta;
