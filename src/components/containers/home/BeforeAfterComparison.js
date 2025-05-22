import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const BeforeAfterComparison = ({ beforeImage, afterImage, alt }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const offsetX = e.clientX - containerRect.left;

      // Calculate position as percentage
      let newPosition = (offsetX / containerWidth) * 100;

      // Clamp position between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));

      setSliderPosition(newPosition);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && containerRef.current && e.touches[0]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const offsetX = e.touches[0].clientX - containerRect.left;

      // Calculate position as percentage
      let newPosition = (offsetX / containerWidth) * 100;

      // Clamp position between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));

      setSliderPosition(newPosition);
    }
  };

  useEffect(() => {
    // Add global event listeners for mouse and touch events
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Clean up event listeners
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="comparison-container">
      <div
        className="comparison-wrapper"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Before image container */}
        <div className="image-container">
          <div className="comparison-image-wrapper">
            <Image
              src={beforeImage}
              alt={`Before: ${alt}`}
              className="comparison-image"
              fill
              sizes="100vw"
              priority
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              unoptimized={beforeImage.startsWith('http')}
            />
          </div>
        </div>

        {/* After image container with clip-path */}
        <div
          className="image-container after-container"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        >
          <div className="comparison-image-wrapper">
            <Image
              src={afterImage}
              alt={`After: ${alt}`}
              className="comparison-image"
              fill
              sizes="100vw"
              priority
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              unoptimized={afterImage.startsWith('http')}
            />
          </div>
        </div>

        {/* Slider control */}
        <div
          className="slider-control"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="slider-line"></div>
          <div className="slider-button">
            <i className="fa-solid fa-chevron-left"></i>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>

        {/* Labels */}
        <div className="comparison-labels">
          <div className="comparison-label before-label">Before</div>
          <div className="comparison-label after-label">After</div>
        </div>
      </div>

      <style jsx>{`
        .comparison-container {
          width: 100%;
          margin: 0 auto;
        }

        .comparison-wrapper {
          position: relative;
          width: 100%;
          height: 400px;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: col-resize;
          user-select: none;
          background-color: #f5f5f5;
        }

        .image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .after-container {
          z-index: 2;
        }

        .comparison-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .comparison-image {
          max-width: none !important;
        }

        .slider-control {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          z-index: 3;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .slider-line {
          width: 2px;
          height: 100%;
          background-color: white;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }

        .slider-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          cursor: grab;
        }

        .slider-button i:first-child {
          margin-right: 4px;
        }

        .comparison-labels {
          position: absolute;
          top: 16px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 4;
        }

        .comparison-label {
          padding: 4px 12px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 14px;
          font-weight: 500;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .comparison-wrapper {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default BeforeAfterComparison;
