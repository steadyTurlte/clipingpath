import React from "react";

type videoProps = {
  embedId: string;
};

const YoutubeEmbed = ({ embedId }: videoProps) => {
  return (
    <div className="youtube-embed-container">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        className="video"
      />
      <style jsx>{`
        .youtube-embed-container {
          position: relative;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          aspect-ratio: 16/9;
        }

        .youtube-embed-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default YoutubeEmbed;
