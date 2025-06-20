import React from "react";
import Link from "next/link";

interface AboutBannerProps {
  data?: {
    title?: string;
    image?: string;
    breadcrumbs?: {
      text: string;
      link: string;
    }[];
  };
}

const AboutBanner = ({ data }: AboutBannerProps) => {
  // Default data
  const defaultData = {
    title: "Something About Us",
    image: "",
    breadcrumbs: [
      {
        text: "Home",
        link: "/"
      },
      {
        text: "About Us",
        link: "/about-us"
      }
    ]
  };

  // Merge with default data
  const bannerData = {
    ...defaultData,
    ...data,
    breadcrumbs: data?.breadcrumbs || defaultData.breadcrumbs
  };
  // Create a style object for the background image if one exists
  const bannerStyle = bannerData.image ? {
    backgroundImage: `url(${bannerData.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative' as 'relative'
  } : {};

  return (
    <section className="cmn-banner cmn-banner--alt section" style={bannerStyle}>
      {/* Add an overlay if there's a background image */}
      {bannerData.image && (
        <div className="banner-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}></div>
      )}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row gaper align-items-center">
          <div className="col-12 col-md-8">
            <h2
              className="h2 title"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
              style={{ color: bannerData.image ? '#ffffff' : 'inherit' }}
            >
              {bannerData.title}
            </h2>
          </div>
          <div className="col-12 col-md-4">
            <nav aria-label="breadcrumb">
              <ol
                className="breadcrumb justify-content-md-end"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
                style={{ color: bannerData.image ? '#ffffff' : 'inherit' }}
              >
                {bannerData.breadcrumbs.map((breadcrumb, index) => (
                  index === bannerData.breadcrumbs.length - 1 ? (
                    <li
                      key={index}
                      className="breadcrumb-item active"
                      aria-current="page"
                      style={{ color: bannerData.image ? '#ffffff' : 'inherit' }}
                    >
                      {breadcrumb.text}
                    </li>
                  ) : (
                    <li key={index} className="breadcrumb-item">
                      <Link
                        href={breadcrumb.link}
                        style={{ color: bannerData.image ? '#ffffff' : 'inherit' }}
                      >
                        {breadcrumb.text}
                      </Link>
                    </li>
                  )
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="left-triangle">
        <div className="triangle"></div>
      </div>
      <div className="right-triangle">
        <div className="triangle"></div>
        <div className="right-alt"></div>
      </div>
    </section>
  );
};

export default AboutBanner;
