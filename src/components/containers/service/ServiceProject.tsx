import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface ProjectItem {
  id?: number;
  title?: string;
  category?: string;
  image?: string;
}

interface ProjectData {
  subtitle?: string;
  title?: string;
  description?: string;
  items?: ProjectItem[];
}

interface ServiceProjectProps {
  data?: ProjectData;
}

const ServiceProject = ({ data }: ServiceProjectProps) => {
  // Default data
  const projectData = data || {
    subtitle: "recent completed projects",
    title: "beautiful clipping path projects",
    description: "Browse through our portfolio of recent projects to see the quality of our work.",
    items: [
      {
        id: 1,
        title: "Product Photography",
        category: "E-commerce",
        image: "/images/project-one.png"
      },
      {
        id: 2,
        title: "Fashion Photography",
        category: "Retail",
        image: "/images/project-two.png"
      },
      {
        id: 3,
        title: "Jewelry Photography",
        category: "Luxury",
        image: "/images/project-three.png"
      }
    ]
  };

  return (
    <section className="section project-three">
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
                <p
                  className="paragraph"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {projectData.description}
                </p>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="project-three-pagination slick-pagination justify-content-lg-end"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="project-three__slider-wrapper" style={{ margin: "30px 0" }}>
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                slidesPerGroup={1}
                speed={1200}
                loop={true}
                modules={[Autoplay, Pagination]}
                pagination={{
                  el: ".project-three-pagination",
                  clickable: true,
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  1200: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                }}
                className="project-three__slider"
              >
                {projectData.items && projectData.items.map((item, index) => (
                  <SwiperSlide key={item.id || index} style={{ height: "auto" }}>
                    <div className="project-three__slider-item" style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "8px",
                      aspectRatio: "4/3",
                      height: "300px",
                      width: "100%",
                      display: "block"
                    }}>
                      <Image
                        src={item.image || "/images/project-one.png"}
                        alt={item.title || "Project Image"}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          borderRadius: "8px"
                        }}
                        priority
                      />
                      {(item.title || item.category) && (
                        <div className="project-three__slider-item-content" style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "16px",
                          background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                          color: "white",
                          zIndex: 2
                        }}>
                          {item.title && <h4 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "600" }}>{item.title}</h4>}
                          {item.category && <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>{item.category}</p>}
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="section__cta">
              <Link
                href="sign-in"
                aria-label="create account"
                className="btn btn--primary"
              >
                get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProject;
