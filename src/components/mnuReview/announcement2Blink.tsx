// file: announcement2Blink.tsx

import React from "react";

interface SmoothVerticalTickerProps {
  announcements: string[];
  height?: number;      // height of one line in px
  pauseTime?: number;   // seconds per announcement
  speed?: number;       // optional speed prop in ms per tick
}

const SmoothVerticalTicker: React.FC<SmoothVerticalTickerProps> = ({
  announcements,
  height = 40,
  pauseTime = 4,
}) => {
  const repeatedAnnouncements = [...announcements, ...announcements];
  const totalItems = announcements.length;

  const animationDuration = totalItems * pauseTime;

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
          animation: `scrollStep ${animationDuration}s steps(${totalItems}) infinite`,
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
          @keyframes scrollStep {
            from { transform: translateY(0); }
            to { transform: translateY(-${totalItems * height}px); }
          }
        `}
      </style>
    </div>
  );
};

export default SmoothVerticalTicker;
