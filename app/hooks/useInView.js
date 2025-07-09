import React, { useState, useEffect, useRef } from "react";

// Hook to detect if element is in viewport
const useInView = (options) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return [ref, inView];
};

export default useInView