// file:   announcement1transition.tsx

import React, { useEffect, useState } from "react";
import "./announcement1transition.css" ;

interface AnnouncementRotatorProps {
  messages: string[];
  interval?: number; // time in ms for each message
}

const AnnouncementRotator: React.FC<AnnouncementRotatorProps> = ({
  messages,
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // start fade out
      setFade(false);

      // wait for fade-out before switching message
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setFade(true); // fade in new message
      }, 500); // match the CSS fade duration
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  return (
    <div className="announcement-rotator">
      <span className={`announcement-message ${fade ? "fade-in" : "fade-out"}`}>
        {messages[currentIndex]}
      </span>
    </div>
  );
};

export default AnnouncementRotator;
