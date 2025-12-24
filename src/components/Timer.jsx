// src/components/Timer.jsx
import React, { useEffect, useState } from "react";
import "./timer.css";

export default function Timer({ until, onExpire }) {
  const [remaining, setRemaining] = useState(
    until ? Math.max(0, until - Date.now()) : 0
  );

  useEffect(() => {
    if (!until) {
      setRemaining(0);
      return;
    }

    const tick = () => {
      const left = Math.max(0, until - Date.now());
      setRemaining(left);

      if (left <= 0 && onExpire) {
        onExpire();
      }
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [until, onExpire]);

  if (!until || remaining <= 0) return null;

  const minutes = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="timer-root">
      Upload disabled for: <span className="timer-time">{minutes}:{seconds}</span>
    </div>
  );
}