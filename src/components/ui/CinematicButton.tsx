import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CinematicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'aurora';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  soundEffect?: boolean;
}

export const CinematicButton: React.FC<CinematicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  loading = false,
  className = '',
  soundEffect = true
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const playClickSound = () => {
    // Disabled - only binaural beats should play
    return;
  };

  const handleClick = () => {
    if (disabled || loading) return;
    console.log('🎬 Cinematic button clicked!');
    playClickSound();
    onClick?.();
  };

  const baseClasses = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform-gpu";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-2xl hover:shadow-blue-500/25",
    secondary: "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-white/40",
    ghost: "text-white hover:bg-white/10 hover:backdrop-blur-md",
    aurora: "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-purple-500/30"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-xl"
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
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={disabled || loading ? {} : { 
        scale: 1.05,
        boxShadow: variant === 'primary' 
          ? "0 20px 40px -10px rgba(59, 130, 246, 0.4)"
          : "0 10px 30px -5px rgba(255, 255, 255, 0.2)"
      }}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
      animate={{
        rotateX: isPressed ? 5 : 0,
        rotateY: isPressed ? 2 : 0,
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      disabled={disabled || loading}
    >
      {/* Animated background layers */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: '-100%' }}
        animate={{ x: isPressed ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Particle burst effect */}
      {isPressed && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ opacity: 1, scale: 0 }}
              animate={{
                opacity: 0,
                scale: 1,
                x: (Math.cos((i * 30) * Math.PI / 180) * 50),
                y: (Math.sin((i * 30) * Math.PI / 180) * 50),
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="relative flex items-center gap-2 z-10">
        {loading ? (
          <motion.div 
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : Icon ? (
          <motion.div
            animate={{ 
              rotate: isPressed ? [0, -10, 10, 0] : 0,
              scale: isPressed ? [1, 0.9, 1.1, 1] : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        ) : null}
        
        <motion.span
          animate={{
            y: isPressed ? [0, -2, 0] : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0"
        style={{
          background: variant === 'aurora' 
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
        }}
        animate={{
          opacity: isPressed ? 0.6 : 0,
          scale: isPressed ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};