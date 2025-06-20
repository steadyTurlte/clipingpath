import React, { useRef, useEffect, useState, useCallback } from "react";

const Counter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const startCounting = useCallback(() => {
    let currentCount = 0;
    const interval = setInterval(() => {
      if (currentCount >= value) {
        clearInterval(interval);
      } else {
        currentCount++;
        setCount(currentCount);
      }
    }, 100);
  }, [value]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedCounting) {
          startCounting();
          setHasStartedCounting(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentObserverRef = observerRef.current;

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [startCounting, hasStartedCounting]);

  return (
    <span ref={observerRef}>
      <span>{count}</span>
    </span>
  );
};

export default Counter;
