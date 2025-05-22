import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface AboutTeamProps {
  data: {
    subtitle: string;
    title: string;
    description: string;
    members?: {
      id: number;
      name: string;
      position: string;
      image: string;
      socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
      };
    }[];
  };
}

const AboutTeam = ({ data }: AboutTeamProps) => {
  const teamData = {
    ...data,
    members: data.members,
  };
  return (
    <section className="section team-two pb-0">
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
                {teamData.subtitle}
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {teamData.title}
              </h2>
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div
              className="paragraph "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <p>{teamData.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="team-two__slider-wrapper">
        <Swiper
          slidesPerView={1}
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
          className="team-two__slider"
        >
          {teamData.members && teamData.members.map((member, index) => (
            <SwiperSlide key={member.id || index}>
              <div className="team-two__slider-item">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                />
                <div className="content">
                  <h4 className="h4">
                    <Link href="teams">{member.name}</Link>
                  </h4>
                  <p>{member.position}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AboutTeam;
