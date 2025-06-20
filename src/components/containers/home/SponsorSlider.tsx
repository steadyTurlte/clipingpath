import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "public/images/sponsor/one.png";
import two from "public/images/sponsor/two.png";
import three from "public/images/sponsor/three.png";
import four from "public/images/sponsor/four.png";
import five from "public/images/sponsor/five.png";
import six from "public/images/sponsor/six.png";

interface SponsorSliderProps {
  data?: {
    title?: string;
    logos?: string[];
  };
}

const SponsorSlider = ({ data }: SponsorSliderProps) => {
  // Default data
  const defaultData = {
    title: "Trusted by Leading Brands",
    logos: [
      "/images/sponsor/one.png",
      "/images/sponsor/two.png",
      "/images/sponsor/three.png",
      "/images/sponsor/four.png",
      "/images/sponsor/five.png",
      "/images/sponsor/six.png"
    ]
  };

  // Merge with default data
  const sponsorData = {
    ...defaultData,
    ...data,
    logos: data?.logos || defaultData.logos
  };
  return (
    <div className="sponsor section">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="sponsor__slider-wrapper ">
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
                {sponsorData.logos.map((logo, index) => (
                  <SwiperSlide key={index}>
                    <div className="sponsor__slider-item">
                      <Image
                        src={logo}
                        priority
                        alt={`Sponsor ${index + 1}`}
                        width={200}
                        height={100}
                      />
                    </div>
                  </SwiperSlide>
                ))}

                {/* Duplicate logos to ensure enough slides for the loop */}
                {sponsorData.logos.map((logo, index) => (
                  <SwiperSlide key={`dup-${index}`}>
                    <div className="sponsor__slider-item">
                      <Image
                        src={logo}
                        priority
                        alt={`Sponsor ${index + 1}`}
                        width={200}
                        height={100}
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

export default SponsorSlider;
