import React, { useState } from "react";
import Image from "next/image";
import YoutubeEmbed from "@/components/layout/youtube/YoutubeEmbed";
import Bg from "public/images/video-modal-bg.png";

interface PortfolioPopupProps {
  data?: {
    embedId?: string;
    backgroundImage?: string;
  };
}

const PortfolioPopup = ({ data }: PortfolioPopupProps) => {
  const [videoActive, setVideoActive] = useState(false);
  const videoId = data?.embedId || "fSv6UgCkuTU";

  // Get YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      className="video-modal-two"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay="100"
    >
      {/* YouTube Thumbnail */}
      <div className="youtube-thumbnail-container">
        <div className="youtube-thumbnail" onClick={() => setVideoActive(true)}>
          <Image
            src={thumbnailUrl}
            alt="Video Thumbnail"
            width={1280}
            height={720}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "8px"
            }}
            onError={(e) => {
              // Fallback to hqdefault if maxresdefault is not available
              const target = e.target as HTMLImageElement;
              target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />

          {/* Overlay with centered play button */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            className="video-overlay"
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '3px solid white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '32px',
                transition: 'transform 0.3s ease'
              }}
              className="play-button"
            >
              <i className="icon-play"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      <div
        className={(videoActive ? " video-zoom-in" : " ") + " video-backdrop"}
        onClick={() => setVideoActive(false)}
        style={{ zIndex: 9999 }}
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

      <style jsx>{`
        .youtube-thumbnail-container {
          padding: 40px 20px;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }

        .youtube-thumbnail {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          aspect-ratio: 16/9;
          cursor: pointer;
        }

        .youtube-thumbnail:hover .video-overlay {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }

        .youtube-thumbnail:hover .play-button {
          transform: scale(1.1) !important;
          background-color: rgba(255, 255, 255, 0.3) !important;
        }

        .video-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 9999;
          padding: 20px;
        }

        .video-zoom-in {
          opacity: 1;
          visibility: visible;
        }

        .video-inner {
          width: 95%;
          max-width: 1000px;
          position: relative;
        }

        .video-container {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .close-video-popup {
          position: absolute;
          top: -50px;
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-video-popup:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default PortfolioPopup;
