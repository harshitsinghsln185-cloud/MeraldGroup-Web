import React from 'react';
import { motion } from 'framer-motion';

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 24,
  once = true,
  className = '',
}) => {
  let initialX = 0;
  let initialY = 0;

  if (direction === 'up') initialY = distance;
  else if (direction === 'down') initialY = -distance;
  else if (direction === 'left') initialX = distance;
  else if (direction === 'right') initialX = -distance;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
