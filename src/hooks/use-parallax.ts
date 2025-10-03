
import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxOptions {
  direction?: 'up' | 'down' | 'left' | 'right';
  speed?: number;
  offset?: ["start end", "end start"]; // Updated to use literal string type
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const {
    direction = 'up',
    speed = 50,
    offset = ["start end", "end start"],
  } = options;
  
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  // Determine transform properties based on direction
  let x: MotionValue | null = null;
  let y: MotionValue | null = null;
  
  switch (direction) {
    case 'up':
      y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
      break;
    case 'down':
      y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
      break;
    case 'left':
      x = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
      break;
    case 'right':
      x = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
      break;
  }
  
  return { ref, x, y, scrollYProgress };
};
