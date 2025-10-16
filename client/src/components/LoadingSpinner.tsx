import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  style?: React.CSSProperties;
  className?: string;
}

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      loop: Infinity,
      ease: "linear",
      duration: 1,
    },
  },
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  tip,
  style,
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={style}>
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`${sizeClasses[size]} border-4 border-t-4 border-blue-500 border-t-transparent rounded-full`}
      />
      {tip && (
        <p className="mt-2 text-sm text-gray-600">{tip}</p>
      )}
    </div>
  );
};
