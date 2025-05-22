import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface AboutSponsorProps {
  data: {
    title: string;
    logos: string[];
  };
}

const AboutSponsor = ({ data }: AboutSponsorProps) => {
  const sponsorData = {
    ...data,
    logos: data.logos,
  };
  return (
    <div className="sponsor-three sponsor-alt section pb-0">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="sponsor-three__inner "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <div className="row">
                <div className="col-12">
                  <div className="section__header text-center">
                    <h4 className="h4 text-capitalize">{sponsorData.title}</h4>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="sponsor__three-slider-wrapper">
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
                          slidesPerView: 5,
                        },
                        1200: {
                          slidesPerView: 3,
                        },
                        768: {
                          slidesPerView: 2,
                        },
                      }}
                      className="sponsor__three-slider"
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
        </div>
      </div>
    </div>
  );
};

export default AboutSponsor;
