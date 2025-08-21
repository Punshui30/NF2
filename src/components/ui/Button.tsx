import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseClasses = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700",
    secondary: "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20",
    ghost: "text-white hover:bg-white/10"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={disabled || loading ? undefined : onClick}
      whileHover={disabled || loading ? {} : { scale: 1.05 }}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
      disabled={disabled || loading}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : Icon ? (
          <Icon className="w-4 h-4" />
        ) : null}
        {children}
      </div>
    </motion.button>
  );
};
