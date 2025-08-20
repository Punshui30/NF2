import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.01;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create aurora effect
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `rgba(59, 130, 246, ${0.1 + Math.sin(time) * 0.05})`);
      gradient.addColorStop(0.3, `rgba(168, 85, 247, ${0.15 + Math.cos(time * 1.2) * 0.1})`);
      gradient.addColorStop(0.6, `rgba(34, 197, 94, ${0.1 + Math.sin(time * 0.8) * 0.05})`);
      gradient.addColorStop(1, `rgba(236, 72, 153, ${0.05 + Math.cos(time * 1.5) * 0.03})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add flowing waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const waveOffset = time + i * Math.PI / 3;
        const amplitude = (intensity === 'high' ? 100 : intensity === 'medium' ? 60 : 30);
        
        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height / 2 + Math.sin(x * 0.01 + waveOffset) * amplitude + 
                   Math.sin(x * 0.005 + waveOffset * 1.5) * amplitude * 0.5;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        const alpha = 0.1 - i * 0.02;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%)' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};