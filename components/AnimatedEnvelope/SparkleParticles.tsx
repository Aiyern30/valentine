import React from "react";
import { motion } from "framer-motion";
interface SparkleParticlesProps {
  active: boolean;
}
export function SparkleParticles({ active }: SparkleParticlesProps) {
  if (!active) return null;
  // Generate random particles
  const particles = Array.from({
    length: 30,
  }).map((_, i) => {
    const angle = Math.random() * 360;
    const distance = 100 + Math.random() * 150;
    const size = 4 + Math.random() * 6;
    const delay = Math.random() * 0.2;
    const duration = 0.8 + Math.random() * 0.6;
    // Convert polar to cartesian for burst direction
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * distance;
    const y = Math.sin(rad) * distance;
    const colors = ["#ffd700", "#fff", "#e8a0b4", "#fcd34d"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      id: i,
      x,
      y,
      size,
      delay,
      duration,
      color,
    };
  });
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: Math.random() * 180,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            position: "absolute",
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
