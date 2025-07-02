import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import YoutubeEmbed from "@/components/layout/youtube/YoutubeEmbed";

const getYoutubeVideoId = (url: string): string => {
  if (!url) return "dQw4w9WgXcQ"; // Default video ID

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : "dQw4w9WgXcQ";
};

interface Feature {
  id?: number;
  title: string;
  description: string;
  icon?: string; // Made optional since we're not using icons
}

interface ChooseSecData {
  subtitle: string;
  title: string;
  videoUrl: string;
  image: string;
  features?: Feature[];
}

interface ChooseSecProps {
  data: ChooseSecData;
}

const ChooseSec = ({ data }: ChooseSecProps) => {
  const [videoActive, setVideoActive] = useState(false);

  // Defensive fallback for missing data or videoUrl
  const sectionData = {
    subtitle: data?.subtitle || "Why choose us",
    title: data?.title || "Why we are special",
    videoUrl: data?.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: data?.image || "",
    features: data?.features || [],
  };

  // Get YouTube video ID
  const videoId = getYoutubeVideoId(sectionData.videoUrl || "");

  // Get YouTube thumbnail URL
  // Use hqdefault.jpg as it's more reliable than maxresdefault.jpg
  // maxresdefault.jpg is not always available for all videos
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Display icons for features

  return (
    <>
      <section className="section choose-section">
        <div className="container">
          <div className="row gaper align-items-center">
            <div className="col-12 col-lg-6">
              <div
                className="choose-section__thumb "
                data-aos="fade-left"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <div className="choose-section__thumb-main">
                  <Image
                    src={thumbnailUrl}
                    alt="YouTube Thumbnail"
                    width={500}
                    height={300}
                    style={{ borderRadius: "10px", objectFit: "cover" }}
                  />
                  <div className="video-wrap">
                    <a
                      title="video Player"
                      className="video-btn"
                      onClick={() => setVideoActive(true)}
                    >
                      <i className="icon-play"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-xxl-5">
              <div className="section__content choose-section__content">
                <p
                  className="h6 sub-title "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {sectionData.subtitle}
                </p>
                <h2
                  className="h2 title "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {sectionData.title}
                </h2>
                <ul>
                  {sectionData.features?.map((feature, index) => (
                    <li
                      key={feature.id || index}
                      className=""
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      <div className="icon">
                        {feature.icon && feature.icon.startsWith("/") ? (
                          <Image
                            src={feature.icon}
                            alt={feature.title}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <i className={feature.icon || "icon-check"}></i>
                        )}
                      </div>
                      <div className="content">
                        <p className="h5">{feature.title}</p>
                        <p>{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className="cta__group "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <Link href="get-quote" aria-label="free trail">
                    <i className="icon-arrow-right"></i> Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className={(videoActive ? " video-zoom-in" : " ") + " video-backdrop"}
        onClick={() => setVideoActive(false)}
      >
        <div className="video-inner">
          <div
            className="video-container"
            onClick={(e: any) => e.stopPropagation()}
          >
            {videoActive && <YoutubeEmbed embedId={videoId} />}
            <button
              aria-label="close video popup"
              className="close-video-popup"
              onClick={() => setVideoActive(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseSec;
