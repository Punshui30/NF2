import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Tool3DCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  glowColor?: string;
}

export const Tool3DCard: React.FC<Tool3DCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  glowColor = 'blue'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glowColors = {
    blue: 'rgba(59, 130, 246, 0.4)',
    purple: 'rgba(168, 85, 247, 0.4)',
    green: 'rgba(34, 197, 94, 0.4)',
    pink: 'rgba(236, 72, 153, 0.4)',
    yellow: 'rgba(234, 179, 8, 0.4)'
  };

  return (
    <motion.div
      className={`
        relative group cursor-pointer perspective-1000
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && onClick) {
          console.log('Tool card clicked!');
          onClick();
        }
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.6 },
        y: { duration: 0.8 }
      }}
    >
      {/* Card container with 3D transform */}
      <motion.div
        className="
          relative w-full h-64 rounded-2xl overflow-hidden
          bg-gradient-to-br from-white/10 via-white/5 to-transparent
          backdrop-blur-xl border border-white/20
          shadow-2xl
        "
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          boxShadow: isHovered 
            ? `0 25px 50px -12px ${glowColors[glowColor as keyof typeof glowColors]}, 0 0 0 1px rgba(255,255,255,0.1)`
            : "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor as keyof typeof glowColors]}, transparent 70%)`
          }}
        />
        
        {/* Floating particles */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [-20, -40, -60]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
        
        {/* Content */}
        <div 
          className="relative z-10 h-full flex flex-col p-6"
          style={{
            transform: "translateZ(50px)",
          }}
        >
          {/* Icon container with 3D effect */}
          <motion.div 
            className="flex items-center mb-6"
            style={{
              transform: "translateZ(25px)",
            }}
            animate={{
              rotateY: isHovered ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
          >
            <div className={`
              p-4 rounded-xl backdrop-blur-md
              bg-gradient-to-br from-white/20 to-white/10
              border border-white/30
              shadow-lg
              group-hover:shadow-xl group-hover:scale-110
              transition-all duration-300
            `}>
              <Icon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h3 
            className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300"
            style={{
              transform: "translateZ(20px)",
            }}
          >
            {title}
          </motion.h3>
          
          {/* Description */}
          <motion.p 
            className="text-gray-300 text-sm leading-relaxed flex-1"
            style={{
              transform: "translateZ(15px)",
            }}
          >
            {description}
          </motion.p>
          
          {/* Hover indicator */}
          <motion.div 
            className="mt-6 flex items-center text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              transform: "translateZ(10px)",
            }}
            animate={{
              x: isHovered ? [0, 5, 0] : 0,
            }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          >
            <span className="text-sm font-medium">Explore</span>
            <motion.span 
              className="ml-2 text-lg"
              animate={{
                rotate: isHovered ? 360 : 0,
              }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
            >
              →
            </motion.span>
          </motion.div>
        </div>
        
        {/* Edge glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 bg-clip-border" />
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90" />
        </div>
      </motion.div>
      
      {/* 3D shadow */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-black/20 blur-xl"
        style={{
          transform: "translateZ(-50px) rotateX(90deg)",
          transformOrigin: "bottom",
        }}
        animate={{
          opacity: isHovered ? 0.4 : 0.2,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};