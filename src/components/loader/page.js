'use client';

import { motion } from 'framer-motion';

export default function Loader() {
  // Animated color dots
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex space-x-3">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.p
        className="absolute mt-16 text-primary text-sm font-medium"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );
}