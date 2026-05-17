// file: announcement3VertScroll.tsx

import React from "react";

interface SmoothVerticalTickerProps {
  announcements: string[];
  height?: number;      // height of one line in px
  speed?: number;       // scroll speed in pixels per second
}

const SmoothVerticalTicker: React.FC<SmoothVerticalTickerProps> = ({
  announcements,
  height = 40,
  speed = 30,
}) => {
  // Duplicate the announcements to create seamless loop
  const repeatedAnnouncements = [...announcements, ...announcements];

  // Total height for animation
  const totalHeight = announcements.length * height;

  const animationDuration = totalHeight / speed; // seconds

  return (
    <div
      style={{
        height: `${height}px`,
        overflow: "hidden",
        position: "relative",
        width: "100%",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        fontWeight: 500,
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: `scrollY ${animationDuration}s linear infinite`,
        }}
      >
        {repeatedAnnouncements.map((line, index) => (
          <div
            key={index}
            style={{
              height: `${height}px`,
              lineHeight: `${height}px`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes scrollY {
            0% { transform: translateY(0); }
            100% { transform: translateY(-${totalHeight}px); }
          }
        `}
      </style>
    </div>
  );
};

export default SmoothVerticalTicker;
