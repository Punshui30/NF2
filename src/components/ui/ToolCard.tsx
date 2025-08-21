import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <motion.div
      className={`
        relative group cursor-pointer
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-md border border-white/20
        rounded-2xl p-6 h-48
        transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        hover:border-white/40
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : {
        y: -10,
        rotateX: 5,
        rotateY: 5,
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 group-hover:from-blue-400/40 group-hover:to-purple-400/40 transition-all duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-300 text-sm leading-relaxed flex-1">
          {description}
        </p>

        {/* Hover effect indicator */}
        <div className="mt-4 flex items-center text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-sm font-medium">Explore →</span>
        </div>
      </div>

      {/* 3D shadow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};
