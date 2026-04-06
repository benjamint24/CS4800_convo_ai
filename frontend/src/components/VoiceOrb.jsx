import { useRef, useEffect } from 'react';
import './VoiceOrb.css';

/**
 * VoiceOrb — A dynamic animated orb that visualizes voice activity.
 * 
 * Props:
 *  - state: 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking'
 *  - audioLevel: 0-1 number representing current audio amplitude
 *  - onClick: callback when orb is clicked
 *  - onMouseDown: callback for press-and-hold recording
 *  - onMouseUp: callback for release-to-stop recording
 */
export default function VoiceOrb({ state = 'idle', audioLevel = 0, onClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  // Color palettes for each state
  const getColors = (state) => {
    switch (state) {
      case 'listening':
        return {
          primary: [64, 180, 255],    // Bright blue
          secondary: [100, 220, 255], // Light cyan
          glow: 'rgba(64, 180, 255, 0.4)',
          bg: 'rgba(64, 180, 255, 0.08)'
        };
      case 'transcribing':
        return {
          primary: [255, 200, 60],    // Golden yellow
          secondary: [255, 160, 40],  // Orange
          glow: 'rgba(255, 200, 60, 0.4)',
          bg: 'rgba(255, 200, 60, 0.08)'
        };
      case 'thinking':
        return {
          primary: [180, 120, 255],   // Purple
          secondary: [140, 80, 255],  // Deep purple
          glow: 'rgba(180, 120, 255, 0.4)',
          bg: 'rgba(180, 120, 255, 0.08)'
        };
      case 'speaking':
        return {
          primary: [80, 220, 140],    // Emerald green
          secondary: [40, 200, 160],  // Teal
          glow: 'rgba(80, 220, 140, 0.4)',
          bg: 'rgba(80, 220, 140, 0.08)'
        };
      default: // idle
        return {
          primary: [140, 140, 180],   // Soft lavender gray
          secondary: [100, 100, 150], // Muted blue-gray
          glow: 'rgba(140, 140, 180, 0.2)',
          bg: 'rgba(140, 140, 180, 0.05)'
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 240;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = 60;

    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          angle: Math.random() * Math.PI * 2,
          radius: baseRadius + Math.random() * 40,
          speed: 0.002 + Math.random() * 0.008,
          size: 1 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.5,
          offset: Math.random() * Math.PI * 2
        });
      }
    }

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const colors = getColors(state);
      const level = Math.min(audioLevel * 2.5, 1); // Amplify sensitivity

      ctx.clearRect(0, 0, size, size);

      // --- Outer glow ring ---
      const glowRadius = baseRadius + 20 + level * 30;
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, baseRadius * 0.5,
        centerX, centerY, glowRadius + 10
      );
      glowGradient.addColorStop(0, `rgba(${colors.primary.join(',')}, ${0.15 + level * 0.2})`);
      glowGradient.addColorStop(0.5, `rgba(${colors.primary.join(',')}, ${0.05 + level * 0.1})`);
      glowGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, size, size);

      // --- Ripple rings (when active) ---
      if (state !== 'idle') {
        const rippleCount = 3;
        for (let i = 0; i < rippleCount; i++) {
          const ripplePhase = (t * 0.8 + i * (Math.PI * 2 / rippleCount)) % (Math.PI * 2);
          const rippleProgress = ripplePhase / (Math.PI * 2);
          const rippleRadius = baseRadius + rippleProgress * 40 + level * 20;
          const rippleOpacity = (1 - rippleProgress) * (0.15 + level * 0.2);

          ctx.beginPath();
          ctx.arc(centerX, centerY, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${colors.primary.join(',')}, ${rippleOpacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // --- Main orb with organic deformation ---
      const numPoints = 128;
      ctx.beginPath();

      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;

        // Multiple sine waves for organic shape
        const wave1 = Math.sin(angle * 3 + t * 2) * (3 + level * 15);
        const wave2 = Math.sin(angle * 5 - t * 1.5) * (2 + level * 10);
        const wave3 = Math.sin(angle * 7 + t * 3) * (1 + level * 8);
        const wave4 = Math.cos(angle * 2 - t * 0.7) * (2 + level * 5);

        // Base breathing animation
        const breathe = Math.sin(t * 1.2) * 3;

        const r = baseRadius + breathe + wave1 + wave2 + wave3 + wave4;

        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();

      // Gradient fill
      const orbGradient = ctx.createRadialGradient(
        centerX - 15, centerY - 15, 5,
        centerX, centerY, baseRadius + 10
      );
      orbGradient.addColorStop(0, `rgba(${colors.secondary.join(',')}, 0.95)`);
      orbGradient.addColorStop(0.5, `rgba(${colors.primary.join(',')}, 0.85)`);
      orbGradient.addColorStop(1, `rgba(${colors.primary.map(c => Math.max(0, c - 40)).join(',')}, 0.7)`);
      ctx.fillStyle = orbGradient;
      ctx.fill();

      // Inner glow highlight
      const highlightGradient = ctx.createRadialGradient(
        centerX - 20, centerY - 25, 2,
        centerX, centerY, baseRadius
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      highlightGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill();

      // --- Floating particles ---
      particlesRef.current.forEach((p, idx) => {
        p.angle += p.speed * (1 + level * 3);
        const pRadius = p.radius + Math.sin(t * 2 + p.offset) * 10 + level * 20;
        const px = centerX + Math.cos(p.angle) * pRadius;
        const py = centerY + Math.sin(p.angle) * pRadius;

        const pOpacity = p.opacity * (state === 'idle' ? 0.3 : (0.5 + level * 0.5));
        const [r, g, b] = colors.primary;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (1 + level * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pOpacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state, audioLevel]);

  const stateLabel = {
    idle: 'Tap to speak',
    listening: 'Listening...',
    transcribing: 'Transcribing...',
    thinking: 'Thinking...',
    speaking: 'Speaking...'
  };

  return (
    <div className={`voice-orb-container voice-orb--${state}`}>
      <canvas
        ref={canvasRef}
        className="voice-orb-canvas"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseLeave={state === 'listening' ? onMouseUp : undefined}
      />
      <span className="voice-orb-label">{stateLabel[state] || ''}</span>
    </div>
  );
}
