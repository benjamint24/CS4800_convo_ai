import { useEffect, useRef } from "react";
import "./VoiceOrb.css";

const LABELS = {
  idle: "Press and hold to speak",
  listening: "Listening...",
  transcribing: "Transcribing...",
  thinking: "Thinking...",
  speaking: "Speaking...",
};

const COLORS = {
  idle: {
    primary: [249, 115, 22],
    secondary: [59, 130, 246],
  },
  listening: {
    primary: [59, 130, 246],
    secondary: [96, 165, 250],
  },
  transcribing: {
    primary: [234, 179, 8],
    secondary: [251, 191, 36],
  },
  thinking: {
    primary: [168, 85, 247],
    secondary: [139, 92, 246],
  },
  speaking: {
    primary: [16, 185, 129],
    secondary: [34, 197, 94],
  },
};

export default function VoiceOrb({
  state = "idle",
  audioLevel = 0,
  onClick,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    const dpr = window.devicePixelRatio || 1;
    const size = 180;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    context.scale(dpr, dpr);

    const center = size / 2;
    const baseRadius = 44;

    if (particlesRef.current.length === 0) {
      for (let index = 0; index < 24; index += 1) {
        particlesRef.current.push({
          angle: Math.random() * Math.PI * 2,
          radius: baseRadius + Math.random() * 28,
          speed: 0.002 + Math.random() * 0.01,
          size: 1 + Math.random() * 1.8,
          opacity: 0.15 + Math.random() * 0.45,
          offset: Math.random() * Math.PI * 2,
        });
      }
    }

    const drawFrame = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;
      const palette = COLORS[state] || COLORS.idle;
      const level = Math.min(audioLevel * 2.5, 1);

      context.clearRect(0, 0, size, size);

      const glowRadius = baseRadius + 16 + level * 24;
      const glowGradient = context.createRadialGradient(center, center, baseRadius * 0.4, center, center, glowRadius + 10);
      glowGradient.addColorStop(0, `rgba(${palette.primary.join(",")}, ${0.16 + level * 0.18})`);
      glowGradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glowGradient;
      context.fillRect(0, 0, size, size);

      if (state !== "idle") {
        for (let index = 0; index < 3; index += 1) {
          const ripplePhase = (time * 0.8 + index * 0.9) % (Math.PI * 2);
          const rippleProgress = ripplePhase / (Math.PI * 2);
          const rippleRadius = baseRadius + rippleProgress * 30 + level * 12;
          const rippleOpacity = (1 - rippleProgress) * (0.16 + level * 0.18);

          context.beginPath();
          context.arc(center, center, rippleRadius, 0, Math.PI * 2);
          context.strokeStyle = `rgba(${palette.primary.join(",")}, ${rippleOpacity})`;
          context.lineWidth = 1.5;
          context.stroke();
        }
      }

      context.beginPath();

      const pointCount = 72;
      for (let index = 0; index <= pointCount; index += 1) {
        const angle = (index / pointCount) * Math.PI * 2;
        const wave1 = Math.sin(angle * 3 + time * 2) * (2 + level * 10);
        const wave2 = Math.sin(angle * 5 - time * 1.4) * (1.5 + level * 7);
        const wave3 = Math.cos(angle * 2 - time * 0.7) * (1 + level * 4);
        const breathe = Math.sin(time * 1.1) * 2.5;
        const radius = baseRadius + breathe + wave1 + wave2 + wave3;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;

        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.closePath();

      const orbGradient = context.createRadialGradient(center - 12, center - 12, 4, center, center, baseRadius + 8);
      orbGradient.addColorStop(0, `rgba(${palette.secondary.join(",")}, 0.96)`);
      orbGradient.addColorStop(0.5, `rgba(${palette.primary.join(",")}, 0.9)`);
      orbGradient.addColorStop(1, `rgba(${palette.primary.map((value) => Math.max(0, value - 38)).join(",")}, 0.75)`);
      context.fillStyle = orbGradient;
      context.fill();

      const highlightGradient = context.createRadialGradient(center - 18, center - 20, 2, center, center, baseRadius);
      highlightGradient.addColorStop(0, "rgba(255,255,255,0.35)");
      highlightGradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = highlightGradient;
      context.fill();

      particlesRef.current.forEach((particle) => {
        particle.angle += particle.speed * (1 + level * 3);
        const radius = particle.radius + Math.sin(time * 2 + particle.offset) * 6 + level * 12;
        const x = center + Math.cos(particle.angle) * radius;
        const y = center + Math.sin(particle.angle) * radius;

        context.beginPath();
        context.arc(x, y, particle.size * (1 + level * 0.4), 0, Math.PI * 2);
        context.fillStyle = `rgba(${palette.primary.join(",")}, ${particle.opacity * (state === "idle" ? 0.3 : 0.65)})`;
        context.fill();
      });

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, audioLevel]);

  return (
    <button
      type="button"
      className={`voice-orb voice-orb--${state}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseLeave={state === "listening" ? onMouseUp : undefined}
      aria-label={LABELS[state] || "Voice orb"}
    >
      <canvas ref={canvasRef} className="voice-orb__canvas" />
      <span className="voice-orb__label">{LABELS[state] || ""}</span>
    </button>
  );
}
