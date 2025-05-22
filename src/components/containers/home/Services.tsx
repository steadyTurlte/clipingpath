import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

// Default service items for fallback
const defaultServiceItems = [
  {
    id: 1,
    title: "Clipping path services",
    image: "/images/services/slide-one.png",
    price: "$0.39 Only",
    pricePrefix: "starting at",
    link: "service-details",
    className: "on",
  },
  {
    id: 2,
    title: "Background removal",
    image: "/images/services/slide-two.png",
    price: "$0.39 Only",
    pricePrefix: "starting at",
    link: "service-details",
    className: "fi",
  },
  {
    id: 3,
    title: "Image masking",
    image: "/images/services/slide-three.png",
    price: "$0.39 Only",
    pricePrefix: "starting at",
    link: "service-details",
    className: "tw",
  },
  {
    id: 4,
    title: "Shadow creation",
    image: "/images/services/slide-four.png",
    price: "$0.39 Only",
    pricePrefix: "starting at",
    link: "service-details",
    className: "th",
  },
  {
    id: 5,
    title: "Ghost mannequin",
    image: "/images/services/slide-five.png",
    price: "$0.39 Only",
    pricePrefix: "starting at",
    link: "service-details",
    className: "fo",
  },
];

// Class names for styling different service items
const classNames = ["on", "fi", "tw", "th", "fo"];

interface ServiceItem {
  id: number;
  title: string;
  image: string;
  price: string;
  pricePrefix?: string;
  link?: string;
  className?: string;
}

interface ServicesData {
  subtitle?: string;
  title?: string;
  items?: ServiceItem[];
  services?: ServiceItem[]; // Support both items and services properties
}

interface ServicesProps {
  data?: ServicesData;
}

const Services = ({ data }: ServicesProps) => {
  // Use provided data or fallback to defaults
  const serviceData: ServicesData = data || {
    subtitle: "photodit's service",
    title: "Clipping Path Services for professional images",
    items: defaultServiceItems,
  };

  // Get service items or use defaults
  // Support both items and services properties for backward compatibility
  const serviceItems = serviceData.services || serviceData.items || defaultServiceItems;

  // Use the service items directly without duplication
  const allServiceItems = serviceItems;

  return (
    <section className="section services bg-grey">
      <div className="container">
        <div className="row align-items-center section__header--alt">
          <div className="col-12 col-lg-7 col-xxl-5">
            <div
              className="section__header "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <p className="h6 sub-title">{serviceData.subtitle}</p>
              <h2 className="h2 title">{serviceData.title}</h2>
            </div>
          </div>
          <div className="col-12 col-lg-5 col-xxl-7">
            <div className="services-pagination slick-pagination justify-content-lg-end"></div>
          </div>
        </div>
      </div>
      <div className="services__slider-wrapper">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          slidesPerGroup={1}
          speed={1200}
          loop={true}
          roundLengths={true}
          centeredSlides={true}
          modules={[Autoplay, Pagination]}
          pagination={{
            el: ".services-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            1440: {
              slidesPerView: 4,
            },
            1200: {
              slidesPerView: 3,
            },
            576: {
              slidesPerView: 2,
            },
          }}
          className="services__slider"
        >
          {allServiceItems.map((item, index) => (
            <SwiperSlide key={`service-${item.id}-${index}`}>
              <div
                className={`services__slider-single ${
                  item.className || classNames[index % classNames.length]
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={450}
                />
                <div className="services__slider-single__content">
                  <h4 className="h4">{item.title}</h4>
                  <Link href={item.link || "service-details"}>
                    <i className="icon-arrow-up"></i>
                  </Link>
                  <div className="price-tag">
                    <p>
                      {item.pricePrefix || "starting at"} <span>{item.price}</span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Services;
