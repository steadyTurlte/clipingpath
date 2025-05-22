import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface NewsSecProps {
  data?: {
    subtitle?: string;
    title?: string;
  };
  newsItems?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    date: string;
    author: string;
  }[];
}

const NewsSec = ({ data, newsItems = [] }: NewsSecProps) => {
  // Default data
  const defaultData = {
    subtitle: "latest news",
    title: "news form photodit",
  };

  // Default news items
  const defaultNewsItems = [
    {
      id: 1,
      title: "Easy Tips on Creating an Online New Year's Vision Board",
      slug: "blog-single",
      excerpt:
        "Welcome to our digital agency We specialize in helping business most like yours succeed online.",
      content: "",
      image: "/images/news/one.png",
      category: "Shadow",
      date: "21 JAN",
      author: "",
    },
    {
      id: 2,
      title: "Personal touch that's way more heartfelt than a gift shop",
      slug: "blog-single",
      excerpt:
        "Welcome to our digital agency We specialize in helping business most like yours succeed online.",
      content: "",
      image: "/images/news/two.png",
      category: "Shadow",
      date: "21 JAN",
      author: "",
    },
    {
      id: 3,
      title: "Power of a great photo backdrop — in just a few steps",
      slug: "blog-single",
      excerpt:
        "Welcome to our digital agency We specialize in helping business most like yours succeed online.",
      content: "",
      image: "/images/news/three.png",
      category: "Shadow",
      date: "21 JAN",
      author: "",
    },
  ];

  // Merge with default data
  const newsData = {
    ...defaultData,
    ...data,
  };

  // Use provided news items or default ones
  const items = newsItems.length > 0 ? newsItems : defaultNewsItems;
  return (
    <section className="section news-section">
      <div className="container">
        <div className="row align-items-center section__header--alt">
          <div className="col-12 col-lg-7 col-xxl-5">
            <div className="section__header">
              <p
                className="h6 sub-title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {newsData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {newsData.title}
              </h2>
            </div>
          </div>
          <div className="col-12 col-lg-5 col-xxl-7">
            <div className="news-pagination slick-pagination justify-content-lg-end"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="news__slider-wrapper">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                slidesPerGroup={1}
                speed={1200}
                loop={items.length >= 3}
                roundLengths={true}
                centeredSlides={items.length >= 3}
                centeredSlidesBounds={false}
                modules={[Autoplay, Pagination]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  el: ".news-pagination",
                  clickable: true,
                }}
                breakpoints={{
                  1440: {
                    slidesPerView: Math.min(3, items.length),
                  },
                  768: {
                    slidesPerView: Math.min(2, items.length),
                  },
                }}
                className="news__slider"
              >
                {items.map((item, index) => (
                  <SwiperSlide key={item.id || index}>
                    <div className="news__slider-item">
                      <div className="thumb">
                        <Link href={item.slug || "blog-single"}>
                          <Image
                            src={item.image}
                            priority
                            alt={item.title}
                            width={400}
                            height={300}
                          />
                        </Link>
                        <div className="publish-date">
                          <h4 className="h4">{item.date.split(" ")[0]}</h4>
                          <p>{item.date.split(" ")[1]}</p>
                        </div>
                      </div>
                      <div className="content">
                        <div className="tag">
                          <Link href={item.slug || "blog-single"}>
                            {item.category}
                          </Link>
                        </div>
                        <h4 className="h4">
                          <Link href={item.slug || "blog-single"}>
                            {item.title}
                          </Link>
                        </h4>
                        <div className="cta">
                          <Link href={item.slug || "blog-single"}>
                            <i className="icon-arrow-top"></i>
                          </Link>
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

export default NewsSec;
