import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LoadingScreenProps {
  isLoading: boolean;
  tagline?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  tagline = 'Engineering Excellence, Global Infrastructure',
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="merald-splash"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy-900 px-4 text-center"
        >
          {/* Merald Logo & Text Branding */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center"
          >
            {/* Same Logo Image as Header & Footer */}
            <img
              src="/logo.webp"
              alt="Merald Group"
              className="h-16 sm:h-20 w-auto object-contain mb-4 drop-shadow-xl"
            />

            {/* Merald Script Wordmark */}
            <h1 className="font-logo text-5xl md:text-6xl text-mint-400 tracking-wide font-normal mb-2 drop-shadow">
              Merald
            </h1>
            
            <span className="font-heading text-xs uppercase tracking-[0.3em] text-white/70 font-semibold mb-6">
              Group
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-body text-sm md:text-base text-mint-100/90 font-medium max-w-md mb-8"
          >
            {tagline}
          </motion.p>

          {/* Animated Brand Gradient Loading Bar */}
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: 'easeInOut',
              }}
              className="absolute top-0 bottom-0 left-0 w-full rounded-full bg-gradient-to-r from-blue-600 via-teal-500 to-mint-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
