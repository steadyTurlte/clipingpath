import React from "react";
import Image from "next/image";
import Link from "next/link";
import Thumb from "public/images/quote-thumb.png";
import Anime from "public/images/quote-anime.png";
import Counter from "../Counter";

interface Statistic {
  id: number;
  value: string;
  symbol: string;
  label: string;
}

interface Hero {
  subtitle?: string;
  title: string;
  description: string;
  mainImage?: string;
  decorativeImage?: string;
}

interface QuoteOverviewProps {
  hero?: Hero;
  statistics?: Statistic[];
}

const QuoteOverview = ({ hero, statistics }: QuoteOverviewProps) => {
  // Default values if props are not provided
  const defaultHero: Hero = {
    title: "Price Quotes At photodit",
    description: "Select multiple areas within your image so they can be edited separately. Put your images on any background color or setting",
    mainImage: undefined,
    decorativeImage: undefined
  };

  const defaultStatistics = [
    { id: 1, value: "90", symbol: "+", label: "Certified Professionals" },
    { id: 2, value: "80", symbol: "%", label: "Faster Delivery" },
    { id: 3, value: "85", symbol: "%", label: "Lower Cost" }
  ];

  // Use provided data or defaults
  const displayHero = hero || defaultHero;
  const displayStats = statistics || defaultStatistics;

  return (
    <div className="section quote-overview">
      <div className="container">
        <div className="row gaper align-items-center">
          <div className="col-12 col-lg-7 col-xl-6 col-xxl-5">
            <div className="quote-overview__content section__content">
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {displayHero.title}
              </h2>
              <div
                className="paragraph "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <p>{displayHero.description}</p>
              </div>
              <div className="quote__counter">
                {displayStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="single "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <h4 className="h4">
                      <span className="odometer">
                        <Counter value={parseInt(stat.value)} />
                      </span>
                      <span>{stat.symbol}</span>
                    </h4>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="cta__group justify-content-start">
                <Link href="sign-in" className="btn btn--secondary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5 col-xl-6 col-xxl-6 offset-xxl-1">
            <div
              className="quote-overview__thumb "
              data-aos="fade-right"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <Image
                src={displayHero.mainImage ? displayHero.mainImage : Thumb}
                alt="Quote Overview Image"
                width={600}
                height={600}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
      <Image
        src={displayHero.decorativeImage ? displayHero.decorativeImage : Anime}
        alt="Decorative Image"
        className="quote-anime"
        width={300}
        height={300}
      />
    </div>
  );
};

export default QuoteOverview;
