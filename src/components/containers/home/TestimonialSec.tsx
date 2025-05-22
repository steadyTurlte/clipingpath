import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import authorone from "public/images/testimonial/author-one.png";
import authortwo from "public/images/testimonial/author-two.png";
import authorthree from "public/images/testimonial/author-three.png";
import mc from "public/images/mc.png";

interface TestimonialSecProps {
  data?: {
    subtitle?: string;
    title?: string;
    decorativeImage?: string;
    items?: {
      id: number;
      name: string;
      position: string;
      image: string;
      text: string;
    }[];
  };
}

const TestimonialSec = ({ data }: TestimonialSecProps) => {
  // Default data
  const defaultData = {
    subtitle: "customer testimonial",
    title: "They love us. You will too.",
    decorativeImage: "/images/mc.png",
    items: [
      {
        id: 1,
        name: "Delores Olivo",
        position: "Senior Technology Editor",
        image: authorone,
        rating: 5,
        text: "Welcome to our digital agency We specialize in helping business most like yours succeed online. From website design and development to digital marketing agency",
      },
      {
        id: 2,
        name: "Endru Kolins",
        position: "CEO",
        image: authortwo,
        rating: 5,
        text: "Welcome to our digital agency We specialize in helping business most like yours succeed online. From website design and development to digital marketing agency",
      },
      {
        id: 3,
        name: "Delores Olivo",
        position: "Content & Marketing Coordinator",
        image: authorthree,
        rating: 5,
        text: "Welcome to our digital agency We specialize in helping business most like yours succeed online. From website design and development to digital marketing agency",
      },
    ],
  };

  // Merge with default data
  const testimonialData = {
    ...defaultData,
    ...data,
    items: data?.items || defaultData.items,
  };
  const colors = ["#4569e7", "#e74545", "#181818"];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const handleSlideChange = () => {
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    setCurrentColorIndex(nextColorIndex);
  };

  const currentBackgroundColor = colors[currentColorIndex];

  return (
    <section
      className="section testimonial"
      style={{ backgroundColor: currentBackgroundColor }}
    >
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-xl-4">
            <div className="section__content testimonial__content">
              <p
                className="h6 sub-title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {testimonialData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {testimonialData.title}
              </h2>
              <div
                className="paragraph "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <p>
                  Because a quick product shoot can easily turn into a week or
                  more of editing and formatting your images. Let us look after
                  the edits,
                </p>
              </div>
              <div className="testimonial__content-cta section__content-cta">
                <button
                  aria-label="previous item"
                  className="slide-btn prev-testimonial"
                >
                  <i className="icon-arrow-left"></i>
                </button>
                <button
                  aria-label="next item"
                  className="slide-btn next-testimonial"
                >
                  <i className="icon-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-8">
            <div className="testimonial__slider-wrapper">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                slidesPerGroup={1}
                speed={1200}
                loop={true}
                roundLengths={true}
                centeredSlides={false}
                centeredSlidesBounds={false}
                modules={[Autoplay, Navigation]}
                navigation={{
                  nextEl: ".next-testimonial",
                  prevEl: ".prev-testimonial",
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  1800: {
                    slidesPerView: 4,
                  },
                  1440: {
                    slidesPerView: 3,
                  },
                  1200: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 1.8,
                  },
                }}
                className="testimonial__slider"
                onSlideChange={handleSlideChange}
                style={{ height: "auto" }}
                autoHeight={false}
              >
                {testimonialData.items.map((item, index) => (
                  <SwiperSlide key={item.id || index}>
                    <div className="testimonial__slider-item">
                      <div className="quote">
                        <i className="icon-quote"></i>
                      </div>
                      <div className="content" style={{ flex: 1 }}>
                        <q className="h4">{item.text}</q>
                      </div>
                      <hr />
                      <div className="item__meta">
                        <div className="meta__thumb">
                          <Image
                            priority
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                          />
                        </div>
                        <div className="meta__content">
                          <p className="h5">{item.name}</p>
                          <p>{item.position}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                {/* Duplicate items to ensure enough slides for the loop */}
                {testimonialData.items.map((item, index) => (
                  <SwiperSlide key={`dup-${item.id || index}`}>
                    <div className="testimonial__slider-item">
                      <div className="quote">
                        <i className="icon-quote"></i>
                      </div>
                      <div className="content" style={{ flex: 1 }}>
                        <q className="h4">{item.text}</q>
                      </div>
                      <hr />
                      <div className="item__meta">
                        <div className="meta__thumb">
                          <Image
                            priority
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                          />
                        </div>
                        <div className="meta__content">
                          <p className="h5">{item.name}</p>
                          <p>{item.position}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSec;
