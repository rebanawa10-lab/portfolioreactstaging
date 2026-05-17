// file:    src/components/mnunReview/announcement5Vert.tsx


// remarks:   Announcement parameters  message, url

import React, { useEffect, useState, useRef } from "react";

interface Announcement {
  message: string;
  url?: string;
}

interface VerticalSeamlessTickerProps {
  announcements: Announcement[];
  height?: number;
  scrollDuration?: number;
  pauseDuration?: number;
}

/* 🔊 ADD SPEAKER ICON HERE */
const SpeakerIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ marginRight: "6px", verticalAlign: "middle" }}
  >
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
    <path d="M14.5 12c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.74 2.5-2.26 2.5-4.02z" />
  </svg>
);


const VerticalSeamlessTicker: React.FC<VerticalSeamlessTickerProps> = ({
  announcements,
  height = 16,  // 40
  scrollDuration = 500,
  pauseDuration = 4000,
}) => {
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const repeated = [...announcements, ...announcements];
 
  

  // VER1 Scrolling continue
  // useEffect(() => {
  //   if (announcements.length === 0) return;

  //   const interval = setInterval(() => {
  //     setAnimate(true);
  //     indexRef.current += 1;
  //     setOffset(indexRef.current);

  //     setTimeout(() => {
  //       setAnimate(false);
  //       if (indexRef.current >= announcements.length) {
  //         indexRef.current = 0;
  //         setOffset(0);
  //       }
  //     }, scrollDuration);

  //   }, scrollDuration + pauseDuration);

  //   return () => clearInterval(interval);
  // }, [announcements, scrollDuration, pauseDuration]);


  // VER2 Scrolling with pause onmouseover
  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startScrolling = () => {
    if (announcements.length === 0 || isPaused) return;

    intervalRef.current = setInterval(() => {
      setAnimate(true);
      indexRef.current += 1;
      setOffset(indexRef.current);

      timeoutRef.current = setTimeout(() => {
        setAnimate(false);

        if (indexRef.current >= announcements.length) {
          indexRef.current = 0;
          setOffset(0);
        }
      }, scrollDuration);

    }, scrollDuration + pauseDuration);
  };

   useEffect(() => {
    clearTimers();
    if (!isPaused) startScrolling();

    return () => clearTimers();
  }, [isPaused, announcements, scrollDuration, pauseDuration]);


  return (
    <div
      style={{
        height: `${height}px`,
        overflow: "hidden",
        width: "100%",
        fontFamily: "Arial",
        fontSize: "13px",
        fontWeight: 700,
        cursor: "pointer",
      }}
       onMouseEnter={() => {
        setIsPaused(true);
        clearTimers(); // 🔥 instant halt
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
       {/* fontFamily: "Arial, sans-serif", */}
      <div
        style={{
          transform: `translateY(-${offset * height}px)`,
          transition: animate ? `transform ${scrollDuration}ms ease` : "none",
        }}
      >
        {repeated.map((ann, i) => (
          <div
            key={i}
            style={{
              height: `${height}px`,
              lineHeight: `${height}px`,
            }}
          >
            {/* {ann.url ? (
              <a href={ann.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                🔊 {ann.message}
              </a>
            ) : (
              <>🔊 {ann.message}</>
            )} */}

              {ann.url ? (
                <a
                  href={ann.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <SpeakerIcon />
                  {ann.message}
                </a>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <SpeakerIcon />
                  {ann.message}
                </div>
              )}


          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalSeamlessTicker;