
import { useState, useEffect, useRef, useCallback } from "react";

// Singleton observer instance to reduce memory usage
let globalObserver = null;
const observedElements = new Map();

const createGlobalObserver = (threshold = 0.1) => {
  if (globalObserver) return globalObserver;
  
  globalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const callback = observedElements.get(entry.target);
        if (callback) {
          callback(entry.isIntersecting);
        }
      });
    },
    { 
      threshold, 
      rootMargin: '50px 0px',
      // Use passive observing for better performance
      passive: true
    }
  );
  
  return globalObserver;
};

const useInView = (threshold = 0.1) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  
  // Memoize the callback to prevent unnecessary re-renders
  const handleIntersection = useCallback((isIntersecting) => {
    setInView(isIntersecting);
  }, []);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = createGlobalObserver(threshold);
    
    // Store the callback for this element
    observedElements.set(element, handleIntersection);
    observer.observe(element);
    
    return () => {
      if (element && observer) {
        observer.unobserve(element);
        observedElements.delete(element);
        
        // Clean up global observer if no elements are being observed
        if (observedElements.size === 0) {
          observer.disconnect();
          globalObserver = null;
        }
      }
    };
  }, [threshold, handleIntersection]);

  return [ref, inView];
};

export default useInView;