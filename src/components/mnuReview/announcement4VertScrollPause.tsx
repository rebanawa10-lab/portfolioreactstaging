// file: announcement4VertScrollPause.tsx

import React, { useEffect, useState, useRef } from "react";

interface VerticalSeamlessTickerProps {
  announcements: string[];
  height?: number;
  scrollDuration?: number; // ms for scroll
  pauseDuration?: number;  // ms to pause per message
}

const VerticalSeamlessTicker: React.FC<VerticalSeamlessTickerProps> = ({
  announcements,
  height = 40,
  scrollDuration = 500,
  pauseDuration = 4000,
}) => {
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Duplicate announcements for seamless looping
  const repeated = [...announcements, ...announcements];
  // const totalMessages = repeated.length;

  const indexRef = useRef(0);

  useEffect(() => {
    if (announcements.length === 0) return;

    const interval = setInterval(() => {
      setAnimate(true); // enable scroll animation
      indexRef.current += 1;
      setOffset(indexRef.current);

      // after animation scrollDuration, pause (freeze)
      setTimeout(() => {
        setAnimate(false);

        // if we reached the end of original array, reset instantly
        if (indexRef.current >= announcements.length) {
          indexRef.current = 0;
          setOffset(0);
        }
      }, scrollDuration);

    }, scrollDuration + pauseDuration);

    return () => clearInterval(interval);
  }, [announcements, scrollDuration, pauseDuration]);

  return (
    <div
      style={{
        height: `${height}px`,
        overflow: "hidden",
        width: "100%",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        fontWeight: 500,
      }}
    >
      <div
        style={{
          transform: `translateY(-${offset * height}px)`,
          transition: animate ? `transform ${scrollDuration}ms ease` : "none",
        }}
      >
        {repeated.map((msg, i) => (
          <div
            key={i}
            style={{
              height: `${height}px`,
              lineHeight: `${height}px`,
            }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalSeamlessTicker;
