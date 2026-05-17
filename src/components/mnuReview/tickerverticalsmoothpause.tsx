// file:    src/components/mnunReview/tickerverticalsmoothpause.tsx


// import React from "react";
import React, { useEffect, useState, useRef } from "react";

interface SmoothVerticalTickerProps {
  announcements: string[];
  height?: number;      // height of one line in px
  speed?: number;       // scroll speed in pixels per second
  pauseDuration?: number; // milliseconds
}

const SmoothVerticalTicker: React.FC<SmoothVerticalTickerProps> = ({
  announcements,
  height = 40,
  speed = 30,
  pauseDuration = 2000, // default 2 seconds pause
}) => {
    const [isPaused, setIsPaused] = useState(false);
const prevLengthRef = useRef(announcements.length);
  // Duplicate the announcements to create seamless loop
  const repeatedAnnouncements = [...announcements, ...announcements];

  // Total height for animation
  const totalHeight = announcements.length * height;

  const animationDuration = totalHeight / speed; // seconds

   // ✅ Detect when NEW item is added
  useEffect(() => {
    const prevLength = prevLengthRef.current;

    if (announcements.length > prevLength) {
      setIsPaused(true);

      const timer = setTimeout(() => {
        setIsPaused(false);
      }, pauseDuration);

      prevLengthRef.current = announcements.length;

      return () => clearTimeout(timer);
    }

    prevLengthRef.current = announcements.length;
  }, [announcements.length, pauseDuration]);

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
          animationPlayState: isPaused ? "paused" : "running",
          transition: "animation-play-state 0.3s ease",
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
