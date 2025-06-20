import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  text: string;
  link: string;
}

interface CmnBannerProps {
  title: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const CmnBanner = ({ title, image, breadcrumbs }: CmnBannerProps) => {
  // Use default breadcrumbs if none are provided
  const defaultBreadcrumbs = [
    { text: "Home", link: "/" },
    { text: title, link: "" }
  ];

  const displayBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  // Create a style object for the background image if one exists
  const bannerStyle = image ? {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative' as 'relative'
  } : {};

  return (
    <section className="cmn-banner section" style={bannerStyle}>
      {/* Add an overlay if there's a background image */}
      {image && (
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
              style={{ color: image ? '#ffffff' : 'inherit' }}
            >
              {title}
            </h2>
          </div>
          <div className="col-12 col-md-4">
            <nav aria-label="breadcrumb">
              <ol
                className="breadcrumb justify-content-md-end"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {displayBreadcrumbs.map((item, index) => (
                  <li
                    key={index}
                    className={`breadcrumb-item ${!item.link ? 'active' : ''}`}
                    aria-current={!item.link ? 'page' : undefined}
                    style={{ color: image ? '#ffffff' : 'inherit' }}
                  >
                    {item.link && item.link !== "" ? (
                      <Link
                        href={item.link}
                        style={{ color: image ? '#ffffff' : 'inherit' }}
                      >
                        {item.text}
                      </Link>
                    ) : (
                      item.text
                    )}
                  </li>
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

export default CmnBanner;
