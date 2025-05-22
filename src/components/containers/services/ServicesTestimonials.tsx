import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import authorOne from "public/images/testimonial/author-one.png";
import authorTwo from "public/images/testimonial/author-two.png";
import authorThree from "public/images/testimonial/author-three.png";

// Default testimonials data for fallback
const defaultTestimonials = {
  subtitle: "testimonials",
  title: "What Our Clients Say",
  items: [
    {
      id: 1,
      name: "Kathryn Murphy",
      position: "CEO, Founder",
      image: authorOne,
      rating: 5,
      text: "Photodit is a fantastic service for anyone looking to enhance their product photography. The team is professional, responsive, and delivers high-quality results consistently.",
    },
    {
      id: 2,
      name: "Leslie Alexander",
      position: "Marketing Director",
      image: authorTwo,
      rating: 5,
      text: "I've been using Photodit for all my e-commerce product images, and the results have been outstanding. Their attention to detail and quick turnaround time have helped me improve my online store significantly.",
    },
    {
      id: 3,
      name: "Jenny Wilson",
      position: "Product Manager",
      image: authorThree,
      rating: 5,
      text: "The team at Photodit has been instrumental in helping us maintain a consistent look across all our product images. Their clipping path service is precise and their customer service is excellent.",
    },
  ],
};

interface TestimonialItem {
  id: number;
  name: string;
  position: string;
  image: string;
  rating: number;
  text: string;
}

interface TestimonialsData {
  subtitle?: string;
  title?: string;
  items?: TestimonialItem[];
}

interface ServicesTestimonialsProps {
  data?: TestimonialsData;
}

const ServicesTestimonials = ({ data }: ServicesTestimonialsProps) => {
  // Use provided data or fallback to defaults
  const testimonialData = data || defaultTestimonials;
  const items = testimonialData.items || defaultTestimonials.items;

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa-solid fa-star ${i <= rating ? "filled" : ""}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div
              className="section__header text-center"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <p className="h6 sub-title">{testimonialData.subtitle}</p>
              <h2 className="h2 title">{testimonialData.title}</h2>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="testimonials-slider-wrapper">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                speed={1000}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  el: ".testimonials-pagination",
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  1200: {
                    slidesPerView: 3,
                  },
                }}
                modules={[Autoplay, Pagination]}
                className="testimonials-slider"
              >
                {items.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="testimonial-card">
                      <div className="testimonial-card__rating">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="testimonial-card__text">
                        {testimonial.text}
                      </p>
                      <div className="testimonial-card__author">
                        <div className="testimonial-card__author-img">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={60}
                            height={60}
                            className="img-fluid rounded-circle"
                          />
                        </div>
                        <div className="testimonial-card__author-info">
                          <h4 className="testimonial-card__author-name">
                            {testimonial.name}
                          </h4>
                          <p className="testimonial-card__author-position">
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="testimonials-pagination"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials {
          padding: 100px 0;
          background-color: #f8fafc;
        }

        .testimonials-slider-wrapper {
          position: relative;
          padding-bottom: 60px;
        }

        .testimonial-card {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          height: 100%;
          min-height: 360px; /* Fixed height */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .testimonial-card__rating {
          margin-bottom: 16px;
          color: #f59e0b;
        }

        .testimonial-card__rating i {
          margin-right: 4px;
        }

        .testimonial-card__rating i.filled {
          color: #f59e0b;
        }

        .testimonial-card__text {
          color: #1e293b;
          font-style: italic;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .testimonial-card__author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .testimonial-card__author-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
        }

        .testimonial-card__author-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #1e293b;
        }

        .testimonial-card__author-position {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 0;
        }

        .testimonials-pagination {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 30px;
        }

        :global(.testimonials-pagination .swiper-pagination-bullet) {
          width: 10px;
          height: 10px;
          background-color: #cbd5e1;
          opacity: 1;
        }

        :global(.testimonials-pagination .swiper-pagination-bullet-active) {
          background-color: #4569e7;
        }
      `}</style>
    </section>
  );
};

export default ServicesTestimonials;
