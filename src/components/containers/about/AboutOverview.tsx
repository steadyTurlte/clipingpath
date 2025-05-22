import React from "react";
import Image from "next/image";
import One from "public/images/about/about-overview-one.png";
import Two from "public/images/about/about-overview-two.png";

interface AboutOverviewProps {
  data: {
    images: string[];
    title: string;
    description: string;
    mission: string;
  };
}

const AboutOverview = ({ data }: AboutOverviewProps) => {
  const overviewData = {
    ...data,
    images: data.images,
  };
  return (
    <section className="about-overview section pt-0">
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-lg-7">
            <div
              className="about-overview__single "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <Image
                src={overviewData.images[0] || One}
                alt="Overview Image 1"
                width={600}
                height={400}
              />
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div
              className="about-overview__single "
              data-aos="fade-right"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <Image
                src={overviewData.images[1] || Two}
                alt="Overview Image 2"
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
        <div className="row gaper">
          <div className="col-12 col-lg-6">
            <h2
              className="h2 title "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              {overviewData.title}
            </h2>
          </div>
          <div className="col-12 col-lg-6">
            <div
              className="paragraph "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <p>{overviewData.description}</p>
              <p className="h6">Our Mission</p>
              <p>{overviewData.mission}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOverview;
