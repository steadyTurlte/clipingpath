import React from "react";
import Link from "next/link";
import Image from "next/image";

// Define default banner data
const DEFAULT_BANNER_DATA = {
  subtitle: "Get pixel perfect image editing services",
  title: "Photo Editing & Graphic Design Made for Everyone",
  images: {
    main: "/images/banner/thumb.png",
    after: "/images/banner/after.png",
    smallImages: [
      "/images/banner/one.png",
      "/images/banner/two.png",
      "/images/banner/three.png",
      "/images/banner/four.png",
    ],
  },
};

interface BannerImages {
  main?: string;
  after?: string;
  smallImages?: string[];
}

interface BannerData {
  subtitle?: string;
  title?: string;
  images?: BannerImages;
}

interface HomeOneBannerProps {
  data?: BannerData;
}

const HomeOneBanner = ({ data }: HomeOneBannerProps) => {
  // Ensure we have valid data with all required properties
  const bannerData = {
    ...DEFAULT_BANNER_DATA,
    ...data,
    // Make sure images object exists and has all required properties
    images: {
      ...DEFAULT_BANNER_DATA.images,
      ...(data?.images || {}),
      // Ensure smallImages is an array
      smallImages: [
        ...(data?.images?.smallImages ||
          DEFAULT_BANNER_DATA.images.smallImages),
      ],
    },
  };

  return (
    <section className="banner bg-white">
      <div className="container">
        <div className="row justify-content-center gaper">
          <div className="col-12 col-md-10 col-xxl-11">
            <div className="banner__content">
              <p
                className="h6 "
                data-aos="fade-left"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {bannerData.subtitle}
              </p>
              <h1
                className="h1 "
                data-aos="fade-left"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {bannerData.title}
              </h1>
              <div
                className="cta__group "
                data-aos="fade-left"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <Link
                  href="/get-quote"
                  aria-label="create account"
                  className="btn btn--primary"
                >
                  Free Trial <i className="fa-solid fa-paper-plane"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8">
            <div
              className="banner__thumb "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="600"
            >
              <Image
                src={bannerData.images.main}
                alt="Banner Main Image"
                width={570}
                height={570}
                unoptimized={bannerData.images.main?.startsWith("/images/")}
              />
              <Image
                src={bannerData.images.after}
                alt="Banner After Image"
                className="after"
                width={570}
                height={570}
                unoptimized={bannerData.images.after?.startsWith("/images/")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="banner__small-thumb">
        {bannerData.images.smallImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Banner Small Image ${index + 1}`}
            className={`${
              index === 0
                ? "one"
                : index === 1
                ? "two"
                : index === 2
                ? "three"
                : "four"
            }`}
            width={100}
            height={100}
            unoptimized={image?.startsWith("/images/")}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeOneBanner;
