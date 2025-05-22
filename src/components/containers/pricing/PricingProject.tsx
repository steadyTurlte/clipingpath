import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Car from "public/images/project/car.png";

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  link: string;
}

interface ProjectData {
  subtitle?: string;
  title?: string;
  description?: string;
  items?: ProjectItem[];
}

interface PricingProjectProps {
  data?: ProjectData;
}

const PricingProject = ({ data }: PricingProjectProps) => {
  // Default data if none provided
  const defaultData = {
    subtitle: "recent completed projects",
    title: "Our most popular photo-editing services",
    description: "",
    items: [
      {
        id: 1,
        title: "Multi-clipping Path",
        category: "Clipping Path",
        image: "/images/project/car.png",
        link: "service-details",
      },
      {
        id: 2,
        title: "Multi-clipping Path",
        category: "Clipping Path",
        image: "/images/project/car.png",
        link: "service-details",
      },
      {
        id: 3,
        title: "Multi-clipping Path",
        category: "Clipping Path",
        image: "/images/project/car.png",
        link: "service-details",
      },
    ],
  };

  // Use provided data or defaults
  const projectData = data || defaultData;
  const projectItems = projectData.items || [];
  return (
    <section className="section recent-project">
      <div className="container">
        <div className="row align-items-center section__header--alt">
          <div className="col-12 col-lg-7">
            <div className="section__header">
              <p
                className="h6 sub-title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {projectData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {projectData.title}
              </h2>
              {projectData.description && (
                <div
                  className="paragraph"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="200"
                >
                  <p>{projectData.description}</p>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="recent-project-pagination slick-pagination justify-content-lg-end"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="recent-project__inner">
              <div className="recent-project__slider-wrapper">
                {projectItems.length > 0 ? (
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    slidesPerGroup={1}
                    speed={1200}
                    loop={projectItems.length > 1}
                    roundLengths={false}
                    centeredSlides={false}
                    centeredSlidesBounds={false}
                    modules={[Autoplay, Pagination]}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    pagination={{
                      el: ".recent-project-pagination",
                      clickable: true,
                    }}
                    className="recent-project__slider"
                  >
                    {projectItems.map((item) => (
                      <SwiperSlide key={item.id}>
                        <div className="recent-project__slider-item">
                          <div className="recent-project__slider-item-inner">
                            <div className="thumb">
                              {item.image.startsWith("/") ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={600}
                                  height={400}
                                />
                              ) : (
                                <Image src={Car} alt={item.title} />
                              )}
                            </div>
                            <div className="content section__content">
                              <h2 className="h2 title">{item.title}</h2>
                              {item.category && (
                                <div className="category">
                                  <span>{item.category}</span>
                                </div>
                              )}
                              <div className="cta__group justify-content-start">
                                <Link
                                  href={item.link}
                                  className="btn btn--secondary"
                                >
                                  view details
                                </Link>
                                <Link
                                  href="contact-us"
                                  className="btn btn--primary"
                                >
                                  Order Now
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="recent-project__empty">
                    <p>No projects available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .recent-project__empty {
          padding: 40px;
          text-align: center;
          background-color: #f8fafc;
          border-radius: 8px;
        }

        .category {
          margin-bottom: 16px;
        }

        .category span {
          display: inline-block;
          padding: 4px 12px;
          background-color: #f1f5f9;
          color: #64748b;
          border-radius: 4px;
          font-size: 14px;
        }
      `}</style>
    </section>
  );
};

export default PricingProject;
