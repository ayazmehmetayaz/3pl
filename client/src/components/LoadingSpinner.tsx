import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  style?: React.CSSProperties;
  className?: string;
  variant?: 'default' | 'gradient' | 'dots' | 'pulse';
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

const dotVariants = {
  animate: {
    scale: [1, 1.5, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  tip,
  style,
  className = '',
  variant = 'default',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'gradient':
        return (
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className={`${sizeClasses[size]} border-4 border-t-4 border-transparent border-t-blue-500 rounded-full relative`}
            style={{
              background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
            }}
          />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                variants={dotVariants}
                animate="animate"
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg`}
          />
        );
      
      default:
        return (
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className={`${sizeClasses[size]} border-4 border-t-4 border-blue-500 border-t-transparent rounded-full shadow-lg`}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={style}>
      {renderSpinner()}
      {tip && (
        <motion.p 
          className="mt-4 text-sm text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tip}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
