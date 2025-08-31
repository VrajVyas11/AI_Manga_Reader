import { useState, useEffect, useRef } from "react";

// Hook to detect if element is in viewport
const useInView = (threshold = 0.1) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // console.log('Observer created for element:', element);

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('Intersection change:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          time: Date.now()
        });
        
        setInView(entry.isIntersecting);
      },
      { threshold, rootMargin: '50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

export default useInView;