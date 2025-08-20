import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  isNorthStar: boolean;
  isActivated: boolean;
}

interface Constellation {
  stars: { x: number; y: number }[];
  connections: { from: number; to: number }[];
  name: string;
  activated: boolean;
}

interface AuroraGalaxyBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
  milestoneProgress?: number;
  onMilestoneComplete?: () => void;
  enableSpatialAudio?: boolean;
  audioMode?: 'landing' | 'onboarding' | 'dashboard';
}

export const AuroraGalaxyBackground: React.FC<AuroraGalaxyBackgroundProps> = ({
  className = '',
  intensity = 'high',
  children,
  milestoneProgress = 0,
  onMilestoneComplete,
  enableSpatialAudio = true,
  audioMode = 'landing'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [northStarGlow, setNorthStarGlow] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSoundsRef = useRef<{
    oscillators: OscillatorNode[];
    gainNodes: GainNode[];
  }>({ oscillators: [], gainNodes: [] });
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Clean up any existing audio
  const cleanupAudio = () => {
    if (currentSoundsRef.current) {
      currentSoundsRef.current.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Already stopped
        }
      });
      currentSoundsRef.current.gainNodes.forEach(gain => {
        try {
          gain.disconnect();
        } catch (e) {
          // Already disconnected
        }
      });
      currentSoundsRef.current = { oscillators: [], gainNodes: [] };
    }
    
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Already closed
      }
      audioContextRef.current = null;
    }
  };

  // Create soothing guitar-like tone
  const createSoothingTone = async (frequency: number, volume: number = 0.15) => {
    if (!audioContextRef.current) return null;
    
    const context = audioContextRef.current;
    
    // Create oscillator with triangle wave (smooth, guitar-like)
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    // Create gain node for volume control
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    
    // Create multiple filters for very smooth, warm sound
    const lowpass1 = context.createBiquadFilter();
    lowpass1.type = 'lowpass';
    lowpass1.frequency.setValueAtTime(1200, context.currentTime);
    lowpass1.Q.setValueAtTime(0.5, context.currentTime);
    
    const lowpass2 = context.createBiquadFilter();
    lowpass2.type = 'lowpass';
    lowpass2.frequency.setValueAtTime(800, context.currentTime);
    lowpass2.Q.setValueAtTime(0.3, context.currentTime);
    
    const highpass = context.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(100, context.currentTime);
    highpass.Q.setValueAtTime(0.2, context.currentTime);
    
    // Connect the audio chain
    oscillator.connect(lowpass1);
    lowpass1.connect(lowpass2);
    lowpass2.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Gentle fade in
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 2);
    
    // Start the oscillator
    oscillator.start();
    
    // Store references for cleanup
    currentSoundsRef.current.oscillators.push(oscillator);
    currentSoundsRef.current.gainNodes.push(gainNode);
    
    return { oscillator, gainNode };
  };

  // Create triangle ding sound
  const createTriangleDing = async (frequency: number = 523.25) => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    
    // Create triangle wave oscillator
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    // Create gain for envelope
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    
    // Create filter for warmth
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, context.currentTime);
    filter.Q.setValueAtTime(1, context.currentTime);
    
    // Connect audio chain
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Create bell-like envelope (quick attack, slow decay)
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);
    
    // Start and stop
    oscillator.start();
    oscillator.stop(context.currentTime + 1.5);
  };

  // Initialize audio system
  useEffect(() => {
    const initializeAudio = async () => {
      if (!enableSpatialAudio || audioInitialized) return;
      
      try {
        // Clean up any existing audio
        cleanupAudio();
        
        // Create new audio context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContext();
        audioContextRef.current = context;
        
        if (context.state === 'suspended') {
          await context.resume();
        }
        
        // Choose soothing frequency based on screen
        let frequency: number;
        let description: string;
        
        switch (audioMode) {
          case 'landing':
            frequency = 220.00; // A3 - Warm and welcoming
            description = 'A3 (220Hz) - Warm welcome tone';
            break;
          case 'onboarding':
            frequency = 174.61; // F3 - Very soothing
            description = 'F3 (174.61Hz) - Deep meditation tone';
            break;
          case 'dashboard':
            frequency = 261.63; // C4 - Clear and focused
            description = 'C4 (261.63Hz) - Focus enhancement tone';
            break;
          default:
            frequency = 220.00;
            description = 'Default soothing tone';
        }
        
        // Create the soothing tone
        await createSoothingTone(frequency, 0.12);
        
        console.log(`🎸 Soothing guitar tone started: ${description}`);
        console.log('🎵 Using triangle waves with multiple filters for warm, pleasant sound');
        
        setAudioInitialized(true);
      } catch (error) {
        console.error('🚫 Audio initialization failed:', error);
      }
    };
    
    // Start audio on user interaction
    const handleUserInteraction = () => {
      if (!audioInitialized) {
        initializeAudio();
      }
    };
    
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [enableSpatialAudio, audioMode]);

  // Handle milestone celebrations with triangle ding
  useEffect(() => {
    if (milestoneProgress > 0 && milestoneProgress % 25 === 0 && audioInitialized) {
      // Play pleasant triangle ding
      createTriangleDing(523.25); // C5 note
      
      setTimeout(() => {
        createTriangleDing(659.25); // E5 note
      }, 300);
    }
  }, [milestoneProgress, audioInitialized]);

  // Cleanup on unmount or mode change
  useEffect(() => {
    return () => {
      cleanupAudio();
      console.log('🎸 Audio cleanup completed');
    };
  }, [audioMode]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  // Generate stars and constellations
  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = intensity === 'high' ? 200 : intensity === 'medium' ? 150 : 100;
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          brightness: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          isNorthStar: i === 0, // First star is North Star
          isActivated: false
        });
      }
      
      setStars(newStars);
    };

    const generateConstellations = () => {
      const newConstellations: Constellation[] = [
        {
          name: 'Decision Path',
          stars: [
            { x: 0.2, y: 0.3 }, { x: 0.25, y: 0.25 }, { x: 0.3, y: 0.35 }, { x: 0.35, y: 0.3 }
          ],
          connections: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
          activated: false
        },
        {
          name: 'Career Compass',
          stars: [
            { x: 0.7, y: 0.2 }, { x: 0.75, y: 0.15 }, { x: 0.8, y: 0.25 }, { x: 0.75, y: 0.3 }
          ],
          connections: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }],
          activated: false
        },
        {
          name: 'Life Navigator',
          stars: [
            { x: 0.5, y: 0.7 }, { x: 0.45, y: 0.65 }, { x: 0.55, y: 0.65 }, { x: 0.5, y: 0.6 }
          ],
          connections: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 }],
          activated: false
        }
      ];
      
      setConstellations(newConstellations);
    };

    generateStars();
    generateConstellations();
    
    const handleResize = () => {
      generateStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [intensity]);

  // Handle milestone progress
  useEffect(() => {
    if (milestoneProgress > 0 && milestoneProgress % 25 === 0) {
      setNorthStarGlow(true);
      
      // Activate constellation based on progress
      const constellationIndex = Math.floor(milestoneProgress / 25) - 1;
      if (constellationIndex < constellations.length) {
        setConstellations(prev => prev.map((constellation, index) => 
          index === constellationIndex 
            ? { ...constellation, activated: true }
            : constellation
        ));
        
      }
      
      setTimeout(() => {
        setNorthStarGlow(false);
        onMilestoneComplete?.();
      }, 2000);
    }
  }, [milestoneProgress, constellations.length, onMilestoneComplete]);

  // Canvas animation
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
      
      // Draw aurora layers
      const auroraLayers = [
        { color: 'rgba(59, 130, 246, 0.15)', offset: 0, amplitude: 80 },
        { color: 'rgba(168, 85, 247, 0.12)', offset: Math.PI / 3, amplitude: 60 },
        { color: 'rgba(34, 197, 94, 0.1)', offset: Math.PI * 2 / 3, amplitude: 100 },
        { color: 'rgba(236, 72, 153, 0.08)', offset: Math.PI, amplitude: 70 }
      ];

      auroraLayers.forEach((layer, index) => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, layer.color);
        
        // Extract RGB values from the layer color and create new RGBA with dynamic alpha
        const rgbMatch = layer.color.match(/\d+/g);
        const dynamicAlpha = 0.05 + Math.sin(time + layer.offset) * 0.03;
        const dynamicColor = rgbMatch && rgbMatch.length >= 3 
          ? `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${dynamicAlpha})`
          : layer.color;
        
        gradient.addColorStop(0.5, dynamicColor);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw flowing aurora waves
        ctx.beginPath();
        const waveOffset = time + layer.offset;
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height / 2 + 
                   Math.sin(x * 0.005 + waveOffset) * layer.amplitude +
                   Math.sin(x * 0.002 + waveOffset * 1.5) * layer.amplitude * 0.5 +
                   Math.sin(x * 0.008 + waveOffset * 0.8) * layer.amplitude * 0.3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.strokeStyle = layer.color.replace(/0\.\d+/, '0.2');
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw stars with twinkling
      stars.forEach((star, index) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 100) * 0.5 + 0.5;
        const alpha = star.brightness * twinkle;
        
        if (star.isNorthStar && northStarGlow) {
          // North Star glow effect
          const glowSize = star.size * 8;
          const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
          glowGradient.addColorStop(0, `rgba(255, 215, 0, ${alpha * 0.8})`);
          glowGradient.addColorStop(0.5, `rgba(255, 215, 0, ${alpha * 0.4})`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw star
        ctx.fillStyle = star.isNorthStar 
          ? `rgba(255, 215, 0, ${alpha})` 
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Star sparkle effect
        if (twinkle > 0.8) {
          ctx.strokeStyle = star.isNorthStar 
            ? `rgba(255, 215, 0, ${alpha * 0.5})` 
            : `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 2, star.y);
          ctx.lineTo(star.x + star.size * 2, star.y);
          ctx.moveTo(star.x, star.y - star.size * 2);
          ctx.lineTo(star.x, star.y + star.size * 2);
          ctx.stroke();
        }
      });

      // Draw constellations
      constellations.forEach(constellation => {
        if (!constellation.activated) return;
        
        const constellationAlpha = 0.6;
        
        // Draw constellation connections
        ctx.strokeStyle = `rgba(100, 200, 255, ${constellationAlpha})`;
        ctx.lineWidth = 2;
        
        constellation.connections.forEach(connection => {
          const fromStar = constellation.stars[connection.from];
          const toStar = constellation.stars[connection.to];
          
          ctx.beginPath();
          ctx.moveTo(fromStar.x * canvas.width, fromStar.y * canvas.height);
          ctx.lineTo(toStar.x * canvas.width, toStar.y * canvas.height);
          ctx.stroke();
        });
        
        // Draw constellation stars
        constellation.stars.forEach(star => {
          ctx.fillStyle = `rgba(100, 200, 255, ${constellationAlpha})`;
          ctx.beginPath();
          ctx.arc(star.x * canvas.width, star.y * canvas.height, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [stars, constellations, northStarGlow, intensity]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ 
          background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0f0f23 70%, #000000 100%)' 
        }}
      />
      
      {/* Particle overlay for depth */}
      <div className="absolute inset-0 z-5">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* North Star milestone celebration */}
      {northStarGlow && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="text-6xl text-yellow-300 font-bold"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              ⭐
            </motion.div>
            <motion.div
              className="text-white text-xl font-semibold mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Milestone Achieved!
            </motion.div>
          </div>
        </motion.div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};