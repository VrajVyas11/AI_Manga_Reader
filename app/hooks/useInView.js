import React, { useState, useEffect, useRef, useCallback } from "react";

// Hook to detect if element is in viewport
const useInView = (threshold = 0.1) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  // Reset inView state when ref changes (useful for pagination)
  const resetInView = useCallback(() => {
    setInView(false);
  }, []);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [threshold]); // Remove unstable dependencies

  return [ref, inView, resetInView];
};

export default useInView;