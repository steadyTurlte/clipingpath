import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface SponsorsData {
  title?: string;
  logos?: string[];
}

interface PortfolioSponsorSliderProps {
  data?: SponsorsData;
}

const PortfolioSponsorSlider = ({ data }: PortfolioSponsorSliderProps) => {
  // Default data
  const defaultLogos = [
    "/images/placeholder.png",
    "/images/placeholder.png",
    "/images/placeholder.png",
    "/images/placeholder.png",
    "/images/placeholder.png",
    "/images/placeholder.png",
  ];

  const sponsorsData = data || {
    title: "Our Trusted Partners",
    logos: defaultLogos,
  };

  // Ensure we have valid logos
  const logos =
    sponsorsData.logos && sponsorsData.logos.length > 0
      ? sponsorsData.logos
      : defaultLogos;

  // Track which images failed to load
  const [failedImages, setFailedImages] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Handle image error
  const handleImageError = (logo: string) => {
    setFailedImages((prev) => ({
      ...prev,
      [logo]: true,
    }));
  };

  return (
    <div className="sponsor section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="section__header text-center">
              <h4
                className="h4 text-capitalize "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {sponsorsData.title}
              </h4>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12">
            <div
              className="sponsor__slider-wrapper "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <Swiper
                slidesPerView={2}
                spaceBetween={30}
                slidesPerGroup={1}
                speed={1200}
                loop={true}
                roundLengths={true}
                centeredSlides={true}
                centeredSlidesBounds={true}
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  1600: {
                    slidesPerView: 6,
                  },
                  1200: {
                    slidesPerView: 4,
                  },
                  576: {
                    slidesPerView: 3,
                  },
                }}
                className="sponsor__slider"
              >
                {logos.map((logo, index) => (
                  <SwiperSlide key={index}>
                    <div className="sponsor__slider-item">
                      <Image
                        src={
                          failedImages[logo]
                            ? "/images/placeholder.png"
                            : `${logo}${
                                logo.includes("?") ? "" : `?t=${Date.now()}`
                              }`
                        }
                        alt={`Sponsor ${index + 1}`}
                        width={150}
                        height={80}
                        priority
                        onError={() => handleImageError(logo)}
                        unoptimized={true}
                      />
                    </div>
                  </SwiperSlide>
                ))}

                {/* Add duplicates for continuous loop */}
                {logos.length < 6 &&
                  logos.map((logo, index) => (
                    <SwiperSlide key={`dup-${index}`}>
                      <div className="sponsor__slider-item">
                        <Image
                          src={
                            failedImages[logo]
                              ? "/images/placeholder.png"
                              : `${logo}${
                                  logo.includes("?") ? "" : `?t=${Date.now()}`
                                }`
                          }
                          alt={`Sponsor ${index + 1}`}
                          width={150}
                          height={80}
                          priority
                          onError={() => handleImageError(logo)}
                          unoptimized={true}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSponsorSlider;
