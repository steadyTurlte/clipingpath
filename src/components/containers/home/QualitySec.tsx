import React, { useState } from "react";
import Image from "next/image";
import BeforeAfterComparisonWrapper from "./BeforeAfterComparisonWrapper";

interface BeforeAfterImage {
  before: string;
  after: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  beforeAfterImages: BeforeAfterImage[];
}

interface DecorativeImages {
  one: string;
  two: string;
}

interface QualitySecData {
  subtitle?: string;
  title?: string;
  categories?: Category[];
  decorativeImages?: DecorativeImages;
}

interface QualitySecProps {
  data?: QualitySecData;
}

const QualitySec = ({ data }: QualitySecProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Default data if none is provided
  const qualityData = data || {
    subtitle: "Stunning Quality",
    title: "We've removed these tricky backgrounds",
    categories: [
      {
        id: 1,
        name: "people",
        icon: "icon-user",
        beforeAfterImages: [
          {
            before: "/images/after/one-before.png",
            after: "/images/after/one-after.png",
          },
        ],
      },
      {
        id: 2,
        name: "products",
        icon: "icon-hexagon",
        beforeAfterImages: [
          {
            before: "/images/after/two-before.png",
            after: "/images/after/two-after.png",
          },
        ],
      },
      {
        id: 3,
        name: "animals",
        icon: "icon-animal",
        beforeAfterImages: [
          {
            before: "/images/after/three-before.png",
            after: "/images/after/three-after.png",
          },
        ],
      },
      {
        id: 4,
        name: "cars",
        icon: "icon-car",
        beforeAfterImages: [
          {
            before: "/images/after/four-before.png",
            after: "/images/after/four-after.png",
          },
        ],
      },
      {
        id: 5,
        name: "graphics",
        icon: "icon-image",
        beforeAfterImages: [
          {
            before: "/images/after/one-before.png",
            after: "/images/after/one-after.png",
          },
        ],
      },
    ],
    decorativeImages: {
      one: "/images/quality/thumb-one.png",
      two: "/images/quality/thumb-two.png",
    },
  };

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <section className="section quality-section bg-white">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-lg-8">
            <div className="section__header text-center">
              <p
                className="h6 sub-title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {qualityData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {qualityData.title}
              </h2>
            </div>
          </div>
          <div className="col-12">
            <div
              className="quality-section__filter-btns "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              {qualityData.categories?.map((category, index) => (
                <a
                  key={category.id}
                  className={`quality-filter-btn ${
                    activeTabIndex === index
                      ? "quality-filter-btn--active"
                      : " "
                  }`}
                  onClick={() => handleTabClick(index)}
                >
                  <i className={category.icon}></i> {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div
              className="quality-section__tab "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              {qualityData.categories?.map((category, index) => (
                <div
                  key={category.id}
                  className={`quality-section__tab-item ${
                    activeTabIndex === index
                      ? "quality-section__tab-item-active"
                      : ""
                  }`}
                >
                  <div className="rangu" style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <BeforeAfterComparisonWrapper
                      beforeImage={category.beforeAfterImages[0].before}
                      afterImage={category.beforeAfterImages[0].after}
                      alt={category.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          .quality-section__tab-item {
            width: 100%;
          }
          .rangu {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
        `}</style>
      </div>
      <div className="quality-section__thumbs">
        <Image
          src={qualityData.decorativeImages?.one || "/images/quality/thumb-one.png"}
          alt="Decorative Image"
          className="one"
          width={300}
          height={300}
          unoptimized={qualityData.decorativeImages?.one?.startsWith('/images/')}
        />
        <Image
          src={qualityData.decorativeImages?.two || "/images/quality/thumb-two.png"}
          alt="Decorative Image"
          className="two"
          width={300}
          height={300}
          unoptimized={qualityData.decorativeImages?.two?.startsWith('/images/')}
        />
      </div>
    </section>
  );
};

export default QualitySec;
